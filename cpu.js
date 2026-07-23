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
    this.passChainRemaining = 0;
    this.passChainFinisher = false;
  }

  update(delta) {
    this.decisionTimer -= delta;
    this.throwTimer -= delta;

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
      command.chargeTime = 0;
      command.chargeReleaseMode = "time";
    }

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
    if (cpuHolder && this.currentHolderId !== cpuHolder.id) {
      this.currentHolderId = cpuHolder.id;
      this.holderPlan = null;
      this.throwTimer = cpuHolder.aerialPassCatchTimer > 0 && cpuHolder.jumpZ > 0
        ? Math.min(this.throwTimer, 0.08 + Math.random() * 0.08)
        : Math.max(this.throwTimer, 0.85 + Math.random() * 0.45);
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
        this.moveToward(command, member, this.ball.x, this.ball.y);
        command.dash = true;
        if (Math.hypot(this.ball.x - member.x, this.ball.y - member.y) < 240) {
          command.catch = true;
        }
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

      if (this.ball.owner && this.ball.owner.team === this.opponentName && member.role === "inner") {
        this.controlWithoutBall(command, member, this.ball.owner);
        continue;
      }

      this.moveToHome(command, member);
    }
  }

  controlHolder(command, holder) {
    const plan = this.getHolderPlan(holder);
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
        command.pass = true;
        if (this.passChainRemaining <= 0 && !this.passChainFinisher) {
          this.passChainRemaining = 1 + Math.floor(Math.random() * 2);
        }
        this.throwTimer = 0.42 + Math.random() * 0.32;
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
        this.throwTimer = plan.chargeTime + 0.7 + Math.random() * 0.25;
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
      if (target) this.moveToward(command, holder, target.x, target.y);
      command.dash = true;
      if (this.throwTimer <= 0) {
        command.shoot = true;
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
      if (this.isNearJumpApex(holder) && this.throwTimer <= 0) {
        command.shoot = true;
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
    if (this.throwTimer <= 0) {
      command.shoot = true;
      this.throwTimer = 0.38 + Math.random() * 0.28;
      this.holderPlan = null;
    }
  }

  getHolderPlan(holder) {
    if (this.holderPlan && this.holderPlan.holderId === holder.id) return this.holderPlan;

    if (holder.aerialPassCatchTimer > 0 && holder.jumpZ > 0) {
      return this.createHolderPlan(holder, "catch-and-shoot", 0.85 + Math.random() * 0.35);
    }

    const spiritReady = Boolean(this.config.isSpiritReady?.(this.teamName));
    const captain = this.team.find((p) => p.isCaptain && p !== holder && !p.defeated && p.hp > 0);
    if (holder.role === "inner" && spiritReady && captain && Math.random() < 0.76) {
      return this.createHolderPlan(holder, "pass-chain", 0.72 + Math.random() * 0.25);
    }

    if (holder.cpuProfile === "townDodgies") {
      return this.getTownDodgiesHolderPlan(holder);
    }
    if (holder.cpuProfile === "bakusouBoys") {
      return this.getBakusouBoysHolderPlan(holder);
    }
    if (holder.cpuProfile === "hinomaruBombers") {
      return this.getHinomaruBombersHolderPlan(holder);
    }
    if (holder.cpuProfile === "americanBigBalls") {
      return this.getAmericanBigBallsHolderPlan(holder);
    }
    if (holder.cpuProfile === "kuidaoRangers") {
      return this.getKuidaoRangersHolderPlan(holder);
    }
    if (holder.cpuProfile === "doskois") {
      return this.getDoskoisHolderPlan(holder);
    }

    const roll = Math.random();
    let type = "normal-shot";
    if (this.passChainFinisher) {
      const finisherRoll = Math.random();
      type = finisherRoll < 0.34 ? "dash-strong-shot" : finisherRoll < 0.66 ? "dash-jump-strong-shot" : finisherRoll < 0.84 ? "jump-strong-shot" : "jump-shot";
      this.passChainFinisher = false;
    } else if (this.passChainRemaining > 0) {
      this.passChainRemaining -= 1;
      type = "pass-chain";
      if (this.passChainRemaining <= 0) {
        this.passChainFinisher = true;
      }
    } else {
      if (holder.role === "out") {
        type = roll < 0.16 ? "normal-shot" : roll < 0.34 ? "pass-chain" : roll < 0.58 ? "dash-strong-shot" : roll < 0.78 ? "dash-jump-strong-shot" : roll < 0.9 ? "jump-strong-shot" : "jump-shot";
      } else if (roll < 0.12) {
        type = "normal-shot";
      } else if (roll < 0.26) {
        type = "center-shot";
      } else if (roll < 0.4) {
        type = "dash-shot";
      } else if (roll < 0.52) {
        type = "jump-shot";
      } else if (roll < 0.66) {
        type = "pass-chain";
      } else if (roll < 0.82) {
        type = "dash-strong-shot";
      } else if (roll < 0.95) {
        type = "dash-jump-strong-shot";
      } else {
        type = "jump-strong-shot";
      }
    }

    return this.createHolderPlan(holder, type, 1.05 + Math.random() * 0.45);
  }

  getTownDodgiesHolderPlan(holder) {
    const roll = Math.random();
    let type = "normal-shot";
    if (holder.role === "out") {
      type = roll < 0.2 ? "normal-shot"
        : roll < 0.38 ? "pass-chain"
          : roll < 0.62 ? "dash-shot"
            : roll < 0.84 ? "dash-strong-shot"
              : roll < 0.96 ? "charge-shot"
                : "jump-shot";
    } else {
      type = roll < 0.16 ? "normal-shot"
        : roll < 0.3 ? "center-shot"
          : roll < 0.52 ? "dash-shot"
            : roll < 0.64 ? "pass-chain"
              : roll < 0.84 ? "dash-strong-shot"
                : roll < 0.98 ? "charge-shot"
                  : "jump-shot";
    }

    return this.createHolderPlan(holder, type, 0.75 + Math.random() * 0.45);
  }

  getBakusouBoysHolderPlan(holder) {
    const roll = Math.random();
    let type = "pass-chain";
    if (holder.role === "inner") {
      type = roll < 0.3 ? "dash-jump-strong-shot"
        : roll < 0.46 ? "dash-strong-shot"
          : roll < 0.68 ? "pass-chain"
            : roll < 0.84 ? "jump-shot"
              : roll < 0.94 ? "dash-shot"
                : "normal-shot";
    } else {
      type = roll < 0.34 ? "pass-chain"
        : roll < 0.58 ? "jump-shot"
          : roll < 0.78 ? "dash-jump-strong-shot"
            : roll < 0.92 ? "dash-shot"
              : "normal-shot";
    }

    return this.createHolderPlan(holder, type, 1.05 + Math.random() * 0.4);
  }

  getHinomaruBombersHolderPlan(holder) {
    const roll = Math.random();
    let type = "pass-chain";
    if (this.passChainFinisher) {
      const finisherRoll = Math.random();
      type = finisherRoll < 0.16 ? "dash-jump-strong-shot"
        : finisherRoll < 0.3 ? "dash-strong-shot"
          : finisherRoll < 0.42 ? "jump-strong-shot"
            : finisherRoll < 0.7 ? "jump-shot"
              : "dash-shot";
      this.passChainFinisher = false;
    } else if (this.passChainRemaining > 0) {
      this.passChainRemaining -= 1;
      type = "pass-chain";
      if (this.passChainRemaining <= 0) {
        this.passChainFinisher = true;
      }
    } else if (holder.role === "inner") {
      type = roll < 0.5 ? "pass-chain"
        : roll < 0.62 ? "dash-jump-strong-shot"
          : roll < 0.78 ? "dash-strong-shot"
            : roll < 0.8 ? "jump-strong-shot"
              : roll < 0.9 ? "jump-shot"
                : "dash-shot";
    } else {
      type = roll < 0.56 ? "pass-chain"
        : roll < 0.66 ? "dash-jump-strong-shot"
          : roll < 0.82 ? "dash-strong-shot"
            : roll < 0.86 ? "jump-strong-shot"
              : roll < 0.94 ? "jump-shot"
                : "dash-shot";
    }

    return this.createHolderPlan(holder, type, 1.02 + Math.random() * 0.28);
  }

  getAmericanBigBallsHolderPlan(holder) {
    const roll = Math.random();
    let type = "pass-chain";
    if (holder.name === "\u30b8\u30e7\u30fc") {
      type = roll < 0.24 ? "dash-jump-strong-shot"
        : roll < 0.48 ? "dash-strong-shot"
          : roll < 0.64 ? "jump-strong-shot"
            : roll < 0.78 ? "center-shot"
              : roll < 0.9 ? "normal-shot"
                : "pass-chain";
    } else if (this.passChainFinisher) {
      type = roll < 0.36 ? "dash-strong-shot"
        : roll < 0.58 ? "jump-strong-shot"
          : roll < 0.78 ? "center-shot"
            : "normal-shot";
      this.passChainFinisher = false;
    } else if (this.passChainRemaining > 0) {
      this.passChainRemaining -= 1;
      type = "pass-chain";
      if (this.passChainRemaining <= 0) {
        this.passChainFinisher = true;
      }
    } else if (holder.role === "inner") {
      type = roll < 0.58 ? "pass-chain"
        : roll < 0.74 ? "dash-strong-shot"
          : roll < 0.86 ? "jump-strong-shot"
            : roll < 0.94 ? "center-shot"
              : "normal-shot";
    } else {
      type = roll < 0.64 ? "pass-chain"
        : roll < 0.82 ? "dash-strong-shot"
          : roll < 0.92 ? "jump-strong-shot"
            : "normal-shot";
    }

    return this.createHolderPlan(holder, type, 1.08 + Math.random() * 0.32);
  }

  getKuidaoRangersHolderPlan(holder) {
    const roll = Math.random();
    const spiritReady = Boolean(this.config.isSpiritReady?.(this.teamName));
    let type = "pass-chain";

    if (holder.name === "\u305f\u3053\u3078\u3044") {
      type = spiritReady
        ? roll < 0.34 ? "dash-jump-strong-shot"
          : roll < 0.62 ? "jump-strong-shot"
            : roll < 0.84 ? "dash-strong-shot"
              : "charge-shot"
        : roll < 0.28 ? "jump-shot"
          : roll < 0.52 ? "dash-shot"
            : roll < 0.74 ? "pass-chain"
              : "normal-shot";
    } else if (spiritReady) {
      type = roll < 0.86 ? "pass-chain"
        : roll < 0.94 ? "dash-strong-shot"
          : "jump-strong-shot";
    } else if (holder.role === "out") {
      type = roll < 0.48 ? "pass-chain"
        : roll < 0.68 ? "jump-shot"
          : roll < 0.86 ? "dash-shot"
            : "normal-shot";
    } else {
      type = roll < 0.42 ? "pass-chain"
        : roll < 0.62 ? "dash-shot"
          : roll < 0.78 ? "jump-shot"
            : roll < 0.92 ? "center-shot"
              : "normal-shot";
    }

    return this.createHolderPlan(holder, type, 1.04 + Math.random() * 0.34);
  }

  getDoskoisHolderPlan(holder) {
    const roll = Math.random();
    const spiritReady = Boolean(this.config.isSpiritReady?.(this.teamName));
    let type = "dash-strong-shot";

    if (holder.name === "よこづな") {
      type = spiritReady
        ? roll < 0.38 ? "dash-strong-shot"
          : roll < 0.68 ? "jump-strong-shot"
            : roll < 0.9 ? "charge-shot"
              : "dash-jump-strong-shot"
        : roll < 0.3 ? "dash-strong-shot"
          : roll < 0.54 ? "charge-shot"
            : roll < 0.76 ? "center-shot"
              : roll < 0.9 ? "normal-shot"
                : "pass-chain";
    } else if (spiritReady) {
      type = roll < 0.88 ? "pass-chain" : "dash-strong-shot";
    } else if (holder.role === "out") {
      type = roll < 0.5 ? "pass-chain"
        : roll < 0.72 ? "dash-strong-shot"
          : roll < 0.9 ? "charge-shot"
            : "normal-shot";
    } else {
      type = roll < 0.42 ? "pass-chain"
        : roll < 0.66 ? "dash-strong-shot"
          : roll < 0.84 ? "charge-shot"
            : "center-shot";
    }

    return this.createHolderPlan(holder, type, 1.14 + Math.random() * 0.28);
  }

  createHolderPlan(holder, type, chargeTime) {
    const centerLineX = this.getAttackLineX(holder);
    this.holderPlan = {
      holderId: holder.id,
      type,
      x: holder.role === "inner" ? centerLineX : holder.homeX,
      y: holder.y,
      chargeTime,
      chargeStarted: false,
      startedAt: 0,
      jumpAttempted: false,
      jumpStartedAt: 0
    };
    return this.holderPlan;
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

  evadeHolder(command, member, holder) {
    const area = this.config.areas ? this.config.areas[member.zone] : null;
    const away = this.normalizedVector(member.x - holder.x, member.y - holder.y);
    const candidates = [
      { x: member.x + away.x * 360, y: member.y + away.y * 240 },
      { x: member.homeX + 260, y: member.homeY - 170 },
      { x: member.homeX + 300, y: member.homeY + 170 },
      { x: member.homeX + 430, y: member.homeY },
      { x: member.homeX + 180, y: member.homeY }
    ];

    let best = null;
    let bestScore = -Infinity;
    for (const point of candidates) {
      const p = this.clampPointToArea(point, area, member.radius);
      const holderDistance = Math.hypot(p.x - holder.x, p.y - holder.y);
      const teammatePenalty = this.teammateCrowding(member, p.x, p.y);
      const homePenalty = Math.hypot(p.x - member.homeX, p.y - member.homeY) * 0.06;
      const score = holderDistance * 1.45 - teammatePenalty * 1.8 - homePenalty;
      if (score > bestScore) {
        best = p;
        bestScore = score;
      }
    }

    if (best) {
      this.moveToward(command, member, best.x, best.y);
      command.dash = true;
    }
  }

  controlWithoutBall(command, member, holder) {
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

    this.evadeHolder(command, member, holder);
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
    const current = this.evasionPlans.get(key);
    const now = Date.now();
    if (current && current.holderId === holder.id && current.expiresAt > now) return current;

    const plan = {
      holderId: holder.id,
      type: Math.random() < 0.22 ? "side-step" : "run-away",
      width: 80 + Math.random() * 90,
      speed: 260 + Math.random() * 220,
      expiresAt: now + 650 + Math.random() * 900
    };
    this.evasionPlans.set(key, plan);
    return plan;
  }

  reactToIncomingBall(delta) {
    const ballComing = this.ball.isFlying && this.ball.kind === "shoot" && this.ball.thrower && this.ball.thrower.team === this.opponentName;
    if (!ballComing) return;

    this.reactionTimer -= delta;
    if (this.reactionTimer > 0 && !this.hasUrgentDefender()) return;

    for (const member of this.team.filter((p) => p.role === "inner" && !p.defeated)) {
      const command = this.commands.get(member.id);
      const distance = Math.hypot(this.ball.x - member.x, this.ball.y - member.y);
      const technique = member.stats?.technique || 5;
      const speed = member.stats?.speed || 5;
      const jump = member.stats?.jump || 5;
      const defenseStat = Math.max(technique, speed, jump);
      const maxReactDistance = (member.cpuProfile === "hinomaruBombers" ? 620 : 430) + Math.max(0, defenseStat - 5) * 36;
      if (distance > maxReactDistance) continue;

      const frontShot = this.isFrontShot(member);
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
      const farShot = throwerDistance > 520 || distance > 260;
      const quickDefender = defenseStat >= 7;
      const readyToReact = frontShot && (farShot || (quickDefender && nearShot));
      const specialShot = Boolean(this.ball.specialShotType);
      const shotMultiplier = this.ball.shotMultiplier || 1;
      const strongShot = specialShot || shotMultiplier >= 1.28 || this.ball.power >= 28;
      const weakShot = !specialShot && shotMultiplier <= 1.08 && this.ball.power <= 23;
      const techniqueBoost = 1 + Math.max(0, technique - 5) * 0.32;
      const speedBoost = 1 + Math.max(0, speed - 5) * 0.26;
      const jumpBoost = 1 + Math.max(0, jump - 5) * 0.25;
      const dodgeChance = strongShot
        ? readyToReact ? 0.9 : frontShot ? 0.72 : 0.3
        : readyToReact ? 0.42 : frontShot ? 0.28 : 0.14;
      const catchChance = weakShot
        ? readyToReact ? this.config.cpuCatchChance * 2.7 : frontShot ? this.config.cpuCatchChance * 2.2 : this.config.cpuCatchChance * 0.35
        : strongShot ? frontShot ? this.config.cpuCatchChance * 0.22 : this.config.cpuCatchChance * 0.06
          : readyToReact ? this.config.cpuCatchChance * 0.9 : frontShot ? this.config.cpuCatchChance * 1.05 : this.config.cpuCatchChance * 0.16;
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

      const catchDistance = (member.cpuProfile === "hinomaruBombers" && frontShot ? 560 : (weakShot ? 360 : 280)) + Math.max(0, technique - 5) * 30;
      const nearExpertCatch = frontShot && technique >= 7 && nearShot && !specialShot;
      const catchRoll = catchChance * profileCatchScale * techniqueBoost * (nearExpertCatch ? 1.75 : 1);
      const dodgeRoll = dodgeChance * profileDodgeScale * Math.max(speedBoost, jumpBoost);
      const closeDodgeRoll = this.getCloseRangeDodgeChance(speed, distance, targeted);
      if (closeRangeThreat && Math.random() < closeDodgeRoll) {
        this.dodgeIncomingShot(command, member, true, {
          speed,
          jump,
          closePanic,
          closeRange: true
        });
      } else if (frontShot && distance < catchDistance && Math.random() < Math.min(0.94, catchRoll)) {
        command.catch = true;
      } else if (laneThreat && Math.random() < Math.min(0.97, dodgeRoll)) {
        this.dodgeIncomingShot(command, member, readyToReact || strongShot || closePanic, { speed, jump, closePanic });
      }
    }

    this.reactionTimer = this.randomReaction();
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

  getCloseRangeDodgeChance(speed, distance, targeted) {
    const speedBonus = (Math.max(1, Math.min(20, speed)) - 5) * CPU_CLOSE_SHOT_DEFENSE.dodgeChancePerSpeed;
    const targetBonus = targeted ? CPU_CLOSE_SHOT_DEFENSE.targetedBonus : 0;
    const panicBonus = distance < 170 ? CPU_CLOSE_SHOT_DEFENSE.panicBonus : 0;
    return Math.max(0.32, Math.min(
      CPU_CLOSE_SHOT_DEFENSE.maxDodgeChance,
      CPU_CLOSE_SHOT_DEFENSE.baseDodgeChance + speedBonus + targetBonus + panicBonus
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
      ? this.getCloseRangeDodgeSuccessChance(speed, traits.closePanic)
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
    const lateralStrength = speed >= 7 ? 1 : 0.62;
    command.moveX = perpendicularX * side * lateralStrength + (this.ball.vx > 0 ? -0.28 : 0.28);
    command.moveY = perpendicularY * side * lateralStrength + awayY * (speed >= 7 ? 0.42 : 0.26);
    const length = Math.hypot(command.moveX, command.moveY) || 1;
    command.moveX /= length;
    command.moveY /= length;
    command.dash = readyToReact || speed >= 7 || traits.closePanic;
  }

  isFrontShot(member) {
    const horizontal = Math.abs(this.ball.vx) >= Math.abs(this.ball.vy);
    if (horizontal) {
      return member.facing === (this.ball.vx < 0 ? 1 : -1);
    }
    if (this.ball.vy < 0) return member.visualDirection === "down";
    return member.visualDirection === "up";
  }

  reactToFriendlyBall() {
    if (!this.ball.isFlying || !this.ball.thrower || this.ball.thrower.team !== this.teamName) return;
    if (!this.ball.target || this.ball.target.team !== this.teamName) return;

    const receiver = this.ball.target;
    if (receiver.defeated || receiver === this.ball.thrower) return;

    const command = this.commands.get(receiver.id);
    if (!command) return;

    const distance = Math.hypot(this.ball.x - receiver.x, this.ball.y - (receiver.y - 34));
    if (distance < 190) {
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
      if (!ballInFront || !veryClose || Math.random() > 0.28) continue;
      command.catch = true;
      if (this.ball.z > 120 && handDistance < 42 && member.jumpZ <= 0 && member.jumpVelocity <= 0 && Math.random() < 0.25) command.jump = true;
    }
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
      this.moveToward(command, member, member.homeX, member.homeY + Math.sin(Date.now() / 500 + member.x) * 34);
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
    return this.commands.get(member.id) || this.createEmptyCommand();
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
      chargeTime: 0,
      chargeReleaseMode: "time"
    };
  }

  randomReaction() {
    return 0.13 + Math.random() * 0.17;
  }
}
