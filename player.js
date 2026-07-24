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
    if (!this.hasBall) this.quickShotReadyTimer = 0;
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
    const dashMultiplier = this.isDashing ? (airborne ? 1 + (config.dashSpeedMultiplier - 1) * 0.5 : config.dashSpeedMultiplier) : 1;
    const overdriveScale = this.isRobotOverdrive() ? ROBOT_OVERDRIVE_CONFIG.moveSpeedScale : 1;
    const speed = this.speed * overdriveScale * dashMultiplier * duckSlow * turnSlow;
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
    this.catchTimer = duration;
    this.state = "catching";
  }

  startCatchSuccess() {
    if (this.defeated || this.downTimer > 0) return;
    this.catchSuccessTimer = 0.28;
    this.state = "catching";
  }

  startCounterOpportunity(sourceDamage, target, config) {
    if (this.defeated || this.downTimer > 0 || !this.hasBall) return;
    this.counterReadyTimer = config.lockDuration;
    this.counterWindowTimer = config.lockDuration + config.windowDuration;
    this.counterAutoTimer = config.lockDuration + 0.12 + Math.random() * 0.16;
    this.counterSourceDamage = Math.max(0, sourceDamage || 0);
    this.counterTarget = target || null;
    this.counterVisualIntensity = Math.max(1, Math.min(2.5, this.counterSourceDamage / 32));
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
  }

  stun(duration) {
    if (this.defeated || this.downTimer > 0) return;
    this.stunTimer = Math.max(this.stunTimer, duration);
    this.state = "damaged";
  }

  startDodge(moveX, moveY, config) {
    if (this.defeated || this.downTimer > 0 || this.hitRecoveryTimer > 0 || this.dodgeTimer > 0) return false;
    const cost = config.stamina.duckCost;
    if (!this.consumeStamina(cost, config.stamina.recoveryDelay)) return false;

    this.dodgeType = "duck";
    this.dodgeTimer = config.duckDuration;
    this.robotDodgeDirection = Math.abs(moveX) > 0.08 ? Math.sign(moveX) : this.facing;
    this.state = "dodging";
    return true;
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

    this.hp = Math.max(0, this.hp - amount);
    this.isDamaged = true;
    this.invincibleTime = config.invincibleTime;
    this.hitRecoveryTimer = config.hitRecoveryDuration;
    this.catchTimer = 0;
    this.quickShotReadyTimer = 0;
    this.throwTimer = 0;
    this.throwPhase = "none";
    this.throwKind = "none";
    this.dodgeTimer = 0;
    this.clearCounterOpportunity();
    const damageRatio = Math.max(0.65, Math.min(2.1, amount / 20));
    const isDefeatHit = this.hp <= 0;
    const knockbackMultiplier = (isDefeatHit ? 4 : 2) * knockbackScale;
    this.knockbackX = sourceDirection * config.knockbackSpeed * damageRatio * knockbackMultiplier;
    this.knockbackY = (-90 + Math.random() * 180) * damageRatio * knockbackMultiplier;

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

    const scale = this.getScale(config) * renderScaleCompensation;
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
    if (this.isRobotStyle()) {
      this.drawRobotCharacter(context, scale, drawY, motionTime, config);
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

  isRobotOverdrive() {
    return (
      this.isRobotStyle() &&
      !this.defeated &&
      this.hp > 0 &&
      this.hp / Math.max(1, this.maxHp) <= ROBOT_OVERDRIVE_CONFIG.hpRatio
    );
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
    let bx = this.x + this.facing * 34 * scale;
    let by = this.y - this.jumpZ - 48 * scale;
    if (this.state === "throwing" && this.throwPhase === "windup") {
      bx = this.x - this.facing * (this.throwKind === "shoot" ? 62 : 44) * scale;
      by = this.y - this.jumpZ - (this.throwKind === "shoot" ? 126 : 92) * scale;
    } else if (this.state === "catching" || this.catchSuccessTimer > 0) {
      bx = this.x;
      by = this.y - this.jumpZ - (this.catchSuccessTimer > 0 ? 108 : 130) * scale;
    }
    context.fillStyle = "#f06a32";
    context.beginPath();
    const radius = 24 * scale;
    context.arc(bx, by, radius, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#8e2f22";
    context.lineWidth = 3 * scale;
    context.beginPath();
    context.arc(bx, by, radius, -0.8, 0.8);
    context.moveTo(bx - radius, by);
    context.lineTo(bx + radius, by);
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
    context.save();
    context.fillStyle = "#ffef62";
    context.strokeStyle = "#8e2f22";
    context.lineWidth = 4;
    context.beginPath();
    context.arc(this.x, y, 18, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = "#8e2f22";
    context.font = "bold 23px Meiryo, sans-serif";
    context.textAlign = "center";
    context.fillText("S", this.x, y + 8);
    context.restore();
  }

  drawStatusBars(context) {
    const width = 58;
    const y = this.getVisualTop() - 10;
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

    if (!this.cpuControlled) {
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
