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
  visor: "#222a34",
  sole: "#f8f8f2"
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
    this.throwPhase = "none";
    this.throwKind = "none";
    this.throwLockTimer = 0;
    this.crouchTimer = 0;
    this.downTimer = 0;
    this.leaveTimer = 0;
    this.jumpZ = 0;
    this.jumpVelocity = 0;
    this.isDashing = false;
    this.defeated = false;
  }

  update(delta, controls, area, config) {
    const airborneBeforeMove = this.jumpZ > 0 || this.jumpVelocity > 0;
    const startedInsideArea = this.isInsideArea(area);
    this.invincibleTime = Math.max(0, this.invincibleTime - delta);
    this.catchTimer = Math.max(0, this.catchTimer - delta);
    this.throwTimer = Math.max(0, this.throwTimer - delta);
    if (this.throwTimer > 0) {
      const releaseWindow = this.throwKind === "shoot" ? 0.26 : 0.2;
      this.throwPhase = this.throwTimer > releaseWindow ? "windup" : "release";
    } else {
      this.throwPhase = "none";
      this.throwKind = "none";
    }
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
    this.isDashing = Boolean(controls.dash && (Math.abs(moveX) > 0.08 || Math.abs(moveY) > 0.08));

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

  markThrowing(duration, kind = "shoot") {
    this.throwTimer = duration;
    this.throwKind = kind;
    this.throwPhase = duration > (kind === "shoot" ? 0.26 : 0.2) ? "windup" : "release";
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

  draw(context, config, debugMode, isControlled, isPassTarget, isShootTarget) {
    if (this.defeated && this.leaveTimer > config.exitDelay) return;

    const blinkOff = this.invincibleTime > 0 && Math.floor(this.invincibleTime * 18) % 2 === 0;
    if (blinkOff) return;

    const scale = this.getScale(config);
    this.lastDrawScale = scale;
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
    if (this.role === "inner") {
      this.drawHpBar(context);
    }
    if (debugMode) {
      this.drawDebug(context, config);
    }
  }

  drawModelCharacter(context, scale, drawY, motionTime, config) {
    const colors = PLAYER_MODEL[this.team] || PLAYER_MODEL.left;
    const runAmount = this.state === "run" ? (this.isDashing ? 1.25 : 1) : 0;
    const stride = Math.sin(motionTime / 85 + this.x * 0.025) * runAmount;
    const bob = Math.abs(stride) * 4;
    const crouch = this.crouchTimer > 0 ? 1 : 0;
    const jumpPose = this.jumpZ > 0 || this.jumpVelocity > 0 ? 1 : 0;
    const damaged = this.state === "damaged" ? 1 : 0;
    const down = this.state === "down" || this.defeated;
    const catchProgress = this.catchTimer > 0
      ? 1 - Math.max(0, Math.min(1, this.catchTimer / Math.max(0.01, config.catchDuration)))
      : 0;
    const throwProgress = this.state === "throwing"
      ? (this.throwPhase === "windup" ? 0.25 : 1)
      : 0;

    const rootY = crouch * 16 + bob - jumpPose * 4;
    const torsoY = -63 + rootY + crouch * 10;
    const headY = -116 + rootY + crouch * 17;
    const hipY = -34 + rootY + crouch * 13;
    const shoulderY = -78 + rootY + crouch * 11;

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
      pose.backLeg[1].x -= 10;
      pose.backLeg[1].y += 10;
      pose.backLeg[2].x -= 22;
      pose.frontLeg[1].x += 10;
      pose.frontLeg[1].y += 10;
      pose.frontLeg[2].x += 22;
      pose.backArm[2].y += 9;
      pose.frontArm[2].y += 9;
    }

    if (catchProgress > 0) {
      pose.backArm[1] = { x: -24, y: -108 + rootY };
      pose.backArm[2] = { x: -14, y: -137 + rootY + catchProgress * 4 };
      pose.frontArm[1] = { x: 24, y: -108 + rootY };
      pose.frontArm[2] = { x: 14, y: -137 + rootY + catchProgress * 4 };
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

    context.save();
    context.translate(this.x, drawY);
    context.scale(scale * this.facing, scale);
    if (down) {
      context.rotate(-0.92);
      context.scale(1.12, 0.78);
    } else if (damaged) {
      context.rotate(-0.12);
    }

    this.drawModelLimb(context, pose.backLeg, colors.suit, 11);
    this.drawModelLimb(context, pose.backArm, PLAYER_MODEL.skinShade, 9);
    this.drawModelFoot(context, pose.backLeg[2], colors.suit);

    this.drawModelTorso(context, 0, torsoY, colors);

    this.drawModelLimb(context, pose.frontLeg, colors.suit, 12);
    this.drawModelFoot(context, pose.frontLeg[2], colors.suit);
    this.drawModelLimb(context, pose.frontArm, PLAYER_MODEL.skin, 10);

    this.drawModelHead(context, 0, headY, colors, damaged);
    context.restore();
  }

  drawModelTorso(context, x, y, colors) {
    context.fillStyle = colors.suit;
    context.beginPath();
    context.ellipse(x, y, 27, 38, 0, 0, Math.PI * 2);
    context.fill();
  }

  drawModelHead(context, x, y, colors, damaged) {
    const head = context.createRadialGradient(x - 12, y - 15, 4, x, y, 33);
    head.addColorStop(0, "#ffe3c5");
    head.addColorStop(0.62, PLAYER_MODEL.skin);
    head.addColorStop(1, PLAYER_MODEL.skinShade);
    context.fillStyle = head;
    context.beginPath();
    context.arc(x, y, 29, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = PLAYER_MODEL.visor;
    context.beginPath();
    context.arc(x + 8, y - 5, 3.1, 0, Math.PI * 2);
    context.arc(x + 20, y - 5, 3.1, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = damaged ? "#ffffff" : "#8f3b3a";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(x + 15, y + 7, damaged ? 8 : 6, 0.18, Math.PI - 0.18);
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

  drawHeldBall(context, scale) {
    let bx = this.x + this.facing * 34 * scale;
    let by = this.y - this.jumpZ - 48 * scale;
    if (this.state === "throwing" && this.throwPhase === "windup") {
      bx = this.x - this.facing * (this.throwKind === "shoot" ? 62 : 44) * scale;
      by = this.y - this.jumpZ - (this.throwKind === "shoot" ? 126 : 92) * scale;
    } else if (this.state === "catching") {
      bx = this.x;
      by = this.y - this.jumpZ - 130 * scale;
    }
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

  drawHpBar(context) {
    const width = 58;
    const ratio = Math.max(0, this.hp / this.maxHp);
    const y = this.getVisualTop() - 10;
    context.fillStyle = "rgba(25,25,32,0.65)";
    this.roundRect(context, this.x - width / 2, y, width, 8, 3);
    context.fill();
    context.fillStyle = this.team === "left" ? "#49d36e" : "#ffdf5d";
    this.roundRect(context, this.x - width / 2 + 2, y + 2, (width - 4) * ratio, 4, 2);
    context.fill();
  }

  getVisualTop() {
    return this.y - this.jumpZ - 158 * (this.lastDrawScale || 1);
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
