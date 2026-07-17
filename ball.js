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

    this.x += this.vx * delta;
    this.y += this.vy * delta;
    this.z += this.vz * delta;
    this.spin += Math.hypot(this.vx, this.vy) * delta * 0.025;

    if (this.isFlying) {
      if (this.kind !== "pass") {
        this.vx *= Math.pow(0.994, delta * 60);
        this.vy *= Math.pow(0.994, delta * 60);
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
    player.hasBall = true;
  }

  launch(actor, target, kind, aimVector) {
    if ((kind !== "shoot" && !target) || actor.defeated) return false;

    actor.hasBall = false;
    this.owner = null;
    this.thrower = actor;
    this.target = target;
    this.kind = kind;
    this.power = kind === "shoot" ? actor.throwPower : 0;
    this.isFlying = true;
    this.isLoose = false;
    this.catchable = true;
    this.hasBounced = false;
    this.x = actor.x + actor.facing * 42;
    this.y = actor.y - 42;
    this.z = actor.jumpZ + 28;
    this.passTime = 0;
    this.passDuration = 0;

    if (kind === "pass") {
      this.launchPassArc(actor, target);
      return true;
    }

    const leadX = kind === "shoot" && target ? target.vx * 0.06 : 0;
    const leadY = kind === "shoot" && target ? target.vy * 0.06 : 0;
    const targetX = target ? target.x + leadX : this.x + aimVector.x * 900;
    const targetY = target ? target.y - 34 + leadY : this.y + aimVector.y * 900;
    const aimNudge = target && kind !== "shoot" ? 22 : 0;
    const dx = targetX - this.x + aimVector.x * aimNudge;
    const dy = targetY - this.y + aimVector.y * aimNudge;
    const length = Math.hypot(dx, dy) || 1;
    const speed = kind === "shoot" ? this.config.shootSpeed : this.config.passSpeed;
    const moveBonus = kind === "shoot" && target ? this.config.moveBonus * 0.15 : kind === "shoot" ? this.config.moveBonus : this.config.moveBonus * 0.15;

    this.vx = (dx / length) * speed + actor.vx * moveBonus;
    this.vy = (dy / length) * speed + actor.vy * moveBonus;
    this.vz = kind === "shoot" ? 120 + actor.jumpZ * 0.3 : 650 + actor.jumpZ * 0.15;
    return true;
  }

  launchPassArc(actor, target) {
    const catchPoint = this.getPassCatchPoint(target);
    const distance = Math.hypot(catchPoint.x - this.x, catchPoint.y - this.y);
    this.passDuration = Math.max(0.72, Math.min(1.28, distance / Math.max(1, this.config.passSpeed)));
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
      z: target.jumpZ + 96
    };
  }

  bounceFromHit(direction) {
    this.owner = null;
    this.thrower = null;
    this.target = null;
    this.kind = "loose";
    this.isFlying = false;
    this.isLoose = true;
    this.catchable = false;
    this.hasBounced = true;
    this.vx = direction * this.config.hitBounceX;
    this.vy = (Math.random() - 0.5) * this.config.hitBounceY;
    this.vz = 180;
    this.passTime = 0;
    this.passDuration = 0;
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
  }

  canBePickedUpBy(player, distance) {
    return this.isLoose && !this.owner && this.z < 32 && Math.hypot(this.x - player.x, this.y - player.y) <= distance + 22;
  }

  draw(context, debugMode) {
    if (this.owner) return;

    const drawY = this.y - this.z;
    context.save();
    context.fillStyle = "rgba(40, 28, 16, 0.24)";
    context.beginPath();
    context.ellipse(this.x + 3, this.y + 10, this.radius * 1.05, this.radius * 0.38, 0, 0, Math.PI * 2);
    context.fill();

    context.translate(this.x, drawY);
    context.rotate(this.spin);
    context.fillStyle = "#f06a32";
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#8e2f22";
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
