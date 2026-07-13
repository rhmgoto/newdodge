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
  }

  update(delta, bounds) {
    if (this.owner) {
      this.x = this.owner.x + this.owner.facing * 32;
      this.y = this.owner.y - 38;
      this.z = this.owner.jumpZ + 18;
      return;
    }

    this.x += this.vx * delta;
    this.y += this.vy * delta;
    this.z += this.vz * delta;
    this.spin += Math.hypot(this.vx, this.vy) * delta * 0.025;

    if (this.isFlying) {
      this.vx *= Math.pow(0.994, delta * 60);
      this.vy *= Math.pow(0.994, delta * 60);
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
    player.hasBall = true;
  }

  launch(actor, target, kind, aimVector) {
    if (!target || actor.defeated) return false;

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

    const leadX = kind === "shoot" ? target.vx * 0.12 : 0;
    const leadY = kind === "shoot" ? target.vy * 0.12 : 0;
    const dx = target.x + leadX - this.x + aimVector.x * 22;
    const dy = target.y - 34 + leadY - this.y + aimVector.y * 22;
    const length = Math.hypot(dx, dy) || 1;
    const speed = kind === "shoot" ? this.config.shootSpeed : this.config.passSpeed;

    this.vx = (dx / length) * speed + actor.vx * this.config.moveBonus;
    this.vy = (dy / length) * speed + actor.vy * this.config.moveBonus;
    this.vz = kind === "shoot" ? 120 + actor.jumpZ * 0.3 : 420 + actor.jumpZ * 0.15;
    return true;
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
