const TSUTENKAKU_SKY_TRAVEL_TIME = 1.5;
const TSUTENKAKU_WARNING_MIN_TIME = 1.5;
const TSUTENKAKU_WARNING_MAX_TIME = 2.5;
const BOOMERANG_ARC_SCALE = 1.5;
const BOOMERANG_SIZE_SCALE = 1.5;
const BOOMERANG_OUTWARD_DISTANCE = 720;

class Ball {
  constructor(config) {
    this.config = config;
    this.reset();
  }

  reset() {
    this.x = 1260;
    this.y = 440;
    this.z = 0;
    this.radius = this.config.radius;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.owner = null;
    this.thrower = null;
    this.target = null;
    this.kind = "loose";
    this.power = this.config.damage;
    this.shotMultiplier = 1;
    this.specialShot = false;
    this.specialShotType = null;
    this.counterShot = false;
    this.counterFlightZ = 0;
    this.counterIntensity = 1;
    this.baseRadius = this.config.radius;
    this.travelDistance = 0;
    this.returning = false;
    this.boomerangCurveSign = 1;
    this.boomerangStartDistance = 900;
    this.boomerangReturnStartX = 0;
    this.boomerangReturnStartY = 0;
    this.boomerangControlX = 0;
    this.boomerangControlY = 0;
    this.boomerangTargetX = 0;
    this.boomerangTargetY = 0;
    this.boomerangReturnElapsed = 0;
    this.boomerangReturnDuration = 0;
    this.boomerangCurveComplete = false;
    this.boostElapsed = 0;
    this.boostFlightZ = 0;
    this.slapInitialSpeed = 0;
    this.slapFlightZ = 0;
    this.kiaiElapsed = 0;
    this.kiaiCruiseSpeed = 0;
    this.kiaiFlightZ = 0;
    this.tsutenkakuPhase = "none";
    this.tsutenkakuElapsed = 0;
    this.tsutenkakuTargetX = 0;
    this.tsutenkakuTargetY = 0;
    this.tsutenkakuTargetZ = 0;
    this.tsutenkakuPeakZ = 0;
    this.tsutenkakuWarningDuration = TSUTENKAKU_WARNING_MAX_TIME;
    this.tsutenkakuImpactPending = false;
    this.lightningZigzagActive = false;
    this.lightningElapsed = 0;
    this.lightningDuration = 0;
    this.lightningStartX = 0;
    this.lightningStartY = 0;
    this.lightningStartZ = 0;
    this.lightningTargetX = 0;
    this.lightningTargetY = 0;
    this.lightningTargetZ = 0;
    this.lightningAmplitude = 0;
    this.lightningProgress = 0;
    this.lightningImpactTimer = 0;
    this.lightningImpactPending = false;
    this.lightningTrail = [];
    this.hitPlayerIds = new Set();
    this.isFlying = false;
    this.isLoose = true;
    this.catchable = false;
    this.hasBounced = false;
    this.spin = 0;
    this.passTime = 0;
    this.passDuration = 0;
    this.passStartZ = 0;
    this.passArcHeight = 0;
  }

  update(delta, bounds) {
    if (this.owner) {
      this.x = this.owner.x + this.owner.facing * 32;
      this.y = this.owner.y - 38;
      this.z = this.owner.jumpZ + 18;
      return;
    }

    if (this.isFlying && this.specialShotType === "lightning" && this.lightningZigzagActive) {
      this.updateLightningZigzag(delta);
      return;
    }

    if (this.isFlying && this.kind === "pass" && this.target && !this.target.defeated) {
      this.passTime += delta;
      this.adjustPassTrajectory(delta);
    }

    this.updateSpecialShot(delta);

    if (
      this.isFlying &&
      this.kind === "shoot" &&
      this.specialShotType === "tsutenkaku" &&
      (
        this.tsutenkakuPhase === "skyTravel" ||
        this.tsutenkakuPhase === "warning" ||
        this.tsutenkakuPhase === "impact"
      )
    ) {
      this.z = this.tsutenkakuPhase === "impact" ? this.tsutenkakuTargetZ : this.tsutenkakuPeakZ;
      this.vx = 0;
      this.vy = 0;
      this.vz = 0;
      this.spin += delta * 3.2;
      return;
    }

    const lastX = this.x;
    const lastY = this.y;
    this.x += this.vx * delta;
    this.y += this.vy * delta;
    this.travelDistance += Math.hypot(this.x - lastX, this.y - lastY);
    this.z += this.vz * delta;
    this.spin += Math.hypot(this.vx, this.vy) * delta * 0.025;

    if (
      this.isFlying &&
      this.specialShotType === "tsutenkaku" &&
      this.tsutenkakuPhase === "dive" &&
      this.z <= this.tsutenkakuTargetZ
    ) {
      this.x = this.tsutenkakuTargetX;
      this.y = this.tsutenkakuTargetY;
      this.z = this.tsutenkakuTargetZ;
      this.vx = 0;
      this.vy = 0;
      this.vz = 0;
      this.tsutenkakuPhase = "impact";
      this.tsutenkakuImpactPending = true;
      return;
    }

    const straightBoostFlight = this.isFlying && this.kind === "shoot" && this.specialShotType === "boost";
    const straightSlapFlight = this.isFlying && this.kind === "shoot" && this.specialShotType === "slap";
    const straightKiaiFlight = this.isFlying && this.kind === "shoot" && this.specialShotType === "kiai";
    const straightCounterFlight = this.isFlying && this.kind === "shoot" && this.counterShot;
    if (this.isFlying) {
      if (straightBoostFlight) {
        this.z = this.boostFlightZ;
        this.vz = 0;
      } else if (straightSlapFlight) {
        this.z = this.slapFlightZ;
        this.vz = 0;
      } else if (straightKiaiFlight) {
        this.z = this.kiaiFlightZ;
        this.vz = 0;
      } else if (straightCounterFlight) {
        this.z = this.counterFlightZ;
        this.vz = 0;
      } else if (this.kind !== "pass") {
        const airDrag = this.specialShotType ? 0.994 : 0.996;
        this.vx *= Math.pow(airDrag, delta * 60);
        this.vy *= Math.pow(airDrag, delta * 60);
        this.vz -= this.config.gravity * delta;
      } else {
        this.vz -= this.config.gravity * delta;
      }
    } else {
      this.vx *= Math.pow(0.80, delta * 60);
      this.vy *= Math.pow(0.80, delta * 60);
      this.vz -= this.config.gravity * delta;
    }

    if (!straightBoostFlight && !straightSlapFlight && !straightKiaiFlight && !straightCounterFlight && this.z <= 0) {
      this.z = 0;
      if (this.isFlying) {
        this.hasBounced = true;
        this.catchable = false;
      }
      if (this.vz < -80) {
        this.vz = Math.abs(this.vz) * 0.28;
      } else {
        this.vz = 0;
      }
      if (this.isFlying && this.kind === "shoot") {
        this.drop();
      }
      if (!this.owner && Math.hypot(this.vx, this.vy) < 130) {
        this.drop();
      }
    }

    if (straightBoostFlight) return;

    if (this.x < bounds.x + this.radius) {
      this.x = bounds.x + this.radius;
      this.vx = Math.abs(this.vx) * 0.55;
      this.drop();
    }
    if (this.x > bounds.x + bounds.w - this.radius) {
      this.x = bounds.x + bounds.w - this.radius;
      this.vx = -Math.abs(this.vx) * 0.55;
      this.drop();
    }
    if (this.y < bounds.y + this.radius) {
      this.y = bounds.y + this.radius;
      this.vy = Math.abs(this.vy) * 0.55;
      this.drop();
    }
    if (this.y > bounds.y + bounds.h - this.radius) {
      this.y = bounds.y + bounds.h - this.radius;
      this.vy = -Math.abs(this.vy) * 0.55;
      this.drop();
    }
  }

  pickUp(player) {
    if (this.owner) this.owner.hasBall = false;
    this.owner = player;
    this.thrower = null;
    this.target = null;
    this.kind = "hold";
    this.isFlying = false;
    this.isLoose = false;
    this.catchable = false;
    this.hasBounced = false;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.passTime = 0;
    this.passDuration = 0;
    this.shotMultiplier = 1;
    this.specialShot = false;
    this.specialShotType = null;
    this.counterShot = false;
    this.counterFlightZ = 0;
    this.counterIntensity = 1;
    this.radius = this.baseRadius;
    this.travelDistance = 0;
    this.returning = false;
    this.boomerangCurveSign = 1;
    this.boomerangStartDistance = 900;
    this.boostElapsed = 0;
    this.boostFlightZ = 0;
    this.slapInitialSpeed = 0;
    this.slapFlightZ = 0;
    this.kiaiElapsed = 0;
    this.kiaiCruiseSpeed = 0;
    this.kiaiFlightZ = 0;
    this.clearTsutenkakuDrop();
    this.clearLightningZigzag();
    this.hitPlayerIds.clear();
    player.hasBall = true;
  }

  launch(actor, target, kind, aimVector, throwMultiplier = 1, specialShot = false) {
    if ((kind !== "shoot" && !target) || actor.defeated) return false;

    actor.hasBall = false;
    this.owner = null;
    this.thrower = actor;
    this.target = target;
    this.kind = kind;
    this.shotMultiplier = kind === "shoot" ? throwMultiplier : 1;
    this.specialShotType = kind === "shoot" && typeof specialShot === "string" ? specialShot : null;
    this.specialShot = Boolean(this.specialShotType);
    this.counterShot = false;
    this.counterFlightZ = 0;
    this.counterIntensity = 1;
    const powerMultiplier = kind === "shoot" ? throwMultiplier : 1;
    this.power = kind === "shoot" ? actor.throwPower * powerMultiplier : 0;
    this.isFlying = true;
    this.isLoose = false;
    this.catchable = true;
    this.hasBounced = false;
    this.x = actor.x + actor.facing * 42;
    this.y = actor.y - 42;
    this.z = actor.jumpZ + 28;
    if (this.specialShotType === "boost") {
      this.z = 28;
    } else if (this.specialShotType === "slap") {
      this.z = Math.min(76, 42 + actor.jumpZ * 0.18);
    }
    this.passTime = 0;
    this.passDuration = 0;
    this.radius = this.baseRadius;
    if (this.specialShotType === "iron") {
      this.radius = this.baseRadius * 1.2;
    } else if (this.specialShotType === "soul") {
      this.radius = this.baseRadius * 2;
    } else if (this.specialShotType === "slap") {
      this.radius = this.baseRadius * 1.98;
    } else if (this.specialShotType === "kiai") {
      this.radius = this.baseRadius * 1.15;
    } else if (this.specialShotType === "boomerang") {
      this.radius = this.baseRadius * BOOMERANG_SIZE_SCALE;
    }
    this.travelDistance = 0;
    this.returning = false;
    this.boomerangCurveSign = aimVector?.y >= 0 ? 1 : -1;
    this.boomerangStartDistance = target ? Math.hypot(target.x - actor.x, target.y - actor.y) : 900;
    this.boomerangReturnStartX = 0;
    this.boomerangReturnStartY = 0;
    this.boomerangControlX = 0;
    this.boomerangControlY = 0;
    this.boomerangTargetX = 0;
    this.boomerangTargetY = 0;
    this.boomerangReturnElapsed = 0;
    this.boomerangReturnDuration = 0;
    this.boomerangCurveComplete = false;
    this.boostElapsed = 0;
    this.boostFlightZ = this.specialShotType === "boost" ? this.z : 0;
    this.slapInitialSpeed = 0;
    this.slapFlightZ = this.specialShotType === "slap" ? this.z : 0;
    this.kiaiElapsed = 0;
    this.kiaiCruiseSpeed = 0;
    this.kiaiFlightZ = this.specialShotType === "kiai" ? this.z : 0;
    this.clearTsutenkakuDrop();
    this.clearLightningZigzag();
    this.hitPlayerIds.clear();

    if (kind === "pass") {
      this.launchPassArc(actor, target, throwMultiplier);
      return true;
    }

    const leadScale = kind === "shoot" && target && actor.jumpZ <= 8 ? 0.06 : 0;
    const leadX = target ? target.vx * leadScale : 0;
    const leadY = target ? target.vy * leadScale : 0;
    const targetX = target ? target.x + leadX : this.x + aimVector.x * 900;
    const targetY = target ? target.y - 38 + leadY : this.y + aimVector.y * 900;
    const aimNudge = target && kind !== "shoot" ? 22 : 0;
    const dx = targetX - this.x + aimVector.x * aimNudge;
    const dy = targetY - this.y + aimVector.y * aimNudge;
    const length = Math.hypot(dx, dy) || 1;
    const speedRatio = kind === "shoot" ? this.getShootSpeedRatio(throwMultiplier) : throwMultiplier;
    const shootBaseSpeed = kind === "shoot" && this.specialShotType && this.specialShotType !== "kiai"
      ? this.config.specialShootSpeed || this.config.shootSpeed
      : this.config.shootSpeed;
    const specialSpeedScale = this.specialShotType === "slap" ? 1.2 : 1;
    const speed = kind === "shoot" ? shootBaseSpeed * speedRatio * specialSpeedScale : this.config.passSpeed;
    const moveBonus = kind === "shoot" && target ? this.config.moveBonus * 0.05 : kind === "shoot" ? this.config.moveBonus : this.config.moveBonus * 0.15;

    if (this.specialShotType === "lightning") {
      const targetGroundY = target ? target.y : targetY + 38;
      const targetZ = target ? (target.jumpZ || 0) + 52 : 52;
      const distance = Math.hypot(targetX - this.x, targetGroundY - this.y);
      const normalDuration = Math.max(0.72, Math.min(1.35, distance / Math.max(760, speed * 0.9)));
      this.lightningZigzagActive = true;
      this.lightningElapsed = 0;
      this.lightningDuration = normalDuration / 0.4;
      this.lightningStartX = this.x;
      this.lightningStartY = this.y;
      this.lightningStartZ = this.z;
      this.lightningTargetX = targetX;
      this.lightningTargetY = targetGroundY;
      this.lightningTargetZ = targetZ;
      this.lightningAmplitude = Math.max(150, Math.min(260, 110 + distance * 0.09));
      this.lightningProgress = 0;
      this.lightningImpactTimer = 0;
      this.lightningImpactPending = false;
      this.lightningTrail = [{ x: this.x, y: this.y - this.z }];
      this.catchable = true;
      this.vx = targetX >= this.x ? 0.001 : -0.001;
      this.vy = 0;
      this.vz = 0;
      return true;
    }

    if (this.specialShotType === "tsutenkaku") {
      const targetGroundY = target ? target.y : targetY + 38;
      const targetZ = target ? (target.jumpZ || 0) + 44 : 44;
      this.tsutenkakuPhase = "rise";
      this.tsutenkakuElapsed = 0;
      this.tsutenkakuTargetX = targetX;
      this.tsutenkakuTargetY = targetGroundY;
      this.tsutenkakuTargetZ = targetZ;
      this.tsutenkakuPeakZ = Math.max(2400, this.y + 1200, this.z + 1800);
      this.vx = 0;
      this.vy = 0;
      this.vz = 2600;
      this.catchable = true;
      return true;
    }

    const directX = dx / length;
    const directY = dy / length;
    if (this.specialShotType === "boomerang") {
      const angle = this.boomerangCurveSign * Math.PI * 0.1 * BOOMERANG_ARC_SCALE;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const risingSpeed = speed * 0.58;
      this.vx = (directX * cos - directY * sin) * risingSpeed + actor.vx * moveBonus;
      this.vy = (directX * sin + directY * cos) * risingSpeed + actor.vy * moveBonus;
    } else {
      this.vx = directX * speed + actor.vx * moveBonus;
      this.vy = directY * speed + actor.vy * moveBonus;
    }
    if (kind === "shoot" && target) {
      const trajectorySpeed = this.specialShotType === "boost"
        ? (this.config.specialShootSpeed || this.config.shootSpeed) * 1.8
        : speed;
      const flightTime = Math.max(0.22, length / Math.max(1, trajectorySpeed));
      const targetZ = (target.jumpZ || 0) + 22;
      const solvedVz = (targetZ - this.z + 0.5 * this.config.gravity * flightTime * flightTime) / flightTime;
      const arcLift = this.specialShotType === "boost"
        ? 28 + Math.max(0, throwMultiplier - 0.7) * 18
        : this.specialShotType
          ? 70 + Math.max(0, throwMultiplier - 0.7) * 45
          : 110 + Math.max(0, throwMultiplier - 0.7) * 34;
      this.vz = Math.max(-80, Math.min(610, solvedVz + arcLift));
      if (this.specialShotType === "boomerang") {
        this.vz = Math.max(this.vz, 760 + actor.jumpZ * 0.12);
      }
    } else {
      this.vz = kind === "shoot"
        ? 470 + Math.max(0, throwMultiplier - 0.7) * (this.specialShotType ? 120 : 82) + actor.jumpZ * 0.12
        : 650 + actor.jumpZ * 0.15;
      if (this.specialShotType === "boost" && kind === "shoot") {
        this.vz = Math.max(160, this.vz * 0.45);
      }
    }
    if (this.specialShotType === "slap") {
      this.slapInitialSpeed = Math.hypot(this.vx, this.vy);
      this.slapFlightZ = this.z;
      this.vz = 0;
    }
    if (this.specialShotType === "kiai") {
      const directionLength = Math.hypot(this.vx, this.vy) || 1;
      const directionX = this.vx / directionLength;
      const directionY = this.vy / directionLength;
      this.kiaiCruiseSpeed = speed;
      this.kiaiFlightZ = this.z;
      this.vx = directionX * speed * 1.16;
      this.vy = directionY * speed * 1.16;
      this.vz = 0;
    }
    return true;
  }

  clearLightningZigzag() {
    this.lightningZigzagActive = false;
    this.lightningElapsed = 0;
    this.lightningProgress = 0;
    this.lightningImpactTimer = 0;
    this.lightningImpactPending = false;
    this.lightningTrail = [];
  }

  clearTsutenkakuDrop() {
    this.tsutenkakuPhase = "none";
    this.tsutenkakuElapsed = 0;
    this.tsutenkakuTargetX = 0;
    this.tsutenkakuTargetY = 0;
    this.tsutenkakuTargetZ = 0;
    this.tsutenkakuPeakZ = 0;
    this.tsutenkakuWarningDuration = TSUTENKAKU_WARNING_MAX_TIME;
    this.tsutenkakuImpactPending = false;
  }

  updateLightningZigzag(delta) {
    if (this.lightningProgress >= 1) {
      this.x = this.lightningTargetX;
      this.y = this.lightningTargetY;
      this.z = this.lightningTargetZ;
      this.catchable = true;
      this.lightningImpactTimer -= delta;
      if (this.lightningImpactTimer <= 0) this.drop();
      return;
    }

    const previousX = this.x;
    const previousY = this.y;
    const previousZ = this.z;
    this.lightningElapsed += delta;
    const progress = Math.min(1, this.lightningElapsed / Math.max(0.01, this.lightningDuration));
    const dx = this.lightningTargetX - this.lightningStartX;
    const dy = this.lightningTargetY - this.lightningStartY;
    const length = Math.hypot(dx, dy) || 1;
    const sideX = -dy / length;
    const sideY = dx / length;
    const zigzag = (2 / Math.PI) * Math.asin(Math.sin(progress * Math.PI * 6));
    const envelope = Math.pow(Math.sin(progress * Math.PI), 0.48);
    const offset = zigzag * this.lightningAmplitude * envelope;
    const baseX = this.lightningStartX + dx * progress;
    const baseY = this.lightningStartY + dy * progress;
    const baseZ = this.lightningStartZ + (this.lightningTargetZ - this.lightningStartZ) * progress;
    this.x = baseX + sideX * offset;
    this.y = baseY + sideY * offset;
    this.z = baseZ + Math.sin(progress * Math.PI) * 115;
    this.vx = (this.x - previousX) / Math.max(0.001, delta);
    this.vy = (this.y - previousY) / Math.max(0.001, delta);
    this.vz = (this.z - previousZ) / Math.max(0.001, delta);
    this.travelDistance += Math.hypot(this.x - previousX, this.y - previousY);
    this.spin += delta * 18;
    this.lightningProgress = progress;
    this.lightningTrail.push({ x: this.x, y: this.y - this.z });
    if (this.lightningTrail.length > 16) this.lightningTrail.shift();

    if (progress >= 1) {
      this.x = this.lightningTargetX;
      this.y = this.lightningTargetY;
      this.z = this.lightningTargetZ;
      this.lightningImpactTimer = 0.12;
      this.lightningImpactPending = true;
      this.lightningTrail.push({ x: this.x, y: this.y - this.z });
    }
  }

  updateSpecialShot(delta) {
    if (!this.isFlying || this.kind !== "shoot" || !this.specialShotType) return;
    if (this.specialShotType === "tsutenkaku") {
      this.updateTsutenkakuDrop(delta);
      return;
    }
    if (this.specialShotType === "boost") {
      this.boostElapsed += delta;
      const currentSpeed = Math.hypot(this.vx, this.vy) || 1;
      const directionX = this.vx / currentSpeed;
      const directionY = this.vy / currentSpeed;
      const baseSpeed = this.config.specialShootSpeed || this.config.shootSpeed;
      let gearMultiplier = 0.35;
      if (this.boostElapsed >= 0.95) {
        gearMultiplier = 1.8;
      } else if (this.boostElapsed >= 0.68) {
        gearMultiplier = 1.35;
      } else if (this.boostElapsed >= 0.42) {
        gearMultiplier = 0.95;
      } else if (this.boostElapsed >= 0.2) {
        gearMultiplier = 0.6;
      }
      const targetSpeed = baseSpeed * gearMultiplier;
      if (Math.abs(currentSpeed - targetSpeed) > 1) {
        this.vx = directionX * targetSpeed;
        this.vy = directionY * targetSpeed;
      }
    }
    if (this.specialShotType === "kiai") {
      this.kiaiElapsed += delta;
      const currentSpeed = Math.hypot(this.vx, this.vy) || 1;
      const directionX = this.vx / currentSpeed;
      const directionY = this.vy / currentSpeed;
      const launchRatio = Math.max(0, 1 - this.kiaiElapsed / 0.14);
      const targetSpeed = this.kiaiCruiseSpeed * (1 + launchRatio * 0.16);
      this.vx = directionX * targetSpeed;
      this.vy = directionY * targetSpeed;
      this.z = this.kiaiFlightZ;
      this.vz = 0;
    }
    if (this.specialShotType === "slap") {
      const currentSpeed = Math.hypot(this.vx, this.vy) || 1;
      const directionX = this.vx / currentSpeed;
      const directionY = this.vy / currentSpeed;
      const initialSpeed = this.slapInitialSpeed || currentSpeed;
      const targetSpeed = Math.max(504, initialSpeed * Math.exp(-this.travelDistance / 650));
      this.vx = directionX * targetSpeed;
      this.vy = directionY * targetSpeed;
      this.z = this.slapFlightZ;
      this.vz = 0;
    }
    if (this.specialShotType === "boomerang" && this.target && !this.target.defeated) {
      if (!this.returning) {
        const speed = Math.hypot(this.vx, this.vy) || 1;
        const sideForce = Math.min(260, 90 + this.travelDistance * 0.12) *
          this.boomerangCurveSign * BOOMERANG_ARC_SCALE;
        const sideX = -this.vy / speed;
        const sideY = this.vx / speed;
        this.vx += sideX * sideForce * delta;
        this.vy += sideY * sideForce * delta;
      }
      if (!this.returning && this.travelDistance >= BOOMERANG_OUTWARD_DISTANCE) {
        this.returning = true;
        this.boomerangReturnStartX = this.x;
        this.boomerangReturnStartY = this.y;
        this.boomerangTargetX = this.target.x;
        this.boomerangTargetY = this.target.y - 38;
        const currentSpeed = Math.hypot(this.vx, this.vy) || 1;
        const speed = Math.max(760, currentSpeed);
        const directionX = this.vx / currentSpeed;
        const directionY = this.vy / currentSpeed;
        const targetDistance = Math.hypot(
          this.boomerangTargetX - this.x,
          this.boomerangTargetY - this.y
        );
        const controlDistance = Math.max(420, Math.min(1050, targetDistance * 0.95));
        this.boomerangControlX = this.x + directionX * controlDistance;
        this.boomerangControlY = this.y + directionY * controlDistance;
        const curveLength = controlDistance + Math.hypot(
          this.boomerangTargetX - this.boomerangControlX,
          this.boomerangTargetY - this.boomerangControlY
        );
        this.boomerangReturnElapsed = 0;
        this.boomerangReturnDuration = Math.max(0.62, Math.min(1.65, curveLength / speed));
        const targetZ = (this.target.jumpZ || 0) + 22;
        this.vz = (targetZ - this.z + 0.5 * this.config.gravity *
          this.boomerangReturnDuration * this.boomerangReturnDuration) /
          this.boomerangReturnDuration;
        this.hitPlayerIds.clear();
      }
      if (this.returning && !this.boomerangCurveComplete) {
        this.boomerangReturnElapsed += delta;
        const progress = Math.min(1, this.boomerangReturnElapsed / this.boomerangReturnDuration);
        const inverse = 1 - progress;
        const nextX = inverse * inverse * this.boomerangReturnStartX +
          2 * inverse * progress * this.boomerangControlX +
          progress * progress * this.boomerangTargetX;
        const nextY = inverse * inverse * this.boomerangReturnStartY +
          2 * inverse * progress * this.boomerangControlY +
          progress * progress * this.boomerangTargetY;
        this.vx = (nextX - this.x) / Math.max(0.001, delta);
        this.vy = (nextY - this.y) / Math.max(0.001, delta);
        if (progress >= 1) {
          this.boomerangCurveComplete = true;
        }
      }
    }
  }

  updateTsutenkakuDrop(delta) {
    if (this.tsutenkakuPhase === "rise") {
      this.tsutenkakuElapsed += delta;
      if (this.z >= this.tsutenkakuPeakZ || this.vz <= 0 || this.tsutenkakuElapsed > 1.05) {
        this.tsutenkakuPhase = "skyTravel";
        this.tsutenkakuElapsed = 0;
        this.z = this.tsutenkakuPeakZ;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
      }
      return;
    }
    if (this.tsutenkakuPhase === "skyTravel") {
      this.tsutenkakuElapsed += delta;
      if (this.tsutenkakuElapsed < TSUTENKAKU_SKY_TRAVEL_TIME) return;

      if (this.target && !this.target.defeated) {
        this.tsutenkakuTargetX = this.target.x;
        this.tsutenkakuTargetY = this.target.y;
        this.tsutenkakuTargetZ = (this.target.jumpZ || 0) + 44;
      }
      this.x = this.tsutenkakuTargetX;
      this.y = this.tsutenkakuTargetY;
      this.z = this.tsutenkakuPeakZ;
      this.tsutenkakuPhase = "warning";
      this.tsutenkakuElapsed = 0;
      this.tsutenkakuWarningDuration = TSUTENKAKU_WARNING_MIN_TIME +
        Math.random() * (TSUTENKAKU_WARNING_MAX_TIME - TSUTENKAKU_WARNING_MIN_TIME);
      this.vx = 0;
      this.vy = 0;
      this.vz = 0;
      return;
    }

    if (this.tsutenkakuPhase === "warning") {
      this.tsutenkakuElapsed += delta;
      if (this.tsutenkakuElapsed < this.tsutenkakuWarningDuration) return;

      this.tsutenkakuPhase = "dive";
      this.tsutenkakuElapsed = 0;
      this.x = this.tsutenkakuTargetX;
      this.y = this.tsutenkakuTargetY;
      this.vx = 0;
      this.vy = 0;
      this.vz = -1280;
    }

    if (this.tsutenkakuPhase !== "dive") return;
    this.x = this.tsutenkakuTargetX;
    this.y = this.tsutenkakuTargetY;
    this.vx = 0;
    this.vy = 0;
    this.vz = Math.min(-1280, this.vz);
  }

  getShootSpeedRatio(throwMultiplier = 1) {
    const t = Math.max(0, Math.min(1, ((throwMultiplier || 0.7) - 0.7) / 1.45));
    if (!this.specialShotType) {
      return 1 + t * 0.24;
    }
    if (this.specialShotType === "kiai") {
      return (1 + t * 0.24) * 1.22;
    }
    if (this.specialShotType === "boost") {
      return 0.35;
    }

    if (this.specialShotType === "soul") {
      return Math.min(2.4, (1.25 + t * 0.3) * 1.5);
    }

    if (this.specialShotType === "slap") {
      return Math.min(3.06, (1.42 + t * 0.24) * 1.8);
    }
    if (this.specialShotType === "tsutenkaku") {
      return Math.min(1.45, 1.15 + t * 0.2);
    }

    const specialBase = this.specialShotType === "lightning"
      ? 1.35
      : this.specialShotType === "iron"
        ? 1.05
        : 1.25;
    return Math.min(1.6, specialBase + t * 0.3);
  }

  launchPassArc(actor, target, passMultiplier = 1) {
    const catchPoint = this.getPassCatchPoint(target);
    const distance = Math.hypot(catchPoint.x - this.x, catchPoint.y - this.y);
    const outfieldPass = actor.role === "out" || target.role === "out";
    const speedBoost = outfieldPass ? 1.18 : 1;
    this.passStartZ = this.z;
    this.passArcHeight = (outfieldPass ? 580 : 460) + Math.max(0, passMultiplier - 1) * 150;
    this.passDuration = Math.max(0.92, Math.min(2.2, distance / Math.max(1, this.config.passSpeed * speedBoost * (0.88 + passMultiplier * 0.2))));
    this.vx = (catchPoint.x - this.x) / this.passDuration + actor.vx * this.config.moveBonus * 0.08;
    this.vy = (catchPoint.y - this.y) / this.passDuration + actor.vy * this.config.moveBonus * 0.08;
    this.vz = (catchPoint.z - this.z) / this.passDuration + (4 * this.passArcHeight) / this.passDuration;
  }

  adjustPassTrajectory(delta) {
    const remaining = Math.max(0.08, this.passDuration - this.passTime);
    const catchPoint = this.getPassCatchPoint(this.target);
    const desiredVx = (catchPoint.x - this.x) / remaining;
    const desiredVy = (catchPoint.y - this.y) / remaining;
    const progress = Math.max(0, Math.min(1, this.passTime / Math.max(0.01, this.passDuration)));
    const baseZ = this.passStartZ + (catchPoint.z - this.passStartZ) * progress;
    const desiredZ = baseZ + 4 * this.passArcHeight * progress * (1 - progress);
    const desiredVz = (desiredZ - this.z) / Math.max(0.001, delta);
    const follow = Math.min(1, delta * 5.5);
    this.vx += (desiredVx - this.vx) * follow;
    this.vy += (desiredVy - this.vy) * follow;
    this.vz = desiredVz;
  }

  getPassCatchPoint(target) {
    return {
      x: target.x,
      y: target.y - 34,
      z: target.jumpZ + 132
    };
  }

  bounceFromHit(direction, strength = 1) {
    this.owner = null;
    this.thrower = null;
    this.target = null;
    this.kind = "loose";
    this.isFlying = false;
    this.isLoose = true;
    this.catchable = false;
    this.hasBounced = true;
    const bounceStrength = Math.max(0.75, Math.min(2.2, strength));
    this.vx = direction * this.config.hitBounceX * bounceStrength;
    this.vy = (Math.random() - 0.5) * this.config.hitBounceY * bounceStrength;
    this.vz = 180 * bounceStrength;
    this.passTime = 0;
    this.passDuration = 0;
    this.shotMultiplier = 1;
    this.specialShot = false;
    this.specialShotType = null;
    this.radius = this.baseRadius;
    this.travelDistance = 0;
    this.returning = false;
    this.boomerangCurveSign = 1;
    this.boomerangStartDistance = 900;
    this.boostElapsed = 0;
    this.boostFlightZ = 0;
    this.slapInitialSpeed = 0;
    this.slapFlightZ = 0;
    this.kiaiElapsed = 0;
    this.kiaiCruiseSpeed = 0;
    this.kiaiFlightZ = 0;
    this.clearTsutenkakuDrop();
    this.clearLightningZigzag();
    this.hitPlayerIds.clear();
  }

  drop() {
    if (this.owner) this.owner.hasBall = false;
    this.owner = null;
    this.thrower = null;
    this.target = null;
    this.kind = "loose";
    this.isFlying = false;
    this.isLoose = true;
    this.catchable = false;
    this.hasBounced = true;
    this.passTime = 0;
    this.passDuration = 0;
    this.shotMultiplier = 1;
    this.specialShot = false;
    this.specialShotType = null;
    this.radius = this.baseRadius;
    this.travelDistance = 0;
    this.returning = false;
    this.boomerangCurveSign = 1;
    this.boomerangStartDistance = 900;
    this.boostElapsed = 0;
    this.boostFlightZ = 0;
    this.slapInitialSpeed = 0;
    this.slapFlightZ = 0;
    this.kiaiElapsed = 0;
    this.kiaiCruiseSpeed = 0;
    this.kiaiFlightZ = 0;
    this.clearTsutenkakuDrop();
    this.clearLightningZigzag();
    this.hitPlayerIds.clear();
  }

  getSpecialColor() {
    if (this.specialShotType === "kiai") return "#fff06a";
    if (this.specialShotType === "boost") return "#ff6b1a";
    if (this.specialShotType === "triple") return "#ffcc8a";
    if (this.specialShotType === "lightning") return "#66f6ff";
    if (this.specialShotType === "iron") return "#7e8592";
    if (this.specialShotType === "boomerang") return "#ffe36a";
    if (this.specialShotType === "soul") return "#ffc4e5";
    if (this.specialShotType === "slap") return "#ffb07a";
    if (this.specialShotType === "tsutenkaku") return "#ffd83d";
    return "#ffe46a";
  }

  canBePickedUpBy(player, distance) {
    if (!this.isLoose || this.owner || this.z >= 78 || player.hitRecoveryTimer > 0) return false;
    const rollingBonus = !this.isFlying || this.hasBounced ? 78 : 0;
    const catchBonus = player.catchTimer > 0 ? 72 : 0;
    return Math.hypot(this.x - player.x, this.y - player.y) <= distance + rollingBonus + catchBonus + 26;
  }

  draw(context, debugMode) {
    if (this.owner) return;

    if (
      this.isFlying &&
      this.specialShotType === "tsutenkaku" &&
      (this.tsutenkakuPhase === "warning" || this.tsutenkakuPhase === "dive")
    ) {
      this.drawTsutenkakuLandingMarker(context);
    }

    if (this.isFlying && this.specialShotType === "lightning" && this.lightningZigzagActive) {
      this.drawLightningZigzagBall(context, debugMode);
      return;
    }

    if (this.isFlying && this.specialShotType === "slap") {
      this.drawSlapShot(context, debugMode);
      return;
    }

    if (this.isFlying && this.specialShotType === "kiai") {
      this.drawKiaiStraight(context, debugMode);
      return;
    }

    const drawY = this.y - this.z;
    const shotEffect = this.kind === "shoot" && this.isFlying ? Math.max(0, this.shotMultiplier - 0.92) : 0;
    context.save();
    context.fillStyle = "rgba(40, 28, 16, 0.24)";
    context.beginPath();
    context.ellipse(this.x + 3, this.y + 10, this.radius * 1.05, this.radius * 0.38, 0, 0, Math.PI * 2);
    context.fill();

    if (shotEffect > 0) {
      const velocity = Math.hypot(this.vx, this.vy) || 1;
      const tailX = -this.vx / velocity;
      const tailY = -this.vy / velocity;
      const intensity = Math.min(1, shotEffect / 0.55);
      const specialColor = this.getSpecialColor();
      context.save();
      context.globalAlpha = 0.28 + intensity * 0.32;
      context.strokeStyle = this.counterShot ? "#8ffcff" : this.specialShot ? specialColor : intensity > 0.65 ? "#fff46a" : "#ffb44a";
      context.lineWidth = 8 + intensity * 8;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(this.x + tailX * 20, drawY + tailY * 20);
      context.lineTo(this.x + tailX * (82 + intensity * 62), drawY + tailY * (82 + intensity * 62));
      context.stroke();
      if (this.specialShotType === "boost") {
        const gear = this.boostElapsed >= 0.95 ? 4 : this.boostElapsed >= 0.68 ? 3 : this.boostElapsed >= 0.42 ? 2 : this.boostElapsed >= 0.2 ? 1 : 0;
        const flameLength = 90 + gear * 42 + Math.sin(performance.now() / 24) * 18;
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = 0.82;
        context.fillStyle = gear >= 3 ? "#fff7a0" : "#ff9b35";
        context.beginPath();
        context.moveTo(this.x + tailX * 18 + tailY * 18, drawY + tailY * 18 - tailX * 18);
        context.lineTo(this.x + tailX * flameLength, drawY + tailY * flameLength);
        context.lineTo(this.x + tailX * 18 - tailY * 18, drawY + tailY * 18 + tailX * 18);
        context.closePath();
        context.fill();

        context.globalAlpha = 0.58;
        context.fillStyle = "#ff4d16";
        for (let i = 0; i < 7; i += 1) {
          const distance = 38 + i * (18 + gear * 4);
          const spread = Math.sin(this.spin * 0.3 + i * 2.1) * (12 + i * 2);
          context.beginPath();
          context.arc(
            this.x + tailX * distance + tailY * spread,
            drawY + tailY * distance - tailX * spread,
            8 + gear * 2 + i * 1.4,
            0,
            Math.PI * 2
          );
          context.fill();
        }

        context.globalAlpha = 0.72;
        context.strokeStyle = "#fff06a";
        context.lineWidth = 4 + intensity * 5;
        context.beginPath();
        context.moveTo(this.x + tailX * 22, drawY + tailY * 22);
        context.lineTo(this.x + tailX * (118 + intensity * 78), drawY + tailY * (118 + intensity * 78));
        context.stroke();
      }
      if (this.specialShotType === "lightning") {
        context.globalAlpha = 0.92;
        context.fillStyle = "#f5e51c";
        context.strokeStyle = "#fff9a8";
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(this.x + tailX * 10, drawY + tailY * 10);
        context.lineTo(this.x + tailX * 92 + tailY * 40, drawY + tailY * 92 - tailX * 40);
        context.lineTo(this.x + tailX * 70 + tailY * 8, drawY + tailY * 70 - tailX * 8);
        context.lineTo(this.x + tailX * 180 + tailY * 58, drawY + tailY * 180 - tailX * 58);
        context.lineTo(this.x + tailX * 120 - tailY * 6, drawY + tailY * 120 + tailX * 6);
        context.lineTo(this.x + tailX * 250 - tailY * 44, drawY + tailY * 250 + tailX * 44);
        context.lineTo(this.x + tailX * 132 - tailY * 8, drawY + tailY * 132 + tailX * 8);
        context.lineTo(this.x + tailX * 154 - tailY * 40, drawY + tailY * 154 + tailX * 40);
        context.closePath();
        context.fill();
        context.stroke();
      }
      if (this.specialShotType === "soul") {
        context.globalAlpha = 0.8;
        context.strokeStyle = "#ffe3f3";
        context.lineWidth = 5 + intensity * 5;
        for (let i = 0; i < 3; i += 1) {
          const offset = (i - 1) * 18;
          context.beginPath();
          context.moveTo(this.x + tailX * 12 + tailY * offset, drawY + tailY * 12 - tailX * offset);
          context.bezierCurveTo(
            this.x + tailX * 55 + tailY * (offset + 18),
            drawY + tailY * 55 - tailX * (offset + 18),
            this.x + tailX * 95 + tailY * (offset - 18),
            drawY + tailY * 95 - tailX * (offset - 18),
            this.x + tailX * 142 + tailY * offset,
            drawY + tailY * 142 - tailX * offset
          );
          context.stroke();
        }
      }
      if (this.specialShotType === "tsutenkaku" && this.tsutenkakuPhase === "dive") {
        context.globalAlpha = 0.92;
        context.shadowColor = "#ffd83d";
        context.shadowBlur = 18 + intensity * 18;
        context.strokeStyle = "#fff06a";
        context.lineWidth = 8 + intensity * 7;
        context.beginPath();
        context.moveTo(this.x, drawY - 28);
        context.lineTo(this.x, drawY - 210 - intensity * 110);
        context.stroke();
        context.shadowBlur = 0;
        context.fillStyle = "rgba(255,216,61,0.58)";
        context.beginPath();
        context.arc(this.x, drawY, 25 + intensity * 21, 0, Math.PI * 2);
        context.fill();
      }
      context.strokeStyle = "rgba(255,255,255,0.72)";
      context.lineWidth = 3 + intensity * 3;
      context.beginPath();
      context.moveTo(this.x + tailX * 12, drawY + tailY * 12);
      context.lineTo(this.x + tailX * (54 + intensity * 42), drawY + tailY * (54 + intensity * 42));
      context.stroke();
      context.restore();
    }

    if (this.counterShot) {
      const velocity = Math.hypot(this.vx, this.vy) || 1;
      const tailX = -this.vx / velocity;
      const tailY = -this.vy / velocity;
      const sideX = -tailY;
      const sideY = tailX;
      const counterPower = Math.max(1, Math.min(2.5, this.counterIntensity || 1));
      const pulse = 0.86 + Math.sin(this.spin * 1.8) * 0.12;
      context.save();
      context.globalCompositeOperation = "lighter";
      context.lineCap = "round";
      context.globalAlpha = 0.48;
      context.strokeStyle = "#1655d8";
      context.lineWidth = 28 + counterPower * 4;
      context.beginPath();
      context.moveTo(this.x + tailX * 18, drawY + tailY * 18);
      context.lineTo(this.x + tailX * (166 + counterPower * 18), drawY + tailY * (166 + counterPower * 18));
      context.stroke();
      context.globalAlpha = 0.76;
      context.strokeStyle = "#67dfff";
      context.lineWidth = 17 + counterPower * 2;
      context.beginPath();
      context.moveTo(this.x + tailX * 14, drawY + tailY * 14);
      context.lineTo(this.x + tailX * (146 + counterPower * 14), drawY + tailY * (146 + counterPower * 14));
      context.stroke();
      context.globalAlpha = 0.96;
      context.strokeStyle = "#ffffff";
      context.lineWidth = 7;
      context.beginPath();
      context.moveTo(this.x + tailX * 8, drawY + tailY * 8);
      context.lineTo(this.x + tailX * (118 + counterPower * 10), drawY + tailY * (118 + counterPower * 10));
      context.stroke();
      context.globalAlpha = 0.88;
      context.strokeStyle = "#ffd83d";
      context.lineWidth = 5;
      context.beginPath();
      for (let index = 0; index <= 12; index += 1) {
        const distance = 12 + index * 13;
        const wave = Math.sin(this.spin * 0.75 + index * 0.9) * (15 + counterPower * 2);
        const px = this.x + tailX * distance + sideX * wave;
        const py = drawY + tailY * distance + sideY * wave;
        if (index === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.stroke();
      for (let index = 1; index <= 3; index += 1) {
        const distance = 38 + index * 38;
        const ringX = this.x + tailX * distance;
        const ringY = drawY + tailY * distance;
        context.globalAlpha = 0.48 - index * 0.08;
        context.strokeStyle = index % 2 === 0 ? "#ffffff" : "#8ffcff";
        context.lineWidth = 4;
        context.beginPath();
        context.ellipse(ringX, ringY, 10 + index * 5, 30 + index * 7, Math.atan2(this.vy, this.vx), 0, Math.PI * 2);
        context.stroke();
      }
      context.fillStyle = "#dffcff";
      for (let index = 0; index < 9; index += 1) {
        const distance = 28 + index * 17;
        const scatter = Math.sin(this.spin + index * 2.13) * 26;
        context.globalAlpha = 0.34 + (index % 3) * 0.14;
        context.beginPath();
        context.arc(
          this.x + tailX * distance + sideX * scatter,
          drawY + tailY * distance + sideY * scatter,
          3 + index % 3,
          0,
          Math.PI * 2
        );
        context.fill();
      }
      context.globalAlpha = 0.7;
      context.strokeStyle = "#bdf8ff";
      context.lineWidth = 6 + counterPower;
      context.beginPath();
      context.arc(this.x, drawY, (this.radius + 14 + counterPower * 3) * pulse, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    }

    context.translate(this.x, drawY);
    if (shotEffect > 0) {
      const intensity = Math.min(1, shotEffect / 0.55);
      const specialColor = this.getSpecialColor();
      context.save();
      context.globalAlpha = 0.25 + intensity * 0.28;
      context.strokeStyle = this.counterShot ? "#bdf8ff" : this.specialShot ? specialColor : intensity > 0.65 ? "#fff46a" : "#ff8f3a";
      context.lineWidth = 4 + intensity * 5;
      context.beginPath();
      context.arc(0, 0, this.radius + 5 + intensity * 8, 0, Math.PI * 2);
      context.stroke();
      if (this.specialShotType === "lightning") {
        context.globalAlpha = 0.72;
        context.fillStyle = "#f5e51c";
        context.strokeStyle = "#fff9a8";
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(-this.radius * 0.45, -this.radius * 1.55);
        context.lineTo(this.radius * 0.52, -this.radius * 0.18);
        context.lineTo(this.radius * 0.08, -this.radius * 0.1);
        context.lineTo(this.radius * 0.9, this.radius * 1.35);
        context.lineTo(-this.radius * 0.12, this.radius * 0.2);
        context.lineTo(this.radius * 0.26, this.radius * 0.1);
        context.closePath();
        context.fill();
        context.stroke();
      }
      if (this.specialShotType === "soul") {
        context.globalAlpha = 0.78;
        context.strokeStyle = "#ffe3f3";
        context.lineWidth = 4;
        for (let i = 0; i < 3; i += 1) {
          context.beginPath();
          context.arc(0, 0, this.radius + 14 + i * 12, this.spin + i, this.spin + i + Math.PI * 1.25);
          context.stroke();
        }
        context.fillStyle = "rgba(255,190,225,0.3)";
        context.beginPath();
        context.arc(0, 0, this.radius + 18, 0, Math.PI * 2);
        context.fill();
      }
      if (this.specialShotType === "tsutenkaku") {
        context.globalAlpha = 0.78;
        context.strokeStyle = "#fff4a8";
        context.lineWidth = 5;
        context.beginPath();
        context.arc(0, 0, this.radius + 14 + Math.sin(this.spin) * 4, 0, Math.PI * 2);
        context.stroke();
        context.fillStyle = "rgba(255,216,61,0.34)";
        context.beginPath();
        context.arc(0, 0, this.radius + 20, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    }
    context.rotate(this.spin);
    if (this.specialShotType === "soul") {
      const orb = context.createRadialGradient(-this.radius * 0.35, -this.radius * 0.35, 4, 0, 0, this.radius);
      orb.addColorStop(0, "#ffffff");
      orb.addColorStop(0.45, "#ffd1e8");
      orb.addColorStop(1, "#ff78b7");
      context.fillStyle = orb;
      context.beginPath();
      context.arc(0, 0, this.radius * 1.08, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#fff0f8";
      context.lineWidth = 4;
      context.beginPath();
      context.arc(0, 0, this.radius * 1.22, 0, Math.PI * 2);
      context.stroke();
      context.restore();
      if (debugMode) {
        context.strokeStyle = "rgba(255,0,0,0.7)";
        context.lineWidth = 2;
        context.beginPath();
        context.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
        context.stroke();
      }
      return;
    }
    if (this.specialShotType === "boomerang") {
      context.rotate(Math.PI * 0.15);
      context.fillStyle = "#ffd84f";
      context.strokeStyle = "#936428";
      context.lineWidth = 5;
      context.beginPath();
      context.arc(0, 0, this.radius * 1.45, 0.2, Math.PI * 1.35, false);
      context.arc(-this.radius * 0.1, -this.radius * 0.1, this.radius * 0.82, Math.PI * 1.35, 0.2, true);
      context.closePath();
      context.fill();
      context.stroke();
      context.fillStyle = "#fff29a";
      context.beginPath();
      context.arc(-this.radius * 0.1, -this.radius * 0.08, this.radius * 0.62, 0.25, Math.PI * 1.25, false);
      context.strokeStyle = "rgba(255,255,255,0.55)";
      context.lineWidth = 3;
      context.stroke();
      context.restore();
      if (debugMode) {
        context.strokeStyle = "rgba(255,0,0,0.7)";
        context.lineWidth = 2;
        context.beginPath();
        context.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
        context.stroke();
      }
      return;
    }
    if (this.specialShotType === "iron") {
      context.fillStyle = "#4d525b";
      context.strokeStyle = "#252a31";
      context.lineWidth = 5;
      const spikes = 14;
      context.beginPath();
      for (let i = 0; i < spikes * 2; i += 1) {
        const angle = (Math.PI * 2 * i) / (spikes * 2);
        const r = i % 2 === 0 ? this.radius * 1.24 : this.radius * 0.96;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.fill();
      context.stroke();
      context.fillStyle = "#747b86";
      context.beginPath();
      context.arc(-this.radius * 0.18, -this.radius * 0.22, this.radius * 0.22, 0, Math.PI * 2);
      context.fill();
      context.restore();
      if (debugMode) {
        context.strokeStyle = "rgba(255,0,0,0.7)";
        context.lineWidth = 2;
        context.beginPath();
        context.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
        context.stroke();
      }
      return;
    }
    if (this.counterShot) {
      const core = context.createRadialGradient(-this.radius * 0.25, -this.radius * 0.3, 2, 0, 0, this.radius * 1.2);
      core.addColorStop(0, "#ffffff");
      core.addColorStop(0.38, "#e8fdff");
      core.addColorStop(0.72, "#67dfff");
      core.addColorStop(1, "#1655d8");
      context.fillStyle = core;
      context.beginPath();
      context.arc(0, 0, this.radius * 1.04, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#fff36a";
      context.lineWidth = 4;
      context.beginPath();
      context.arc(0, 0, this.radius * 0.92, -1.12, 1.12);
      context.arc(0, 0, this.radius * 0.92, Math.PI - 1.12, Math.PI + 1.12);
      context.moveTo(-this.radius, 0);
      context.lineTo(this.radius, 0);
      context.stroke();
      context.restore();
      if (debugMode) {
        context.strokeStyle = "rgba(255,0,0,0.7)";
        context.lineWidth = 2;
        context.beginPath();
        context.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
        context.stroke();
      }
      return;
    }
    context.fillStyle = this.specialShotType === "iron" ? "#555a62" : "#f06a32";
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = this.specialShotType === "iron" ? "#2f3339" : "#8e2f22";
    context.lineWidth = 4;
    context.beginPath();
    context.arc(0, 0, this.radius * 0.9, -1.1, 1.1);
    context.arc(0, 0, this.radius * 0.9, Math.PI - 1.1, Math.PI + 1.1);
    context.moveTo(-this.radius, 0);
    context.lineTo(this.radius, 0);
    context.stroke();
    context.restore();

    if (debugMode) {
      context.strokeStyle = "rgba(255,0,0,0.7)";
      context.lineWidth = 2;
      context.beginPath();
      context.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
      context.stroke();
    }
  }

  drawTsutenkakuLandingMarker(context) {
    const warningProgress = this.tsutenkakuPhase === "warning"
      ? Math.min(1, this.tsutenkakuElapsed / Math.max(0.01, this.tsutenkakuWarningDuration))
      : 1;
    const pulse = 0.5 + Math.sin(performance.now() / 95) * 0.5;
    const radius = 88 + pulse * 22;

    context.save();
    context.translate(this.tsutenkakuTargetX, this.tsutenkakuTargetY + 8);
    context.globalAlpha = 0.56 + pulse * 0.26;
    context.fillStyle = "rgba(255, 62, 44, 0.24)";
    context.strokeStyle = warningProgress > 0.72 ? "#fff06a" : "#ff4a38";
    context.lineWidth = 10;
    context.shadowColor = "#ffcf3d";
    context.shadowBlur = 18 + pulse * 12;
    context.beginPath();
    context.ellipse(0, 0, radius, radius * 0.42, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.shadowBlur = 0;
    context.globalAlpha = 0.92;
    context.strokeStyle = "#fff8bd";
    context.lineWidth = 8;
    context.beginPath();
    context.moveTo(-radius * 0.58, 0);
    context.lineTo(radius * 0.58, 0);
    context.moveTo(0, -radius * 0.25);
    context.lineTo(0, radius * 0.25);
    context.stroke();

    context.fillStyle = "#ff3f2f";
    context.font = "bold 62px Meiryo, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "bottom";
    context.fillText("!", 0, -radius * 0.38);
    context.restore();
  }

  drawKiaiStraight(context, debugMode) {
    const drawY = this.y - this.z;
    const speed = Math.hypot(this.vx, this.vy) || 1;
    const directionX = this.vx / speed;
    const directionY = this.vy / speed;
    const tailX = -directionX;
    const tailY = -directionY;
    const pulse = 0.5 + Math.sin(performance.now() / 48) * 0.5;
    const auraRadius = this.radius * (1.36 + pulse * 0.18);

    context.save();
    context.fillStyle = "rgba(64, 38, 18, 0.28)";
    context.beginPath();
    context.ellipse(this.x + 3, this.y + 10, this.radius * 1.16, this.radius * 0.4, 0, 0, Math.PI * 2);
    context.fill();

    context.globalCompositeOperation = "lighter";
    context.lineCap = "round";
    const trailLength = 150 + pulse * 34;
    const drawTrail = (color, width, lengthScale, alpha) => {
      context.globalAlpha = alpha;
      context.strokeStyle = color;
      context.lineWidth = width;
      context.beginPath();
      context.moveTo(this.x + tailX * 8, drawY + tailY * 8);
      context.lineTo(
        this.x + tailX * trailLength * lengthScale,
        drawY + tailY * trailLength * lengthScale
      );
      context.stroke();
    };
    drawTrail("#ef3f24", this.radius * 1.25, 1, 0.4);
    drawTrail("#ffc52f", this.radius * 0.72, 0.9, 0.68);
    drawTrail("#ffffff", this.radius * 0.24, 0.82, 0.94);

    context.globalAlpha = 0.78;
    context.strokeStyle = "#fff0a0";
    context.lineWidth = 5;
    for (let index = 0; index < 12; index += 1) {
      const angle = this.spin * 0.55 + index * Math.PI / 6;
      const inner = auraRadius * 1.18;
      const outer = inner + 18 + (index % 3) * 8;
      context.beginPath();
      context.moveTo(this.x + Math.cos(angle) * inner, drawY + Math.sin(angle) * inner);
      context.lineTo(this.x + Math.cos(angle) * outer, drawY + Math.sin(angle) * outer);
      context.stroke();
    }

    context.translate(this.x, drawY);
    const aura = context.createRadialGradient(-this.radius * 0.2, -this.radius * 0.24, 3, 0, 0, auraRadius);
    aura.addColorStop(0, "rgba(255,255,255,1)");
    aura.addColorStop(0.34, "rgba(255,238,103,0.96)");
    aura.addColorStop(0.7, "rgba(255,107,36,0.7)");
    aura.addColorStop(1, "rgba(227,42,27,0)");
    context.globalAlpha = 0.94;
    context.fillStyle = aura;
    context.beginPath();
    context.arc(0, 0, auraRadius, 0, Math.PI * 2);
    context.fill();

    context.rotate(this.spin);
    context.globalAlpha = 0.96;
    context.fillStyle = "#fffdf1";
    context.beginPath();
    context.arc(0, 0, this.radius * 0.72, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#ffd83d";
    context.lineWidth = 7;
    context.beginPath();
    context.arc(0, 0, this.radius * 0.93, 0, Math.PI * 2);
    context.stroke();

    context.strokeStyle = "#fff8c4";
    context.lineWidth = 4;
    for (let index = 0; index < 3; index += 1) {
      const offset = (index - 1) * this.radius * 0.42;
      context.beginPath();
      context.ellipse(0, offset, this.radius * 1.28, this.radius * 0.34, index * 0.5, 0, Math.PI * 1.55);
      context.stroke();
    }
    context.restore();

    if (debugMode) {
      context.strokeStyle = "rgba(255,0,0,0.7)";
      context.lineWidth = 2;
      context.beginPath();
      context.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
      context.stroke();
    }
  }

  drawSlapShot(context, debugMode) {
    const drawY = this.y - this.z;
    const speed = Math.hypot(this.vx, this.vy) || 1;
    const directionX = this.vx / speed;
    const directionY = this.vy / speed;
    const angle = Math.atan2(this.vy, this.vx);
    const pulse = 0.5 + Math.sin(this.spin * 2.4) * 0.5;

    context.save();
    context.fillStyle = "rgba(40, 28, 16, 0.24)";
    context.beginPath();
    context.ellipse(this.x + 4, this.y + 10, this.radius * 1.28, this.radius * 0.4, 0, 0, Math.PI * 2);
    context.fill();

    context.globalAlpha = 0.34 + pulse * 0.18;
    context.strokeStyle = "#ff5a2a";
    context.lineCap = "round";
    for (let index = 0; index < 5; index += 1) {
      const side = (index - 2) * 15;
      const length = 105 + index * 13;
      context.lineWidth = 13 - index * 1.2;
      context.beginPath();
      context.moveTo(
        this.x - directionX * 24 - directionY * side,
        drawY - directionY * 24 + directionX * side
      );
      context.lineTo(
        this.x - directionX * length - directionY * side * 1.7,
        drawY - directionY * length + directionX * side * 1.7
      );
      context.stroke();
    }

    context.globalAlpha = 1;
    context.translate(this.x, drawY);
    context.rotate(angle);
    context.scale(1.5, 1.5);
    context.strokeStyle = "#9d3d2d";
    context.lineWidth = 6;
    context.fillStyle = "#ffd1a3";
    context.beginPath();
    context.moveTo(-62, -24);
    context.lineTo(-14, -34);
    context.lineTo(3, 34);
    context.lineTo(-58, 28);
    context.closePath();
    context.fill();
    context.stroke();

    const palm = context.createRadialGradient(8, -16, 6, 10, 2, 58);
    palm.addColorStop(0, "#ffe8cf");
    palm.addColorStop(0.62, "#ffd1a3");
    palm.addColorStop(1, "#e7a977");
    context.fillStyle = palm;
    context.beginPath();
    context.ellipse(12, 0, 42, 48, 0.08, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.strokeStyle = "#ffd1a3";
    context.lineWidth = 18;
    context.lineCap = "round";
    const fingers = [
      { x: 39, y: -35, length: 46 },
      { x: 45, y: -18, length: 58 },
      { x: 48, y: 0, length: 62 },
      { x: 44, y: 18, length: 55 },
      { x: 34, y: 34, length: 40 }
    ];
    for (const finger of fingers) {
      context.beginPath();
      context.moveTo(finger.x - 16, finger.y);
      context.lineTo(finger.length, finger.y);
      context.stroke();
    }
    context.strokeStyle = "#9d3d2d";
    context.lineWidth = 4;
    context.beginPath();
    context.arc(12, 2, 22, -1.1, 1.1);
    context.stroke();

    context.strokeStyle = "#fff2b5";
    context.lineWidth = 5;
    context.globalAlpha = 0.72;
    context.beginPath();
    context.arc(14, 0, 58 + pulse * 8, -1.05, 1.05);
    context.stroke();
    context.restore();

    if (debugMode) {
      context.strokeStyle = "rgba(255,0,0,0.7)";
      context.lineWidth = 2;
      context.beginPath();
      context.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
      context.stroke();
    }
  }

  drawLightningZigzagBall(context, debugMode) {
    const drawY = this.y - this.z;
    const pulse = 0.5 + Math.sin(this.spin * 1.7) * 0.5;
    context.save();
    context.lineJoin = "miter";
    context.lineCap = "square";

    if (this.lightningTrail.length > 1) {
      const traceTrail = () => {
        context.beginPath();
        context.moveTo(this.lightningTrail[0].x, this.lightningTrail[0].y);
        for (let i = 1; i < this.lightningTrail.length; i += 1) {
          context.lineTo(this.lightningTrail[i].x, this.lightningTrail[i].y);
        }
      };
      context.globalAlpha = 0.5;
      context.strokeStyle = "#42dfff";
      context.lineWidth = 34;
      traceTrail();
      context.stroke();
      context.globalAlpha = 0.96;
      context.strokeStyle = "#ffd400";
      context.lineWidth = 20;
      traceTrail();
      context.stroke();
      context.globalAlpha = 1;
      context.strokeStyle = "#fffbd1";
      context.lineWidth = 6;
      traceTrail();
      context.stroke();
    }

    context.globalCompositeOperation = "lighter";
    context.globalAlpha = 0.34 + pulse * 0.28;
    context.fillStyle = "#42dfff";
    context.beginPath();
    context.arc(this.x, drawY, this.radius * (1.8 + pulse * 0.28), 0, Math.PI * 2);
    context.fill();
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 1;
    context.fillStyle = "#f06a32";
    context.strokeStyle = "#ffd400";
    context.lineWidth = 8;
    context.beginPath();
    context.arc(this.x, drawY, this.radius * 1.05, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.strokeStyle = "#fffbd1";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(this.x, drawY, this.radius * 0.82, 0, Math.PI * 2);
    context.stroke();

    for (let i = 0; i < 5; i += 1) {
      const angle = this.spin + i * Math.PI * 0.4;
      const innerX = this.x + Math.cos(angle) * this.radius * 1.1;
      const innerY = drawY + Math.sin(angle) * this.radius * 1.1;
      context.strokeStyle = i % 2 === 0 ? "#ffd400" : "#63efff";
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(innerX, innerY);
      context.lineTo(
        this.x + Math.cos(angle + 0.22) * this.radius * 1.75,
        drawY + Math.sin(angle + 0.22) * this.radius * 1.75
      );
      context.lineTo(
        this.x + Math.cos(angle - 0.12) * this.radius * 2.25,
        drawY + Math.sin(angle - 0.12) * this.radius * 2.25
      );
      context.stroke();
    }

    context.restore();
    if (debugMode) {
      context.strokeStyle = "rgba(255,0,0,0.7)";
      context.lineWidth = 2;
      context.beginPath();
      context.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
      context.stroke();
    }
  }
}
