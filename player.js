// 画像素材は足元を原点として描画する。読み込み前は従来の図形描画を使う。
const PLAYER_MODEL = {
  left: {
    suit: "#0057ff"
  },
  right: {
    suit: "#f01818"
  },
  skin: "#ffd1a3",
  skinShade: "#e7a977",
  hair: "#f2c14e",
  visor: "#222a34",
  sole: "#f8f8f2"
};

const DEFAULT_PLAYER_STATS = {
  power: 5,
  speed: 5,
  jump: 5,
  technique: 5
};

// ゼンマイギアーズの低HP時強化。数値調整はここへまとめる。
const ROBOT_OVERDRIVE_CONFIG = {
  hpRatio: 0.3,
  moveSpeedScale: 1.2,
  jumpScale: 1.2,
  powerScale: 1.3,
  reactionTimeScale: 0.75,
  windupTimeScale: 0.9,
  dodgeChanceScale: 1.12,
  closeDodgeBonus: 0.08,
  strongShotCatchScale: 0.35
};

const CHARACTER_TYPES = {
  normal: {
    maxHp: 60,
    maxStamina: 100,
    stats: { power: 6, speed: 6, jump: 6, technique: 6 },
    label: "ノーマル",
    scaleX: 1,
    scaleY: 1,
    torsoX: 1,
    torsoY: 1,
    armWidth: 1,
    legWidth: 1,
    legLength: 1
  },
  power: {
    maxHp: 60,
    maxStamina: 100,
    stats: { power: 8, speed: 4, jump: 3, technique: 4 },
    label: "デーブ",
    scaleX: 1.16,
    scaleY: 1.14,
    torsoX: 1.2,
    torsoY: 1.08,
    armWidth: 2,
    legWidth: 2,
    legLength: 1
  },
  speed: {
    maxHp: 60,
    maxStamina: 100,
    stats: { power: 6, speed: 5, jump: 8, technique: 6 },
    label: "のっぽ",
    scaleX: 0.86,
    scaleY: 1.1,
    torsoX: 0.82,
    torsoY: 0.78,
    armWidth: 1,
    legWidth: 1,
    legLength: 1.2
  },
  jump: {
    maxHp: 60,
    maxStamina: 100,
    stats: { power: 5, speed: 8, jump: 6, technique: 7 },
    label: "ちび",
    scaleX: 0.9,
    scaleY: 0.88,
    torsoX: 0.88,
    torsoY: 1.11,
    armWidth: 1,
    legWidth: 1,
    legLength: 1.04
  },
  mage: {
    maxHp: 60,
    maxStamina: 100,
    stats: { power: 4, speed: 6, jump: 6, technique: 5 },
    label: "メイジ",
    scaleX: 0.94,
    scaleY: 1,
    headScale: 0.9,
    torsoX: 0.72,
    torsoY: 0.76,
    armWidth: 0.9,
    legWidth: 0.85,
    legLength: 0.76,
    mage: true
  },
  alien: {
    maxHp: 55,
    maxStamina: 110,
    stats: { power: 5, speed: 6, jump: 9, technique: 9 },
    label: "Alien",
    scaleX: 1,
    scaleY: 1,
    torsoX: 1,
    torsoY: 1,
    armWidth: 1,
    legWidth: 1,
    legLength: 1,
    alien: true
  },
  demon: {
    maxHp: 400,
    maxStamina: 200,
    stats: { power: 13, speed: 13, jump: 13, technique: 13 },
    label: "Arkma",
    scaleX: 1.13,
    scaleY: 1.12,
    torsoX: 1.22,
    torsoY: 1.1,
    armWidth: 1.6,
    legWidth: 1.25,
    legLength: 1.06,
    demon: true
  },
  vampire: {
    maxHp: 180,
    maxStamina: 150,
    stats: { power: 8, speed: 11, jump: 9, technique: 12 },
    label: "Vampire",
    scaleX: 0.92,
    scaleY: 1.22,
    headScale: 0.86,
    torsoX: 0.82,
    torsoY: 1.02,
    armWidth: 0.9,
    legWidth: 0.9,
    legLength: 1.34,
    vampire: true
  },
  witch: {
    maxHp: 160,
    maxStamina: 150,
    stats: { power: 8, speed: 10, jump: 9, technique: 13 },
    label: "Witch",
    scaleX: 0.88,
    scaleY: 1.06,
    headScale: 0.9,
    torsoX: 0.76,
    torsoY: 1.02,
    armWidth: 0.82,
    legWidth: 0.78,
    legLength: 1.02,
    witch: true
  },
  shieldDevil: {
    maxHp: 230,
    maxStamina: 150,
    stats: { power: 8, speed: 12, jump: 8, technique: 11 },
    label: "Shield Devil",
    scaleX: 0.82,
    scaleY: 0.82,
    torsoX: 1.08,
    torsoY: 0.92,
    armWidth: 0.9,
    legWidth: 0.82,
    legLength: 0.82,
    shieldDevil: true
  },
  miniDevil: {
    maxHp: 130,
    maxStamina: 135,
    stats: { power: 7, speed: 13, jump: 13, technique: 12 },
    label: "Mini Devil",
    scaleX: 0.78,
    scaleY: 0.76,
    torsoX: 0.96,
    torsoY: 0.82,
    armWidth: 0.82,
    legWidth: 0.78,
    legLength: 0.72,
    miniDevil: true
  },
  lavaGolem: {
    maxHp: 280,
    maxStamina: 150,
    stats: { power: 16, speed: 5, jump: 4, technique: 7 },
    label: "Lava Golem",
    scaleX: 1.18,
    scaleY: 1.08,
    torsoX: 1.5,
    torsoY: 1.08,
    armWidth: 1.75,
    legWidth: 1.38,
    legLength: 0.82,
    lavaGolem: true
  }
};

class Player {
  constructor(options) {
    this.id = options.id;
    this.name = options.name;
    this.team = options.team;
    this.role = options.role || "inner";
    this.zone = options.zone || "inner";
    this.x = options.x;
    this.y = options.y;
    this.homeX = options.x;
    this.homeY = options.y;
    this.radius = options.radius || 37;
    this.characterType = options.characterType || "normal";
    const typeDefinition = CHARACTER_TYPES[this.characterType] || CHARACTER_TYPES.normal;
    this.stats = this.createStats(options.stats || typeDefinition.stats);
    this.maxHp = options.maxHp ?? typeDefinition.maxHp ?? 100;
    this.hp = this.maxHp;
    this.baseSpeed = options.speed || 230;
    this.speed = this.baseSpeed * this.getStatScale("speed", 0.045);
    this.baseThrowPower = options.throwPower || 20;
    this.throwPower = this.baseThrowPower * this.getStatScale("power", 0.07);
    this.uniformColor = options.uniformColor;
    this.pantsColor = options.pantsColor || this.uniformColor;
    this.uniformEmblem = options.uniformEmblem || null;
    this.isCaptain = Boolean(options.captain);
    this.trimColor = options.trimColor || "#ffffff";
    this.faceColor = options.faceColor || "#ffd4a3";
    this.hairColor = options.hairColor || "#3d2a1f";
    this.eyeColor = options.eyeColor || PLAYER_MODEL.visor;
    this.cpuProfile = options.cpuProfile || null;
    this.cpuControlled = Boolean(options.cpuControlled);
    this.specialShotType = options.specialShotType || null;
    this.slowTimer = 0;
    this.slowScale = 1;
    this.clockStopAnticipation = false;
    this.hasBall = false;
    this.facing = this.team === "left" ? 1 : -1;
    this.visualDirection = this.team === "left" ? "right" : "left";
    this.robotBodyDirection = this.visualDirection;
    this.robotHeadDirection = this.visualDirection;
    this.robotVisualTurnTimer = 0;
    this.robotCatchMissTimer = 0;
    this.robotDodgeDirection = this.facing;
    this.turnTimer = 0;
    this.pendingVisualDirection = null;
    this.isDamaged = false;
    this.invincibleTime = 0;
    this.hitRecoveryTimer = 0;
    this.state = "idle";
    this.vx = 0;
    this.vy = 0;
    this.knockbackX = 0;
    this.knockbackY = 0;
    this.catchTimer = 0;
    this.catchSuccessTimer = 0;
    this.stunTimer = 0;
    this.throwTimer = 0;
    this.throwPhase = "none";
    this.throwKind = "none";
    this.throwLockTimer = 0;
    this.counterReadyTimer = 0;
    this.counterWindowTimer = 0;
    this.counterAutoTimer = 0;
    this.counterSourceDamage = 0;
    this.counterTarget = null;
    this.counterVisualIntensity = 0;
    this.counterChainCount = 0;
    this.counterThrowTimer = 0;
    this.counterThrowIntensity = 0;
    this.dodgeTimer = 0;
    this.dodgeType = "none";
    this.downTimer = 0;
    this.leaveTimer = 0;
    this.jumpZ = 0;
    this.jumpVelocity = 0;
    this.isDashing = false;
    this.runupTime = 0;
    this.runupDirX = this.facing;
    this.runupDirY = 0;
    this.aerialPassCatchTimer = 0;
    this.quickShotReadyTimer = 0;
    this.passChainBlockTimer = 0;
    this.shieldAlertTimer = 0;
    this.shieldGuardTimer = 0;
    this.witchWarpTimer = 0;
    this.reflectChantTimer = 0;
    this.reflectShieldTimer = 0;
    this.reflectCooldownTimer = 0;
    this.arcanaAnticipation = false;
    this.maxStamina = options.maxStamina ?? typeDefinition.maxStamina ?? 100;
    this.stamina = this.maxStamina;
    this.staminaRecoveryDelay = 0;
    this.defeated = false;
  }

  createStats(stats = {}) {
    return {
      power: this.clampStat(stats.power ?? DEFAULT_PLAYER_STATS.power),
      speed: this.clampStat(stats.speed ?? DEFAULT_PLAYER_STATS.speed),
      jump: this.clampStat(stats.jump ?? DEFAULT_PLAYER_STATS.jump),
      technique: this.clampStat(stats.technique ?? DEFAULT_PLAYER_STATS.technique)
    };
  }

  clampStat(value) {
    return Math.max(1, Math.min(20, Number(value) || 5));
  }

  getStatScale(name, step) {
    return 1 + (this.stats[name] - 5) * step;
  }

  update(delta, controls, area, config) {
    const airborneBeforeMove = this.jumpZ > 0 || this.jumpVelocity > 0;
    const startedInsideArea = this.isInsideArea(area);
    const catchTimerBeforeUpdate = this.catchTimer;
    this.invincibleTime = Math.max(0, this.invincibleTime - delta);
    this.hitRecoveryTimer = Math.max(0, this.hitRecoveryTimer - delta);
    this.catchTimer = Math.max(0, this.catchTimer - delta);
    this.catchSuccessTimer = Math.max(0, this.catchSuccessTimer - delta);
    this.slowTimer = Math.max(0, this.slowTimer - delta);
    this.shieldAlertTimer = Math.max(0, this.shieldAlertTimer - delta);
    this.shieldGuardTimer = Math.max(0, this.shieldGuardTimer - delta);
    this.witchWarpTimer = Math.max(0, this.witchWarpTimer - delta);
    this.reflectChantTimer = Math.max(0, this.reflectChantTimer - delta);
    this.reflectShieldTimer = Math.max(0, this.reflectShieldTimer - delta);
    this.reflectCooldownTimer = Math.max(0, this.reflectCooldownTimer - delta);
    if (this.slowTimer <= 0) this.slowScale = 1;
    this.throwTimer = Math.max(0, this.throwTimer - delta);
    if (this.throwTimer > 0) {
      const windupScale = this.isRobotOverdrive() ? ROBOT_OVERDRIVE_CONFIG.windupTimeScale : 1;
      const releaseWindow = (this.throwKind === "shoot" ? 0.26 : 0.2) * windupScale;
      this.throwPhase = this.throwTimer > releaseWindow ? "windup" : "release";
    } else {
      this.throwPhase = "none";
      this.throwKind = "none";
    }
    this.throwLockTimer = Math.max(0, this.throwLockTimer - delta);
    this.counterReadyTimer = Math.max(0, this.counterReadyTimer - delta);
    this.counterWindowTimer = Math.max(0, this.counterWindowTimer - delta);
    this.counterAutoTimer = Math.max(0, this.counterAutoTimer - delta);
    this.counterThrowTimer = Math.max(0, this.counterThrowTimer - delta);
    if (this.counterThrowTimer <= 0) this.counterThrowIntensity = 0;
    if (!this.hasBall || this.counterWindowTimer <= 0) {
      this.clearCounterOpportunity();
    }
    this.dodgeTimer = Math.max(0, this.dodgeTimer - delta);
    this.updateTurn(delta);
    this.updateRobotVisualState(delta, catchTimerBeforeUpdate);
    this.staminaRecoveryDelay = Math.max(0, this.staminaRecoveryDelay - delta);
    this.aerialPassCatchTimer = Math.max(0, this.aerialPassCatchTimer - delta);
    this.quickShotReadyTimer = Math.max(0, this.quickShotReadyTimer - delta);
    this.passChainBlockTimer = Math.max(0, this.passChainBlockTimer - delta);
    if (!this.hasBall) this.quickShotReadyTimer = 0;
    if (this.isWitchStyle() && (this.reflectChantTimer > 0 || this.reflectShieldTimer > 0)) {
      this.reflectChantTimer = 0;
      this.reflectShieldTimer = 0;
    }
    if (this.dodgeTimer <= 0) {
      this.dodgeType = "none";
    }

    if (this.defeated) {
      this.leaveTimer += delta;
      this.state = "defeated";
      this.updateJump(delta, config);
      return;
    }

    if (this.downTimer > 0) {
      this.downTimer -= delta;
      this.state = "down";
      this.applyKnockback(delta, area);
      this.updateJump(delta, config);
      if (this.downTimer <= 0 && this.hp <= 0) {
        this.defeated = true;
      }
      return;
    }

    if (this.hitRecoveryTimer > 0) {
      this.stunTimer = Math.max(0, this.stunTimer - delta);
      this.vx = 0;
      this.vy = 0;
      this.state = "damaged";
      this.applyKnockback(delta, area);
      this.updateJump(delta, config);
      return;
    }

    this.stunTimer = Math.max(0, this.stunTimer - delta);
    if (this.stunTimer > 0) {
      this.vx = 0;
      this.vy = 0;
      this.state = "damaged";
      this.updateJump(delta, config);
      return;
    }

    if (this.isWitchStyle() && this.reflectChantTimer > 0) {
      this.vx = 0;
      this.vy = 0;
      this.state = "reflectChant";
      this.updateJump(delta, config);
      return;
    }

    const moveX = controls.moveX || 0;
    const moveY = controls.moveY || 0;
    const length = Math.hypot(moveX, moveY) || 1;
    const moving = Math.hypot(moveX, moveY) > 0.08;
    if (controls.lockFacing || !moving) {
      this.cancelPendingTurn();
    } else if (moving) {
      this.requestVisualDirection(moveX, moveY, config.turnDuration);
    }

    const airborne = this.jumpZ > 0 || this.jumpVelocity > 0;
    const wantsDash = Boolean(controls.dash && moving && this.dodgeTimer <= 0);
    this.isDashing = wantsDash && (this.cpuControlled || this.stamina > 0);
    if (this.isDashing && !this.cpuControlled) {
      this.drainStamina(config.stamina.dashDrainPerSecond * delta, config.stamina.recoveryDelay);
    } else if (this.staminaRecoveryDelay <= 0 && this.dodgeTimer <= 0) {
      this.stamina = Math.min(this.maxStamina, this.stamina + config.stamina.recoveryPerSecond * delta);
    }

    const duckSlow = this.dodgeType === "duck" && this.dodgeTimer > 0 ? 0.08 : 1;
    const turnSlow = this.turnTimer > 0 ? config.turnSpeedMultiplier : 1;
    const vampireDashScale = this.isVampireStyle() && this.isDashing ? 1.35 : 1;
    const dashMultiplier = this.isDashing ? (airborne ? 1 + (config.dashSpeedMultiplier - 1) * 0.5 : config.dashSpeedMultiplier) * vampireDashScale : 1;
    const overdriveScale = this.isRobotOverdrive() ? ROBOT_OVERDRIVE_CONFIG.moveSpeedScale : 1;
    const speed = this.speed * overdriveScale * dashMultiplier * duckSlow * turnSlow * this.slowScale;
    this.vx = (moveX / length) * speed;
    this.vy = (moveY / length) * speed;
    this.updateRunup(delta, moving && duckSlow > 0.5 && this.throwLockTimer <= 0, moveX / length, moveY / length);

    this.x += this.vx * delta;
    this.y += this.vy * delta;
    this.applyKnockback(delta, area);
    if (!airborneBeforeMove && startedInsideArea) {
      this.clampToArea(area);
    }
    this.updateJump(delta, config);

    if (this.invincibleTime <= 0) {
      this.isDamaged = false;
    }

    if (this.isDamaged && this.invincibleTime > 0) {
      this.state = "damaged";
    } else if (this.throwTimer > 0) {
      this.state = "throwing";
    } else if (this.reflectShieldTimer > 0 && this.isWitchStyle()) {
      this.state = "reflectShield";
    } else if (this.catchTimer > 0) {
      this.state = "catching";
    } else if (this.dodgeTimer > 0) {
      this.state = "dodging";
    } else if (Math.abs(moveX) > 0.05 || Math.abs(moveY) > 0.05) {
      this.state = "run";
    } else if (this.hasBall) {
      this.state = "holding";
    } else {
      this.state = "idle";
    }
  }

  updateJump(delta, config) {
    if (this.jumpZ > 0 || this.jumpVelocity > 0) {
      this.jumpZ += this.jumpVelocity * delta;
      this.jumpVelocity -= config.jumpGravity * delta;
      if (this.jumpZ <= 0) {
        this.jumpZ = 0;
        this.jumpVelocity = 0;
      }
    }
  }

  jump(config) {
    if (this.defeated || this.downTimer > 0 || this.hitRecoveryTimer > 0 || this.jumpZ > 0 || this.jumpVelocity > 0) return;
    const overdriveScale = this.isRobotOverdrive() ? ROBOT_OVERDRIVE_CONFIG.jumpScale : 1;
    this.jumpVelocity = config.jumpVelocity * this.getStatScale("jump", 0.08) * overdriveScale;
    this.state = "jumping";
  }

  updateRunup(delta, canCharge, dirX, dirY) {
    if (!canCharge) {
      this.runupTime = Math.max(0, this.runupTime - delta * 1.4);
      return;
    }

    const dot = dirX * this.runupDirX + dirY * this.runupDirY;
    if (this.runupTime > 0 && dot < 0.72) {
      this.runupTime = 0;
    }
    this.runupDirX = dirX;
    this.runupDirY = dirY;
    this.runupTime = Math.min(2, this.runupTime + delta);
  }

  startCatch(duration) {
    if (this.defeated || this.downTimer > 0 || this.hitRecoveryTimer > 0) return;
    if (this.reflectChantTimer > 0) return;
    this.catchTimer = duration;
    this.state = "catching";
  }

  startCatchSuccess() {
    if (this.defeated || this.downTimer > 0) return;
    this.catchSuccessTimer = 0.28;
    this.state = "catching";
  }

  applySlow(scale, duration) {
    this.slowScale = Math.min(this.slowScale || 1, scale);
    this.slowTimer = Math.max(this.slowTimer || 0, duration);
  }

  startCounterOpportunity(sourceDamage, target, config, chainCount = 0) {
    if (this.defeated || this.downTimer > 0 || !this.hasBall) return;
    this.counterReadyTimer = config.lockDuration;
    this.counterWindowTimer = config.lockDuration + config.windowDuration;
    this.counterAutoTimer = config.lockDuration + 0.12 + Math.random() * 0.16;
    this.counterSourceDamage = Math.max(0, sourceDamage || 0);
    this.counterTarget = target || null;
    this.counterVisualIntensity = Math.max(1, Math.min(2.5, this.counterSourceDamage / 32));
    this.counterChainCount = Math.max(0, chainCount || 0);
  }

  canCounterThrow() {
    return this.hasBall && this.counterWindowTimer > 0 && this.counterReadyTimer <= 0 && this.counterSourceDamage > 0;
  }

  clearCounterOpportunity() {
    this.counterReadyTimer = 0;
    this.counterWindowTimer = 0;
    this.counterAutoTimer = 0;
    this.counterSourceDamage = 0;
    this.counterTarget = null;
    this.counterVisualIntensity = 0;
    this.counterChainCount = 0;
  }

  stun(duration) {
    if (this.defeated || this.downTimer > 0) return;
    this.stunTimer = Math.max(this.stunTimer, duration);
    this.state = "damaged";
  }

  startDodge(moveX, moveY, config) {
    if (this.defeated || this.downTimer > 0 || this.hitRecoveryTimer > 0 || this.dodgeTimer > 0) return false;
    if (this.reflectChantTimer > 0) return false;
    const cost = config.stamina.duckCost;
    if (!this.consumeStamina(cost, config.stamina.recoveryDelay)) return false;

    this.dodgeType = "duck";
    this.dodgeTimer = config.duckDuration;
    this.robotDodgeDirection = Math.abs(moveX) > 0.08 ? Math.sign(moveX) : this.facing;
    this.state = "dodging";
    return true;
  }

  startReflectShield() {
    return false;
  }

  updateRobotVisualState(delta, catchTimerBeforeUpdate) {
    if (!this.isRobotStyle()) return;

    this.robotCatchMissTimer = Math.max(0, this.robotCatchMissTimer - delta);
    if (
      catchTimerBeforeUpdate > 0 &&
      this.catchTimer <= 0 &&
      this.catchSuccessTimer <= 0 &&
      !this.hasBall
    ) {
      this.robotCatchMissTimer = 0.18;
    }

    if (this.visualDirection !== this.robotHeadDirection) {
      this.robotHeadDirection = this.visualDirection;
      this.robotVisualTurnTimer = 0.1;
    }
    if (this.robotVisualTurnTimer > 0) {
      this.robotVisualTurnTimer = Math.max(0, this.robotVisualTurnTimer - delta);
      if (this.robotVisualTurnTimer <= 0.0001) {
        this.robotVisualTurnTimer = 0;
        this.robotBodyDirection = this.robotHeadDirection;
      }
    } else {
      this.robotBodyDirection = this.robotHeadDirection;
    }
  }

  getMoveDirection(moveX, moveY) {
    if (Math.abs(moveY) > Math.abs(moveX)) return moveY < 0 ? "up" : "down";
    return moveX < 0 ? "left" : "right";
  }

  requestVisualDirection(moveX, moveY, duration) {
    const nextDirection = this.getMoveDirection(moveX, moveY);
    if (nextDirection === this.visualDirection) {
      this.cancelPendingTurn();
      return;
    }

    if (duration <= 0) {
      this.applyVisualDirection(nextDirection);
      this.cancelPendingTurn();
      return;
    }

    const opposite = {
      left: "right",
      right: "left",
      up: "down",
      down: "up"
    };
    if (opposite[this.visualDirection] === nextDirection) {
      if (this.pendingVisualDirection !== nextDirection) {
        this.pendingVisualDirection = nextDirection;
        this.turnTimer = duration;
      }
      return;
    }

    this.applyVisualDirection(nextDirection);
    this.cancelPendingTurn();
  }

  updateTurn(delta) {
    if (this.turnTimer <= 0) return;
    this.turnTimer = Math.max(0, this.turnTimer - delta);
    if (this.turnTimer <= 0 && this.pendingVisualDirection) {
      this.applyVisualDirection(this.pendingVisualDirection);
      this.pendingVisualDirection = null;
    }
  }

  cancelPendingTurn() {
    this.turnTimer = 0;
    this.pendingVisualDirection = null;
  }

  applyVisualDirection(direction) {
    this.visualDirection = direction;
    if (direction === "left" || direction === "right") {
      this.facing = direction === "right" ? 1 : -1;
    }
  }

  consumeStamina(amount, recoveryDelay) {
    if (this.cpuControlled) return true;
    if (this.stamina < amount) return false;
    this.stamina = Math.max(0, this.stamina - amount);
    this.staminaRecoveryDelay = Math.max(this.staminaRecoveryDelay, recoveryDelay);
    return true;
  }

  drainStamina(amount, recoveryDelay) {
    if (this.cpuControlled) return;
    this.stamina = Math.max(0, this.stamina - amount);
    this.staminaRecoveryDelay = Math.max(this.staminaRecoveryDelay, recoveryDelay);
  }

  markThrowing(duration, kind = "shoot") {
    this.throwTimer = duration;
    this.throwKind = kind;
    this.throwPhase = duration > (kind === "shoot" ? 0.26 : 0.2) ? "windup" : "release";
    this.state = "throwing";
  }

  takeDamage(amount, sourceDirection, config, knockbackScale = 1, ignoreDodge = false) {
    if (this.defeated || this.invincibleTime > 0 || (!ignoreDodge && this.dodgeTimer > 0)) return false;

    const finalAmount = this.getIncomingDamageAmount(amount);
    const finalKnockbackScale = knockbackScale * this.getIncomingKnockbackScale();
    this.hp = Math.max(0, this.hp - finalAmount);
    this.isDamaged = true;
    this.invincibleTime = config.invincibleTime;
    this.hitRecoveryTimer = config.hitRecoveryDuration;
    this.catchTimer = 0;
    this.quickShotReadyTimer = 0;
    this.throwTimer = 0;
    this.throwPhase = "none";
    this.throwKind = "none";
    this.dodgeTimer = 0;
    this.reflectChantTimer = 0;
    this.reflectShieldTimer = 0;
    this.clearCounterOpportunity();
    const damageRatio = Math.max(0.65, Math.min(2.1, finalAmount / 20));
    const isDefeatHit = this.hp <= 0;
    const knockbackMultiplier = (isDefeatHit ? 4 : 2) * finalKnockbackScale;
    this.knockbackX = sourceDirection * config.knockbackSpeed * damageRatio * knockbackMultiplier;
    this.knockbackY = (-90 + Math.random() * 180) * damageRatio * knockbackMultiplier;

    if (this.hp <= 0) {
      this.hasBall = false;
      this.downTimer = config.downTime;
      this.state = "down";
    }

    return true;
  }

  takeBurnDamage(amount, config) {
    if (this.defeated || this.hp <= 0) return false;
    this.hp = Math.max(0, this.hp - this.getIncomingDamageAmount(amount));
    this.isDamaged = true;
    this.reflectChantTimer = 0;
    this.reflectShieldTimer = 0;
    if (this.hp <= 0) {
      this.hasBall = false;
      this.downTimer = config.downTime;
      this.state = "down";
    }
    return true;
  }

  getHitCircle() {
    const ducking = this.dodgeType === "duck" && this.dodgeTimer > 0;
    return {
      x: this.x,
      y: this.y - (ducking ? 28 : 54) - this.jumpZ,
      r: ducking ? this.radius * 0.75 : this.radius * 1.15
    };
  }

  getHitBox() {
    const ducking = this.dodgeType === "duck" && this.dodgeTimer > 0;
    const scale = this.lastDrawScale || 1;
    const width = (ducking ? 54 : 62) * scale;
    const top = this.y - this.jumpZ - (ducking ? 82 : 108) * scale;
    const bottom = this.y - this.jumpZ + 18 * scale;
    return {
      x: this.x - width * 0.5,
      y: top,
      w: width,
      h: bottom - top
    };
  }

  getCatchBox(config) {
    const width = config.catchWidth;
    const height = config.catchHeight;
    const x = this.x + this.facing * (this.radius + width * 0.45);
    return {
      x: x - width * 0.5,
      y: this.y - 86 - this.jumpZ,
      w: width,
      h: height
    };
  }

  getScale(config) {
    const t = Math.max(0, Math.min(1, (this.y - config.depthTop) / (config.depthBottom - config.depthTop)));
    return (0.72 + t * 0.34) * (config.characterScale || 1);
  }

  applyKnockback(delta, area) {
    this.x += this.knockbackX * delta;
    this.y += this.knockbackY * delta;
    this.knockbackX *= Math.pow(0.04, delta);
    this.knockbackY *= Math.pow(0.04, delta);
    if (this.jumpZ <= 0 && this.jumpVelocity <= 0 && this.isInsideArea(area)) {
      this.clampToArea(area);
    }
  }

  clampToArea(area) {
    if (!area) return;
    const rects = area.rects || [area];
    if (this.isInsideArea(area)) return;

    let best = null;
    let bestDistance = Infinity;
    for (const rect of rects) {
      const point = this.clampPointToAreaPart(this.x, this.y, rect);
      const x = point.x;
      const y = point.y;
      const distance = Math.hypot(this.x - x, this.y - y);
      if (distance < bestDistance) {
        best = { x, y };
        bestDistance = distance;
      }
    }

    if (best) {
      this.x = best.x;
      this.y = best.y;
    }
  }

  isInsideArea(area) {
    if (!area) return true;
    const rects = area.rects || [area];
    return rects.some((rect) => this.isInsideAreaPart(rect));
  }

  isInsideAreaPart(rect) {
    if (rect.trapezoid) {
      const bounds = this.getTrapezoidBoundsAtY(rect.trapezoid, this.y);
      return Boolean(bounds) && this.x >= bounds.left + this.radius && this.x <= bounds.right - this.radius;
    }
    return (
      this.x >= rect.x + this.radius &&
      this.x <= rect.x + rect.w - this.radius &&
      this.y >= rect.y + this.radius &&
      this.y <= rect.y + rect.h - this.radius
    );
  }

  clampPointToAreaPart(x, y, rect) {
    if (rect.trapezoid) {
      const clampedY = Math.max(rect.trapezoid.yTop + this.radius, Math.min(rect.trapezoid.yBottom - this.radius, y));
      const bounds = this.getTrapezoidBoundsAtY(rect.trapezoid, clampedY);
      if (!bounds) return { x, y: clampedY };
      return {
        x: Math.max(bounds.left + this.radius, Math.min(bounds.right - this.radius, x)),
        y: clampedY
      };
    }
    return {
      x: Math.max(rect.x + this.radius, Math.min(rect.x + rect.w - this.radius, x)),
      y: Math.max(rect.y + this.radius, Math.min(rect.y + rect.h - this.radius, y))
    };
  }

  getTrapezoidBoundsAtY(trapezoid, y) {
    if (y < trapezoid.yTop || y > trapezoid.yBottom) return null;
    const t = (y - trapezoid.yTop) / Math.max(1, trapezoid.yBottom - trapezoid.yTop);
    return {
      left: trapezoid.leftTop + (trapezoid.leftBottom - trapezoid.leftTop) * t,
      right: trapezoid.rightTop + (trapezoid.rightBottom - trapezoid.rightTop) * t
    };
  }

  draw(context, config, debugMode, isControlled, isPassTarget, isShootTarget, showHitbox = false, renderScaleCompensation = 1) {
    if (this.defeated && this.leaveTimer > config.exitDelay) return;

    const blinkOff = this.defeated
      ? Math.floor(this.leaveTimer * 16) % 2 === 0
      : this.invincibleTime > 0 && Math.floor(this.invincibleTime * 18) % 2 === 0;
    if (blinkOff) return;

    const scale = this.getScale(config) * renderScaleCompensation * this.getCharacterVisualScale();
    this.lastDrawScale = scale;
    const drawY = this.y - this.jumpZ;
    const motionTime = performance.now();
    context.save();
    context.translate(this.x, this.y);
    context.scale(scale, scale);

    context.fillStyle = "rgba(45, 35, 20, 0.24)";
    context.beginPath();
    context.ellipse(0, 10, 28, 9, 0, 0, Math.PI * 2);
    context.fill();

    if (this.jumpZ > 0) {
      context.strokeStyle = "rgba(255,255,255,0.65)";
      context.lineWidth = 3;
      context.beginPath();
      context.arc(0, 10, 34 + this.jumpZ * 0.12, 0.2, Math.PI - 0.2);
      context.stroke();
    }

    context.restore();

    if (showHitbox) {
      this.drawHitShape(context);
    }

    this.drawModelCharacter(context, scale, drawY, motionTime, config);

    if (this.hasBall) {
      this.drawHeldBall(context, scale);
    }
    if (this.catchTimer > 0) {
      this.drawCatchPose(context, config);
    }
    if (isControlled && !this.defeated) {
      this.drawControlMarker(context);
    }
    if (isPassTarget && !this.defeated) {
      this.drawPassMarker(context);
    }
    if (isShootTarget && !this.defeated) {
      this.drawShootMarker(context);
    }
    this.drawStatusBars(context);
    if (debugMode) {
      this.drawDebug(context, config);
    }
  }

  drawModelCharacter(context, scale, drawY, motionTime, config) {
    if (this.isShieldDevilStyle()) {
      this.drawShieldDevilCharacter(context, scale, drawY, motionTime);
      return;
    }

    if (this.isMiniDevilStyle()) {
      this.drawMiniDevilCharacter(context, scale, drawY, motionTime);
      return;
    }

    if (this.isLavaGolemStyle()) {
      this.drawLavaGolemCharacter(context, scale, drawY, motionTime);
      return;
    }

    if (this.isWitchStyle()) {
      this.drawWitchCharacter(context, scale, drawY, motionTime);
      return;
    }

    if (this.isDemonStyle()) {
      this.drawDemonCharacter(context, scale, drawY, motionTime);
      return;
    }

    if (this.isAlienStyle()) {
      this.drawAlienCharacter(context, scale, drawY, motionTime);
      return;
    }

    if (this.isRobotStyle()) {
      this.drawRobotCharacter(context, scale, drawY, motionTime, config);
      return;
    }

    if (this.isBravesStyle()) {
      this.drawBravesCharacter(context, scale, drawY, motionTime);
      return;
    }

    const teamColors = PLAYER_MODEL[this.team] || PLAYER_MODEL.left;
    const colors = {
      ...teamColors,
      suit: this.uniformColor || teamColors.suit,
      pants: this.pantsColor || this.uniformColor || teamColors.suit
    };
    const body = CHARACTER_TYPES[this.characterType] || CHARACTER_TYPES.normal;
    const sumoStyle = this.isSumoStyle();
    const legColor = sumoStyle ? PLAYER_MODEL.skin : colors.pants;
    const crouch = this.dodgeType === "duck" && this.dodgeTimer > 0 ? 1 : 0;
    const movingOnFoot = Math.hypot(this.vx, this.vy) > 15 && !crouch;
    const runAmount = movingOnFoot ? (this.isDashing ? 1.45 : 1) : 0;
    const cadence = this.isDashing ? 44 : 85;
    const stride = Math.sin(motionTime / cadence + this.x * 0.025 + this.y * 0.012) * runAmount;
    const bob = Math.abs(stride) * 4;
    const verticalMotion = this.visualDirection === "up" || this.visualDirection === "down";
    const jumpPose = this.jumpZ > 0 || this.jumpVelocity > 0 ? 1 : 0;
    const damaged = this.state === "damaged" ? 1 : 0;
    const down = this.state === "down" || this.defeated;
    const catchProgress = this.catchTimer > 0
      ? 1 - Math.max(0, Math.min(1, this.catchTimer / Math.max(0.01, config.catchDuration)))
      : 0;
    const catchSuccess = this.catchSuccessTimer > 0 ? 1 : 0;
    const throwProgress = this.state === "throwing"
      ? (this.throwPhase === "windup" ? 0.25 : 1)
      : 0;

    const rootY = crouch * 22 + bob - jumpPose * 4;
    const torsoY = -63 + rootY + crouch * 14;
    const headY = (body.mage ? -103 : -116) + rootY + crouch * 28;
    const hipY = -34 + rootY + crouch * 18;
    const shoulderY = -78 + rootY + crouch * 18;

    const pose = {
      backArm: [
        { x: -18, y: shoulderY },
        { x: -30 - stride * 8, y: -55 + rootY + crouch * 10 },
        { x: -35 - stride * 13, y: -29 + rootY + crouch * 8 }
      ],
      frontArm: [
        { x: 18, y: shoulderY },
        { x: 30 + stride * 8, y: -55 + rootY + crouch * 10 },
        { x: 35 + stride * 13, y: -29 + rootY + crouch * 8 }
      ],
      backLeg: [
        { x: -12, y: hipY },
        { x: -16 - stride * 9, y: -8 + rootY + crouch * 9 },
        { x: -15 - stride * 18, y: 18 + rootY - crouch * 5 }
      ],
      frontLeg: [
        { x: 12, y: hipY },
        { x: 16 + stride * 9, y: -8 + rootY + crouch * 9 },
        { x: 15 + stride * 18, y: 18 + rootY - crouch * 5 }
      ]
    };

    if (verticalMotion && movingOnFoot) {
      pose.backLeg[1].y += stride * 6;
      pose.backLeg[2].y += stride * 12;
      pose.frontLeg[1].y -= stride * 6;
      pose.frontLeg[2].y -= stride * 12;
      pose.backArm[2].y -= stride * 7;
      pose.frontArm[2].y += stride * 7;
    }

    if (jumpPose) {
      pose.backLeg[1].y -= 10;
      pose.backLeg[2].x -= 18;
      pose.backLeg[2].y -= 8;
      pose.frontLeg[1].y -= 8;
      pose.frontLeg[2].x += 16;
      pose.frontLeg[2].y -= 12;
      pose.backArm[2].y -= 14;
      pose.frontArm[2].y -= 12;
    }

    if (crouch) {
      pose.backLeg[1] = { x: -27, y: 2 };
      pose.backLeg[2] = { x: -38, y: 16 };
      pose.frontLeg[1] = { x: 27, y: 2 };
      pose.frontLeg[2] = { x: 38, y: 16 };
      pose.backArm[1] = { x: -28, y: -36 };
      pose.backArm[2] = { x: -14, y: -12 };
      pose.frontArm[1] = { x: 28, y: -36 };
      pose.frontArm[2] = { x: 14, y: -12 };
    }

    if (catchProgress > 0) {
      pose.backArm[1] = { x: -24, y: -108 + rootY };
      pose.backArm[2] = { x: -14, y: -137 + rootY + catchProgress * 4 };
      pose.frontArm[1] = { x: 24, y: -108 + rootY };
      pose.frontArm[2] = { x: 14, y: -137 + rootY + catchProgress * 4 };
    }

    if (catchSuccess > 0) {
      pose.backArm[1] = { x: -20, y: -100 + rootY };
      pose.backArm[2] = { x: -6, y: -112 + rootY };
      pose.frontArm[1] = { x: 20, y: -100 + rootY };
      pose.frontArm[2] = { x: 6, y: -112 + rootY };
      pose.backLeg[1].x -= 8;
      pose.frontLeg[1].x += 8;
    }

    if (throwProgress > 0) {
      if (this.throwPhase === "windup" && this.throwKind === "shoot") {
        pose.frontArm[1] = { x: -16, y: -108 + rootY };
        pose.frontArm[2] = { x: -62, y: -126 + rootY };
        pose.backArm[1] = { x: 24, y: -62 + rootY };
        pose.backArm[2] = { x: 42, y: -36 + rootY };
        pose.frontLeg[1].x += 10;
        pose.backLeg[1].x -= 8;
      } else if (this.throwPhase === "windup") {
        pose.frontArm[1] = { x: -10, y: -92 + rootY };
        pose.frontArm[2] = { x: -42, y: -98 + rootY };
        pose.backArm[2] = { x: 28, y: -39 + rootY };
      } else {
        pose.frontArm[1] = { x: 53, y: -76 + rootY };
        pose.frontArm[2] = { x: 78, y: -53 + rootY };
        pose.backArm[1] = { x: -34, y: -62 + rootY };
        pose.backArm[2] = { x: -45, y: -34 + rootY };
        pose.backLeg[1].x -= 8;
        pose.frontLeg[1].x += 12;
      }
    }

    this.applyLegLength(pose.backLeg, hipY, body.legLength);
    this.applyLegLength(pose.frontLeg, hipY, body.legLength);

    context.save();
    context.translate(this.x, drawY);
    const verticalView = this.visualDirection === "up" || this.visualDirection === "down";
    context.scale(scale * body.scaleX * (verticalView ? 1 : this.facing), scale * body.scaleY);
    if (verticalView) {
      context.scale(0.9, 1);
    }
    if (down) {
      context.rotate(-0.92);
      context.scale(1.12, 0.78);
    } else if (damaged) {
      context.rotate(-0.12);
    }

    this.drawModelLimb(context, pose.backLeg, legColor, 11 * body.legWidth);
    this.drawModelLimb(context, pose.backArm, PLAYER_MODEL.skinShade, 9 * body.armWidth);
    if (sumoStyle) this.drawModelBareFoot(context, pose.backLeg[2]);
    else this.drawModelFoot(context, pose.backLeg[2], colors.pants);

    this.drawModelTorso(context, 0, torsoY, colors, body);
    if (this.uniformEmblem === "usaFlag") {
      this.drawUsaSleeveCuff(context, pose.backArm, 9 * body.armWidth);
    }

    this.drawModelLimb(context, pose.frontLeg, legColor, 12 * body.legWidth);
    if (sumoStyle) this.drawModelBareFoot(context, pose.frontLeg[2]);
    else this.drawModelFoot(context, pose.frontLeg[2], colors.pants);
    if (sumoStyle) this.drawSumoFundoshi(context, torsoY, body);
    this.drawModelLimb(context, pose.frontArm, PLAYER_MODEL.skin, 10 * body.armWidth);
    if (this.uniformEmblem === "usaFlag") {
      this.drawUsaSleeveCuff(context, pose.frontArm, 10 * body.armWidth);
    }
    if (body.mage) {
      this.drawMageSkirt(context, torsoY, colors);
    }
    if (this.isVampireStyle()) {
      this.drawVampireCape(context, torsoY, body);
    }

    if (crouch) {
      context.save();
      context.translate(0, headY + 7);
      context.rotate(verticalMotion ? 0 : 0.16);
      context.scale(0.76 * (body.headScale || 1), 0.76 * (body.headScale || 1));
      this.drawModelHead(context, 0, 0, colors, damaged, this.visualDirection, body);
      if (body.mage) {
        this.drawMageHat(context, 0, 0, colors);
      }
      context.restore();
    } else {
      if (body.headScale && body.headScale !== 1) {
        context.save();
        context.translate(0, headY);
        context.scale(body.headScale, body.headScale);
        this.drawModelHead(context, 0, 0, colors, damaged, this.visualDirection, body);
        context.restore();
      } else {
        this.drawModelHead(context, 0, headY, colors, damaged, this.visualDirection, body);
      }
      if (body.mage) {
        this.drawMageHat(context, 0, headY, colors);
      }
      if (this.isVampireStyle()) {
        this.drawVampireDetails(context, 0, headY, damaged, body);
      }
    }
    context.restore();
  }

  drawHitShape(context) {
    const hit = this.getHitBox();
    context.save();
    context.fillStyle = this.team === "left" ? "rgba(0, 87, 255, 0.16)" : "rgba(240, 24, 24, 0.16)";
    context.strokeStyle = this.team === "left" ? "rgba(0, 87, 255, 0.42)" : "rgba(240, 24, 24, 0.42)";
    context.lineWidth = 2;
    this.roundRect(context, hit.x, hit.y, hit.w, hit.h, 18);
    context.fill();
    context.stroke();
    context.restore();
  }

  applyLegLength(points, hipY, scale = 1) {
    if (scale === 1) return;
    for (let i = 1; i < points.length; i += 1) {
      points[i].y = hipY + (points[i].y - hipY) * scale;
    }
  }

  drawModelTorso(context, x, y, colors, body = CHARACTER_TYPES.normal) {
    if (this.isSumoStyle()) {
      const skin = context.createRadialGradient(x - 12, y - 18, 5, x, y, 48);
      skin.addColorStop(0, "#ffe3c5");
      skin.addColorStop(0.64, PLAYER_MODEL.skin);
      skin.addColorStop(1, PLAYER_MODEL.skinShade);
      context.fillStyle = skin;
      context.beginPath();
      context.ellipse(x, y, 31 * body.torsoX, 39 * body.torsoY, 0, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "rgba(174, 91, 68, 0.58)";
      context.beginPath();
      context.arc(x - 14 * body.torsoX, y - 7, 2.4, 0, Math.PI * 2);
      context.arc(x + 14 * body.torsoX, y - 7, 2.4, 0, Math.PI * 2);
      context.fill();
      return;
    }

    context.fillStyle = colors.suit;
    context.beginPath();
    context.ellipse(x, y, 27 * body.torsoX, 38 * body.torsoY, 0, 0, Math.PI * 2);
    context.fill();
    if (this.uniformEmblem === "usaStripes" || this.uniformEmblem === "joeBib") {
      context.save();
      context.clip();
      context.fillStyle = "#111318";
      const stripeH = 9;
      for (let sy = y - 38 * body.torsoY; sy < y + 38 * body.torsoY; sy += stripeH * 2) {
        context.fillRect(x - 34 * body.torsoX, sy, 68 * body.torsoX, stripeH);
      }
      context.restore();
    }
    if (this.uniformEmblem === "usaFlag") {
      context.save();
      context.clip();
      const stripeHeight = 8 * body.torsoY;
      for (let stripeY = y - 2 * body.torsoY; stripeY < y + 38 * body.torsoY; stripeY += stripeHeight) {
        const stripeIndex = Math.floor((stripeY - (y - 2 * body.torsoY)) / stripeHeight);
        context.fillStyle = stripeIndex % 2 === 0 ? "#f7f7f2" : "#d92525";
        context.fillRect(x - 34 * body.torsoX, stripeY, 68 * body.torsoX, stripeHeight);
      }
      context.restore();
      context.fillStyle = "#f7f7f2";
      context.font = "bold 18px Meiryo, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("★", x - 13 * body.torsoX, y - 18 * body.torsoY);
    }
    if (this.uniformEmblem === "osakaStripes" || this.uniformEmblem === "takoBib") {
      context.save();
      context.clip();
      context.fillStyle = "#111318";
      const stripeW = 8 * body.torsoX;
      for (let sx = x - 28 * body.torsoX; sx <= x + 22 * body.torsoX; sx += 18 * body.torsoX) {
        context.fillRect(sx, y - 39 * body.torsoY, stripeW, 78 * body.torsoY);
      }
      context.restore();
    }
    if (this.uniformEmblem === "joeBib") {
      context.fillStyle = "#f7f7f2";
      this.roundRect(context, x - 14 * body.torsoX, y - 19 * body.torsoY, 28 * body.torsoX, 32 * body.torsoY, 4);
      context.fill();
      context.fillStyle = "#d92828";
      context.font = "bold 14px Meiryo, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("J", x, y - 3);
    } else if (this.uniformEmblem === "takoBib") {
      context.fillStyle = "#f7f7f2";
      this.roundRect(context, x - 14 * body.torsoX, y - 19 * body.torsoY, 28 * body.torsoX, 32 * body.torsoY, 4);
      context.fill();
      context.fillStyle = "#d92828";
      context.font = "bold 14px Meiryo, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("T", x, y - 3);
    } else if (this.uniformEmblem === "hinomaru") {
      context.fillStyle = "#d92828";
      context.beginPath();
      context.arc(x, y - 3, Math.max(7, 10 * Math.min(body.torsoX, body.torsoY)), 0, Math.PI * 2);
      context.fill();
    }
    if (this.isCaptain) {
      context.fillStyle = "#f7f7f2";
      context.strokeStyle = "#263241";
      context.lineWidth = 2;
      this.roundRect(context, x - 15 * body.torsoX, y - 20 * body.torsoY, 30 * body.torsoX, 34 * body.torsoY, 4);
      context.fill();
      context.stroke();
      context.fillStyle = "#d92828";
      context.font = "bold 16px Meiryo, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("C", x, y - 3);
    }
  }

  isSumoStyle() {
    return this.uniformEmblem === "sumo" || this.uniformEmblem === "sumoGold";
  }

  isRobotStyle() {
    return this.uniformEmblem === "robot" || this.uniformEmblem === "robotCaptain";
  }

  isBravesStyle() {
    return String(this.uniformEmblem || "").startsWith("braves-");
  }

  isAlienStyle() {
    return this.characterType === "alien" || this.uniformEmblem === "galactako";
  }

  isDemonStyle() {
    return this.characterType === "demon" || this.uniformEmblem === "arkmaLord";
  }

  isShieldDevilStyle() {
    return this.characterType === "shieldDevil" || this.uniformEmblem === "shieldDevil";
  }

  isWitchStyle() {
    return this.characterType === "witch" || this.uniformEmblem === "witch";
  }

  isMiniDevilStyle() {
    return this.characterType === "miniDevil" || this.uniformEmblem === "miniDevil";
  }

  isLavaGolemStyle() {
    return this.characterType === "lavaGolem" || this.uniformEmblem === "lavaGolem";
  }

  getIncomingDamageAmount(amount) {
    let damage = amount * (this.isDemonStyle() || this.isLavaGolemStyle() ? 0.7 : 1);
    if (this.isVampireStyle()) {
      damage = Math.max(0, damage - 15);
    }
    if (this.isShieldDevilStyle()) {
      damage *= 0.65;
    }
    return damage;
  }

  getIncomingKnockbackScale() {
    return this.isDemonStyle() ? 0.5 : 1;
  }

  getLavaGolemHeatStage() {
    if (!this.isLavaGolemStyle()) return 0;
    const hpRatio = this.hp / Math.max(1, this.maxHp);
    if (hpRatio <= 0.2) return 4;
    if (hpRatio <= 0.4) return 3;
    if (hpRatio <= 0.6) return 2;
    if (hpRatio <= 0.8) return 1;
    return 0;
  }

  getLavaGolemPowerScale() {
    const stage = this.getLavaGolemHeatStage();
    if (stage >= 4) return 1.3;
    if (stage >= 2) return 1.2;
    if (stage >= 1) return 1.1;
    return 1;
  }

  getLavaGolemHeatPalette() {
    const palettes = [
      { rock: this.faceColor || "#4a3024", edge: "#1b100c", shadow: "#2a1a14", highlight: "#6a4030", limb: "#4a3024", foot: "#3a241b", horn: "#281713", lava: this.trimColor || "#ff7a1f", core: "#ffd36a" },
      { rock: "#5a2f24", edge: "#2a0f0a", shadow: "#321510", highlight: "#7c3a2a", limb: "#5a2f24", foot: "#462119", horn: "#35130e", lava: "#ff8424", core: "#ffd96a" },
      { rock: "#6f2b20", edge: "#35100a", shadow: "#3f120c", highlight: "#963727", limb: "#6f2b20", foot: "#561b13", horn: "#45120b", lava: "#ff6b1d", core: "#ffe06a" },
      { rock: "#85251a", edge: "#3d0b07", shadow: "#4a0e09", highlight: "#b33725", limb: "#85251a", foot: "#68130d", horn: "#560d08", lava: "#ff5520", core: "#ffe86a" },
      { rock: "#b51e14", edge: "#520806", shadow: "#5c0906", highlight: "#ef3b20", limb: "#b51e14", foot: "#831006", horn: "#6b0805", lava: "#ff3218", core: "#fff06a" }
    ];
    return palettes[this.getLavaGolemHeatStage()] || palettes[0];
  }

  isVampireStyle() {
    return this.characterType === "vampire" || this.uniformEmblem === "vampire";
  }

  getCharacterVisualScale() {
    return this.isDemonStyle()
      ? 1.6
      : this.isLavaGolemStyle()
        ? 1.92
        : this.isAlienStyle() && (this.isCaptain || this.uniformEmblem === "galactakoCaptain")
          ? 1.16
          : this.isBravesStyle() && (this.uniformEmblem === "braves-warrior" || this.uniformEmblem === "braves-knight")
            ? 1.08
            : 1;
  }

  drawBravesCharacter(context, scale, drawY, motionTime) {
    const job = String(this.uniformEmblem || "braves-hero").replace("braves-", "");
    const moving = Math.hypot(this.vx, this.vy) > 15;
    const crouch = this.dodgeType === "duck" && this.dodgeTimer > 0;
    const damaged = this.state === "damaged";
    const down = this.state === "down" || this.defeated;
    const stride = moving ? Math.sin(motionTime / (this.isDashing ? 72 : 116) + this.x * 0.018) : 0;
    const rootY = Math.abs(stride) * 2.8 + (crouch ? 16 : 0);
    const skin = this.faceColor || "#ffd1ad";
    const suit = this.uniformColor || "#2f73e8";
    const pants = this.pantsColor || suit;
    const trim = this.trimColor || "#f7f9ff";
    const hair = this.hairColor || "#f0c14b";
    const eye = this.eyeColor || "#263241";
    const palettes = {
      hero: { edge: "#49627a", body: suit, pants: "#eef4ff", accent: "#e23934", symbol: "#ffd83d", equip: "#d7e5f1" },
      warrior: { edge: "#6b402c", body: "#aa5632", pants: "#4f3729", accent: "#d2a04a", symbol: "#c7ccd1", equip: "#8f9aa2" },
      swordwoman: { edge: "#6b7890", body: "#eef3fb", pants: "#27375f", accent: "#9f3e79", symbol: "#dce6ef", equip: "#dce6ef" },
      knight: { edge: "#5f7488", body: "#c9d2da", pants: "#8996a4", accent: "#2f73d9", symbol: "#2f73d9", equip: "#dce6ef" },
      paladin: { edge: "#72899a", body: "#f8fbff", pants: "#dcefff", accent: "#d7a331", symbol: "#ffd83d", equip: "#eef8ff" },
      mage: { edge: "#31224a", body: suit, pants, accent: trim, symbol: "#d8b6ff", equip: "#8a5a2c" },
      cleric: { edge: "#6b8b79", body: "#fbfbf1", pants: "#dff1e2", accent: "#74bc85", symbol: "#74bc85", equip: "#8a5a2c" },
      archer: { edge: "#3f5a37", body: "#4f8f45", pants: "#7a5334", accent: "#d8c08d", symbol: "#7a5334", equip: "#7a5334" },
      martialArtist: { edge: "#7a4a22", body: "#f7f3e7", pants: "#f7f3e7", accent: "#d92d2d", symbol: "#17191d", equip: "#d92d2d" },
      bard: { edge: "#5e3342", body: "#7d2240", pants: "#253b2d", accent: "#e9d9a5", symbol: "#b87333", equip: "#b87333" }
    };
    const palette = palettes[job] || palettes.hero;
    const big = job === "warrior" || job === "knight";
    const small = job === "mage" || job === "cleric" || job === "bard";
    const bodyW = big ? 31 : job === "mage" ? 16 : job === "cleric" ? 19 : small ? 25 : 28;
    const bodyH = big ? 60 : job === "cleric" ? 72 : small ? 54 : 57;
    const headR = job === "swordwoman" ? 24 : job === "mage" ? 26 : small ? 22 : 23;
    const torsoY = -55 + rootY;
    const shoulderY = -75 + rootY;
    const hipY = -25 + rootY;
    const headY = -97 + rootY;

    const softStroke = (width = 2.5, color = palette.edge) => {
      context.strokeStyle = color;
      context.lineWidth = width;
      context.lineCap = "round";
      context.lineJoin = "round";
    };

    const drawLimb = (points, color, width) => {
      softStroke(width + 3, palette.edge);
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i += 1) context.lineTo(points[i].x, points[i].y);
      context.stroke();
      softStroke(width, color);
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i += 1) context.lineTo(points[i].x, points[i].y);
      context.stroke();
    };

    const drawCape = (color, widthScale = 1) => {
      context.fillStyle = color;
      softStroke(2.5);
      context.beginPath();
      context.moveTo(-22, -73 + rootY);
      context.quadraticCurveTo(-43 * widthScale, -49 + rootY, -32 * widthScale, 12 + rootY);
      context.quadraticCurveTo(0, 25 + rootY, 32 * widthScale, 12 + rootY);
      context.quadraticCurveTo(43 * widthScale, -49 + rootY, 22, -73 + rootY);
      context.quadraticCurveTo(0, -65 + rootY, -22, -73 + rootY);
      context.fill();
      context.stroke();
    };

    const drawShield = (x, y, w, h, color, mark = "cross") => {
      context.fillStyle = color;
      softStroke(2.7);
      context.beginPath();
      context.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      softStroke(3, palette.accent);
      context.beginPath();
      if (mark === "star") {
        context.moveTo(x, y - 11);
        for (let i = 1; i < 10; i += 1) {
          const r = i % 2 ? 4.5 : 11;
          const a = -Math.PI / 2 + i * Math.PI / 5;
          context.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
        }
        context.closePath();
        context.fillStyle = palette.accent;
        context.fill();
      } else if (mark === "sun") {
        context.fillStyle = palette.accent;
        context.beginPath();
        context.arc(x, y, Math.min(w, h) * 0.42, 0, Math.PI * 2);
        context.fill();
        softStroke(2, palette.accent);
        context.beginPath();
        for (let i = 0; i < 8; i += 1) {
          const a = i * Math.PI / 4;
          const r1 = Math.min(w, h) * 0.58;
          const r2 = Math.min(w, h) * 0.82;
          context.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
          context.lineTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2);
        }
        context.stroke();
      } else {
        context.moveTo(x, y - h * 0.55);
        context.lineTo(x, y + h * 0.55);
        context.moveTo(x - w * 0.55, y);
        context.lineTo(x + w * 0.55, y);
        context.stroke();
      }
    };

    const drawSimpleSword = (x, y, length, angle, color = "#dce6ef") => {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.fillStyle = color;
      softStroke(2.2);
      context.beginPath();
      context.moveTo(0, -length);
      context.lineTo(6, -9);
      context.lineTo(0, -1);
      context.lineTo(-6, -9);
      context.closePath();
      context.fill();
      context.stroke();
      softStroke(4, "#8a5a2c");
      context.beginPath();
      context.moveTo(0, -4);
      context.lineTo(0, 16);
      context.stroke();
      context.restore();
    };

    const drawSpear = (x, y, length, angle = -0.12) => {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      softStroke(4.4, "#8a5a2c");
      context.beginPath();
      context.moveTo(0, -length);
      context.lineTo(0, 28);
      context.stroke();
      context.fillStyle = "#dce6ef";
      softStroke(2.2, palette.edge);
      context.beginPath();
      context.moveTo(0, -length - 26);
      context.lineTo(10, -length + 2);
      context.lineTo(0, -length + 13);
      context.lineTo(-10, -length + 2);
      context.closePath();
      context.fill();
      context.stroke();
      context.restore();
    };

    const drawHandAxe = (x, y, angle = -0.18) => {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      softStroke(4, "#7a4c2c");
      context.beginPath();
      context.moveTo(0, -35);
      context.lineTo(0, 23);
      context.stroke();
      context.fillStyle = palette.equip;
      softStroke(2.4);
      context.beginPath();
      context.moveTo(0, -37);
      context.quadraticCurveTo(24, -35, 21, -14);
      context.quadraticCurveTo(8, -20, 0, -14);
      context.quadraticCurveTo(-8, -20, -21, -14);
      context.quadraticCurveTo(-24, -35, 0, -37);
      context.closePath();
      context.fill();
      context.stroke();
      context.restore();
    };

    context.save();
    context.translate(this.x, drawY);
    context.scale(scale * (this.visualDirection === "left" || this.visualDirection === "right" ? this.facing : 1), scale);
    if (down) {
      context.rotate(-0.9);
      context.scale(1.1, 0.8);
    } else if (damaged) {
      context.rotate(-0.12);
    }
    if (crouch) context.scale(1.05, 0.86);

    if (job === "hero") drawCape("#e23934", 0.92);
    if (job === "paladin") drawCape("#dff4ff", 0.82);

    if (job === "archer") {
      softStroke(4.5, palette.equip);
      context.beginPath();
      context.arc(29, -56 + rootY, 36, -1.25, 1.25);
      context.stroke();
      softStroke(1.8, "#f1dfb5");
      context.beginPath();
      context.moveTo(39, -88 + rootY);
      context.lineTo(39, -24 + rootY);
      context.stroke();
    }

    const backLeg = [
      { x: -10, y: hipY },
      { x: -14 - stride * 6, y: -1 + rootY },
      { x: -14 - stride * 9, y: 22 + rootY }
    ];
    const frontLeg = [
      { x: 10, y: hipY },
      { x: 14 + stride * 6, y: -1 + rootY },
      { x: 14 + stride * 9, y: 22 + rootY }
    ];
    drawLimb(backLeg, pants, big ? 8 : 7);
    drawLimb(frontLeg, pants, big ? 8 : 7);

    context.fillStyle = palette.body;
    softStroke(2.6);
    if (job === "mage") {
      context.beginPath();
      context.moveTo(-bodyW, -71 + rootY);
      context.quadraticCurveTo(0, -78 + rootY, bodyW, -71 + rootY);
      context.lineTo(bodyW + 5, -7 + rootY);
      context.quadraticCurveTo(0, 2 + rootY, -bodyW - 5, -7 + rootY);
      context.closePath();
    } else if (job === "cleric") {
      context.beginPath();
      context.moveTo(-bodyW, -72 + rootY);
      context.quadraticCurveTo(0, -80 + rootY, bodyW, -72 + rootY);
      context.lineTo(bodyW + 7, 18 + rootY);
      context.quadraticCurveTo(0, 27 + rootY, -bodyW - 7, 18 + rootY);
      context.closePath();
    } else {
      context.beginPath();
      context.ellipse(0, torsoY, bodyW, bodyH * 0.58, 0, 0, Math.PI * 2);
    }
    context.fill();
    context.stroke();

    const shine = context.createLinearGradient(-bodyW, torsoY - 30, bodyW, torsoY + 8);
    shine.addColorStop(0, "rgba(255,255,255,0.42)");
    shine.addColorStop(0.42, "rgba(255,255,255,0.08)");
    shine.addColorStop(1, "rgba(0,0,0,0.08)");
    context.fillStyle = shine;
    context.beginPath();
    context.ellipse(-4, torsoY - 4, bodyW * 0.78, bodyH * 0.42, -0.15, 0, Math.PI * 2);
    context.fill();

    if (job === "knight") {
      drawShield(-32, -48 + rootY, 17, 30, "#dce6ef", "cross");
      context.fillStyle = palette.accent;
      this.roundRect(context, -11, -76 + rootY, 22, 43, 5);
      context.fill();
    } else if (job === "paladin") {
      context.fillStyle = palette.symbol;
      context.beginPath();
      context.arc(0, -60 + rootY, 9, 0, Math.PI * 2);
      context.fill();
    } else if (job === "cleric") {
      softStroke(4, palette.symbol);
      context.beginPath();
      context.moveTo(0, -70 + rootY);
      context.lineTo(0, -42 + rootY);
      context.moveTo(-10, -56 + rootY);
      context.lineTo(10, -56 + rootY);
      context.stroke();
    } else if (job === "martialArtist") {
      context.fillStyle = palette.symbol;
      context.fillRect(-bodyW, -40 + rootY, bodyW * 2, 8);
    } else if (job === "mage") {
      context.fillStyle = palette.symbol;
      context.beginPath();
      context.arc(0, -51 + rootY, 5, 0, Math.PI * 2);
      context.fill();
    }

    if (job === "swordwoman") {
      context.fillStyle = "rgba(216,230,239,0.92)";
      softStroke(1.8, "#6b7890");
      context.beginPath();
      context.ellipse(0, torsoY - 4, 16, 26, 0, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = palette.accent;
      context.fillRect(-4, torsoY - 28, 8, 50);
      context.fillStyle = "#dce6ef";
      context.beginPath();
      context.ellipse(-22, shoulderY + 3, 8, 6, -0.25, 0, Math.PI * 2);
      context.ellipse(22, shoulderY + 3, 8, 6, 0.25, 0, Math.PI * 2);
      context.fill();
    } else if (job === "archer") {
      softStroke(4, "#7a5334");
      context.beginPath();
      context.moveTo(-20, -78 + rootY);
      context.lineTo(21, -22 + rootY);
      context.stroke();
      context.fillStyle = palette.accent;
      context.beginPath();
      context.moveTo(-24, -76 + rootY);
      context.lineTo(-14, -84 + rootY);
      context.lineTo(-17, -70 + rootY);
      context.closePath();
      context.fill();
    } else if (job === "warrior") {
      context.fillStyle = palette.accent;
      softStroke(2.2);
      context.beginPath();
      context.ellipse(-24, shoulderY + 3, 14, 10, -0.25, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      softStroke(4, "#6b402c");
      context.beginPath();
      context.moveTo(-18, -33 + rootY);
      context.lineTo(18, -33 + rootY);
      context.stroke();
      softStroke(4, "#d2a04a");
      context.beginPath();
      context.arc(-32, -28 + rootY, 6, 0, Math.PI * 2);
      context.arc(32, -28 + rootY, 6, 0, Math.PI * 2);
      context.stroke();
    } else if (job === "martialArtist") {
      softStroke(4, palette.symbol);
      context.beginPath();
      context.moveTo(-18, -36 + rootY);
      context.lineTo(18, -36 + rootY);
      context.stroke();
      softStroke(2.2, "#d8d1bd");
      context.beginPath();
      context.moveTo(0, -80 + rootY);
      context.lineTo(0, -17 + rootY);
      context.stroke();
    }

    const backArm = [
      { x: -bodyW + 3, y: shoulderY },
      { x: -34 - stride * 5, y: -52 + rootY },
      { x: -36 - stride * 7, y: -25 + rootY }
    ];
    const frontArm = [
      { x: bodyW - 3, y: shoulderY },
      { x: 34 + stride * 5, y: -52 + rootY },
      { x: 36 + stride * 7, y: -25 + rootY }
    ];
    const armColor = job === "knight" || job === "paladin" ? palette.body : skin;
    drawLimb(backArm, armColor, big ? 7 : 6);
    drawLimb(frontArm, armColor, big ? 7 : 6);

    if (job === "hero") {
      drawShield(-31, -48 + rootY, 14, 21, "#eef4ff", "star");
      drawSimpleSword(34, -25 + rootY, 61, 0.34, "#dce6ef");
    } else if (job === "paladin") {
      drawSpear(36, -30 + rootY, 82, -0.09);
      drawShield(-31, -47 + rootY, 19, 31, "#f8fbff", "sun");
    } else if (job === "warrior") {
      drawHandAxe(35, -32 + rootY, 0.18);
    } else if (job === "bard") {
      context.fillStyle = palette.symbol;
      softStroke(2.5);
      context.beginPath();
      context.ellipse(24, -39 + rootY, 20, 29, -0.28, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = "#f7e5b5";
      context.beginPath();
      context.arc(24, -39 + rootY, 8, 0, Math.PI * 2);
      context.fill();
      softStroke(2, palette.accent);
      context.beginPath();
      context.moveTo(18, -63 + rootY);
      context.lineTo(31, -17 + rootY);
      context.moveTo(27, -64 + rootY);
      context.lineTo(36, -20 + rootY);
      context.stroke();
    } else if (job === "swordwoman") {
      drawSimpleSword(35, -20 + rootY, 58, 0.55, palette.equip);
    } else if (job === "mage" || job === "cleric") {
      const staffX = job === "mage" ? 37 : -37;
      softStroke(4, palette.equip);
      context.beginPath();
      context.moveTo(staffX, -84 + rootY);
      context.lineTo(staffX, -14 + rootY);
      context.stroke();
      softStroke(3, palette.accent);
      context.beginPath();
      context.arc(staffX, -90 + rootY, job === "mage" ? 7 : 10, 0, Math.PI * 2);
      context.stroke();
    }

    context.fillStyle = skin;
    softStroke(2.4);
    context.beginPath();
    context.arc(0, headY, headR, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    if (job === "mage") {
      context.fillStyle = hair;
      context.beginPath();
      context.ellipse(-15, headY + 8, 12, 34, -0.12, 0, Math.PI * 2);
      context.ellipse(16, headY + 8, 10, 34, 0.12, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.fillStyle = hair;
      context.arc(0, headY - 8, headR - 1, Math.PI, Math.PI * 2);
      context.lineTo(22, headY - 2);
      context.quadraticCurveTo(2, headY - 15, -22, headY - 2);
      context.closePath();
      context.fill();
      context.fillStyle = palette.body;
      softStroke(2.5);
      context.beginPath();
      context.ellipse(0, headY - 21, 35, 9, 0, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.beginPath();
      context.moveTo(-23, headY - 23);
      context.quadraticCurveTo(0, headY - 76, 28, headY - 28);
      context.quadraticCurveTo(15, headY - 18, -23, headY - 23);
      context.closePath();
      context.fill();
      context.stroke();
    } else if (job === "cleric") {
      context.fillStyle = "#fbfbf1";
      softStroke(2.4);
      context.beginPath();
      context.arc(0, headY - 1, headR + 4, Math.PI * 0.88, Math.PI * 2.12);
      context.lineTo(17, headY + 19);
      context.quadraticCurveTo(0, headY + 27, -17, headY + 19);
      context.closePath();
      context.fill();
      context.stroke();
      context.fillStyle = skin;
      context.beginPath();
      context.arc(0, headY + 1, headR - 5, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = hair;
      context.beginPath();
      context.arc(0, headY - 7, headR - 6, Math.PI, Math.PI * 2);
      context.quadraticCurveTo(-7, headY - 4, -14, headY + 2);
      context.quadraticCurveTo(0, headY - 4, 14, headY + 2);
      context.quadraticCurveTo(7, headY - 4, 0, headY - 7);
      context.closePath();
      context.fill();
    } else if (job === "knight") {
      context.fillStyle = "#dce6ef";
      softStroke(2.5);
      context.beginPath();
      context.arc(0, headY - 5, headR + 4, Math.PI, Math.PI * 2);
      context.lineTo(18, headY + 4);
      context.lineTo(-18, headY + 4);
      context.closePath();
      context.fill();
      context.stroke();
      context.fillStyle = palette.accent;
      context.beginPath();
      context.ellipse(0, headY - 31, 7, 13, 0, 0, Math.PI * 2);
      context.fill();
    } else if (job === "archer") {
      context.fillStyle = palette.body;
      softStroke(2.4);
      context.beginPath();
      context.moveTo(-24, headY - 12);
      context.quadraticCurveTo(0, headY - 39, 24, headY - 12);
      context.lineTo(15, headY + 5);
      context.quadraticCurveTo(0, headY - 3, -15, headY + 5);
      context.closePath();
      context.fill();
      context.stroke();
    } else {
      context.fillStyle = hair;
      context.beginPath();
      context.arc(0, headY - 7, headR, Math.PI, Math.PI * 2);
      context.quadraticCurveTo(10, headY - 9, 16, headY - 2);
      context.quadraticCurveTo(6, headY - 7, 0, headY - 2);
      context.quadraticCurveTo(-7, headY - 8, -16, headY - 2);
      context.quadraticCurveTo(-10, headY - 9, -headR, headY - 6);
      context.closePath();
      context.fill();
      if (job === "swordwoman") {
        context.beginPath();
        context.ellipse(-15, headY + 6, 7, 25, 0.05, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.ellipse(26, headY - 12, 11, 30, -0.25, 0, Math.PI * 2);
        context.fill();
      }
    }

    if (job === "martialArtist") {
      softStroke(4, palette.accent);
      context.beginPath();
      context.moveTo(-22, headY - 13);
      context.lineTo(22, headY - 13);
      context.lineTo(36, headY - 22);
      context.stroke();
    } else if (job === "bard") {
      context.fillStyle = palette.body;
      softStroke(2.4);
      context.beginPath();
      context.ellipse(0, headY - 25, 25, 7, -0.1, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = palette.accent;
      context.beginPath();
      context.ellipse(23, headY - 31, 11, 4, -0.55, 0, Math.PI * 2);
      context.fill();
    }

    const cuteFace = job === "swordwoman" || job === "mage";
    context.fillStyle = eye;
    context.beginPath();
    context.arc(-7, headY, cuteFace ? 3.5 : 2.8, 0, Math.PI * 2);
    context.arc(7, headY, cuteFace ? 3.5 : 2.8, 0, Math.PI * 2);
    context.fill();
    if (cuteFace) {
      context.fillStyle = "rgba(255,255,255,0.85)";
      context.beginPath();
      context.arc(-8, headY - 1, 1.1, 0, Math.PI * 2);
      context.arc(6, headY - 1, 1.1, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "rgba(255,136,150,0.32)";
      context.beginPath();
      context.ellipse(-14, headY + 7, 4.8, 2.6, 0, 0, Math.PI * 2);
      context.ellipse(14, headY + 7, 4.8, 2.6, 0, 0, Math.PI * 2);
      context.fill();
    }
    softStroke(cuteFace ? 1.7 : 1.8, "rgba(70,82,92,0.65)");
    context.beginPath();
    context.arc(0, headY + 9, cuteFace ? 6 : 7, 0.15, Math.PI - 0.15);
    context.stroke();

    context.restore();
  }

  isRobotOverdrive() {
    return (
      this.isRobotStyle() &&
      !this.defeated &&
      this.hp > 0 &&
      this.hp / Math.max(1, this.maxHp) <= ROBOT_OVERDRIVE_CONFIG.hpRatio
    );
  }

  getEffectiveThrowPower() {
    return this.throwPower *
      (this.isRobotOverdrive() ? ROBOT_OVERDRIVE_CONFIG.powerScale : 1) *
      (this.isLavaGolemStyle() ? 1.18 * this.getLavaGolemPowerScale() : 1);
  }

  getAlienFloatOffset(motionTime = performance.now()) {
    if (!this.isAlienStyle()) return 0;
    const moving = Math.hypot(this.vx, this.vy) > 15;
    const base = 15 + Math.sin(motionTime / 420 + this.x * 0.018 + this.y * 0.01) * 5;
    return base + (moving ? Math.sin(motionTime / 180) * 3 : 0);
  }

  drawAlienCharacter(context, scale, drawY, motionTime) {
    const captain = this.isCaptain || this.uniformEmblem === "galactakoCaptain";
    const moving = Math.hypot(this.vx, this.vy) > 15;
    const crouch = this.dodgeType === "duck" && this.dodgeTimer > 0;
    const damaged = this.state === "damaged";
    const down = this.state === "down" || this.defeated;
    const catchProgress = this.catchTimer > 0 ? 1 : this.catchSuccessTimer > 0 ? 0.6 : 0;
    const throwWindup = this.state === "throwing" && this.throwPhase === "windup";
    const throwRelease = this.state === "throwing" && this.throwPhase === "release";
    const floatLift = this.getAlienFloatOffset(motionTime);
    const drift = moving ? Math.sin(motionTime / (this.isDashing ? 90 : 150) + this.x * 0.02) : 0;
    const lean = this.isDashing ? -this.facing * 0.12 : moving ? -this.facing * 0.05 : 0;
    const bodyColor = this.faceColor || "#48d7b8";
    const shadeColor = this.hairColor || "#167f9d";
    const eyeColor = this.eyeColor || "#cafff7";
    const trimColor = this.trimColor || "#7cffcb";
    const suitColor = this.uniformColor || "#1d9ec4";
    const bodyWidth = captain ? 63 : 55;
    const bodyHeight = captain ? 78 : 70;
    const tentacleCount = captain ? 7 : 5;
    const tentacleCenter = (tentacleCount - 1) / 2;

    context.save();
    context.translate(this.x, drawY - floatLift);
    context.scale(scale * this.facing, scale);
    if (down) {
      context.rotate(-0.95);
      context.scale(1.1, 0.8);
    } else {
      context.rotate(lean + (damaged ? -0.12 : 0));
      if (crouch) context.scale(1.08, 0.82);
    }

    context.fillStyle = "rgba(35, 80, 82, 0.18)";
    context.beginPath();
    context.ellipse(0, 28 + floatLift * 0.16, 38, 10, 0, 0, Math.PI * 2);
    context.fill();

    const tentacleBaseY = -38;
    for (let index = 0; index < tentacleCount; index += 1) {
      const t = index - tentacleCenter;
      const phase = motionTime / 190 + index * 1.35 + this.x * 0.015;
      const sway = Math.sin(phase) * (moving ? 10 : 5) + drift * 4;
      const dashBend = this.isDashing ? -this.facing * (8 + index * 1.5) : 0;
      const startX = t * (captain ? 10 : 12);
      const midX = startX + sway * 0.35 + dashBend * 0.35;
      const endX = startX + sway + dashBend;
      const endY = (captain ? 24 : 20) + Math.cos(phase * 0.8) * 5;
      context.strokeStyle = index % 2 === 0 ? shadeColor : bodyColor;
      context.lineWidth = Math.max(5, (captain ? 11 : 10) - Math.abs(t));
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(startX, tentacleBaseY);
      context.quadraticCurveTo(midX, -10, endX, endY);
      context.stroke();

      context.fillStyle = captain
        ? (index % 2 === 0 ? "rgba(255,216,74,0.76)" : "rgba(124,255,203,0.72)")
        : "rgba(202,255,247,0.45)";
      context.beginPath();
      context.arc(endX - this.facing * 2, endY - 2, captain ? 4.2 : 2.5, 0, Math.PI * 2);
      context.fill();
    }

    const bodyGradient = context.createRadialGradient(-18, -120, 10, 0, -84, captain ? 92 : 82);
    bodyGradient.addColorStop(0, "#8fffe4");
    bodyGradient.addColorStop(0.55, bodyColor);
    bodyGradient.addColorStop(1, shadeColor);
    context.fillStyle = bodyGradient;
    context.beginPath();
    context.ellipse(0, -83, bodyWidth, bodyHeight, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = suitColor;
    context.beginPath();
    context.ellipse(0, -35, captain ? 37 : 32, captain ? 28 : 25, 0, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = trimColor;
    context.lineWidth = 4;
    context.beginPath();
    context.arc(0, -40, captain ? 34 : 29, 0.12, Math.PI - 0.12);
    context.stroke();

    const eyeY = -102 + (catchProgress ? -4 : 0);
    const eyeSpread = this.visualDirection === "up" || this.visualDirection === "down" ? 18 : 20;
    context.fillStyle = "#eaffff";
    context.strokeStyle = "#124d62";
    context.lineWidth = 3;
    for (const side of [-1, 1]) {
      context.beginPath();
      context.ellipse(side * eyeSpread, eyeY, 13, 17, side * 0.08, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = eyeColor;
      context.beginPath();
      context.arc(side * eyeSpread + side * (throwRelease ? 4 : throwWindup ? -3 : 0), eyeY + 2, 5.5, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#eaffff";
    }
    if (captain) {
      context.beginPath();
      context.ellipse(0, eyeY - 22, 10, 12, 0, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = "#ffd84a";
      context.beginPath();
      context.arc(0, eyeY - 20, 4.8, 0, Math.PI * 2);
      context.fill();
    }

    context.strokeStyle = damaged ? "#ffffff" : "#145466";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(0, -77, damaged ? 8 : 5, 0.1, Math.PI - 0.1);
    context.stroke();

    if (throwWindup || throwRelease) {
      context.strokeStyle = "#cafff7";
      context.lineWidth = 7;
      context.lineCap = "round";
      const armBack = throwWindup ? -44 : 32;
      const armFront = throwWindup ? -70 : 58;
      context.beginPath();
      context.moveTo(22, -49);
      context.quadraticCurveTo(armBack, -78, armFront, -100);
      context.stroke();
    } else if (catchProgress > 0) {
      context.strokeStyle = "#cafff7";
      context.lineWidth = 7;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(-24, -58);
      context.quadraticCurveTo(-18, -104, -6, -122);
      context.moveTo(24, -58);
      context.quadraticCurveTo(18, -104, 6, -122);
      context.stroke();
    }

    context.restore();
  }

  drawLavaGolemCharacter(context, scale, drawY, motionTime) {
    const moving = Math.hypot(this.vx, this.vy) > 15;
    const crouch = this.dodgeType === "duck" && this.dodgeTimer > 0;
    const damaged = this.state === "damaged";
    const down = this.state === "down" || this.defeated;
    const throwWindup = this.state === "throwing" && this.throwPhase === "windup";
    const throwRelease = this.state === "throwing" && this.throwPhase === "release";
    const catching = this.catchTimer > 0 || this.catchSuccessTimer > 0;
    const heat = this.getLavaGolemHeatPalette();
    const rock = heat.rock;
    const rockEdge = heat.edge;
    const rockShadow = heat.shadow;
    const lava = heat.lava;
    const lavaCore = heat.core;
    const eye = this.eyeColor || "#ffd43b";
    const pulse = 0.68 + Math.sin(motionTime / 115) * 0.32;
    const chargeGlow = ((this.hasBall || throwWindup) ? 1.45 : 1) + this.getLavaGolemHeatStage() * 0.12;
    const bob = moving ? Math.abs(Math.sin(motionTime / (this.isDashing ? 58 : 96))) * 3 : 0;
    const rootY = (crouch ? 14 : 0) + bob;
    const bodyY = -61 + rootY;
    const headY = -112 + rootY + (crouch ? 8 : 0);
    const shoulderY = -71 + rootY;
    const hipY = -24 + rootY;
    const stride = moving ? Math.sin(motionTime / 88 + this.x * 0.018) * (this.isDashing ? 9 : 6) : 0;
    let backHand = { x: -62 - stride * 0.2, y: -34 + rootY };
    let frontHand = { x: 62 + stride * 0.2, y: -34 + rootY };

    if (throwWindup) {
      frontHand = { x: -66, y: -120 + rootY };
      backHand = { x: 54, y: -28 + rootY };
    } else if (throwRelease) {
      frontHand = { x: 88, y: -62 + rootY };
      backHand = { x: -56, y: -32 + rootY };
    } else if (catching) {
      frontHand = { x: 26, y: -116 + rootY };
      backHand = { x: -26, y: -116 + rootY };
    } else if (crouch) {
      frontHand = { x: 46, y: -15 + rootY };
      backHand = { x: -46, y: -15 + rootY };
    }

    context.save();
    context.translate(this.x, drawY);
    context.scale(scale * this.facing, scale);
    if (down) {
      context.rotate(-0.7);
      context.scale(1.12, 0.76);
    } else if (damaged) {
      context.rotate(-0.09);
    }

    context.fillStyle = "rgba(30, 10, 6, 0.28)";
    context.beginPath();
    context.ellipse(0, 20, 68, 14, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = rockShadow;
    context.strokeStyle = rockEdge;
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(-25, hipY + 8);
    context.quadraticCurveTo(-68, hipY + 19, -82, hipY + 48);
    context.quadraticCurveTo(-49, hipY + 39, -25, hipY + 24);
    context.closePath();
    context.fill();
    context.stroke();

    this.drawRockLimb(context, [{ x: -22, y: hipY + 9 }, { x: -27 - stride, y: 4 + rootY }, { x: -30 - stride * 1.05, y: 10 + rootY }], 18);
    this.drawRockLimb(context, [{ x: 22, y: hipY + 9 }, { x: 27 + stride, y: 4 + rootY }, { x: 30 + stride * 1.05, y: 10 + rootY }], 18);
    this.drawLavaGolemFoot(context, { x: -30 - stride * 1.05, y: 10 + rootY });
    this.drawLavaGolemFoot(context, { x: 30 + stride * 1.05, y: 10 + rootY });

    this.drawRockLimb(context, [{ x: -43, y: shoulderY }, { x: -58, y: -52 + rootY }, backHand], 23);
    this.drawRockLimb(context, [{ x: 43, y: shoulderY }, { x: 58, y: -52 + rootY }, frontHand], 25);
    this.drawLavaGolemFist(context, backHand, 0.9);
    this.drawLavaGolemFist(context, frontHand, 1.04);

    context.fillStyle = rock;
    context.strokeStyle = rockEdge;
    context.lineWidth = 5;
    context.beginPath();
    context.ellipse(0, bodyY, 77, 84, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = heat.highlight;
    context.beginPath();
    context.ellipse(-22, bodyY - 10, 39, 53, -0.28, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = rockShadow;
    context.beginPath();
    context.ellipse(30, bodyY + 15, 41, 47, 0.25, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    this.drawLavaCrack(context, [-48, bodyY - 41, -15, bodyY - 12, -32, bodyY + 27, -6, bodyY + 59], pulse * chargeGlow);
    this.drawLavaCrack(context, [18, bodyY - 57, 45, bodyY - 29, 27, bodyY + 5, 57, bodyY + 36], pulse * 0.9 * chargeGlow);
    this.drawLavaCrack(context, [-5, bodyY - 72, 8, bodyY - 36, -9, bodyY - 5, 12, bodyY + 27], pulse * 1.08 * chargeGlow);

    context.fillStyle = rock;
    context.strokeStyle = rockEdge;
    context.lineWidth = 5;
    context.beginPath();
    context.ellipse(0, headY, 39, 31, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = heat.horn;
    for (const side of [-1, 1]) {
      context.beginPath();
      context.moveTo(side * 12, headY - 24);
      context.lineTo(side * 25, headY - 48);
      context.lineTo(side * 3, headY - 29);
      context.closePath();
      context.fill();
    }
    context.globalCompositeOperation = "lighter";
    context.fillStyle = eye;
    for (const side of [-1, 1]) {
      context.beginPath();
      context.ellipse(side * 14, headY - 4, 8, 5, 0, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#fff0a6";
      context.beginPath();
      context.ellipse(side * 14, headY - 4, 3, 2, 0, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = eye;
    }
    context.globalCompositeOperation = "source-over";

    context.save();
    context.globalCompositeOperation = "lighter";
    context.globalAlpha = 0.28 + pulse * 0.22;
    context.fillStyle = lava;
    context.beginPath();
    context.ellipse(0, headY - 35, 13, 7, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = lavaCore;
    context.beginPath();
    context.ellipse(0, headY - 38, 6, 4, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();

    if (this.hasBall) {
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.25 + pulse * 0.2;
      context.strokeStyle = lava;
      context.lineWidth = 9;
      context.beginPath();
      context.arc(frontHand.x, frontHand.y, 36, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = lavaCore;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(frontHand.x, frontHand.y, 45, -0.8, Math.PI * 1.1);
      context.stroke();
      context.restore();
    }

    context.restore();
  }

  drawRockLimb(context, points, width) {
    const heat = this.getLavaGolemHeatPalette();
    context.strokeStyle = heat.limb;
    context.lineWidth = width;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.lineTo(points[1].x, points[1].y);
    context.lineTo(points[2].x, points[2].y);
    context.stroke();
    context.strokeStyle = heat.edge;
    context.lineWidth = 3;
    context.stroke();
  }

  drawLavaCrack(context, coords, pulse = 1) {
    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";
    context.globalCompositeOperation = "lighter";
    context.strokeStyle = `rgba(255, 78, 24, ${0.42 + pulse * 0.26})`;
    context.lineWidth = 6;
    context.beginPath();
    context.moveTo(coords[0], coords[1]);
    for (let i = 2; i < coords.length; i += 2) {
      context.lineTo(coords[i], coords[i + 1]);
    }
    context.stroke();
    context.strokeStyle = "#ffd36a";
    context.lineWidth = 2;
    context.stroke();
    context.restore();
  }

  drawLavaGolemFist(context, hand, scale = 1) {
    const heat = this.getLavaGolemHeatPalette();
    context.fillStyle = heat.limb;
    context.strokeStyle = heat.edge;
    context.lineWidth = 3;
    context.beginPath();
    context.ellipse(hand.x, hand.y, 18 * scale, 15 * scale, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    this.drawLavaCrack(context, [hand.x - 8, hand.y - 4, hand.x + 1, hand.y + 1, hand.x + 8, hand.y - 5], 0.8);
  }

  drawLavaGolemFoot(context, foot) {
    const heat = this.getLavaGolemHeatPalette();
    context.fillStyle = heat.foot;
    context.strokeStyle = heat.edge;
    context.lineWidth = 3;
    context.beginPath();
    context.ellipse(foot.x + 4, foot.y + 4, 21, 8, 0.06, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = heat.edge;
    context.fillRect(foot.x - 13, foot.y + 9, 34, 5);
  }

  drawFireDragonCharacter(context, scale, drawY, motionTime) {
    const moving = Math.hypot(this.vx, this.vy) > 15;
    const crouch = this.dodgeType === "duck" && this.dodgeTimer > 0;
    const damaged = this.state === "damaged";
    const down = this.state === "down" || this.defeated;
    const throwWindup = this.state === "throwing" && this.throwPhase === "windup";
    const throwRelease = this.state === "throwing" && this.throwPhase === "release";
    const catching = this.catchTimer > 0 || this.catchSuccessTimer > 0;
    const skin = this.faceColor || "#7c1914";
    const darkSkin = "#4b0e10";
    const belly = "#f0d8a1";
    const lava = "#ff5a1f";
    const lavaDark = "#160507";
    const wingMembrane = "#b81f1f";
    const wingBone = "#0b0708";
    const horn = this.trimColor || "#d9a831";
    const eye = this.eyeColor || "#ffd43b";
    const bob = moving ? Math.abs(Math.sin(motionTime / (this.isDashing ? 55 : 88))) * 3.5 : 0;
    const rootY = (crouch ? 18 : 0) + bob;
    const hipY = -26 + rootY;
    const shoulderY = -89 + rootY;
    const torsoY = -58 + rootY;
    const headY = -135 + rootY + (crouch ? 12 : 0);
    const stride = moving ? Math.sin(motionTime / 84 + this.x * 0.018) * (this.isDashing ? 11 : 7) : 0;
    const flamePulse = 0.7 + Math.sin(motionTime / 85) * 0.3;
    let backHand = { x: -56 - stride * 0.25, y: -43 + rootY };
    let frontHand = { x: 58 + stride * 0.25, y: -43 + rootY };

    if (throwWindup) {
      frontHand = { x: -76, y: -126 + rootY };
      backHand = { x: 48, y: -36 + rootY };
    } else if (throwRelease) {
      frontHand = { x: 90, y: -70 + rootY };
      backHand = { x: -52, y: -44 + rootY };
    } else if (catching) {
      frontHand = { x: 22, y: -122 + rootY };
      backHand = { x: -22, y: -122 + rootY };
    } else if (crouch) {
      frontHand = { x: 42, y: -20 + rootY };
      backHand = { x: -42, y: -20 + rootY };
    }

    context.save();
    context.translate(this.x, drawY);
    context.scale(scale * this.facing, scale);
    if (down) {
      context.rotate(-0.82);
      context.scale(1.14, 0.78);
    } else if (damaged) {
      context.rotate(-0.1);
    }

    context.fillStyle = "rgba(52, 10, 5, 0.3)";
    context.beginPath();
    context.ellipse(0, 24, 52, 11, 0, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = lavaDark;
    context.lineWidth = 16;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(-16, hipY + 13);
    context.quadraticCurveTo(-72, hipY + 28, -94, hipY + 52);
    context.quadraticCurveTo(-64, hipY + 48, -40, hipY + 31);
    context.stroke();
    context.fillStyle = "#2b0909";
    context.beginPath();
    context.moveTo(-96, hipY + 52);
    context.lineTo(-118, hipY + 45);
    context.lineTo(-103, hipY + 66);
    context.closePath();
    context.fill();

    context.save();
    context.globalAlpha = 0.96;
    for (const side of [-1, 1]) {
      context.fillStyle = wingMembrane;
      context.strokeStyle = wingBone;
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(side * 20, shoulderY + 4);
      context.quadraticCurveTo(side * 72, shoulderY - 42, side * 96, shoulderY - 22);
      context.quadraticCurveTo(side * 76, shoulderY + 26, side * 34, shoulderY + 36);
      context.closePath();
      context.fill();
      context.stroke();
      context.strokeStyle = wingBone;
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(side * 25, shoulderY + 2);
      context.lineTo(side * 86, shoulderY - 20);
      context.moveTo(side * 35, shoulderY + 29);
      context.lineTo(side * 72, shoulderY - 5);
      context.stroke();
    }
    context.restore();

    this.drawModelLimb(context, [{ x: -19, y: hipY }, { x: -27 - stride, y: -5 + rootY }, { x: -30 - stride * 1.35, y: 18 + rootY }], darkSkin, 18);
    this.drawModelLimb(context, [{ x: 19, y: hipY }, { x: 27 + stride, y: -5 + rootY }, { x: 30 + stride * 1.35, y: 18 + rootY }], darkSkin, 18);
    this.drawDragonFoot(context, { x: -30 - stride * 1.35, y: 18 + rootY });
    this.drawDragonFoot(context, { x: 30 + stride * 1.35, y: 18 + rootY });

    this.drawModelLimb(context, [{ x: -41, y: shoulderY }, { x: -58, y: -63 + rootY }, backHand], skin, 20);
    this.drawModelLimb(context, [{ x: 41, y: shoulderY }, { x: 59, y: -63 + rootY }, frontHand], skin, 22);
    this.drawDragonClaw(context, backHand, -1);
    this.drawDragonClaw(context, frontHand, 1);

    context.fillStyle = skin;
    context.strokeStyle = lavaDark;
    context.lineWidth = 5;
    context.beginPath();
    context.ellipse(0, torsoY, 48, 52, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = belly;
    context.beginPath();
    context.ellipse(0, torsoY + 8, 24, 42, 0, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "rgba(90,45,18,0.45)";
    context.lineWidth = 2;
    for (let y = -16; y <= 30; y += 12) {
      context.beginPath();
      context.moveTo(-17, torsoY + y);
      context.quadraticCurveTo(0, torsoY + y + 5, 17, torsoY + y);
      context.stroke();
    }

    context.strokeStyle = lava;
    context.lineWidth = 3;
    context.lineCap = "round";
    for (const side of [-1, 1]) {
      context.beginPath();
      context.moveTo(side * 27, shoulderY + 3);
      context.lineTo(side * 41, shoulderY + 20);
      context.lineTo(side * 31, shoulderY + 38);
      context.stroke();
      context.beginPath();
      context.moveTo(side * 16, hipY - 4);
      context.lineTo(side * 31, hipY + 9);
      context.stroke();
    }
    context.strokeStyle = lavaDark;
    context.lineWidth = 6;
    context.beginPath();
    context.moveTo(0, headY + 38);
    context.lineTo(0, shoulderY - 5);
    context.lineTo(0, torsoY - 42);
    context.stroke();
    context.fillStyle = "#090607";
    for (let i = 0; i < 5; i += 1) {
      const y = headY + 18 + i * 22;
      context.beginPath();
      context.moveTo(0, y - 20);
      context.lineTo(-9, y);
      context.lineTo(9, y);
      context.closePath();
      context.fill();
    }

    context.fillStyle = skin;
    context.strokeStyle = lavaDark;
    context.lineWidth = 5;
    context.beginPath();
    context.ellipse(2, headY, 36, 34, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.beginPath();
    context.ellipse(26, headY + 8, 35, 18, 0.04, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.fillStyle = horn;
    context.strokeStyle = "#5b3510";
    context.lineWidth = 3;
    for (const side of [-1, 1]) {
      context.beginPath();
      context.moveTo(side * 18, headY - 26);
      context.quadraticCurveTo(side * 50, headY - 60, side * 79, headY - 50);
      context.quadraticCurveTo(side * 48, headY - 41, side * 28, headY - 11);
      context.closePath();
      context.fill();
      context.stroke();
    }

    context.fillStyle = eye;
    for (const side of [-1, 1]) {
      const ex = side < 0 ? -6 : 18;
      context.beginPath();
      context.ellipse(ex, headY - 5, 8, 5, -side * 0.1, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#050505";
      context.beginPath();
      context.ellipse(ex + side * 1.5, headY - 5, 2, 5, 0, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = eye;
    }

    context.strokeStyle = "#240707";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(8, headY + 15);
    context.quadraticCurveTo(30, headY + 24, 56, headY + 13);
    context.stroke();
    context.fillStyle = "#fff0d0";
    for (const tooth of [
      { x: 20, y: headY + 18, d: 1 },
      { x: 34, y: headY + 20, d: 1 },
      { x: 22, y: headY + 8, d: -1 },
      { x: 42, y: headY + 7, d: -1 }
    ]) {
      context.beginPath();
      context.moveTo(tooth.x - 4, tooth.y);
      context.lineTo(tooth.x + 4, tooth.y);
      context.lineTo(tooth.x, tooth.y + tooth.d * 12);
      context.closePath();
      context.fill();
    }

    context.save();
    context.globalCompositeOperation = "lighter";
    context.globalAlpha = 0.7;
    context.fillStyle = "#ff8a18";
    context.beginPath();
    context.ellipse(62, headY + 10, 8 + flamePulse * 5, 4 + flamePulse * 3, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ffd66a";
    context.beginPath();
    context.ellipse(66, headY + 10, 4 + flamePulse * 3, 2 + flamePulse * 2, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();

    if (this.hasBall) {
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.25 + flamePulse * 0.18;
      context.strokeStyle = "#ff4b1f";
      context.lineWidth = 8;
      context.beginPath();
      context.arc(frontHand.x, frontHand.y, 34, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = "#ffd36a";
      context.lineWidth = 3;
      context.beginPath();
      context.arc(frontHand.x, frontHand.y, 43, -0.6, Math.PI * 1.2);
      context.stroke();
      context.restore();
    }

    context.restore();
  }

  drawDragonFoot(context, foot) {
    context.fillStyle = "#3d0b0b";
    context.strokeStyle = "#100304";
    context.lineWidth = 3;
    context.beginPath();
    context.ellipse(foot.x + 5, foot.y + 3, 19, 8, 0.06, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = "#050505";
    for (const offset of [-9, 2, 13]) {
      context.beginPath();
      context.moveTo(foot.x + offset, foot.y + 7);
      context.lineTo(foot.x + offset + 8, foot.y + 7);
      context.lineTo(foot.x + offset + 4, foot.y + 17);
      context.closePath();
      context.fill();
    }
  }

  drawDragonClaw(context, hand, side) {
    context.fillStyle = "#050505";
    for (let i = 0; i < 5; i += 1) {
      const spread = (i - 2) * 4.5;
      context.beginPath();
      context.moveTo(hand.x + side * 2, hand.y + spread);
      context.lineTo(hand.x + side * 15, hand.y + spread + 2);
      context.lineTo(hand.x + side * 5, hand.y + spread + 7);
      context.closePath();
      context.fill();
    }
  }

  drawWitchCharacter(context, scale, drawY, motionTime) {
    const moving = Math.hypot(this.vx, this.vy) > 15;
    const crouch = this.dodgeType === "duck" && this.dodgeTimer > 0;
    const damaged = this.state === "damaged";
    const down = this.state === "down" || this.defeated;
    const throwWindup = this.state === "throwing" && this.throwPhase === "windup";
    const throwRelease = this.state === "throwing" && this.throwPhase === "release";
    const catching = this.catchTimer > 0 || this.catchSuccessTimer > 0;
    const reflectChant = this.reflectChantTimer > 0;
    const reflectShield = this.reflectShieldTimer > 0;
    const arcanaChant = this.arcanaAnticipation && this.hasBall;
    const robe = this.uniformColor || "#6f2aa6";
    const robeDark = this.pantsColor || "#35114f";
    const trim = this.trimColor || "#d8b6ff";
    const skin = this.faceColor || "#f4d4c8";
    const hair = this.hairColor || "#edf1ff";
    const eye = this.eyeColor || "#e0183c";
    const floatBob = Math.sin(motionTime / (moving ? 135 : 230) + this.x * 0.01) * (moving ? 5 : 3);
    const glide = moving ? Math.sin(motionTime / 180 + this.y * 0.01) * 3 : 0;
    const rootY = (crouch ? 14 : 0) + floatBob;
    const headY = -112 + rootY;
    const shoulderY = -72 + rootY;
    const hipY = -19 + rootY;
    const stride = moving ? Math.sin(motionTime / 118 + this.x * 0.018) * (this.isDashing ? 7 : 4) : 0;
    let wandHand = { x: 49 + glide, y: -67 + rootY };
    let freeHand = { x: -33 - glide, y: -58 + rootY };

    if (reflectChant || reflectShield || arcanaChant) {
      wandHand = { x: 16, y: -150 + rootY };
      freeHand = { x: -25, y: -86 + rootY };
    } else if (throwWindup) {
      wandHand = { x: -56, y: -111 + rootY };
      freeHand = { x: 37, y: -45 + rootY };
    } else if (throwRelease) {
      wandHand = { x: 71, y: -94 + rootY };
      freeHand = { x: -34, y: -52 + rootY };
    } else if (catching) {
      wandHand = { x: 28, y: -112 + rootY };
      freeHand = { x: -28, y: -112 + rootY };
    } else if (crouch) {
      wandHand = { x: 43, y: -27 + rootY };
      freeHand = { x: -31, y: -30 + rootY };
    }

    context.save();
    context.translate(this.x, drawY);
    context.scale(scale * this.facing, scale);
    if (down) {
      context.rotate(-Math.PI / 2.5);
      context.translate(-18, 20);
    }

    context.fillStyle = "rgba(28, 10, 42, 0.23)";
    context.beginPath();
    context.ellipse(0, 22, 29, 7, 0, 0, Math.PI * 2);
    context.fill();

    if (this.witchWarpTimer > 0) {
      const ratio = Math.max(0, Math.min(1, this.witchWarpTimer / 0.55));
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.28 + ratio * 0.52;
      context.strokeStyle = "#d8b6ff";
      context.lineWidth = 6;
      context.beginPath();
      context.ellipse(0, 20, 48 + ratio * 30, 15 + ratio * 9, motionTime / 180, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = "#9fdcff";
      context.lineWidth = 4;
      context.beginPath();
      context.ellipse(0, -52, 36 + ratio * 22, 92 + ratio * 22, motionTime / 260, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = "#ff6ee7";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(-42 - ratio * 18, -96);
      context.quadraticCurveTo(0, -132 - ratio * 20, 42 + ratio * 18, -96);
      context.moveTo(-38 - ratio * 18, -10);
      context.quadraticCurveTo(0, 26 + ratio * 12, 38 + ratio * 18, -10);
      context.stroke();
      for (let spark = 0; spark < 18; spark += 1) {
        const angle = spark * Math.PI * 2 / 18 + motionTime / 145;
        const sx = Math.cos(angle) * (26 + ratio * 52);
        const sy = -52 + Math.sin(angle) * (45 + ratio * 35);
        context.fillStyle = spark % 3 === 0 ? "#ffffff" : spark % 3 === 1 ? "#ff6ee7" : "#9fdcff";
        context.beginPath();
        context.arc(sx, sy, 2.5 + (spark % 3), 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    }

    if (reflectShield) {
      const pulse = 1 + Math.sin(motionTime / 85) * 0.06;
      context.save();
      context.translate(76, -72 + rootY);
      context.scale(pulse, pulse);
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.36;
      context.fillStyle = "#7b2cff";
      context.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const angle = Math.PI / 6 + i * Math.PI / 3;
        const px = Math.cos(angle) * 48;
        const py = Math.sin(angle) * 58;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.fill();
      context.globalAlpha = 0.92;
      context.strokeStyle = "#e1b8ff";
      context.lineWidth = 5;
      context.stroke();
      context.strokeStyle = "#9b2cff";
      context.lineWidth = 3;
      context.beginPath();
      context.arc(0, 0, 31, 0, Math.PI * 2);
      context.stroke();
      for (let i = 0; i < 6; i += 1) {
        const angle = Math.PI / 6 + i * Math.PI / 3;
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(Math.cos(angle) * 44, Math.sin(angle) * 52);
        context.stroke();
      }
      context.restore();
    }

    context.fillStyle = "#08050e";
    context.beginPath();
    context.moveTo(-34, shoulderY - 1);
    context.quadraticCurveTo(-52, -38 + rootY, -40, 12 + rootY);
    context.quadraticCurveTo(-14, 29 + rootY, 0, 17 + rootY);
    context.quadraticCurveTo(14, 29 + rootY, 40, 12 + rootY);
    context.quadraticCurveTo(52, -38 + rootY, 34, shoulderY - 1);
    context.closePath();
    context.fill();

    this.drawModelLimb(context, [{ x: -10, y: hipY }, { x: -14 - stride, y: 0 + rootY }, { x: -16 - stride * 1.1, y: 23 + rootY }], "#221027", 8);
    this.drawModelLimb(context, [{ x: 10, y: hipY }, { x: 14 + stride, y: 0 + rootY }, { x: 16 + stride * 1.1, y: 23 + rootY }], "#221027", 8);
    this.drawModelFoot(context, { x: -16 - stride * 1.1, y: 23 + rootY }, "#120816");
    this.drawModelFoot(context, { x: 16 + stride * 1.1, y: 23 + rootY }, "#120816");

    this.drawModelLimb(context, [{ x: -22, y: shoulderY }, { x: -30, y: -62 + rootY }, freeHand], skin, 8);
    this.drawModelLimb(context, [{ x: 22, y: shoulderY }, { x: 34, y: -64 + rootY }, wandHand], skin, 8);

    const robeGradient = context.createLinearGradient(-26, shoulderY, 27, 22 + rootY);
    robeGradient.addColorStop(0, "#9a4bd5");
    robeGradient.addColorStop(0.5, robe);
    robeGradient.addColorStop(1, robeDark);
    context.fillStyle = robeGradient;
    context.strokeStyle = "#180824";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(-24, shoulderY - 3);
    context.quadraticCurveTo(-34, -26 + rootY, -27, 22 + rootY);
    context.lineTo(0, 32 + rootY);
    context.lineTo(27, 22 + rootY);
    context.quadraticCurveTo(34, -26 + rootY, 24, shoulderY - 3);
    context.closePath();
    context.fill();
    context.stroke();
    context.strokeStyle = trim;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(0, shoulderY + 3);
    context.lineTo(0, 24 + rootY);
    context.moveTo(-18, -53 + rootY);
    context.quadraticCurveTo(0, -43 + rootY, 18, -53 + rootY);
    context.stroke();

    context.strokeStyle = "#6b3b1b";
    context.lineWidth = 5;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(wandHand.x + 5, wandHand.y + 18);
    context.lineTo(wandHand.x + 31, wandHand.y - 60);
    context.stroke();
    context.fillStyle = "#ff304a";
    context.strokeStyle = "#ffd1d8";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(wandHand.x + 33, wandHand.y - 66, 8 + Math.sin(motionTime / 120) * 1.2, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    if (reflectChant || arcanaChant) {
      const ratio = arcanaChant ? 0.85 : Math.max(0, Math.min(1, 1 - this.reflectChantTimer / 0.8));
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.28 + ratio * 0.45;
      context.strokeStyle = "#d8b6ff";
      context.lineWidth = 4;
      context.beginPath();
      context.arc(wandHand.x + 33, wandHand.y - 66, 18 + ratio * 26, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = "#9b2cff";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(wandHand.x + 33, wandHand.y - 94 - ratio * 12);
      context.lineTo(wandHand.x + 33, wandHand.y - 38 + ratio * 12);
      context.moveTo(wandHand.x + 5 - ratio * 12, wandHand.y - 66);
      context.lineTo(wandHand.x + 61 + ratio * 12, wandHand.y - 66);
      context.stroke();
      context.restore();
    }

    if (arcanaChant && this.hasBall) {
      context.save();
      context.globalCompositeOperation = "lighter";
      context.translate(0, -55 + rootY);
      context.globalAlpha = 0.5 + Math.sin(motionTime / 70) * 0.15;
      context.strokeStyle = "#d8b6ff";
      context.lineWidth = 3.5;
      context.beginPath();
      context.arc(0, 0, 28, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = "#9b2cff";
      context.beginPath();
      for (let i = 0; i < 3; i += 1) {
        const angle = -Math.PI / 2 + i * Math.PI * 2 / 3 + motionTime / 420;
        const px = Math.cos(angle) * 22;
        const py = Math.sin(angle) * 22;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.stroke();
      context.restore();
    }

    context.fillStyle = hair;
    context.strokeStyle = "#aeb8d0";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-23, headY - 8);
    context.quadraticCurveTo(-42, headY + 20, -31, headY + 67);
    context.quadraticCurveTo(-10, headY + 54, -5, headY + 10);
    context.closePath();
    context.fill();
    context.stroke();
    context.beginPath();
    context.moveTo(22, headY - 8);
    context.quadraticCurveTo(42, headY + 21, 31, headY + 66);
    context.quadraticCurveTo(10, headY + 54, 5, headY + 10);
    context.closePath();
    context.fill();
    context.stroke();

    context.fillStyle = skin;
    context.strokeStyle = "#2a102a";
    context.lineWidth = 3.5;
    context.beginPath();
    context.ellipse(0, headY, 23, 25, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.fillStyle = "#23102f";
    context.strokeStyle = "#130719";
    context.lineWidth = 3;
    context.beginPath();
    context.ellipse(0, headY - 22, 36, 9, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = robe;
    context.beginPath();
    context.moveTo(-22, headY - 23);
    context.quadraticCurveTo(-6, headY - 86, 16, headY - 31);
    context.quadraticCurveTo(7, headY - 20, -22, headY - 23);
    context.closePath();
    context.fill();
    context.stroke();
    context.strokeStyle = trim;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-14, headY - 36);
    context.quadraticCurveTo(-1, headY - 30, 12, headY - 35);
    context.stroke();

    context.fillStyle = eye;
    for (const side of [-1, 1]) {
      context.beginPath();
      context.ellipse(side * 8, headY - 2, damaged ? 6 : 4.5, damaged ? 4.5 : 3.5, -side * 0.12, 0, Math.PI * 2);
      context.fill();
    }
    context.strokeStyle = "#351530";
    context.lineWidth = 2.5;
    context.beginPath();
    context.arc(0, headY + 10, 7, 0.2, Math.PI - 0.2);
    context.stroke();

    context.restore();
  }

  drawDemonBoot(context, foot, gold) {
    context.fillStyle = "#050407";
    context.strokeStyle = "#020103";
    context.lineWidth = 2;
    context.beginPath();
    context.ellipse(foot.x + 5, foot.y + 4, 17, 6, 0.08, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.strokeStyle = gold;
    context.lineWidth = 2.5;
    context.beginPath();
    context.moveTo(foot.x - 8, foot.y + 2);
    context.lineTo(foot.x + 17, foot.y + 2);
    context.stroke();
  }

  drawDemonClaws(context, hand, side) {
    context.fillStyle = "#050407";
    for (let i = 0; i < 3; i += 1) {
      const spread = (i - 1) * 5;
      context.beginPath();
      context.moveTo(hand.x + side * 4, hand.y + spread);
      context.lineTo(hand.x + side * 15, hand.y + spread + 2);
      context.lineTo(hand.x + side * 5, hand.y + spread + 6);
      context.closePath();
      context.fill();
    }
  }

  drawDemonCharacter(context, scale, drawY, motionTime) {
    const moving = Math.hypot(this.vx, this.vy) > 15;
    const crouch = this.dodgeType === "duck" && this.dodgeTimer > 0;
    const damaged = this.state === "damaged";
    const down = this.state === "down" || this.defeated;
    const throwWindup = this.state === "throwing" && this.throwPhase === "windup";
    const throwRelease = this.state === "throwing" && this.throwPhase === "release";
    const catching = this.catchTimer > 0 || this.catchSuccessTimer > 0;
    const bodyColor = this.faceColor || "#43205f";
    const eyeColor = this.eyeColor || "#ff304a";
    const armor = this.uniformColor || "#0c0a10";
    const crimson = "#4f0b14";
    const capeInner = "#3a050b";
    const gold = this.trimColor || "#d7a331";
    const bob = moving ? Math.abs(Math.sin(motionTime / (this.isDashing ? 62 : 100))) * 2.6 : 0;
    const rootY = (crouch ? 18 : 0) + bob;
    const hipY = -24 + rootY;
    const shoulderY = -84 + rootY;
    const torsoY = -52 + rootY;
    const headY = -114 + rootY + (crouch ? 13 : 0);
    const stride = moving ? Math.sin(motionTime / 96 + this.x * 0.02) * (this.isDashing ? 10 : 6) : 0;
    let backHand = { x: -46 - stride * 0.18, y: -13 + rootY };
    let frontHand = { x: 46 + stride * 0.18, y: -13 + rootY };

    if (throwWindup) {
      frontHand = { x: -72, y: -122 + rootY };
      backHand = { x: 48, y: -36 + rootY };
    } else if (throwRelease) {
      frontHand = { x: 86, y: -62 + rootY };
      backHand = { x: -44, y: -42 + rootY };
    } else if (catching) {
      frontHand = { x: 20, y: -118 + rootY };
      backHand = { x: -20, y: -118 + rootY };
    } else if (crouch) {
      frontHand = { x: 34, y: -18 + rootY };
      backHand = { x: -34, y: -18 + rootY };
    }

    context.save();
    context.translate(this.x, drawY);
    context.scale(scale * this.facing, scale);
    if (down) {
      context.rotate(-0.9);
      context.scale(1.14, 0.8);
    } else if (damaged) {
      context.rotate(-0.12);
    }

    context.fillStyle = "rgba(35, 20, 45, 0.28)";
    context.beginPath();
    context.ellipse(0, 69, 44, 9, 0, 0, Math.PI * 2);
    context.fill();

    const capeGradient = context.createLinearGradient(0, shoulderY - 8, 0, hipY + 76);
    capeGradient.addColorStop(0, "#050407");
    capeGradient.addColorStop(0.55, "#0c060a");
    capeGradient.addColorStop(1, capeInner);
    context.fillStyle = capeGradient;
    context.strokeStyle = "#050407";
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(-45, shoulderY - 6);
    context.quadraticCurveTo(-78, shoulderY + 8, -84, hipY + 82);
    context.lineTo(-31, hipY + 58);
    context.quadraticCurveTo(-18, hipY + 15, -20, shoulderY + 9);
    context.lineTo(20, shoulderY + 9);
    context.quadraticCurveTo(18, hipY + 15, 31, hipY + 58);
    context.lineTo(84, hipY + 82);
    context.quadraticCurveTo(78, shoulderY + 8, 45, shoulderY - 6);
    context.closePath();
    context.fill();
    context.stroke();
    context.save();
    context.globalAlpha = 0.42;
    context.strokeStyle = "#5d0a17";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(-35, shoulderY + 7);
    context.quadraticCurveTo(-47, shoulderY + 46, -49, hipY + 52);
    context.moveTo(35, shoulderY + 7);
    context.quadraticCurveTo(47, shoulderY + 46, 49, hipY + 52);
    context.stroke();
    context.restore();

    this.drawModelLimb(context, [{ x: -13, y: hipY + 8 }, { x: -18 - stride, y: 28 + rootY }, { x: -20 - stride * 1.05, y: 76 + rootY }], "#111016", 20);
    this.drawModelLimb(context, [{ x: 13, y: hipY + 8 }, { x: 18 + stride, y: 28 + rootY }, { x: 20 + stride * 1.05, y: 76 + rootY }], "#111016", 20);
    this.drawDemonBoot(context, { x: -20 - stride * 1.05, y: 76 + rootY }, gold);
    this.drawDemonBoot(context, { x: 20 + stride * 1.05, y: 76 + rootY }, gold);

    this.drawModelLimb(context, [{ x: -39, y: shoulderY + 6 }, { x: -49, y: -48 + rootY }, backHand], bodyColor, 13);
    this.drawModelLimb(context, [{ x: 39, y: shoulderY + 6 }, { x: 49, y: -48 + rootY }, frontHand], bodyColor, 13);
    this.drawDemonClaws(context, backHand, -1);
    this.drawDemonClaws(context, frontHand, 1);

    context.fillStyle = gold;
    context.strokeStyle = "#4d3209";
    context.lineWidth = 4;
    for (const side of [-1, 1]) {
      context.beginPath();
      context.ellipse(side * 33, shoulderY + 1, 16, 11, side * -0.2, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    }

    context.fillStyle = armor;
    context.strokeStyle = "#050407";
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(-30, shoulderY + 4);
    context.lineTo(30, shoulderY + 4);
    context.lineTo(17, hipY + 23);
    context.lineTo(0, hipY + 31);
    context.lineTo(-17, hipY + 23);
    context.closePath();
    context.fill();
    context.stroke();

    context.fillStyle = crimson;
    context.strokeStyle = "#20040a";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(-11, shoulderY + 10);
    context.lineTo(11, shoulderY + 10);
    context.lineTo(7, hipY + 19);
    context.lineTo(-7, hipY + 19);
    context.closePath();
    context.fill();
    context.stroke();

    context.strokeStyle = gold;
    context.lineWidth = 4.5;
    context.beginPath();
    context.moveTo(-12, torsoY - 6);
    context.lineTo(0, torsoY - 22);
    context.lineTo(12, torsoY - 6);
    context.lineTo(0, torsoY + 10);
    context.closePath();
    context.stroke();
    context.fillStyle = gold;
    context.fill();

    context.fillStyle = gold;
    context.fillRect(-22, hipY + 8, 44, 8);
    context.strokeStyle = "#4d3209";
    context.lineWidth = 2;
    context.strokeRect(-22, hipY + 8, 44, 8);

    const mantleBottomY = 82 + rootY;
    const mantleFront = context.createLinearGradient(0, shoulderY - 8, 0, mantleBottomY);
    mantleFront.addColorStop(0, "#050407");
    mantleFront.addColorStop(0.52, "#060407");
    mantleFront.addColorStop(1, "#26050c");
    context.fillStyle = mantleFront;
    context.strokeStyle = "#020103";
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(-49, shoulderY - 6);
    context.quadraticCurveTo(-63, shoulderY + 6, -68, shoulderY + 34);
    context.quadraticCurveTo(-76, hipY + 44, -62, mantleBottomY - 6);
    context.quadraticCurveTo(-34, mantleBottomY + 4, 0, mantleBottomY);
    context.quadraticCurveTo(34, mantleBottomY + 4, 62, mantleBottomY - 6);
    context.quadraticCurveTo(76, hipY + 44, 68, shoulderY + 34);
    context.quadraticCurveTo(63, shoulderY + 6, 49, shoulderY - 6);
    context.quadraticCurveTo(28, shoulderY + 4, 14, shoulderY + 17);
    context.quadraticCurveTo(7, hipY + 8, 0, hipY + 8);
    context.quadraticCurveTo(-7, hipY + 8, -14, shoulderY + 17);
    context.quadraticCurveTo(-28, shoulderY + 4, -49, shoulderY - 6);
    context.closePath();
    context.fill();
    context.stroke();
    context.save();
    context.globalAlpha = 0.4;
    context.strokeStyle = "#5d0a17";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-33, shoulderY + 10);
    context.quadraticCurveTo(-39, hipY + 40, -32, mantleBottomY - 8);
    context.moveTo(33, shoulderY + 10);
    context.quadraticCurveTo(39, hipY + 40, 32, mantleBottomY - 8);
    context.stroke();
    context.restore();

    context.fillStyle = bodyColor;
    context.strokeStyle = "#251133";
    context.lineWidth = 4;
    context.beginPath();
    context.ellipse(0, headY, 21, 25, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.fillStyle = bodyColor;
    context.beginPath();
    context.moveTo(-19, headY - 1);
    context.lineTo(-40, headY - 5);
    context.lineTo(-24, headY + 9);
    context.moveTo(19, headY - 1);
    context.lineTo(40, headY - 5);
    context.lineTo(24, headY + 9);
    context.fill();

    context.fillStyle = "#050407";
    context.beginPath();
    context.moveTo(-17, headY - 22);
    context.quadraticCurveTo(-54, headY - 58, -80, headY - 54);
    context.quadraticCurveTo(-55, headY - 43, -26, headY - 10);
    context.quadraticCurveTo(-21, headY - 18, -17, headY - 22);
    context.moveTo(17, headY - 22);
    context.quadraticCurveTo(54, headY - 58, 80, headY - 54);
    context.quadraticCurveTo(55, headY - 43, 26, headY - 10);
    context.quadraticCurveTo(21, headY - 18, 17, headY - 22);
    context.fill();
    context.strokeStyle = "#171019";
    context.lineWidth = 4;
    context.stroke();

    context.fillStyle = "#050407";
    context.strokeStyle = "#1b1720";
    context.lineWidth = 2.5;
    context.beginPath();
    context.moveTo(-23, headY - 23);
    context.lineTo(-14, headY - 36);
    context.lineTo(-6, headY - 29);
    context.lineTo(0, headY - 41);
    context.lineTo(6, headY - 29);
    context.lineTo(14, headY - 36);
    context.lineTo(23, headY - 23);
    context.lineTo(15, headY - 17);
    context.lineTo(-15, headY - 17);
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = "#b31534";
    context.strokeStyle = "#ffb85a";
    context.lineWidth = 1.5;
    context.beginPath();
    context.arc(0, headY - 26, 4.2, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.save();
    context.globalCompositeOperation = "lighter";
    context.shadowColor = eyeColor;
    context.shadowBlur = 12;
    context.fillStyle = eyeColor;
    context.beginPath();
    context.arc(-10, headY - 7, 5, 0, Math.PI * 2);
    context.arc(10, headY - 7, 5, 0, Math.PI * 2);
    context.fill();
    context.restore();

    context.fillStyle = eyeColor;
    for (const side of [-1, 1]) {
      context.beginPath();
      context.arc(side * 10, headY - 7, 4.2, 0, Math.PI * 2);
      context.fill();
    }

    if (this.hasBall) {
      context.save();
      context.globalAlpha = 0.24 + Math.sin(motionTime / 150) * 0.08;
      context.strokeStyle = "#3a0b54";
      context.lineWidth = 6;
      context.beginPath();
      context.arc(frontHand.x, frontHand.y, 30, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    }

    context.restore();
  }

  drawShieldDevilCharacter(context, scale, drawY, motionTime) {
    const moving = Math.hypot(this.vx, this.vy) > 15;
    const crouch = this.dodgeType === "duck" && this.dodgeTimer > 0;
    const damaged = this.state === "damaged";
    const down = this.state === "down" || this.defeated;
    const guarding = this.shieldGuardTimer > 0 || this.catchTimer > 0;
    const throwWindup = this.state === "throwing" && this.throwPhase === "windup";
    const throwRelease = this.state === "throwing" && this.throwPhase === "release";
    const bodyColor = this.faceColor || "#c8d0dc";
    const armor = this.uniformColor || bodyColor;
    const armorShadow = this.pantsColor || "#a8b0bc";
    const trim = this.trimColor || "#f8fbff";
    const eyeColor = this.eyeColor || "#56eaff";
    const silverStroke = "#5d6673";
    const hoverOffset = 0;
    const bob = Math.sin(motionTime / (moving ? (this.isDashing ? 92 : 128) : 210)) * (moving ? 4 : 3);
    const rootY = (crouch ? 17 : 0) + bob;
    const torsoY = -48 + rootY;
    const headY = -91 + rootY + (crouch ? 12 : 0);
    const shoulderY = -66 + rootY;
    const hipY = -24 + rootY;
    const stride = moving ? Math.sin(motionTime / 72 + this.x * 0.03) * (this.isDashing ? 14 : 8) : 0;
    let shieldHand = { x: -48, y: -52 + rootY };
    let spearHand = { x: 34 + stride * 0.4, y: -38 + rootY };

    if (guarding) {
      shieldHand = { x: -58, y: -66 + rootY };
      spearHand = { x: 22, y: -42 + rootY };
    } else if (throwWindup) {
      shieldHand = { x: -70, y: -106 + rootY };
      spearHand = { x: 38, y: -38 + rootY };
    } else if (throwRelease) {
      shieldHand = { x: 58, y: -62 + rootY };
      spearHand = { x: 18, y: -32 + rootY };
    }

    context.save();
    context.translate(this.x, drawY - hoverOffset);
    context.scale(scale * this.facing, scale);
    if (down) {
      context.rotate(-0.75);
      context.scale(1.1, 0.78);
    } else if (damaged) {
      context.rotate(-0.12);
    }

    context.fillStyle = "rgba(68, 76, 86, 0.26)";
    context.beginPath();
    context.ellipse(0, 23, moving ? 39 : 34, moving ? 8 : 7, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = armorShadow;
    context.strokeStyle = silverStroke;
    context.lineWidth = 3;
    for (const side of [-1, 1]) {
      context.beginPath();
      context.moveTo(side * 18, shoulderY + 6);
      context.quadraticCurveTo(side * 56, shoulderY + 18, side * 64, shoulderY + 54);
      context.quadraticCurveTo(side * 33, shoulderY + 34, side * 12, shoulderY + 18);
      context.closePath();
      context.fill();
      context.stroke();
    }

    const backLeg = [{ x: -13, y: hipY }, { x: -18 - stride, y: -7 + rootY }, { x: -18 - stride * 1.3, y: 17 + rootY }];
    const frontLeg = [{ x: 13, y: hipY }, { x: 18 + stride, y: -7 + rootY }, { x: 18 + stride * 1.3, y: 17 + rootY }];
    this.drawModelLimb(context, backLeg, silverStroke, 16);
    this.drawModelLimb(context, frontLeg, silverStroke, 16);
    this.drawModelLimb(context, backLeg, armorShadow, 11);
    this.drawModelLimb(context, frontLeg, armorShadow, 11);
    this.drawShieldDevilFootOutline(context, { x: -18 - stride * 1.3, y: 17 + rootY }, silverStroke);
    this.drawShieldDevilFootOutline(context, { x: 18 + stride * 1.3, y: 17 + rootY }, silverStroke);
    this.drawModelFoot(context, { x: -18 - stride * 1.3, y: 17 + rootY }, armorShadow);
    this.drawModelFoot(context, { x: 18 + stride * 1.3, y: 17 + rootY }, armorShadow);

    this.drawModelLimb(context, [{ x: -27, y: shoulderY }, { x: -40, y: -58 + rootY }, shieldHand], bodyColor, 11);
    this.drawModelLimb(context, [{ x: 27, y: shoulderY }, { x: 34, y: -55 + rootY }, spearHand], bodyColor, 9);

    const armorGradient = context.createLinearGradient(-34, torsoY - 40, 34, torsoY + 38);
    armorGradient.addColorStop(0, "#ffffff");
    armorGradient.addColorStop(0.28, armor);
    armorGradient.addColorStop(0.62, "#9ca6b3");
    armorGradient.addColorStop(1, "#eef3f8");
    context.fillStyle = armorGradient;
    context.strokeStyle = silverStroke;
    context.lineWidth = 4;
    context.beginPath();
    context.ellipse(0, torsoY, 32, 38, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.save();
    context.clip();
    context.globalAlpha = 0.55;
    context.strokeStyle = "#ffffff";
    context.lineWidth = 6;
    context.beginPath();
    context.moveTo(-20, torsoY - 28);
    context.lineTo(12, torsoY + 20);
    context.stroke();
    context.globalAlpha = 0.28;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(10, torsoY - 30);
    context.lineTo(29, torsoY + 5);
    context.stroke();
    context.restore();
    context.strokeStyle = trim;
    context.lineWidth = 4;
    context.beginPath();
    context.arc(0, torsoY - 4, 12, 0, Math.PI * 2);
    context.stroke();

    context.save();
    context.translate(shieldHand.x - 12, shieldHand.y + 5);
    context.rotate(guarding ? -0.08 : -0.22);
    if (this.shieldGuardTimer > 0) {
      const guardPulse = Math.max(0, Math.min(1, this.shieldGuardTimer / 0.82));
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.26 + guardPulse * 0.42;
      context.fillStyle = "#dff7ff";
      context.beginPath();
      context.ellipse(0, 0, 66 + guardPulse * 18, 84 + guardPulse * 20, 0, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#fff7a0";
      context.lineWidth = 6;
      context.beginPath();
      context.ellipse(0, 0, 54 + guardPulse * 16, 72 + guardPulse * 16, 0, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = "#9b2cff";
      context.lineWidth = 4;
      for (let ray = 0; ray < 10; ray += 1) {
        const angle = ray * Math.PI * 2 / 10 + motionTime / 180;
        context.beginPath();
        context.moveTo(Math.cos(angle) * 28, Math.sin(angle) * 36);
        context.lineTo(Math.cos(angle) * (72 + guardPulse * 16), Math.sin(angle) * (92 + guardPulse * 20));
        context.stroke();
      }
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 1;
    }
    const shieldGradient = context.createLinearGradient(-35, -54, 35, 54);
    shieldGradient.addColorStop(0, "#ffffff");
    shieldGradient.addColorStop(0.35, "#cbd3df");
    shieldGradient.addColorStop(0.68, "#7f8998");
    shieldGradient.addColorStop(1, "#f6fbff");
    context.fillStyle = shieldGradient;
    context.strokeStyle = "#56606d";
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(0, -58);
    context.quadraticCurveTo(46, -42, 42, 8);
    context.quadraticCurveTo(24, 54, 0, 66);
    context.quadraticCurveTo(-24, 54, -42, 8);
    context.quadraticCurveTo(-46, -42, 0, -58);
    context.closePath();
    context.fill();
    context.stroke();
    context.save();
    context.clip();
    context.globalAlpha = 0.62;
    context.strokeStyle = "#ffffff";
    context.lineWidth = 8;
    context.beginPath();
    context.moveTo(-24, -40);
    context.lineTo(18, 34);
    context.stroke();
    context.globalAlpha = 0.28;
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(8, -48);
    context.lineTo(31, 14);
    context.stroke();
    context.restore();
    context.strokeStyle = "#f8fbff";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(0, -42);
    context.lineTo(0, 48);
    context.moveTo(-24, -6);
    context.lineTo(24, -6);
    context.stroke();
    context.restore();

    context.strokeStyle = "#687280";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(spearHand.x - 4, spearHand.y + 8);
    context.lineTo(spearHand.x + 28, spearHand.y - 42);
    context.stroke();
    context.fillStyle = "#f8fbff";
    context.beginPath();
    context.moveTo(spearHand.x + 28, spearHand.y - 42);
    context.lineTo(spearHand.x + 39, spearHand.y - 30);
    context.lineTo(spearHand.x + 21, spearHand.y - 29);
    context.closePath();
    context.fill();

    context.fillStyle = bodyColor;
    context.strokeStyle = silverStroke;
    context.lineWidth = 4;
    context.beginPath();
    context.ellipse(0, headY, 29, 30, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = "#6e7784";
    for (const side of [-1, 1]) {
      context.beginPath();
      context.moveTo(side * 11, headY - 24);
      context.lineTo(side * 21, headY - 51);
      context.lineTo(side * 2, headY - 30);
      context.closePath();
      context.fill();
    }
    context.fillStyle = eyeColor;
    for (const side of [-1, 1]) {
      context.beginPath();
      context.ellipse(side * 10, headY - 4, 6, 4, -side * 0.18, 0, Math.PI * 2);
      context.fill();
    }
    context.strokeStyle = "#56606d";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(0, headY + 9, 8, 0.15, Math.PI - 0.15);
    context.stroke();

    if (this.shieldAlertTimer > 0) {
      const ratio = Math.min(1, this.shieldAlertTimer / 0.6);
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = ratio;
      context.fillStyle = "#fff7a0";
      context.strokeStyle = "#3a0620";
      context.lineWidth = 5;
      context.font = "bold 38px sans-serif";
      context.textAlign = "center";
      context.strokeText("!!", 0, headY - 58);
      context.fillText("!!", 0, headY - 58);
      context.restore();
    }

    context.restore();
  }

  drawShieldDevilFootOutline(context, foot, color) {
    context.fillStyle = color;
    context.beginPath();
    context.ellipse(foot.x + 5, foot.y + 3, 18, 8, 0.08, 0, Math.PI * 2);
    context.fill();
  }

  drawMiniDevilCharacter(context, scale, drawY, motionTime) {
    const moving = Math.hypot(this.vx, this.vy) > 15;
    const crouch = this.dodgeType === "duck" && this.dodgeTimer > 0;
    const damaged = this.state === "damaged";
    const down = this.state === "down" || this.defeated;
    const throwWindup = this.state === "throwing" && this.throwPhase === "windup";
    const throwRelease = this.state === "throwing" && this.throwPhase === "release";
    const catching = this.catchTimer > 0 || this.catchSuccessTimer > 0;
    const bodyColor = this.faceColor || "#7b3eb0";
    const eyeColor = this.eyeColor || "#ff304a";
    const capeColor = this.trimColor || "#c91f35";
    const bob = moving ? Math.abs(Math.sin(motionTime / (this.isDashing ? 42 : 78))) * 5 : 0;
    const rootY = (crouch ? 14 : 0) + bob;
    const torsoY = -42 + rootY;
    const headY = -82 + rootY + (crouch ? 10 : 0);
    const shoulderY = -58 + rootY;
    const hipY = -22 + rootY;
    const stride = moving ? Math.sin(motionTime / 68 + this.x * 0.025) * (this.isDashing ? 13 : 8) : 0;
    let leftHand = { x: -34 - stride * 0.25, y: -34 + rootY };
    let rightHand = { x: 34 + stride * 0.25, y: -34 + rootY };

    if (throwWindup) {
      rightHand = { x: -54, y: -98 + rootY };
      leftHand = { x: 32, y: -34 + rootY };
    } else if (throwRelease) {
      rightHand = { x: 62, y: -55 + rootY };
      leftHand = { x: -28, y: -32 + rootY };
    } else if (catching) {
      leftHand = { x: -13, y: -96 + rootY };
      rightHand = { x: 13, y: -96 + rootY };
    }

    context.save();
    context.translate(this.x, drawY);
    context.scale(scale * this.facing, scale);
    if (down) {
      context.rotate(-0.72);
      context.scale(1.08, 0.78);
    } else if (damaged) {
      context.rotate(-0.12);
    }

    context.fillStyle = "rgba(20, 8, 28, 0.26)";
    context.beginPath();
    context.ellipse(0, 19, 31, 8, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#08050c";
    context.strokeStyle = "#030205";
    context.lineWidth = 3;
    for (const side of [-1, 1]) {
      context.beginPath();
      context.moveTo(side * 12, shoulderY + 4);
      context.quadraticCurveTo(side * 45, shoulderY + 3, side * 55, shoulderY + 33);
      context.quadraticCurveTo(side * 28, shoulderY + 22, side * 9, shoulderY + 13);
      context.closePath();
      context.fill();
      context.stroke();
    }

    context.fillStyle = capeColor;
    context.strokeStyle = "#3b0710";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-25, shoulderY - 2);
    context.lineTo(25, shoulderY - 2);
    context.lineTo(39, hipY + 38);
    context.quadraticCurveTo(0, hipY + 56, -39, hipY + 38);
    context.closePath();
    context.fill();
    context.stroke();

    context.fillStyle = "#09050d";
    context.beginPath();
    context.moveTo(-18, hipY + 12);
    context.quadraticCurveTo(-50, hipY + 24, -52, hipY + 46);
    context.quadraticCurveTo(-40, hipY + 38, -35, hipY + 51);
    context.strokeStyle = "#09050d";
    context.lineWidth = 6;
    context.stroke();

    this.drawModelLimb(context, [{ x: -11, y: hipY }, { x: -15 - stride, y: -5 + rootY }, { x: -15 - stride * 1.2, y: 15 + rootY }], bodyColor, 9);
    this.drawModelLimb(context, [{ x: 11, y: hipY }, { x: 15 + stride, y: -5 + rootY }, { x: 15 + stride * 1.2, y: 15 + rootY }], bodyColor, 9);
    this.drawModelFoot(context, { x: -15 - stride * 1.2, y: 15 + rootY }, "#070409");
    this.drawModelFoot(context, { x: 15 + stride * 1.2, y: 15 + rootY }, "#070409");

    this.drawModelLimb(context, [{ x: -22, y: shoulderY }, { x: -30, y: -47 + rootY }, leftHand], bodyColor, 9);
    this.drawModelLimb(context, [{ x: 22, y: shoulderY }, { x: 30, y: -47 + rootY }, rightHand], bodyColor, 9);
    context.fillStyle = "#050407";
    for (const hand of [leftHand, rightHand]) {
      context.beginPath();
      context.ellipse(hand.x, hand.y, 8, 7, 0, 0, Math.PI * 2);
      context.fill();
    }

    context.fillStyle = "#050407";
    context.beginPath();
    context.ellipse(0, hipY + 3, 24, 18, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = bodyColor;
    context.strokeStyle = "#251133";
    context.lineWidth = 3;
    context.beginPath();
    context.ellipse(0, torsoY, 25, 29, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.beginPath();
    context.ellipse(0, headY, 31, 32, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.fillStyle = "#050407";
    for (const side of [-1, 1]) {
      context.beginPath();
      context.moveTo(side * 12, headY - 25);
      context.lineTo(side * 23, headY - 47);
      context.lineTo(side * 3, headY - 30);
      context.closePath();
      context.fill();
    }

    context.fillStyle = eyeColor;
    for (const side of [-1, 1]) {
      context.beginPath();
      context.ellipse(side * 11, headY - 4, 6, 4, -side * 0.14, 0, Math.PI * 2);
      context.fill();
    }
    context.strokeStyle = "#16070d";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(0, headY + 9, 8, 0.12, Math.PI - 0.12);
    context.stroke();

    context.restore();
  }

  getRobotManufacturingNumber() {
    const numbers = {
      "ゼロ": "00",
      "ボルト": "01",
      "ギア": "02",
      "ピストン": "03",
      "センサー": "04",
      "レーダー": "05",
      "コイル": "06",
      "ビット": "07"
    };
    return numbers[this.name] || "99";
  }

  drawRobotCharacter(context, scale, drawY, motionTime, config) {
    const visualTurning = this.robotVisualTurnTimer > 0;
    const moving = Math.hypot(this.vx, this.vy) > 15 && !visualTurning;
    const cadence = this.isDashing ? 34 : 92;
    const stepIndex = Math.floor(motionTime / cadence) % 4;
    const stepPattern = [-1, -0.25, 1, 0.25];
    const stride = moving ? stepPattern[stepIndex] * (this.isDashing ? 18 : 11) : 0;
    const crouch = this.dodgeType === "duck" && this.dodgeTimer > 0;
    const damaged = this.state === "damaged";
    const down = this.state === "down" || this.defeated;
    const lowHp = this.hp / Math.max(1, this.maxHp) <= ROBOT_OVERDRIVE_CONFIG.hpRatio;
    const overdrive = this.isRobotOverdrive();
    const eyeOn = !lowHp || Math.floor(motionTime / 130) % 2 === 0;
    const throwWindup = this.state === "throwing" && this.throwPhase === "windup";
    const throwRelease = this.state === "throwing" && this.throwPhase === "release";
    const servoAiming = throwWindup && this.throwTimer <= 0.42;
    const catching = this.catchTimer > 0 || this.catchSuccessTimer > 0;
    const catchSuccess = this.catchSuccessTimer > 0;
    const idle = this.state === "idle" || this.state === "holding";
    const dodgeProgress = crouch ? 1 - Math.min(1, this.dodgeTimer / 0.36) : 0;
    const upperShiftX = crouch
      ? this.robotDodgeDirection * Math.sin(dodgeProgress * Math.PI) * 30
      : 0;
    const upperShiftY = crouch ? 13 : 0;
    const rootY = crouch ? 29 : Math.abs(stride) * 0.16;
    const hipY = -34 + rootY;
    const shoulderY = -82 + rootY;
    const headY = -126 + rootY + (crouch ? 16 : 0);
    const bodyY = -66 + rootY;
    let frontHand = { x: 42 + stride * 0.45, y: -40 + rootY };
    let backHand = { x: -42 - stride * 0.45, y: -40 + rootY };

    if (throwWindup) {
      frontHand = { x: -68, y: -132 + rootY };
      backHand = { x: 48, y: -42 + rootY };
    } else if (throwRelease) {
      const releaseProgress = 1 - Math.max(0, Math.min(1, this.throwTimer / 0.26));
      const armExtension = Math.sin(releaseProgress * Math.PI) * 48;
      frontHand = { x: 76 + armExtension, y: -70 + rootY };
      backHand = { x: -48, y: -38 + rootY };
    } else if (catching) {
      frontHand = catchSuccess
        ? { x: 13, y: bodyY - 5 }
        : { x: 22, y: -137 + rootY };
      backHand = catchSuccess
        ? { x: -13, y: bodyY - 5 }
        : { x: -22, y: -137 + rootY };
    } else if (crouch) {
      frontHand = { x: 24, y: -25 + rootY };
      backHand = { x: -24, y: -25 + rootY };
    }

    context.save();
    context.translate(this.x, drawY);
    const bodyDirection = this.robotBodyDirection || this.visualDirection;
    const verticalView = bodyDirection === "up" || bodyDirection === "down";
    const bodyFacing = bodyDirection === "left" ? -1 : bodyDirection === "right" ? 1 : this.facing;
    context.scale(scale * (verticalView ? 0.94 : bodyFacing), scale);
    if (down) {
      context.rotate(-0.92);
      context.scale(1.08, 0.8);
    } else if (damaged) {
      context.rotate(-0.1);
    }

    if (overdrive) {
      this.drawRobotOverdriveEffects(context, motionTime, moving, bodyY, headY);
    }

    if (moving && this.jumpZ <= 0) {
      context.save();
      const stepPulse = stepIndex === 0 || stepIndex === 2;
      context.globalAlpha = stepPulse ? 0.58 : 0.28;
      context.fillStyle = "#eef7f4";
      for (let index = 0; index < 3; index += 1) {
        const phase = (motionTime / cadence + index * 1.4) % 4;
        context.beginPath();
        context.arc(-17 + index * 17, 18 + phase * 4, 3 + phase * 1.5, 0, Math.PI * 2);
        context.fill();
      }
      if (stepPulse) {
        context.strokeStyle = "rgba(190, 220, 224, 0.8)";
        context.lineWidth = 3;
        context.beginPath();
        context.arc(stride < 0 ? -20 : 20, 19, 13, Math.PI, Math.PI * 2);
        context.stroke();
      }
      context.restore();
    }

    if (this.isDashing && moving && this.jumpZ <= 0) {
      context.save();
      context.globalAlpha = 0.2;
      for (let trail = 1; trail <= 3; trail += 1) {
        const trailX = -this.facing * trail * 12;
        this.drawRobotLimb(
          context,
          { x: -13 + trailX, y: hipY },
          { x: -18 - stride * 0.5 + trailX, y: -8 + rootY },
          { x: -17 - stride + trailX, y: 16 + rootY },
          10
        );
        this.drawRobotLimb(
          context,
          { x: 13 + trailX, y: hipY },
          { x: 18 + stride * 0.5 + trailX, y: -8 + rootY },
          { x: 17 + stride + trailX, y: 16 + rootY },
          10
        );
      }
      context.restore();
    }

    const footRootY = crouch ? 0 : rootY;
    const kneeY = crouch ? 10 : -8 + rootY;
    const backFoot = { x: -17 - stride, y: 16 + footRootY };
    const frontFoot = { x: 17 + stride, y: 16 + footRootY };
    this.drawRobotLimb(context, { x: -13, y: hipY }, { x: -18 - stride * 0.5, y: kneeY }, backFoot, 12);
    this.drawRobotLimb(context, { x: 13, y: hipY }, { x: 18 + stride * 0.5, y: kneeY }, frontFoot, 13);
    this.drawRobotFoot(context, backFoot);
    this.drawRobotFoot(context, frontFoot);

    context.save();
    context.translate(upperShiftX, upperShiftY);
    if (visualTurning) {
      const turnProgress = 1 - Math.max(0, Math.min(1, this.robotVisualTurnTimer / 0.1));
      context.scale(1 - Math.sin(turnProgress * Math.PI) * 0.28, 1);
    }

    if (this.uniformEmblem === "robotCaptain") {
      context.fillStyle = "#b9272f";
      context.strokeStyle = "#68141a";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(-25, shoulderY + 3);
      context.lineTo(-48, -12 + rootY);
      context.lineTo(-12, -24 + rootY);
      context.closePath();
      context.fill();
      context.stroke();
    }

    this.drawRobotLimb(context, { x: -25, y: shoulderY }, { x: -35, y: -62 + rootY }, backHand, 10);

    const metal = context.createLinearGradient(-32, bodyY - 40, 32, bodyY + 38);
    metal.addColorStop(0, "#f4f7f8");
    metal.addColorStop(0.45, "#b9c4ca");
    metal.addColorStop(1, "#77838b");
    context.fillStyle = metal;
    context.strokeStyle = "#48545c";
    context.lineWidth = 4;
    this.roundRect(context, -32, bodyY - 38, 64, 76, 18);
    context.fill();
    context.stroke();

    const clockStopGlow = this.clockStopAnticipation && this.uniformEmblem === "robotCaptain";
    context.fillStyle = clockStopGlow ? "#6d1018" : "#263139";
    this.roundRect(context, -20, bodyY - 15, 40, 31, 5);
    context.fill();
    context.strokeStyle = clockStopGlow ? "#ff4356" : "#55f0dd";
    context.lineWidth = 2;
    context.shadowColor = clockStopGlow ? "#ff243c" : "transparent";
    context.shadowBlur = clockStopGlow ? 18 : 0;
    context.stroke();
    context.shadowBlur = 0;
    context.fillStyle = clockStopGlow ? "#fff1f1" : "#dffefa";
    context.font = "bold 18px Consolas, monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.save();
    if (idle && Math.floor(motionTime / 420) % 2 === 1) {
      context.globalAlpha = 0.48;
    }
    context.fillText(this.getRobotManufacturingNumber(), 0, bodyY + 1);
    context.restore();

    this.drawRobotLimb(context, { x: 25, y: shoulderY }, { x: 35, y: -62 + rootY }, frontHand, 11);

    if (throwWindup || throwRelease) {
      const servoStep = Math.floor(motionTime / 55) % 4;
      context.save();
      context.strokeStyle = throwRelease ? "#fff27a" : "#58f3df";
      context.lineWidth = 3;
      for (let ring = 0; ring < 3; ring += 1) {
        context.beginPath();
        context.arc(25, shoulderY, 14 + ring * 5, -1.8 + servoStep * 0.28, 0.3 + servoStep * 0.28);
        context.stroke();
      }
      context.restore();
    }

    if (catching) {
      const magnetY = catchSuccess ? bodyY - 5 : -137 + rootY;
      const magnetPulse = 1 + Math.sin(motionTime / 55) * 0.12;
      context.save();
      context.strokeStyle = catchSuccess ? "#e8fffb" : "#4df5dc";
      context.shadowColor = "#42f4dc";
      context.shadowBlur = 15;
      context.lineWidth = 4;
      for (let ring = 0; ring < 3; ring += 1) {
        context.beginPath();
        context.ellipse(0, magnetY, (30 + ring * 12) * magnetPulse, 13 + ring * 5, 0, 0, Math.PI * 2);
        context.stroke();
      }
      context.restore();
    }

    if (this.robotCatchMissTimer > 0) {
      const missRatio = this.robotCatchMissTimer / 0.18;
      context.save();
      context.globalCompositeOperation = "lighter";
      for (let spark = 0; spark < 7; spark += 1) {
        const angle = spark * Math.PI * 2 / 7;
        context.strokeStyle = spark % 2 === 0 ? "#66ffe8" : "#ffe56a";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(Math.cos(angle) * 34, -116 + Math.sin(angle) * 15);
        context.lineTo(Math.cos(angle) * (46 + missRatio * 18), -116 + Math.sin(angle) * (24 + missRatio * 12));
        context.stroke();
      }
      context.restore();
    }

    const directionVectors = {
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 }
    };
    const bodyVector = directionVectors[bodyDirection] || directionVectors.right;
    const headVector = directionVectors[this.robotHeadDirection] || bodyVector;
    const idleScan = idle && !visualTurning ? Math.sin(motionTime / 330) * 7 : 0;
    const headShiftX = (headVector.x - bodyVector.x) * 8 + idleScan;
    const headShiftY = (headVector.y - bodyVector.y) * 4;
    context.save();
    context.translate(headShiftX, headShiftY);
    const headMetal = context.createLinearGradient(-34, headY - 30, 34, headY + 28);
    headMetal.addColorStop(0, "#f8fafb");
    headMetal.addColorStop(0.5, "#b7c1c7");
    headMetal.addColorStop(1, "#6f7b83");
    context.fillStyle = headMetal;
    context.strokeStyle = "#46525a";
    context.lineWidth = 4;
    this.roundRect(context, -36, headY - 29, 72, 58, 23);
    context.fill();
    context.stroke();

    context.fillStyle = "#17252a";
    this.roundRect(context, -27, headY - 9, 54, 18, 8);
    context.fill();
    if (eyeOn) {
      const eyeColor = clockStopGlow || lowHp ? "#ff334d" : "#41f2dc";
      context.shadowColor = eyeColor;
      context.shadowBlur = lowHp ? 18 : 12;
      context.fillStyle = eyeColor;
      this.roundRect(context, -21, headY - 5, 42, 10, 5);
      context.fill();
      if (!lowHp && !clockStopGlow) {
        const scanX = Math.sin(motionTime / 170) * 15;
        context.fillStyle = "#efffff";
        this.roundRect(context, scanX - 4, headY - 4, 8, 8, 4);
        context.fill();
      }
      context.shadowBlur = 0;
    }

    if (servoAiming) {
      const aimPulse = 0.45 + Math.sin(motionTime / 35) * 0.2;
      context.save();
      context.globalAlpha = aimPulse;
      context.strokeStyle = "#5dffea";
      context.shadowColor = "#4cf9e2";
      context.shadowBlur = 10;
      context.lineWidth = 2;
      context.setLineDash([12, 8]);
      context.beginPath();
      context.moveTo(22, headY);
      context.lineTo(172, headY);
      context.stroke();
      context.setLineDash([]);
      context.restore();
    }

    context.strokeStyle = "#56636b";
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(0, headY - 29);
    context.lineTo(0, headY - 48);
    context.stroke();
    context.fillStyle = this.uniformEmblem === "robotCaptain" ? "#f1c33d" : "#829099";
    context.strokeStyle = this.uniformEmblem === "robotCaptain" ? "#9d7411" : "#46525a";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(0, headY - 52, this.uniformEmblem === "robotCaptain" ? 9 : 7, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();

    if (idle) {
      const ventPhase = (motionTime % 2800) / 2800;
      if (ventPhase > 0.72) {
        context.save();
        context.globalAlpha = Math.sin((ventPhase - 0.72) / 0.28 * Math.PI) * 0.55;
        context.fillStyle = "#e9f2f1";
        for (let puff = 0; puff < 3; puff += 1) {
          context.beginPath();
          context.arc(-38 - puff * 11, bodyY - 3 - puff * 7, 7 + puff * 3, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
      }
    }

    context.restore();

    if (damaged) {
      context.save();
      context.globalCompositeOperation = "lighter";
      for (let index = 0; index < 8; index += 1) {
        const angle = index * Math.PI * 2 / 8 + motionTime / 180;
        context.strokeStyle = index % 2 === 0 ? "#fff06a" : "#ff7b2f";
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(Math.cos(angle) * 24, bodyY + Math.sin(angle) * 28);
        context.lineTo(Math.cos(angle) * 58, bodyY + Math.sin(angle) * 58);
        context.stroke();
      }
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 0.42;
      context.fillStyle = "#4a5156";
      context.beginPath();
      context.arc(22, headY - 43, 15, 0, Math.PI * 2);
      context.arc(35, headY - 58, 11, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
    context.restore();
  }

  drawRobotOverdriveEffects(context, motionTime, moving, bodyY, headY) {
    context.save();
    context.globalCompositeOperation = "lighter";

    if (moving) {
      const speed = Math.hypot(this.vx, this.vy) || 1;
      const trailX = -this.vx / speed;
      const trailY = -this.vy / speed * 0.35;
      for (let trail = 3; trail >= 1; trail -= 1) {
        context.save();
        context.translate(trailX * trail * 15, trailY * trail * 15);
        context.globalAlpha = 0.05 + (4 - trail) * 0.035;
        context.fillStyle = "#ff283f";
        this.roundRect(context, -29, bodyY - 35, 58, 70, 17);
        context.fill();
        context.beginPath();
        context.arc(0, headY, 32, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    const pulse = 0.55 + Math.sin(motionTime / 55) * 0.2;
    for (let spark = 0; spark < 7; spark += 1) {
      const angle = spark * Math.PI * 2 / 7 + motionTime / 210;
      const inner = 36 + (spark % 2) * 9;
      const outer = inner + 13 + pulse * 8;
      context.globalAlpha = 0.48 + (spark % 3) * 0.13;
      context.strokeStyle = spark % 2 === 0 ? "#fff07a" : "#ff3d31";
      context.lineWidth = spark % 2 === 0 ? 3 : 4;
      context.beginPath();
      context.moveTo(Math.cos(angle) * inner, bodyY + Math.sin(angle) * inner * 0.85);
      context.lineTo(Math.cos(angle) * outer, bodyY + Math.sin(angle) * outer * 0.85);
      context.stroke();
    }

    const steamPhase = (motionTime % 520) / 520;
    for (let side = -1; side <= 1; side += 2) {
      for (let puff = 0; puff < 3; puff += 1) {
        const phase = (steamPhase + puff * 0.23) % 1;
        context.globalAlpha = (1 - phase) * 0.38;
        context.fillStyle = puff % 2 === 0 ? "#ffd7d7" : "#f3f6f6";
        context.beginPath();
        context.arc(
          side * (34 + phase * 22),
          bodyY - 25 - phase * 38,
          5 + phase * 7,
          0,
          Math.PI * 2
        );
        context.fill();
      }
    }
    context.restore();
  }

  drawRobotLimb(context, start, joint, end, width) {
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#1f262b";
    context.lineWidth = width + 7;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(joint.x, joint.y);
    context.lineTo(end.x, end.y);
    context.stroke();
    context.strokeStyle = "#aeb9bf";
    context.lineWidth = width;
    context.stroke();
    context.fillStyle = "#171d21";
    for (const point of [start, joint, end]) {
      context.beginPath();
      context.arc(point.x, point.y, width * 0.58, 0, Math.PI * 2);
      context.fill();
    }
  }

  drawRobotFoot(context, point) {
    context.fillStyle = "#7f8b92";
    context.strokeStyle = "#3c474e";
    context.lineWidth = 3;
    this.roundRect(context, point.x - 13, point.y - 5, 26, 12, 5);
    context.fill();
    context.stroke();
  }

  drawUsaSleeveCuff(context, points, armWidth) {
    const shoulder = points[0];
    const elbow = points[1];
    const dx = elbow.x - shoulder.x;
    const dy = elbow.y - shoulder.y;
    const length = Math.hypot(dx, dy) || 1;
    const centerX = shoulder.x + dx * 0.3;
    const centerY = shoulder.y + dy * 0.3;
    const normalX = -dy / length;
    const normalY = dx / length;
    const halfWidth = armWidth * 0.62;
    context.strokeStyle = "#d92525";
    context.lineWidth = 5;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(centerX - normalX * halfWidth, centerY - normalY * halfWidth);
    context.lineTo(centerX + normalX * halfWidth, centerY + normalY * halfWidth);
    context.stroke();
  }

  drawSumoFundoshi(context, torsoY, body) {
    const gold = this.uniformEmblem === "sumoGold";
    const baseColor = gold ? "#d9a719" : "#17191d";
    const highlight = gold ? "#fff08a" : "#555b64";
    const beltY = torsoY + 22 * body.torsoY;
    context.fillStyle = baseColor;
    context.strokeStyle = gold ? "#8c6810" : "#08090b";
    context.lineWidth = 3;
    context.beginPath();
    context.ellipse(0, beltY, 29 * body.torsoX, 9, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.beginPath();
    context.moveTo(-11 * body.torsoX, beltY + 1);
    context.lineTo(11 * body.torsoX, beltY + 1);
    context.lineTo(8 * body.torsoX, beltY + 29);
    context.lineTo(-8 * body.torsoX, beltY + 29);
    context.closePath();
    context.fill();
    context.stroke();
    context.strokeStyle = highlight;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-7 * body.torsoX, beltY - 3);
    context.lineTo(14 * body.torsoX, beltY - 3);
    context.stroke();
  }

  drawMageSkirt(context, torsoY, colors) {
    context.fillStyle = colors.suit;
    context.strokeStyle = "rgba(20,26,38,0.32)";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-24, torsoY + 16);
    context.lineTo(30, torsoY + 16);
    context.lineTo(42, torsoY + 62);
    context.lineTo(-38, torsoY + 62);
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = "rgba(255,255,255,0.22)";
    context.beginPath();
    context.moveTo(-8, torsoY + 20);
    context.lineTo(6, torsoY + 20);
    context.lineTo(12, torsoY + 58);
    context.lineTo(-16, torsoY + 58);
    context.closePath();
    context.fill();
  }

  drawVampireCape(context, torsoY, body) {
    context.save();
    const capeGradient = context.createLinearGradient(0, torsoY - 34, 0, torsoY + 62);
    capeGradient.addColorStop(0, "#7a1630");
    capeGradient.addColorStop(0.58, "#5b1029");
    capeGradient.addColorStop(1, "#361227");
    context.fillStyle = capeGradient;
    context.strokeStyle = "#8f1d3a";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-28 * body.torsoX, torsoY - 28 * body.torsoY);
    context.quadraticCurveTo(-48 * body.torsoX, torsoY + 18, -36 * body.torsoX, torsoY + 54);
    context.lineTo(-10 * body.torsoX, torsoY + 38);
    context.lineTo(0, torsoY + 60);
    context.lineTo(10 * body.torsoX, torsoY + 38);
    context.lineTo(36 * body.torsoX, torsoY + 54);
    context.quadraticCurveTo(48 * body.torsoX, torsoY + 18, 28 * body.torsoX, torsoY - 28 * body.torsoY);
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = "#d6284a";
    context.beginPath();
    context.moveTo(-13 * body.torsoX, torsoY - 32);
    context.lineTo(0, torsoY - 12);
    context.lineTo(13 * body.torsoX, torsoY - 32);
    context.lineTo(7 * body.torsoX, torsoY - 38);
    context.lineTo(0, torsoY - 24);
    context.lineTo(-7 * body.torsoX, torsoY - 38);
    context.closePath();
    context.fill();
    context.restore();
  }

  drawVampireDetails(context, x, y, damaged, body) {
    context.save();
    const headScale = body.headScale || 1;
    context.scale(headScale, headScale);
    const sx = x / headScale;
    const sy = y / headScale;
    context.fillStyle = this.hairColor || "#e9eef8";
    context.beginPath();
    context.moveTo(sx - 24, sy - 22);
    context.quadraticCurveTo(sx - 10, sy - 45, sx + 22, sy - 23);
    context.lineTo(sx + 18, sy - 4);
    context.quadraticCurveTo(sx + 4, sy - 15, sx - 24, sy - 2);
    context.closePath();
    context.fill();
    context.strokeStyle = "#21102d";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(sx - 14, sy + 9);
    context.lineTo(sx - 7, sy + 21);
    context.moveTo(sx + 14, sy + 9);
    context.lineTo(sx + 7, sy + 21);
    context.stroke();
    context.fillStyle = damaged ? "#ffffff" : (this.eyeColor || "#d81942");
    context.beginPath();
    context.ellipse(sx - 12, sy - 2, 5, 3.5, 0.08, 0, Math.PI * 2);
    context.ellipse(sx + 12, sy - 2, 5, 3.5, -0.08, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  drawMageHat(context, x, y, colors) {
    context.save();
    context.translate(x, y + 7);
    context.scale(0.8, 0.8);
    context.fillStyle = colors.suit;
    context.strokeStyle = "#263241";
    context.lineWidth = 4;
    context.beginPath();
    context.ellipse(0, -27, 38, 9, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.beginPath();
    context.moveTo(-25, -30);
    context.lineTo(7, -88);
    context.lineTo(31, -29);
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = "#d9f6ff";
    context.beginPath();
    context.arc(9, -55, 5, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  drawModelHead(context, x, y, colors, damaged, direction, body = CHARACTER_TYPES.normal) {
    const hairColor = this.hairColor || PLAYER_MODEL.hair;
    if (body.mage) {
      context.fillStyle = hairColor;
      context.beginPath();
      context.ellipse(x - 11, y + 10, 13, 34, -0.12, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = hairColor;
      context.beginPath();
      context.ellipse(x + 18, y + 10, 10, 34, 0.12, 0, Math.PI * 2);
      context.fill();
    }

    const head = context.createRadialGradient(x - 12, y - 15, 4, x, y, 33);
    head.addColorStop(0, "#ffe3c5");
    head.addColorStop(0.62, PLAYER_MODEL.skin);
    head.addColorStop(1, PLAYER_MODEL.skinShade);
    context.fillStyle = head;
    context.beginPath();
    context.arc(x, y, 29, 0, Math.PI * 2);
    context.fill();

    if (body.mage) {
      context.fillStyle = hairColor;
      context.beginPath();
      context.arc(x, y - 13, 25, Math.PI, Math.PI * 2);
      context.lineTo(x + 21, y - 7);
      context.quadraticCurveTo(x + 1, y - 20, x - 22, y - 7);
      context.closePath();
      context.fill();
    } else if (this.characterType === "normal") {
      context.fillStyle = hairColor;
      context.beginPath();
      context.arc(x, y - 3, 28, Math.PI, Math.PI * 2);
      context.lineTo(x + 27, y - 6);
      context.lineTo(x + 17, y + 2);
      context.lineTo(x + 8, y - 8);
      context.lineTo(x - 1, y + 3);
      context.lineTo(x - 11, y - 8);
      context.lineTo(x - 20, y + 2);
      context.lineTo(x - 28, y - 6);
      context.closePath();
      context.fill();
    } else {
      context.fillStyle = hairColor;
      context.beginPath();
      context.arc(x, y - 9, 27, Math.PI, Math.PI * 2);
      context.lineTo(x + 22, y - 4);
      context.quadraticCurveTo(x, y - 15, x - 24, y - 3);
      context.closePath();
      context.fill();
    }

    if (this.isSumoStyle()) {
      context.fillStyle = hairColor;
      context.strokeStyle = "rgba(0,0,0,0.35)";
      context.lineWidth = 2;
      context.beginPath();
      context.ellipse(x, y - 30, 13, 8, 0, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.beginPath();
      context.arc(x, y - 39, 8, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    }

    if (direction === "up") {
      context.fillStyle = hairColor;
      context.beginPath();
      if (body.mage) {
        context.ellipse(x, y + 6, 27, 40, 0, Math.PI * 0.85, Math.PI * 2.15);
        context.fill();
      } else if (this.characterType === "normal") {
        context.arc(x, y - 2, 27, Math.PI * 0.86, Math.PI * 2.14);
        context.lineTo(x + 24, y + 2);
        context.quadraticCurveTo(x, y + 13, x - 24, y + 2);
        context.fill();
      } else {
        context.arc(x, y - 2, 25, Math.PI * 0.9, Math.PI * 2.1);
        context.fill();
      }
      return;
    }

    context.fillStyle = this.eyeColor || PLAYER_MODEL.visor;
    context.beginPath();
    const frontView = direction === "down";
    const eye1X = frontView ? x - 8 : x + 8;
    const eye2X = frontView ? x + 8 : x + 20;
    context.arc(eye1X, y - 4, 3.1, 0, Math.PI * 2);
    context.arc(eye2X, y - 4, 3.1, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = damaged ? "#ffffff" : "#8f3b3a";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(frontView ? x : x + 15, y + 7, damaged ? 8 : 6, 0.18, Math.PI - 0.18);
    context.stroke();
  }

  drawModelLimb(context, points, color, width) {
    context.strokeStyle = color;
    context.lineWidth = width;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.lineTo(points[1].x, points[1].y);
    context.lineTo(points[2].x, points[2].y);
    context.stroke();
  }

  drawModelFoot(context, foot, color) {
    context.fillStyle = color;
    context.beginPath();
    context.ellipse(foot.x + 5, foot.y + 3, 14, 5, 0.08, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = PLAYER_MODEL.sole;
    context.fillRect(foot.x - 7, foot.y + 6, 22, 3);
  }

  drawModelBareFoot(context, foot) {
    context.fillStyle = PLAYER_MODEL.skin;
    context.strokeStyle = PLAYER_MODEL.skinShade;
    context.lineWidth = 2;
    context.beginPath();
    context.ellipse(foot.x + 5, foot.y + 3, 15, 6, 0.08, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  drawHeldBall(context, scale) {
    const ballScale = scale / this.getCharacterVisualScale();
    const floatOffset = this.isAlienStyle() ? this.getAlienFloatOffset() * scale : 0;
    let bx = this.x + this.facing * 34 * scale;
    let by = this.y - this.jumpZ - 48 * scale - floatOffset;
    if (this.state === "throwing" && this.throwPhase === "windup") {
      bx = this.x - this.facing * (this.throwKind === "shoot" ? 62 : 44) * scale;
      by = this.y - this.jumpZ - (this.throwKind === "shoot" ? 126 : 92) * scale - floatOffset;
    } else if (this.state === "catching" || this.catchSuccessTimer > 0) {
      bx = this.x;
      by = this.y - this.jumpZ - (this.catchSuccessTimer > 0 ? 108 : 130) * scale - floatOffset;
    }
    if (this.isDemonStyle()) {
      context.save();
      context.globalAlpha = 0.18 + Math.sin(performance.now() / 140) * 0.05;
      context.strokeStyle = "#3a0b54";
      context.lineWidth = 9 * ballScale;
      context.beginPath();
      context.arc(bx, by, 34 * ballScale, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = "#9b2cff";
      context.lineWidth = 3 * ballScale;
      context.beginPath();
      context.arc(bx, by, 43 * ballScale, -0.4, Math.PI * 1.25);
      context.stroke();
      context.restore();
    }
    const radius = 24 * ballScale;
    if (this.isLavaGolemStyle()) {
      const pulse = 0.72 + Math.sin(performance.now() / 70) * 0.28;
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.32 + pulse * 0.22;
      context.strokeStyle = "#ff4b1f";
      context.lineWidth = 11 * ballScale;
      context.beginPath();
      context.arc(bx, by, radius * 1.36, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = "#ffd36a";
      context.lineWidth = 3 * ballScale;
      context.beginPath();
      context.arc(bx, by, radius * 1.7, -0.8, Math.PI * 1.1);
      context.stroke();
      context.restore();
    }
    context.fillStyle = this.isLavaGolemStyle() ? "#050303" : "#f06a32";
    context.beginPath();
    context.arc(bx, by, radius, 0, Math.PI * 2);
    context.fill();
    if (this.isLavaGolemStyle()) {
      context.strokeStyle = "#ff5a1f";
      context.lineWidth = 3 * ballScale;
      context.beginPath();
      context.moveTo(bx - radius * 0.6, by - radius * 0.2);
      context.lineTo(bx - radius * 0.1, by + radius * 0.06);
      context.lineTo(bx + radius * 0.18, by - radius * 0.34);
      context.moveTo(bx + radius * 0.08, by + radius * 0.32);
      context.lineTo(bx + radius * 0.48, by + radius * 0.06);
      context.lineTo(bx + radius * 0.72, by + radius * 0.38);
      context.stroke();
      context.fillStyle = "rgba(255, 210, 76, 0.72)";
      context.beginPath();
      context.arc(bx - radius * 0.08, by + radius * 0.05, radius * 0.12, 0, Math.PI * 2);
      context.arc(bx + radius * 0.49, by + radius * 0.08, radius * 0.1, 0, Math.PI * 2);
      context.fill();
    }
    context.strokeStyle = this.isLavaGolemStyle() ? "#3b0906" : "#8e2f22";
    context.lineWidth = 3 * ballScale;
    context.beginPath();
    context.arc(bx, by, radius, -0.8, 0.8);
    if (!this.isLavaGolemStyle()) {
      context.moveTo(bx - radius, by);
      context.lineTo(bx + radius, by);
    }
    context.stroke();
  }

  drawCatchPose(context, config) {
    // Catch area is still used for gameplay, but no longer shown during play.
  }

  drawControlMarker(context) {
    const top = this.getVisualTop();
    context.fillStyle = "#d32f2f";
    context.beginPath();
    context.moveTo(this.x, top - 18);
    context.lineTo(this.x - 16, top - 43);
    context.lineTo(this.x + 16, top - 43);
    context.closePath();
    context.fill();
    context.fillRect(this.x - 6, top - 65, 12, 24);
  }

  drawPassMarker(context) {
    const y = this.getVisualTop() - 32;
    context.save();
    context.fillStyle = "#fff4a8";
    context.strokeStyle = "#263241";
    context.lineWidth = 4;
    context.beginPath();
    context.arc(this.x, y, 18, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = "#263241";
    context.font = "bold 23px Meiryo, sans-serif";
    context.textAlign = "center";
    context.fillText("P", this.x, y + 8);
    context.restore();
  }

  drawShootMarker(context) {
    const y = this.getVisualTop() - 68;
    const phase = performance.now() / 120;
    const pulse = 0.5 + Math.sin(phase) * 0.5;
    context.save();
    context.globalCompositeOperation = "lighter";
    context.globalAlpha = 0.3 + pulse * 0.28;
    context.strokeStyle = "#ff304a";
    context.lineWidth = 8;
    context.beginPath();
    context.ellipse(this.x, this.y - this.jumpZ - 48, 58 + pulse * 12, 78 + pulse * 16, 0, 0, Math.PI * 2);
    context.stroke();
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 1;
    context.fillStyle = "#ffef62";
    context.strokeStyle = "#8e1712";
    context.lineWidth = 5;
    context.beginPath();
    context.arc(this.x, y, 22 + pulse * 3, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = "#8e1712";
    context.font = "bold 29px Meiryo, sans-serif";
    context.textAlign = "center";
    context.fillText("!", this.x, y + 10);
    context.restore();
  }

  drawStatusBars(context) {
    const arkmaLord = this.uniformEmblem === "arkmaLord";
    const width = arkmaLord ? 86 : 58;
    const y = this.getVisualTop() - (arkmaLord ? 76 : this.isDemonStyle() ? 46 : 10);
    let staminaY = y;

    if (this.role === "inner") {
      const hpRatio = Math.max(0, this.hp / this.maxHp);
      context.fillStyle = "rgba(25,25,32,0.72)";
      this.roundRect(context, this.x - width / 2, y, width, 8, 3);
      context.fill();
      context.fillStyle = this.team === "left" ? "#49d36e" : "#ffdf5d";
      this.roundRect(context, this.x - width / 2 + 2, y + 2, (width - 4) * hpRatio, 4, 2);
      context.fill();
      staminaY += 11;
    }

    if (!this.cpuControlled || arkmaLord) {
      const staminaRatio = Math.max(0, this.stamina / this.maxStamina);
      context.fillStyle = "rgba(25,25,32,0.72)";
      this.roundRect(context, this.x - width / 2, staminaY, width, 7, 3);
      context.fill();
      context.fillStyle = staminaRatio > 0.3 ? "#35d7e8" : "#ff765f";
      this.roundRect(context, this.x - width / 2 + 2, staminaY + 2, (width - 4) * staminaRatio, 3, 2);
      context.fill();
    }
  }

  getVisualTop() {
    const ducking = this.dodgeType === "duck" && this.dodgeTimer > 0;
    const visualHeight = ducking ? 105 : 158;
    return this.y - this.jumpZ - visualHeight * (this.lastDrawScale || 1);
  }

  drawDebug(context, config) {
    const hit = this.getHitBox();
    context.strokeStyle = "rgba(0,255,80,0.7)";
    context.lineWidth = 2;
    context.strokeRect(hit.x, hit.y, hit.w, hit.h);

    const box = this.getCatchBox(config);
    context.strokeStyle = "rgba(0,180,255,0.55)";
    context.strokeRect(box.x, box.y, box.w, box.h);
  }

  roundRect(context, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + w - radius, y);
    context.quadraticCurveTo(x + w, y, x + w, y + radius);
    context.lineTo(x + w, y + h - radius);
    context.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    context.lineTo(x + radius, y + h);
    context.quadraticCurveTo(x, y + h, x, y + h - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
  }
}
