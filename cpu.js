const CPU_CLOSE_SHOT_DEFENSE = {
  throwerDistance: 430,
  ballDistance: 380,
  urgentDistance: 190,
  urgentDistancePerSpeed: 28,
  baseDodgeChance: 0.52,
  dodgeChancePerSpeed: 0.055,
  targetedBonus: 0.08,
  panicBonus: 0.08,
  maxDodgeChance: 0.97,
  baseSuccessChance: 0.58,
  successChancePerSpeed: 0.06,
  maxSuccessChance: 0.94
};

const CPU_COUNTER_CATCH = {
  baseTechnique: 7,
  baseChance: 0.7,
  chancePerTechnique: 0.04,
  minChance: 0.38,
  maxChance: 0.9
};

const CPU_CATCH_TUNING = {
  globalScale: 0.75,
  counterScale: 5.46,
  counterAttemptScale: 1.15,
  counterChainAttemptScale: 1.25,
  counterCatchCap: 0.93,
  delayMin: 0.02,
  delayMax: 0.07
};

const CPU_NORMAL_CATCH = {
  baseTechnique: 7,
  frontChance: 0.85,
  strongChance: 0.725,
  closeChance: 0.6,
  sideChance: 0.25,
  chancePerTechnique: 0.025,
  minChance: 0.08,
  maxChance: 0.95
};

const CPU_ONE_ON_ONE_DEFENSE = {
  reactDistanceScale: 1.35,
  catchDelayAdvance: 0.08,
  normalFrontCatchScale: 1.25,
  counterCatchScale: 1.5,
  counterCatchDistanceScale: 1.18,
  specialDodgeScale: 1.35,
  fastDodgeScale: 1.25,
  fastShotSpeed: 1000
};

const CPU_ONE_ON_ONE_ATTACK = {
  midBackNormalShotRate: 0.6,
  midBackMinProgress: 0.28,
  midBackMaxProgress: 0.55
};

const CPU_POST_SHOT_DEFENSE = {
  durationMs: 3200,
  dashDurationMs: 2500,
  retreatDepthRatio: 0.67,
  dashStartDepthRatio: 0.56,
  arrivalDistance: 40
};

const CPU_DUEL_DEFENSE = {
  retreatDepthRatio: 0.86,
  arrivalDistance: 44,
  dashDurationMs: 2500
};

const CPU_ATTACK_TACTIC_WEIGHTS = {
  buildUp: 0.45,
  quickAttack: 3,
  sideOverload: 1,
  trianglePass: 0.45,
  oneTwo: 1,
  sideChange: 1,
  outfieldRelay: 0.35,
  decoyAce: 1,
  closeAttack: 2.2,
  tempoChange: 1,
  shotFeint: 1
};

const CPU_MARTIAL_ARTIST_AERIAL_PASS_CUT = {
  minBallZ: 112,
  maxGroundDistance: 430,
  jumpDistance: 240,
  catchHandDistance: 104,
  catchBodyDistance: 165,
  baseChance: 0.11,
  jumpChanceBonus: 0.006,
  techniqueChanceBonus: 0.004,
  maxChance: 0.16,
  devilTriangleScale: 0.25,
  leadTime: 0.14
};

const CPU_GROUNDED_SPECIAL_SHOTS = new Set([
  "ufoSpin",
  "clockStop",
  "lockRocket",
  "boost",
  "boomerang",
  "devilShield",
  "arcanaSphere",
  "hellfire",
  "bloodDrain",
  "shiningArrow"
]);

const CPU_BACKLINE_SPECIAL_SHOTS = new Set([
  "arcanaSphere",
  "boost"
]);

const CPU_SPECIAL_ATTACK_FORCE_DELAY = 3;

class CPUController {
  constructor(team, opponents, ball, config) {
    this.team = team;
    this.opponents = opponents;
    this.ball = ball;
    this.config = config;
    this.teamName = config.teamName || team[0]?.team || "right";
    this.opponentName = config.opponentName || opponents[0]?.team || "left";
    this.commands = new Map();
    this.decisionTimer = 0;
    this.throwTimer = 0.35;
    this.reactionTimer = this.randomReaction();
    this.holderPlan = null;
    this.currentHolderId = null;
    this.evasionPlans = new Map();
    this.passCutAssignment = null;
    this.passReceiverPrediction = null;
    this.attackTactic = null;
    this.lastTacticType = null;
    this.tacticSerial = 0;
    this.specialAttackState = null;
    this.spiritReadySince = 0;
    this.catchDelayPlans = new Map();
    this.paladinCoverRolls = new Map();
    this.martialArtistAerialPassCutRolls = new Map();
    this.postShotRetreats = new Map();
    this.friendlyShotInFlight = false;
    this.duelDefenseDashUntil = new Map();
  }

  update(delta) {
    this.decisionTimer -= delta;
    this.throwTimer -= delta;
    this.updateSpecialAttackTimer();

    for (const member of this.team) {
      if (!this.commands.has(member.id)) {
        this.commands.set(member.id, this.createEmptyCommand());
      }
      const command = this.commands.get(member.id);
      command.catch = false;
      command.crouch = false;
      command.jump = false;
      command.shoot = false;
      command.pass = false;
      command.chargeShoot = false;
      command.reflect = false;
      command.lockFacing = false;
      command.faceDirection = null;
      command.chargeTime = 0;
      command.chargeReleaseMode = "time";
    }

    this.detectFriendlyShotRelease();

    if (this.decisionTimer <= 0) {
      this.makeDecision();
      this.decisionTimer = 0.07 + Math.random() * 0.06;
    }

    this.reactToIncomingBall(delta);
    this.reactToFriendlyBall();
    this.reactToEnemyPass();
  }

  makeDecision() {
    const holder = this.ball.owner;
    const cpuHolder = holder && holder.team === this.teamName ? holder : null;
    const looseBallChaser = this.getLooseBallChaser();
    const friendlyShotChaser = looseBallChaser ? null : this.getFriendlyFlyingShotChaser();
    const specialAttackReady = Boolean(this.config.isSpiritReady?.(this.teamName));
    if (cpuHolder) {
      this.duelDefenseDashUntil.clear();
    }
    if (cpuHolder && !specialAttackReady && (!this.attackTactic || this.attackTactic.finished)) {
      this.selectAttackTactic(cpuHolder);
    }
    if (cpuHolder && this.currentHolderId !== cpuHolder.id) {
      this.currentHolderId = cpuHolder.id;
      this.holderPlan = null;
      if ((cpuHolder.cpuForceDevilTriangleShotUntil || 0) > Date.now()) {
        this.throwTimer = Math.min(this.throwTimer, 0.03);
      } else {
        this.throwTimer = this.isRobotOverdrive(cpuHolder)
        ? 0.22 + Math.random() * 0.16
        : this.shouldUseTacticalQuickShot(cpuHolder)
        ? 0.04 + Math.random() * 0.05
        : cpuHolder.aerialPassCatchTimer > 0 && cpuHolder.jumpZ > 0
        ? Math.min(this.throwTimer, 0.08 + Math.random() * 0.08)
        : Math.max(this.throwTimer, 0.85 + Math.random() * 0.45);
      }
    } else if (!cpuHolder) {
      this.currentHolderId = null;
      this.holderPlan = null;
    }

    for (const member of this.team) {
      const command = this.commands.get(member.id);
      if (member.defeated) {
        this.stop(command);
        continue;
      }

      if (cpuHolder === member) {
        this.controlHolder(command, member);
        continue;
      }

      if (looseBallChaser === member) {
        this.duelDefenseDashUntil.delete(member.id);
        this.moveToward(command, member, this.ball.x, this.ball.y);
        command.dash = true;
        if (Math.hypot(this.ball.x - member.x, this.ball.y - member.y) < 240) {
          command.catch = true;
        }
        continue;
      }

      if (this.config.useDuelDefense && !cpuHolder && member.role === "inner") {
        this.controlDuelDefensePosition(command, member);
        continue;
      }

      if (friendlyShotChaser === member) {
        this.moveToward(command, member, this.ball.x, this.ball.y);
        command.dash = true;
        if (Math.hypot(this.ball.x - member.x, this.ball.y - member.y) < 260) {
          command.catch = true;
        }
        continue;
      }

      if (this.applyPostShotRetreat(command, member)) {
        continue;
      }

      if (this.controlArkmaGuard(command, member)) {
        continue;
      }

      if (this.controlBravesPaladinGuard(command, member)) {
        continue;
      }

      if (this.ball.owner && this.ball.owner.team === this.opponentName && member.role === "inner") {
        this.controlWithoutBall(command, member, this.ball.owner);
        continue;
      }

      if (cpuHolder) {
        this.controlOffBallAttack(command, member, cpuHolder);
        continue;
      }

      this.moveToHome(command, member);
    }
  }

  detectFriendlyShotRelease() {
    const friendlyShotFlying = Boolean(
      this.ball.isFlying &&
      this.ball.kind === "shoot" &&
      this.ball.thrower &&
      this.ball.thrower.team === this.teamName
    );

    if (friendlyShotFlying && !this.friendlyShotInFlight) {
      this.startPostShotRetreat(this.ball.thrower);
    }
    this.friendlyShotInFlight = friendlyShotFlying;
  }

  startPostShotRetreat(shooter) {
    if (!this.config.usePostShotRetreat || !shooter || shooter.defeated || shooter.role !== "inner") return;

    const area = this.config.areas?.[shooter.zone];
    const bounds = this.getAreaBounds(area);
    if (!bounds.w || !bounds.h) return;

    const centerX = this.config.court.centerX;
    const backX = shooter.team === "left"
      ? bounds.x + shooter.radius + 44
      : bounds.x + bounds.w - shooter.radius - 44;
    const retreatX = centerX + (backX - centerX) * CPU_POST_SHOT_DEFENSE.retreatDepthRatio;
    const alreadyDeep = shooter.team === "left" ? shooter.x <= retreatX : shooter.x >= retreatX;
    const target = this.clampPointToArea({
      x: alreadyDeep ? shooter.x : retreatX,
      y: shooter.y
    }, area, shooter.radius);
    const fullDepth = Math.max(1, Math.abs(backX - centerX));
    const currentDepthRatio = Math.abs(shooter.x - centerX) / fullDepth;
    const now = Date.now();

    this.postShotRetreats.set(shooter.id, {
      target,
      expiresAt: now + CPU_POST_SHOT_DEFENSE.durationMs,
      dashUntil: currentDepthRatio < CPU_POST_SHOT_DEFENSE.dashStartDepthRatio
        ? now + CPU_POST_SHOT_DEFENSE.dashDurationMs
        : now
    });
    this.decisionTimer = 0;
  }

  applyPostShotRetreat(command, member) {
    const plan = this.postShotRetreats.get(member.id);
    if (!plan) return false;

    const now = Date.now();
    const ownTeamHasBall = this.ball.owner?.team === this.teamName;
    const looseBall = this.ball.isLoose && !this.ball.isFlying && !this.ball.owner;
    if (member.defeated || now >= plan.expiresAt || ownTeamHasBall || looseBall) {
      this.postShotRetreats.delete(member.id);
      return false;
    }

    const distance = Math.hypot(plan.target.x - member.x, plan.target.y - member.y);
    if (distance > CPU_POST_SHOT_DEFENSE.arrivalDistance) {
      this.moveToward(command, member, plan.target.x, plan.target.y);
      command.dash = now < plan.dashUntil && distance > 90;
    } else {
      this.stop(command);
    }

    command.lockFacing = true;
    command.faceDirection = member.team === "left" ? "right" : "left";
    return true;
  }

  controlDuelDefensePosition(command, member) {
    const area = this.config.areas?.[member.zone];
    const bounds = this.getAreaBounds(area);
    if (!bounds.w || !bounds.h) {
      this.moveToHome(command, member);
      return;
    }

    const centerX = this.config.court.centerX;
    const backX = member.team === "left"
      ? bounds.x + member.radius + 44
      : bounds.x + bounds.w - member.radius - 44;
    const target = this.clampPointToArea({
      x: centerX + (backX - centerX) * CPU_DUEL_DEFENSE.retreatDepthRatio,
      y: member.homeY
    }, area, member.radius);
    const distance = Math.hypot(target.x - member.x, target.y - member.y);
    const now = Date.now();
    const opponentHolder = this.ball.owner?.team === this.opponentName ? this.ball.owner : null;
    const opponentPreparingShot = this.isHolderPreparingShot(opponentHolder);
    if (!this.duelDefenseDashUntil.has(member.id)) {
      this.duelDefenseDashUntil.set(member.id, now + CPU_DUEL_DEFENSE.dashDurationMs);
    }

    if (distance > CPU_DUEL_DEFENSE.arrivalDistance) {
      this.moveToward(command, member, target.x, target.y);
      command.dash = now < (this.duelDefenseDashUntil.get(member.id) || 0);
      if (opponentPreparingShot) {
        command.lockFacing = true;
        command.faceDirection = this.getDirectionToward(member, opponentHolder);
      }
      return;
    }

    this.duelDefenseDashUntil.delete(member.id);
    this.stop(command);
    command.lockFacing = true;
    command.faceDirection = member.team === "left" ? "right" : "left";
  }

  getDirectionToward(member, target) {
    if (!target) return member.team === "left" ? "right" : "left";
    const dx = target.x - member.x;
    const dy = target.y - member.y;
    if (Math.abs(dx) >= Math.abs(dy) * 0.72) return dx >= 0 ? "right" : "left";
    return dy >= 0 ? "down" : "up";
  }

  selectAttackTactic(holder) {
    const weights = this.getAttackTacticWeights();
    if (this.lastTacticType && weights[this.lastTacticType] != null) {
      weights[this.lastTacticType] *= 0.35;
    }

    const entries = Object.entries(weights).filter(([, weight]) => weight > 0);
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = Math.random() * total;
    let type = entries[0]?.[0] || "buildUp";
    for (const [candidate, weight] of entries) {
      roll -= weight;
      if (roll <= 0) {
        type = candidate;
        break;
      }
    }
    const active = this.getActiveTeammates();
    const ace = this.getAcePlayer(active);
    this.attackTactic = {
      id: ++this.tacticSerial,
      type,
      step: 0,
      finished: false,
      startedAt: Date.now(),
      passesRequired: type === "buildUp" ? 2 + Math.floor(Math.random() * 2)
        : type === "trianglePass" ? 3
          : type === "tempoChange" ? 2 + Math.floor(Math.random() * 2)
            : type === "outfieldRelay" ? (holder.role === "out" ? 1 : 2)
              : type === "sideOverload" || type === "oneTwo" || type === "decoyAce" ? 2
                : type === "quickAttack" || type === "sideChange" || type === "shotFeint" ? 1
                  : 0,
      side: Math.random() < 0.5 ? -1 : 1,
      firstPasserId: holder.id,
      lastPasserId: null,
      aceId: ace?.id || null,
      participantIds: this.getTriangleParticipants(holder, active).map((member) => member.id),
      relayIds: this.getOutfieldRelayMembers(holder, active).map((member) => member.id)
    };
    this.lastTacticType = type;
    for (const member of this.team) member.cpuPreferredPassTargetId = null;
  }

  getAttackTacticWeights() {
    return {
      ...CPU_ATTACK_TACTIC_WEIGHTS,
      ...(this.config.attackTacticWeights || {})
    };
  }

  isZenmaiGears() {
    return this.team.some((member) => member.cpuProfile === "zenmaiGears");
  }

  shouldUseTacticalQuickShot(holder) {
    if (!holder || holder.quickShotReadyTimer <= 0 || !this.attackTactic || this.attackTactic.finished) return false;
    const tactic = this.attackTactic;
    return (
      (tactic.type === "quickAttack" && tactic.step >= tactic.passesRequired) ||
      (tactic.type === "tempoChange" && tactic.step >= tactic.passesRequired) ||
      (tactic.type === "oneTwo" && tactic.step >= 2)
    );
  }

  getTacticalHolderPlan(holder) {
    const tactic = this.attackTactic;
    if (!tactic || tactic.finished) return null;

    if (this.shouldUseTacticalQuickShot(holder)) {
      return this.markTacticalPlan(this.createHolderPlan(holder, "quick-shot", 0), true);
    }

    const passThenShoot = (target, slowPass = false) => {
      if (!target) return this.createTacticalShotPlan(holder, "normal-shot");
      return this.createTacticalPassPlan(holder, target, slowPass);
    };

    if (tactic.type === "buildUp") {
      if (tactic.step < tactic.passesRequired) {
        return passThenShoot(this.getNearestPassTarget(holder, tactic.lastPasserId));
      }
      return this.createTacticalShotPlan(holder, Math.random() < 0.55 ? "dash-shot" : "normal-shot");
    }

    if (tactic.type === "quickAttack") {
      if (tactic.step < tactic.passesRequired) {
        const target = this.isZenmaiGears()
          ? this.getNextTriangleTarget(holder, tactic)
          : this.getNearestPassTarget(holder);
        return passThenShoot(target);
      }
      return this.createTacticalShotPlan(holder, "normal-shot");
    }

    if (tactic.type === "sideOverload") {
      if (tactic.step === 0) return passThenShoot(this.getSameSideTeammate(holder, tactic.side));
      if (tactic.step === 1) return passThenShoot(this.getOppositeSideTeammate(holder, tactic.side));
      return this.createTacticalShotPlan(holder, "dash-shot");
    }

    if (tactic.type === "trianglePass") {
      if (tactic.step < tactic.passesRequired) {
        return passThenShoot(this.getNextTriangleTarget(holder, tactic));
      }
      return this.createTacticalShotPlan(holder, "dash-shot");
    }

    if (tactic.type === "oneTwo") {
      if (tactic.step === 0) return passThenShoot(this.getNearestPassTarget(holder));
      if (tactic.step === 1) {
        const firstPasser = this.team.find((member) => member.id === tactic.firstPasserId && !member.defeated);
        return passThenShoot(firstPasser || this.getNearestPassTarget(holder));
      }
      return this.createTacticalShotPlan(holder, "dash-shot");
    }

    if (tactic.type === "sideChange") {
      if (tactic.step < 1) return passThenShoot(this.getFarthestVerticalTeammate(holder));
      return this.createTacticalShotPlan(holder, "normal-shot");
    }

    if (tactic.type === "outfieldRelay") {
      if (holder.role === "out" && tactic.step > 0) {
        return this.createTacticalShotPlan(holder, "dash-strong-shot");
      }
      if (tactic.step < tactic.passesRequired) {
        return passThenShoot(this.getNextRelayTarget(holder, tactic));
      }
      return this.createTacticalShotPlan(holder, "dash-shot");
    }

    if (tactic.type === "decoyAce") {
      const ace = this.team.find((member) => member.id === tactic.aceId && !member.defeated);
      if (tactic.step === 0 && ace && holder !== ace) return passThenShoot(ace);
      if (tactic.step < 2) return passThenShoot(this.getBestNonAceShooter(holder, tactic.aceId));
      return this.createTacticalShotPlan(holder, "dash-strong-shot");
    }

    if (tactic.type === "closeAttack") {
      return this.createTacticalShotPlan(holder, "center-shot");
    }

    if (tactic.type === "tempoChange") {
      if (tactic.step < tactic.passesRequired) {
        return passThenShoot(this.getNearestPassTarget(holder, tactic.lastPasserId), true);
      }
      return this.createTacticalShotPlan(holder, "dash-shot");
    }

    if (tactic.type === "shotFeint") {
      if (tactic.step < 1) {
        const target = this.getFarthestVerticalTeammate(holder) || this.getNearestPassTarget(holder);
        const plan = this.createTacticalPassPlan(holder, target);
        plan.type = "shot-feint";
        plan.feintUntil = Date.now() + 620 + Math.random() * 280;
        plan.x = this.getAttackLineX(holder);
        return plan;
      }
      return this.createTacticalShotPlan(holder, "normal-shot");
    }

    return null;
  }

  createTacticalPassPlan(holder, target, slowPass = false) {
    const plan = this.createHolderPlan(holder, "pass-chain", 0);
    plan.tactical = true;
    plan.passTargetId = target?.id || null;
    plan.slowPass = slowPass;
    return plan;
  }

  createTacticalShotPlan(holder, type) {
    return this.markTacticalPlan(
      this.createHolderPlan(holder, type, 0.9 + Math.random() * 0.42),
      true
    );
  }

  markTacticalPlan(plan, finishTactic = false) {
    plan.tactical = true;
    plan.finishTactic = finishTactic;
    return plan;
  }

  advanceAttackTactic(holder) {
    if (!this.attackTactic || this.attackTactic.finished) return;
    this.attackTactic.lastPasserId = holder.id;
    this.attackTactic.step += 1;
  }

  finishAttackTactic(plan) {
    if (plan?.tactical && plan.finishTactic && this.attackTactic) {
      this.attackTactic.finished = true;
    }
  }

  controlHolder(command, holder) {
    const plan = this.getHolderPlan(holder);
    if (
      this.shouldKeepSpecialGrounded(holder) &&
      (
        plan.type === "jump-shot" ||
        plan.type === "jump-strong-shot" ||
        plan.type === "charge-jump-shot" ||
        plan.type === "dash-jump-strong-shot"
      )
    ) {
      plan.type = plan.type === "jump-shot" ? "dash-shot" : "dash-strong-shot";
      plan.jumpAttempted = false;
      plan.jumpStartedAt = 0;
    }
    if (this.shouldUseBacklineSpecial(holder) && this.isShotPlanType(plan.type)) {
      plan.x = this.getBackAttackLineX(holder);
    }
    if (plan.type === "special-pass-wait") {
      this.stop(command);
      return;
    }
    if (plan.type === "lock-rocket-launch") {
      const now = Date.now();
      const grounded = holder.jumpZ <= 0 && holder.jumpVelocity <= 0;
      const groundOnlySpecial = this.shouldKeepSpecialGrounded(holder);
      const reachedLaunchPoint = Math.hypot(holder.x - plan.x, holder.y - plan.y) < 46;
      const approachTimedOut = now - plan.createdAt > 4000;

      if (!plan.launchStarted) {
        this.moveToward(command, holder, plan.x, plan.y);
        command.dash = true;
        if (reachedLaunchPoint || approachTimedOut) {
          plan.launchStarted = true;
          plan.startedAt = now;
        }
        return;
      }

      const target = this.nearestActiveOpponent(holder);
      if (plan.chargeStarted || this.throwTimer <= 0) {
        if (target) this.moveToward(command, holder, target.x, target.y);
        command.dash = grounded;
      } else if (target) {
        this.facePoint(command, holder, target.x, target.y);
      } else {
        this.stop(command);
      }

      if (!groundOnlySpecial && this.hasStaleApexChargePlan(plan)) {
        this.resetHolderPlanSoon();
        return;
      }
      if (!plan.chargeStarted && this.throwTimer <= 0) {
        command.chargeShoot = true;
        command.chargeTime = plan.chargeTime;
        command.chargeReleaseMode = groundOnlySpecial ? "time" : "apex";
        plan.chargeStarted = true;
        plan.startedAt = now;
        this.throwTimer = plan.chargeTime + (groundOnlySpecial ? 0.55 : 0.95);
        if (groundOnlySpecial) {
          holder.cpuLockRocketLaunchCooldownUntil = now + 3000;
          return;
        }
      }
      if (
        !groundOnlySpecial &&
        plan.chargeStarted &&
        grounded &&
        now - plan.startedAt > Math.max(220, (plan.chargeTime - 0.72) * 1000)
      ) {
        if (plan.jumpAttempted) {
          if (now - plan.jumpStartedAt > 450) this.resetHolderPlanSoon();
          return;
        }
        command.jump = true;
        command.dash = true;
        plan.jumpAttempted = true;
        plan.jumpStartedAt = now;
        holder.cpuJumpAttackCooldownUntil = now + 2200;
        holder.cpuLockRocketLaunchCooldownUntil = now + 3000;
      }
      return;
    }
    if (plan.type === "quick-shot") {
      this.faceNearestThreat(command, holder);
      if (this.throwTimer <= 0) {
        command.shoot = true;
        this.finishAttackTactic(plan);
        if (plan.devilTriangleFinal) this.specialAttackState = null;
        this.throwTimer = 0.42 + Math.random() * 0.18;
        this.holderPlan = null;
      }
      return;
    }
    if (plan.type === "devil-triangle-final") {
      holder.passChainBlockTimer = 0;
      holder.quickShotReadyTimer = 0;
      holder.throwLockTimer = 0;
      this.faceNearestThreat(command, holder);
      if (this.throwTimer <= 0) {
        command.chargeShoot = true;
        command.chargeTime = 0.48;
        command.chargeReleaseMode = "time";
        holder.cpuForceDevilTriangleShotUntil = 0;
        this.specialAttackState = null;
        this.throwTimer = 0.62;
        this.holderPlan = null;
      }
      return;
    }
    if (plan.type === "devil-triangle-mini-final") {
      const now = Date.now();
      holder.passChainBlockTimer = 0;
      holder.quickShotReadyTimer = 0;
      holder.throwLockTimer = 0;
      if (!plan.startedAt) plan.startedAt = now;
      const target = this.nearestActiveOpponent(holder);
      if (target) this.facePoint(command, holder, target.x, target.y);
      command.dash = true;
      if (this.throwTimer <= 0 && now - plan.startedAt > 90) {
        command.chargeShoot = true;
        command.chargeTime = 0.28;
        command.chargeReleaseMode = "time";
        holder.cpuForceDevilTriangleMiniShotUntil = 0;
        this.specialAttackState = null;
        this.throwTimer = 0.48;
        this.holderPlan = null;
      }
      return;
    }
    if (
      plan.type.includes("jump") &&
      !plan.jumpAttempted &&
      (holder.cpuJumpAttackCooldownUntil || 0) > Date.now()
    ) {
      plan.type = "normal-shot";
    }
    if (plan.type === "pass-chain") {
      this.moveToHome(command, holder);
      if (this.throwTimer <= 0) {
        if (plan.passTargetId) holder.cpuPreferredPassTargetId = plan.passTargetId;
        if (plan.devilTrianglePass) holder.cpuDevilTrianglePass = true;
        command.pass = true;
        if (plan.specialAttackPass && this.specialAttackState) {
          this.specialAttackState.passUsed = true;
          this.specialAttackState.passInFlight = true;
          this.specialAttackState.passerId = holder.id;
          this.specialAttackState.passStartedAt = Date.now();
        } else if (plan.tactical) {
          this.advanceAttackTactic(holder);
        }
        if (plan.devilTrianglePass) {
          this.advanceDevilTriangle(plan);
        }
        this.throwTimer = plan.slowPass
          ? 0.72 + Math.random() * 0.3
          : plan.devilTrianglePass
            ? 0.12 + Math.random() * 0.08
          : 0.42 + Math.random() * 0.32;
        this.holderPlan = null;
      }
      return;
    }

    if (plan.type === "shot-feint") {
      this.moveToward(command, holder, plan.x, plan.y);
      command.dash = true;
      if (Date.now() >= plan.feintUntil && this.throwTimer <= 0) {
        if (plan.passTargetId) holder.cpuPreferredPassTargetId = plan.passTargetId;
        command.pass = true;
        this.advanceAttackTactic(holder);
        this.throwTimer = 0.4 + Math.random() * 0.22;
        this.holderPlan = null;
      }
      return;
    }

    if (plan.type === "center-shot") {
      this.moveToward(command, holder, plan.x, plan.y);
      command.dash = true;
      if (!plan.startedAt) plan.startedAt = Date.now();
      const reachedLine = Math.hypot(holder.x - plan.x, holder.y - plan.y) < 42;
      const waitedTooLong = Date.now() - plan.startedAt > 2200;
      if ((reachedLine || waitedTooLong) && this.throwTimer <= 0) {
        command.shoot = true;
        this.finishAttackTactic(plan);
        this.throwTimer = 0.36 + Math.random() * 0.24;
        this.holderPlan = null;
      }
      return;
    }

    if (plan.type === "charge-shot") {
      this.faceNearestThreat(command, holder);
      if (this.throwTimer <= 0) {
        command.chargeShoot = true;
        command.chargeTime = plan.chargeTime;
        this.finishAttackTactic(plan);
        this.throwTimer = plan.chargeTime + 0.55 + Math.random() * 0.25;
        this.holderPlan = null;
      }
      return;
    }

    if (plan.type === "dash-strong-shot" || plan.type === "charge-dash-shot") {
      const target = this.nearestActiveOpponent(holder);
      if (target) this.moveToward(command, holder, target.x, target.y);
      command.dash = true;
      if (this.throwTimer <= 0) {
        command.chargeShoot = true;
        command.chargeTime = plan.chargeTime;
        command.chargeReleaseMode = "time";
        if (plan.forceShotAfterPass) holder.clearPostPassAction?.();
        this.finishAttackTactic(plan);
        this.throwTimer = plan.chargeTime + 0.7 + Math.random() * 0.25;
        this.holderPlan = null;
      }
      return;
    }

    if (plan.type === "jump-strong-shot" || plan.type === "charge-jump-shot") {
      const grounded = holder.jumpZ <= 0 && holder.jumpVelocity <= 0;
      if (grounded) this.moveToward(command, holder, plan.x, plan.y);
      else this.stop(command);
      if (this.hasStaleApexChargePlan(plan)) {
        this.resetHolderPlanSoon();
        return;
      }
      if (!plan.chargeStarted && this.throwTimer <= 0) {
        command.chargeShoot = true;
        command.chargeTime = plan.chargeTime;
        command.chargeReleaseMode = "apex";
        this.finishAttackTactic(plan);
        plan.chargeStarted = true;
        plan.startedAt = Date.now();
        this.throwTimer = plan.chargeTime + 0.9 + Math.random() * 0.2;
      }
      if (
        plan.chargeStarted &&
        grounded &&
        Date.now() - (plan.startedAt || 0) > Math.max(220, (plan.chargeTime - 0.72) * 1000)
      ) {
        if (plan.jumpAttempted) {
          if (Date.now() - plan.jumpStartedAt > 450) this.resetHolderPlanSoon();
          return;
        }
        command.jump = true;
        plan.jumpAttempted = true;
        plan.jumpStartedAt = Date.now();
        holder.cpuJumpAttackCooldownUntil = Date.now() + 2200;
      }
      return;
    }

    if (plan.type === "dash-jump-strong-shot") {
      const grounded = holder.jumpZ <= 0 && holder.jumpVelocity <= 0;
      if (grounded) this.moveToward(command, holder, plan.x, plan.y);
      else this.stop(command);
      command.dash = grounded;
      if (this.hasStaleApexChargePlan(plan)) {
        this.resetHolderPlanSoon();
        return;
      }
      if (!plan.chargeStarted && this.throwTimer <= 0) {
        command.chargeShoot = true;
        command.chargeTime = plan.chargeTime;
        command.chargeReleaseMode = "apex";
        this.finishAttackTactic(plan);
        plan.chargeStarted = true;
        plan.startedAt = Date.now();
        this.throwTimer = plan.chargeTime + 0.95 + Math.random() * 0.22;
      }
      if (
        plan.chargeStarted &&
        grounded &&
        Date.now() - (plan.startedAt || 0) > Math.max(260, (plan.chargeTime - 0.7) * 1000)
      ) {
        if (plan.jumpAttempted) {
          if (Date.now() - plan.jumpStartedAt > 450) this.resetHolderPlanSoon();
          return;
        }
        command.jump = true;
        plan.jumpAttempted = true;
        plan.jumpStartedAt = Date.now();
        holder.cpuJumpAttackCooldownUntil = Date.now() + 2200;
      }
      return;
    }

    if (plan.type === "dash-shot") {
      const target = this.nearestActiveOpponent(holder);
      if (plan.oneOnOneMidBackShot) {
        this.moveToward(command, holder, plan.x, plan.y);
        if (target) this.facePoint(command, holder, target.x, target.y);
      } else if (target) {
        this.moveToward(command, holder, target.x, target.y);
      }
      command.dash = true;
      const reachedLine = !plan.oneOnOneMidBackShot || Math.hypot(holder.x - plan.x, holder.y - plan.y) < 56;
      const waitedTooLong = plan.oneOnOneMidBackShot && Date.now() - plan.createdAt > 1800;
      if ((reachedLine || waitedTooLong) && this.throwTimer <= 0) {
        command.shoot = true;
        if (plan.forceShotAfterPass) holder.clearPostPassAction?.();
        this.finishAttackTactic(plan);
        this.throwTimer = 0.42 + Math.random() * 0.22;
        this.holderPlan = null;
      }
      return;
    }

    if (plan.type === "jump-shot") {
      const now = Date.now();
      const grounded = holder.jumpZ <= 0 && holder.jumpVelocity <= 0;
      if (!plan.startedAt) plan.startedAt = now;
      if (grounded) {
        if (plan.jumpAttempted) {
          if (now - plan.jumpStartedAt > 450) this.resetHolderPlanSoon();
          return;
        }
        this.moveToward(command, holder, plan.x, plan.y);
        const reachedAttackPoint = Math.hypot(holder.x - plan.x, holder.y - plan.y) < 64;
        if (reachedAttackPoint || now - plan.startedAt > 850) {
          command.jump = true;
          plan.jumpAttempted = true;
          plan.jumpStartedAt = now;
          holder.cpuJumpAttackCooldownUntil = now + 2200;
        }
      } else {
        this.stop(command);
      }
      const jumpElapsed = plan.jumpAttempted ? (now - plan.jumpStartedAt) / 1000 : 0;
      const forceShootTimerReady = plan.jumpAttempted && jumpElapsed >= 0.35 && this.throwTimer <= 0.14;
      const missedApexShoot = plan.jumpAttempted && holder.jumpVelocity < -90 && holder.jumpZ > 28 && this.throwTimer <= 0.22;
      const landingFallbackShoot = plan.jumpAttempted && holder.jumpZ <= 36 && jumpElapsed >= 0.45;
      if (
        (this.isNearJumpApex(holder) && this.throwTimer <= 0) ||
        forceShootTimerReady ||
        missedApexShoot ||
        landingFallbackShoot
      ) {
        command.shoot = true;
        this.finishAttackTactic(plan);
        this.throwTimer = 0.5 + Math.random() * 0.22;
        this.holderPlan = null;
      } else if (plan.jumpAttempted && now - plan.jumpStartedAt > 1700) {
        this.resetHolderPlanSoon();
      }
      return;
    }

    if (plan.type === "catch-and-shoot") {
      const target = this.nearestActiveOpponent(holder);
      if (target) this.facePoint(command, holder, target.x, target.y);
      if (!plan.startedAt) plan.startedAt = Date.now();
      const missedAerialWindow = holder.jumpZ <= 0 && Date.now() - plan.startedAt > 900;
      if ((holder.jumpZ > 18 || missedAerialWindow) && this.throwTimer <= 0) {
        command.shoot = true;
        if (plan.forceShotAfterPass) holder.clearPostPassAction?.();
        this.finishAttackTactic(plan);
        this.throwTimer = 0.55 + Math.random() * 0.15;
        this.holderPlan = null;
      }
      return;
    }

    if (plan.type === "pass") {
      this.moveToHome(command, holder);
      if (this.throwTimer <= 0) {
        command.pass = true;
        this.throwTimer = 0.45 + Math.random() * 0.35;
        this.holderPlan = null;
      }
      return;
    }

    this.faceNearestThreat(command, holder);
    if (plan.oneOnOneMidBackShot) {
      this.moveToward(command, holder, plan.x, plan.y);
      command.dash = true;
      const reachedLine = Math.hypot(holder.x - plan.x, holder.y - plan.y) < 48;
      if (!reachedLine && Date.now() - plan.createdAt < 1800) return;
    }
    if (this.throwTimer <= 0) {
      command.shoot = true;
      if (plan.forceShotAfterPass) holder.clearPostPassAction?.();
      this.finishAttackTactic(plan);
      this.throwTimer = 0.38 + Math.random() * 0.28;
      this.holderPlan = null;
    }
  }

  getHolderPlan(holder) {
    if ((holder.cpuForceDevilTriangleMiniShotUntil || 0) > Date.now()) {
      if (this.attackTactic) this.attackTactic.finished = true;
      const plan = this.createHolderPlan(holder, "devil-triangle-mini-final", 0);
      plan.specialAttackPlan = true;
      plan.devilTriangleFinal = true;
      this.throwTimer = Math.min(this.throwTimer, 0.03);
      return plan;
    }
    if ((holder.cpuForceDevilTriangleShotUntil || 0) > Date.now()) {
      if (this.attackTactic) this.attackTactic.finished = true;
      const plan = this.createHolderPlan(holder, "devil-triangle-final", 0);
      plan.specialAttackPlan = true;
      plan.devilTriangleFinal = true;
      this.throwTimer = Math.min(this.throwTimer, 0.03);
      return plan;
    }
    const postPassAction = holder.getPostPassAction?.() || null;
    if (postPassAction?.type === "shoot") {
      if (this.attackTactic) this.attackTactic.finished = true;
      if (this.specialAttackState?.passInFlight) this.specialAttackState.passInFlight = false;
      const aerial = (postPassAction.aerial || holder.aerialPassCatchTimer > 0) && holder.jumpZ > 0;
      const plan = this.createHolderPlan(
        holder,
        aerial ? "catch-and-shoot" : (holder.role === "out" ? "dash-strong-shot" : "dash-shot"),
        holder.role === "out" ? 0.42 + Math.random() * 0.12 : 0.52 + Math.random() * 0.16
      );
      plan.forceShotAfterPass = true;
      this.throwTimer = Math.min(this.throwTimer, holder.role === "out" ? 0.08 : 0.12);
      return plan;
    }
    if (
      this.holderPlan &&
      this.holderPlan.holderId === holder.id &&
      (
        this.holderPlan.type === "lock-rocket-launch" ||
        (this.holderPlan.specialAttackPlan && this.holderPlan.type !== "special-pass-wait")
      )
    ) {
      return this.holderPlan;
    }
    const specialAttackPlan = this.getSpecialAttackHolderPlan(holder);
    if (specialAttackPlan) {
      return specialAttackPlan;
    }
    if (this.shouldUseTacticalQuickShot(holder) && this.holderPlan?.type !== "quick-shot") {
      return this.markTacticalPlan(this.createHolderPlan(holder, "quick-shot", 0), true);
    }
    if (this.holderPlan && this.holderPlan.holderId === holder.id) return this.holderPlan;

    if (holder.passChainBlockTimer > 0) {
      if (this.attackTactic) this.attackTactic.finished = true;
      const aerial = holder.aerialPassCatchTimer > 0 && holder.jumpZ > 0;
      const plan = this.createHolderPlan(
        holder,
        aerial ? "catch-and-shoot" : (holder.role === "out" ? "dash-strong-shot" : "dash-shot"),
        aerial ? 0.85 + Math.random() * 0.25 : 0.85 + Math.random() * 0.35
      );
      plan.forceShotAfterPass = true;
      return plan;
    }

    if (this.isRobotOverdrive(holder)) {
      const roll = Math.random();
      const type = roll < 0.45 ? "dash-shot" : roll < 0.72 ? "charge-shot" : "normal-shot";
      return this.markTacticalPlan(
        this.createHolderPlan(holder, type, 0.58 + Math.random() * 0.18),
        true
      );
    }

    if (
      holder.cpuProfile === "galactakos" &&
      holder.jumpZ <= 0 &&
      Date.now() > (holder.cpuJumpAttackCooldownUntil || 0) &&
      Math.random() < (holder.role === "out" ? 0.78 : 0.68)
    ) {
      return this.createHolderPlan(holder, "jump-shot", 0.82 + Math.random() * 0.28);
    }

    const tacticalPlan = this.getTacticalHolderPlan(holder);
    if (tacticalPlan) return tacticalPlan;

    if (holder.aerialPassCatchTimer > 0 && holder.jumpZ > 0) {
      return this.createHolderPlan(holder, "catch-and-shoot", 0.85 + Math.random() * 0.35);
    }

    const roll = Math.random();
    const type = holder.role === "out"
      ? (roll < 0.45 ? "dash-strong-shot" : roll < 0.75 ? "jump-shot" : "normal-shot")
      : (roll < 0.35 ? "center-shot" : roll < 0.7 ? "dash-shot" : "normal-shot");
    return this.createHolderPlan(holder, type, 1.05 + Math.random() * 0.45);
  }

  getSpecialAttackHolderPlan(holder) {
    if (!this.config.isSpiritReady?.(this.teamName)) {
      this.specialAttackState = null;
      return null;
    }

    const forceImmediateSpecial = this.isSpecialAttackOverdue();
    if (forceImmediateSpecial) {
      this.specialAttackState = {
        mode: "forceImmediate",
        shooterId: holder.id,
        passUsed: true,
        passInFlight: false,
        passerId: null,
        passStartedAt: 0
      };
    }

    if (this.isArkmazTeam() && !forceImmediateSpecial) {
      const devilTrianglePlan = this.getDevilTriangleHolderPlan(holder);
      if (devilTrianglePlan) return devilTrianglePlan;
    }

    let shooter = this.getSpecialAttackShooter();
    if (!shooter) return null;

    if (this.specialAttackState.passInFlight) {
      const waitingForRelease = (
        holder.id === this.specialAttackState.passerId &&
        Date.now() - this.specialAttackState.passStartedAt < 900
      );
      if (waitingForRelease) {
        const waitPlan = this.createHolderPlan(holder, "special-pass-wait", 0);
        waitPlan.specialAttackPlan = true;
        return waitPlan;
      }
      this.specialAttackState.passInFlight = false;
    }

    if (holder.id !== shooter.id) {
      if (this.specialAttackState.passUsed) {
        this.specialAttackState.shooterId = holder.id;
        shooter = holder;
      } else {
        const passPlan = this.createHolderPlan(holder, "pass-chain", 0);
        passPlan.passTargetId = shooter.id;
        passPlan.specialAttackPass = true;
        passPlan.specialAttackPlan = true;
        return passPlan;
      }
    }

    if (
      shooter.name === "ゼロ" &&
      shooter.specialShotType === "lockRocket" &&
      (shooter.cpuLockRocketLaunchCooldownUntil || 0) <= Date.now()
    ) {
      const rocketPlan = this.createLockRocketLaunchPlan(shooter);
      rocketPlan.specialAttackPlan = true;
      return rocketPlan;
    }

    const jumpReady = (shooter.cpuJumpAttackCooldownUntil || 0) <= Date.now();
    const groundedSpecial = forceImmediateSpecial || this.shouldKeepSpecialGrounded(shooter);
    const shotPlan = this.createHolderPlan(
      shooter,
      !groundedSpecial && jumpReady ? "dash-jump-strong-shot" : "dash-strong-shot",
      forceImmediateSpecial ? 0.42 : 0.92
    );
    if (this.shouldUseBacklineSpecial(shooter)) {
      shotPlan.x = this.getBackAttackLineX(shooter);
    }
    shotPlan.specialAttackPlan = true;
    if (forceImmediateSpecial) {
      shotPlan.forceImmediateSpecial = true;
      this.throwTimer = Math.min(this.throwTimer, 0.04);
    }
    if (this.attackTactic) this.attackTactic.finished = true;
    return shotPlan;
  }

  getSpecialAttackShooter() {
    const active = this.team.filter((member) => !member.defeated);
    const current = active.find((member) => member.id === this.specialAttackState?.shooterId);
    if (current) return current;

    const shooter = this.selectSpecialAttackShooter(active);
    this.specialAttackState = {
      shooterId: shooter?.id || null,
      passUsed: false,
      passInFlight: false,
      passerId: null,
      passStartedAt: 0
    };
    if (this.attackTactic) this.attackTactic.finished = true;
    return shooter;
  }

  selectSpecialAttackShooter(active) {
    if (active.length === 0) return null;

    if (this.isZenmaiGears()) {
      const zero = active.find((member) => member.name === "ゼロ");
      const others = active.filter((member) => member.name !== "ゼロ");
      if (zero && (others.length === 0 || Math.random() < 0.5)) return zero;
      return others[Math.floor(Math.random() * others.length)] || zero || null;
    }

    const profile = active[0]?.cpuProfile;
    const preferredNames = profile === "hinomaruBombers"
      ? ["だいち", "しょう"]
      : profile === "bakusouBoys"
        ? ["しょうた"]
        : profile === "americanBigBalls"
          ? ["ジョー"]
          : profile === "kuidaoRangers"
            ? ["たこへい"]
            : profile === "doskois"
              ? ["よこづな"]
              : profile === "townDodgies"
                ? ["まさる"]
                : profile === "arkmaz"
                  ? ["大魔王アークマ"]
                  : [];
    const preferred = active.filter((member) => preferredNames.includes(member.name));
    const preferredRoll = profile === "arkmaz" ? 0.2 : 0.7;
    if (preferred.length > 0 && Math.random() < preferredRoll) {
      return preferred[Math.floor(Math.random() * preferred.length)];
    }

    const grandHealShooter = this.selectGrandHealShooter(active);
    if (grandHealShooter) return grandHealShooter;

    const captain = active.find((member) => member.captain);
    if (captain && Math.random() < 0.6) return captain;

    const weightedCandidates = this.filterWastefulGrandHealCandidates(active);
    if (weightedCandidates.length === 0) return null;

    const weighted = weightedCandidates.map((member) => ({
      member,
      weight: Math.max(1, (member.stats?.power || 5) + (member.stats?.technique || 5) * 0.35)
    }));
    let roll = Math.random() * weighted.reduce((sum, entry) => sum + entry.weight, 0);
    for (const entry of weighted) {
      roll -= entry.weight;
      if (roll <= 0) return entry.member;
    }
    return weightedCandidates[0];
  }

  isGrandHealShooter(member) {
    return member?.specialShotType === "grandHeal";
  }

  getGrandHealUrgency(active = this.team) {
    const alive = active.filter((member) => !member.defeated && member.hp > 0);
    if (alive.length === 0) return 0;

    const hpRatios = alive.map((member) => {
      const maxHp = Math.max(1, member.maxHp || member.hp || 1);
      return Math.max(0, Math.min(1, member.hp / maxHp));
    });
    const minRatio = Math.min(...hpRatios);
    const averageMissing = hpRatios.reduce((sum, ratio) => sum + (1 - ratio), 0) / hpRatios.length;
    if (minRatio >= 0.4 && averageMissing < 0.4) return 0;

    const lowHpUrgency = Math.max(0, (0.4 - minRatio) / 0.25);
    const teamDamageUrgency = Math.max(0, (averageMissing - 0.4) / 0.35);
    return Math.max(0, Math.min(1, lowHpUrgency * 0.72 + teamDamageUrgency * 0.45));
  }

  selectGrandHealShooter(active) {
    const healers = active.filter((member) => (
      this.isGrandHealShooter(member) &&
      (member.grandHealCooldownTimer || 0) <= 0
    ));
    if (healers.length === 0) return null;

    const urgency = this.getGrandHealUrgency(active);
    if (urgency <= 0) return null;

    const selectionChance = Math.min(0.4, 0.08 + urgency * 0.52);
    if (Math.random() >= selectionChance) return null;

    return healers.sort((a, b) => {
      const aRatio = a.hp / Math.max(1, a.maxHp || a.hp || 1);
      const bRatio = b.hp / Math.max(1, b.maxHp || b.hp || 1);
      return bRatio - aRatio;
    })[0] || null;
  }

  filterWastefulGrandHealCandidates(active) {
    const urgency = this.getGrandHealUrgency(active);
    if (urgency > 0) {
      return active.filter((member) => !this.isGrandHealShooter(member) || (member.grandHealCooldownTimer || 0) <= 0);
    }
    return active.filter((member) => !this.isGrandHealShooter(member));
  }

  isArkmazTeam() {
    return this.team.some((member) => member.cpuProfile === "arkmaz" || member.uniformEmblem === "arkmaLord");
  }

  getArkmaPlayer() {
    return this.team.find((member) => member.uniformEmblem === "arkmaLord" && !member.defeated && member.hp > 0) || null;
  }

  getMiniDevils() {
    return this.team.filter((member) => member.isMiniDevilStyle?.() && !member.defeated && member.hp > 0);
  }

  getDevilTriangleHolderPlan(holder) {
    if (this.specialAttackState?.mode && this.specialAttackState.mode !== "devilTriangle") return null;
    const arkma = this.getArkmaPlayer();
    const miniDevils = this.getMiniDevils();
    if (!arkma || miniDevils.length < 3) return null;

    if (!this.specialAttackState || this.specialAttackState.mode !== "devilTriangle") {
      if (Math.random() >= 0.7) {
        this.specialAttackState = { mode: "normalSpecial" };
        return null;
      }
      const ordered = [...miniDevils].sort((a, b) => a.homeY - b.homeY);
      this.specialAttackState = {
        mode: "devilTriangle",
        arkmaId: arkma.id,
        miniIds: ordered.map((member) => member.id),
        nextMiniIndex: 0,
        passesRemaining: 3 + Math.floor(Math.random() * 3),
        readyForArkmaShot: false,
        readyForMiniShotId: null,
        finalChoice: null
      };
      if (this.attackTactic) this.attackTactic.finished = true;
    }

    const state = this.specialAttackState;
    if (state.readyForArkmaShot && holder.id === state.arkmaId) {
      holder.cpuForceDevilTriangleShotUntil = Math.max(holder.cpuForceDevilTriangleShotUntil || 0, Date.now() + 1800);
      const plan = this.createHolderPlan(holder, "devil-triangle-final", 0);
      plan.specialAttackPlan = true;
      plan.devilTriangleFinal = true;
      this.throwTimer = Math.min(this.throwTimer, 0.04);
      state.finished = true;
      return plan;
    }

    if (state.readyForMiniShotId && holder.id === state.readyForMiniShotId) {
      holder.cpuForceDevilTriangleMiniShotUntil = Math.max(holder.cpuForceDevilTriangleMiniShotUntil || 0, Date.now() + 1800);
      const plan = this.createHolderPlan(holder, "devil-triangle-mini-final", 0);
      plan.specialAttackPlan = true;
      plan.devilTriangleFinal = true;
      this.throwTimer = Math.min(this.throwTimer, 0.03);
      state.finished = true;
      return plan;
    }

    if (state.readyForArkmaShot || state.readyForMiniShotId) return null;

    let target = null;
    const holderIsMini = state.miniIds.includes(holder.id);
    if (!holderIsMini) {
      target = this.team.find((member) => member.id === state.miniIds[state.nextMiniIndex] && !member.defeated);
    } else if (state.passesRemaining > 0) {
      const currentIndex = state.miniIds.indexOf(holder.id);
      const nextIndex = (currentIndex + 1 + Math.floor(Math.random() * 2)) % state.miniIds.length;
      target = this.team.find((member) => member.id === state.miniIds[nextIndex] && !member.defeated && member.id !== holder.id)
        || this.team.find((member) => state.miniIds.includes(member.id) && member.id !== holder.id && !member.defeated);
    } else if (this.chooseDevilTriangleFinal(state) === "arkma") {
      target = arkma;
    } else {
      const plan = this.createHolderPlan(holder, "devil-triangle-mini-final", 0);
      plan.specialAttackPlan = true;
      plan.devilTriangleFinal = true;
      state.readyForMiniShotId = holder.id;
      state.finished = true;
      holder.cpuForceDevilTriangleMiniShotUntil = Date.now() + 2200;
      holder.cpuPreferredPassTargetId = null;
      holder.passChainBlockTimer = Math.max(holder.passChainBlockTimer || 0, 1.4);
      this.throwTimer = Math.min(this.throwTimer, 0.03);
      return plan;
    }

    if (!target) return null;
    const plan = this.createHolderPlan(holder, "pass-chain", 0);
    plan.passTargetId = target.id;
    plan.specialAttackPlan = true;
    plan.devilTrianglePass = true;
    plan.devilTriangleTargetId = target.id;
    this.throwTimer = Math.min(this.throwTimer, holderIsMini ? 0.05 : 0.16);
    return plan;
  }

  chooseDevilTriangleFinal(state) {
    if (!state.finalChoice) {
      state.finalChoice = Math.random() < 0.4 ? "arkma" : "mini";
    }
    return state.finalChoice;
  }

  advanceDevilTriangle(plan) {
    const state = this.specialAttackState;
    if (!state || state.mode !== "devilTriangle") return;
    if (plan.devilTriangleTargetId === state.arkmaId) {
      state.readyForArkmaShot = true;
      const arkma = this.team.find((member) => member.id === state.arkmaId);
      if (arkma) {
        arkma.cpuForceDevilTriangleShotUntil = Date.now() + 2200;
        arkma.cpuPreferredPassTargetId = null;
        arkma.passChainBlockTimer = Math.max(arkma.passChainBlockTimer || 0, 1.4);
      }
      this.throwTimer = Math.min(this.throwTimer, 0.08);
      return;
    }
    if (state.miniIds.includes(plan.devilTriangleTargetId)) {
      state.nextMiniIndex = (state.miniIds.indexOf(plan.devilTriangleTargetId) + 1) % state.miniIds.length;
      state.passesRemaining = Math.max(0, state.passesRemaining - 1);
      if (state.passesRemaining <= 0 && this.chooseDevilTriangleFinal(state) !== "arkma") {
        state.readyForMiniShotId = plan.devilTriangleTargetId;
        const miniFinisher = this.team.find((member) => member.id === state.readyForMiniShotId);
        if (miniFinisher) {
          miniFinisher.cpuPreferredPassTargetId = null;
          miniFinisher.passChainBlockTimer = Math.max(miniFinisher.passChainBlockTimer || 0, 1.4);
          miniFinisher.cpuForceDevilTriangleMiniShotUntil = Date.now() + 2200;
        }
        this.throwTimer = Math.min(this.throwTimer, 0.06);
      }
    }
  }

  createLockRocketLaunchPlan(holder) {
    const area = this.config.areas?.[holder.zone];
    const margin = Math.max(holder.radius || 36, 62);
    const launchY = area
      ? this.clampPointToArea({ x: holder.homeX, y: holder.homeY }, area, margin).y
      : holder.homeY;
    let launchX = holder.homeX;

    if (area?.trapezoid) {
      const bounds = this.getTrapezoidBoundsAtY(area.trapezoid, launchY);
      if (bounds) {
        launchX = holder.team === "left"
          ? bounds.left + margin
          : bounds.right - margin;
      }
    } else if (area) {
      launchX = holder.team === "left"
        ? area.x + margin
        : area.x + area.w - margin;
    }

    const plan = this.createHolderPlan(holder, "lock-rocket-launch", 0.92);
    plan.x = launchX;
    plan.y = launchY;
    plan.createdAt = Date.now();
    plan.launchStarted = false;
    if (this.attackTactic) this.attackTactic.finished = true;
    return plan;
  }

  createHolderPlan(holder, type, chargeTime) {
    const centerLineX = this.getAttackLineX(holder);
    const windupScale = this.isRobotOverdrive(holder)
      ? ROBOT_OVERDRIVE_CONFIG.windupTimeScale
      : 1;
    this.holderPlan = {
      holderId: holder.id,
      type,
      x: holder.role === "inner" ? centerLineX : holder.homeX,
      y: holder.y,
      chargeTime: chargeTime * windupScale,
      createdAt: Date.now(),
      chargeStarted: false,
      startedAt: 0,
      jumpAttempted: false,
      jumpStartedAt: 0
    };
    this.applyOneOnOneMidBackShotPlan(holder, this.holderPlan);
    return this.holderPlan;
  }

  applyOneOnOneMidBackShotPlan(holder, plan) {
    if (!this.config.oneOnOneMode || !holder || holder.role !== "inner" || !plan) return;
    if (!this.isOneOnOneMidBackShotType(plan.type)) return;
    if (Math.random() >= CPU_ONE_ON_ONE_ATTACK.midBackNormalShotRate) return;
    const point = this.getOneOnOneMidBackShotPoint(holder);
    if (!point) return;
    plan.x = point.x;
    plan.y = point.y;
    plan.oneOnOneMidBackShot = true;
  }

  isOneOnOneMidBackShotType(type) {
    return type === "normal-shot" || type === "center-shot" || type === "dash-shot";
  }

  getOneOnOneMidBackShotPoint(holder) {
    const area = this.config.areas ? this.config.areas[holder.zone] : null;
    const margin = Math.max(holder.radius || 36, 70);
    let backX = holder.homeX;
    let frontX = this.getAttackLineX(holder);
    if (area?.trapezoid) {
      const bounds = this.getTrapezoidBoundsAtY(area.trapezoid, holder.y);
      if (bounds) {
        backX = holder.team === "left" ? bounds.left + margin : bounds.right - margin;
        frontX = holder.team === "left" ? bounds.right - margin : bounds.left + margin;
      }
    } else if (area) {
      backX = holder.team === "left" ? area.x + margin : area.x + area.w - margin;
      frontX = holder.team === "left" ? area.x + area.w - margin : area.x + margin;
    }
    const progress = CPU_ONE_ON_ONE_ATTACK.midBackMinProgress +
      Math.random() * (CPU_ONE_ON_ONE_ATTACK.midBackMaxProgress - CPU_ONE_ON_ONE_ATTACK.midBackMinProgress);
    const x = backX + (frontX - backX) * progress;
    const yOffset = (Math.random() - 0.5) * 120;
    const y = this.clampPointToArea({ x, y: holder.homeY + yOffset }, area, margin).y;
    return { x, y };
  }

  updateSpecialAttackTimer() {
    if (!this.config.isSpiritReady?.(this.teamName)) {
      this.spiritReadySince = 0;
      return;
    }
    if (!this.spiritReadySince) {
      this.spiritReadySince = Date.now();
    }
  }

  isSpecialAttackOverdue() {
    return (
      this.spiritReadySince > 0 &&
      Date.now() - this.spiritReadySince >= CPU_SPECIAL_ATTACK_FORCE_DELAY * 1000
    );
  }

  getCpuSpecialShotType(member) {
    if (!member) return null;
    if (member.specialShotType === "none") return null;
    if (member.specialShotType) return member.specialShotType;
    if (member.characterType === "witch" || member.uniformEmblem === "witch") return "arcanaSphere";
    if (member.characterType === "mage") return "soul";
    if (member.characterType === "jump") return "boost";
    if (member.characterType === "alien") return "ufoSpin";
    if (member.characterType === "power") return "iron";
    if (member.characterType === "speed") return "boomerang";
    return "lightning";
  }

  shouldKeepSpecialGrounded(member) {
    if (!member || member.role === "out") return false;
    if (!this.config.isSpiritReady?.(this.teamName)) return false;
    return CPU_GROUNDED_SPECIAL_SHOTS.has(this.getCpuSpecialShotType(member));
  }

  shouldUseBacklineSpecial(member) {
    if (!member || member.role === "out") return false;
    if (!this.config.isSpiritReady?.(this.teamName)) return false;
    return CPU_BACKLINE_SPECIAL_SHOTS.has(this.getCpuSpecialShotType(member));
  }

  isShotPlanType(type) {
    return (
      type === "normal-shot" ||
      type === "center-shot" ||
      type === "dash-shot" ||
      type === "charge-shot" ||
      type === "dash-strong-shot" ||
      type === "charge-dash-shot" ||
      type === "jump-shot" ||
      type === "jump-strong-shot" ||
      type === "charge-jump-shot" ||
      type === "dash-jump-strong-shot"
    );
  }

  getActiveTeammates() {
    return this.team.filter((member) => !member.defeated);
  }

  getAcePlayer(active = this.getActiveTeammates()) {
    const inner = active.filter((member) => member.role === "inner");
    const candidates = inner.length > 0 ? inner : active;
    return candidates.reduce((best, member) => {
      const stats = member.stats || {};
      const score = (stats.power || 5) * 2.2 + (stats.technique || 5) + (member.maxHp || 100) * 0.012;
      const bestStats = best?.stats || {};
      const bestScore = best
        ? (bestStats.power || 5) * 2.2 + (bestStats.technique || 5) + (best.maxHp || 100) * 0.012
        : -Infinity;
      return score > bestScore ? member : best;
    }, null);
  }

  getTriangleParticipants(holder, active = this.getActiveTeammates()) {
    const others = active
      .filter((member) => member !== holder)
      .sort((a, b) => {
        const aScore = Math.hypot(a.x - holder.x, a.y - holder.y) - Math.abs(a.y - holder.y) * 0.25;
        const bScore = Math.hypot(b.x - holder.x, b.y - holder.y) - Math.abs(b.y - holder.y) * 0.25;
        return aScore - bScore;
      });
    return [holder, ...others.slice(0, 2)];
  }

  getOutfieldRelayMembers(holder, active = this.getActiveTeammates()) {
    const outfield = active
      .filter((member) => member.role === "out" && member !== holder)
      .sort((a, b) => a.homeY - b.homeY);
    const inner = active
      .filter((member) => member.role === "inner" && member !== holder)
      .sort((a, b) => Math.hypot(a.x - holder.x, a.y - holder.y) - Math.hypot(b.x - holder.x, b.y - holder.y));
    const relay = [...outfield, ...inner.slice(0, 1)];
    if (holder.role === "out") relay.push(...inner.slice(1, 2));
    return relay;
  }

  getNearestPassTarget(holder, excludedId = null) {
    return this.getActiveTeammates()
      .filter((member) => member !== holder && member.id !== excludedId)
      .sort((a, b) => Math.hypot(a.x - holder.x, a.y - holder.y) - Math.hypot(b.x - holder.x, b.y - holder.y))[0] || null;
  }

  getSameSideTeammate(holder, side) {
    const centerY = this.config.court.y + this.config.court.h * 0.5;
    const candidates = this.getActiveTeammates().filter((member) => (
      member !== holder &&
      (side < 0 ? member.y <= centerY : member.y >= centerY)
    ));
    return candidates.sort((a, b) => Math.abs(b.y - centerY) - Math.abs(a.y - centerY))[0]
      || this.getNearestPassTarget(holder);
  }

  getOppositeSideTeammate(holder, side) {
    return this.getSameSideTeammate(holder, -side);
  }

  getFarthestVerticalTeammate(holder) {
    return this.getActiveTeammates()
      .filter((member) => member !== holder)
      .sort((a, b) => Math.abs(b.y - holder.y) - Math.abs(a.y - holder.y))[0] || null;
  }

  getNextTriangleTarget(holder, tactic) {
    const participants = tactic.participantIds
      .map((id) => this.team.find((member) => member.id === id && !member.defeated))
      .filter(Boolean);
    if (participants.length < 2) return this.getNearestPassTarget(holder);
    const holderIndex = participants.indexOf(holder);
    return participants[(holderIndex + 1 + participants.length) % participants.length]
      || this.getNearestPassTarget(holder);
  }

  getNextRelayTarget(holder, tactic) {
    const relay = tactic.relayIds
      .map((id) => this.team.find((member) => member.id === id && !member.defeated))
      .filter((member) => member && member !== holder);
    if (relay.length === 0) return this.getNearestPassTarget(holder);
    return relay[Math.min(tactic.step, relay.length - 1)] || relay[0];
  }

  getBestNonAceShooter(holder, aceId) {
    return this.getActiveTeammates()
      .filter((member) => member !== holder && member.id !== aceId)
      .sort((a, b) => {
        const aScore = (a.stats?.power || 5) * 2 + (a.stats?.speed || 5) + (a.role === "inner" ? 3 : 0);
        const bScore = (b.stats?.power || 5) * 2 + (b.stats?.speed || 5) + (b.role === "inner" ? 3 : 0);
        return bScore - aScore;
      })[0] || this.getNearestPassTarget(holder);
  }

  controlOffBallAttack(command, member, holder) {
    const tactic = this.attackTactic;
    const area = this.config.areas?.[member.zone];
    const active = this.getActiveTeammates();
    const index = Math.max(0, active.indexOf(member));
    const centerY = this.config.court.y + this.config.court.h * 0.5;
    const attackDirection = holder.team === "left" ? 1 : -1;
    let point = {
      x: member.homeX + attackDirection * (member.role === "inner" ? 90 : 0),
      y: member.homeY
    };
    let dash = false;

    if (tactic && !tactic.finished) {
      if (tactic.type === "sideOverload") {
        const laneY = centerY + tactic.side * this.config.court.h * 0.28;
        point.y = laneY + (index % 3 - 1) * 76;
        point.x = member.homeX + attackDirection * (member.role === "inner" ? 150 : 55);
        if (index === active.length - 1) point.y = centerY - tactic.side * this.config.court.h * 0.3;
      } else if (tactic.type === "trianglePass") {
        const participantIndex = tactic.participantIds.indexOf(member.id);
        if (participantIndex >= 0) {
          const triangleOffsets = [
            { x: -110, y: -190 },
            { x: 170, y: 0 },
            { x: -110, y: 190 }
          ];
          const offset = triangleOffsets[participantIndex % triangleOffsets.length];
          point.x = holder.x + offset.x * attackDirection;
          point.y = holder.y + offset.y;
        }
      } else if (tactic.type === "oneTwo") {
        if (member.id === tactic.firstPasserId && tactic.step > 0) {
          point.x = this.getAttackLineX(member);
          point.y = holder.y + (member.homeY < centerY ? -120 : 120);
          dash = true;
        }
      } else if (tactic.type === "sideChange") {
        point.y = member.homeY < centerY
          ? this.config.court.y + this.config.court.h * 0.16
          : this.config.court.y + this.config.court.h * 0.84;
        dash = true;
      } else if (tactic.type === "decoyAce") {
        if (member.id === tactic.aceId) {
          point.x = this.getAttackLineX(member);
          point.y = centerY;
        } else {
          point.y = member.homeY + (index % 2 === 0 ? -100 : 100);
        }
      } else if (tactic.type === "closeAttack" || tactic.type === "shotFeint") {
        point.x = member.role === "inner"
          ? this.getAttackLineX(member) - attackDirection * (120 + index * 36)
          : member.homeX;
        point.y = centerY + (index % 3 - 1) * 170;
      } else if (tactic.type === "quickAttack" || tactic.type === "tempoChange") {
        point.x = member.homeX + attackDirection * (member.role === "inner" ? 175 : 35);
        point.y = member.homeY + (index % 2 === 0 ? -65 : 65);
        dash = tactic.type === "quickAttack" || tactic.step >= tactic.passesRequired - 1;
      } else if (tactic.type === "outfieldRelay") {
        point.x = member.homeX;
        point.y = member.homeY;
        dash = member.role === "out";
      }
    }

    point = this.clampPointToArea(point, area, member.radius);
    if (this.teammateCrowding(member, point.x, point.y) > 180) {
      point.y += member.homeY <= centerY ? -100 : 100;
      point = this.clampPointToArea(point, area, member.radius);
    }
    this.moveToward(command, member, point.x, point.y);
    command.dash = dash;
  }

  controlArkmaGuard(command, member) {
    if (member.cpuProfile !== "arkmaGuard" && !member.isShieldDevilStyle?.()) return false;
    if (member.role !== "inner" || member.hasBall) return false;
    const arkma = this.team.find((p) => p.uniformEmblem === "arkmaLord" && !p.defeated && p.hp > 0);
    if (!arkma || arkma === member) return false;
    const area = this.config.areas?.[member.zone];

    if (
      this.ball.isFlying &&
      this.ball.kind === "shoot" &&
      this.ball.thrower?.team === this.opponentName &&
      this.ball.target === arkma
    ) {
      member.shieldAlertTimer = Math.max(member.shieldAlertTimer || 0, 0.55);
      const ballSpeed = Math.hypot(this.ball.vx, this.ball.vy) || 1;
      const leadTime = Math.min(0.22, Math.max(0.06, Math.hypot(this.ball.x - arkma.x, this.ball.y - arkma.y) / ballSpeed * 0.45));
      const intercept = {
        x: this.ball.x + this.ball.vx * leadTime,
        y: this.ball.y + this.ball.vy * leadTime
      };
      const towardArkma = this.normalizedVector(arkma.x - intercept.x, arkma.y - intercept.y);
      let point = {
        x: intercept.x + towardArkma.x * 58,
        y: intercept.y + towardArkma.y * 42
      };
      point = this.clampPointToArea(point, area, member.radius);
      this.moveToward(command, member, point.x, point.y);
      command.dash = true;
      if (Math.hypot(this.ball.x - member.x, this.ball.y - member.y) < 310) {
        command.catch = true;
      }
      return true;
    }

    const time = Date.now() / 1000;
    const side = member.team === "left" ? -1 : 1;
    const orbit = time * 2.25 + (member.id?.length || 0) * 0.7;
    let point = {
      x: arkma.x + Math.cos(orbit) * 118 + side * 28,
      y: arkma.y + Math.sin(orbit) * 86
    };
    point = this.clampPointToArea(point, area, member.radius);
    this.moveToward(command, member, point.x, point.y);
    command.dash = false;
    return true;
  }

  controlBravesPaladinGuard(command, member) {
    if (!this.isBravesPaladin(member)) return false;
    if (member.role !== "inner" || member.hasBall || member.defeated || member.hp <= 0) return false;

    if (
      this.ball.isFlying &&
      this.ball.kind === "shoot" &&
      this.ball.thrower?.team === this.opponentName &&
      this.ball.target &&
      this.ball.target.team === this.teamName &&
      this.ball.target !== member &&
      this.ball.target.role === "inner" &&
      !this.ball.target.defeated
    ) {
      const targetHpRate = this.ball.target.hp / Math.max(1, this.ball.target.maxHp || this.ball.target.hp);
      if (targetHpRate > 0.3 || !this.shouldPaladinCoverLowHpTarget(member, this.ball.target)) return false;
      const area = this.config.areas?.[member.zone];
      const ballSpeed = Math.hypot(this.ball.vx, this.ball.vy) || 1;
      const leadTime = Math.min(0.2, Math.max(0.05, Math.hypot(this.ball.x - this.ball.target.x, this.ball.y - this.ball.target.y) / ballSpeed * 0.4));
      const intercept = {
        x: this.ball.x + this.ball.vx * leadTime,
        y: this.ball.y + this.ball.vy * leadTime
      };
      const towardTarget = this.normalizedVector(this.ball.target.x - intercept.x, this.ball.target.y - intercept.y);
      const guardPoint = this.clampPointToArea({
        x: intercept.x + towardTarget.x * 46,
        y: intercept.y + towardTarget.y * 34
      }, area, member.radius);
      member.shieldAlertTimer = Math.max(member.shieldAlertTimer || 0, 0.45);
      this.moveToward(command, member, guardPoint.x, guardPoint.y);
      command.dash = true;
      if (Math.hypot(this.ball.x - member.x, this.ball.y - member.y) < 300) {
        command.catch = true;
      }
      return true;
    }

    const holder = this.ball.owner && this.ball.owner.team === this.opponentName ? this.ball.owner : null;
    if (!holder) return false;

    const target = this.getBravesPaladinProtectTarget(member, holder);
    if (!target) return false;

    const area = this.config.areas?.[member.zone];
    const holderToTarget = this.normalizedVector(target.x - holder.x, target.y - holder.y);
    const frontDistance = Math.min(155, Math.max(84, Math.hypot(target.x - holder.x, target.y - holder.y) * 0.34));
    const sideWave = Math.sin(Date.now() / 520 + member.x * 0.03) * 18;
    const side = { x: -holderToTarget.y, y: holderToTarget.x };
    const guardPoint = this.clampPointToArea({
      x: target.x - holderToTarget.x * frontDistance + side.x * sideWave,
      y: target.y - holderToTarget.y * frontDistance + side.y * sideWave
    }, area, member.radius);

    member.shieldAlertTimer = Math.max(member.shieldAlertTimer || 0, 0.28);
    this.moveToward(command, member, guardPoint.x, guardPoint.y);
    const distance = Math.hypot(member.x - guardPoint.x, member.y - guardPoint.y);
    const holderDistance = Math.hypot(member.x - holder.x, member.y - holder.y);
    command.dash = distance > 90 || holderDistance < 520;
    return true;
  }

  isBravesPaladin(member) {
    return member?.cpuProfile === "bravesPaladin" || member?.uniformEmblem === "braves-paladin";
  }

  shouldPaladinCoverLowHpTarget(member, target) {
    const serial = this.ball.flightSerial || 0;
    const key = `${serial}:${member.id}:${target.id}`;
    if (!this.paladinCoverRolls.has(key)) {
      this.paladinCoverRolls.set(key, Math.random() < 0.5);
      if (this.paladinCoverRolls.size > 40) {
        const firstKey = this.paladinCoverRolls.keys().next().value;
        this.paladinCoverRolls.delete(firstKey);
      }
    }
    return this.paladinCoverRolls.get(key);
  }

  getBravesPaladinProtectTarget(member, holder) {
    let best = null;
    let bestScore = -Infinity;
    for (const ally of this.team) {
      if (ally === member || ally.defeated || ally.hp <= 0 || ally.role !== "inner") continue;
      const hpRate = ally.hp / Math.max(1, ally.maxHp || ally.hp);
      const holderDistance = Math.hypot(ally.x - holder.x, ally.y - holder.y);
      const memberDistance = Math.hypot(member.x - ally.x, member.y - ally.y);
      const line = this.normalizedVector(ally.x - holder.x, ally.y - holder.y);
      const toPaladin = { x: member.x - holder.x, y: member.y - holder.y };
      const projection = toPaladin.x * line.x + toPaladin.y * line.y;
      const alreadyBetween = projection > 0 && projection < holderDistance ? 35 : 0;
      let score = 0;
      score += ally.captain ? 95 : 0;
      score += (1 - hpRate) * 90;
      score += Math.max(0, 560 - holderDistance) * 0.13;
      score += Math.max(0, 520 - memberDistance) * 0.05;
      score += alreadyBetween;
      if (this.ball.target === ally) score += 140;
      if (score > bestScore) {
        bestScore = score;
        best = ally;
      }
    }
    return best;
  }

  getAttackLineX(holder) {
    const area = this.config.areas ? this.config.areas[holder.zone] : null;
    const margin = Math.max(holder.radius || 36, 54);
    if (area?.trapezoid) {
      const bounds = this.getTrapezoidBoundsAtY(area.trapezoid, holder.y);
      if (bounds) {
        return holder.team === "left"
          ? bounds.right - margin
          : bounds.left + margin;
      }
    }
    if (area) {
      return holder.team === "left"
        ? area.x + area.w - margin
        : area.x + margin;
    }
    return this.config.court.centerX + (holder.team === "left" ? -82 : 82);
  }

  getBackAttackLineX(holder) {
    const area = this.config.areas ? this.config.areas[holder.zone] : null;
    const margin = Math.max(holder.radius || 36, 72);
    if (area?.trapezoid) {
      const bounds = this.getTrapezoidBoundsAtY(area.trapezoid, holder.y);
      if (bounds) {
        return holder.team === "left"
          ? bounds.left + margin
          : bounds.right - margin;
      }
    }
    if (area) {
      return holder.team === "left"
        ? area.x + margin
        : area.x + area.w - margin;
    }
    return holder.homeX;
  }

  getLooseBallChaser() {
    if (!this.ball.isLoose || this.ball.owner || this.ball.isFlying) return null;
    let best = null;
    let bestScore = Infinity;
    for (const member of this.team) {
      if (member.defeated || !this.canReachLooseBall(member)) continue;
      const distance = Math.hypot(this.ball.x - member.x, this.ball.y - member.y);
      const roleBias = member.role === "out" ? -45 : 0;
      const speedBonus = Math.max(0, (member.stats?.speed || 5) - 5) * 18;
      const score = distance + roleBias - speedBonus;
      if (score < bestScore) {
        best = member;
        bestScore = score;
      }
    }
    return best;
  }

  canReachLooseBall(member) {
    if (!this.ball.isLoose || this.ball.owner || this.ball.isFlying) return false;
    if (this.config.canAcquireBallAt && !this.config.canAcquireBallAt(member, this.ball.x, this.ball.y)) {
      return false;
    }
    const area = this.config.areas ? this.config.areas[member.zone] : null;
    if (!area) return false;
    if (member.role === "out" && this.isLooseBallInTeamOutfield()) return true;
    const margin = member.role === "inner" ? 120 : 150;
    const inOwnZone = (
      this.ball.x >= area.x - margin &&
      this.ball.x <= area.x + area.w + margin &&
      this.ball.y >= area.y - margin &&
      this.ball.y <= area.y + area.h + margin
    );
    const nearby = Math.hypot(this.ball.x - member.x, this.ball.y - member.y) < (member.role === "inner" ? 760 : 980);
    return inOwnZone || nearby;
  }

  isLooseBallInTeamOutfield() {
    if (this.config.isOutfieldBallForTeam) {
      return this.config.isOutfieldBallForTeam(this.teamName, this.ball.x, this.ball.y);
    }

    const zones = this.teamName === "left"
      ? ["rightTopOut", "rightBottomOut", "rightSideOut"]
      : ["leftTopOut", "leftBottomOut", "leftSideOut"];
    const margin = 60;

    return zones.some((zone) => {
      const area = this.config.areas?.[zone];
      if (!area) return false;
      const bounds = this.getAreaBounds(area);
      return (
        this.ball.x >= bounds.x - margin &&
        this.ball.x <= bounds.x + bounds.w + margin &&
        this.ball.y >= bounds.y - margin &&
        this.ball.y <= bounds.y + bounds.h + margin
      );
    });
  }

  getFriendlyFlyingShotChaser() {
    if (!this.ball.isFlying || this.ball.kind !== "shoot" || !this.ball.thrower) return null;
    if (this.ball.thrower.team !== this.teamName || this.ball.owner) return null;
    let best = null;
    let bestScore = Infinity;
    for (const member of this.team) {
      if (member.defeated || member === this.ball.thrower) continue;
      const area = this.config.areas ? this.config.areas[member.zone] : null;
      if (!area) continue;
      const bounds = this.getAreaBounds(area);
      const ballNearZone = (
        this.ball.x >= bounds.x - 220 &&
        this.ball.x <= bounds.x + bounds.w + 220 &&
        this.ball.y >= bounds.y - 180 &&
        this.ball.y <= bounds.y + bounds.h + 180
      );
      const distance = Math.hypot(this.ball.x - member.x, this.ball.y - member.y);
      if (!ballNearZone && distance > 820) continue;
      const forwardSideBonus = member.role === "out" ? -180 : 0;
      const speedBonus = Math.max(0, (member.stats?.speed || 5) - 5) * 20;
      const score = distance + forwardSideBonus - speedBonus;
      if (score < bestScore) {
        best = member;
        bestScore = score;
      }
    }
    return best;
  }

  evadeHolder(command, member, holder, plan) {
    const target = plan.target || this.getBestEvasionPoint(member, holder).point;
    if (!target) {
      this.stop(command);
      return;
    }

    const now = Date.now();
    const distance = Math.hypot(member.x - target.x, member.y - target.y);
    if (distance <= 40 && !plan.arrivalHoldCompleted) {
      if (!plan.holdUntil) {
        plan.holdUntil = now + 400 + Math.random() * 400;
        plan.expiresAt = Math.max(plan.expiresAt || 0, plan.holdUntil);
      }
      if (now < plan.holdUntil) {
        this.stop(command);
        return;
      }
      plan.arrivalHoldCompleted = true;
      plan.expiresAt = 0;
      this.stop(command);
      return;
    }

    this.moveToward(command, member, target.x, target.y);
    const holderDistance = Math.hypot(member.x - holder.x, member.y - holder.y);
    command.dash = distance > 220 && holderDistance < 600;
  }

  controlWithoutBall(command, member, holder) {
    if (member.hp / Math.max(1, member.maxHp) <= 0.32) {
      this.retreatLowHp(command, member, holder);
      return;
    }

    if (this.getPassCutDefender(holder) === member) {
      const receiver = this.getLikelyPassReceiver(holder);
      if (receiver) {
        const area = this.config.areas?.[member.zone];
        const intercept = this.clampPointToArea({
          x: holder.x + (receiver.x - holder.x) * 0.58,
          y: holder.y + (receiver.y - holder.y) * 0.58
        }, area, member.radius);
        this.moveToward(command, member, intercept.x, intercept.y);
        command.dash = Math.hypot(member.x - intercept.x, member.y - intercept.y) > 160;
        return;
      }
    }

    const plan = this.getEvasionPlan(member, holder);
    if (plan.type === "side-step") {
      const area = this.config.areas ? this.config.areas[member.zone] : null;
      const wave = Math.sin(Date.now() / plan.speed + member.x * 0.03);
      const x = member.homeX + wave * plan.width;
      const y = member.homeY + Math.cos(Date.now() / (plan.speed * 1.2) + member.y * 0.02) * 42;
      const point = this.clampPointToArea({ x, y }, area, member.radius);
      this.moveToward(command, member, point.x, point.y);
      command.dash = false;
      return;
    }

    this.evadeHolder(command, member, holder, plan);
  }

  retreatLowHp(command, member, holder) {
    const area = this.config.areas?.[member.zone];
    const bounds = this.getAreaBounds(area);
    const retreatX = member.team === "left"
      ? bounds.x + member.radius + 32
      : bounds.x + bounds.w - member.radius - 32;
    const teammates = this.team.filter((candidate) => candidate.role === "inner" && !candidate.defeated);
    const index = Math.max(0, teammates.indexOf(member));
    const retreatY = bounds.y + bounds.h * ((index + 1) / (teammates.length + 1));
    const point = this.clampPointToArea({ x: retreatX, y: retreatY }, area, member.radius);
    this.moveToward(command, member, point.x, point.y);
    command.dash = Math.hypot(member.x - holder.x, member.y - holder.y) < 520;
  }

  getPassCutDefender(holder) {
    const now = Date.now();
    const assigned = this.team.find((member) => (
      member.id === this.passCutAssignment?.defenderId &&
      !member.defeated
    ));
    if (
      assigned &&
      this.passCutAssignment.holderId === holder.id &&
      this.passCutAssignment.expiresAt > now
    ) {
      return assigned;
    }

    const candidates = this.team.filter((member) => (
      !member.defeated &&
      member.role === "inner" &&
      member.hp / Math.max(1, member.maxHp) > 0.32
    ));
    const defender = [...candidates].sort((a, b) => {
      const aScore = (a.stats?.technique || 5) * 2 + (a.stats?.speed || 5) - Math.hypot(a.x - holder.x, a.y - holder.y) * 0.004;
      const bScore = (b.stats?.technique || 5) * 2 + (b.stats?.speed || 5) - Math.hypot(b.x - holder.x, b.y - holder.y) * 0.004;
      return bScore - aScore;
    })[0] || null;
    this.passCutAssignment = {
      holderId: holder.id,
      defenderId: defender?.id || null,
      expiresAt: now + 350 + Math.random() * 250
    };
    return defender;
  }

  getLikelyPassReceiver(holder) {
    const now = Date.now();
    const predicted = this.opponents.find((member) => (
      member.id === this.passReceiverPrediction?.receiverId &&
      !member.defeated &&
      member !== holder
    ));
    if (
      predicted &&
      this.passReceiverPrediction.holderId === holder.id &&
      this.passReceiverPrediction.expiresAt > now
    ) {
      return predicted;
    }

    const active = this.opponents.filter((member) => !member.defeated && member !== holder);
    const receiver = [...active].sort((a, b) => {
      const aDistance = Math.hypot(a.x - holder.x, a.y - holder.y);
      const bDistance = Math.hypot(b.x - holder.x, b.y - holder.y);
      const aScore = (a.role === "out" ? 150 : 0) + Math.abs(a.y - holder.y) * 0.22 - aDistance * 0.08;
      const bScore = (b.role === "out" ? 150 : 0) + Math.abs(b.y - holder.y) * 0.22 - bDistance * 0.08;
      return bScore - aScore;
    })[0] || null;
    this.passReceiverPrediction = {
      holderId: holder.id,
      receiverId: receiver?.id || null,
      expiresAt: now + 350 + Math.random() * 250
    };
    return receiver;
  }

  isNearJumpApex(member) {
    return member.jumpZ > 88 && Math.abs(member.jumpVelocity) < 145;
  }

  hasStaleApexChargePlan(plan) {
    if (!plan.chargeStarted || !plan.startedAt) return false;
    const elapsed = Date.now() - plan.startedAt;
    return elapsed > (plan.chargeTime + 1.45) * 1000;
  }

  resetHolderPlanSoon() {
    this.holderPlan = null;
    this.throwTimer = 0.16 + Math.random() * 0.16;
  }

  facePoint(command, member, x, y) {
    const dx = x - member.x;
    const dy = y - member.y;
    const length = Math.hypot(dx, dy) || 1;
    command.moveX = dx / length * 0.18;
    command.moveY = dy / length * 0.18;
  }

  getEvasionPlan(member, holder) {
    const key = member.id;
    let current = this.evasionPlans.get(key);
    const now = Date.now();
    const preparingShot = this.isHolderPreparingShot(holder);
    if (current?.holderId !== holder.id || current?.arrivalHoldCompleted) current = null;
    if (current?.type === "side-step" && !preparingShot) current = null;

    if (current) {
      if (current.holdUntil > now || current.nextDecisionAt > now) return current;
      current.nextDecisionAt = now + 350 + Math.random() * 250;
      if (current.targetLockUntil > now) return current;
    }

    const useSideStep = preparingShot && Math.random() < 0.22;
    const best = useSideStep ? null : this.getBestEvasionPoint(member, holder);
    if (current?.type === "run-away" && best) {
      const currentScore = this.scoreEvasionPoint(member, holder, current.target);
      const requiredImprovement = Math.max(80, Math.abs(currentScore) * 0.15);
      if (best.score < currentScore + requiredImprovement) {
        current.targetLockUntil = now + 400 + Math.random() * 300;
        current.expiresAt = current.targetLockUntil;
        return current;
      }
    }

    const lockDuration = 800 + Math.random() * 600;
    const plan = {
      holderId: holder.id,
      type: useSideStep ? "side-step" : "run-away",
      width: 80 + Math.random() * 90,
      speed: 260 + Math.random() * 220,
      target: best?.point || null,
      targetScore: best?.score ?? -Infinity,
      nextDecisionAt: now + 350 + Math.random() * 250,
      targetLockUntil: now + lockDuration,
      expiresAt: now + lockDuration,
      holdUntil: 0,
      arrivalHoldCompleted: false
    };
    this.evasionPlans.set(key, plan);
    return plan;
  }

  isHolderPreparingShot(holder) {
    return Boolean(
      holder &&
      this.ball.owner === holder &&
      holder.state === "throwing"
    );
  }

  getBestEvasionPoint(member, holder) {
    const area = this.config.areas ? this.config.areas[member.zone] : null;
    const away = this.normalizedVector(member.x - holder.x, member.y - holder.y);
    const retreatDirection = member.team === "left" ? -1 : 1;
    const candidates = [
      { x: member.x + away.x * 360, y: member.y + away.y * 240 },
      { x: member.homeX + retreatDirection * 260, y: member.homeY - 170 },
      { x: member.homeX + retreatDirection * 300, y: member.homeY + 170 },
      { x: member.homeX + retreatDirection * 430, y: member.homeY },
      { x: member.homeX + retreatDirection * 180, y: member.homeY }
    ];

    let point = null;
    let score = -Infinity;
    for (const candidate of candidates) {
      const clamped = this.clampPointToArea(candidate, area, member.radius);
      const candidateScore = this.scoreEvasionPoint(member, holder, clamped);
      if (candidateScore > score) {
        point = clamped;
        score = candidateScore;
      }
    }
    return { point, score };
  }

  scoreEvasionPoint(member, holder, point) {
    if (!point) return -Infinity;
    const holderDistance = Math.hypot(point.x - holder.x, point.y - holder.y);
    const teammatePenalty = this.teammateCrowding(member, point.x, point.y);
    const homePenalty = Math.hypot(point.x - member.homeX, point.y - member.homeY) * 0.06;
    return holderDistance * 1.45 - teammatePenalty * 1.8 - homePenalty;
  }

  reactToIncomingBall(delta) {
    const ballComing = this.ball.isFlying && this.ball.kind === "shoot" && this.ball.thrower && this.ball.thrower.team === this.opponentName;
    if (!ballComing) {
      this.catchDelayPlans.clear();
      return;
    }

    this.reactionTimer -= delta;
    if (this.reactionTimer > 0 && !this.hasUrgentDefender()) return;

    const activeInner = this.team.filter((p) => p.role === "inner" && !p.defeated);
    const oneOnOneDefense = Boolean(this.config.oneOnOneMode);
    for (const member of activeInner) {
      const command = this.commands.get(member.id);
      if (this.applyDelayedCatch(command, member, delta)) continue;
      const distance = Math.hypot(this.ball.x - member.x, this.ball.y - member.y);
      const technique = member.stats?.technique || 5;
      const speed = member.stats?.speed || 5;
      const jump = member.stats?.jump || 5;
      const defenseStat = Math.max(technique, speed, jump);
      const maxReactDistance = (member.cpuProfile === "hinomaruBombers" ? 620 : 430) +
        Math.max(0, defenseStat - 5) * 36;
      const effectiveReactDistance = oneOnOneDefense
        ? maxReactDistance * CPU_ONE_ON_ONE_DEFENSE.reactDistanceScale
        : maxReactDistance;
      if (distance > effectiveReactDistance) continue;

      const facingQuality = this.getIncomingFacingQuality(member);
      const frontShot = facingQuality === "front";
      const nearShot = distance < 210;
      const closePanic = distance < 145;
      const targeted = this.ball.target === member;
      const laneThreat = targeted || Math.abs(this.ball.y - member.y) < 105 + Math.max(0, speed - 5) * 9;
      const throwerDistance = this.ball.thrower ? Math.hypot(this.ball.thrower.x - member.x, this.ball.thrower.y - member.y) : distance;
      const closeRangeThreat = (
        throwerDistance < CPU_CLOSE_SHOT_DEFENSE.throwerDistance &&
        distance < CPU_CLOSE_SHOT_DEFENSE.ballDistance &&
        laneThreat
      );
      const catchFrontShot = frontShot || (targeted && this.isBallMovingToward(member));
      const farShot = throwerDistance > 520 || distance > 260;
      const quickDefender = defenseStat >= 7;
      const readyToReact = frontShot && (farShot || (quickDefender && nearShot));
      const specialShot = Boolean(this.ball.specialShotType);
      const counterShot = Boolean(this.ball.counterShot);
      const quickShot = Boolean(this.ball.quickShot);
      const normalShot = !specialShot && !counterShot && !quickShot;
      const incomingSpeed = Math.hypot(this.ball.vx || 0, this.ball.vy || 0);
      const fastShot = specialShot && incomingSpeed >= CPU_ONE_ON_ONE_DEFENSE.fastShotSpeed;
      const shotMultiplier = this.ball.shotMultiplier || 1;
      const strongShot = specialShot || shotMultiplier >= 1.28 || this.ball.power >= 28;
      const strongNormalShot = normalShot && (shotMultiplier >= 1.28 || this.ball.power >= 28);
      const weakShot = !specialShot && shotMultiplier <= 1.08 && this.ball.power <= 23;
      const speedBoost = 1 + Math.max(0, speed - 5) * 0.26;
      const jumpBoost = 1 + Math.max(0, jump - 5) * 0.25;
      const dodgeChance = strongShot
        ? readyToReact ? 0.9 : frontShot ? 0.72 : 0.3
        : readyToReact ? 0.42 : frontShot ? 0.28 : 0.14;
      let catchChance = this.config.cpuCatchChance * 0.16;
      if (weakShot) {
        catchChance = (readyToReact || catchFrontShot)
          ? this.config.cpuCatchChance * 2.4
          : this.config.cpuCatchChance * 0.35;
      } else if (specialShot) {
        catchChance = catchFrontShot
          ? this.config.cpuCatchChance * 0.5333
          : this.config.cpuCatchChance * 0.024;
      } else if (strongShot) {
        catchChance = catchFrontShot
          ? this.config.cpuCatchChance * 1.7
          : this.config.cpuCatchChance * 0.06;
      } else {
        catchChance = (readyToReact || catchFrontShot)
          ? this.config.cpuCatchChance * 2.1
          : this.config.cpuCatchChance * 0.16;
      }
      const catchScale = member.cpuProfile === "townDodgies" ? 0.42 : 1;
      const dodgeScale = member.cpuProfile === "townDodgies" ? 1.22 : 1;
      let profileCatchScale = member.cpuProfile === "hinomaruBombers" ? (frontShot ? 2.15 : 1.25) : catchScale;
      let profileDodgeScale = member.cpuProfile === "hinomaruBombers" ? 0.78 : dodgeScale;
      if (member.cpuProfile === "hinomaruBombers" && frontShot && farShot) {
        profileCatchScale = strongShot ? 1.7 : 2.9;
        profileDodgeScale = strongShot ? 1.16 : 1.34;
      } else if (member.cpuProfile === "hinomaruBombers" && frontShot) {
        profileCatchScale = strongShot ? 1.25 : 2.45;
        profileDodgeScale = strongShot ? 1.12 : 0.96;
      }
      const robotOverdrive = this.isRobotOverdrive(member);
      if (robotOverdrive) {
        profileDodgeScale *= ROBOT_OVERDRIVE_CONFIG.dodgeChanceScale;
        if (strongShot) {
          profileCatchScale *= ROBOT_OVERDRIVE_CONFIG.strongShotCatchScale;
        }
      }
      const victoryCatchScale = member.getVictoryMarchCatchScale?.() ?? 1;
      let catchDistance = (member.cpuProfile === "hinomaruBombers" && catchFrontShot ? 560 : (weakShot ? 360 : 280)) * victoryCatchScale;
      if (oneOnOneDefense) catchDistance *= CPU_ONE_ON_ONE_DEFENSE.reactDistanceScale;
      const closeCatchScale = distance < 260
        ? 0.8 + Math.max(0, distance - 180) / 80 * 0.2
        : 1;
      const baseCatchRoll = catchChance * profileCatchScale * this.getCatchRollScale() * victoryCatchScale;
      let catchRoll = baseCatchRoll * closeCatchScale;
      const catchCap = this.ball.counterShot ? CPU_CATCH_TUNING.counterCatchCap : 0.94;
      const dodgeScaleByShot = this.getDodgeRollScale(distance);
      let dodgeRoll = dodgeChance * profileDodgeScale * Math.max(speedBoost, jumpBoost) * dodgeScaleByShot;
      const closeDodgeRoll = this.getCloseRangeDodgeChance(speed, distance, targeted, robotOverdrive) * dodgeScaleByShot;
      const targetedFrontNormalShot = targeted && catchFrontShot && normalShot;
      if (oneOnOneDefense && targetedFrontNormalShot) {
        catchRoll *= CPU_ONE_ON_ONE_DEFENSE.normalFrontCatchScale;
      }
      if (oneOnOneDefense && this.ball.counterShot) {
        catchRoll *= CPU_ONE_ON_ONE_DEFENSE.counterCatchScale;
      }
      if (oneOnOneDefense && specialShot) {
        dodgeRoll *= CPU_ONE_ON_ONE_DEFENSE.specialDodgeScale;
      } else if (oneOnOneDefense && fastShot) {
        dodgeRoll *= CPU_ONE_ON_ONE_DEFENSE.fastDodgeScale;
      }
      const cappedCatchRoll = Math.min(catchCap, catchRoll);
      const counterCatchDistance = catchDistance * (oneOnOneDefense ? CPU_ONE_ON_ONE_DEFENSE.counterCatchDistanceScale : 1);
      const counterCatchRoll = this.getCounterCatchChance(technique);
      const normalCatchRoll = this.getNormalCatchChance(
        technique,
        facingQuality,
        closeRangeThreat,
        strongNormalShot
      );
      if (counterShot && catchFrontShot && distance < counterCatchDistance && Math.random() < Math.max(cappedCatchRoll, counterCatchRoll)) {
        if (this.scheduleDelayedCatch(member, CPU_ONE_ON_ONE_DEFENSE.catchDelayAdvance)) {
          this.reportShotDefense(member, "catch", Math.max(cappedCatchRoll, counterCatchRoll), oneOnOneDefense ? "1on1 counter priority" : "counter priority");
        }
        continue;
      }
      if (oneOnOneDefense && laneThreat && !counterShot && (specialShot || fastShot) && Math.random() < Math.min(0.97, dodgeRoll)) {
        this.reportShotDefense(member, "dodge", Math.min(0.97, dodgeRoll), specialShot ? "1on1 special priority" : "1on1 fast priority");
        this.dodgeIncomingShot(command, member, true, {
          speed,
          jump,
          closePanic,
          closeRange: distance < 320,
          robotOverdrive
        });
        continue;
      }
      const targetedNormalCatchRoll = Math.max(Math.min(catchCap, catchRoll), normalCatchRoll);
      if (targetedFrontNormalShot && distance < catchDistance && Math.random() < targetedNormalCatchRoll) {
        if (this.scheduleDelayedCatch(member, oneOnOneDefense ? CPU_ONE_ON_ONE_DEFENSE.catchDelayAdvance : 0)) {
          this.reportShotDefense(member, "キャッチ試行", targetedNormalCatchRoll, "正面優先");
        }
      } else if (normalShot && facingQuality !== "back" && distance < catchDistance && Math.random() < normalCatchRoll) {
        if (this.scheduleDelayedCatch(member, oneOnOneDefense ? CPU_ONE_ON_ONE_DEFENSE.catchDelayAdvance : 0)) {
          this.reportShotDefense(member, "キャッチ試行", normalCatchRoll, facingQuality === "side" ? "側面通常" : "通常");
        }
      } else if (closeRangeThreat && Math.random() < closeDodgeRoll) {
        this.reportShotDefense(member, "回避試行", Math.min(0.97, closeDodgeRoll), "近距離");
        this.dodgeIncomingShot(command, member, true, {
          speed,
          jump,
          closePanic,
          closeRange: true,
          robotOverdrive
        });
      } else if (!targetedFrontNormalShot && catchFrontShot && distance < catchDistance && Math.random() < Math.min(catchCap, catchRoll)) {
        if (this.scheduleDelayedCatch(member, oneOnOneDefense ? CPU_ONE_ON_ONE_DEFENSE.catchDelayAdvance : 0)) {
          this.reportShotDefense(member, "キャッチ試行", cappedCatchRoll);
        }
      } else if (laneThreat && Math.random() < Math.min(0.97, dodgeRoll)) {
        this.reportShotDefense(member, "回避試行", Math.min(0.97, dodgeRoll));
        this.dodgeIncomingShot(command, member, readyToReact || strongShot || closePanic, {
          speed,
          jump,
          closePanic,
          robotOverdrive
        });
      }
      if (laneThreat && distance < 260 && !command.catch && !command.crouch && !command.jump) {
        command.moveX *= 0.65;
        command.moveY *= 0.65;
        command.dash = false;
      }
    }

    this.reactionTimer = this.randomReaction();
  }

  getCatchRollScale() {
    let scale = CPU_CATCH_TUNING.globalScale;
    if (this.ball.specialShotType) {
      const difficulty = CATCH_DIFFICULTY?.[this.ball.specialShotType] || CATCH_DIFFICULTY?.normal;
      scale *= difficulty?.cpuCatchAttemptScale ?? 1;
    }
    if (this.ball.counterShot) {
      scale *= CPU_CATCH_TUNING.counterScale;
      scale *= (this.ball.counterChainCount || 0) >= 1
        ? CPU_CATCH_TUNING.counterChainAttemptScale
        : CPU_CATCH_TUNING.counterAttemptScale;
    }
    return scale;
  }

  reportShotDefense(member, action, chance, detail = "") {
    if (this.ball?.kind === "shoot" && this.ball.target && member !== this.ball.target) return;
    this.config.onShotDefenseEvent?.({
      player: member,
      action,
      chance,
      detail
    });
  }

  getDodgeRollScale(distance) {
    const specialShot = Boolean(this.ball.specialShotType);
    if (specialShot) {
      const closeScale = distance < 300
        ? 0.22 + Math.max(0, distance - 180) / 120 * 0.78
        : 1;
      const activeInner = this.team.filter((member) => member.role === "inner" && !member.defeated && member.hp > 0).length;
      const lateMemberScale = activeInner <= 2 ? 0.75 : 1;
      return closeScale * 0.65 * 0.8 * 1.15 * lateMemberScale;
    }
    if (!this.ball.counterShot && distance < 260) {
      return 0.65 + Math.max(0, distance - 160) / 100 * 0.35;
    }
    return 1;
  }

  getCounterCatchChance(technique) {
    const value = Math.max(1, Math.min(20, technique || 5));
    return Math.max(
      CPU_COUNTER_CATCH.minChance,
      Math.min(
        CPU_COUNTER_CATCH.maxChance,
        CPU_COUNTER_CATCH.baseChance +
          (value - CPU_COUNTER_CATCH.baseTechnique) * CPU_COUNTER_CATCH.chancePerTechnique
      )
    );
  }

  getNormalCatchChance(technique, facingQuality, closeRange, strongShot) {
    if (facingQuality === "back") return 0;

    const value = Math.max(1, Math.min(20, technique || 5));
    const baseChance = facingQuality === "side"
      ? CPU_NORMAL_CATCH.sideChance
      : closeRange
        ? CPU_NORMAL_CATCH.closeChance
        : strongShot
          ? CPU_NORMAL_CATCH.strongChance
          : CPU_NORMAL_CATCH.frontChance;
    return Math.max(
      CPU_NORMAL_CATCH.minChance,
      Math.min(
        CPU_NORMAL_CATCH.maxChance,
        baseChance + (value - CPU_NORMAL_CATCH.baseTechnique) * CPU_NORMAL_CATCH.chancePerTechnique
      )
    );
  }

  isBravesMartialArtist(member) {
    return member?.uniformEmblem === "braves-martialArtist";
  }

  scheduleDelayedCatch(member, delayAdvance = 0) {
    if (this.catchDelayPlans.has(member.id)) return false;
    const baseDelay = CPU_CATCH_TUNING.delayMin + Math.random() * (CPU_CATCH_TUNING.delayMax - CPU_CATCH_TUNING.delayMin);
    this.catchDelayPlans.set(member.id, {
      flightSerial: this.ball.flightSerial || 0,
      timer: Math.max(0, baseDelay - delayAdvance)
    });
    return true;
  }

  applyDelayedCatch(command, member, delta) {
    const plan = this.catchDelayPlans.get(member.id);
    if (!plan) return false;
    if (plan.flightSerial !== (this.ball.flightSerial || 0)) {
      this.catchDelayPlans.delete(member.id);
      return false;
    }
    plan.timer -= delta;
    if (plan.timer > 0) return true;
    this.catchDelayPlans.delete(member.id);
    command.catch = true;
    return true;
  }

  hasUrgentDefender() {
    for (const member of this.team) {
      if (member.defeated || member.role !== "inner") continue;
      const stats = member.stats || {};
      const defenseStat = Math.max(stats.technique || 5, stats.speed || 5, stats.jump || 5);
      const distance = Math.hypot(this.ball.x - member.x, this.ball.y - member.y);
      const speed = stats.speed || 5;
      const targeted = this.ball.target === member;
      const laneThreat = targeted || Math.abs(this.ball.y - member.y) < 126;
      const throwerDistance = this.ball.thrower
        ? Math.hypot(this.ball.thrower.x - member.x, this.ball.thrower.y - member.y)
        : Infinity;
      const urgentDistance = CPU_CLOSE_SHOT_DEFENSE.urgentDistance +
        Math.max(0, speed - 5) * CPU_CLOSE_SHOT_DEFENSE.urgentDistancePerSpeed;
      if (
        throwerDistance < CPU_CLOSE_SHOT_DEFENSE.throwerDistance &&
        distance < urgentDistance &&
        laneThreat
      ) return true;
      if (defenseStat < 7) continue;
      if (distance < 230 && laneThreat) return true;
    }
    return false;
  }

  getCloseRangeDodgeChance(speed, distance, targeted, robotOverdrive = false) {
    const speedBonus = (Math.max(1, Math.min(20, speed)) - 5) * CPU_CLOSE_SHOT_DEFENSE.dodgeChancePerSpeed;
    const targetBonus = targeted ? CPU_CLOSE_SHOT_DEFENSE.targetedBonus : 0;
    const panicBonus = distance < 170 ? CPU_CLOSE_SHOT_DEFENSE.panicBonus : 0;
    return Math.max(0.32, Math.min(
      CPU_CLOSE_SHOT_DEFENSE.maxDodgeChance,
      CPU_CLOSE_SHOT_DEFENSE.baseDodgeChance + speedBonus + targetBonus + panicBonus +
        (robotOverdrive ? ROBOT_OVERDRIVE_CONFIG.closeDodgeBonus : 0)
    ));
  }

  getCloseRangeDodgeSuccessChance(speed, closePanic) {
    const speedBonus = (Math.max(1, Math.min(20, speed)) - 5) * CPU_CLOSE_SHOT_DEFENSE.successChancePerSpeed;
    const panicBonus = closePanic ? CPU_CLOSE_SHOT_DEFENSE.panicBonus : 0;
    return Math.max(0.38, Math.min(
      CPU_CLOSE_SHOT_DEFENSE.maxSuccessChance,
      CPU_CLOSE_SHOT_DEFENSE.baseSuccessChance + speedBonus + panicBonus
    ));
  }

  dodgeIncomingShot(command, member, readyToReact, traits = {}) {
    const speed = traits.speed ?? member.stats?.speed ?? 5;
    const jump = traits.jump ?? member.stats?.jump ?? 5;
    const dodgeRoll = Math.random();
    const speedBias = Math.max(0, speed - 5) * 0.08;
    const jumpBias = Math.max(0, jump - 5) * 0.1;
    const closeDodgeSuccess = traits.closeRange
      ? Math.min(
        CPU_CLOSE_SHOT_DEFENSE.maxSuccessChance,
        this.getCloseRangeDodgeSuccessChance(speed, traits.closePanic) +
          (traits.robotOverdrive ? ROBOT_OVERDRIVE_CONFIG.closeDodgeBonus : 0)
      )
      : 0;
    if (traits.closeRange && dodgeRoll < closeDodgeSuccess) {
      command.crouch = true;
    } else if (!traits.closeRange && dodgeRoll < 0.3 - Math.min(0.16, speedBias + jumpBias * 0.5)) {
      command.crouch = true;
    } else if (dodgeRoll < (traits.closeRange ? closeDodgeSuccess + 0.12 : 0.58 + jumpBias) && member.jumpZ <= 0 && member.jumpVelocity <= 0) {
      command.jump = true;
    }
    const incomingSpeed = Math.hypot(this.ball.vx, this.ball.vy) || 1;
    const perpendicularX = -this.ball.vy / incomingSpeed;
    const perpendicularY = this.ball.vx / incomingSpeed;
    const awayY = member.y < this.config.court.y + this.config.court.h * 0.5 ? 1 : -1;
    const side = Math.random() < 0.5 ? -1 : 1;
    const lateralStrength = (speed >= 7 ? 1 : 0.62) * (traits.robotOverdrive ? 1.08 : 1);
    command.moveX = perpendicularX * side * lateralStrength + (this.ball.vx > 0 ? -0.28 : 0.28);
    command.moveY = perpendicularY * side * lateralStrength + awayY * (speed >= 7 ? 0.42 : 0.26);
    const length = Math.hypot(command.moveX, command.moveY) || 1;
    command.moveX /= length;
    command.moveY /= length;
    command.dash = readyToReact || speed >= 7 || traits.closePanic;
  }

  isFrontShot(member) {
    return this.getIncomingFacingQuality(member) === "front";
  }

  getIncomingFacingQuality(member) {
    const incomingX = -this.ball.vx;
    const incomingY = -this.ball.vy;
    const incomingLength = Math.hypot(incomingX, incomingY) || 1;
    const direction = member.visualDirection;
    const facingX = direction === "up" || direction === "down"
      ? 0
      : member.facing || (direction === "left" ? -1 : 1);
    const facingY = direction === "up" ? -1 : direction === "down" ? 1 : 0;
    const dot = incomingX / incomingLength * facingX + incomingY / incomingLength * facingY;
    if (dot >= 0.55) return "front";
    if (dot >= -0.35) return "side";
    return "back";
  }

  isBallMovingToward(member) {
    const speed = Math.hypot(this.ball.vx || 0, this.ball.vy || 0);
    if (speed <= 0.001) return false;
    const toMemberX = member.x - this.ball.x;
    const toMemberY = member.y - this.ball.y;
    const distance = Math.hypot(toMemberX, toMemberY);
    if (distance <= 0.001) return true;
    const dot = ((this.ball.vx || 0) / speed) * (toMemberX / distance) +
      ((this.ball.vy || 0) / speed) * (toMemberY / distance);
    return dot >= 0.35;
  }

  reactToFriendlyBall() {
    if (!this.ball.isFlying || !this.ball.thrower || this.ball.thrower.team !== this.teamName) return;
    if (!this.ball.target || this.ball.target.team !== this.teamName) return;

    const receiver = this.ball.target;
    if (receiver.defeated || receiver === this.ball.thrower) return;

    const command = this.commands.get(receiver.id);
    if (!command) return;

    const distance = Math.hypot(this.ball.x - receiver.x, this.ball.y - (receiver.y - 34));
    const specialReceiver = (
      this.specialAttackState &&
      receiver.id === this.specialAttackState.shooterId
    );
    if (specialReceiver) {
      this.moveToward(command, receiver, this.ball.x, this.ball.y);
      command.dash = true;
    }
    if (distance < (specialReceiver ? 260 : 190)) {
      command.catch = true;
    }
  }

  reactToEnemyPass() {
    if (!this.ball.isFlying || this.ball.kind !== "pass" || !this.ball.thrower || this.ball.thrower.team !== this.opponentName) return;

    for (const member of this.team.filter((p) => !p.defeated)) {
      const command = this.commands.get(member.id);
      const ballY = this.ball.y - this.ball.z;
      const handX = member.x + member.facing * 45;
      const handY = member.y - member.jumpZ - 72;
      const handDistance = Math.hypot(this.ball.x - handX, ballY - handY);
      const bodyDistance = Math.hypot(this.ball.x - member.x, ballY - (member.y - 58));
      const ballInFront = (this.ball.x - member.x) * member.facing > 0;
      const veryClose = handDistance < 46 && bodyDistance < 76;
      const technique = member.stats?.technique || 5;
      if (this.tryMartialArtistAerialPassCut(command, member, handDistance, bodyDistance, ballInFront)) continue;
      const cutChanceBase = Math.max(0.16, Math.min(0.72, 0.22 + (technique - 5) * 0.045));
      const cutChance = this.ball.devilTrianglePass ? cutChanceBase * 0.08 : cutChanceBase;
      if (!ballInFront || !veryClose || Math.random() > cutChance) continue;
      command.catch = true;
      if (this.ball.z > 120 && handDistance < 42 && member.jumpZ <= 0 && member.jumpVelocity <= 0 && Math.random() < 0.25) command.jump = true;
    }
  }

  tryMartialArtistAerialPassCut(command, member, handDistance, bodyDistance, ballInFront) {
    if (!command || !member || member.uniformEmblem !== "braves-martialArtist") return false;
    if (this.ball.z < CPU_MARTIAL_ARTIST_AERIAL_PASS_CUT.minBallZ) return false;
    if (member.downTimer > 0 || member.hitRecoveryTimer > 0 || member.stunTimer > 0) return false;

    const serial = this.ball.flightSerial || 0;
    const key = `${serial}:${member.id}`;
    let roll = this.martialArtistAerialPassCutRolls.get(key);
    if (roll === undefined) {
      if (this.martialArtistAerialPassCutRolls.size > 40) this.martialArtistAerialPassCutRolls.clear();
      roll = Math.random();
      this.martialArtistAerialPassCutRolls.set(key, roll);
    }

    const jump = member.stats?.jump || 5;
    const technique = member.stats?.technique || 5;
    let chance = CPU_MARTIAL_ARTIST_AERIAL_PASS_CUT.baseChance +
      Math.max(0, jump - 12) * CPU_MARTIAL_ARTIST_AERIAL_PASS_CUT.jumpChanceBonus +
      Math.max(0, technique - 10) * CPU_MARTIAL_ARTIST_AERIAL_PASS_CUT.techniqueChanceBonus;
    chance = Math.min(CPU_MARTIAL_ARTIST_AERIAL_PASS_CUT.maxChance, chance);
    if (this.ball.devilTrianglePass) chance *= CPU_MARTIAL_ARTIST_AERIAL_PASS_CUT.devilTriangleScale;
    if (roll > chance) return false;

    const area = this.config.areas?.[member.zone];
    const lead = CPU_MARTIAL_ARTIST_AERIAL_PASS_CUT.leadTime;
    const intercept = this.clampPointToArea({
      x: this.ball.x + this.ball.vx * lead,
      y: this.ball.y + this.ball.vy * lead
    }, area, member.radius);
    const groundDistance = Math.hypot(member.x - intercept.x, member.y - intercept.y);
    if (groundDistance > CPU_MARTIAL_ARTIST_AERIAL_PASS_CUT.maxGroundDistance) return false;

    this.moveToward(command, member, intercept.x, intercept.y);
    command.dash = groundDistance > 80;

    const grounded = member.jumpZ <= 0 && member.jumpVelocity <= 0;
    if (
      grounded &&
      groundDistance < CPU_MARTIAL_ARTIST_AERIAL_PASS_CUT.jumpDistance &&
      this.ball.z > CPU_MARTIAL_ARTIST_AERIAL_PASS_CUT.minBallZ + 18
    ) {
      command.jump = true;
    }

    const catchReady = (
      ballInFront &&
      handDistance < CPU_MARTIAL_ARTIST_AERIAL_PASS_CUT.catchHandDistance &&
      bodyDistance < CPU_MARTIAL_ARTIST_AERIAL_PASS_CUT.catchBodyDistance
    );
    if (catchReady) {
      command.catch = true;
      command.dash = false;
    }
    return true;
  }

  faceNearestThreat(command, member) {
    const target = this.nearestActiveOpponent(member);
    if (!target) {
      this.stop(command);
      return;
    }
    this.moveToward(command, member, member.x + Math.sign(target.x - member.x) * 12, target.y);
  }

  moveToHome(command, member) {
    if (member.role === "inner") {
      this.moveToward(command, member, member.homeX, member.homeY + Math.sin(Date.now() / 700 + member.x) * 10);
    } else {
      this.moveToward(command, member, member.homeX, member.homeY);
    }
  }

  moveToward(command, member, x, y) {
    const dx = x - member.x;
    const dy = y - member.y;
    const length = Math.hypot(dx, dy) || 1;
    command.moveX = Math.abs(dx) > 8 ? dx / length : 0;
    command.moveY = Math.abs(dy) > 8 ? dy / length : 0;
  }

  normalizedVector(dx, dy) {
    const length = Math.hypot(dx, dy) || 1;
    return { x: dx / length, y: dy / length };
  }

  stop(command) {
    command.moveX = 0;
    command.moveY = 0;
    command.dash = false;
  }

  teammateCrowding(member, x, y) {
    let penalty = 0;
    for (const teammate of this.team) {
      if (teammate === member || teammate.defeated) continue;
      const distance = Math.hypot(teammate.x - x, teammate.y - y);
      if (distance < 220) penalty += (220 - distance) * 2.2;
    }
    return penalty;
  }

  clampPointToArea(point, area, radius) {
    if (!area) return point;
    if (area.trapezoid) {
      const y = Math.max(area.trapezoid.yTop + radius, Math.min(area.trapezoid.yBottom - radius, point.y));
      const bounds = this.getTrapezoidBoundsAtY(area.trapezoid, y);
      if (!bounds) return { x: point.x, y };
      return {
        x: Math.max(bounds.left + radius, Math.min(bounds.right - radius, point.x)),
        y
      };
    }
    const x = Math.max(area.x + radius, Math.min(area.x + area.w - radius, point.x));
    const y = Math.max(area.y + radius, Math.min(area.y + area.h - radius, point.y));
    return { x, y };
  }

  isPointInsideArea(x, y, radius, area) {
    if (!area) return true;
    const rects = area.rects || [area];
    return rects.some((rect) => this.isPointInsideAreaPart(x, y, radius, rect));
  }

  isPointInsideAreaPart(x, y, radius, area) {
    if (area.trapezoid) {
      const bounds = this.getTrapezoidBoundsAtY(area.trapezoid, y);
      return Boolean(bounds) && x >= bounds.left + radius && x <= bounds.right - radius;
    }
    return (
      x >= area.x + radius &&
      x <= area.x + area.w - radius &&
      y >= area.y + radius &&
      y <= area.y + area.h - radius
    );
  }

  getTrapezoidBoundsAtY(trapezoid, y) {
    if (y < trapezoid.yTop || y > trapezoid.yBottom) return null;
    const t = (y - trapezoid.yTop) / Math.max(1, trapezoid.yBottom - trapezoid.yTop);
    return {
      left: trapezoid.leftTop + (trapezoid.leftBottom - trapezoid.leftTop) * t,
      right: trapezoid.rightTop + (trapezoid.rightBottom - trapezoid.rightTop) * t
    };
  }

  getAreaBounds(area) {
    if (!area) return { x: 0, y: 0, w: 0, h: 0 };
    if (area.rects) {
      const bounds = area.rects.map((rect) => this.getAreaBounds(rect));
      const minX = Math.min(...bounds.map((rect) => rect.x));
      const minY = Math.min(...bounds.map((rect) => rect.y));
      const maxX = Math.max(...bounds.map((rect) => rect.x + rect.w));
      const maxY = Math.max(...bounds.map((rect) => rect.y + rect.h));
      return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    }
    if (area.trapezoid) {
      const t = area.trapezoid;
      const minX = Math.min(t.leftTop, t.rightTop, t.leftBottom, t.rightBottom);
      const maxX = Math.max(t.leftTop, t.rightTop, t.leftBottom, t.rightBottom);
      return { x: minX, y: t.yTop, w: maxX - minX, h: t.yBottom - t.yTop };
    }
    return area;
  }

  nearestActiveOpponent(member) {
    let best = null;
    let bestDistance = Infinity;
    for (const opponent of this.opponents) {
      if (opponent.defeated || opponent.role !== "inner") continue;
      const distance = Math.hypot(opponent.x - member.x, opponent.y - member.y);
      if (distance < bestDistance) {
        best = opponent;
        bestDistance = distance;
      }
    }
    return best;
  }

  getCommand(member) {
    const command = this.commands.get(member.id) || this.createEmptyCommand();
    return this.applyOneOnOneSafety(command, member);
  }

  applyOneOnOneSafety(command, member) {
    if (!this.config.oneOnOneMode || !member || member.role !== "inner" || member.defeated || member.oneOnOneFalling) {
      return command;
    }
    if (member.jumpZ > 0 || member.jumpVelocity > 0) {
      return command;
    }
    const area = this.config.areas?.[member.zone];
    if (!area) return command;

    const safeRadius = Math.max(member.radius + 34, 78);
    const inside = this.isPointInsideArea(member.x, member.y, safeRadius, area);
    if (!inside) {
      const target = this.clampPointToArea({ x: member.homeX, y: member.homeY }, area, safeRadius);
      this.moveToward(command, member, target.x, target.y);
      command.dash = true;
      command.jump = false;
      return command;
    }

    const probeDistance = command.dash ? 128 : 82;
    const probeX = member.x + (command.moveX || 0) * probeDistance;
    const probeY = member.y + (command.moveY || 0) * probeDistance;
    if (this.isPointInsideArea(probeX, probeY, safeRadius, area)) {
      return command;
    }

    const target = this.clampPointToArea({ x: probeX, y: probeY }, area, safeRadius);
    const dx = target.x - member.x;
    const dy = target.y - member.y;
    const length = Math.hypot(dx, dy);
    if (length <= 10) {
      this.stop(command);
    } else {
      command.moveX = dx / length;
      command.moveY = dy / length;
      command.dash = false;
    }
    command.jump = false;
    return command;
  }

  createEmptyCommand() {
    return {
      moveX: 0,
      moveY: 0,
      dash: false,
      catch: false,
      crouch: false,
      jump: false,
      shoot: false,
      pass: false,
      chargeShoot: false,
      reflect: false,
      lockFacing: false,
      faceDirection: null,
      chargeTime: 0,
      chargeReleaseMode: "time"
    };
  }

  randomReaction() {
    const overdriveScale = this.team.some((member) => this.isRobotOverdrive(member))
      ? ROBOT_OVERDRIVE_CONFIG.reactionTimeScale
      : 1;
    return (0.13 + Math.random() * 0.17) * overdriveScale;
  }

  isRobotOverdrive(member) {
    return Boolean(member?.isRobotOverdrive?.());
  }
}
