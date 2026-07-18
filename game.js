const DEBUG_MODE = false;
const SHOW_HITBOXES = false;

const GAME_CONFIG = {
  width: 1440,
  height: 720,
  court: {
    x: -143,
    y: 58,
    w: 2126,
    h: 759,
    centerX: 920
  },
  view: {
    paddingX: 20,
    paddingY: 12,
    playZoom: 1,
    worldTop: 0,
    worldBottomPadding: 12
  },
  player: {
    maxHp: 100,
    maxStamina: 100,
    speed: 235,
    throwPower: 20,
    stats: {
      power: 5,
      speed: 5,
      jump: 5,
      technique: 5
    }
  },
  ball: {
    radius: 18,
    damage: 20,
    shootSpeed: 1140,
    passSpeed: 430,
    moveBonus: 0.34,
    gravity: 520,
    hitBounceX: 260,
    hitBounceY: 270
  },
  battle: {
    pickupDistance: 62,
    rollingPickupDistance: 92,
    catchDuration: 0.25,
    catchWidth: 74,
    catchHeight: 92,
    duckDuration: 0.48,
    invincibleTime: 1,
    knockbackSpeed: 410,
    downTime: 0.9,
    exitDelay: 1.5,
    cpuCatchChance: 0.3,
    jumpVelocity: 630,
    jumpGravity: 920,
    dashSpeedMultiplier: 3.2,
    turnDuration: 0.2,
    turnSpeedMultiplier: 0.32,
    depthTop: 140,
    depthBottom: 720,
    stamina: {
      shootCost: 18,
      shootChargeDrainPerSecond: 11,
      duckCost: 14,
      dashDrainPerSecond: 38,
      recoveryPerSecond: 48,
      recoveryDelay: 0.7
    }
  }
};

class DodgeballGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.context = this.canvas.getContext("2d");
    this.input = new InputManager();
    this.state = "modeSelect";
    this.gameMode = "single";
    this.modeIndex = 0;
    this.typeOrder = ["normal", "power", "speed", "jump"];
    this.teamSelectionSide = "left";
    this.teamSelectionSlot = 0;
    this.teamSelectionSlots = { left: 0, right: 0 };
    this.teamSelections = {
      left: this.createDefaultTeamSelection(),
      right: this.createDefaultTeamSelection()
    };
    this.previousTime = 0;
    this.autoSwitchCooldown = 0;
    this.rightStickSwitchCooldown = 0;
    this.manualSwitchGrace = 0;
    this.lastEnemyHolderId = null;
    this.autoSwitchCooldownP2 = 0;
    this.rightStickSwitchCooldownP2 = 0;
    this.manualSwitchGraceP2 = 0;
    this.lastEnemyHolderIdP2 = null;
    this.pendingThrow = null;
    this.chargingThrow = null;
    this.effects = [];
    this.message = "READY";
    this.setupMatch();
    requestAnimationFrame((time) => this.loop(time));
  }

  createDefaultTeamSelection() {
    return ["normal", "normal", "normal", "power", "speed", "jump"];
  }

  setupMatch() {
    const court = GAME_CONFIG.court;
    this.areas = this.createAreas();
    this.ballBounds = this.createBallBounds();
    this.leftTeam = this.createTeam("left");
    this.rightTeam = this.createTeam("right");
    this.players = [...this.leftTeam, ...this.rightTeam];
    this.controlledPlayerId = "left-inner-1";
    this.controlledRightPlayerId = "right-inner-1";
    this.ball = new Ball(GAME_CONFIG.ball);
    this.ball.x = court.centerX;
    this.ball.y = court.y + court.h * 0.55;
    this.cpuController = new CPUController(this.rightTeam, this.leftTeam, this.ball, {
      ...GAME_CONFIG.battle,
      court,
      areas: this.areas
    });
    this.effects = [];
    this.message = "READY";
    this.autoSwitchCooldown = 0;
    this.rightStickSwitchCooldown = 0;
    this.manualSwitchGrace = 0;
    this.lastEnemyHolderId = null;
    this.autoSwitchCooldownP2 = 0;
    this.rightStickSwitchCooldownP2 = 0;
    this.manualSwitchGraceP2 = 0;
    this.lastEnemyHolderIdP2 = null;
    this.pendingThrow = null;
    this.chargingThrow = null;
  }

  createAreas() {
    const c = GAME_CONFIG.court;
    const halfW = c.w / 2;
    const topY = c.y + 10;
    const backY = c.y + 96;
    const frontY = c.y + c.h - 38;
    const sideOutTop = c.y + 96;
    const sideOutBottom = c.y + c.h - 38;
    const projectedX = (x, y) => this.projectCourtX(x, y, topY, c.y + c.h);
    const trapezoid = (yTop, yBottom, leftTop, rightTop, leftBottom, rightBottom) => ({
      x: Math.min(leftTop, leftBottom),
      y: yTop,
      w: Math.max(rightTop, rightBottom) - Math.min(leftTop, leftBottom),
      h: yBottom - yTop,
      trapezoid: { yTop, yBottom, leftTop, rightTop, leftBottom, rightBottom }
    });
    return {
      leftInner: trapezoid(
        backY + 8,
        frontY - 8,
        projectedX(c.x, backY) + 16,
        projectedX(c.centerX, backY) - 16,
        projectedX(c.x, frontY) + 16,
        projectedX(c.centerX, frontY) - 16
      ),
      rightInner: trapezoid(
        backY + 8,
        frontY - 8,
        projectedX(c.centerX, backY) + 16,
        projectedX(c.x + c.w, backY) - 16,
        projectedX(c.centerX, frontY) + 16,
        projectedX(c.x + c.w, frontY) - 16
      ),
      leftTopOut: { x: c.x + 22, y: c.y + 8, w: halfW - 44, h: backY - c.y - 8 },
      leftBottomOut: { x: c.x + 22, y: frontY, w: halfW - 44, h: c.y + c.h - frontY },
      leftSideOut: trapezoid(
        sideOutTop,
        sideOutBottom,
        projectedX(c.x, sideOutTop) - 148,
        projectedX(c.x, sideOutTop) - 10,
        projectedX(c.x, sideOutBottom) - 148,
        projectedX(c.x, sideOutBottom) - 10
      ),
      rightTopOut: { x: c.centerX + 22, y: c.y + 8, w: halfW - 44, h: backY - c.y - 8 },
      rightBottomOut: { x: c.centerX + 22, y: frontY, w: halfW - 44, h: c.y + c.h - frontY },
      rightSideOut: trapezoid(
        sideOutTop,
        sideOutBottom,
        projectedX(c.x + c.w, sideOutTop) + 10,
        projectedX(c.x + c.w, sideOutTop) + 148,
        projectedX(c.x + c.w, sideOutBottom) + 10,
        projectedX(c.x + c.w, sideOutBottom) + 148
      )
    };
  }

  projectCourtX(x, y, topY = GAME_CONFIG.court.y + 10, bottomY = GAME_CONFIG.court.y + GAME_CONFIG.court.h) {
    const c = GAME_CONFIG.court;
    const t = Math.max(0, Math.min(1, (y - topY) / (bottomY - topY)));
    const scale = 0.78 + t * 0.22;
    return c.centerX + (x - c.centerX) * scale;
  }

  createBallBounds() {
    const rects = [GAME_CONFIG.court, ...Object.values(this.areas)].map((area) => this.getAreaBounds(area));
    const padding = 48;
    const minX = Math.min(...rects.map((rect) => rect.x)) - padding;
    const minY = Math.min(...rects.map((rect) => rect.y)) - padding;
    const maxX = Math.max(...rects.map((rect) => rect.x + rect.w)) + padding;
    const maxY = Math.max(...rects.map((rect) => rect.y + rect.h)) + padding;
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
  }

  createTeam(team) {
    const isLeft = team === "left";
    const color = isLeft ? "#3087f2" : "#f05a45";
    const trim = isLeft ? "#f6fbff" : "#fff0cf";
    const innerArea = isLeft ? this.areas.leftInner : this.areas.rightInner;
    const sideArea = isLeft ? this.areas.rightSideOut : this.areas.leftSideOut;
    const topArea = isLeft ? this.areas.rightTopOut : this.areas.leftTopOut;
    const bottomArea = isLeft ? this.areas.rightBottomOut : this.areas.leftBottomOut;
    const prefix = isLeft ? "left" : "right";
    const selectedTypes = this.teamSelections?.[team] || Array(6).fill("normal");
    const names = isLeft ? ["ソラ", "ミナ", "タケ"] : ["ガツ", "レン", "ドウ"];
    const outNames = isLeft ? ["ハル", "ナツ", "アキ"] : ["ゴウ", "ジン", "バン"];
    const xs = isLeft
      ? [innerArea.x + 180, innerArea.x + 410, innerArea.x + 650]
      : [innerArea.x + innerArea.w - 650, innerArea.x + innerArea.w - 410, innerArea.x + innerArea.w - 180];
    const ys = [innerArea.y + 105, innerArea.y + 250, innerArea.y + 395];

    return [
      new Player({
        id: `${prefix}-inner-1`,
        name: names[0],
        team,
        role: "inner",
        zone: isLeft ? "leftInner" : "rightInner",
        x: xs[0],
        y: ys[1],
        characterType: selectedTypes[0],
        maxHp: GAME_CONFIG.player.maxHp,
        maxStamina: GAME_CONFIG.player.maxStamina,
        speed: GAME_CONFIG.player.speed,
        throwPower: GAME_CONFIG.player.throwPower,
        stats: GAME_CONFIG.player.stats,
        uniformColor: color,
        trimColor: trim
      }),
      new Player({
        id: `${prefix}-inner-2`,
        name: names[1],
        team,
        role: "inner",
        zone: isLeft ? "leftInner" : "rightInner",
        x: xs[1],
        y: ys[0],
        characterType: selectedTypes[1],
        maxHp: GAME_CONFIG.player.maxHp,
        maxStamina: GAME_CONFIG.player.maxStamina,
        speed: GAME_CONFIG.player.speed,
        throwPower: GAME_CONFIG.player.throwPower,
        stats: GAME_CONFIG.player.stats,
        uniformColor: color,
        trimColor: trim,
        hairColor: "#6d3a1d"
      }),
      new Player({
        id: `${prefix}-inner-3`,
        name: names[2],
        team,
        role: "inner",
        zone: isLeft ? "leftInner" : "rightInner",
        x: xs[2],
        y: ys[2],
        characterType: selectedTypes[2],
        maxHp: GAME_CONFIG.player.maxHp,
        maxStamina: GAME_CONFIG.player.maxStamina,
        speed: GAME_CONFIG.player.speed,
        throwPower: GAME_CONFIG.player.throwPower,
        stats: GAME_CONFIG.player.stats,
        uniformColor: color,
        trimColor: trim,
        hairColor: "#1f1f22"
      }),
      new Player({
        id: `${prefix}-out-top`,
        name: outNames[0],
        team,
        role: "out",
        zone: isLeft ? "rightTopOut" : "leftTopOut",
        x: topArea.x + topArea.w * 0.55,
        y: topArea.y + 55,
        characterType: selectedTypes[3],
        maxHp: GAME_CONFIG.player.maxHp,
        maxStamina: GAME_CONFIG.player.maxStamina,
        speed: GAME_CONFIG.player.speed,
        throwPower: GAME_CONFIG.player.throwPower,
        stats: GAME_CONFIG.player.stats,
        uniformColor: color,
        trimColor: trim
      }),
      new Player({
        id: `${prefix}-out-bottom`,
        name: outNames[1],
        team,
        role: "out",
        zone: isLeft ? "rightBottomOut" : "leftBottomOut",
        x: bottomArea.x + bottomArea.w * 0.45,
        y: bottomArea.y + bottomArea.h * 0.5,
        characterType: selectedTypes[4],
        maxHp: GAME_CONFIG.player.maxHp,
        maxStamina: GAME_CONFIG.player.maxStamina,
        speed: GAME_CONFIG.player.speed,
        throwPower: GAME_CONFIG.player.throwPower,
        stats: GAME_CONFIG.player.stats,
        uniformColor: color,
        trimColor: trim
      }),
      new Player({
        id: `${prefix}-out-side`,
        name: outNames[2],
        team,
        role: "out",
        zone: isLeft ? "rightSideOut" : "leftSideOut",
        x: sideArea.x + sideArea.w * 0.5,
        y: sideArea.y + sideArea.h * 0.52,
        characterType: selectedTypes[5],
        maxHp: GAME_CONFIG.player.maxHp,
        maxStamina: GAME_CONFIG.player.maxStamina,
        speed: GAME_CONFIG.player.speed,
        throwPower: GAME_CONFIG.player.throwPower,
        stats: GAME_CONFIG.player.stats,
        uniformColor: color,
        trimColor: trim
      })
    ];
  }

  loop(time) {
    const delta = Math.min(0.033, (time - this.previousTime) / 1000 || 0);
    this.previousTime = time;
    this.input.update();
    this.update(delta);
    this.draw();
    requestAnimationFrame((nextTime) => this.loop(nextTime));
  }

  update(delta) {
    if (this.state === "modeSelect") {
      this.updateModeSelect();
      return;
    }

    if (this.state === "teamSelect") {
      this.updateTeamSelect();
      return;
    }

    if (this.state === "gameOver") {
      if (this.input.wasPressed("button1") || this.input.wasPressed("button2")) {
        this.state = "modeSelect";
      }
      return;
    }

    if (this.input.wasPressed("pause")) {
      this.state = this.state === "paused" ? "playing" : "paused";
    }
    if (this.state === "paused") return;

    this.updatePlaying(delta);
  }

  updateModeSelect() {
    if (this.wasMenuDirectionPressed("left") || this.wasMenuDirectionPressed("up")) {
      this.modeIndex = 0;
      this.gameMode = "single";
    }
    if (this.wasMenuDirectionPressed("right") || this.wasMenuDirectionPressed("down")) {
      this.modeIndex = 1;
      this.gameMode = "versus";
    }
    if (this.input.wasPressed("button1") || this.input.wasPressed("button2")) {
      this.gameMode = this.modeIndex === 0 ? "single" : "versus";
      this.state = "teamSelect";
      this.teamSelectionSide = "left";
      this.teamSelectionSlot = 0;
      this.teamSelectionSlots = { left: 0, right: 0 };
    }
  }

  updateTeamSelect() {
    if (this.gameMode === "versus") {
      this.updateTeamSelectCursor("left", 1);
      this.updateTeamSelectCursor("right", 2);
    } else {
      this.updateSingleTeamSelectCursor();
    }

    if (this.input.wasPressed("pause")) {
      this.state = "modeSelect";
    }
  }

  updateSingleTeamSelectCursor() {
    const moved = this.moveTeamSelectCursor(this.teamSelectionSide, this.teamSelectionSlot, 1);
    this.teamSelectionSide = moved.side;
    this.teamSelectionSlot = moved.slot;
    if (this.input.wasPressed("button2") && this.teamSelectionSlot < 6) {
      this.changeSelectedCharacterType(this.teamSelectionSide, this.teamSelectionSlot, 1);
    }
    if (this.input.wasPressed("button2") && this.teamSelectionSlot === 6) {
      this.setupMatch();
      this.state = "playing";
    }
    if (this.input.wasPressed("button1")) {
      this.state = "modeSelect";
    }
  }

  updateTeamSelectCursor(side, playerIndex) {
    const moved = this.moveTeamSelectCursor(side, this.teamSelectionSlots[side], playerIndex, true);
    this.teamSelectionSlots[side] = moved.slot;
    const slot = moved.slot;

    if (this.input.wasPressed("button2", playerIndex) && slot < 6) {
      this.changeSelectedCharacterType(side, slot, 1);
    }
    if (this.input.wasPressed("button2", playerIndex) && slot === 6) {
      this.setupMatch();
      this.state = "playing";
    }
    if (this.input.wasPressed("button1", playerIndex)) {
      this.state = "modeSelect";
    }
  }

  moveTeamSelectCursor(side, slot, playerIndex, lockSide = false) {
    let nextSide = side;
    let nextSlot = slot;
    const left = this.wasMenuDirectionPressed("left", playerIndex);
    const right = this.wasMenuDirectionPressed("right", playerIndex);
    const up = this.wasMenuDirectionPressed("up", playerIndex);
    const down = this.wasMenuDirectionPressed("down", playerIndex);

    if (nextSlot === 6) {
      if (up) nextSlot = 4;
      if (left && !lockSide) nextSide = "left";
      if (right && !lockSide) nextSide = "right";
      return { side: nextSide, slot: nextSlot };
    }

    const row = Math.floor(nextSlot / 3);
    const col = nextSlot % 3;
    if (left) {
      if (col > 0) {
        nextSlot -= 1;
      } else if (!lockSide) {
        nextSide = nextSide === "left" ? "right" : "left";
        nextSlot = row * 3 + 2;
      }
    }
    if (right) {
      if (col < 2) {
        nextSlot += 1;
      } else if (!lockSide) {
        nextSide = nextSide === "left" ? "right" : "left";
        nextSlot = row * 3;
      }
    }
    if (up && row > 0) nextSlot -= 3;
    if (down) nextSlot = row === 0 ? nextSlot + 3 : 6;
    return { side: nextSide, slot: nextSlot };
  }

  wasMenuDirectionPressed(direction, playerIndex = 1) {
    const threshold = 0.55;
    const current = this.input.getCurrent(playerIndex);
    const previous = this.input.getPrevious(playerIndex);
    if (direction === "left") return current.moveX < -threshold && previous.moveX >= -threshold;
    if (direction === "right") return current.moveX > threshold && previous.moveX <= threshold;
    if (direction === "up") return current.moveY < -threshold && previous.moveY >= -threshold;
    if (direction === "down") return current.moveY > threshold && previous.moveY <= threshold;
    return false;
  }

  changeSelectedCharacterType(side, slot, direction) {
    const selections = this.teamSelections[side];
    const currentType = selections[slot];
    let index = this.typeOrder.indexOf(currentType);
    if (index < 0) index = 0;

    for (let step = 0; step < this.typeOrder.length; step += 1) {
      index = (index + direction + this.typeOrder.length) % this.typeOrder.length;
      const nextType = this.typeOrder[index];
      if (this.canUseCharacterType(side, slot, nextType)) {
        selections[slot] = nextType;
        return;
      }
    }
  }

  canUseCharacterType(side, slot, type) {
    const count = this.teamSelections[side].reduce((sum, selected, index) => {
      if (index === slot) return sum;
      return sum + (selected === type ? 1 : 0);
    }, 0);
    return count < 3;
  }

  updatePlaying(delta) {
    this.updateEffects(delta);
    if (this.gameMode !== "versus") {
      this.cpuController.update(delta);
    }
    this.autoSwitchToIncomingShotTarget();
    this.updateControlSwitching(delta);
    this.handlePlayerButtons();
    this.handleCpuButtons();
    this.updateChargingThrow(delta);
    this.updatePendingThrow(delta);
    this.updatePlayers(delta);
    this.autoPickupLooseBall();
    this.ball.update(delta, this.ballBounds);
    this.resetUnreachableOutfieldBall();
    this.handleManualCatch(this.leftTeam);
    this.handleManualCatch(this.rightTeam);
    this.handlePassReceives();
    this.handleFriendlyMissedReceives(this.leftTeam);
    this.handleFriendlyMissedReceives(this.rightTeam);
    this.handleHits();
    this.ensureBallIsPlayable();
    this.checkGameOver();
  }

  handlePlayerButtons() {
    const holder = this.ball.owner;
    const selfTeamHasBall = holder && holder.team === "left";
    const rightTeamHasBall = holder && holder.team === "right";

    const active = this.getPlayerControlledMember();
    const activeRight = this.gameMode === "versus" ? this.getRightControlledMember() : null;

    if (this.input.wasPressed("button3")) {
      active.jump(GAME_CONFIG.battle);
    }
    if (this.gameMode === "versus" && activeRight && this.input.wasPressed("button3", 2)) {
      activeRight.jump(GAME_CONFIG.battle);
    }

    if (selfTeamHasBall) {
      this.controlledPlayerId = holder.id;
      if (this.input.wasPressed("button2")) {
        this.startChargedThrow(holder, "shoot");
      }
      if (this.input.wasPressed("button1")) {
        this.startChargedThrow(holder, "pass");
      }
      if (this.input.wasReleased("button2")) {
        this.releaseChargedThrow(holder, "shoot");
      }
      if (this.input.wasReleased("button1")) {
        this.releaseChargedThrow(holder, "pass");
      }
    } else {
      if (this.input.wasPressed("avoid")) {
        active.startDodge(0, 0, GAME_CONFIG.battle);
      }
      if (this.input.wasPressed("catch")) {
        active.startCatch(GAME_CONFIG.battle.catchDuration);
      }
    }

    if (this.gameMode === "versus") {
      if (rightTeamHasBall) {
        this.controlledRightPlayerId = holder.id;
        if (this.input.wasPressed("button2", 2)) {
          this.startChargedThrow(holder, "shoot", 2);
        }
        if (this.input.wasPressed("button1", 2)) {
          this.startChargedThrow(holder, "pass", 2);
        }
        if (this.input.wasReleased("button2", 2)) {
          this.releaseChargedThrow(holder, "shoot", 2);
        }
        if (this.input.wasReleased("button1", 2)) {
          this.releaseChargedThrow(holder, "pass", 2);
        }
      } else if (activeRight && !activeRight.defeated) {
        if (this.input.wasPressed("avoid", 2)) {
          activeRight.startDodge(0, 0, GAME_CONFIG.battle);
        }
        if (this.input.wasPressed("catch", 2)) {
          activeRight.startCatch(GAME_CONFIG.battle.catchDuration);
        }
      }
    }
  }

  handleCpuButtons() {
    if (this.gameMode === "versus") return;
    for (const member of this.rightTeam) {
      const command = this.cpuController.getCommand(member);
      if (command.catch) member.startCatch(GAME_CONFIG.battle.catchDuration);
      if (command.crouch) member.startDodge(0, 0, GAME_CONFIG.battle);
      if (command.jump) member.jump(GAME_CONFIG.battle);
      if (command.chargeShoot && this.ball.owner === member) {
        this.startCpuChargedShoot(member, command.chargeTime);
      }
      if (command.shoot && this.ball.owner === member) {
        this.launchFromAi(member, "shoot", this.leftTeam);
      }
      if (command.pass && this.ball.owner === member) {
        this.launchFromAi(member, "pass", this.rightTeam.filter((p) => p !== member));
      }
    }
  }

  updatePlayers(delta) {
    const active = this.getPlayerControlledMember();
    for (const member of this.leftTeam) {
      const area = this.getMoveArea(member, member === active);
      let controls = { moveX: 0, moveY: 0, dash: false };
      if (member === active && !member.defeated) {
        controls = {
          moveX: this.input.current.moveX,
          moveY: this.input.current.moveY,
          dash: this.input.current.dash,
          lockFacing: this.input.current.button4
        };
      } else {
        controls = this.getSupportMove(member);
      }
      if (this.shouldReturnToLegalArea(member, area)) {
        controls = this.vectorTo(member, member.homeX, member.homeY, true);
      }
      member.update(delta, controls, area, GAME_CONFIG.battle);
    }

    const activeRight = this.getRightControlledMember();
    for (const member of this.rightTeam) {
      let command = this.cpuController.getCommand(member);
      if (this.gameMode === "versus") {
        command = member === activeRight && !member.defeated
          ? {
            moveX: this.input.currentP2.moveX,
            moveY: this.input.currentP2.moveY,
            dash: this.input.currentP2.dash,
            lockFacing: this.input.currentP2.button4
          }
          : this.getSupportMove(member);
      }
      const area = this.getMoveArea(member, false);
      const controls = this.shouldReturnToLegalArea(member, area)
        ? this.vectorTo(member, member.homeX, member.homeY, true)
        : command;
      member.update(delta, controls, area, GAME_CONFIG.battle);
      if (member.role === "inner" && member.jumpZ <= 0 && member.jumpVelocity <= 0 && !this.isPointInsideArea(member.x, member.y, member.radius, area)) {
        member.clampToArea(area);
      }
    }
  }

  getMoveArea(member, isControlled) {
    if (isControlled && member.role === "out") {
      return this.getTeamOutfieldArea(member.team);
    }
    return this.areas[member.zone];
  }

  getTeamOutfieldArea(team) {
    const zones = team === "left"
      ? ["rightTopOut", "rightBottomOut", "rightSideOut"]
      : ["leftTopOut", "leftBottomOut", "leftSideOut"];
    return { rects: zones.map((zone) => this.areas[zone]) };
  }

  shouldReturnToLegalArea(member, area) {
    if (member.defeated || member.jumpZ > 0 || member.jumpVelocity > 0) return false;
    return !this.isPointInsideArea(member.x, member.y, member.radius, area);
  }

  isPointInsideArea(x, y, radius, area) {
    if (!area) return true;
    const rects = area.rects || [area];
    return rects.some((rect) => this.isPointInsideRectOrTrapezoid(x, y, radius, rect));
  }

  isPointInsideRectOrTrapezoid(x, y, radius, rect) {
    if (rect.trapezoid) {
      const bounds = this.getTrapezoidBoundsAtY(rect.trapezoid, y);
      return Boolean(bounds) && x >= bounds.left + radius && x <= bounds.right - radius;
    }
    return (
      x >= rect.x + radius &&
      x <= rect.x + rect.w - radius &&
      y >= rect.y + radius &&
      y <= rect.y + rect.h - radius
    );
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

  getSupportMove(member) {
    if (member.defeated) return { moveX: 0, moveY: 0, dash: false };
    const enemyHolder = this.ball.owner && this.ball.owner.team !== member.team ? this.ball.owner : null;
    if (enemyHolder && member.role === "inner") {
      return this.getEvadeMove(member, enemyHolder, member.team === "left" ? this.leftTeam : this.rightTeam);
    }
    if (this.ball.isLoose && member.role === "inner" && this.ball.x < GAME_CONFIG.court.centerX) {
      const distance = Math.hypot(this.ball.x - member.x, this.ball.y - member.y);
      if (distance < 360) {
        return this.vectorTo(member, this.ball.x, this.ball.y, true);
      }
    }
    return this.vectorTo(member, member.homeX, member.homeY + Math.sin(Date.now() / 600 + member.x) * 20, false);
  }

  getEvadeMove(member, holder, team) {
    const area = this.areas[member.zone];
    const away = this.normalizedVector(member.x - holder.x, member.y - holder.y);
    const teamForward = member.team === "left" ? -1 : 1;
    const candidates = [
      { x: member.x + away.x * 360, y: member.y + away.y * 240 },
      { x: member.homeX + teamForward * 260, y: member.homeY - 170 },
      { x: member.homeX + teamForward * 260, y: member.homeY + 170 },
      { x: member.homeX + teamForward * 430, y: member.homeY },
      { x: member.homeX + teamForward * 120, y: member.homeY - 100 },
      { x: member.homeX + teamForward * 120, y: member.homeY + 100 }
    ];

    let best = null;
    let bestScore = -Infinity;
    for (const candidate of candidates) {
      const point = this.clampPointToRect(candidate, area, member.radius);
      const holderDistance = Math.hypot(point.x - holder.x, point.y - holder.y);
      const crowdPenalty = team.reduce((sum, teammate) => {
        if (teammate === member || teammate.defeated) return sum;
        const distance = Math.hypot(point.x - teammate.x, point.y - teammate.y);
        return sum + (distance < 130 ? 130 - distance : 0);
      }, 0);
      const homePenalty = Math.hypot(point.x - member.homeX, point.y - member.homeY) * 0.05;
      const score = holderDistance * 1.45 - crowdPenalty - homePenalty;
      if (score > bestScore) {
        best = point;
        bestScore = score;
      }
    }

    return best ? this.vectorTo(member, best.x, best.y, true) : this.vectorTo(member, member.homeX, member.homeY, true);
  }

  clampPointToRect(point, rect, radius) {
    if (!rect) return point;
    if (rect.trapezoid) {
      const y = Math.max(rect.trapezoid.yTop + radius, Math.min(rect.trapezoid.yBottom - radius, point.y));
      const bounds = this.getTrapezoidBoundsAtY(rect.trapezoid, y);
      if (!bounds) return { x: point.x, y };
      return {
        x: Math.max(bounds.left + radius, Math.min(bounds.right - radius, point.x)),
        y
      };
    }
    return {
      x: Math.max(rect.x + radius, Math.min(rect.x + rect.w - radius, point.x)),
      y: Math.max(rect.y + radius, Math.min(rect.y + rect.h - radius, point.y))
    };
  }

  autoPickupLooseBall() {
    if (!this.ball.isLoose || this.ball.owner) return;
    const pickupDistance = this.ball.hasBounced && !this.ball.isFlying
      ? GAME_CONFIG.battle.rollingPickupDistance
      : GAME_CONFIG.battle.pickupDistance;
    for (const member of this.players) {
      if (member.defeated) continue;
      if (this.ball.canBePickedUpBy(member, pickupDistance)) {
        this.ball.pickUp(member);
        this.setControlledMember(member.team, member);
        break;
      }
    }
  }

  resetUnreachableOutfieldBall() {
    if (this.ball.owner || this.ball.isFlying || !this.ball.isLoose) return;

    const outfield = this.getOutfieldSideForBall(this.ball.x, this.ball.y);
    if (!outfield) return;

    const outerLimit = outfield.side === "right"
      ? this.areas.rightSideOut.x + this.areas.rightSideOut.w + 18
      : this.areas.leftSideOut.x - 18;
    const beyondSide = outfield.side === "right" ? this.ball.x > outerLimit : this.ball.x < outerLimit;
    const beyondBottom = this.ball.y > this.ballBounds.y + this.ballBounds.h - 38;
    const beyondTop = this.ball.y < this.areas.leftTopOut.y - 34;

    if (!beyondSide && !beyondBottom && !beyondTop) return;

    const receiver = this.findNearestOutfielder(outfield.team, this.ball.x, this.ball.y);
    if (!receiver) return;

    receiver.x = Math.max(this.areas[receiver.zone].x + receiver.radius, Math.min(this.areas[receiver.zone].x + this.areas[receiver.zone].w - receiver.radius, receiver.x));
    receiver.y = Math.max(this.areas[receiver.zone].y + receiver.radius, Math.min(this.areas[receiver.zone].y + this.areas[receiver.zone].h - receiver.radius, receiver.y));
    this.ball.pickUp(receiver);
    this.setControlledMember(receiver.team, receiver);
    this.spawnEffect(receiver.x, receiver.y - 58, "#ffffff", "catch");
  }

  ensureBallIsPlayable() {
    if (!this.ball) return;

    if (this.ball.owner) {
      const ownerValid = this.players.includes(this.ball.owner) && !this.ball.owner.defeated && this.ball.owner.downTimer <= 0;
      if (ownerValid && this.ball.owner.hasBall) return;

      const owner = this.ball.owner;
      if (owner) owner.hasBall = false;
      this.releaseBallAt(
        Number.isFinite(owner?.x) ? owner.x : GAME_CONFIG.court.centerX,
        Number.isFinite(owner?.y) ? owner.y : GAME_CONFIG.court.y + GAME_CONFIG.court.h * 0.55,
        "loose"
      );
      return;
    }

    const invalidPosition = !Number.isFinite(this.ball.x) || !Number.isFinite(this.ball.y) || !Number.isFinite(this.ball.z);
    const invalidState = !this.ball.isFlying && !this.ball.isLoose;
    if (invalidPosition || invalidState) {
      this.releaseBallAt(GAME_CONFIG.court.centerX, GAME_CONFIG.court.y + GAME_CONFIG.court.h * 0.55, "loose");
      return;
    }

    if (this.ball.isLoose && !this.isPointInsideBallBounds(this.ball.x, this.ball.y)) {
      this.releaseBallAt(GAME_CONFIG.court.centerX, GAME_CONFIG.court.y + GAME_CONFIG.court.h * 0.55, "loose");
    }
  }

  releaseBallAt(x, y, effectType) {
    const safeX = Math.max(this.ballBounds.x + this.ball.radius, Math.min(this.ballBounds.x + this.ballBounds.w - this.ball.radius, x));
    const safeY = Math.max(this.ballBounds.y + this.ball.radius, Math.min(this.ballBounds.y + this.ballBounds.h - this.ball.radius, y));
    this.ball.owner = null;
    this.ball.thrower = null;
    this.ball.target = null;
    this.ball.kind = "loose";
    this.ball.isFlying = false;
    this.ball.isLoose = true;
    this.ball.catchable = false;
    this.ball.hasBounced = true;
    this.ball.x = safeX;
    this.ball.y = safeY;
    this.ball.z = 0;
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.ball.vz = 0;
    this.ball.passTime = 0;
    this.ball.passDuration = 0;
    this.spawnEffect(safeX, safeY - 32, "#ffffff", effectType);
  }

  isPointInsideBallBounds(x, y) {
    return (
      x >= this.ballBounds.x - 4 &&
      x <= this.ballBounds.x + this.ballBounds.w + 4 &&
      y >= this.ballBounds.y - 4 &&
      y <= this.ballBounds.y + this.ballBounds.h + 4
    );
  }

  getOutfieldSideForBall(x, y) {
    const candidates = [
      { team: "left", side: "right", zones: ["rightTopOut", "rightBottomOut", "rightSideOut"] },
      { team: "right", side: "left", zones: ["leftTopOut", "leftBottomOut", "leftSideOut"] }
    ];

    for (const candidate of candidates) {
      const rects = candidate.zones.map((zone) => this.areas[zone]);
      const minX = Math.min(...rects.map((rect) => rect.x)) - 38;
      const maxX = Math.max(...rects.map((rect) => rect.x + rect.w)) + 38;
      const minY = Math.min(...rects.map((rect) => rect.y)) - 38;
      const maxY = Math.max(...rects.map((rect) => rect.y + rect.h)) + 38;
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        return candidate;
      }
    }

    return null;
  }

  findNearestOutfielder(team, x, y) {
    const members = (team === "left" ? this.leftTeam : this.rightTeam).filter((p) => p.role === "out" && !p.defeated);
    return this.getNearestFrom({ x, y }, members);
  }

  launchFromInput(actor, kind, candidates) {
    const aim = this.input.getAimVector(actor.team === "left" ? 1 : -1);
    const target = this.findDirectionalTarget(actor, candidates, aim, kind);
    this.queueThrow(actor, target, kind, aim);
  }

  launchShootFromInput(actor) {
    const selection = this.getShootSelection(actor);
    this.queueThrow(actor, selection.target, "shoot", selection.aim);
  }

  launchPassFromInput(actor) {
    const moveX = this.input.current.moveX;
    const moveY = this.input.current.moveY;
    const target = this.getPassTarget(actor, moveX, moveY);
    const hasDirection = Math.hypot(moveX, moveY) >= 0.35;
    const aim = target
      ? (hasDirection ? this.normalizedVector(target.x - actor.x, target.y - actor.y) : { x: 0, y: 0 })
      : this.input.getAimVector(actor.team === "left" ? 1 : -1);
    if (this.queueThrow(actor, target, "pass", aim)) {
      if (target) this.setControlledMember(target.team, target);
    }
  }

  startChargedThrow(actor, kind, playerIndex = 1) {
    if (this.pendingThrow || this.chargingThrow || this.ball.owner !== actor || actor.defeated || actor.throwLockTimer > 0) return false;
    if (kind === "shoot" && !actor.consumeStamina(
      GAME_CONFIG.battle.stamina.shootCost,
      GAME_CONFIG.battle.stamina.recoveryDelay
    )) return false;
    const selection = kind === "shoot" ? this.getShootSelection(actor, playerIndex) : this.getPassSelection(actor, playerIndex);
    if (kind !== "shoot" && !selection.target) return false;
    this.chargingThrow = {
      actor,
      kind,
      target: selection.target,
      aim: selection.aim,
      playerIndex,
      chargeTime: 0,
      aerialCombo: kind === "shoot" && actor.jumpZ > 0 && actor.aerialPassCatchTimer > 0
    };
    actor.markThrowing(0.5, kind);
    return true;
  }

  startCpuChargedShoot(actor, chargeTime = 1) {
    if (this.pendingThrow || this.chargingThrow || this.ball.owner !== actor || actor.defeated || actor.throwLockTimer > 0) return false;
    if (!actor.consumeStamina(
      GAME_CONFIG.battle.stamina.shootCost,
      GAME_CONFIG.battle.stamina.recoveryDelay
    )) return false;

    const aim = this.getDefaultShootAim(actor, this.leftTeam);
    const target = this.findShootTargetInAim(actor, this.leftTeam, aim);
    this.chargingThrow = {
      actor,
      kind: "shoot",
      target,
      aim,
      playerIndex: 0,
      chargeTime: 0,
      cpuControlled: true,
      cpuReleaseTime: Math.max(0.35, Math.min(2, chargeTime)),
      aerialCombo: actor.jumpZ > 0 && actor.aerialPassCatchTimer > 0
    };
    actor.markThrowing(0.5, "shoot");
    return true;
  }

  releaseChargedThrow(actor, kind, playerIndex = 1) {
    if (!this.chargingThrow || this.chargingThrow.actor !== actor || this.chargingThrow.kind !== kind) return false;
    const charged = this.chargingThrow;
    this.chargingThrow = null;
    if (this.ball.owner !== actor || actor.defeated) return false;
    const selection = charged.cpuControlled
      ? this.getCpuShootSelection(actor)
      : kind === "shoot" ? this.getShootSelection(actor, playerIndex) : this.getPassSelection(actor, playerIndex);
    charged.target = selection.target || charged.target;
    charged.aim = selection.aim || charged.aim;
    const chargeRatio = Math.min(1, charged.chargeTime / 2);
    const multiplier = kind === "shoot"
      ? this.getShotMultiplier(actor, charged.aim, chargeRatio, charged.aerialCombo)
      : 1 + chargeRatio * 0.85;
    actor.throwLockTimer = Math.max(actor.throwLockTimer, kind === "shoot" ? 0.3 : 0.18);
    actor.markThrowing(kind === "shoot" ? 0.32 : 0.22, kind);
    if (this.ball.launch(actor, charged.target, kind, charged.aim, multiplier, charged.aerialCombo)) {
      this.spawnEffect(
        actor.x + actor.facing * 40,
        actor.y - 48 - actor.jumpZ,
        charged.aerialCombo ? "#66f6ff" : kind === "shoot" ? "#ffe46a" : "#ffffff",
        charged.aerialCombo ? "special" : kind
      );
      if (kind === "pass" && charged.target) this.setControlledMember(charged.target.team, charged.target);
    }
    return true;
  }

  getPassSelection(actor, playerIndex = 1) {
    const input = this.input.getCurrent(playerIndex);
    const moveX = input.moveX;
    const moveY = input.moveY;
    const target = this.getPassTarget(actor, moveX, moveY);
    const hasDirection = Math.hypot(moveX, moveY) >= 0.35;
    const aim = target
      ? (hasDirection ? this.normalizedVector(target.x - actor.x, target.y - actor.y) : { x: 0, y: 0 })
      : this.input.getAimVector(actor.team === "left" ? 1 : -1, playerIndex);
    return { target, aim };
  }

  launchFromAi(actor, kind, candidates) {
    if (kind === "shoot") {
      const aim = this.getDefaultShootAim(actor, candidates);
      const target = this.findShootTargetInAim(actor, candidates, aim);
      this.queueThrow(actor, target, kind, aim);
      return;
    }

    const target = this.getCpuPassTarget(actor);
    const aim = target
      ? this.normalizedVector(target.x - actor.x, target.y - actor.y)
      : this.getDefaultShootAim(actor, actor.team === "left" ? this.rightTeam : this.leftTeam);
    this.queueThrow(actor, target, kind, aim);
  }

  queueThrow(actor, target, kind, aim) {
    if (this.pendingThrow || this.ball.owner !== actor || actor.defeated) return false;
    if (!target && kind !== "shoot") return false;
    if (kind === "shoot" && !actor.consumeStamina(
      GAME_CONFIG.battle.stamina.shootCost,
      GAME_CONFIG.battle.stamina.recoveryDelay
    )) return false;

    this.pendingThrow = {
      actor,
      target,
      kind,
      aim: { x: aim.x, y: aim.y },
      shotMultiplier: kind === "shoot" ? this.getShotMultiplier(actor, aim) : 1,
      timer: kind === "shoot" ? 0.38 : 0.2
    };
    const throwDuration = kind === "shoot" ? 0.68 : 0.4;
    actor.markThrowing(throwDuration, kind);
    actor.throwLockTimer = Math.max(actor.throwLockTimer, throwDuration);

    if (kind === "shoot" && target && target.team !== actor.team) {
      this.setControlledMember(target.team, target);
      this.setAutoSwitchCooldown(target.team, 0.4);
      this.spawnEffect(target.x, target.y - 72, "#ffffff", "catch");
    }
    return true;
  }

  updatePendingThrow(delta) {
    if (!this.pendingThrow) return;

    const pending = this.pendingThrow;
    if (pending.actor.defeated || this.ball.owner !== pending.actor) {
      this.pendingThrow = null;
      return;
    }

    pending.timer -= delta;
    if (pending.timer > 0) return;

    this.pendingThrow = null;
    if (this.ball.launch(pending.actor, pending.target, pending.kind, pending.aim, pending.shotMultiplier)) {
      this.spawnEffect(
        pending.actor.x + pending.actor.facing * 40,
        pending.actor.y - 48,
        pending.kind === "shoot" ? "#ffe46a" : "#ffffff",
        pending.kind
      );
    }
  }

  updateChargingThrow(delta) {
    if (!this.chargingThrow) return;

    const charged = this.chargingThrow;
    if (charged.actor.defeated || this.ball.owner !== charged.actor) {
      this.chargingThrow = null;
      return;
    }

    charged.chargeTime = Math.min(2, charged.chargeTime + delta);
    if (charged.kind === "shoot") {
      charged.actor.drainStamina(
        GAME_CONFIG.battle.stamina.shootChargeDrainPerSecond * delta,
        GAME_CONFIG.battle.stamina.recoveryDelay
      );
      const selection = charged.cpuControlled
        ? this.getCpuShootSelection(charged.actor)
        : this.getShootSelection(charged.actor, charged.playerIndex);
      charged.target = selection.target;
      charged.aim = selection.aim;
      charged.aerialCombo = charged.aerialCombo || (charged.actor.jumpZ > 0 && charged.actor.aerialPassCatchTimer > 0);
      if (charged.cpuControlled && charged.chargeTime >= charged.cpuReleaseTime) {
        this.releaseChargedThrow(charged.actor, "shoot", charged.playerIndex);
        return;
      }
      if (charged.actor.stamina <= 0) {
        this.releaseChargedThrow(charged.actor, "shoot", charged.playerIndex);
        return;
      }
    } else {
      const selection = this.getPassSelection(charged.actor, charged.playerIndex);
      charged.target = selection.target;
      charged.aim = selection.aim;
    }

    charged.actor.markThrowing(0.42, charged.kind);
    charged.actor.throwLockTimer = Math.max(charged.actor.throwLockTimer, 0.08);
  }

  findDirectionalTarget(actor, candidates, aim, kind) {
    const alive = candidates.filter((p) => !p.defeated && p !== actor && (kind === "pass" || p.role === "inner"));
    if (alive.length === 0) return null;

    let best = null;
    let bestScore = -Infinity;
    for (const target of alive) {
      const dx = target.x - actor.x;
      const dy = target.y - actor.y;
      const length = Math.hypot(dx, dy) || 1;
      const dot = (dx / length) * aim.x + (dy / length) * aim.y;
      const distanceScore = Math.max(0, 1 - length / 1200);
      const score = dot * 2 + distanceScore;
      if (score > bestScore) {
        best = target;
        bestScore = score;
      }
    }
    return best || alive[0];
  }

  getShootSelection(actor, playerIndex = 1) {
    const input = this.input.getCurrent(playerIndex);
    const moveX = input.moveX;
    const moveY = input.moveY;
    const enemies = actor.team === "left" ? this.rightTeam : this.leftTeam;
    const defaultAim = this.getDefaultShootAim(actor, enemies);

    if (Math.hypot(moveX, moveY) < 0.35) {
      return {
        target: this.findShootTargetInAim(actor, enemies, defaultAim),
        aim: defaultAim
      };
    }

    const aim = this.normalizedVector(moveX, moveY);
    return {
      target: this.findDirectionalTarget(actor, enemies, aim, "shoot"),
      aim
    };
  }

  getDefaultShootAim(actor, enemies) {
    const innerEnemies = enemies.filter((p) => !p.defeated && p.role === "inner");
    if (innerEnemies.length === 0) return { x: actor.team === "left" ? 1 : -1, y: 0 };
    const centerX = innerEnemies.reduce((sum, p) => sum + p.x, 0) / innerEnemies.length;
    const centerY = innerEnemies.reduce((sum, p) => sum + p.y, 0) / innerEnemies.length;
    const dx = centerX - actor.x;
    const dy = centerY - actor.y;
    if (actor.role === "inner") {
      const forward = actor.team === "left" ? 1 : -1;
      return { x: forward, y: 0 };
    }
    return this.normalizedVector(dx, dy);
  }

  findShootTargetInAim(actor, candidates, aim) {
    const alive = candidates.filter((p) => !p.defeated && p.role === "inner");
    let best = null;
    let bestScore = -Infinity;
    for (const target of alive) {
      const dx = target.x - actor.x;
      const dy = target.y - actor.y;
      const length = Math.hypot(dx, dy) || 1;
      const dot = (dx / length) * aim.x + (dy / length) * aim.y;
      if (dot < 0.34) continue;

      const distanceScore = Math.max(0, 1 - length / 1300);
      const score = dot * 2 + distanceScore;
      if (score > bestScore) {
        best = target;
        bestScore = score;
      }
    }
    return best;
  }

  findForwardShootTarget(actor, candidates, forward) {
    const alive = candidates.filter((p) => !p.defeated && p.role === "inner");
    let best = null;
    let bestScore = -Infinity;
    for (const target of alive) {
      const dx = target.x - actor.x;
      const dy = target.y - actor.y;
      const inFront = dx * forward;
      if (inFront <= 0) continue;
      if (Math.abs(dy) > 250) continue;

      const laneScore = Math.max(0, 1 - Math.abs(dy) / 260);
      const distanceScore = Math.max(0, 1 - inFront / 1200);
      const score = laneScore * 2 + distanceScore;
      if (score > bestScore) {
        best = target;
        bestScore = score;
      }
    }
    return best;
  }

  findVerticalShootTarget(actor, candidates, forward, vertical) {
    const alive = candidates.filter((p) => !p.defeated && p.role === "inner");
    let best = null;
    let bestScore = -Infinity;
    for (const target of alive) {
      const dx = target.x - actor.x;
      const dy = target.y - actor.y;
      const verticalDistance = dy * vertical;
      if (verticalDistance <= 0) continue;

      const frontBonus = dx * forward > 0 ? 0.65 : -0.2;
      const verticalScore = Math.max(0, 1 - Math.abs(dx) / 1000);
      const distanceScore = Math.max(0, 1 - Math.hypot(dx, dy) / 1400);
      const score = verticalScore * 1.4 + distanceScore + frontBonus;
      if (score > bestScore) {
        best = target;
        bestScore = score;
      }
    }
    return best;
  }

  getCurrentPassTarget() {
    if (!this.ball.owner) return null;
    if (this.ball.owner.team === "left") {
      return this.getPassTarget(this.ball.owner, this.input.current.moveX, this.input.current.moveY);
    }
    if (this.gameMode === "versus" && this.ball.owner.team === "right") {
      return this.getPassTarget(this.ball.owner, this.input.currentP2.moveX, this.input.currentP2.moveY);
    }
    return null;
  }

  getCpuShootSelection(actor) {
    const enemies = actor.team === "left" ? this.rightTeam : this.leftTeam;
    const aim = this.getDefaultShootAim(actor, enemies);
    return {
      target: this.findShootTargetInAim(actor, enemies, aim),
      aim
    };
  }

  getCurrentShootTarget() {
    if (!this.ball.owner) return null;
    const playerIndex = this.ball.owner.team === "right" ? 2 : 1;
    if (this.ball.owner.team === "right" && this.gameMode !== "versus") return null;
    if (
      this.pendingThrow &&
      this.pendingThrow.kind === "shoot" &&
      this.pendingThrow.actor === this.ball.owner
    ) {
      return this.pendingThrow.target;
    }
    return this.getShootSelection(this.ball.owner, playerIndex).target;
  }

  getShotMultiplier(actor, aim, chargeRatio = 0, aerialCombo = false) {
    const runupDot = Math.max(0, actor.runupDirX * aim.x + actor.runupDirY * aim.y);
    const runupRatio = Math.min(1, actor.runupTime / 2);
    const directionMatch = runupDot < 0.55 ? 0 : runupDot;
    const runBonus = 0.38 * runupRatio * directionMatch;
    const movingTowardThrow = actor.vx * aim.x + actor.vy * aim.y > actor.speed * 0.35;
    const dashBonus = actor.isDashing && movingTowardThrow ? 0.22 : 0;
    const powerBonus = ((actor.stats?.power || 5) - 5) * 0.04;
    const speedBonus = ((actor.stats?.speed || 5) - 5) * 0.025;
    const jumpBonus = actor.jumpZ > 0 ? Math.min(0.35, actor.jumpZ / 260) : 0;
    const chargeBonus = chargeRatio * 0.55;
    const aerialBonus = aerialCombo ? 0.5 : 0;
    return Math.max(0.7, Math.min(2.15, 0.7 + runBonus + dashBonus + powerBonus + speedBonus + jumpBonus + chargeBonus + aerialBonus));
  }

  getPassTarget(actor, moveX, moveY) {
    if (!actor) return null;
    if (Math.hypot(moveX, moveY) < 0.35) {
      return this.getNearestPassTarget(actor);
    }

    if (Math.abs(moveY) >= Math.abs(moveX)) {
      return this.getPassTargetByLane(actor, moveY < 0 ? "top" : "bottom") || this.getNearestPassTarget(actor);
    }

    return this.getPassTargetByLane(actor, moveX > 0 ? "right" : "left") || this.getNearestPassTarget(actor);
  }

  getPassTargetByLane(actor, lane) {
    const team = actor.team === "left" ? this.leftTeam : this.rightTeam;
    const isLeftTeam = actor.team === "left";

    if (actor.role === "inner") {
      if (lane === "top") return this.findTeammateByZone(team, isLeftTeam ? "rightTopOut" : "leftTopOut", actor);
      if (lane === "bottom") return this.findTeammateByZone(team, isLeftTeam ? "rightBottomOut" : "leftBottomOut", actor);
      if (lane === "right") return this.findTeammateByZone(team, isLeftTeam ? "rightSideOut" : "leftSideOut", actor);
    } else {
      if (lane === "top") return this.findTeammateByZone(team, isLeftTeam ? "leftTopOut" : "rightTopOut", actor);
      if (lane === "bottom") return this.findTeammateByZone(team, isLeftTeam ? "leftBottomOut" : "rightBottomOut", actor);
      if (lane === "right") {
        const farSideOut = this.findTeammateByZone(team, isLeftTeam ? "rightSideOut" : "leftSideOut", actor);
        return farSideOut || this.getNearestInnerTeammate(actor);
      }
    }

    return null;
  }

  findTeammateByZone(team, zone, actor) {
    return team.find((p) => p.zone === zone && p !== actor && !p.defeated) || null;
  }

  getNearestInnerTeammate(actor) {
    const team = actor.team === "left" ? this.leftTeam : this.rightTeam;
    return this.getNearestFrom(actor, team.filter((p) => p.role === "inner" && p !== actor && !p.defeated));
  }

  getNearestPassTarget(actor) {
    const team = actor.team === "left" ? this.leftTeam : this.rightTeam;
    return this.getNearestFrom(actor, team.filter((p) => p !== actor && !p.defeated));
  }

  getCpuPassTarget(actor) {
    const team = actor.team === "left" ? this.leftTeam : this.rightTeam;
    const candidates = team.filter((p) => p !== actor && !p.defeated);
    if (candidates.length === 0) return null;

    const enemyCenterX = actor.team === "left"
      ? this.areas.rightInner.x + this.areas.rightInner.w * 0.5
      : this.areas.leftInner.x + this.areas.leftInner.w * 0.5;

    let best = null;
    let bestScore = -Infinity;
    for (const candidate of candidates) {
      const distance = Math.hypot(candidate.x - actor.x, candidate.y - actor.y);
      const closerToEnemy = -Math.abs(candidate.x - enemyCenterX);
      const outfieldBonus = candidate.role === "out" ? 180 : 0;
      const sameLaneBonus = Math.max(0, 180 - Math.abs(candidate.y - actor.y));
      const score = closerToEnemy * 0.25 - distance * 0.18 + outfieldBonus + sameLaneBonus;
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    return best;
  }

  getNearestFrom(actor, candidates) {
    let best = null;
    let bestDistance = Infinity;
    for (const candidate of candidates) {
      const distance = Math.hypot(candidate.x - actor.x, candidate.y - actor.y);
      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    }
    return best;
  }

  normalizedVector(dx, dy) {
    const length = Math.hypot(dx, dy) || 1;
    return { x: dx / length, y: dy / length };
  }

  handlePassReceives() {
    if (!this.ball.isFlying || this.ball.kind !== "pass" || !this.ball.target) return;
    const target = this.ball.target;
    if (target.defeated) {
      this.ball.drop();
      return;
    }
    const horizontalDistance = Math.hypot(this.ball.x - target.x, this.ball.y - (target.y - 34));
    if (
      this.ball.passDuration > 0 &&
      this.ball.passTime >= this.ball.passDuration * 0.45 &&
      horizontalDistance < 180 &&
      this.ball.z > target.jumpZ + 155 &&
      target.jumpZ <= 0 &&
      target.jumpVelocity <= 0
    ) {
      target.jump(GAME_CONFIG.battle);
    }
    const catchX = target.x;
    const catchY = target.y - target.jumpZ - 130;
    const ballY = this.ball.y - this.ball.z;
    const visualDistance = Math.hypot(this.ball.x - catchX, ballY - catchY);
    const nearEndOfArc = this.ball.passDuration > 0 && this.ball.passTime >= this.ball.passDuration * 0.9;
    if (nearEndOfArc && visualDistance < this.ball.radius + 46) {
      if (target.jumpZ > 18) {
        target.aerialPassCatchTimer = 1.1;
      }
      target.startCatch(0.34);
      this.ball.pickUp(target);
      this.setControlledMember(target.team, target);
      this.spawnEffect(target.x, target.y - 55, "#ffffff", "catch");
    }
  }

  handleFriendlyMissedReceives(team) {
    if (!this.ball.isFlying || !this.ball.thrower || this.ball.thrower.team !== team[0]?.team) return;
    if (!this.ball.target || !team.includes(this.ball.target)) return;

    const target = this.ball.target;
    if (target.defeated || target.catchTimer > 0) return;

    const distance = Math.hypot(this.ball.x - target.x, this.ball.y - (target.y - 34));
    if (distance < this.ball.radius + 30 && this.ball.z < target.jumpZ + 58) {
      this.ball.vx = (Math.random() - 0.5) * 170;
      this.ball.vy = 120 + Math.random() * 130;
      this.ball.vz = 90;
      this.ball.drop();
      this.spawnEffect(target.x, target.y - 48, "#ffd98a", "pass");
    }
  }

  handleManualCatch(team) {
    if (!this.ball.isFlying || !this.ball.catchable || !this.ball.thrower) return;

    for (const catcher of team) {
      if (catcher.defeated || catcher.catchTimer <= 0 || catcher === this.ball.thrower) continue;
      const friendly = catcher.team === this.ball.thrower.team;
      const box = this.getCatchArea(catcher, friendly);
      if (!this.circleRectOverlap(this.ball.x, this.ball.y - this.ball.z, this.ball.radius, box)) continue;
      if (!this.canManualCatch(catcher, friendly)) continue;

      const caughtFriendlyPassInAir = friendly && this.ball.kind === "pass" && catcher.jumpZ > 18;
      const caughtEnemyShot = !friendly && this.ball.kind === "shoot";
      this.ball.pickUp(catcher);
      if (caughtFriendlyPassInAir) {
        catcher.aerialPassCatchTimer = 1.1;
      }
      if (caughtEnemyShot) {
        catcher.startCatchSuccess();
      }
      catcher.throwLockTimer = 0.2;
      catcher.catchTimer = 0;
      this.setControlledMember(catcher.team, catcher);
      this.spawnEffect(catcher.x, catcher.y - 55, caughtEnemyShot ? "#8fffe8" : "#ffffff", caughtEnemyShot ? "catchStrong" : "catch");
      break;
    }
  }

  canManualCatch(catcher, friendly) {
    if (this.ball.kind === "pass") {
      return true;
    }

    if (this.ball.kind !== "shoot") {
      return friendly;
    }

    const thrower = this.ball.thrower;
    const throwDistance = thrower ? Math.hypot(catcher.x - thrower.x, catcher.y - thrower.y) : 700;
    const facingIncoming = this.isFacingIncomingBall(catcher);
    const timing = Math.max(0, 1 - Math.abs(this.ball.x - catcher.x) / 150);
    const distanceFactor = Math.max(0.22, Math.min(1, throwDistance / 760));
    const facingFactor = facingIncoming ? 1 : 0.08;
    const chance = Math.max(0.03, Math.min(0.92, (0.22 + timing * 0.58) * distanceFactor * facingFactor));
    if (Math.random() <= chance) return true;

    catcher.catchTimer = 0;
    this.spawnEffect(catcher.x, catcher.y - 66, "#ffb09a", "pass");
    return false;
  }

  isFacingIncomingBall(catcher) {
    const horizontal = Math.abs(this.ball.vx) >= Math.abs(this.ball.vy);
    if (horizontal) {
      return catcher.facing === (this.ball.vx < 0 ? 1 : -1);
    }
    if (this.ball.vy < 0) return catcher.visualDirection === "down";
    return catcher.visualDirection === "up";
  }

  getCatchArea(catcher, friendly) {
    const box = catcher.getCatchBox(GAME_CONFIG.battle);
    const isPassCut = this.ball.kind === "pass" && this.ball.thrower && this.ball.thrower.team !== catcher.team;
    if (!friendly && !isPassCut) return box;
    const jumpBonus = catcher.jumpZ > 0 ? 72 : 0;
    const inflateX = isPassCut ? 72 : 96;
    const inflateY = (isPassCut ? 64 : 76) + jumpBonus;
    return {
      x: box.x - inflateX,
      y: box.y - inflateY,
      w: box.w + inflateX * 2,
      h: box.h + inflateY * 2
    };
  }

  handleHits() {
    if (!this.ball.isFlying || this.ball.kind !== "shoot" || !this.ball.thrower || this.ball.hasBounced) return;
    const targets = this.ball.thrower.team === "left" ? this.rightTeam : this.leftTeam;

    for (const target of targets) {
      if (target.defeated || target.role !== "inner") continue;
      const hit = target.getHitBox();
      const ballY = this.ball.y - this.ball.z;
      if (!this.circleRectOverlap(this.ball.x, ballY, this.ball.radius, hit)) continue;

      const direction = this.ball.vx >= 0 ? 1 : -1;
      const damaged = target.takeDamage(this.ball.power, direction, GAME_CONFIG.battle);
      if (damaged) {
        this.spawnEffect(this.ball.x, ballY, "#ffe46a", "hit");
        this.spawnDamageNumber(target, this.ball.power);
        this.ball.bounceFromHit(-direction, this.ball.power / 20);
      }
      break;
    }
  }

  checkGameOver() {
    const leftAlive = this.leftTeam.some((p) => p.role === "inner" && p.hp > 0);
    const rightAlive = this.rightTeam.some((p) => p.role === "inner" && p.hp > 0);

    if (!rightAlive) {
      this.state = "gameOver";
      this.message = "YOU WIN";
    } else if (!leftAlive) {
      this.state = "gameOver";
      this.message = "YOU LOSE";
    } else if (this.ball.owner) {
      this.message = this.ball.owner.team === "left" ? "MY TEAM BALL" : "ENEMY BALL";
    } else {
      this.message = "LOOSE BALL";
    }
  }

  getFullCourtView() {
    const c = GAME_CONFIG.court;
    const rects = [c, ...Object.values(this.areas)].map((area) => this.getAreaBounds(area));
    const minX = Math.min(...rects.map((rect) => rect.x)) - 24;
    const maxX = Math.max(...rects.map((rect) => rect.x + rect.w)) + 24;
    const minY = GAME_CONFIG.view.worldTop;
    const maxY = Math.max(...rects.map((rect) => rect.y + rect.h)) + GAME_CONFIG.view.worldBottomPadding;
    const worldWidth = maxX - minX;
    const worldHeight = maxY - minY;
    const availableWidth = GAME_CONFIG.width - GAME_CONFIG.view.paddingX * 2;
    const availableHeight = GAME_CONFIG.height - GAME_CONFIG.view.paddingY * 2;
    const zoom = GAME_CONFIG.view.playZoom || 1;
    const scale = Math.min(availableWidth / worldWidth, availableHeight / worldHeight) * zoom;

    return {
      x: minX,
      y: minY,
      scale,
      renderScaleCompensation: 1 / zoom,
      offsetX: (GAME_CONFIG.width - worldWidth * scale) * 0.5,
      offsetY: (GAME_CONFIG.height - worldHeight * scale) * 0.5
    };
  }

  getPlayerControlledMember() {
    const holder = this.ball.owner && this.ball.owner.team === "left" ? this.ball.owner : null;
    if (holder) return holder;
    const found = this.leftTeam.find((p) => p.id === this.controlledPlayerId && !p.defeated);
    return found || this.getControllableLeftMembers()[0] || this.leftTeam[0];
  }

  getRightControlledMember() {
    const holder = this.ball.owner && this.ball.owner.team === "right" ? this.ball.owner : null;
    if (holder) return holder;
    const found = this.rightTeam.find((p) => p.id === this.controlledRightPlayerId && !p.defeated);
    return found || this.getControllableMembers("right")[0] || this.rightTeam[0];
  }

  getControllableLeftMembers() {
    return this.getControllableMembers("left");
  }

  getTeamMembers(team) {
    return team === "left" ? this.leftTeam : this.rightTeam;
  }

  getOpponentTeamMembers(team) {
    return team === "left" ? this.rightTeam : this.leftTeam;
  }

  getControllableMembers(team, innerOnly = false) {
    return this.getTeamMembers(team).filter((p) => !p.defeated && (!innerOnly || p.role === "inner"));
  }

  getControlledMember(team) {
    return team === "left" ? this.getPlayerControlledMember() : this.getRightControlledMember();
  }

  setControlledMember(team, member) {
    if (!member) return;
    if (team === "left") {
      this.controlledPlayerId = member.id;
    } else {
      this.controlledRightPlayerId = member.id;
    }
  }

  updateControlSwitching(delta) {
    this.autoSwitchCooldown = Math.max(0, this.autoSwitchCooldown - delta);
    this.rightStickSwitchCooldown = Math.max(0, this.rightStickSwitchCooldown - delta);
    this.manualSwitchGrace = Math.max(0, this.manualSwitchGrace - delta);
    this.updateTeamControlSwitching("left", 1);

    if (this.gameMode === "versus") {
      this.autoSwitchCooldownP2 = Math.max(0, this.autoSwitchCooldownP2 - delta);
      this.rightStickSwitchCooldownP2 = Math.max(0, this.rightStickSwitchCooldownP2 - delta);
      this.manualSwitchGraceP2 = Math.max(0, this.manualSwitchGraceP2 - delta);
      this.updateTeamControlSwitching("right", 2);
    }
  }

  autoSwitchToIncomingShotTarget() {
    this.autoSwitchIncomingShotForTeam("left");
    if (this.gameMode === "versus") {
      this.autoSwitchIncomingShotForTeam("right");
    }
  }

  autoSwitchIncomingShotForTeam(team) {
    if (!this.ball.isFlying || this.ball.kind !== "shoot" || !this.ball.thrower) return;
    if (this.ball.thrower.team === team) return;
    const target = this.ball.target;
    if (!target || target.team !== team || target.defeated) return;
    if (team === "left" && this.controlledPlayerId === target.id) return;
    if (team === "right" && this.controlledRightPlayerId === target.id) return;

    this.setControlledMember(team, target);
    if (team === "left") {
      this.autoSwitchCooldown = 0.25;
    } else {
      this.autoSwitchCooldownP2 = 0.25;
    }
  }

  updateTeamControlSwitching(team, playerIndex) {
    if (this.shouldSwitchByRightStick(team, playerIndex)) {
      this.switchControlledMemberByRightStick(team, playerIndex);
      this.setRightStickCooldown(team, 0.24);
      this.setAutoSwitchCooldown(team, 0.9);
      this.setManualSwitchGrace(team, 0.9);
      const enemyHolder = this.getEnemyHolderForTeam(team);
      if (enemyHolder) this.setLastEnemyHolderId(team, enemyHolder.id);
      return;
    }

    if (this.autoSwitchToEnemyThreatTarget(team)) {
      return;
    }

    this.autoSwitchToNearestBall(team);
  }

  shouldSwitchByRightStick(team, playerIndex) {
    if (this.getRightStickCooldown(team) > 0) return false;
    const current = this.input.getCurrent(playerIndex);
    const power = Math.hypot(current.rightX, current.rightY);
    return power > 0.62 && (this.input.wasRightStickFlicked(playerIndex) || this.getRightStickCooldown(team) <= 0);
  }

  switchControlledMemberByRightStick(team, playerIndex) {
    const holder = this.ball.owner && this.ball.owner.team === team ? this.ball.owner : null;
    if (holder) return;

    const enemyHolder = this.getEnemyHolderForTeam(team);
    const candidates = this.getControllableMembers(team, Boolean(enemyHolder));
    if (candidates.length <= 1) return;

    const current = this.getControlledMember(team);
    const input = this.input.getCurrent(playerIndex);
    const aim = {
      x: input.rightX,
      y: input.rightY
    };
    const aimLength = Math.hypot(aim.x, aim.y) || 1;
    aim.x /= aimLength;
    aim.y /= aimLength;

    let best = null;
    let bestScore = -Infinity;
    for (const candidate of candidates) {
      if (candidate === current) continue;
      const dx = candidate.x - current.x;
      const dy = candidate.y - current.y;
      const length = Math.hypot(dx, dy) || 1;
      const dot = (dx / length) * aim.x + (dy / length) * aim.y;
      const score = dot * 2 + Math.max(0, 1 - length / 900);
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }

    if (best) {
      this.setControlledMember(team, best);
      this.spawnEffect(best.x, best.y - 72, "#ffffff", "catch");
    }
  }

  autoSwitchToNearestBall(team = "left") {
    if (this.getAutoSwitchCooldown(team) > 0) return;
    if (this.getManualSwitchGrace(team) > 0) return;
    if (!this.ball.isLoose || this.ball.owner) return;

    const candidates = this.getControllableMembers(team);
    if (candidates.length === 0) return;

    let nearest = null;
    let nearestDistance = Infinity;
    for (const candidate of candidates) {
      const distance = Math.hypot(candidate.x - this.ball.x, candidate.y - this.ball.y);
      if (distance < nearestDistance) {
        nearest = candidate;
        nearestDistance = distance;
      }
    }

    const current = this.getControlledMember(team);
    if (!nearest || nearest.id === current.id) return;

    const currentDistance = Math.hypot(current.x - this.ball.x, current.y - this.ball.y);
    if (nearestDistance < 180 || nearestDistance + 12 < currentDistance) {
      this.setControlledMember(team, nearest);
      this.setAutoSwitchCooldown(team, 0.25);
      this.spawnEffect(nearest.x, nearest.y - 72, "#ffffff", "catch");
    }
  }

  autoSwitchToEnemyThreatTarget(team = "left") {
    const enemyHolder = this.getEnemyHolderForTeam(team);
    if (!enemyHolder) {
      this.setLastEnemyHolderId(team, null);
      return false;
    }

    const current = this.getControlledMember(team);
    const target = this.findNearestInnerThreatTarget(team, enemyHolder);
    if (!target) return true;

    const lastEnemyHolderId = this.getLastEnemyHolderId(team);
    const mustSwitch = current.defeated || current.role !== "inner";
    if (this.getAutoSwitchCooldown(team) > 0 && lastEnemyHolderId === enemyHolder.id && !mustSwitch) {
      return true;
    }

    const shouldSwitch = lastEnemyHolderId !== enemyHolder.id || mustSwitch;
    if (mustSwitch || (shouldSwitch && this.getManualSwitchGrace(team) <= 0)) {
      this.setControlledMember(team, target);
      this.spawnEffect(target.x, target.y - 72, "#ffffff", "catch");
    }

    this.setLastEnemyHolderId(team, enemyHolder.id);
    return true;
  }

  getEnemyHolderForTeam(team) {
    return this.ball.owner && this.ball.owner.team !== team ? this.ball.owner : null;
  }

  findNearestInnerThreatTarget(team, enemyHolder) {
    const candidates = this.getControllableMembers(team, true);
    if (candidates.length === 0) return null;

    let best = null;
    let bestDistance = Infinity;
    for (const candidate of candidates) {
      const distance = Math.hypot(candidate.x - enemyHolder.x, candidate.y - enemyHolder.y);
      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    }
    return best;
  }

  getAutoSwitchCooldown(team) {
    return team === "left" ? this.autoSwitchCooldown : this.autoSwitchCooldownP2;
  }

  setAutoSwitchCooldown(team, value) {
    if (team === "left") this.autoSwitchCooldown = value;
    else this.autoSwitchCooldownP2 = value;
  }

  getRightStickCooldown(team) {
    return team === "left" ? this.rightStickSwitchCooldown : this.rightStickSwitchCooldownP2;
  }

  setRightStickCooldown(team, value) {
    if (team === "left") this.rightStickSwitchCooldown = value;
    else this.rightStickSwitchCooldownP2 = value;
  }

  getManualSwitchGrace(team) {
    return team === "left" ? this.manualSwitchGrace : this.manualSwitchGraceP2;
  }

  setManualSwitchGrace(team, value) {
    if (team === "left") this.manualSwitchGrace = value;
    else this.manualSwitchGraceP2 = value;
  }

  getLastEnemyHolderId(team) {
    return team === "left" ? this.lastEnemyHolderId : this.lastEnemyHolderIdP2;
  }

  setLastEnemyHolderId(team, value) {
    if (team === "left") this.lastEnemyHolderId = value;
    else this.lastEnemyHolderIdP2 = value;
  }

  vectorTo(member, x, y, dash) {
    const dx = x - member.x;
    const dy = y - member.y;
    const length = Math.hypot(dx, dy) || 1;
    return {
      moveX: Math.abs(dx) > 8 ? dx / length : 0,
      moveY: Math.abs(dy) > 8 ? dy / length : 0,
      dash
    };
  }

  spawnEffect(x, y, color, type) {
    this.effects.push({ x, y, color, type, life: 0.32, maxLife: 0.32 });
  }

  spawnDamageNumber(target, amount) {
    this.effects.push({
      x: target.x + target.facing * -34,
      y: target.y - target.jumpZ - 92,
      color: "#ff3d2f",
      type: "damageNumber",
      text: `-${Math.round(amount)}`,
      life: 0.75,
      maxLife: 0.75
    });
  }

  updateEffects(delta) {
    this.effects = this.effects.filter((effect) => {
      effect.life -= delta;
      return effect.life > 0;
    });
  }

  draw() {
    const context = this.context;
    context.clearRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
    if (this.state === "modeSelect") {
      this.drawModeSelect();
      this.drawGamepadButtonMonitor();
      return;
    }
    if (this.state === "teamSelect") {
      this.drawTeamSelect();
      this.drawGamepadButtonMonitor();
      return;
    }
    context.fillStyle = "#bfc36d";
    context.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

    const view = this.getFullCourtView();
    context.save();
    context.translate(view.offsetX, view.offsetY);
    context.scale(view.scale, view.scale);
    context.translate(-view.x, -view.y);
    this.drawBackground();
    this.drawCourt();

    const active = this.getPlayerControlledMember();
    const activeRight = this.gameMode === "versus" ? this.getRightControlledMember() : null;
    const passTarget = this.getCurrentPassTarget();
    const shootTarget = this.getCurrentShootTarget();
    const drawables = [...this.players, this.ball].sort((a, b) => {
      const ay = a instanceof Ball ? a.y : a.y;
      const by = b instanceof Ball ? b.y : b.y;
      return ay - by;
    });

    for (const item of drawables) {
      if (item instanceof Ball) {
        item.draw(context, DEBUG_MODE);
      } else {
        item.draw(
          context,
          GAME_CONFIG.battle,
          DEBUG_MODE,
          item === active || item === activeRight,
          item === passTarget,
          item === shootTarget,
          SHOW_HITBOXES,
          view.renderScaleCompensation
        );
      }
    }

    this.drawEffects();
    this.drawChargeEffect();
    if (DEBUG_MODE) this.drawDebugAreas();
    context.restore();

    this.drawHud();
    this.drawGamepadButtonMonitor();

    if (this.state === "paused") {
      this.drawOverlay("PAUSE", "STARTまたはEscapeで再開");
    } else if (this.state === "gameOver") {
      this.drawOverlay(this.message, "ボタン1またはSpaceでモード選択へ");
    }
  }

  drawModeSelect() {
    const context = this.context;
    const centerX = GAME_CONFIG.width * 0.5;
    this.drawMenuBackground();
    context.save();
    context.textAlign = "center";
    context.fillStyle = "#fff7df";
    context.strokeStyle = "#27324a";
    context.lineWidth = 7;
    context.font = "bold 58px Meiryo, sans-serif";
    context.strokeText("モードセレクト", centerX, 155);
    context.fillText("モードセレクト", centerX, 155);

    const modes = [
      { label: "一人用", note: "1P vs CPU" },
      { label: "二人用", note: "2P対戦" }
    ];
    for (let i = 0; i < modes.length; i += 1) {
      const x = 410 + i * 460;
      const selected = this.modeIndex === i;
      context.fillStyle = selected ? "rgba(255,244,168,0.95)" : "rgba(255,255,255,0.78)";
      context.strokeStyle = selected ? "#263241" : "rgba(38,50,65,0.45)";
      context.lineWidth = selected ? 6 : 3;
      this.roundRect(context, x - 150, 275, 300, 140, 8);
      context.fill();
      context.stroke();
      context.fillStyle = "#263241";
      context.font = "bold 36px Meiryo, sans-serif";
      context.fillText(modes[i].label, x, 332);
      context.font = "20px Meiryo, sans-serif";
      context.fillText(modes[i].note, x, 374);
    }

    context.fillStyle = "#fff7df";
    context.font = "20px Meiryo, sans-serif";
    context.fillText("左右で選択 / ボタン1で決定", centerX, 520);
    context.restore();
  }

  drawTeamSelect() {
    const context = this.context;
    const centerX = GAME_CONFIG.width * 0.5;
    this.drawMenuBackground();
    context.save();
    context.textAlign = "center";
    context.fillStyle = "#fff7df";
    context.strokeStyle = "#27324a";
    context.lineWidth = 6;
    context.font = "bold 46px Meiryo, sans-serif";
    context.strokeText("チーム編成", centerX, 84);
    context.fillText("チーム編成", centerX, 84);

    this.drawTeamSelectSide("left", 120, "#0057ff");
    this.drawTeamSelectSide("right", 700, "#f01818");
    this.drawMatchStartButton();

    context.fillStyle = "#fff7df";
    context.font = "18px Meiryo, sans-serif";
    context.fillText("左右で選手選択 / ボタン2でタイプ変更・試合開始 / ボタン1で戻る", centerX, 688);
    context.restore();
  }

  drawTeamSelectSide(side, x, color) {
    const context = this.context;
    const title = side === "left" ? "1P TEAM" : "2P TEAM";
    context.save();
    context.textAlign = "left";
    context.fillStyle = color;
    context.font = "bold 28px Meiryo, sans-serif";
    context.fillText(title, x, 142);

    for (let i = 0; i < 6; i += 1) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const cardX = x + col * 155;
      const cardY = 165 + row * 205;
      const selected = this.isTeamSelectSlotSelected(side, i);
      const type = this.teamSelections[side][i];
      const definition = CHARACTER_TYPES[type] || CHARACTER_TYPES.normal;

      context.fillStyle = selected ? "rgba(255,244,168,0.96)" : "rgba(255,255,255,0.82)";
      context.strokeStyle = selected ? "#263241" : "rgba(38,50,65,0.36)";
      context.lineWidth = selected ? 5 : 2;
      this.roundRect(context, cardX, cardY, 132, 158, 8);
      context.fill();
      context.stroke();

      this.drawCharacterPreview(cardX + 66, cardY + 108, side, type);
      context.textAlign = "center";
      context.fillStyle = "#263241";
      context.font = "bold 18px Meiryo, sans-serif";
      context.fillText(definition.label, cardX + 66, cardY + 32);
      context.font = "14px Meiryo, sans-serif";
      context.fillText(i < 3 ? `内野 ${i + 1}` : `外野 ${i - 2}`, cardX + 66, cardY + 52);
    }
    context.restore();
  }

  isTeamSelectSlotSelected(side, slot) {
    if (this.gameMode === "versus") return this.teamSelectionSlots[side] === slot;
    return this.teamSelectionSide === side && this.teamSelectionSlot === slot;
  }

  drawMatchStartButton() {
    const context = this.context;
    const centerX = GAME_CONFIG.width * 0.5;
    const selected = this.gameMode === "versus"
      ? this.teamSelectionSlots.left === 6 || this.teamSelectionSlots.right === 6
      : this.teamSelectionSlot === 6;
    context.save();
    context.textAlign = "center";
    context.fillStyle = selected ? "rgba(255,244,168,0.98)" : "rgba(255,255,255,0.82)";
    context.strokeStyle = selected ? "#263241" : "rgba(38,50,65,0.45)";
    context.lineWidth = selected ? 6 : 3;
    this.roundRect(context, centerX - 200, 620, 400, 44, 8);
    context.fill();
    context.stroke();
    context.fillStyle = "#263241";
    context.font = "bold 24px Meiryo, sans-serif";
    context.fillText("試合開始", centerX, 650);
    if (this.gameMode === "versus" && selected) {
      context.font = "bold 14px Meiryo, sans-serif";
      context.fillStyle = "#4b5360";
      const labels = [];
      if (this.teamSelectionSlots.left === 6) labels.push("1P");
      if (this.teamSelectionSlots.right === 6) labels.push("2P");
      context.fillText(labels.join(" / "), centerX, 612);
    }
    context.restore();
  }

  drawCharacterPreview(x, y, side, type) {
    const context = this.context;
    const body = CHARACTER_TYPES[type] || CHARACTER_TYPES.normal;
    const suit = side === "left" ? "#0057ff" : "#f01818";
    context.save();
    context.translate(x, y);
    context.scale(body.scaleX * 0.48, body.scaleY * 0.48);
    context.strokeStyle = suit;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 11 * body.legWidth;
    context.beginPath();
    context.moveTo(-12, -8);
    context.lineTo(-20, -8 + 36 * body.legLength);
    context.lineTo(-18, -8 + 64 * body.legLength);
    context.moveTo(12, -8);
    context.lineTo(20, -8 + 36 * body.legLength);
    context.lineTo(18, -8 + 64 * body.legLength);
    context.stroke();
    context.strokeStyle = "#ffd1a3";
    context.lineWidth = 9 * body.armWidth;
    context.beginPath();
    context.moveTo(-20, -54);
    context.lineTo(-34, -28);
    context.lineTo(-38, 0);
    context.moveTo(20, -54);
    context.lineTo(34, -28);
    context.lineTo(38, 0);
    context.stroke();
    context.fillStyle = suit;
    context.beginPath();
    context.ellipse(0, -42, 27 * body.torsoX, 38 * body.torsoY, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ffd1a3";
    context.beginPath();
    context.arc(0, -100, 29, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  drawMenuBackground() {
    const context = this.context;
    const gradient = context.createLinearGradient(0, 0, 0, GAME_CONFIG.height);
    gradient.addColorStop(0, "#65b7f0");
    gradient.addColorStop(0.48, "#dff8ff");
    gradient.addColorStop(0.49, "#bfc36d");
    gradient.addColorStop(1, "#9ca650");
    context.fillStyle = gradient;
    context.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
    context.fillStyle = "rgba(96, 86, 38, 0.16)";
    for (let y = 370; y < GAME_CONFIG.height; y += 18) {
      for (let x = 0; x < GAME_CONFIG.width; x += 26) {
        context.fillRect(x + ((y / 18) % 2) * 10, y, 4, 3);
      }
    }
  }

  drawBackground() {
    const context = this.context;
    const c = GAME_CONFIG.court;
    const width = c.x + c.w + 260;
    context.fillStyle = "#bfc36d";
    context.fillRect(c.x - 260, 0, width + 520, GAME_CONFIG.height);
  }

  drawMountain(x, y) {
    const context = this.context;
    context.fillStyle = "#2c6ccf";
    context.beginPath();
    context.moveTo(x - 260, y + 128);
    context.lineTo(x, y);
    context.lineTo(x + 260, y + 128);
    context.closePath();
    context.fill();
    context.fillStyle = "#f7f7ff";
    context.beginPath();
    context.moveTo(x - 62, y + 58);
    context.lineTo(x, y);
    context.lineTo(x + 72, y + 62);
    context.lineTo(x + 34, y + 52);
    context.lineTo(x + 8, y + 86);
    context.lineTo(x - 22, y + 54);
    context.closePath();
    context.fill();
  }

  drawSchoolWall(x, y) {
    const context = this.context;
    context.fillStyle = "#f6f4e8";
    context.fillRect(x, y, 310, 76);
    context.fillStyle = "#de2e2e";
    for (let i = 0; i < 6; i += 1) {
      context.fillRect(x + 8 + i * 52, y, 24, 76);
    }
    context.strokeStyle = "#34323b";
    context.lineWidth = 3;
    context.strokeRect(x, y, 310, 76);
    context.fillStyle = "#ff90c9";
    for (let i = 0; i < 4; i += 1) {
      context.beginPath();
      context.arc(x + 24 + i * 78, y - 7, 26, 0, Math.PI * 2);
      context.arc(x + 52 + i * 78, y - 12, 24, 0, Math.PI * 2);
      context.fill();
    }
  }

  drawCourt() {
    const context = this.context;
    const c = GAME_CONFIG.court;
    const topY = c.y + 10;
    const bottomY = c.y + c.h;
    const backY = c.y + 96;
    const frontY = c.y + c.h - 38;

    const project = (x, y) => {
      const t = Math.max(0, Math.min(1, (y - topY) / (bottomY - topY)));
      const scale = 0.78 + t * 0.22;
      return {
        x: c.centerX + (x - c.centerX) * scale,
        y
      };
    };

    const drawProjectedQuad = (x, y, w, h, fillStyle) => {
      const p1 = project(x, y);
      const p2 = project(x + w, y);
      const p3 = project(x + w, y + h);
      const p4 = project(x, y + h);
      context.fillStyle = fillStyle;
      context.beginPath();
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.lineTo(p3.x, p3.y);
      context.lineTo(p4.x, p4.y);
      context.closePath();
      context.fill();
    };

    const strokeProjectedLine = (x1, y1, x2, y2) => {
      const p1 = project(x1, y1);
      const p2 = project(x2, y2);
      context.beginPath();
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.stroke();
    };

    drawProjectedQuad(c.x, topY, c.w, c.h - 10, "#bfc36d");
    drawProjectedQuad(this.areas.leftSideOut.x, this.areas.leftSideOut.y, this.areas.leftSideOut.w, this.areas.leftSideOut.h, "#bfc36d");
    drawProjectedQuad(this.areas.rightSideOut.x, this.areas.rightSideOut.y, this.areas.rightSideOut.w, this.areas.rightSideOut.h, "#bfc36d");

    context.strokeStyle = "#f7f4df";
    context.lineWidth = 7;
    strokeProjectedLine(c.x, backY, c.x + c.w, backY);
    strokeProjectedLine(c.x + c.w, backY, c.x + c.w, frontY);
    strokeProjectedLine(c.x + c.w, frontY, c.x, frontY);
    strokeProjectedLine(c.x, frontY, c.x, backY);
    strokeProjectedLine(c.centerX, backY, c.centerX, frontY);

    context.lineWidth = 5;
    strokeProjectedLine(c.x, backY, c.x + c.w, backY);
    strokeProjectedLine(c.x, frontY, c.x + c.w, frontY);

    drawProjectedQuad(c.x + 12, backY + 8, c.w / 2 - 24, frontY - backY - 16, "rgba(48,135,242,0.035)");
    drawProjectedQuad(c.centerX + 12, backY + 8, c.w / 2 - 24, frontY - backY - 16, "rgba(240,90,69,0.035)");
  }

  drawHud() {
    const context = this.context;
    const centerX = GAME_CONFIG.width * 0.5;
    context.save();
    context.fillStyle = "rgba(21, 29, 38, 0.72)";
    this.roundRect(context, centerX - 248, 18, 496, 58, 8);
    context.fill();
    context.fillStyle = "#fff7df";
    context.font = "bold 24px Meiryo, sans-serif";
    context.textAlign = "center";
    context.fillText(this.message, centerX, 44);
    context.font = "15px Meiryo, sans-serif";
    context.fillStyle = this.input.gamepadConnected ? "#c6ff9a" : "#f7d8a8";
    context.fillText(this.input.getGamepadStatusText(), centerX, 66);
    context.restore();
  }

  drawGamepadButtonMonitor() {
    const context = this.context;
    const text = this.input.getPressedButtonText();
    context.save();
    context.font = "bold 16px Meiryo, sans-serif";
    context.textAlign = "right";
    const width = Math.max(190, context.measureText(text).width + 28);
    const x = GAME_CONFIG.width - width - 14;
    const y = GAME_CONFIG.height - 46;
    context.fillStyle = "rgba(20, 26, 36, 0.72)";
    this.roundRect(context, x, y, width, 32, 7);
    context.fill();
    context.fillStyle = "#fff7df";
    context.fillText(text, GAME_CONFIG.width - 28, y + 22);
    context.restore();
  }

  drawEffects() {
    const context = this.context;
    for (const effect of this.effects) {
      const progress = 1 - effect.life / effect.maxLife;
      if (effect.type === "damageNumber") {
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.textAlign = "center";
        context.font = "bold 28px Meiryo, sans-serif";
        context.lineWidth = 5;
        context.strokeStyle = "rgba(38, 50, 65, 0.86)";
        context.fillStyle = effect.color;
        context.strokeText(effect.text, effect.x, effect.y - progress * 42);
        context.fillText(effect.text, effect.x, effect.y - progress * 42);
        context.restore();
        continue;
      }
      const radius = effect.type === "hit" ? 22 + progress * 58 : 24 + progress * 24;
      context.save();
      context.globalAlpha = 1 - progress;
      context.strokeStyle = effect.color;
      context.lineWidth = effect.type === "hit" || effect.type === "catchStrong" ? 7 : 4;
      context.beginPath();
      context.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
      context.stroke();
      if (effect.type === "hit" || effect.type === "catchStrong") {
        const count = effect.type === "catchStrong" ? 12 : 8;
        for (let i = 0; i < count; i += 1) {
          const angle = (Math.PI * 2 * i) / count;
          context.beginPath();
          const inner = effect.type === "catchStrong" ? radius * 0.55 : 0;
          context.moveTo(effect.x + Math.cos(angle) * inner, effect.y + Math.sin(angle) * inner);
          context.lineTo(effect.x + Math.cos(angle) * radius, effect.y + Math.sin(angle) * radius);
          context.stroke();
        }
      }
      context.restore();
    }
  }

  drawChargeEffect() {
    if (!this.chargingThrow || this.chargingThrow.kind !== "shoot") return;
    const charged = this.chargingThrow;
    const actor = charged.actor;
    if (!actor || actor.defeated) return;

    const context = this.context;
    const ratio = Math.min(1, charged.chargeTime / 2);
    const pulse = 0.5 + Math.sin(performance.now() / 75) * 0.5;
    const x = actor.x + actor.facing * 18;
    const y = actor.y - actor.jumpZ - 62;
    const radius = 34 + ratio * 34 + pulse * 7;

    context.save();
    context.globalAlpha = 0.58 + ratio * 0.3;
    context.strokeStyle = ratio > 0.85 ? "#ff563d" : "#ffe46a";
    context.lineWidth = 4 + ratio * 4;
    context.beginPath();
    context.arc(x, y, radius, -Math.PI * 0.35, Math.PI * 1.35);
    context.stroke();

    context.globalAlpha = 0.34 + ratio * 0.28;
    context.fillStyle = ratio > 0.85 ? "#ff7a42" : "#fff0a0";
    for (let i = 0; i < 10; i += 1) {
      const angle = performance.now() / 260 + i * Math.PI * 0.2;
      const sparkRadius = radius * (0.72 + (i % 3) * 0.12);
      context.beginPath();
      context.arc(
        x + Math.cos(angle) * sparkRadius,
        y + Math.sin(angle) * sparkRadius * 0.66,
        3 + ratio * 4,
        0,
        Math.PI * 2
      );
      context.fill();
    }
    context.restore();
  }

  drawOverlay(title, subtitle) {
    const context = this.context;
    const centerX = GAME_CONFIG.width * 0.5;
    context.save();
    context.fillStyle = "rgba(20, 26, 36, 0.5)";
    context.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
    context.textAlign = "center";
    context.fillStyle = "#fff7d7";
    context.strokeStyle = "#27324a";
    context.lineWidth = 8;
    context.font = "bold 68px Meiryo, sans-serif";
    context.strokeText(title, centerX, 318);
    context.fillText(title, centerX, 318);
    context.fillStyle = "#ffffff";
    context.font = "bold 27px Meiryo, sans-serif";
    context.fillText(subtitle, centerX, 388);
    context.restore();
  }

  drawDebugAreas() {
    const context = this.context;
    context.strokeStyle = "rgba(0,255,255,0.45)";
    context.lineWidth = 2;
    for (const area of Object.values(this.areas)) {
      context.strokeRect(area.x, area.y, area.w, area.h);
    }
  }

  circleRectOverlap(cx, cy, radius, rect) {
    const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
    const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
    return Math.hypot(cx - closestX, cy - closestY) <= radius;
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

window.addEventListener("DOMContentLoaded", () => {
  new DodgeballGame();
});
