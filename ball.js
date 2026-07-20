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
    this.baseRadius = this.config.radius;
    this.travelDistance = 0;
    this.returning = false;
    this.boomerangCurveSign = 1;
    this.boomerangStartDistance = 900;
    this.boostElapsed = 0;
    this.hitPlayerIds = new Set();
    this.isFlying = false;
    this.isLoose = true;
    this.catchable = false;
    this.hasBounced = false;
    this.spin = 0;
    this.passTime = 0;
    this.passDuration = 0;
  }

  update(delta, bounds) {
    if (this.owner) {
      this.x = this.owner.x + this.owner.facing * 32;
      this.y = this.owner.y - 38;
      this.z = this.owner.jumpZ + 18;
      return;
    }

    if (this.isFlying && this.kind === "pass" && this.target && !this.target.defeated) {
      this.passTime += delta;
      this.adjustPassTrajectory(delta);
    }

    this.updateSpecialShot(delta);

    const lastX = this.x;
    const lastY = this.y;
    this.x += this.vx * delta;
    this.y += this.vy * delta;
    this.travelDistance += Math.hypot(this.x - lastX, this.y - lastY);
    this.z += this.vz * delta;
    this.spin += Math.hypot(this.vx, this.vy) * delta * 0.025;

    if (this.isFlying) {
      if (this.kind !== "pass") {
        const airDrag = this.specialShotType ? 0.994 : 0.996;
        this.vx *= Math.pow(airDrag, delta * 60);
        this.vy *= Math.pow(airDrag, delta * 60);
      }
      this.vz -= this.config.gravity * delta;
    } else {
      this.vx *= Math.pow(0.80, delta * 60);
      this.vy *= Math.pow(0.80, delta * 60);
      this.vz -= this.config.gravity * delta;
    }

    if (this.z <= 0) {
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
    this.radius = this.baseRadius;
    this.travelDistance = 0;
    this.returning = false;
    this.boomerangCurveSign = 1;
    this.boomerangStartDistance = 900;
    this.boostElapsed = 0;
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
    const powerMultiplier = kind === "shoot" ? throwMultiplier : 1;
    this.power = kind === "shoot" ? actor.throwPower * powerMultiplier : 0;
    this.isFlying = true;
    this.isLoose = false;
    this.catchable = true;
    this.hasBounced = false;
    this.x = actor.x + actor.facing * 42;
    this.y = actor.y - 42;
    this.z = actor.jumpZ + 28;
    this.passTime = 0;
    this.passDuration = 0;
    this.radius = this.baseRadius;
    if (this.specialShotType === "iron") {
      this.radius = this.baseRadius * 1.2;
    }
    this.travelDistance = 0;
    this.returning = false;
    this.boomerangCurveSign = aimVector?.y >= 0 ? 1 : -1;
    this.boomerangStartDistance = target ? Math.hypot(target.x - actor.x, target.y - actor.y) : 900;
    this.boostElapsed = 0;
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
    const shootBaseSpeed = kind === "shoot" && this.specialShotType
      ? this.config.specialShootSpeed || this.config.shootSpeed
      : this.config.shootSpeed;
    const speed = kind === "shoot" ? shootBaseSpeed * speedRatio : this.config.passSpeed;
    const moveBonus = kind === "shoot" && target ? this.config.moveBonus * 0.05 : kind === "shoot" ? this.config.moveBonus : this.config.moveBonus * 0.15;

    this.vx = (dx / length) * speed + actor.vx * moveBonus;
    this.vy = (dy / length) * speed + actor.vy * moveBonus;
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
    } else {
      this.vz = kind === "shoot"
        ? 470 + Math.max(0, throwMultiplier - 0.7) * (this.specialShotType ? 120 : 82) + actor.jumpZ * 0.12
        : 650 + actor.jumpZ * 0.15;
      if (this.specialShotType === "boost" && kind === "shoot") {
        this.vz = Math.max(160, this.vz * 0.45);
      }
    }
    return true;
  }

  updateSpecialShot(delta) {
    if (!this.isFlying || this.kind !== "shoot" || !this.specialShotType) return;
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
    if (this.specialShotType === "boomerang" && this.thrower && !this.thrower.defeated) {
      if (!this.returning) {
        const speed = Math.hypot(this.vx, this.vy) || 1;
        const sideForce = Math.min(360, 130 + this.travelDistance * 0.22) * this.boomerangCurveSign;
        const sideX = -this.vy / speed;
        const sideY = this.vx / speed;
        this.vx += sideX * sideForce * delta;
        this.vy += sideY * sideForce * delta;
      }
      const passedTarget = this.target && ((this.vx >= 0 && this.x > this.target.x + 170) || (this.vx < 0 && this.x < this.target.x - 170));
      if (!this.returning && (passedTarget || this.travelDistance > 1250)) {
        this.returning = true;
        this.target = this.thrower;
        this.hitPlayerIds.clear();
      }
      if (this.returning) {
        const dx = this.thrower.x - this.x;
        const dy = this.thrower.y - 42 - this.y;
        const length = Math.hypot(dx, dy) || 1;
        const speed = Math.max(760, Math.hypot(this.vx, this.vy));
        const arcStrength = Math.min(1120, 640 + length * 0.68) * this.boomerangCurveSign;
        const desiredX = (dx / length) * speed + (-dy / length) * arcStrength;
        const desiredY = (dy / length) * speed + (dx / length) * arcStrength;
        const turn = Math.min(1, delta * 4.5);
        this.vx += (desiredX - this.vx) * turn;
        this.vy += (desiredY - this.vy) * turn;
        if (Math.hypot(dx, dy) < this.boomerangStartDistance * 0.72) {
          this.drop();
          return;
        }
      }
    }
  }

  getShootSpeedRatio(throwMultiplier = 1) {
    const t = Math.max(0, Math.min(1, ((throwMultiplier || 0.7) - 0.7) / 1.45));
    if (!this.specialShotType) {
      return 1 + t * 0.24;
    }
    if (this.specialShotType === "boost") {
      return 0.35;
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
    const speedBoost = outfieldPass ? 1.3 : 1;
    const arcBoost = outfieldPass ? 2.84 : 2;
    catchPoint.z += (208 + Math.max(0, passMultiplier - 1) * 338) * arcBoost;
    this.passDuration = Math.max(0.62, Math.min(1.95, distance / Math.max(1, this.config.passSpeed * speedBoost * (0.95 + passMultiplier * 0.24))));
    this.vx = (catchPoint.x - this.x) / this.passDuration + actor.vx * this.config.moveBonus * 0.08;
    this.vy = (catchPoint.y - this.y) / this.passDuration + actor.vy * this.config.moveBonus * 0.08;
    this.vz = (catchPoint.z - this.z + 0.5 * this.config.gravity * this.passDuration * this.passDuration) / this.passDuration;
  }

  adjustPassTrajectory(delta) {
    const remaining = Math.max(0.08, this.passDuration - this.passTime);
    const catchPoint = this.getPassCatchPoint(this.target);
    const desiredVx = (catchPoint.x - this.x) / remaining;
    const desiredVy = (catchPoint.y - this.y) / remaining;
    const desiredVz = (catchPoint.z - this.z + 0.5 * this.config.gravity * remaining * remaining) / remaining;
    const follow = Math.min(1, delta * 5.5);
    this.vx += (desiredVx - this.vx) * follow;
    this.vy += (desiredVy - this.vy) * follow;
    this.vz += (desiredVz - this.vz) * follow;
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
    this.hitPlayerIds.clear();
  }

  getSpecialColor() {
    if (this.specialShotType === "boost") return "#ff6b1a";
    if (this.specialShotType === "lightning") return "#66f6ff";
    if (this.specialShotType === "iron") return "#7e8592";
    if (this.specialShotType === "boomerang") return "#ffe36a";
    if (this.specialShotType === "soul") return "#bdf8ff";
    return "#ffe46a";
  }

  canBePickedUpBy(player, distance) {
    if (!this.isLoose || this.owner || this.z >= 78) return false;
    const rollingBonus = !this.isFlying || this.hasBounced ? 78 : 0;
    const catchBonus = player.catchTimer > 0 ? 72 : 0;
    return Math.hypot(this.x - player.x, this.y - player.y) <= distance + rollingBonus + catchBonus + 26;
  }

  draw(context, debugMode) {
    if (this.owner) return;

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
      context.strokeStyle = this.specialShot ? specialColor : intensity > 0.65 ? "#fff46a" : "#ffb44a";
      context.lineWidth = 8 + intensity * 8;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(this.x + tailX * 20, drawY + tailY * 20);
      context.lineTo(this.x + tailX * (82 + intensity * 62), drawY + tailY * (82 + intensity * 62));
      context.stroke();
      if (this.specialShotType === "boost") {
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
        context.strokeStyle = "#dffcff";
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
      context.strokeStyle = "rgba(255,255,255,0.72)";
      context.lineWidth = 3 + intensity * 3;
      context.beginPath();
      context.moveTo(this.x + tailX * 12, drawY + tailY * 12);
      context.lineTo(this.x + tailX * (54 + intensity * 42), drawY + tailY * (54 + intensity * 42));
      context.stroke();
      context.restore();
    }

    context.translate(this.x, drawY);
    if (shotEffect > 0) {
      const intensity = Math.min(1, shotEffect / 0.55);
      const specialColor = this.getSpecialColor();
      context.save();
      context.globalAlpha = 0.25 + intensity * 0.28;
      context.strokeStyle = this.specialShot ? specialColor : intensity > 0.65 ? "#fff46a" : "#ff8f3a";
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
        context.strokeStyle = "#dffcff";
        context.lineWidth = 4;
        for (let i = 0; i < 3; i += 1) {
          context.beginPath();
          context.arc(0, 0, this.radius + 14 + i * 12, this.spin + i, this.spin + i + Math.PI * 1.25);
          context.stroke();
        }
        context.fillStyle = "rgba(189,248,255,0.28)";
        context.beginPath();
        context.arc(0, 0, this.radius + 18, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    }
    context.rotate(this.spin);
    if (this.specialShotType === "soul") {
      const orb = context.createRadialGradient(-this.radius * 0.35, -this.radius * 0.35, 4, 0, 0, this.radius);
      orb.addColorStop(0, "#ffffff");
      orb.addColorStop(0.45, "#bdf8ff");
      orb.addColorStop(1, "#4eb7ff");
      context.fillStyle = orb;
      context.beginPath();
      context.arc(0, 0, this.radius * 1.08, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#eaffff";
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
}
