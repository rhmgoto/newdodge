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
    this.radius = options.radius || 24;
    this.maxHp = options.maxHp || 100;
    this.hp = this.maxHp;
    this.speed = options.speed || 230;
    this.throwPower = options.throwPower || 20;
    this.uniformColor = options.uniformColor;
    this.trimColor = options.trimColor || "#ffffff";
    this.faceColor = options.faceColor || "#ffd4a3";
    this.hairColor = options.hairColor || "#3d2a1f";
    this.hasBall = false;
    this.facing = this.team === "left" ? 1 : -1;
    this.isDamaged = false;
    this.invincibleTime = 0;
    this.state = "idle";
    this.vx = 0;
    this.vy = 0;
    this.knockbackX = 0;
    this.knockbackY = 0;
    this.catchTimer = 0;
    this.throwTimer = 0;
    this.throwLockTimer = 0;
    this.crouchTimer = 0;
    this.downTimer = 0;
    this.leaveTimer = 0;
    this.jumpZ = 0;
    this.jumpVelocity = 0;
    this.defeated = false;
  }

  update(delta, controls, area, config) {
    const airborneBeforeMove = this.jumpZ > 0 || this.jumpVelocity > 0;
    const startedInsideArea = this.isInsideArea(area);
    this.invincibleTime = Math.max(0, this.invincibleTime - delta);
    this.catchTimer = Math.max(0, this.catchTimer - delta);
    this.throwTimer = Math.max(0, this.throwTimer - delta);
    this.throwLockTimer = Math.max(0, this.throwLockTimer - delta);
    this.crouchTimer = Math.max(0, this.crouchTimer - delta);

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

    const moveX = controls.moveX || 0;
    const moveY = controls.moveY || 0;
    const length = Math.hypot(moveX, moveY) || 1;
    const crouchSlow = this.crouchTimer > 0 ? 0.35 : 1;
    const speed = this.speed * (controls.dash ? 1.35 : 1) * crouchSlow;

    this.vx = (moveX / length) * speed;
    this.vy = (moveY / length) * speed;

    if (Math.abs(moveX) > 0.08) {
      this.facing = moveX > 0 ? 1 : -1;
    }

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
    } else if (this.crouchTimer > 0) {
      this.state = "crouching";
    } else if (this.hasBall) {
      this.state = "holding";
    } else if (Math.abs(moveX) > 0.05 || Math.abs(moveY) > 0.05) {
      this.state = "run";
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
    if (this.defeated || this.downTimer > 0 || this.jumpZ > 0) return;
    this.jumpVelocity = config.jumpVelocity;
    this.state = "jumping";
  }

  startCatch(duration) {
    if (this.defeated || this.downTimer > 0) return;
    this.catchTimer = duration;
    this.state = "catching";
  }

  crouch(duration) {
    if (this.defeated || this.downTimer > 0) return;
    this.crouchTimer = duration;
    this.state = "crouching";
  }

  markThrowing(duration) {
    this.throwTimer = duration;
    this.state = "throwing";
  }

  takeDamage(amount, sourceDirection, config) {
    if (this.defeated || this.invincibleTime > 0 || this.crouchTimer > 0) return false;

    this.hp = Math.max(0, this.hp - amount);
    this.isDamaged = true;
    this.invincibleTime = config.invincibleTime;
    this.knockbackX = sourceDirection * config.knockbackSpeed;
    this.knockbackY = -90 + Math.random() * 180;

    if (this.hp <= 0) {
      this.hasBall = false;
      this.downTimer = config.downTime;
      this.state = "down";
    }

    return true;
  }

  getHitCircle() {
    const crouchBonus = this.crouchTimer > 0 ? -7 : 0;
    return {
      x: this.x,
      y: this.y - 38 - this.jumpZ + crouchBonus,
      r: this.radius + (this.jumpZ > 0 ? 2 : 0)
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
    return 0.72 + t * 0.34;
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
      const x = Math.max(rect.x + this.radius, Math.min(rect.x + rect.w - this.radius, this.x));
      const y = Math.max(rect.y + this.radius, Math.min(rect.y + rect.h - this.radius, this.y));
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
    return rects.some((rect) => (
      this.x >= rect.x + this.radius &&
      this.x <= rect.x + rect.w - this.radius &&
      this.y >= rect.y + this.radius &&
      this.y <= rect.y + rect.h - this.radius
    ));
  }

  draw(context, config, debugMode, isControlled, isPassTarget) {
    if (this.defeated && this.leaveTimer > config.exitDelay) return;

    const blinkOff = this.invincibleTime > 0 && Math.floor(this.invincibleTime * 18) % 2 === 0;
    if (blinkOff) return;

    const scale = this.getScale(config);
    const drawY = this.y - this.jumpZ;
    const motionTime = performance.now();
    const walkPhase = motionTime / 72 + this.x * 0.02;
    const walkStep = this.state === "run" ? Math.sin(walkPhase) : 0;
    const bob = this.state === "run" ? Math.abs(walkStep) * 3 : 0;
    const legSwing = walkStep * 8;
    const armSwing = walkStep * 9;
    const crouchScaleY = this.crouchTimer > 0 ? 0.78 : 1;

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
    context.save();
    context.translate(this.x, drawY);
    context.scale(scale, scale * crouchScaleY);

    if (this.state === "down" || this.defeated) {
      context.rotate(this.team === "left" ? -0.8 : 0.8);
      context.scale(1.1, 0.76);
    }

    // 足
    context.fillStyle = "#234066";
    context.fillRect(-18, -5 + bob + legSwing * 0.28, 13, 27);
    context.fillRect(6, -5 + bob - legSwing * 0.28, 13, 27);
    context.fillStyle = "#ffffff";
    context.fillRect(-20, 17 + bob + legSwing * 0.45, 18, 5);
    context.fillRect(5, 17 + bob - legSwing * 0.45, 18, 5);

    // 体
    context.fillStyle = this.uniformColor;
    this.roundRect(context, -25, -47, 50, 48, 10);
    context.fill();
    context.fillStyle = this.trimColor;
    context.fillRect(-18, -43, 10, 39);
    context.fillRect(8, -43, 10, 39);

    // 腕
    context.strokeStyle = this.faceColor;
    context.lineWidth = 11;
    context.lineCap = "round";
    context.beginPath();
    if (this.state === "catching") {
      const catchProgress = Math.max(0, Math.min(1, this.catchTimer / Math.max(0.01, config.catchDuration)));
      const close = 1 - catchProgress;
      const upperY = -54 + close * 9;
      const lowerY = -22 - close * 10;
      context.moveTo(-18, -35);
      context.lineTo(this.facing * (48 - close * 10), upperY);
      context.moveTo(18, -35);
      context.lineTo(this.facing * (48 - close * 12), lowerY);
    } else if (this.state === "throwing") {
      const wind = this.throwTimer > 0.13 ? 1 : this.throwTimer / 0.13;
      const backX = -this.facing * (30 + wind * 18);
      const backY = -58 - wind * 22;
      const frontX = this.facing * (30 + (1 - wind) * 22);
      const frontY = -39 + wind * 6;
      context.moveTo(-14, -35);
      context.lineTo(backX, backY);
      context.moveTo(18, -35);
      context.lineTo(frontX, frontY);
    } else {
      context.moveTo(-23, -32);
      context.lineTo(-36, -13 - armSwing * 0.35);
      context.moveTo(23, -32);
      context.lineTo(36, -13 + armSwing * 0.35);
    }
    context.stroke();

    // 頭
    context.fillStyle = this.faceColor;
    context.beginPath();
    context.arc(0, -75 + bob, 31, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = this.hairColor;
    context.beginPath();
    context.arc(-9, -91 + bob, 22, Math.PI, Math.PI * 2);
    context.arc(11, -92 + bob, 18, Math.PI, Math.PI * 2);
    context.fill();

    context.fillStyle = "#222a34";
    context.beginPath();
    context.arc(this.facing * 8 - 7, -78 + bob, 3, 0, Math.PI * 2);
    context.arc(this.facing * 8 + 8, -78 + bob, 3, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "#9d4039";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(this.facing * 6, -66 + bob, 7, 0.1, Math.PI - 0.1);
    context.stroke();

    context.restore();

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
    if (this.role === "inner") {
      this.drawHpBar(context);
    }
    if (debugMode) {
      this.drawDebug(context, config);
    }
  }

  drawHeldBall(context, scale) {
    const bx = this.x + this.facing * 34 * scale;
    const by = this.y - this.jumpZ - 48 * scale;
    context.fillStyle = "#f06a32";
    context.beginPath();
    context.arc(bx, by, 15 * scale, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#8e2f22";
    context.lineWidth = 3 * scale;
    context.beginPath();
    context.arc(bx, by, 15 * scale, -0.8, 0.8);
    context.moveTo(bx - 15 * scale, by);
    context.lineTo(bx + 15 * scale, by);
    context.stroke();
  }

  drawCatchPose(context, config) {
    const box = this.getCatchBox(config);
    context.fillStyle = "rgba(255,255,255,0.18)";
    context.strokeStyle = "rgba(255,255,255,0.7)";
    context.lineWidth = 3;
    this.roundRect(context, box.x, box.y, box.w, box.h, 12);
    context.fill();
    context.stroke();
  }

  drawControlMarker(context) {
    context.fillStyle = "#d32f2f";
    context.beginPath();
    context.moveTo(this.x, this.y - this.jumpZ - 128);
    context.lineTo(this.x - 16, this.y - this.jumpZ - 154);
    context.lineTo(this.x + 16, this.y - this.jumpZ - 154);
    context.closePath();
    context.fill();
    context.fillRect(this.x - 6, this.y - this.jumpZ - 176, 12, 24);
  }

  drawPassMarker(context) {
    const y = this.y - this.jumpZ - 142;
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

  drawHpBar(context) {
    const width = 58;
    const ratio = Math.max(0, this.hp / this.maxHp);
    const y = this.y - this.jumpZ - 118;
    context.fillStyle = "rgba(25,25,32,0.65)";
    this.roundRect(context, this.x - width / 2, y, width, 8, 3);
    context.fill();
    context.fillStyle = this.team === "left" ? "#49d36e" : "#ffdf5d";
    this.roundRect(context, this.x - width / 2 + 2, y + 2, (width - 4) * ratio, 4, 2);
    context.fill();
  }

  drawDebug(context, config) {
    const hit = this.getHitCircle();
    context.strokeStyle = "rgba(0,255,80,0.7)";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(hit.x, hit.y, hit.r, 0, Math.PI * 2);
    context.stroke();

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
