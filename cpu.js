class CPUController {
  constructor(team, opponents, ball, config) {
    this.team = team;
    this.opponents = opponents;
    this.ball = ball;
    this.config = config;
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
    const cpuHolder = holder && holder.team === "right" ? holder : null;
    if (cpuHolder && this.currentHolderId !== cpuHolder.id) {
      this.currentHolderId = cpuHolder.id;
      this.holderPlan = null;
      this.throwTimer = Math.max(this.throwTimer, 0.85 + Math.random() * 0.45);
    } else if (!cpuHolder) {
      this.currentHolderId = null;
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

      if (this.shouldChaseLooseBall(member)) {
        this.moveToward(command, member, this.ball.x, this.ball.y);
        command.dash = true;
        continue;
      }

      if (this.ball.owner && this.ball.owner.team === "left" && member.role === "inner") {
        this.controlWithoutBall(command, member, this.ball.owner);
        continue;
      }

      this.moveToHome(command, member);
    }
  }

  controlHolder(command, holder) {
    const plan = this.getHolderPlan(holder);
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
      command.dash = holder.stamina > this.config.stamina.shootCost + 14;
      if (Math.hypot(holder.x - plan.x, holder.y - plan.y) < 42 && this.throwTimer <= 0) {
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

    if (plan.type === "dash-shot") {
      const target = this.nearestActiveOpponent(holder);
      if (target) this.moveToward(command, holder, target.x, target.y);
      command.dash = holder.stamina > this.config.stamina.shootCost + 20;
      if (this.throwTimer <= 0) {
        command.shoot = true;
        this.throwTimer = 0.42 + Math.random() * 0.22;
        this.holderPlan = null;
      }
      return;
    }

    if (plan.type === "jump-shot") {
      const target = this.nearestActiveOpponent(holder);
      if (target) this.moveToward(command, holder, target.x, target.y);
      if (holder.jumpZ <= 0 && holder.jumpVelocity <= 0) command.jump = true;
      if ((holder.jumpZ > 30 || holder.jumpVelocity > 0) && this.throwTimer <= 0) {
        command.shoot = true;
        this.throwTimer = 0.5 + Math.random() * 0.22;
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
      if (holder.stamina >= this.config.stamina.shootCost) {
        command.shoot = true;
      } else {
        command.pass = true;
      }
      this.throwTimer = 0.38 + Math.random() * 0.28;
      this.holderPlan = null;
    }
  }

  getHolderPlan(holder) {
    if (this.holderPlan && this.holderPlan.holderId === holder.id) return this.holderPlan;

    const roll = Math.random();
    let type = "normal-shot";
    if (this.passChainFinisher) {
      type = Math.random() < 0.55 ? "charge-shot" : "dash-shot";
      this.passChainFinisher = false;
    } else if (this.passChainRemaining > 0) {
      this.passChainRemaining -= 1;
      type = "pass-chain";
      if (this.passChainRemaining <= 0) {
        this.passChainFinisher = true;
      }
    } else {
      if (holder.role === "out") {
        type = roll < 0.32 ? "normal-shot" : roll < 0.62 ? "pass-chain" : roll < 0.82 ? "charge-shot" : "jump-shot";
      } else if (roll < 0.24) {
        type = "normal-shot";
      } else if (roll < 0.46) {
        type = "center-shot";
      } else if (roll < 0.64) {
        type = "dash-shot";
      } else if (roll < 0.78) {
        type = "jump-shot";
      } else if (roll < 0.91) {
        type = "pass-chain";
      } else {
        type = "charge-shot";
      }
    }

    const centerLineX = this.config.court.centerX + 82;
    this.holderPlan = {
      holderId: holder.id,
      type,
      x: holder.role === "inner" ? centerLineX : holder.homeX,
      y: holder.y,
      chargeTime: 0.75 + Math.random() * 1.05
    };
    return this.holderPlan;
  }

  shouldChaseLooseBall(member) {
    if (!this.ball.isLoose || this.ball.owner || this.ball.isFlying) return false;
    const area = this.config.areas ? this.config.areas[member.zone] : null;
    if (!area) return false;
    const margin = member.role === "inner" ? 60 : 80;
    const inOwnZone = (
      this.ball.x >= area.x - margin &&
      this.ball.x <= area.x + area.w + margin &&
      this.ball.y >= area.y - margin &&
      this.ball.y <= area.y + area.h + margin
    );
    const nearby = Math.hypot(this.ball.x - member.x, this.ball.y - member.y) < (member.role === "inner" ? 520 : 700);
    return inOwnZone || nearby;
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
      const score = holderDistance * 1.45 - teammatePenalty - homePenalty;
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
    const ballComing = this.ball.isFlying && this.ball.kind === "shoot" && this.ball.thrower && this.ball.thrower.team === "left";
    if (!ballComing) return;

    this.reactionTimer -= delta;
    if (this.reactionTimer > 0) return;

    for (const member of this.team.filter((p) => p.role === "inner" && !p.defeated)) {
      const command = this.commands.get(member.id);
      const distance = Math.hypot(this.ball.x - member.x, this.ball.y - member.y);
      if (distance > 430) continue;

      const frontShot = this.isFrontShot(member);
      const laneThreat = Math.abs(this.ball.y - member.y) < 105;
      const throwerDistance = this.ball.thrower ? Math.hypot(this.ball.thrower.x - member.x, this.ball.thrower.y - member.y) : distance;
      const farShot = throwerDistance > 520 || distance > 260;
      const readyToReact = frontShot && farShot;
      const dodgeChance = readyToReact ? 0.78 : frontShot ? 0.42 : 0.16;
      const catchChance = readyToReact ? this.config.cpuCatchChance * 0.45 : frontShot ? this.config.cpuCatchChance * 1.15 : this.config.cpuCatchChance * 0.18;

      if (frontShot && distance < 240 && Math.random() < catchChance) {
        command.catch = true;
      } else if (laneThreat && Math.random() < dodgeChance) {
        this.dodgeIncomingShot(command, member, readyToReact);
      }
    }

    this.reactionTimer = this.randomReaction();
  }

  dodgeIncomingShot(command, member, readyToReact) {
    const dodgeRoll = Math.random();
    if (dodgeRoll < 0.42 && member.stamina > this.config.stamina.duckCost) {
      command.crouch = true;
    } else if (dodgeRoll < 0.78 && member.jumpZ <= 0 && member.jumpVelocity <= 0) {
      command.jump = true;
    }
    command.moveY = member.y < this.config.court.y + this.config.court.h * 0.5 ? 1 : -1;
    command.moveX = this.ball.vx > 0 ? -0.42 : 0.42;
    command.dash = readyToReact;
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
    if (!this.ball.isFlying || !this.ball.thrower || this.ball.thrower.team !== "right") return;
    if (!this.ball.target || this.ball.target.team !== "right") return;

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
    if (!this.ball.isFlying || this.ball.kind !== "pass" || !this.ball.thrower || this.ball.thrower.team !== "left") return;

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
      if (distance < 140) penalty += 140 - distance;
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
      chargeTime: 0
    };
  }

  randomReaction() {
    return 0.13 + Math.random() * 0.17;
  }
}
