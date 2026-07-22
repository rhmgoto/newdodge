const DEBUG_MODE = false;
const SHOW_HITBOXES = false;
const TEAM_SELECTION_COUNT = 8;
const TEAM_SELECT_COLUMNS = 5;
const CPU_OPPONENT_SLOT = TEAM_SELECTION_COUNT;
const START_SLOT = TEAM_SELECTION_COUNT + 1;
const CUSTOM_TEAM_CONFIRM_SLOT = TEAM_SELECTION_COUNT + 2;
const MAX_SHOT_CHARGE_TIME = 1.5;
const SPECIAL_SHOT_ANTICIPATION_TIME = 0.15;
const CATCH_DIFFICULTY = {
  normal: { duration: 0.3, areaScale: 1, chanceScale: 1, perfectTiming: 0.42 },
  kiai: { duration: 0.24, areaScale: 0.9, maxChance: 0.43, chanceScale: 0.62, perfectTiming: 0.52 },
  soul: { duration: 0.216, areaScale: 0.88, maxChance: 0.25, chanceScale: 0.255, perfectTiming: 0.5 },
  triple: { duration: 0.198, areaScale: 0.82, maxChance: 0.2, chanceScale: 0.205, perfectTiming: 0.56 },
  lightning: { duration: 0.18, areaScale: 0.78, maxChance: 0.175, chanceScale: 0.18, perfectTiming: 0.62 },
  boomerang: { duration: 0.189, areaScale: 0.78, maxChance: 0.15, chanceScale: 0.155, perfectTiming: 0.64 },
  boost: { duration: 0.162, areaScale: 0.72, maxChance: 0.125, chanceScale: 0.13, perfectTiming: 0.68 },
  iron: { duration: 0.153, areaScale: 0.68, maxChance: 0.09, chanceScale: 0.095, perfectTiming: 0.74 },
  slap: { duration: 0.16, areaScale: 0.72, maxChance: 0.1, chanceScale: 0.105, perfectTiming: 0.72 },
  tsutenkaku: { duration: 0.17, areaScale: 0.75, maxChance: 0.14, chanceScale: 0.145, perfectTiming: 0.7 }
};
const COUNTER_CONFIG = {
  lockDuration: 0.2,
  windowDuration: 0.55,
  damageScale: 1.5,
  speedScale: 1.3,
  knockbackScale: 1.4,
  staminaCost: 22,
  releaseDelay: 0.16
};

const GAME_CONFIG = {
  width: 1440,
  height: 720,
  court: {
    x: -693,
    y: 138,
    w: 3227,
    h: 1537,
    centerX: 920
  },
  view: {
    paddingX: 8,
    paddingY: 0,
    playZoom: 1,
    worldTop: -120,
    worldBottomPadding: 0
  },
  player: {
    maxHp: 60,
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
    radius: 37,
    damage: 20,
    shootSpeed: 1377,
    specialShootSpeed: 1197,
    passSpeed: 645,
    moveBonus: 0.34,
    gravity: 520,
    hitBounceX: 260,
    hitBounceY: 270
  },
  battle: {
    pickupDistance: 62,
    rollingPickupDistance: 210,
    catchDuration: 0.3,
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
    turnDuration: 0,
    turnSpeedMultiplier: 1,
    depthTop: 140,
    depthBottom: 1080,
    characterScale: 1.56,
    spiritMax: 10,
    spiritFillSeconds: 10,
    spiritDamageGain: 2,
    spiritDefeatGain: 5,
    stamina: {
      shootCost: 18,
      shootChargeDrainPerSecond: 11,
      duckCost: 14,
      dashDrainPerSecond: 38,
      recoveryPerSecond: 72,
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
    this.typeOrder = ["normal", "power", "speed", "jump", "mage"];
    this.teamSelectionSide = "left";
    this.teamSelectionSlot = 0;
    this.teamSelectionSlots = { left: 0, right: 0 };
    this.teamSelections = {
      left: this.createDefaultTeamSelection(),
      right: this.createDefaultTeamSelection()
    };
    this.selectedTeamIndices = { left: 0, right: 1 };
    this.teamSelectionConfirmed = { left: false, right: false };
    this.teamRosterConfirmed = { left: false, right: false };
    this.cpuOpponentIndex = 0;
    this.watchCpuLeftIndex = 2;
    this.watchCpuRightIndex = 3;
    this.watchSelectionSlot = 0;
    this.pauseMenuIndex = 0;
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
    this.shotMultiplierDisplay = null;
    this.tripleBalls = [];
    this.lastRuntimeError = null;
    this.runtimeErrorCount = 0;
    this.effects = [];
    this.screenShakeTimer = 0;
    this.screenShakeDuration = 0;
    this.screenShakeStrength = 0;
    this.boostEffectStage = 0;
    this.looseOutfieldRecoveryTimer = 0;
    this.lastLooseOutfieldBallPosition = null;
    this.lastLooseOutfieldReceiverDistance = Infinity;
    this.message = "READY";
    this.setupMatch();
    requestAnimationFrame((time) => this.loop(time));
  }

  createDefaultTeamSelection() {
    return Array(TEAM_SELECTION_COUNT).fill("normal");
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
    this.boostEffectStage = 0;
    this.looseOutfieldRecoveryTimer = 0;
    this.lastLooseOutfieldBallPosition = null;
    this.lastLooseOutfieldReceiverDistance = Infinity;
    this.ball.x = court.centerX;
    this.ball.y = court.y + court.h * 0.55;
    this.cpuControllerLeft = this.gameMode === "watch"
      ? new CPUController(this.leftTeam, this.rightTeam, this.ball, {
        ...GAME_CONFIG.battle,
        court,
        areas: this.areas,
        teamName: "left",
        opponentName: "right",
        isSpiritReady: (team) => this.hasFullSpirit(team)
      })
      : null;
    this.cpuController = this.gameMode !== "versus"
      ? new CPUController(this.rightTeam, this.leftTeam, this.ball, {
        ...GAME_CONFIG.battle,
        court,
        areas: this.areas,
        teamName: "right",
        opponentName: "left",
        isSpiritReady: (team) => this.hasFullSpirit(team)
      })
      : null;
    this.effects = [];
    this.screenShakeTimer = 0;
    this.screenShakeDuration = 0;
    this.screenShakeStrength = 0;
    this.message = "READY";
    this.spiritPoints = { left: 0, right: 0 };
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
    this.shotMultiplierDisplay = null;
    this.tripleBalls = [];
  }

  createAreas() {
    const c = GAME_CONFIG.court;
    const halfW = c.w / 2;
    const topY = c.y + 10;
    const backY = c.y + 96;
    const frontY = c.y + c.h - 38;
    const outfieldDepth = 204;
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
      leftTopOut: { x: c.x + 22, y: backY - outfieldDepth, w: halfW - 44, h: outfieldDepth },
      leftBottomOut: { x: c.x + 22, y: frontY, w: halfW - 44, h: outfieldDepth },
      leftSideOut: trapezoid(
        sideOutTop,
        sideOutBottom,
        projectedX(c.x, sideOutTop) - 360,
        projectedX(c.x, sideOutTop) - 10,
        projectedX(c.x, sideOutBottom) - 360,
        projectedX(c.x, sideOutBottom) - 10
      ),
      rightTopOut: { x: c.centerX + 22, y: backY - outfieldDepth, w: halfW - 44, h: outfieldDepth },
      rightBottomOut: { x: c.centerX + 22, y: frontY, w: halfW - 44, h: outfieldDepth },
      rightSideOut: trapezoid(
        sideOutTop,
        sideOutBottom,
        projectedX(c.x + c.w, sideOutTop) + 10,
        projectedX(c.x + c.w, sideOutTop) + 360,
        projectedX(c.x + c.w, sideOutBottom) + 10,
        projectedX(c.x + c.w, sideOutBottom) + 360
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
    const teamDefinition = this.getTeamDefinitionForSide(team);
    const cpuTeam = teamDefinition?.isCustom ? null : teamDefinition;
    const color = teamDefinition?.uniformColor || (isLeft ? "#3087f2" : "#f05a45");
    const pantsColor = teamDefinition?.pantsColor || color;
    const trim = teamDefinition?.trimColor || (isLeft ? "#f6fbff" : "#fff0cf");
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

    const roster = [
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

    for (const player of roster) {
      if (
        !player.specialShotType &&
        (teamDefinition?.id === "blue-stars" || teamDefinition?.id === "red-fires") &&
        player.characterType === "normal"
      ) {
        player.specialShotType = "kiai";
      }
      const area = this.areas[player.zone];
      player.clampToArea(area);
      player.homeX = player.x;
      player.homeY = player.y;
    }
    return roster;
  }

  createTeam(team) {
    const isLeft = team === "left";
    const teamDefinition = this.getTeamDefinitionForSide(team);
    const cpuTeam = teamDefinition?.isCustom ? null : teamDefinition;
    const color = teamDefinition?.uniformColor || (isLeft ? "#3087f2" : "#f05a45");
    const pantsColor = teamDefinition?.pantsColor || color;
    const trim = teamDefinition?.trimColor || (isLeft ? "#f6fbff" : "#fff0cf");
    const innerArea = isLeft ? this.areas.leftInner : this.areas.rightInner;
    const sideArea = isLeft ? this.areas.rightSideOut : this.areas.leftSideOut;
    const topArea = isLeft ? this.areas.rightTopOut : this.areas.leftTopOut;
    const bottomArea = isLeft ? this.areas.rightBottomOut : this.areas.leftBottomOut;
    const prefix = isLeft ? "left" : "right";
    const selectedTypes = this.teamSelections?.[team] || Array(TEAM_SELECTION_COUNT).fill("normal");
    const innerZone = isLeft ? "leftInner" : "rightInner";
    const makePlayer = (options) => new Player({
      team,
      maxHp: GAME_CONFIG.player.maxHp,
      maxStamina: GAME_CONFIG.player.maxStamina,
      speed: GAME_CONFIG.player.speed,
      throwPower: GAME_CONFIG.player.throwPower,
      uniformColor: color,
      pantsColor,
      uniformEmblem: teamDefinition?.uniformEmblem,
      trimColor: trim,
      cpuControlled: this.isCpuControlledSide(team),
      ...options
    });
    const innerPositions = [
      { x: innerArea.x + innerArea.w * (isLeft ? 0.24 : 0.76), y: innerArea.y + innerArea.h * 0.34 },
      { x: innerArea.x + innerArea.w * (isLeft ? 0.42 : 0.58), y: innerArea.y + innerArea.h * 0.22 },
      { x: innerArea.x + innerArea.w * 0.5, y: innerArea.y + innerArea.h * 0.5 },
      { x: innerArea.x + innerArea.w * (isLeft ? 0.36 : 0.64), y: innerArea.y + innerArea.h * 0.72 },
      { x: innerArea.x + innerArea.w * (isLeft ? 0.68 : 0.32), y: innerArea.y + innerArea.h * 0.62 }
    ];

    const getCpuPlayer = (slot) => cpuTeam?.players?.[slot] || null;
    const roster = innerPositions.map((position, index) => {
      const cpuPlayer = getCpuPlayer(index);
      return makePlayer({
        id: `${prefix}-inner-${index + 1}`,
        name: cpuPlayer?.name || teamDefinition?.innerNames?.[index] || `${prefix}-inner-${index + 1}`,
        role: "inner",
        zone: innerZone,
        x: position.x,
        y: position.y,
        characterType: cpuPlayer?.characterType || (teamDefinition?.isCustom ? selectedTypes[index] : teamDefinition?.characterType) || selectedTypes[index],
        maxHp: cpuPlayer?.maxHp ?? teamDefinition?.maxHp,
        maxStamina: cpuPlayer?.maxStamina ?? teamDefinition?.maxStamina,
        stats: cpuPlayer?.stats || teamDefinition?.stats,
        hairColor: cpuPlayer?.hairColor || teamDefinition?.hairColor || (index === 1 ? "#6d3a1d" : index === 2 ? "#1f1f22" : undefined),
        eyeColor: cpuPlayer?.eyeColor || teamDefinition?.eyeColor,
        uniformEmblem: cpuPlayer?.uniformEmblem || teamDefinition?.uniformEmblem,
        captain: Boolean(cpuPlayer?.captain),
        cpuProfile: cpuPlayer?.cpuProfile || cpuTeam?.cpuProfile,
        specialShotType: cpuPlayer?.specialShotType
      });
    });

    roster.push(
      makePlayer({
        id: `${prefix}-out-top`,
        role: "out",
        zone: isLeft ? "rightTopOut" : "leftTopOut",
        x: topArea.x + topArea.w * 0.55,
        y: topArea.y + topArea.h * 0.45,
        name: getCpuPlayer(5)?.name || teamDefinition?.outNames?.[0] || `${prefix}-out-top`,
        characterType: getCpuPlayer(5)?.characterType || (teamDefinition?.isCustom ? selectedTypes[5] : teamDefinition?.characterType) || selectedTypes[5],
        maxHp: getCpuPlayer(5)?.maxHp ?? teamDefinition?.maxHp,
        maxStamina: getCpuPlayer(5)?.maxStamina ?? teamDefinition?.maxStamina,
        stats: getCpuPlayer(5)?.stats || teamDefinition?.stats,
        hairColor: getCpuPlayer(5)?.hairColor || teamDefinition?.hairColor,
        eyeColor: getCpuPlayer(5)?.eyeColor || teamDefinition?.eyeColor,
        uniformEmblem: getCpuPlayer(5)?.uniformEmblem || teamDefinition?.uniformEmblem,
        captain: Boolean(getCpuPlayer(5)?.captain),
        cpuProfile: getCpuPlayer(5)?.cpuProfile || cpuTeam?.cpuProfile,
        specialShotType: getCpuPlayer(5)?.specialShotType
      }),
      makePlayer({
        id: `${prefix}-out-bottom`,
        name: getCpuPlayer(6)?.name || teamDefinition?.outNames?.[1] || `${prefix}-out-bottom`,
        role: "out",
        zone: isLeft ? "rightBottomOut" : "leftBottomOut",
        x: bottomArea.x + bottomArea.w * 0.45,
        y: bottomArea.y + bottomArea.h * 0.5,
        characterType: getCpuPlayer(6)?.characterType || (teamDefinition?.isCustom ? selectedTypes[6] : teamDefinition?.characterType) || selectedTypes[6],
        maxHp: getCpuPlayer(6)?.maxHp ?? teamDefinition?.maxHp,
        maxStamina: getCpuPlayer(6)?.maxStamina ?? teamDefinition?.maxStamina,
        stats: getCpuPlayer(6)?.stats || teamDefinition?.stats,
        hairColor: getCpuPlayer(6)?.hairColor || teamDefinition?.hairColor,
        eyeColor: getCpuPlayer(6)?.eyeColor || teamDefinition?.eyeColor,
        uniformEmblem: getCpuPlayer(6)?.uniformEmblem || teamDefinition?.uniformEmblem,
        captain: Boolean(getCpuPlayer(6)?.captain),
        cpuProfile: getCpuPlayer(6)?.cpuProfile || cpuTeam?.cpuProfile,
        specialShotType: getCpuPlayer(6)?.specialShotType
      }),
      makePlayer({
        id: `${prefix}-out-side`,
        name: getCpuPlayer(7)?.name || teamDefinition?.outNames?.[2] || `${prefix}-out-side`,
        role: "out",
        zone: isLeft ? "rightSideOut" : "leftSideOut",
        x: sideArea.x + sideArea.w * 0.5,
        y: sideArea.y + sideArea.h * 0.52,
        characterType: getCpuPlayer(7)?.characterType || (teamDefinition?.isCustom ? selectedTypes[7] : teamDefinition?.characterType) || selectedTypes[7],
        maxHp: getCpuPlayer(7)?.maxHp ?? teamDefinition?.maxHp,
        maxStamina: getCpuPlayer(7)?.maxStamina ?? teamDefinition?.maxStamina,
        stats: getCpuPlayer(7)?.stats || teamDefinition?.stats,
        hairColor: getCpuPlayer(7)?.hairColor || teamDefinition?.hairColor,
        eyeColor: getCpuPlayer(7)?.eyeColor || teamDefinition?.eyeColor,
        uniformEmblem: getCpuPlayer(7)?.uniformEmblem || teamDefinition?.uniformEmblem,
        captain: Boolean(getCpuPlayer(7)?.captain),
        cpuProfile: getCpuPlayer(7)?.cpuProfile || cpuTeam?.cpuProfile,
        specialShotType: getCpuPlayer(7)?.specialShotType
      })
    );

    for (const player of roster) {
      if (
        !player.specialShotType &&
        (teamDefinition?.id === "blue-stars" || teamDefinition?.id === "red-fires") &&
        player.characterType === "normal"
      ) {
        player.specialShotType = "kiai";
      }
      const area = this.areas[player.zone];
      player.clampToArea(area);
      player.homeX = player.x;
      player.homeY = player.y;
    }
    return roster;
  }

  getCpuOpponentTeams() {
    const player = (name, position, characterType, maxHp, maxStamina, power, speed, jump, technique, specialShotType, extra = {}) => ({
      name,
      position,
      characterType,
      maxHp,
      maxStamina,
      stats: { power, speed, jump, technique },
      specialShotType,
      ...extra
    });
    return [
      {
        id: "town-dodgies",
        name: "\u753a\u5185\u30c9\u30c3\u30b8\u30fc\u30ba",
        description: "\u7df4\u7fd2\u7528\u306e\u5f31\u3044\u30c1\u30fc\u30e0",
        characterType: "normal",
        innerNames: ["\u305f\u3051\u3057", "\u3053\u3046\u305f", "\u307e\u3055\u308b", "\u3086\u3046\u304d", "\u3057\u3093\u307a\u3044"],
        outNames: ["\u3072\u308d\u3057", "\u3051\u3093\u3058", "\u305f\u304b\u3057"],
        uniformColor: "#f7f7f2",
        pantsColor: "#8f9299",
        trimColor: "#d9dde4",
        hairColor: "#17191d",
        maxHp: 50,
        maxStamina: 100,
        stats: { power: 5, speed: 5, jump: 5, technique: 5 },
        cpuProfile: "townDodgies",
        players: [
          player("たけし", "inner", "normal", 50, 100, 5, 5, 5, 5, "kiai"),
          player("こうた", "inner", "normal", 50, 100, 5, 5, 5, 5, "kiai"),
          player("まさる", "inner", "normal", 50, 100, 5, 5, 5, 5, "kiai", { captain: true }),
          player("ゆうき", "inner", "normal", 50, 100, 5, 5, 5, 5, "kiai"),
          player("しんぺい", "inner", "normal", 50, 100, 5, 5, 5, 5, "kiai"),
          player("ひろし", "out", "normal", 50, 100, 5, 5, 5, 5, "kiai"),
          player("けんじ", "out", "normal", 50, 100, 5, 5, 5, 5, "kiai"),
          player("たかし", "out", "normal", 50, 100, 5, 5, 5, 5, "kiai")
        ]
      },
      {
        id: "bakusou-boys",
        name: "\u7206\u8d70\u30dc\u30fc\u30a4\u30ba",
        description: "\u4fca\u8db3\u306e\u9078\u624b\u304c\u591a\u3044\u30c1\u30fc\u30e0",
        characterType: "jump",
        innerNames: ["\u305f\u3051\u308b", "\u308a\u3087\u3046\u305f", "\u3057\u3087\u3046\u305f", "\u3086\u3046\u307e", "\u306f\u308b\u304d"],
        outNames: ["\u3060\u3044\u304d", "\u3051\u3044\u305f", "\u3057\u3085\u3093"],
        uniformColor: "#ffd83d",
        pantsColor: "#111318",
        trimColor: "#fff3a6",
        hairColor: "#111318",
        maxHp: 70,
        maxStamina: 100,
        stats: { power: 6, speed: 8, jump: 7, technique: 6 },
        cpuProfile: "bakusouBoys",
        players: [
          player("たける", "inner", "jump", 70, 100, 6, 8, 7, 6, "kiai"),
          player("りょうた", "inner", "jump", 70, 100, 6, 8, 7, 6, "kiai"),
          player("しょうた", "inner", "jump", 70, 100, 6, 8, 7, 6, "boost", { captain: true }),
          player("ゆうま", "inner", "jump", 70, 100, 6, 8, 7, 6, "kiai"),
          player("はるき", "inner", "jump", 70, 100, 6, 8, 7, 6, "kiai"),
          player("だいき", "out", "jump", 70, 100, 6, 8, 7, 6, "kiai"),
          player("けいた", "out", "jump", 70, 100, 6, 8, 7, 6, "kiai"),
          player("しゅん", "out", "jump", 70, 100, 6, 8, 7, 6, "kiai")
        ]
      },
      {
        id: "hinomaru-bombers",
        name: "\u65e5\u306e\u4e38\u30dc\u30f3\u30d0\u30fc\u30ba",
        description: "\u65e5\u672c\u4ee3\u8868\u30ec\u30d9\u30eb\u306e\u5f37\u8c6a\u30c1\u30fc\u30e0",
        characterType: "normal",
        innerNames: ["\u308c\u3064", "\u3080\u3055\u3057", "\u3057\u3087\u3046", "\u3058\u3093", "\u3060\u3044\u3061"],
        outNames: ["\u306f\u3084\u3068", "\u3048\u3093\u3058", "\u3072\u304b\u308b"],
        uniformColor: "#f7f7f2",
        pantsColor: "#f7f7f2",
        trimColor: "#d9dde4",
        hairColor: "#111318",
        uniformEmblem: "hinomaru",
        maxHp: 150,
        maxStamina: 110,
        stats: { power: 9, speed: 9, jump: 9, technique: 8 },
        cpuProfile: "hinomaruBombers",
        players: [
          player("れつ", "inner", "jump", 150, 110, 8, 11, 9, 8, "kiai"),
          player("むさし", "inner", "normal", 150, 110, 9, 9, 9, 8, "kiai"),
          player("しょう", "inner", "speed", 150, 110, 9, 8, 10, 7, "boomerang"),
          player("じん", "inner", "normal", 150, 110, 9, 9, 9, 8, "kiai"),
          player("だいち", "inner", "power", 250, 150, 13, 7, 9, 8, "lightning", { captain: true }),
          player("はやと", "out", "normal", 150, 110, 9, 9, 9, 7, "kiai"),
          player("えんじ", "out", "speed", 150, 110, 9, 8, 9, 7, "kiai"),
          player("ひかる", "out", "jump", 150, 110, 8, 11, 9, 7, "kiai")
        ]
      },
      {
        id: "american-big-balls",
        name: "\u30a2\u30e1\u30ea\u30ab\u30f3\u30d3\u30c3\u30b0\u30dc\u30fc\u30eb\u30ba",
        description: "\u30a8\u30fc\u30b9\u306e\u30b8\u30e7\u30fc\u3092\u4e2d\u5fc3\u306b\u653b\u3081\u308b\u30d1\u30ef\u30d5\u30eb\u30c1\u30fc\u30e0",
        characterType: "normal",
        innerNames: ["\u30c8\u30e0", "\u30d6\u30e9\u30a4\u30a2\u30f3", "\u30b8\u30e7\u30fc", "\u30cb\u30c3\u30af", "\u30de\u30c3\u30af\u30b9"],
        outNames: ["\u30b9\u30c6\u30a3\u30fc\u30d6", "\u30ec\u30c3\u30af\u30b9", "\u30d6\u30ed\u30c3\u30af"],
        uniformColor: "#14233f",
        pantsColor: "#f7f7f2",
        trimColor: "#d92525",
        hairColor: "#f2c14e",
        eyeColor: "#2b73ff",
        uniformEmblem: "usaFlag",
        maxHp: 140,
        maxStamina: 100,
        stats: { power: 10, speed: 10, jump: 11, technique: 8 },
        cpuProfile: "americanBigBalls",
        players: [
          player("\u30c8\u30e0", "inner", "speed", 140, 100, 9, 12, 13, 8, "kiai"),
          player("\u30d6\u30e9\u30a4\u30a2\u30f3", "inner", "power", 140, 100, 11, 9, 8, 7, "kiai"),
          player("\u30b8\u30e7\u30fc", "inner", "normal", 320, 150, 16, 13, 13, 11, "triple", { captain: true }),
          player("\u30cb\u30c3\u30af", "inner", "normal", 140, 100, 10, 11, 10, 8, "kiai"),
          player("\u30de\u30c3\u30af\u30b9", "inner", "jump", 150, 100, 8, 13, 9, 8, "kiai"),
          player("\u30b9\u30c6\u30a3\u30fc\u30d6", "out", "normal", 150, 100, 9, 8, 9, 7, "kiai"),
          player("\u30ec\u30c3\u30af\u30b9", "out", "power", 140, 100, 11, 7, 10, 7, "kiai"),
          player("\u30d6\u30ed\u30c3\u30af", "out", "speed", 130, 100, 9, 9, 13, 8, "kiai")
        ]
      },
      {
        id: "iron-gers",
        name: "アイアンガーズ",
        description: "ドイツをイメージした堅牢な強豪チーム",
        characterType: "normal",
        innerNames: ["シュナイダー", "ミュラー", "クライン", "ベッカー", "ホフマン"],
        outNames: ["リヒター", "ケラー", "フィッシャー"],
        uniformColor: "#d92525",
        pantsColor: "#111318",
        trimColor: "#f7f7f2",
        hairColor: "#f2c14e",
        eyeColor: "#2b73ff",
        uniformEmblem: "usaStripes",
        maxHp: 140,
        maxStamina: 100,
        stats: { power: 9, speed: 8, jump: 8, technique: 8 },
        players: [
          player("シュナイダー", "inner", "normal", 270, 100, 12, 8, 9, 8, "iron", { captain: true }),
          player("ミュラー", "inner", "normal", 140, 100, 9, 8, 8, 7, "iron"),
          player("クライン", "inner", "normal", 140, 100, 9, 8, 7, 8, "iron"),
          player("ベッカー", "inner", "normal", 140, 100, 8, 9, 9, 7, "iron"),
          player("ホフマン", "inner", "normal", 140, 100, 9, 8, 8, 8, "iron"),
          player("リヒター", "out", "normal", 140, 100, 8, 7, 9, 8, "iron"),
          player("ケラー", "out", "normal", 140, 100, 9, 8, 8, 7, "iron"),
          player("フィッシャー", "out", "normal", 140, 100, 7, 8, 8, 8, "iron")
        ]
      },
      {
        id: "kuidao-rangers",
        name: "\u304f\u3044\u3060\u304a\u30ec\u30f3\u30b8\u30e3\u30fc\u30ba",
        description: "\u5927\u962a\u4ee3\u8868\u306e\u30ce\u30ea\u3068\u52e2\u3044\u3067\u653b\u3081\u308b\u30c1\u30fc\u30e0",
        characterType: "normal",
        innerNames: ["\u305f\u3053\u3078\u3044", "\u304a\u3053\u306e\u307f", "\u304f\u3057\u304b\u3064", "\u304f\u3044\u3060\u304a\u308c", "\u304a\u304a\u304d\u306b"],
        outNames: ["\u306a\u3093\u3067\u3084", "\u307e\u3044\u3069", "\u3069\u3046\u3068\u3093"],
        uniformColor: "#ffd83d",
        pantsColor: "#f7f7f2",
        trimColor: "#fff1a8",
        hairColor: "#111318",
        uniformEmblem: "osakaStripes",
        maxHp: 120,
        maxStamina: 100,
        stats: { power: 7, speed: 6, jump: 7, technique: 7 },
        cpuProfile: "kuidaoRangers",
        players: [
          player("\u305f\u3053\u3078\u3044", "inner", "jump", 180, 100, 9, 8, 9, 9, "tsutenkaku", { uniformEmblem: "takoBib" }),
          player("\u304a\u3053\u306e\u307f", "inner", "normal", 120, 100, 6, 6, 8, 6, "kiai"),
          player("\u304f\u3057\u304b\u3064", "inner", "normal", 120, 100, 8, 8, 7, 8, "kiai"),
          player("\u304f\u3044\u3060\u304a\u308c", "inner", "normal", 120, 100, 7, 8, 7, 7, "kiai"),
          player("\u304a\u304a\u304d\u306b", "inner", "normal", 120, 100, 7, 5, 9, 7, "kiai"),
          player("\u306a\u3093\u3067\u3084", "out", "normal", 120, 100, 7, 6, 7, 6, "kiai"),
          player("\u307e\u3044\u3069", "out", "normal", 120, 100, 6, 7, 6, 7, "kiai"),
          player("\u3069\u3046\u3068\u3093", "out", "normal", 120, 100, 8, 6, 7, 7, "kiai")
        ]
      },
      {
        id: "doskois",
        name: "ドスコイズ",
        description: "力自慢の力士が集合した重量級チーム",
        characterType: "power",
        innerNames: ["よこづな", "らいのふじ", "はりておう", "がんさい", "ごうのやま"],
        outNames: ["だいふんか", "かいりきやま", "ちゃんこまる"],
        uniformColor: "#ffd1a3",
        pantsColor: "#ffd1a3",
        trimColor: "#f0b67f",
        hairColor: "#111318",
        uniformEmblem: "sumo",
        maxHp: 170,
        maxStamina: 100,
        stats: { power: 11, speed: 4, jump: 7, technique: 7 },
        cpuProfile: "doskois",
        players: [
          player("よこづな", "inner", "power", 280, 100, 15, 7, 8, 8, "slap", { uniformEmblem: "sumoGold" }),
          player("らいのふじ", "inner", "power", 170, 100, 11, 4, 7, 7, "slap", { uniformEmblem: "sumo" }),
          player("はりておう", "inner", "power", 170, 100, 12, 4, 7, 7, "slap", { uniformEmblem: "sumo" }),
          player("がんさい", "inner", "power", 170, 100, 10, 4, 7, 7, "slap", { uniformEmblem: "sumo" }),
          player("ごうのやま", "inner", "power", 170, 100, 10, 4, 7, 7, "slap", { uniformEmblem: "sumo" }),
          player("だいふんか", "out", "power", 170, 100, 10, 4, 7, 7, "slap", { uniformEmblem: "sumo" }),
          player("かいりきやま", "out", "power", 170, 100, 12, 4, 7, 7, "slap", { uniformEmblem: "sumo" }),
          player("ちゃんこまる", "out", "power", 170, 100, 9, 4, 8, 6, "slap", { uniformEmblem: "sumo" })
        ]
      }
    ];
  }

  getCustomTeamDefinitions() {
    return [
      {
        id: "blue-stars",
        name: "ブルースターズ",
        description: "1P向けの自由編成チーム",
        isCustom: true,
        defaultSide: "left",
        characterType: "normal",
        innerNames: ["\u3042\u304a", "\u3050\u3093\u3058\u3087\u3046", "\u3053\u304a\u308a", "\u3046\u307f", "\u305d\u3089"],
        outNames: ["\u30d6\u30eb\u30fc", "\u30a2\u30af\u30a2", "\u30aa\u30fc\u30b7\u30e3\u30f3"],
        uniformColor: "#0057ff",
        pantsColor: "#0057ff",
        trimColor: "#f6fbff",
        hairColor: "#f2c14e",
        maxHp: GAME_CONFIG.player.maxHp,
        maxStamina: GAME_CONFIG.player.maxStamina,
        stats: GAME_CONFIG.player.stats
      },
      {
        id: "red-fires",
        name: "レッドファイアーズ",
        description: "2P向けの自由編成チーム",
        isCustom: true,
        defaultSide: "right",
        characterType: "normal",
        innerNames: ["\u3042\u304b", "\u3057\u3093\u304f", "\u3082\u307f\u3058", "\u308c\u3063\u304b", "\u307b\u3080\u3089"],
        outNames: ["\u3050\u308c\u3093", "\u3079\u306b", "\u304b\u3048\u3093"],
        uniformColor: "#f01818",
        pantsColor: "#f01818",
        trimColor: "#fff0cf",
        hairColor: "#f2c14e",
        maxHp: GAME_CONFIG.player.maxHp,
        maxStamina: GAME_CONFIG.player.maxStamina,
        stats: GAME_CONFIG.player.stats
      }
    ];
  }

  getSelectableTeams() {
    return [...this.getCustomTeamDefinitions(), ...this.getCpuOpponentTeams()];
  }

  getSelectedCpuOpponentTeam() {
    const teams = this.getSelectableTeams();
    return teams[this.cpuOpponentIndex] || teams[0];
  }

  getCpuOpponentTeamByIndex(index) {
    const teams = this.getSelectableTeams();
    return teams[((index % teams.length) + teams.length) % teams.length] || teams[0];
  }

  getSelectedTeamForSide(team) {
    const teams = this.getSelectableTeams();
    const index = this.selectedTeamIndices?.[team] ?? (team === "left" ? 0 : 1);
    return teams[((index % teams.length) + teams.length) % teams.length] || teams[0];
  }

  getTeamSlotName(team, slot) {
    if (!team) return "";
    return slot < 5
      ? team.innerNames?.[slot] || ""
      : team.outNames?.[slot - 5] || "";
  }

  getCpuTeamForSide(team) {
    const selected = this.getTeamDefinitionForSide(team);
    if (selected?.isCustom) return null;
    return selected;
  }

  isCpuControlledSide(team) {
    return this.gameMode === "watch" || (this.gameMode === "single" && team === "right");
  }

  getTeamDefinitionForSide(team) {
    if (this.gameMode === "watch") {
      return team === "left"
        ? this.getCpuOpponentTeamByIndex(this.watchCpuLeftIndex)
        : this.getCpuOpponentTeamByIndex(this.watchCpuRightIndex);
    }
    if (this.gameMode === "single" && team === "right") {
      return this.getSelectedCpuOpponentTeam();
    }
    return this.getSelectedTeamForSide(team);
  }

  changeCpuOpponent(direction) {
    const teams = this.getSelectableTeams();
    if (teams.length <= 1) return;
    this.cpuOpponentIndex = (this.cpuOpponentIndex + direction + teams.length) % teams.length;
  }

  changeSelectedTeam(side, direction) {
    const teams = this.getSelectableTeams();
    if (teams.length <= 1) return;
    this.selectedTeamIndices[side] = (this.selectedTeamIndices[side] + direction + teams.length) % teams.length;
    if (this.teamSelectionConfirmed) {
      this.teamSelectionConfirmed[side] = false;
    }
    if (this.teamRosterConfirmed) {
      this.teamRosterConfirmed[side] = false;
    }
    if (this.gameMode === "single" && side === "right") {
      this.cpuOpponentIndex = this.selectedTeamIndices.right;
    }
  }

  loop(time) {
    const delta = Math.min(0.033, (time - this.previousTime) / 1000 || 0);
    this.previousTime = time;
    try {
      this.input.update();
      this.update(delta);
      this.draw();
    } catch (error) {
      this.handleRuntimeError(error);
    } finally {
      requestAnimationFrame((nextTime) => this.loop(nextTime));
    }
  }

  handleRuntimeError(error) {
    this.lastRuntimeError = error;
    this.runtimeErrorCount += 1;
    console.error("Dodgeball runtime error recovered:", error);

    this.pendingThrow = null;
    this.chargingThrow = null;
    if (this.cpuController) {
      this.cpuController.holderPlan = null;
      this.cpuController.currentHolderId = null;
    }
    if (this.ball && this.ball.isFlying && (!this.ball.thrower || this.ball.thrower.defeated)) {
      this.ball.drop();
    }
    if (this.state === "playing") {
      this.message = "RECOVERING";
    }
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
      this.pauseMenuIndex = 0;
    }
    if (this.state === "paused") {
      this.updatePauseMenu();
      return;
    }

    this.updatePlaying(delta);
  }

  updatePauseMenu() {
    if (this.wasMenuDirectionPressed("up") || this.wasMenuDirectionPressed("down")) {
      this.pauseMenuIndex = this.pauseMenuIndex === 0 ? 1 : 0;
    }
    if (this.input.wasPressed("button1") || this.input.wasPressed("button2")) {
      if (this.pauseMenuIndex === 0) {
        this.state = "playing";
      } else {
        this.state = "modeSelect";
        this.pauseMenuIndex = 0;
      }
    }
  }

  updateModeSelect() {
    if (this.wasMenuDirectionPressed("left") || this.wasMenuDirectionPressed("up")) {
      this.modeIndex = Math.max(0, this.modeIndex - 1);
    }
    if (this.wasMenuDirectionPressed("right") || this.wasMenuDirectionPressed("down")) {
      this.modeIndex = Math.min(2, this.modeIndex + 1);
    }
    if (this.input.wasPressed("button1") || this.input.wasPressed("button2")) {
      this.gameMode = this.modeIndex === 0 ? "single" : this.modeIndex === 1 ? "versus" : "watch";
      this.state = "teamSelect";
      this.teamSelectionSide = "left";
      this.teamSelectionSlot = CPU_OPPONENT_SLOT;
      this.teamSelectionSlots = { left: CPU_OPPONENT_SLOT, right: CPU_OPPONENT_SLOT };
      this.teamSelectionConfirmed = { left: false, right: false };
      this.teamRosterConfirmed = { left: false, right: false };
      this.watchSelectionSlot = 0;
      if (this.gameMode === "single") {
        this.selectedTeamIndices = { left: 0, right: 2 };
        this.cpuOpponentIndex = 2;
      } else if (this.gameMode === "versus") {
        this.selectedTeamIndices = { left: 0, right: 1 };
      } else {
        this.watchCpuLeftIndex = 2;
        this.watchCpuRightIndex = 3;
      }
    }
  }

  updateTeamSelect() {
    if (this.gameMode === "watch") {
      this.updateWatchTeamSelect();
    } else if (this.gameMode === "versus") {
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
    const selectedTeam = this.getSelectedTeamForSide(this.teamSelectionSide);
    if (this.input.wasPressed("button2") && this.teamSelectionSlot < TEAM_SELECTION_COUNT && selectedTeam?.isCustom) {
      this.changeSelectedCharacterType(this.teamSelectionSide, this.teamSelectionSlot, 1);
    }
    if (this.input.wasPressed("button2") && this.teamSelectionSlot === CUSTOM_TEAM_CONFIRM_SLOT && selectedTeam?.isCustom) {
      this.confirmTeamRoster(this.teamSelectionSide);
      return;
    }
    if (this.input.wasPressed("button2") && this.teamSelectionSlot === CPU_OPPONENT_SLOT) {
      if (!this.teamSelectionConfirmed[this.teamSelectionSide]) {
        this.teamSelectionConfirmed[this.teamSelectionSide] = true;
        if (selectedTeam?.isCustom) {
          this.teamSelectionSlot = 0;
        } else if (this.teamSelectionSide === "left") {
          this.teamRosterConfirmed[this.teamSelectionSide] = true;
          this.teamSelectionSide = "right";
        } else {
          this.teamRosterConfirmed[this.teamSelectionSide] = true;
          this.teamSelectionSlot = START_SLOT;
        }
      } else if (selectedTeam?.isCustom) {
        this.teamSelectionSlot = 0;
      } else if (this.teamSelectionSide === "left") {
        this.teamSelectionSide = "right";
      } else {
        this.teamSelectionSlot = START_SLOT;
      }
      return;
    }
    if (this.input.wasPressed("button2") && this.teamSelectionSlot === START_SLOT) {
      if (this.canStartSelectedMatch()) {
        this.setupMatch();
        this.state = "playing";
      }
    }
    if (this.input.wasPressed("button1")) {
      if (this.teamSelectionSlot === START_SLOT) {
        this.teamSelectionSide = "right";
        this.teamSelectionSlot = CPU_OPPONENT_SLOT;
        return;
      }
      if (this.teamSelectionSlot < TEAM_SELECTION_COUNT) {
        this.teamSelectionSlot = CPU_OPPONENT_SLOT;
        return;
      }
      if (this.teamSelectionSlot === CUSTOM_TEAM_CONFIRM_SLOT) {
        this.teamSelectionSlot = TEAM_SELECTION_COUNT - 1;
        return;
      }
      if (this.teamSelectionSlot === CPU_OPPONENT_SLOT && this.teamSelectionSide === "right") {
        this.teamSelectionSide = "left";
        return;
      }
      if (this.teamSelectionSlot === CPU_OPPONENT_SLOT && this.teamSelectionConfirmed[this.teamSelectionSide]) {
        this.teamSelectionConfirmed[this.teamSelectionSide] = false;
        return;
      }
      this.state = "modeSelect";
    }
  }

  updateWatchTeamSelect() {
    const teams = this.getSelectableTeams();
    if (this.watchSelectionSlot === 0) {
      this.watchCpuLeftIndex = this.moveWatchTeamIndex(this.watchCpuLeftIndex, teams.length);
    } else if (this.watchSelectionSlot === 1) {
      this.watchCpuRightIndex = this.moveWatchTeamIndex(this.watchCpuRightIndex, teams.length);
    }

    if (this.wasMenuDirectionPressed("left") && this.watchSelectionSlot === 1) {
      this.watchSelectionSlot = 0;
    }
    if (this.wasMenuDirectionPressed("right") && this.watchSelectionSlot === 0) {
      this.watchSelectionSlot = 1;
    }
    if (this.wasMenuDirectionPressed("up") && this.watchSelectionSlot === 2) {
      this.watchSelectionSlot = 1;
    }

    if (this.input.wasPressed("button2")) {
      if (this.watchSelectionSlot < 2) {
        this.watchSelectionSlot += 1;
      } else {
        this.setupMatch();
        this.state = "playing";
      }
    }
    if (this.input.wasPressed("button1")) {
      if (this.watchSelectionSlot > 0) {
        this.watchSelectionSlot -= 1;
      } else {
        this.state = "modeSelect";
      }
    }
  }

  moveWatchTeamIndex(index, length) {
    let next = index;
    if (this.wasMenuDirectionPressed("up")) next -= 1;
    if (this.wasMenuDirectionPressed("down")) next += 1;
    if (next === index) return index;
    return ((next % length) + length) % length;
  }

  canStartSelectedMatch() {
    return Boolean(this.teamRosterConfirmed?.left && this.teamRosterConfirmed?.right);
  }

  confirmTeamRoster(side) {
    this.teamSelectionConfirmed[side] = true;
    this.teamRosterConfirmed[side] = true;
    if (this.gameMode === "single") {
      if (side === "left") {
        this.teamSelectionSide = "right";
        this.teamSelectionSlot = CPU_OPPONENT_SLOT;
      } else {
        this.teamSelectionSlot = START_SLOT;
      }
      return;
    }

    this.teamSelectionSlots[side] = START_SLOT;
  }

  updateTeamSelectCursor(side, playerIndex) {
    const moved = this.moveTeamSelectCursor(side, this.teamSelectionSlots[side], playerIndex, true);
    this.teamSelectionSlots[side] = moved.slot;
    const slot = moved.slot;
    const selectedTeam = this.getSelectedTeamForSide(side);

    if (this.input.wasPressed("button2", playerIndex) && slot < TEAM_SELECTION_COUNT && selectedTeam?.isCustom) {
      this.changeSelectedCharacterType(side, slot, 1);
    }
    if (this.input.wasPressed("button2", playerIndex) && slot === CUSTOM_TEAM_CONFIRM_SLOT && selectedTeam?.isCustom) {
      this.confirmTeamRoster(side);
      return;
    }
    if (this.input.wasPressed("button2", playerIndex) && slot === CPU_OPPONENT_SLOT) {
      if (!this.teamSelectionConfirmed[side]) {
        this.teamSelectionConfirmed[side] = true;
        if (selectedTeam?.isCustom) {
          this.teamSelectionSlots[side] = 0;
        } else {
          this.teamRosterConfirmed[side] = true;
          this.teamSelectionSlots[side] = START_SLOT;
        }
      } else {
        this.teamSelectionSlots[side] = selectedTeam?.isCustom ? 0 : START_SLOT;
      }
    }
    if (this.input.wasPressed("button2", playerIndex) && slot === START_SLOT) {
      if (this.canStartSelectedMatch()) {
        this.setupMatch();
        this.state = "playing";
      }
    }
    if (this.input.wasPressed("button1", playerIndex)) {
      if (slot === START_SLOT || slot < TEAM_SELECTION_COUNT) {
        this.teamSelectionSlots[side] = CPU_OPPONENT_SLOT;
        return;
      }
      if (slot === CUSTOM_TEAM_CONFIRM_SLOT) {
        this.teamSelectionSlots[side] = TEAM_SELECTION_COUNT - 1;
        return;
      }
      if (slot === CPU_OPPONENT_SLOT && this.teamSelectionConfirmed[side]) {
        this.teamSelectionConfirmed[side] = false;
        return;
      }
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

    if (nextSlot === START_SLOT) {
      if (up) nextSlot = CPU_OPPONENT_SLOT;
      if (left && !lockSide) nextSide = "left";
      if (right && !lockSide) nextSide = "right";
      return { side: nextSide, slot: nextSlot };
    }

    if (nextSlot === CUSTOM_TEAM_CONFIRM_SLOT) {
      if (left || up || down) nextSlot = TEAM_SELECTION_COUNT - 1;
      return { side: nextSide, slot: nextSlot };
    }

    if (nextSlot === CPU_OPPONENT_SLOT) {
      if (left && !lockSide) nextSide = "left";
      if (right && !lockSide) nextSide = "right";
      if (up) this.changeSelectedTeam(nextSide, -1);
      if (down) this.changeSelectedTeam(nextSide, 1);
      return { side: nextSide, slot: nextSlot };
    }

    const selectColumns = this.getSelectedTeamForSide(nextSide)?.isCustom && this.teamSelectionConfirmed?.[nextSide]
      ? 4
      : TEAM_SELECT_COLUMNS;
    const row = Math.floor(nextSlot / selectColumns);
    const col = nextSlot % selectColumns;
    const lastRow = Math.floor((TEAM_SELECTION_COUNT - 1) / selectColumns);
    if (left) {
      if (col > 0) {
        nextSlot -= 1;
      } else if (!lockSide) {
        nextSide = nextSide === "left" ? "right" : "left";
        nextSlot = Math.min(row * selectColumns + selectColumns - 1, TEAM_SELECTION_COUNT - 1);
      }
    }
    if (right) {
      if (col < selectColumns - 1 && nextSlot + 1 < TEAM_SELECTION_COUNT) {
        nextSlot += 1;
      } else {
        nextSlot = this.getSelectedTeamForSide(nextSide)?.isCustom && this.teamSelectionConfirmed?.[nextSide]
          ? CUSTOM_TEAM_CONFIRM_SLOT
          : CPU_OPPONENT_SLOT;
      }
    }
    if (up && row > 0) nextSlot -= TEAM_SELECT_COLUMNS;
    if (down) {
      nextSlot = row < lastRow
        ? Math.min(nextSlot + selectColumns, TEAM_SELECTION_COUNT - 1)
        : this.getSelectedTeamForSide(nextSide)?.isCustom && this.teamSelectionConfirmed?.[nextSide]
          ? CUSTOM_TEAM_CONFIRM_SLOT
          : CPU_OPPONENT_SLOT;
    }
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
      selections[slot] = nextType;
      return;
    }
  }

  canUseCharacterType(side, slot, type) {
    return true;
  }

  updatePlaying(delta) {
    this.updateEffects(delta);
    this.updateSpirit(delta);
    if (this.gameMode === "watch") {
      this.cpuControllerLeft?.update(delta);
      this.cpuController?.update(delta);
    } else if (this.gameMode !== "versus") {
      this.cpuController.update(delta);
    }
    if (this.gameMode !== "watch") {
      this.autoSwitchToIncomingShotTarget();
      this.updateControlSwitching(delta);
    }
    this.handlePlayerButtons();
    this.handleCpuButtons();
    this.updateChargingThrow(delta);
    this.updatePendingThrow(delta);
    this.updatePlayers(delta);
    this.resolvePlayerCollisions();
    this.autoPickupLooseBall();
    this.ball.update(delta, this.ballBounds);
    this.updateBoostPresentation();
    this.updateTripleBalls(delta);
    this.autoPickupLooseBall();
    this.resetUnreachableOutfieldBall(delta);
    this.handleManualCatch(this.leftTeam);
    this.handleManualCatch(this.rightTeam);
    this.handlePassReceives();
    this.handleFriendlyMissedReceives(this.leftTeam);
    this.handleFriendlyMissedReceives(this.rightTeam);
    this.handleHits();
    this.handleTsutenkakuImpact();
    this.handleLightningZigzagImpact();
    this.handleBoostShotExit();
    this.handleTripleBallHits();
    this.ensureBallIsPlayable();
    this.checkGameOver();
  }

  updateSpirit(delta) {
    const max = GAME_CONFIG.battle.spiritMax;
    const gain = max / GAME_CONFIG.battle.spiritFillSeconds;
    this.spiritPoints.left = Math.min(max, this.spiritPoints.left + gain * delta);
    this.spiritPoints.right = Math.min(max, this.spiritPoints.right + gain * delta);
  }

  updateTripleBalls(delta) {
    if (!this.tripleBalls || this.tripleBalls.length === 0) return;
    this.tripleBalls = this.tripleBalls.filter((shot) => {
      shot.life -= delta;
      shot.x += shot.vx * delta;
      shot.y += shot.vy * delta;
      shot.z += shot.vz * delta;
      shot.vz -= GAME_CONFIG.ball.gravity * delta;
      shot.spin += Math.hypot(shot.vx, shot.vy) * delta * 0.025;
      if (shot.z <= 0 || shot.life <= 0) return false;
      return this.isPointInsideBallBounds(shot.x, shot.y);
    });
  }

  spawnTripleDummyBalls(actor, aim, multiplier) {
    const length = Math.hypot(aim?.x || actor.facing || 1, aim?.y || 0) || 1;
    const baseAim = { x: (aim?.x || actor.facing || 1) / length, y: (aim?.y || 0) / length };
    const speed = (GAME_CONFIG.ball.specialShootSpeed || GAME_CONFIG.ball.shootSpeed) * 1.12;
    const offsets = [-0.18, 0.18];
    for (const angle of offsets) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const dir = {
        x: baseAim.x * cos - baseAim.y * sin,
        y: baseAim.x * sin + baseAim.y * cos
      };
      this.tripleBalls.push({
        x: actor.x + actor.facing * 42,
        y: actor.y - 42,
        z: actor.jumpZ + 34,
        vx: dir.x * speed + actor.vx * GAME_CONFIG.ball.moveBonus * 0.03,
        vy: dir.y * speed + actor.vy * GAME_CONFIG.ball.moveBonus * 0.03,
        vz: 360 + Math.max(0, multiplier - 0.7) * 50 + actor.jumpZ * 0.08,
        radius: GAME_CONFIG.ball.radius * 0.88,
        team: actor.team,
        thrower: actor,
        power: actor.throwPower * Math.max(0.7, multiplier) * 0.2,
        life: 1.85,
        spin: 0,
        hitPlayerIds: new Set()
      });
    }
  }

  handlePlayerButtons() {
    if (this.gameMode === "watch") return;
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
        if (!this.startCounterThrow(holder)) this.startChargedThrow(holder, "shoot");
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
        active.startCatch(this.getCatchDuration(active));
      }
    }

    if (this.gameMode === "versus") {
      if (rightTeamHasBall) {
        this.controlledRightPlayerId = holder.id;
        if (this.input.wasPressed("button2", 2)) {
          if (!this.startCounterThrow(holder)) this.startChargedThrow(holder, "shoot", 2);
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
          activeRight.startCatch(this.getCatchDuration(activeRight));
        }
      }
    }
  }

  handleCpuButtons() {
    if (this.gameMode === "versus") return;
    if (this.gameMode === "watch") {
      this.handleCpuTeamButtons(this.leftTeam, this.cpuControllerLeft, this.rightTeam);
    }
    this.handleCpuTeamButtons(this.rightTeam, this.cpuController, this.leftTeam);
  }

  handleCpuTeamButtons(team, controller, opponents) {
    if (!controller) return;
    for (const member of team) {
      const command = controller.getCommand(member);
      if (
        this.ball.owner === member &&
        member.canCounterThrow() &&
        member.counterAutoTimer <= 0 &&
        this.startCounterThrow(member)
      ) {
        continue;
      }
      if (command.catch) member.startCatch(this.getCatchDuration(member));
      if (command.crouch) member.startDodge(0, 0, GAME_CONFIG.battle);
      if (command.jump) member.jump(GAME_CONFIG.battle);
      if (command.chargeShoot && this.ball.owner === member) {
        this.startCpuChargedShoot(member, command.chargeTime, command.chargeReleaseMode);
      }
      if (command.shoot && this.ball.owner === member) {
        this.launchFromAi(member, "shoot", opponents);
      }
      if (command.pass && this.ball.owner === member) {
        this.launchFromAi(member, "pass", team.filter((p) => p !== member));
      }
    }
  }

  updatePlayers(delta) {
    const active = this.gameMode === "watch" ? null : this.getPlayerControlledMember();
    for (const member of this.leftTeam) {
      const area = this.getMoveArea(member, member === active || this.ball.owner === member);
      let controls = { moveX: 0, moveY: 0, dash: false };
      if (this.gameMode === "watch") {
        controls = this.cpuControllerLeft?.getCommand(member) || controls;
      } else if (member === active && !member.defeated) {
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

    const activeRight = this.gameMode === "watch" ? null : this.getRightControlledMember();
    for (const member of this.rightTeam) {
      let command = this.cpuController?.getCommand(member) || { moveX: 0, moveY: 0, dash: false };
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
      const area = this.getMoveArea(member, member === activeRight || this.ball.owner === member);
      const controls = this.shouldReturnToLegalArea(member, area)
        ? this.vectorTo(member, member.homeX, member.homeY, true)
        : command;
      member.update(delta, controls, area, GAME_CONFIG.battle);
      if (member.role === "inner" && member.jumpZ <= 0 && member.jumpVelocity <= 0 && !this.isPointInsideArea(member.x, member.y, member.radius, area)) {
        member.clampToArea(area);
      }
    }
  }

  resolvePlayerCollisions() {
    for (let pass = 0; pass < 2; pass += 1) {
      for (let i = 0; i < this.players.length; i += 1) {
        const a = this.players[i];
        if (a.defeated || a.downTimer > 0) continue;
        for (let j = i + 1; j < this.players.length; j += 1) {
          const b = this.players[j];
          if (b.defeated || b.downTimer > 0) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distance = Math.hypot(dx, dy) || 1;
          const minDistance = (a.radius + b.radius) * 0.95;
          if (distance >= minDistance) continue;
          const push = (minDistance - distance) * 0.5;
          const nx = dx / distance;
          const ny = dy / distance;
          a.x -= nx * push;
          a.y -= ny * push;
          b.x += nx * push;
          b.y += ny * push;
          a.clampToArea(this.getMoveArea(a, this.ball.owner === a));
          b.clampToArea(this.getMoveArea(b, this.ball.owner === b));
        }
      }
    }
  }

  getMoveArea(member, isControlled) {
    if (member.role === "out" && (isControlled || this.isTeamOutfieldLooseBall(member.team))) {
      return this.getTeamOutfieldArea(member.team);
    }
    return this.areas[member.zone];
  }

  isTeamOutfieldLooseBall(team) {
    if (!this.ball?.isLoose || this.ball.owner || this.ball.isFlying) return false;
    const territory = this.getLooseBallTerritory(this.ball.x, this.ball.y);
    return territory?.team === team && territory.role === "out";
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
        return sum + (distance < 210 ? (210 - distance) * 2.4 : 0);
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
    const territory = this.getLooseBallTerritory(this.ball.x, this.ball.y);
    const candidates = this.players
      .filter((member) => {
        if (member.defeated) return false;
        if (!territory) return this.isPointInsideArea(this.ball.x, this.ball.y, 0, this.getMoveArea(member, false));
        return member.team === territory.team && member.role === territory.role;
      })
      .sort((a, b) => (
        Math.hypot(a.x - this.ball.x, a.y - this.ball.y) -
        Math.hypot(b.x - this.ball.x, b.y - this.ball.y)
      ));

    for (const member of candidates) {
      if (this.ball.canBePickedUpBy(member, pickupDistance)) {
        this.ball.pickUp(member);
        this.setControlledMember(member.team, member);
        break;
      }
    }
  }

  getLooseBallTerritory(x, y) {
    const leftInnerBounds = this.getTrapezoidBoundsAtY(this.areas.leftInner.trapezoid, y);
    const rightInnerBounds = this.getTrapezoidBoundsAtY(this.areas.rightInner.trapezoid, y);
    if (
      leftInnerBounds &&
      rightInnerBounds &&
      x >= leftInnerBounds.left - 24 &&
      x <= rightInnerBounds.right + 24
    ) {
      return x < GAME_CONFIG.court.centerX
        ? { team: "left", role: "inner" }
        : { team: "right", role: "inner" };
    }

    if (this.isPointInsideArea(x, y, 0, this.getTeamOutfieldArea("left"))) {
      return { team: "left", role: "out" };
    }
    if (this.isPointInsideArea(x, y, 0, this.getTeamOutfieldArea("right"))) {
      return { team: "right", role: "out" };
    }

    const nearbyOutfield = this.getOutfieldSideForBall(x, y);
    if (nearbyOutfield) {
      return { team: nearbyOutfield.team, role: "out" };
    }
    return null;
  }

  resetUnreachableOutfieldBall(delta = 0) {
    if (this.ball.owner || this.ball.isFlying || !this.ball.isLoose) {
      this.looseOutfieldRecoveryTimer = 0;
      this.lastLooseOutfieldBallPosition = null;
      this.lastLooseOutfieldReceiverDistance = Infinity;
      return;
    }

    const outfield = this.getOutfieldSideForBall(this.ball.x, this.ball.y);
    if (!outfield) {
      this.looseOutfieldRecoveryTimer = 0;
      this.lastLooseOutfieldBallPosition = null;
      this.lastLooseOutfieldReceiverDistance = Infinity;
      return;
    }

    const outerLimit = outfield.side === "right"
      ? this.areas.rightSideOut.x + this.areas.rightSideOut.w + 18
      : this.areas.leftSideOut.x - 18;
    const beyondSide = outfield.side === "right" ? this.ball.x > outerLimit : this.ball.x < outerLimit;
    const beyondBottom = this.ball.y > this.ballBounds.y + this.ballBounds.h - 38;
    const beyondTop = this.ball.y < this.areas.leftTopOut.y - 34;
    const receiver = this.findNearestOutfielder(outfield.team, this.ball.x, this.ball.y);
    if (!receiver) return;

    const nearestOutfielderDistance = Math.hypot(receiver.x - this.ball.x, receiver.y - this.ball.y);
    const rollingFarAway = this.ball.hasBounced && Math.hypot(this.ball.vx, this.ball.vy) < 90 && nearestOutfielderDistance > 520;
    const previous = this.lastLooseOutfieldBallPosition;
    const moved = previous ? Math.hypot(this.ball.x - previous.x, this.ball.y - previous.y) : Infinity;
    const ballSpeed = Math.hypot(this.ball.vx, this.ball.vy);
    const settled = this.ball.hasBounced && ballSpeed < 55 && moved < 5;
    const receiverApproaching = nearestOutfielderDistance < this.lastLooseOutfieldReceiverDistance - 2;
    const stillOutOfReach = nearestOutfielderDistance > GAME_CONFIG.battle.rollingPickupDistance * 0.8;
    this.looseOutfieldRecoveryTimer = settled && stillOutOfReach && !receiverApproaching
      ? this.looseOutfieldRecoveryTimer + delta
      : 0;
    this.lastLooseOutfieldBallPosition = { x: this.ball.x, y: this.ball.y };
    this.lastLooseOutfieldReceiverDistance = nearestOutfielderDistance;
    const screenMargin = 90;
    const outsideScreen = (
      this.ball.x < this.ballBounds.x + screenMargin ||
      this.ball.x > this.ballBounds.x + this.ballBounds.w - screenMargin ||
      this.ball.y < this.ballBounds.y + screenMargin ||
      this.ball.y > this.ballBounds.y + this.ballBounds.h - screenMargin
    );

    const recoveryTimedOut = this.looseOutfieldRecoveryTimer >= 1.2;
    if (!beyondSide && !beyondBottom && !beyondTop && !rollingFarAway && !outsideScreen && !recoveryTimedOut) return;

    const area = this.getTeamOutfieldArea(receiver.team);
    const point = this.clampPointToArea({ x: this.ball.x, y: this.ball.y }, area, receiver.radius);
    receiver.x = point.x;
    receiver.y = point.y;
    this.ball.pickUp(receiver);
    this.setControlledMember(receiver.team, receiver);
    this.looseOutfieldRecoveryTimer = 0;
    this.lastLooseOutfieldBallPosition = null;
    this.lastLooseOutfieldReceiverDistance = Infinity;
    this.spawnEffect(receiver.x, receiver.y - 58, "#ffffff", "catch");
  }

  clampPointToArea(point, area, radius) {
    const rects = area?.rects || (area ? [area] : []);
    let best = point;
    let bestDistance = Infinity;

    for (const rect of rects) {
      const candidate = this.clampPointToRect(point, rect, radius);
      const distance = Math.hypot(point.x - candidate.x, point.y - candidate.y);
      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    }

    return best;
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

  startCounterThrow(actor) {
    if (
      this.pendingThrow ||
      this.chargingThrow ||
      this.ball.owner !== actor ||
      actor.defeated ||
      !actor.canCounterThrow()
    ) return false;
    const enemies = actor.team === "left" ? this.rightTeam : this.leftTeam;
    const savedTarget = actor.counterTarget;
    const target = savedTarget && !savedTarget.defeated
      ? savedTarget
      : this.getNearestFrom(actor, enemies.filter((member) => !member.defeated && member.role === "inner"));
    if (!target) return false;
    if (!actor.consumeStamina(COUNTER_CONFIG.staminaCost, GAME_CONFIG.battle.stamina.recoveryDelay)) return false;

    const aim = this.normalizedVector(target.x - actor.x, target.y - actor.y);
    const counterDamage = actor.counterSourceDamage * COUNTER_CONFIG.damageScale;
    actor.clearCounterOpportunity();
    this.pendingThrow = {
      actor,
      target,
      kind: "shoot",
      aim,
      shotMultiplier: 1,
      specialType: null,
      counter: true,
      counterDamage,
      timer: COUNTER_CONFIG.releaseDelay
    };
    actor.markThrowing(0.34, "shoot");
    actor.throwLockTimer = Math.max(actor.throwLockTimer, 0.34);
    this.setControlledMember(target.team, target);
    this.setAutoSwitchCooldown(target.team, 0.28);
    return true;
  }

  startCpuChargedShoot(actor, chargeTime = 1, releaseMode = "time") {
    if (this.pendingThrow || this.chargingThrow || this.ball.owner !== actor || actor.defeated || actor.throwLockTimer > 0) return false;

    const enemies = actor.team === "left" ? this.rightTeam : this.leftTeam;
    const aim = this.getDefaultShootAim(actor, enemies);
    const target = this.findShootTargetInAim(actor, enemies, aim);
    this.chargingThrow = {
      actor,
      kind: "shoot",
      target,
      aim,
      playerIndex: 0,
      chargeTime: 0,
      cpuControlled: true,
      cpuReleaseTime: Math.max(0.35, Math.min(MAX_SHOT_CHARGE_TIME, chargeTime)),
      cpuReleaseMode: releaseMode,
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
    charged.aim = kind === "shoot"
      ? this.getShotAim(actor, charged.target, selection.aim || charged.aim)
      : selection.aim || charged.aim;
    const chargeRatio = Math.min(1, charged.chargeTime / MAX_SHOT_CHARGE_TIME);
    const multiplier = kind === "shoot"
      ? this.getShotMultiplier(actor, charged.aim, chargeRatio, charged.aerialCombo)
      : 1 + chargeRatio * 0.85;
    actor.throwLockTimer = Math.max(actor.throwLockTimer, kind === "shoot" ? 0.3 : 0.18);
    actor.markThrowing(kind === "shoot" ? 0.32 : 0.22, kind);
    const specialType = kind === "shoot" ? this.getSpecialShotType(actor, multiplier) : null;
    if (specialType) {
      this.pendingThrow = {
        actor,
        target: charged.target,
        kind,
        aim: charged.aim,
        shotMultiplier: multiplier,
        specialType,
        timer: SPECIAL_SHOT_ANTICIPATION_TIME,
        anticipation: true,
        aerialCombo: charged.aerialCombo
      };
      actor.markThrowing(SPECIAL_SHOT_ANTICIPATION_TIME + 0.18, kind);
      actor.throwLockTimer = Math.max(actor.throwLockTimer, SPECIAL_SHOT_ANTICIPATION_TIME + 0.06);
      return true;
    }
    if (this.ball.launch(actor, charged.target, kind, charged.aim, multiplier, specialType)) {
      if (kind === "shoot") this.showShotMultiplier(multiplier, actor, specialType);
      this.spawnEffect(
        actor.x + actor.facing * 40,
        actor.y - 48 - actor.jumpZ,
        specialType ? "#66f6ff" : charged.aerialCombo ? "#66f6ff" : kind === "shoot" ? "#ffe46a" : "#ffffff",
        specialType ? "special" : charged.aerialCombo ? "special" : kind
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
      this.queueThrow(actor, target, kind, aim, true);
      return;
    }

    const target = this.getCpuPassTarget(actor);
    const aim = target
      ? this.normalizedVector(target.x - actor.x, target.y - actor.y)
      : this.getDefaultShootAim(actor, actor.team === "left" ? this.rightTeam : this.leftTeam);
    this.queueThrow(actor, target, kind, aim, true);
  }

  queueThrow(actor, target, kind, aim, ignoreStamina = false) {
    if (this.pendingThrow || this.ball.owner !== actor || actor.defeated) return false;
    if (!target && kind !== "shoot") return false;
    if (kind === "shoot" && !ignoreStamina && !actor.consumeStamina(
      GAME_CONFIG.battle.stamina.shootCost,
      GAME_CONFIG.battle.stamina.recoveryDelay
    )) return false;

    const shotAim = kind === "shoot" ? this.getShotAim(actor, target, aim) : null;
    this.pendingThrow = {
      actor,
      target,
      kind,
      aim: shotAim || { x: aim.x, y: aim.y },
      shotMultiplier: kind === "shoot" ? this.getShotMultiplier(actor, shotAim) : 1,
      specialType: null,
      anticipation: false,
      timer: kind === "shoot" ? 0.38 : 0.2
    };
    if (kind === "shoot") {
      this.pendingThrow.specialType = this.getSpecialShotType(actor, this.pendingThrow.shotMultiplier);
      if (this.pendingThrow.specialType) {
        this.pendingThrow.timer += SPECIAL_SHOT_ANTICIPATION_TIME;
        this.pendingThrow.anticipation = true;
      }
    }
    const throwDuration = kind === "shoot"
      ? 0.68 + (this.pendingThrow.anticipation ? SPECIAL_SHOT_ANTICIPATION_TIME - 0.2 : 0)
      : 0.4;
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
    const specialType = pending.counter
      ? null
      : pending.kind === "shoot"
      ? pending.specialType || this.getSpecialShotType(pending.actor, pending.shotMultiplier)
      : null;
    if (this.ball.launch(pending.actor, pending.target, pending.kind, pending.aim, pending.shotMultiplier, specialType)) {
      if (pending.counter) {
        const targetX = pending.target?.x ?? this.ball.x + pending.aim.x * 900;
        const targetY = pending.target ? pending.target.y - 38 : this.ball.y + pending.aim.y * 900;
        const dx = targetX - this.ball.x;
        const dy = targetY - this.ball.y;
        const length = Math.hypot(dx, dy) || 1;
        const speed = GAME_CONFIG.ball.shootSpeed * COUNTER_CONFIG.speedScale;
        this.ball.vx = dx / length * speed;
        this.ball.vy = dy / length * speed;
        this.ball.vz = 0;
        this.ball.power = pending.counterDamage;
        this.ball.shotMultiplier = COUNTER_CONFIG.speedScale;
        this.ball.counterShot = true;
        this.ball.counterFlightZ = this.ball.z;
        this.spawnEffect(pending.actor.x + pending.actor.facing * 42, pending.actor.y - 52, "#8ffcff", "counterLaunch");
        this.spawnCatchResultLabel(pending.actor, "COUNTER!", "#fff36a");
        return;
      }
      if (specialType) this.consumeSpirit(pending.actor.team);
      if (specialType === "triple") this.spawnTripleDummyBalls(pending.actor, pending.aim, pending.shotMultiplier);
      if (pending.kind === "shoot") this.showShotMultiplier(pending.shotMultiplier, pending.actor, specialType);
      this.spawnEffect(
        pending.actor.x + pending.actor.facing * 40,
        pending.actor.y - 48,
        specialType ? this.getSpecialHitColor(specialType) : pending.kind === "shoot" ? "#ffe46a" : "#ffffff",
        specialType ? "special" : pending.kind
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

    charged.chargeTime = Math.min(MAX_SHOT_CHARGE_TIME, charged.chargeTime + delta);
    if (charged.kind === "shoot") {
      if (!charged.cpuControlled) {
        charged.actor.drainStamina(
          GAME_CONFIG.battle.stamina.shootChargeDrainPerSecond * delta,
          GAME_CONFIG.battle.stamina.recoveryDelay
        );
      }
      const selection = charged.cpuControlled
        ? this.getCpuShootSelection(charged.actor)
        : this.getShootSelection(charged.actor, charged.playerIndex);
      charged.target = selection.target;
      charged.aim = this.getShotAim(charged.actor, charged.target, selection.aim);
      charged.aerialCombo = charged.aerialCombo || (charged.actor.jumpZ > 0 && charged.actor.aerialPassCatchTimer > 0);
      const cpuApexRelease = charged.cpuControlled &&
        charged.cpuReleaseMode === "apex" &&
        charged.chargeTime >= 0.35 &&
        charged.actor.jumpZ > 88 &&
        Math.abs(charged.actor.jumpVelocity) < 150;
      const cpuTimedRelease = charged.cpuControlled &&
        charged.cpuReleaseMode !== "apex" &&
        charged.chargeTime >= charged.cpuReleaseTime;
      const cpuFallbackRelease = charged.cpuControlled &&
        charged.cpuReleaseMode === "apex" &&
        charged.chargeTime >= charged.cpuReleaseTime + 0.32;
      if (cpuApexRelease || cpuTimedRelease || cpuFallbackRelease) {
        this.releaseChargedThrow(charged.actor, "shoot", charged.playerIndex);
        return;
      }
      if (!charged.cpuControlled && charged.actor.stamina <= 0) {
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
    if (this.gameMode === "watch") return null;
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
    if (this.gameMode === "watch") return null;
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
    const movingTowardThrow = actor.vx * aim.x + actor.vy * aim.y > actor.speed * 0.35;
    const dashBonus = actor.isDashing && movingTowardThrow ? 0.22 * 0.8 : 0;
    const powerBonus = ((actor.stats?.power || 5) - 5) * 0.04;
    const speedBonus = ((actor.stats?.speed || 5) - 5) * 0.025;
    const jumpStatBonus = actor.jumpZ > 0 ? ((actor.stats?.jump || 5) - 5) * 0.035 : 0;
    const jumpBonus = actor.jumpZ > 0 ? Math.min(0.3, actor.jumpZ / 430 + jumpStatBonus * 0.55) * 0.7 : 0;
    const chargeBonus = chargeRatio * 0.55 * 0.6;
    const aerialBonus = aerialCombo ? 0.2 : 0;
    return Math.max(0.7, Math.min(2.15, 0.7 + dashBonus + powerBonus + speedBonus + jumpBonus + chargeBonus + aerialBonus));
  }

  getSpecialShotType(actor, multiplier) {
    if (!this.hasFullSpirit(actor.team)) return null;
    if ((multiplier || 0) <= 1.2) return null;
    if (actor.specialShotType) return actor.specialShotType;
    if (actor.characterType === "mage") return "soul";
    if (actor.characterType === "jump") return "boost";
    if (actor.characterType === "power") return "iron";
    if (actor.characterType === "speed") return "boomerang";
    return "lightning";
  }

  getShotAim(actor, target, fallbackAim) {
    const baseAim = target
      ? this.normalizedVector(target.x - actor.x, target.y - 38 - actor.y)
      : this.normalizedVector(fallbackAim?.x || actor.facing || 1, fallbackAim?.y || 0);
    const technique = actor.stats?.technique || 5;
    const airborneDifficulty = actor.jumpZ > 0 ? 7 : 5;
    const maxError = Math.max(0, airborneDifficulty - technique) * 0.012;
    if (maxError <= 0.001) return baseAim;

    const angle = (Math.random() * 2 - 1) * maxError;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return this.normalizedVector(
      baseAim.x * cos - baseAim.y * sin,
      baseAim.x * sin + baseAim.y * cos
    );
  }

  getPassTarget(actor, moveX, moveY) {
    if (!actor) return null;
    if (Math.hypot(moveX, moveY) < 0.35) {
      return this.getNearestPassTarget(actor);
    }

    return this.getPassTargetByDirection(actor, moveX, moveY) || this.getNearestPassTarget(actor);
  }

  getPassTargetByDirection(actor, moveX, moveY) {
    const team = actor.team === "left" ? this.leftTeam : this.rightTeam;
    const candidates = team.filter((p) => p !== actor && !p.defeated);
    if (candidates.length === 0) return null;

    const aim = this.normalizedVector(moveX, moveY);
    let best = null;
    let bestScore = -Infinity;
    for (const candidate of candidates) {
      const dx = candidate.x - actor.x;
      const dy = candidate.y - actor.y;
      const distance = Math.hypot(dx, dy) || 1;
      const dot = (dx / distance) * aim.x + (dy / distance) * aim.y;
      if (dot < 0.28) continue;
      const distanceBonus = Math.max(0, 1 - distance / 2200) * 0.18;
      const roleBonus = candidate.role === "out" ? 0.06 : 0;
      const score = dot * 10 + distanceBonus + roleBonus;
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    return best;
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

    if (actor.cpuProfile === "americanBigBalls" && actor.name !== "\u30b8\u30e7\u30fc") {
      const joe = candidates.find((p) => p.name === "\u30b8\u30e7\u30fc" && p.hp > 0);
      if (joe && Math.random() < 0.68) return joe;
    }

    if (actor.cpuProfile === "kuidaoRangers" && actor.name !== "\u305f\u3053\u3078\u3044" && this.hasFullSpirit(actor.team)) {
      const takohei = candidates.find((p) => p.name === "\u305f\u3053\u3078\u3044" && p.hp > 0);
      if (takohei && Math.random() < 0.82) return takohei;
    }

    if (actor.cpuProfile === "doskois" && actor.name !== "よこづな" && this.hasFullSpirit(actor.team)) {
      const yokozuna = candidates.find((p) => p.name === "よこづな" && p.hp > 0);
      if (yokozuna && Math.random() < 0.84) return yokozuna;
    }

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
      this.ball.z > target.jumpZ + 170 &&
      target.jumpZ <= 0 &&
      target.jumpVelocity <= 0
    ) {
      target.jump(GAME_CONFIG.battle);
    }
    const catchX = target.x;
    const catchY = target.y - target.jumpZ - 132;
    const ballY = this.ball.y - this.ball.z;
    const visualDistance = Math.hypot(this.ball.x - catchX, ballY - catchY);
    const nearEndOfArc = this.ball.passDuration > 0 && this.ball.passTime >= this.ball.passDuration * 0.78;
    const catchReach = this.ball.radius + 82 + Math.min(1, horizontalDistance / 1400) * 30;
    if (nearEndOfArc && visualDistance < catchReach) {
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
    const nearEndOfArc = this.ball.passDuration > 0 && this.ball.passTime >= this.ball.passDuration * 0.98;
    if (nearEndOfArc && distance < this.ball.radius + 18 && this.ball.z < target.jumpZ + 34) {
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
      if (friendly && this.ball.specialShotType === "boomerang") continue;
      const box = this.getCatchArea(catcher, friendly);
      if (!this.circleRectOverlap(this.ball.x, this.ball.y - this.ball.z, this.ball.radius, box)) continue;
      const catchResult = this.getManualCatchResult(catcher, friendly);
      if (catchResult === "wait") continue;
      if (catchResult === "miss") {
        catcher.catchTimer = 0;
        this.spawnCatchResultLabel(catcher, "MISS", "#ff806f");
        continue;
      }
      const caughtFriendlyPassInAir = friendly && this.ball.kind === "pass" && catcher.jumpZ > 18;
      const caughtEnemyShot = !friendly && this.ball.kind === "shoot";
      const caughtShotDamage = caughtEnemyShot
        ? this.getSpecialShotDamage(this.ball.power, this.ball.specialShotType, this.ball.travelDistance)
        : 0;
      const counterTarget = caughtEnemyShot ? this.ball.thrower : null;
      const caughtIronShot = caughtEnemyShot && this.ball.specialShotType === "iron";
      const ironDirection = caughtIronShot ? (this.ball.vx >= 0 ? 1 : -1) : 0;
      const ironVerticalDirection = caughtIronShot ? (this.ball.vy >= 0 ? 1 : -1) : 0;
      this.ball.pickUp(catcher);
      if (caughtFriendlyPassInAir) {
        catcher.aerialPassCatchTimer = 1.1;
      }
      if (caughtEnemyShot) {
        catcher.startCatchSuccess();
        catcher.startCounterOpportunity(caughtShotDamage, counterTarget, COUNTER_CONFIG);
        if (caughtIronShot) {
          catcher.knockbackX += ironDirection * GAME_CONFIG.battle.knockbackSpeed * 2.2;
          catcher.knockbackY += ironVerticalDirection * GAME_CONFIG.battle.knockbackSpeed * 0.55;
        }
      }
      catcher.throwLockTimer = 0.2;
      catcher.catchTimer = 0;
      this.setControlledMember(catcher.team, catcher);
      this.spawnEffect(catcher.x, catcher.y - 55, caughtEnemyShot ? "#8fffe8" : "#ffffff", caughtEnemyShot ? "counterCatch" : "catch");
      if (caughtEnemyShot) this.spawnCatchResultLabel(catcher, "CATCH", "#8fffe8");
      break;
    }
  }

  getCatchDifficulty(catcher) {
    const enemySpecial = (
      this.ball?.isFlying &&
      this.ball.kind === "shoot" &&
      this.ball.specialShotType &&
      this.ball.thrower &&
      this.ball.thrower.team !== catcher.team
    );
    return enemySpecial
      ? CATCH_DIFFICULTY[this.ball.specialShotType] || CATCH_DIFFICULTY.normal
      : CATCH_DIFFICULTY.normal;
  }

  getCatchDuration(catcher) {
    return this.getCatchDifficulty(catcher).duration;
  }

  getNormalCatchMaxChance(technique) {
    const value = Math.max(1, Math.min(20, technique || 5));
    const points = [
      { technique: 1, chance: 0.49 },
      { technique: 5, chance: 0.65 },
      { technique: 7, chance: 0.75 },
      { technique: 10, chance: 0.82 },
      { technique: 15, chance: 0.9 },
      { technique: 20, chance: 0.94 }
    ];

    for (let index = 1; index < points.length; index += 1) {
      const next = points[index];
      if (value > next.technique) continue;
      const previous = points[index - 1];
      const ratio = (value - previous.technique) / (next.technique - previous.technique);
      return previous.chance + (next.chance - previous.chance) * ratio;
    }

    return points[points.length - 1].chance;
  }

  getManualCatchResult(catcher, friendly) {
    if (this.ball.kind === "pass") {
      return "perfect";
    }

    if (this.ball.kind !== "shoot") {
      return friendly ? "perfect" : "miss";
    }

    if (friendly) return "perfect";

    const thrower = this.ball.thrower;
    const difficulty = this.getCatchDifficulty(catcher);
    const throwDistance = thrower ? Math.hypot(catcher.x - thrower.x, catcher.y - thrower.y) : 700;
    const facingQuality = this.getIncomingFacingQuality(catcher);
    const technique = catcher.stats?.technique || 5;
    const visualDistance = Math.hypot(this.ball.x - catcher.x, this.ball.y - this.ball.z - (catcher.y - catcher.jumpZ - 62));
    const timing = Math.max(0, 1 - visualDistance / 250);
    const distanceFactor = Math.max(0.42, Math.min(1.08, throwDistance / 620));
    const facingFactor = facingQuality === "front" ? 1.36 : facingQuality === "side" ? 0.58 : 0.08;
    const techniqueAboveBase = Math.max(0, Math.min(20, technique) - 5);
    const techniqueBonus = Math.min(5, techniqueAboveBase) * 0.04 + Math.max(0, techniqueAboveBase - 5) * 0.018;
    const expertCloseCatchBonus = technique >= 10 && facingQuality === "front" && visualDistance < 170
      ? 0.08 + Math.min(0.04, Math.max(0, technique - 10) * 0.004)
      : 0;
    const throwerPower = Math.max(1, Math.min(20, thrower?.stats?.power || 5));
    const throwerPowerAboveBase = Math.max(0, throwerPower - 5);
    const throwerPowerPenalty = 1 - (
      Math.min(5, throwerPowerAboveBase) * 0.01 +
      Math.max(0, throwerPowerAboveBase - 5) * 0.007
    );
    const projectedDamage = this.ball.specialShotType
      ? this.getSpecialShotDamage(this.ball.power || 20, this.ball.specialShotType, this.ball.travelDistance)
      : this.ball.power || 20;
    const shotPowerRatio = Math.max(0, projectedDamage / 20 - 1);
    const shotPowerPenalty = 1 - Math.min(0.38, shotPowerRatio * 0.18);
    const normalChance = Math.max(0.03, Math.min(0.98,
      (0.46 + timing * 0.54 + techniqueBonus + expertCloseCatchBonus) *
      distanceFactor * facingFactor * throwerPowerPenalty * shotPowerPenalty
    ));
    const maxChance = this.ball.specialShotType
      ? difficulty.maxChance
      : this.getNormalCatchMaxChance(technique);
    const chance = Math.min(maxChance, normalChance * difficulty.chanceScale);

    if (timing < difficulty.perfectTiming) {
      if (catcher.catchTimer > 0.055) return "wait";
      return "miss";
    }

    return Math.random() <= chance ? "perfect" : "miss";
  }

  spawnCatchResultLabel(catcher, text, color) {
    this.effects.push({
      x: catcher.x,
      y: catcher.y - catcher.jumpZ - 128,
      color,
      type: "catchResult",
      text,
      life: 0.72,
      maxLife: 0.72
    });
  }

  isFacingIncomingBall(catcher) {
    return this.getIncomingFacingQuality(catcher) === "front";
  }

  getIncomingFacingQuality(catcher) {
    const incomingX = -this.ball.vx;
    const incomingY = -this.ball.vy;
    const incomingLength = Math.hypot(incomingX, incomingY) || 1;
    const incoming = { x: incomingX / incomingLength, y: incomingY / incomingLength };
    const facing = this.getFacingVector(catcher);
    const dot = incoming.x * facing.x + incoming.y * facing.y;
    if (dot >= 0.55) return "front";
    if (dot >= -0.35) return "side";
    return "back";
  }

  getFacingVector(player) {
    if (player.visualDirection === "up") return { x: 0, y: -1 };
    if (player.visualDirection === "down") return { x: 0, y: 1 };
    return { x: player.facing || (player.visualDirection === "left" ? -1 : 1), y: 0 };
  }

  isFacingIncomingBallLegacy(catcher) {
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
    const isEnemyShot = !friendly && this.ball.kind === "shoot";
    const jumpBonus = catcher.jumpZ > 0 ? 72 : 0;
    const facingQuality = isEnemyShot ? this.getIncomingFacingQuality(catcher) : "front";
    const facingBonus = isEnemyShot
      ? facingQuality === "front" ? 38 : facingQuality === "side" ? 14 : -26
      : 0;
    const technique = Math.max(1, Math.min(20, catcher.stats?.technique || 5));
    const techniqueAboveBase = Math.max(0, technique - 5);
    const techniqueBonus = isEnemyShot
      ? Math.min(5, techniqueAboveBase) * 4 + Math.max(0, techniqueAboveBase - 5) * 2
      : 0;
    const inflateX = isEnemyShot ? 52 + facingBonus + techniqueBonus : isPassCut ? 72 : 96;
    const inflateY = (isEnemyShot ? 54 + facingBonus * 0.45 + techniqueBonus : isPassCut ? 64 : 76) + jumpBonus;
    const area = {
      x: box.x - inflateX,
      y: box.y - inflateY,
      w: box.w + inflateX * 2,
      h: box.h + inflateY * 2
    };
    if (!isEnemyShot || !this.ball.specialShotType) return area;

    const scale = this.getCatchDifficulty(catcher).areaScale;
    const centerX = area.x + area.w * 0.5;
    const centerY = area.y + area.h * 0.5;
    return {
      x: centerX - area.w * scale * 0.5,
      y: centerY - area.h * scale * 0.5,
      w: area.w * scale,
      h: area.h * scale
    };
  }

  handleHits() {
    if (!this.ball.isFlying || this.ball.kind !== "shoot" || !this.ball.thrower || this.ball.hasBounced) return;
    const targets = this.ball.thrower.team === "left" ? this.rightTeam : this.leftTeam;

    for (const target of targets) {
      if (target.defeated || target.role !== "inner") continue;
      if (this.ball.hitPlayerIds?.has(target.id)) continue;
      const hit = target.getHitBox();
      const ballY = this.ball.y - this.ball.z;
      if (!this.circleRectOverlap(this.ball.x, ballY, this.ball.radius, hit)) continue;

      const direction = this.ball.vx >= 0 ? 1 : -1;
      const specialType = this.ball.specialShotType;
      const damage = this.getSpecialShotDamage(this.ball.power, specialType, this.ball.travelDistance);
      const knockbackScale = this.ball.counterShot ? COUNTER_CONFIG.knockbackScale : specialType ? 1.5 : 1;
      const hpBefore = target.hp;
      const damaged = target.takeDamage(damage, direction, GAME_CONFIG.battle, knockbackScale);
      if (damaged) {
        this.addSpiritForDamage(target.team, hpBefore, target.hp);
        this.ball.hitPlayerIds?.add(target.id);
        if (specialType === "lightning") {
          if (target.hp > 0) {
            target.stun(0.55 + Math.max(0, (this.ball.shotMultiplier || 1) - 1.5) * 0.25);
          }
          this.applyLightningSplash(target, damage, this.ball.x, this.ball.y);
          this.ball.lightningImpactPending = false;
        }
        if (specialType === "iron") {
          target.knockbackX += direction * GAME_CONFIG.battle.knockbackSpeed * 1.2;
        }
        if (specialType === "soul") {
          this.healTeamByMaxHpRatio(this.ball.thrower.team, 0.1);
        }
        if (specialType === "tsutenkaku") {
          this.applyTsutenkakuSplash(target, damage, this.ball.tsutenkakuTargetX, this.ball.tsutenkakuTargetY);
        }
        if (specialType === "kiai") {
          this.startScreenShake(11, 0.12);
        }
        this.spawnEffect(
          this.ball.x,
          ballY,
          this.getSpecialHitColor(specialType),
          specialType === "slap" ? "slapImpact" : specialType === "kiai" ? "kiaiImpact" : specialType ? "special" : "hit"
        );
        this.spawnDamageNumber(target, damage);
        if (specialType === "boomerang") {
          this.ball.drop();
          this.ball.vx = 0;
          this.ball.vy = 0;
          this.ball.vz = Math.min(-120, this.ball.vz);
          return;
        }
        if (specialType !== "boomerang" && specialType !== "iron") {
          this.spillHitBallInDefenderCourt(target, direction, damage);
        }
      }
      break;
    }
  }

  spillHitBallInDefenderCourt(target, direction, damage) {
    const area = this.areas[target.zone];
    const rawPoint = {
      x: target.x + direction * Math.min(44, Math.max(16, this.ball.radius * 1.2)),
      y: target.y + (Math.random() - 0.5) * 46
    };
    const point = this.clampPointToArea(rawPoint, area, this.ball.radius + 20);
    this.ball.x = point.x;
    this.ball.y = point.y;
    this.ball.z = Math.min(42, Math.max(0, target.jumpZ * 0.2));
    this.ball.bounceFromHit(0, damage / 28);
    const areaCenterX = area?.x + area?.w * 0.5 || target.x;
    const towardAreaCenter = Math.sign(areaCenterX - point.x) || -direction || 1;
    const speed = Math.max(80, Math.min(190, GAME_CONFIG.ball.hitBounceX * 0.34));
    this.ball.vx = towardAreaCenter * speed;
    this.ball.vy = (Math.random() - 0.5) * Math.max(60, GAME_CONFIG.ball.hitBounceY * 0.28);
    this.ball.vz = Math.max(70, Math.min(135, damage * 1.4));
    this.looseOutfieldRecoveryTimer = 0;
    this.lastLooseOutfieldBallPosition = null;
    this.lastLooseOutfieldReceiverDistance = Infinity;
  }

  handleTripleBallHits() {
    if (!this.tripleBalls || this.tripleBalls.length === 0) return;
    const remaining = [];
    for (const shot of this.tripleBalls) {
      const targets = shot.team === "left" ? this.rightTeam : this.leftTeam;
      let consumed = false;
      for (const target of targets) {
        if (target.defeated || target.role !== "inner" || shot.hitPlayerIds.has(target.id)) continue;
        const hit = target.getHitBox();
        const ballY = shot.y - shot.z;
        if (!this.circleRectOverlap(shot.x, ballY, shot.radius, hit)) continue;
        const direction = shot.vx >= 0 ? 1 : -1;
        const hpBefore = target.hp;
        if (target.takeDamage(shot.power, direction, GAME_CONFIG.battle, 0.55)) {
          this.addSpiritForDamage(target.team, hpBefore, target.hp);
          this.spawnEffect(shot.x, ballY, "#ffcc8a", "hit");
          this.spawnDamageNumber(target, shot.power);
        }
        consumed = true;
        break;
      }
      if (!consumed) remaining.push(shot);
    }
    this.tripleBalls = remaining;
  }

  handleLightningZigzagImpact() {
    if (
      !this.ball.lightningImpactPending ||
      this.ball.specialShotType !== "lightning" ||
      !this.ball.thrower
    ) return;

    const damage = this.getSpecialShotDamage(this.ball.power, "lightning", this.ball.travelDistance);
    this.ball.lightningImpactPending = false;
    this.applyLightningSplash(null, damage, this.ball.lightningTargetX, this.ball.lightningTargetY);
    this.spawnEffect(this.ball.lightningTargetX, this.ball.lightningTargetY - 48, "#ffd400", "special");
  }

  handleTsutenkakuImpact() {
    if (
      !this.ball.tsutenkakuImpactPending ||
      this.ball.specialShotType !== "tsutenkaku" ||
      !this.ball.thrower
    ) return;

    const centerX = this.ball.tsutenkakuTargetX;
    const centerY = this.ball.tsutenkakuTargetY;
    const damage = this.getSpecialShotDamage(this.ball.power, "tsutenkaku", this.ball.travelDistance);
    this.ball.tsutenkakuImpactPending = false;
    this.applyTsutenkakuSplash(null, damage, centerX, centerY);
    this.ball.drop();
  }

  getSpecialShotDamage(baseDamage, specialType, travelDistance = 0) {
    if (specialType === "kiai") {
      return baseDamage * 1.7;
    }
    if (specialType === "lightning" || specialType === "triple") {
      return baseDamage * 2;
    }
    if (specialType === "boomerang") {
      return baseDamage * 2.2;
    }
    if (specialType === "boost") {
      return baseDamage * (1.7 + Math.min(0.8, travelDistance / 1900 * 0.8));
    }
    if (specialType === "iron") {
      return baseDamage * 3;
    }
    if (specialType === "tsutenkaku") {
      return baseDamage * 2;
    }
    if (specialType === "soul") {
      return baseDamage * 1.2;
    }
    if (specialType === "slap") {
      const distancePenalty = Math.min(1.75, Math.max(0, travelDistance) / 690);
      return baseDamage * (2.8 - distancePenalty);
    }
    return baseDamage;
  }

  handleBoostShotExit() {
    if (!this.ball.isFlying || this.ball.kind !== "shoot" || this.ball.specialShotType !== "boost") return;

    const margin = 260;
    const outside = (
      this.ball.x < this.ballBounds.x - margin ||
      this.ball.x > this.ballBounds.x + this.ballBounds.w + margin ||
      this.ball.y < this.ballBounds.y - margin ||
      this.ball.y > this.ballBounds.y + this.ballBounds.h + margin
    );
    if (!outside) return;

    const throwerTeam = this.ball.thrower?.team;
    const receiver = throwerTeam ? this.findNearestOutfielder(throwerTeam, this.ball.x, this.ball.y) : null;
    if (receiver) {
      this.ball.pickUp(receiver);
      receiver.throwLockTimer = Math.max(receiver.throwLockTimer, 0.2);
      this.setControlledMember(receiver.team, receiver);
      this.spawnEffect(receiver.x, receiver.y - 58, "#ffb347", "catch");
      return;
    }

    this.releaseBallAt(GAME_CONFIG.court.centerX, GAME_CONFIG.court.y + GAME_CONFIG.court.h * 0.55, "loose");
  }

  addSpirit(team, amount) {
    if (!this.spiritPoints || !team) return;
    const max = GAME_CONFIG.battle.spiritMax;
    this.spiritPoints[team] = Math.max(0, Math.min(max, (this.spiritPoints[team] || 0) + amount));
  }

  addSpiritForDamage(team, hpBefore, hpAfter) {
    if (hpBefore <= 0) return;
    const gain = hpAfter <= 0
      ? GAME_CONFIG.battle.spiritDefeatGain
      : GAME_CONFIG.battle.spiritDamageGain;
    this.addSpirit(team, gain);
  }

  hasFullSpirit(team) {
    return (this.spiritPoints?.[team] || 0) >= GAME_CONFIG.battle.spiritMax;
  }

  consumeSpirit(team) {
    if (!this.spiritPoints || !team) return;
    this.spiritPoints[team] = 0;
  }

  healTeam(teamName, amount) {
    const team = teamName === "left" ? this.leftTeam : this.rightTeam;
    for (const member of team) {
      if (member.defeated || member.hp <= 0) continue;
      const before = member.hp;
      member.hp = Math.min(member.maxHp, member.hp + amount);
      if (member.hp > before) {
        this.spawnEffect(member.x, member.y - member.jumpZ - 88, "#bdf8ff", "heal");
      }
    }
  }

  healTeamByMaxHpRatio(teamName, ratio) {
    const team = teamName === "left" ? this.leftTeam : this.rightTeam;
    for (const member of team) {
      if (member.defeated || member.hp <= 0) continue;
      const before = member.hp;
      member.hp = Math.min(member.maxHp, member.hp + member.maxHp * ratio);
      if (member.hp > before) {
        this.spawnEffect(member.x, member.y - member.jumpZ - 88, "#ffc4e5", "heal");
      }
    }
  }

  applyLightningSplash(primaryTarget, baseDamage, centerX = primaryTarget?.x, centerY = primaryTarget?.y) {
    const enemies = this.ball.thrower.team === "left" ? this.rightTeam : this.leftTeam;
    const splashRadius = 285;
    const splashDamage = Math.max(1, baseDamage * 0.2);
    for (const enemy of enemies) {
      if (enemy === primaryTarget || enemy.defeated || enemy.role !== "inner") continue;
      const distance = Math.hypot(enemy.x - centerX, enemy.y - centerY);
      if (distance > splashRadius) continue;
      const direction = enemy.x >= centerX ? 1 : -1;
      const hpBefore = enemy.hp;
      if (enemy.takeDamage(splashDamage, direction, GAME_CONFIG.battle, 1.5)) {
        this.addSpiritForDamage(enemy.team, hpBefore, enemy.hp);
        enemy.stun(0.36);
        this.spawnEffect(enemy.x, enemy.y - enemy.jumpZ - 70, "#8ffcff", "special");
        this.spawnDamageNumber(enemy, splashDamage);
      } else if (enemy.hp > 0) {
        enemy.stun(0.24);
        this.spawnEffect(enemy.x, enemy.y - enemy.jumpZ - 70, "#8ffcff", "special");
      }
    }
  }

  applyTsutenkakuSplash(primaryTarget, baseDamage, centerX, centerY) {
    const enemies = this.ball.thrower.team === "left" ? this.rightTeam : this.leftTeam;
    const splashRadius = 300;
    const splashDamage = Math.max(1, baseDamage * 0.2);
    for (const enemy of enemies) {
      if (enemy === primaryTarget || enemy.defeated || enemy.role !== "inner") continue;
      const dx = enemy.x - centerX;
      const dy = enemy.y - centerY;
      const distance = Math.hypot(dx, dy);
      if (distance > splashRadius) continue;

      const length = distance || 1;
      const direction = dx >= 0 ? 1 : -1;
      const hpBefore = enemy.hp;
      if (enemy.takeDamage(splashDamage, direction, GAME_CONFIG.battle, 1.8, true)) {
        this.addSpiritForDamage(enemy.team, hpBefore, enemy.hp);
        enemy.knockbackX += dx / length * GAME_CONFIG.battle.knockbackSpeed * 1.15;
        enemy.knockbackY += dy / length * GAME_CONFIG.battle.knockbackSpeed * 0.85;
        this.spawnEffect(enemy.x, enemy.y - enemy.jumpZ - 62, "#ffd83d", "special");
        this.spawnDamageNumber(enemy, splashDamage);
      }
    }
    this.spawnTsutenkakuImpactEffects(centerX, centerY);
  }

  spawnTsutenkakuImpactEffects(centerX, centerY) {
    this.spawnEffect(centerX, centerY - 42, "#ffd83d", "special");
    for (let index = 0; index < 8; index += 1) {
      const angle = index * Math.PI * 0.25;
      this.spawnEffect(
        centerX + Math.cos(angle) * 120,
        centerY + Math.sin(angle) * 72 - 42,
        index % 2 === 0 ? "#fff06a" : "#ff9f32",
        "special"
      );
    }
  }

  getSpecialHitColor(specialType) {
    if (specialType === "kiai") return "#fff06a";
    if (specialType === "triple") return "#ffcc8a";
    if (specialType === "boost") return "#ff7a1f";
    if (specialType === "lightning") return "#8ffcff";
    if (specialType === "iron") return "#aeb4bf";
    if (specialType === "boomerang") return "#a8ff6b";
    if (specialType === "soul") return "#ffc4e5";
    if (specialType === "slap") return "#ff6b35";
    if (specialType === "tsutenkaku") return "#ffd83d";
    return "#ffe46a";
  }

  checkGameOver() {
    const leftAlive = this.leftTeam.some((p) => p.role === "inner" && p.hp > 0);
    const rightAlive = this.rightTeam.some((p) => p.role === "inner" && p.hp > 0);

    if (!rightAlive) {
      if (!this.isEliminationAnimationFinished(this.rightTeam)) {
        this.message = this.ball.owner ? (this.ball.owner.team === "left" ? "MY TEAM BALL" : "ENEMY BALL") : "LOOSE BALL";
        return;
      }
      this.state = "gameOver";
      this.message = "YOU WIN";
    } else if (!leftAlive) {
      if (!this.isEliminationAnimationFinished(this.leftTeam)) {
        this.message = this.ball.owner ? (this.ball.owner.team === "left" ? "MY TEAM BALL" : "ENEMY BALL") : "LOOSE BALL";
        return;
      }
      this.state = "gameOver";
      this.message = "YOU LOSE";
    } else if (this.ball.owner) {
      this.message = this.ball.owner.team === "left" ? "MY TEAM BALL" : "ENEMY BALL";
    } else {
      this.message = "LOOSE BALL";
    }
  }

  isEliminationAnimationFinished(team) {
    const pending = team.filter((p) => p.role === "inner" && p.hp <= 0);
    if (pending.length === 0) return true;
    return pending.every((p) => p.defeated && p.leaveTimer > GAME_CONFIG.battle.exitDelay);
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
    const duration = type === "kiaiImpact" ? 0.46 : type === "counterCatch" ? 0.48 : 0.32;
    this.effects.push({ x, y, color, type, life: duration, maxLife: duration });
  }

  startScreenShake(strength, duration) {
    this.screenShakeStrength = Math.max(this.screenShakeStrength, strength);
    this.screenShakeDuration = Math.max(this.screenShakeDuration, duration);
    this.screenShakeTimer = Math.max(this.screenShakeTimer, duration);
  }

  updateBoostPresentation() {
    const boosting = this.ball?.isFlying && this.ball.kind === "shoot" && this.ball.specialShotType === "boost";
    if (!boosting) {
      this.boostEffectStage = 0;
      return;
    }

    const elapsed = this.ball.boostElapsed;
    const stage = elapsed >= 0.95 ? 4 : elapsed >= 0.68 ? 3 : elapsed >= 0.42 ? 2 : elapsed >= 0.2 ? 1 : 0;
    if (stage <= this.boostEffectStage) return;

    this.boostEffectStage = stage;
    this.effects.push({
      x: this.ball.x,
      y: this.ball.y - this.ball.z,
      color: stage >= 4 ? "#fff36a" : "#ff7a1f",
      type: "boostBurst",
      life: 0.42,
      maxLife: 0.42
    });
  }

  spawnDamageNumber(target, amount) {
    this.effects.push({
      x: target.x + target.facing * -34,
      y: target.y - target.jumpZ - 92,
      color: "#ff3d2f",
      type: "damageNumber",
      text: `-${Math.round(amount)}`,
      life: 0.95,
      maxLife: 0.95
    });
  }

  showShotMultiplier(multiplier, actor, specialType = null) {
    this.shotMultiplierDisplay = {
      multiplier,
      team: actor.team,
      specialType,
      life: 2.6,
      maxLife: 2.6
    };
  }

  getSpecialShotLabel(specialType) {
    if (specialType === "kiai") return "気合ストレート";
    if (specialType === "triple") return "\u30c8\u30ea\u30d7\u30eb\u30b7\u30e7\u30c3\u30c8";
    if (specialType === "boost") return "BOOST";
    if (specialType === "lightning") return "LIGHTNING";
    if (specialType === "iron") return "IRON";
    if (specialType === "boomerang") return "BANANA";
    if (specialType === "soul") return "SOUL RECOVERY";
    if (specialType === "slap") return "張り手シュート";
    if (specialType === "tsutenkaku") return "\u901a\u5929\u95a3\u843d\u3068\u3057";
    return "";
  }

  updateEffects(delta) {
    this.screenShakeTimer = Math.max(0, this.screenShakeTimer - delta);
    if (this.screenShakeTimer <= 0) {
      this.screenShakeDuration = 0;
      this.screenShakeStrength = 0;
    }
    if (this.shotMultiplierDisplay) {
      this.shotMultiplierDisplay.life -= delta;
      if (this.shotMultiplierDisplay.life <= 0) this.shotMultiplierDisplay = null;
    }
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
    if (this.screenShakeTimer > 0) {
      const ratio = this.screenShakeTimer / Math.max(0.01, this.screenShakeDuration);
      const strength = this.screenShakeStrength * ratio;
      context.translate((Math.random() - 0.5) * strength * 2, (Math.random() - 0.5) * strength * 2);
    }
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
    this.drawTripleBalls(context);
    this.drawChargeEffect();
    this.drawSpecialAnticipationEffect();
    this.drawMatchPlayerNames(context);
    if (DEBUG_MODE) this.drawDebugAreas();
    context.restore();

    this.drawSpiritGauges();
    this.drawGamepadButtonMonitor();
    this.drawShotMultiplierDebug();

    if (this.state === "paused") {
      this.drawPauseMenu();
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

    context.fillStyle = "#dff8ff";
    context.fillRect(centerX - 430, 92, 860, 92);
    context.fillStyle = "#fff7df";
    context.strokeStyle = "#27324a";
    context.font = "bold 58px Meiryo, sans-serif";
    context.strokeText("\u3076\u3063\u3068\u3073\u30c9\u30c3\u30b8\u30fc\u30ba", centerX, 155);
    context.fillText("\u3076\u3063\u3068\u3073\u30c9\u30c3\u30b8\u30fc\u30ba", centerX, 155);

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
      { label: "二人用", note: "2P対戦" },
      { label: "観戦", note: "CPU vs CPU" }
    ];
    for (let i = 0; i < modes.length; i += 1) {
      const x = 310 + i * 410;
      const selected = this.modeIndex === i;
      context.fillStyle = selected ? "rgba(255,244,168,0.95)" : "rgba(255,255,255,0.78)";
      context.strokeStyle = selected ? "#263241" : "rgba(38,50,65,0.45)";
      context.lineWidth = selected ? 6 : 3;
      this.roundRect(context, x - 140, 275, 280, 140, 8);
      context.fill();
      context.stroke();
      context.fillStyle = "#263241";
      context.font = "bold 34px Meiryo, sans-serif";
      context.fillText(modes[i].label, x, 332);
      context.font = "20px Meiryo, sans-serif";
      context.fillText(modes[i].note, x, 374);
    }

    context.fillStyle = "#fff7df";
    context.font = "20px Meiryo, sans-serif";
    context.fillText("左右で選択 / ボタン2で決定", centerX, 520);
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
    if (this.gameMode === "versus") {
      this.drawTeamSelectSide("right", 700, "#f01818");
    } else {
      this.drawCpuOpponentSelect();
    }
    this.drawMatchStartButton();

    context.fillStyle = "#fff7df";
    context.font = "18px Meiryo, sans-serif";
    context.fillText("左右で選手選択 / ボタン2でタイプ変更・試合開始 / ボタン1で戻る", centerX, 688);
    context.restore();
  }

  drawModeSelect() {
    const context = this.context;
    const centerX = GAME_CONFIG.width * 0.5;
    this.drawMenuBackground();
    context.save();
    context.textAlign = "center";
    context.fillStyle = "#fff7df";
    context.strokeStyle = "#27324a";
    context.lineWidth = 6;
    context.font = "bold 58px Meiryo, sans-serif";
    context.strokeText("モードセレクト", centerX, 155);
    context.fillText("モードセレクト", centerX, 155);

    const modes = [
      { label: "一人用", note: "1P vs CPU" },
      { label: "二人用", note: "1P vs 2P" },
      { label: "観戦", note: "CPU vs CPU" }
    ];
    for (let i = 0; i < modes.length; i += 1) {
      const x = 310 + i * 410;
      const selected = this.modeIndex === i;
      context.fillStyle = selected ? "rgba(255,244,168,0.95)" : "rgba(255,255,255,0.78)";
      context.strokeStyle = selected ? "#263241" : "rgba(38,50,65,0.45)";
      context.lineWidth = selected ? 6 : 3;
      this.roundRect(context, x - 140, 275, 280, 140, 8);
      context.fill();
      context.stroke();
      context.fillStyle = "#263241";
      context.font = "bold 34px Meiryo, sans-serif";
      context.fillText(modes[i].label, x, 332);
      context.font = "20px Meiryo, sans-serif";
      context.fillText(modes[i].note, x, 374);
    }

    context.fillStyle = "#fff7df";
    context.font = "20px Meiryo, sans-serif";
    context.fillText("左右で選択 / ボタン2で決定", centerX, 520);
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
    context.strokeText(this.gameMode === "watch" ? "観戦チーム選択" : "チーム編成", centerX, 84);
    context.fillText(this.gameMode === "watch" ? "観戦チーム選択" : "チーム編成", centerX, 84);

    if (this.gameMode === "watch") {
      this.drawWatchTeamSelect();
    } else {
      this.drawTeamSelectSide("left", 120, "#0057ff");
      if (this.gameMode === "versus") {
        this.drawTeamSelectSide("right", 700, "#f01818");
      } else {
        this.drawCpuOpponentSelect();
      }
    }
    this.drawMatchStartButton();

    context.fillStyle = "#fff7df";
    context.font = "18px Meiryo, sans-serif";
    const help = this.gameMode === "watch"
      ? "上下でチーム選択 / 左右で欄移動 / ボタン2で決定・観戦開始 / ボタン1で戻る"
      : this.gameMode === "single"
        ? "左右で選手選択 / 上下でCPUチーム選択 / ボタン2でタイプ変更・決定 / ボタン1で戻る"
        : "左右で選手選択 / ボタン2でタイプ変更・試合開始 / ボタン1で戻る";
    context.fillText(help, centerX, 688);
    context.restore();
  }

  drawWatchTeamSelect() {
    const leftTeam = this.getCpuOpponentTeamByIndex(this.watchCpuLeftIndex);
    const rightTeam = this.getCpuOpponentTeamByIndex(this.watchCpuRightIndex);
    this.drawWatchCpuTeamDetails(leftTeam, 144, 278, "#0057ff");
    this.drawWatchCpuTeamDetails(rightTeam, 814, 278, "#f01818");
    this.drawTeamChoicePanel(
      "left",
      90,
      122,
      590,
      "LEFT CPU TEAM",
      "#0057ff",
      this.watchSelectionSlot === 0,
      this.watchCpuLeftIndex
    );
    this.drawTeamChoicePanel(
      "right",
      760,
      122,
      590,
      "RIGHT CPU TEAM",
      "#f01818",
      this.watchSelectionSlot === 1,
      this.watchCpuRightIndex
    );
  }

  drawWatchTeamColumn(title, x, y, color, selectedIndex, active) {
    const context = this.context;
    const teams = this.getSelectableTeams();
    context.save();
    context.textAlign = "left";
    context.fillStyle = color;
    context.font = "bold 28px Meiryo, sans-serif";
    context.fillText(title, x, y - 22);

    context.fillStyle = active ? "rgba(255,244,168,0.96)" : "rgba(255,255,255,0.82)";
    context.strokeStyle = active ? "#263241" : "rgba(38,50,65,0.36)";
    context.lineWidth = active ? 5 : 2;
    this.roundRect(context, x, y, 560, 142, 8);
    context.fill();
    context.stroke();

    context.font = "bold 22px Meiryo, sans-serif";
    for (let i = 0; i < teams.length; i += 1) {
      const rowX = x + 18 + (i % 2) * 270;
      const rowY = y + 42 + Math.floor(i / 2) * 48;
      const rowSelected = i === selectedIndex;
      context.fillStyle = rowSelected ? "rgba(255,216,61,0.9)" : "rgba(255,255,255,0.65)";
      context.strokeStyle = rowSelected ? "#263241" : "rgba(38,50,65,0.22)";
      context.lineWidth = rowSelected ? 4 : 1;
      this.roundRect(context, rowX, rowY - 28, 248, 36, 6);
      context.fill();
      context.stroke();
      context.fillStyle = "#263241";
      context.fillText(teams[i].name, rowX + 12, rowY - 4);
    }
    context.restore();
  }

  drawWatchCpuTeamDetails(team, x, y, color) {
    const context = this.context;
    const players = team.players || [];
    context.save();
    context.textAlign = "left";
    context.fillStyle = "rgba(255,255,255,0.82)";
    context.strokeStyle = "rgba(38,50,65,0.36)";
    context.lineWidth = 2;
    this.roundRect(context, x, y, 482, 260, 8);
    context.fill();
    context.stroke();

    context.fillStyle = color;
    context.font = "bold 24px Meiryo, sans-serif";
    context.fillText(team.name, x + 18, y + 34);
    context.fillStyle = "#4b5360";
    context.font = "16px Meiryo, sans-serif";
    context.fillText(team.description || "", x + 18, y + 62);

    context.fillStyle = "#263241";
    context.font = "bold 13px Meiryo, sans-serif";
    context.fillText("選手", x + 18, y + 92);
    context.fillText("HP", x + 148, y + 92);
    context.fillText("P", x + 198, y + 92);
    context.fillText("S", x + 230, y + 92);
    context.fillText("J", x + 262, y + 92);
    context.fillText("T", x + 294, y + 92);
    context.fillText("技", x + 366, y + 92);

    context.font = "13px Meiryo, sans-serif";
    for (let i = 0; i < Math.min(players.length, 8); i += 1) {
      const player = players[i];
      const rowY = y + 118 + i * 17;
      const stats = player.stats || {};
      const roleLabel = player.position === "out" ? "外" : "内";
      context.fillStyle = i < 5 ? "rgba(0,87,255,0.06)" : "rgba(240,24,24,0.06)";
      context.fillRect(x + 12, rowY - 13, 458, 16);
      context.fillStyle = "#263241";
      context.fillText(`${roleLabel} ${player.name}`, x + 18, rowY);
      context.fillText(String(player.maxHp ?? team.maxHp ?? ""), x + 148, rowY);
      context.fillText(String(stats.power ?? ""), x + 202, rowY);
      context.fillText(String(stats.speed ?? ""), x + 234, rowY);
      context.fillText(String(stats.jump ?? ""), x + 266, rowY);
      context.fillText(String(stats.technique ?? ""), x + 298, rowY);
      context.fillText(this.getSpecialShotShortLabel(player.specialShotType), x + 366, rowY);
    }
    context.restore();
  }

  drawCpuOpponentSelect() {
    const context = this.context;
    const teams = this.getCpuOpponentTeams();
    const opponent = this.getSelectedCpuOpponentTeam();
    const selected = this.teamSelectionSlot === CPU_OPPONENT_SLOT;
    const x = 760;
    const y = 165;
    context.save();
    context.textAlign = "left";
    context.fillStyle = "#f01818";
    context.font = "bold 28px Meiryo, sans-serif";
    context.fillText("CPU TEAM", x, 142);

    context.fillStyle = selected ? "rgba(255,244,168,0.96)" : "rgba(255,255,255,0.82)";
    context.strokeStyle = selected ? "#263241" : "rgba(38,50,65,0.36)";
    context.lineWidth = selected ? 5 : 2;
    this.roundRect(context, x, y, 238, 220, 8);
    context.fill();
    context.stroke();

    context.font = "bold 22px Meiryo, sans-serif";
    for (let i = 0; i < teams.length; i += 1) {
      const rowY = y + 46 + i * 48;
      const rowSelected = i === this.cpuOpponentIndex;
      context.fillStyle = rowSelected ? "rgba(255,216,61,0.9)" : "rgba(255,255,255,0.72)";
      context.strokeStyle = rowSelected ? "#263241" : "rgba(38,50,65,0.25)";
      context.lineWidth = rowSelected ? 4 : 1;
      this.roundRect(context, x + 16, rowY - 28, 206, 36, 6);
      context.fill();
      context.stroke();
      context.fillStyle = "#263241";
      context.fillText(teams[i].name, x + 28, rowY - 4);
    }
    this.drawCpuOpponentDetails(opponent, 1024, y);
    context.restore();
  }

  drawCpuOpponentDetails(team, x, y) {
    const context = this.context;
    const players = team.players || [];
    context.fillStyle = "rgba(255,255,255,0.82)";
    context.strokeStyle = "rgba(38,50,65,0.36)";
    context.lineWidth = 2;
    this.roundRect(context, x, y, 376, 340, 8);
    context.fill();
    context.stroke();

    context.fillStyle = "#263241";
    context.font = "bold 22px Meiryo, sans-serif";
    context.fillText(team.name, x + 18, y + 34);
    context.font = "bold 13px Meiryo, sans-serif";
    context.fillText("名前", x + 18, y + 64);
    context.fillText("HP", x + 118, y + 64);
    context.fillText("P", x + 168, y + 64);
    context.fillText("S", x + 200, y + 64);
    context.fillText("J", x + 232, y + 64);
    context.fillText("T", x + 264, y + 64);
    context.fillText("技", x + 330, y + 64);

    context.font = "13px Meiryo, sans-serif";
    for (let i = 0; i < players.length; i += 1) {
      const player = players[i];
      const rowY = y + 90 + i * 29;
      const stats = player.stats || {};
      const roleLabel = player.position === "out" ? "外" : "内";
      context.fillStyle = i < 5 ? "rgba(0,87,255,0.06)" : "rgba(240,24,24,0.06)";
      context.fillRect(x + 12, rowY - 18, 352, 24);
      context.fillStyle = "#263241";
      context.fillText(`${roleLabel} ${player.name}`, x + 18, rowY);
      context.fillText(String(player.maxHp ?? team.maxHp ?? ""), x + 118, rowY);
      context.fillText(String(stats.power ?? ""), x + 172, rowY);
      context.fillText(String(stats.speed ?? ""), x + 204, rowY);
      context.fillText(String(stats.jump ?? ""), x + 236, rowY);
      context.fillText(String(stats.technique ?? ""), x + 268, rowY);
      context.fillText(this.getSpecialShotShortLabel(player.specialShotType), x + 330, rowY);
    }
  }

  getSpecialShotShortLabel(specialType) {
    if (specialType === "kiai") return "気";
    if (specialType === "triple") return "三";
    if (specialType === "boost") return "ブ";
    if (specialType === "lightning") return "雷";
    if (specialType === "iron") return "鉄";
    if (specialType === "boomerang") return "バ";
    if (specialType === "soul") return "魂";
    if (specialType === "slap") return "張";
    if (specialType === "tsutenkaku") return "\u901a";
    return "-";
  }

  drawMatchPlayerNames(context) {
    if (this.gameMode === "versus") return;
    context.save();
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.font = "bold 18px Meiryo, sans-serif";
    context.lineWidth = 4;
    const namedPlayers = [...this.leftTeam, ...this.rightTeam];
    for (const player of namedPlayers) {
      if (!player || player.defeated || player.leaveTimer > GAME_CONFIG.battle.exitDelay) continue;
      const scale = player.lastDrawScale || 1;
      const x = player.x + 36 * scale;
      const y = player.y - player.jumpZ - 58 * scale;
      context.strokeStyle = "rgba(255,255,255,0.9)";
      context.fillStyle = "#263241";
      context.strokeText(player.name || "", x, y);
      context.fillText(player.name || "", x, y);
    }
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

    for (let i = 0; i < TEAM_SELECTION_COUNT; i += 1) {
      const row = Math.floor(i / TEAM_SELECT_COLUMNS);
      const col = i % TEAM_SELECT_COLUMNS;
      const cardX = x + col * 122;
      const cardY = 165 + row * 185;
      const selected = this.isTeamSelectSlotSelected(side, i);
      const type = this.teamSelections[side][i];
      const definition = CHARACTER_TYPES[type] || CHARACTER_TYPES.normal;

      context.fillStyle = selected ? "rgba(255,244,168,0.96)" : "rgba(255,255,255,0.82)";
      context.strokeStyle = selected ? "#263241" : "rgba(38,50,65,0.36)";
      context.lineWidth = selected ? 5 : 2;
      this.roundRect(context, cardX, cardY, 108, 142, 8);
      context.fill();
      context.stroke();

      this.drawCharacterPreview(cardX + 54, cardY + 100, side, type);
      context.textAlign = "center";
      context.fillStyle = "#263241";
      context.font = "bold 18px Meiryo, sans-serif";
      context.fillText(definition.label, cardX + 54, cardY + 30);
      context.font = "14px Meiryo, sans-serif";
      context.fillText(i < 3 ? `内野 ${i + 1}` : `外野 ${i - 2}`, cardX + 66, cardY + 52);
    }
    context.restore();
  }

  isTeamSelectSlotSelected(side, slot) {
    if (this.gameMode === "versus") return this.teamSelectionSlots[side] === slot;
    return this.teamSelectionSide === side && this.teamSelectionSlot === slot;
  }

  drawTeamSelectSide(side, x, color) {
    const context = this.context;
    const title = side === "left" ? "1P TEAM" : "2P TEAM";
    context.save();
    context.textAlign = "left";
    context.fillStyle = color;
    context.font = "bold 28px Meiryo, sans-serif";
    context.fillText(title, x, 142);

    for (let i = 0; i < TEAM_SELECTION_COUNT; i += 1) {
      const row = Math.floor(i / TEAM_SELECT_COLUMNS);
      const col = i % TEAM_SELECT_COLUMNS;
      const cardX = x + col * 122;
      const cardY = 165 + row * 185;
      const selected = this.isTeamSelectSlotSelected(side, i);
      const type = this.teamSelections[side][i];
      const definition = CHARACTER_TYPES[type] || CHARACTER_TYPES.normal;

      context.fillStyle = selected ? "rgba(255,244,168,0.96)" : "rgba(255,255,255,0.82)";
      context.strokeStyle = selected ? "#263241" : "rgba(38,50,65,0.36)";
      context.lineWidth = selected ? 5 : 2;
      this.roundRect(context, cardX, cardY, 108, 142, 8);
      context.fill();
      context.stroke();

      this.drawCharacterPreview(cardX + 54, cardY + 100, side, type);
      context.textAlign = "center";
      context.fillStyle = "#263241";
      context.font = "bold 18px Meiryo, sans-serif";
      context.fillText(definition.label, cardX + 54, cardY + 30);
      context.font = "14px Meiryo, sans-serif";
      context.fillText(i < 5 ? `内野 ${i + 1}` : `外野 ${i - 4}`, cardX + 54, cardY + 50);
    }
    context.restore();
  }

  drawMatchStartButton() {
    const context = this.context;
    const centerX = GAME_CONFIG.width * 0.5;
    const selected = this.gameMode === "watch"
      ? this.watchSelectionSlot === 2
      : this.gameMode === "versus"
        ? this.teamSelectionSlots.left === START_SLOT || this.teamSelectionSlots.right === START_SLOT
        : this.teamSelectionSlot === START_SLOT;
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
      if (this.teamSelectionSlots.left === START_SLOT) labels.push("1P");
      if (this.teamSelectionSlots.right === START_SLOT) labels.push("2P");
      context.fillText(labels.join(" / "), centerX, 612);
    }
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
    context.strokeText(this.gameMode === "watch" ? "観戦チーム選択" : "チーム編成", centerX, 84);
    context.fillText(this.gameMode === "watch" ? "観戦チーム選択" : "チーム編成", centerX, 84);

    if (this.gameMode === "watch") {
      this.drawWatchTeamSelect();
    } else {
      this.drawPlayableTeamSelectSide("left", 90, this.gameMode === "single" ? "1P TEAM" : "1P TEAM", "#0057ff");
      this.drawPlayableTeamSelectSide("right", 760, this.gameMode === "single" ? "CPU TEAM" : "2P TEAM", "#f01818");
    }
    this.drawMatchStartButton();

    context.fillStyle = "#fff7df";
    context.font = "18px Meiryo, sans-serif";
    const help = this.gameMode === "watch"
      ? "上下でチーム選択 / 左右で選択欄移動 / ボタン2で決定・観戦開始 / ボタン1で戻る"
      : "上下でチーム選択 / ボタン2で決定・タイプ変更・試合開始 / ボタン1で戻る";
    context.fillText(help, centerX, 688);
    context.restore();
  }

  drawPlayableTeamSelectSide(side, x, title, color) {
    const team = this.getSelectedTeamForSide(side);
    this.drawTeamChoicePanel(side, x, 122, 590, title, color, this.isTeamSelectSlotSelected(side, CPU_OPPONENT_SLOT));
    if (!this.teamSelectionConfirmed?.[side]) {
      this.drawTeamPendingPanel(team, x + 54, 278, color);
    } else if (team?.isCustom) {
      this.drawEditableTeamCards(side, x, 270, color);
    } else {
      this.drawFixedTeamSummary(team, x + 54, 278, color);
    }
  }

  drawTeamPendingPanel(team, x, y, color) {
    const context = this.context;
    context.save();
    context.textAlign = "center";
    context.fillStyle = "rgba(255,255,255,0.68)";
    context.strokeStyle = "rgba(38,50,65,0.28)";
    context.lineWidth = 2;
    this.roundRect(context, x, y, 482, 132, 8);
    context.fill();
    context.stroke();
    context.fillStyle = color;
    context.font = "bold 24px Meiryo, sans-serif";
    context.fillText(team?.name || "", x + 241, y + 48);
    context.fillStyle = "#4b5360";
    context.font = "16px Meiryo, sans-serif";
    context.fillText("ボタン2でチーム決定", x + 241, y + 86);
    context.restore();
  }

  drawTeamChoicePanel(side, x, y, width, title, color, active, selectedIndexOverride = null) {
    const context = this.context;
    const teams = this.getSelectableTeams();
    const selectedIndex = selectedIndexOverride ?? this.selectedTeamIndices[side] ?? 0;
    const selectedTeam = teams[selectedIndex] || teams[0];
    context.save();
    context.textAlign = "left";
    context.fillStyle = color;
    context.font = "bold 26px Meiryo, sans-serif";
    context.fillText(title, x, y - 16);

    context.fillStyle = active ? "rgba(255,244,168,0.96)" : "rgba(255,255,255,0.82)";
    context.strokeStyle = active ? "#263241" : "rgba(38,50,65,0.36)";
    context.lineWidth = active ? 5 : 2;
    this.roundRect(context, x, y, width, 58, 8);
    context.fill();
    context.stroke();

    const drawFittedName = (text, textX, textY, maxWidth, maxSize = 26, minSize = 20) => {
      let size = maxSize;
      context.font = `bold ${size}px Meiryo, sans-serif`;
      while (size > minSize && context.measureText(text).width > maxWidth) {
        size -= 1;
        context.font = `bold ${size}px Meiryo, sans-serif`;
      }
      context.fillText(text, textX, textY);
    };

    context.fillStyle = "#263241";
    drawFittedName(selectedTeam?.name || "", x + 20, y + 38, width - 82, 28, 21);
    context.textAlign = "center";
    context.font = "bold 28px Meiryo, sans-serif";
    context.fillText(active ? "▲" : "▼", x + width - 34, y + 39);

    if (active) {
      const listY = y + 64;
      const rowHeight = 38;
      const visibleCount = Math.min(5, teams.length);
      const start = Math.max(0, Math.min(selectedIndex - 2, teams.length - visibleCount));
      context.textAlign = "left";
      context.fillStyle = "rgba(255,255,255,0.94)";
      context.strokeStyle = "#263241";
      context.lineWidth = 3;
      this.roundRect(context, x, listY, width, visibleCount * rowHeight + 12, 8);
      context.fill();
      context.stroke();
      for (let n = 0; n < visibleCount; n += 1) {
        const i = start + n;
        const rowY = listY + 10 + n * rowHeight;
        const rowSelected = i === selectedIndex;
        if (rowSelected) {
          context.fillStyle = "rgba(255,216,61,0.9)";
          this.roundRect(context, x + 10, rowY, width - 20, rowHeight - 6, 6);
          context.fill();
        }
        context.fillStyle = "#263241";
        drawFittedName(teams[i].name, x + 24, rowY + 25, width - 48, 22, 18);
      }
    }
    context.restore();
  }

  drawEditableTeamCards(side, x, y, color) {
    const context = this.context;
    context.save();
    context.textAlign = "left";
    context.fillStyle = color;
    context.font = "bold 18px Meiryo, sans-serif";
    context.fillText("自由編成メンバー", x, y - 12);

    for (let i = 0; i < TEAM_SELECTION_COUNT; i += 1) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      const cardX = x + col * 136;
      const cardY = y + row * 165;
      const selected = this.isTeamSelectSlotSelected(side, i);
      const type = this.teamSelections[side][i];
      const definition = CHARACTER_TYPES[type] || CHARACTER_TYPES.normal;

      context.fillStyle = selected ? "rgba(255,244,168,0.96)" : "rgba(255,255,255,0.82)";
      context.strokeStyle = selected ? "#263241" : "rgba(38,50,65,0.36)";
      context.lineWidth = selected ? 5 : 2;
      this.roundRect(context, cardX, cardY, 116, 132, 8);
      context.fill();
      context.stroke();

      this.drawCharacterPreview(cardX + 58, cardY + 96, side, type);
      context.textAlign = "center";
      context.fillStyle = "#263241";
      context.font = "bold 16px Meiryo, sans-serif";
      context.fillText(definition.label, cardX + 58, cardY + 28);
      context.font = "13px Meiryo, sans-serif";
      context.fillText(i < 5 ? `内野 ${i + 1}` : `外野 ${i - 4}`, cardX + 58, cardY + 48);
      context.textAlign = "left";
    }

    const confirmSelected = this.isTeamSelectSlotSelected(side, CUSTOM_TEAM_CONFIRM_SLOT);
    const buttonX = x + 548;
    const buttonY = y + 108;
    context.fillStyle = confirmSelected ? "rgba(255,244,168,0.98)" : "rgba(255,255,255,0.86)";
    context.strokeStyle = confirmSelected ? "#263241" : "rgba(38,50,65,0.45)";
    context.lineWidth = confirmSelected ? 6 : 3;
    this.roundRect(context, buttonX, buttonY, 94, 62, 8);
    context.fill();
    context.stroke();
    context.fillStyle = "#263241";
    context.font = "bold 22px Meiryo, sans-serif";
    context.textAlign = "center";
    context.fillText("決定", buttonX + 47, buttonY + 39);
    context.restore();
  }

  drawFixedTeamSummary(team, x, y, color) {
    const context = this.context;
    const players = team?.players || [];
    context.save();
    context.textAlign = "left";
    context.fillStyle = "rgba(255,255,255,0.82)";
    context.strokeStyle = "rgba(38,50,65,0.36)";
    context.lineWidth = 2;
    this.roundRect(context, x, y, 482, 292, 8);
    context.fill();
    context.stroke();
    context.fillStyle = color;
    context.font = "bold 24px Meiryo, sans-serif";
    context.fillText(team?.name || "", x + 18, y + 34);
    context.fillStyle = "#4b5360";
    context.font = "15px Meiryo, sans-serif";
    context.fillText(team?.description || "", x + 18, y + 60);
    context.fillStyle = "#263241";
    context.font = "bold 13px Meiryo, sans-serif";
    context.fillText("選手", x + 18, y + 88);
    context.fillText("HP", x + 150, y + 88);
    context.fillText("P", x + 198, y + 88);
    context.fillText("S", x + 230, y + 88);
    context.fillText("J", x + 262, y + 88);
    context.fillText("T", x + 294, y + 88);
    context.fillText("技", x + 326, y + 88);
    context.font = "13px Meiryo, sans-serif";
    for (let i = 0; i < Math.min(players.length, 8); i += 1) {
      const player = players[i];
      const rowY = y + 114 + i * 20;
      const stats = player.stats || {};
      const roleLabel = player.position === "out" ? "外" : "内";
      context.fillStyle = i < 5 ? "rgba(0,87,255,0.06)" : "rgba(240,24,24,0.06)";
      context.fillRect(x + 12, rowY - 14, 458, 18);
      context.fillStyle = "#263241";
      context.fillText(`${roleLabel} ${player.name}`, x + 18, rowY);
      context.fillText(String(player.maxHp ?? team.maxHp ?? ""), x + 150, rowY);
      context.fillText(String(stats.power ?? ""), x + 202, rowY);
      context.fillText(String(stats.speed ?? ""), x + 234, rowY);
      context.fillText(String(stats.jump ?? ""), x + 266, rowY);
      context.fillText(String(stats.technique ?? ""), x + 298, rowY);
      context.fillText(this.getSpecialShotShortLabel(player.specialShotType), x + 326, rowY);
    }
    context.restore();
  }

  drawPlayableTeamSelectSide(side, x, title, color) {
    const team = this.getSelectedTeamForSide(side);
    const editable = Boolean(team?.isCustom && this.teamSelectionConfirmed?.[side]);
    this.drawTeamPlayerCards(side, team, x, 264, color, editable);
    this.drawTeamChoicePanel(side, x, 122, 590, title, color, this.isTeamSelectSlotSelected(side, CPU_OPPONENT_SLOT));
  }

  drawEditableTeamCards(side, x, y, color) {
    this.drawTeamPlayerCards(side, this.getSelectedTeamForSide(side), x, y, color, true);
  }

  drawFixedTeamSummary(team, x, y, color) {
    this.drawTeamPlayerCards("right", team, x - 54, y - 14, color, false);
  }

  drawTeamPlayerCards(side, team, x, y, color, editable) {
    const context = this.context;
    context.save();
    context.textAlign = "left";
    context.fillStyle = color;
    context.font = "bold 18px Meiryo, sans-serif";
    context.fillText(editable ? "自由編成メンバー" : team?.name || "", x, y - 12);

    for (let i = 0; i < TEAM_SELECTION_COUNT; i += 1) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      const cardX = x + col * 136;
      const cardY = y + row * 178;
      const player = editable ? null : team?.players?.[i];
      const type = editable
        ? this.teamSelections[side][i]
        : player?.characterType || team?.characterType || "normal";
      const definition = CHARACTER_TYPES[type] || CHARACTER_TYPES.normal;
      const stats = editable ? definition.stats : player?.stats || team?.stats || definition.stats;
      const maxHp = editable ? definition.maxHp : player?.maxHp ?? team?.maxHp ?? definition.maxHp;
      const roleLabel = editable
        ? (i < 5 ? `内野 ${i + 1}` : `外野 ${i - 4}`)
        : `${player?.position === "out" ? "外" : "内"} ${player?.name || ""}`;
      const title = editable ? this.getTeamSlotName(team, i) || definition.label : player?.name || definition.label;
      const selected = editable && this.isTeamSelectSlotSelected(side, i);
      const previewStyle = editable ? null : {
        ...team,
        ...player,
        uniformEmblem: player?.uniformEmblem || team?.uniformEmblem
      };

      context.fillStyle = selected ? "rgba(255,244,168,0.96)" : "rgba(255,255,255,0.82)";
      context.strokeStyle = selected ? "#263241" : "rgba(38,50,65,0.36)";
      context.lineWidth = selected ? 5 : 2;
      this.roundRect(context, cardX, cardY, 122, 158, 8);
      context.fill();
      context.stroke();

      this.drawCharacterPreview(cardX + 61, cardY + 80, side, type, previewStyle);
      context.textAlign = "center";
      context.fillStyle = "#263241";
      context.font = "bold 14px Meiryo, sans-serif";
      context.fillText(title, cardX + 61, cardY + 22);
      context.font = "12px Meiryo, sans-serif";
      context.fillText(roleLabel, cardX + 61, cardY + 40);
      context.font = "bold 12px Meiryo, sans-serif";
      context.fillText(`HP ${maxHp}`, cardX + 61, cardY + 112);
      context.font = "11px Meiryo, sans-serif";
      context.fillText(
        `P${stats.power ?? "-"} S${stats.speed ?? "-"} J${stats.jump ?? "-"} T${stats.technique ?? "-"}`,
        cardX + 61,
        cardY + 131
      );
      context.fillText(`技 ${this.getSpecialShotShortLabel(player?.specialShotType)}`, cardX + 61, cardY + 148);
      context.textAlign = "left";
    }

    if (editable) {
      const confirmSelected = this.isTeamSelectSlotSelected(side, CUSTOM_TEAM_CONFIRM_SLOT);
      const buttonX = x + 548;
      const buttonY = y + 118;
      context.fillStyle = confirmSelected ? "rgba(255,244,168,0.98)" : "rgba(255,255,255,0.86)";
      context.strokeStyle = confirmSelected ? "#263241" : "rgba(38,50,65,0.45)";
      context.lineWidth = confirmSelected ? 6 : 3;
      this.roundRect(context, buttonX, buttonY, 94, 62, 8);
      context.fill();
      context.stroke();
      context.fillStyle = "#263241";
      context.font = "bold 22px Meiryo, sans-serif";
      context.textAlign = "center";
      context.fillText("決定", buttonX + 47, buttonY + 39);
    }
    context.restore();
  }

  drawTeamPlayerCards(side, team, x, y, color, editable) {
    const context = this.context;
    context.save();
    context.textAlign = "left";
    context.fillStyle = color;
    context.font = "bold 18px Meiryo, sans-serif";
    context.fillText(editable ? "自由編成メンバー" : team?.name || "", x, y - 12);

    for (let i = 0; i < TEAM_SELECTION_COUNT; i += 1) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      const cardX = x + col * 136;
      const cardY = y + row * 180;
      if (i === 0) {
        context.fillStyle = "#dff8ff";
        context.fillRect(x - 8, y - 36, 600, 34);
      }
      const player = editable ? null : team?.players?.[i];
      const type = editable
        ? this.teamSelections[side][i]
        : player?.characterType || team?.characterType || "normal";
      const definition = CHARACTER_TYPES[type] || CHARACTER_TYPES.normal;
      const stats = editable ? definition.stats : player?.stats || team?.stats || definition.stats;
      const maxHp = editable ? definition.maxHp : player?.maxHp ?? team?.maxHp ?? definition.maxHp;
      const roleLabel = editable
        ? (i < 5 ? `内野 ${i + 1}` : `外野 ${i - 4}`)
        : (player?.position === "out" ? "外野" : "内野");
      const title = editable ? this.getTeamSlotName(team, i) || definition.label : player?.name || definition.label;
      const selected = editable && this.isTeamSelectSlotSelected(side, i);
      const previewStyle = editable ? null : {
        ...team,
        ...player,
        uniformEmblem: player?.uniformEmblem || team?.uniformEmblem
      };

      context.fillStyle = selected ? "rgba(255,244,168,0.96)" : "rgba(255,255,255,0.82)";
      context.strokeStyle = selected ? "#263241" : "rgba(38,50,65,0.36)";
      context.lineWidth = selected ? 5 : 2;
      this.roundRect(context, cardX, cardY, 122, 170, 8);
      context.fill();
      context.stroke();

      context.textAlign = "center";
      context.fillStyle = "#263241";
      context.font = "bold 13px Meiryo, sans-serif";
      context.fillText(title, cardX + 61, cardY + 17);
      context.font = "12px Meiryo, sans-serif";
      context.fillText(roleLabel, cardX + 61, cardY + 32);

      this.drawCharacterPreview(cardX + 61, cardY + 105, side, type, previewStyle, 0.36);

      context.fillStyle = "#263241";
      context.font = "bold 12px Meiryo, sans-serif";
      context.fillText(`HP ${maxHp}`, cardX + 61, cardY + 130);
      context.font = "11px Meiryo, sans-serif";
      context.fillText(
        `P${stats.power ?? "-"} S${stats.speed ?? "-"} J${stats.jump ?? "-"} T${stats.technique ?? "-"}`,
        cardX + 61,
        cardY + 147
      );
      context.font = "10px Meiryo, sans-serif";
      context.fillText(this.getSpecialShotLabel(player?.specialShotType), cardX + 61, cardY + 163);
      context.textAlign = "left";
    }

    if (editable) {
      const confirmSelected = this.isTeamSelectSlotSelected(side, CUSTOM_TEAM_CONFIRM_SLOT);
      const buttonX = x + 548;
      const buttonY = y + 118;
      context.fillStyle = confirmSelected ? "rgba(255,244,168,0.98)" : "rgba(255,255,255,0.86)";
      context.strokeStyle = confirmSelected ? "#263241" : "rgba(38,50,65,0.45)";
      context.lineWidth = confirmSelected ? 6 : 3;
      this.roundRect(context, buttonX, buttonY, 94, 62, 8);
      context.fill();
      context.stroke();
      context.fillStyle = "#263241";
      context.font = "bold 22px Meiryo, sans-serif";
      context.textAlign = "center";
      context.fillText("決定", buttonX + 47, buttonY + 39);
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
    const selected = this.gameMode === "watch"
      ? this.watchSelectionSlot === 2
      : this.gameMode === "versus"
        ? this.teamSelectionSlots.left === START_SLOT || this.teamSelectionSlots.right === START_SLOT
        : this.teamSelectionSlot === START_SLOT;
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
    context.fillText(this.gameMode === "watch" ? "観戦開始" : "試合開始", centerX, 650);
    if (this.gameMode === "versus" && selected) {
      context.font = "bold 14px Meiryo, sans-serif";
      context.fillStyle = "#4b5360";
      const labels = [];
      if (this.teamSelectionSlots.left === START_SLOT) labels.push("1P");
      if (this.teamSelectionSlots.right === START_SLOT) labels.push("2P");
      context.fillText(labels.join(" / "), centerX, 612);
    }
    context.restore();
  }

  drawCharacterPreview(x, y, side, type, style = null, scale = 0.48) {
    const context = this.context;
    const body = CHARACTER_TYPES[type] || CHARACTER_TYPES.normal;
    const suit = style?.uniformColor || (side === "left" ? "#0057ff" : "#f01818");
    const pants = style?.pantsColor || suit;
    const hair = style?.hairColor || "#f2c14e";
    const sumoStyle = style?.uniformEmblem === "sumo" || style?.uniformEmblem === "sumoGold";
    const legColor = sumoStyle ? "#ffd1a3" : pants;
    context.save();
    context.translate(x, y);
    context.scale(body.scaleX * scale, body.scaleY * scale);
    context.strokeStyle = legColor;
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
    if (style?.uniformEmblem === "usaFlag") {
      context.strokeStyle = "#d92525";
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(-23, -49);
      context.lineTo(-31, -44);
      context.moveTo(23, -49);
      context.lineTo(31, -44);
      context.stroke();
    }
    context.fillStyle = sumoStyle ? "#ffd1a3" : suit;
    context.beginPath();
    context.ellipse(0, -42, 27 * body.torsoX, 38 * body.torsoY, 0, 0, Math.PI * 2);
    context.fill();
    if (sumoStyle) {
      const gold = style?.uniformEmblem === "sumoGold";
      const fundoshi = gold ? "#d9a719" : "#17191d";
      context.fillStyle = fundoshi;
      context.strokeStyle = gold ? "#8c6810" : "#08090b";
      context.lineWidth = 3;
      context.beginPath();
      context.ellipse(0, -17, 29 * body.torsoX, 9, 0, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.beginPath();
      context.moveTo(-11 * body.torsoX, -15);
      context.lineTo(11 * body.torsoX, -15);
      context.lineTo(8 * body.torsoX, 15);
      context.lineTo(-8 * body.torsoX, 15);
      context.closePath();
      context.fill();
      context.stroke();
    }
    if (style?.uniformEmblem === "usaStripes" || style?.uniformEmblem === "joeBib") {
      context.save();
      context.clip();
      context.fillStyle = "#111318";
      for (let stripeY = -76; stripeY <= -10; stripeY += 14) {
        context.fillRect(-32 * body.torsoX, stripeY, 64 * body.torsoX, 7);
      }
      context.restore();
    }
    if (style?.uniformEmblem === "usaFlag") {
      context.save();
      context.clip();
      const stripeHeight = 8;
      for (let stripeY = -44; stripeY <= -5; stripeY += stripeHeight) {
        context.fillStyle = Math.floor((stripeY + 44) / stripeHeight) % 2 === 0 ? "#f7f7f2" : "#d92525";
        context.fillRect(-32 * body.torsoX, stripeY, 64 * body.torsoX, stripeHeight);
      }
      context.restore();
      context.fillStyle = "#f7f7f2";
      context.font = "bold 20px Meiryo, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("★", -12 * body.torsoX, -62 * body.torsoY);
    }
    if (style?.uniformEmblem === "osakaStripes" || style?.uniformEmblem === "takoBib") {
      context.save();
      context.clip();
      context.fillStyle = "#111318";
      for (let stripeX = -28 * body.torsoX; stripeX <= 22 * body.torsoX; stripeX += 18 * body.torsoX) {
        context.fillRect(stripeX, -80 * body.torsoY, 8 * body.torsoX, 78 * body.torsoY);
      }
      context.restore();
    }
    if (style?.uniformEmblem === "joeBib") {
      context.fillStyle = "#f7f7f2";
      this.roundRect(context, -13 * body.torsoX, -58 * body.torsoY, 26 * body.torsoX, 27 * body.torsoY, 4);
      context.fill();
      context.fillStyle = "#d92828";
      context.font = "bold 22px sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("J", 0, -44);
    }
    if (style?.uniformEmblem === "takoBib") {
      context.fillStyle = "#f7f7f2";
      this.roundRect(context, -13 * body.torsoX, -58 * body.torsoY, 26 * body.torsoX, 27 * body.torsoY, 4);
      context.fill();
      context.fillStyle = "#d92828";
      context.font = "bold 22px sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("T", 0, -44);
    }
    if (style?.uniformEmblem === "hinomaru") {
      context.fillStyle = "#d92828";
      context.beginPath();
      context.arc(0, -45, 8, 0, Math.PI * 2);
      context.fill();
    }
    if (style?.captain) {
      context.fillStyle = "#f7f7f2";
      context.strokeStyle = "#263241";
      context.lineWidth = 2;
      this.roundRect(context, -15 * body.torsoX, -59 * body.torsoY, 30 * body.torsoX, 31 * body.torsoY, 4);
      context.fill();
      context.stroke();
      context.fillStyle = "#d92828";
      context.font = "bold 22px Meiryo, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("C", 0, -44);
    }
    if (body.mage) {
      context.fillStyle = suit;
      context.strokeStyle = "rgba(38,50,65,0.35)";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(-25, -22);
      context.lineTo(26, -22);
      context.lineTo(38, 25);
      context.lineTo(-36, 25);
      context.closePath();
      context.fill();
      context.stroke();
    }
    if (body.mage) {
      context.fillStyle = "#8a4a24";
      context.beginPath();
      context.ellipse(-12, -90, 11, 35, -0.12, 0, Math.PI * 2);
      context.ellipse(18, -90, 9, 34, 0.12, 0, Math.PI * 2);
      context.fill();
    }
    context.fillStyle = "#ffd1a3";
    context.beginPath();
    context.arc(0, -100, 29, 0, Math.PI * 2);
    if (body.headScale && body.headScale !== 1) {
      context.restore();
      context.save();
      context.translate(x, y);
      context.scale(body.scaleX * scale, body.scaleY * scale);
      context.fillStyle = "#ffd1a3";
      context.beginPath();
      context.arc(0, -100, 29 * body.headScale, 0, Math.PI * 2);
    }
    context.fill();
    context.fillStyle = hair;
    context.beginPath();
    context.arc(0, -109, 26, Math.PI, Math.PI * 2);
    context.lineTo(22, -104);
    context.quadraticCurveTo(0, -114, -24, -103);
    context.closePath();
    context.fill();
    if (sumoStyle) {
      context.fillStyle = hair;
      context.beginPath();
      context.arc(0, -109, 27, Math.PI, Math.PI * 2);
      context.lineTo(22, -104);
      context.quadraticCurveTo(0, -115, -24, -103);
      context.closePath();
      context.fill();
      context.strokeStyle = "rgba(0,0,0,0.35)";
      context.lineWidth = 2;
      context.beginPath();
      context.ellipse(0, -128, 13, 8, 0, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.beginPath();
      context.arc(0, -137, 8, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    } else if (body.mage) {
      context.fillStyle = "#8a4a24";
      context.beginPath();
      context.arc(0, -112, 25, Math.PI, Math.PI * 2);
      context.lineTo(21, -107);
      context.quadraticCurveTo(2, -120, -22, -107);
      context.closePath();
      context.fill();
    } else if (type === "normal") {
      context.fillStyle = "#f2c14e";
      context.beginPath();
      context.moveTo(-28, -104);
      context.lineTo(-23, -126);
      context.lineTo(-14, -111);
      context.lineTo(-6, -132);
      context.lineTo(2, -112);
      context.lineTo(12, -130);
      context.lineTo(18, -111);
      context.lineTo(28, -125);
      context.lineTo(25, -103);
      context.quadraticCurveTo(0, -114, -28, -104);
      context.closePath();
      context.fill();
    } else {
      context.fillStyle = "#f2c14e";
      context.beginPath();
      context.arc(0, -109, 27, Math.PI, Math.PI * 2);
      context.lineTo(22, -104);
      context.quadraticCurveTo(0, -115, -24, -103);
      context.closePath();
      context.fill();
    }
    if (body.mage) {
      context.fillStyle = suit;
      context.strokeStyle = "#263241";
      context.lineWidth = 4;
      context.save();
      context.translate(0, -94);
      context.scale(0.8, 0.8);
      context.beginPath();
      context.ellipse(0, -32, 38, 9, 0, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.beginPath();
      context.moveTo(-24, -34);
      context.lineTo(4, -90);
      context.lineTo(30, -34);
      context.closePath();
      context.fill();
      context.stroke();
      context.fillStyle = "#d9f6ff";
      context.beginPath();
      context.arc(8, -60, 5, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
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
    context.fillRect(c.x - 420, c.y - 310, width + 840, c.h + 620);
    this.drawBench(c.centerX - 650, -56, "#3087f2");
    this.drawBench(c.centerX + 430, -56, "#f05a45");
  }

  drawBench(x, y, color) {
    const context = this.context;
    context.save();
    context.fillStyle = "rgba(60, 55, 34, 0.18)";
    context.beginPath();
    context.ellipse(x + 132, y + 86, 145, 15, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#f7f0d2";
    this.roundRect(context, x, y + 18, 264, 58, 6);
    context.fill();
    context.strokeStyle = "#473f31";
    context.lineWidth = 3;
    context.stroke();

    context.fillStyle = color;
    for (let i = 0; i < 6; i += 1) {
      context.fillRect(x + 14 + i * 42, y + 18, 20, 58);
    }

    context.fillStyle = "#3e4b3f";
    context.fillRect(x - 8, y + 76, 280, 8);
    context.fillStyle = "#6b5a37";
    for (let i = 0; i < 4; i += 1) {
      context.fillRect(x + 16 + i * 72, y + 84, 10, 28);
    }

    context.fillStyle = "#d8d0a8";
    this.roundRect(context, x - 6, y, 276, 22, 5);
    context.fill();
    context.strokeStyle = "#473f31";
    context.lineWidth = 3;
    context.stroke();
    context.restore();
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

  drawSpiritGauges() {
    if (!this.spiritPoints) return;
    const context = this.context;
    const max = GAME_CONFIG.battle.spiritMax;
    const drawGauge = (team, x, y, color, label) => {
      const value = Math.max(0, Math.min(max, this.spiritPoints[team] || 0));
      const ratio = value / max;
      const full = value >= max;
      context.save();
      context.fillStyle = "rgba(21, 29, 38, 0.72)";
      this.roundRect(context, x, y, 270, 42, 8);
      context.fill();
      context.strokeStyle = full ? "#fff36a" : "rgba(255,255,255,0.42)";
      context.lineWidth = full ? 4 : 2;
      context.stroke();
      context.fillStyle = "rgba(255,255,255,0.18)";
      this.roundRect(context, x + 78, y + 12, 150, 16, 6);
      context.fill();
      context.fillStyle = full ? "#fff36a" : color;
      this.roundRect(context, x + 78, y + 12, 150 * ratio, 16, 6);
      context.fill();
      context.fillStyle = "#fff7df";
      context.font = "bold 15px Meiryo, sans-serif";
      context.textAlign = "left";
      context.fillText(label, x + 12, y + 27);
      context.textAlign = "right";
      context.fillText(`${Math.floor(value)}/${max}`, x + 258, y + 27);
      context.restore();
    };
    drawGauge("left", 18, 18, "#3087f2", "1P 気合");
    drawGauge("right", GAME_CONFIG.width - 288, 18, "#f05a45", this.gameMode === "single" ? "CPU 気合" : "2P 気合");
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

  drawShotMultiplierDebug() {
    if (!this.shotMultiplierDisplay) return;
    const context = this.context;
    const display = this.shotMultiplierDisplay;
    const alpha = Math.max(0, Math.min(1, display.life / 0.35, 1));
    const specialLabel = this.getSpecialShotLabel(display.specialType);
    const text = `SHOT x${display.multiplier.toFixed(2)}`;
    const teamText = display.team === "left" ? "1P" : "2P";
    const height = specialLabel ? 72 : 50;

    context.save();
    context.globalAlpha = alpha;
    context.font = "bold 18px Meiryo, sans-serif";
    context.textAlign = "left";
    const width = Math.max(134, context.measureText(specialLabel || text).width + 34);
    const x = 14;
    const y = 14;
    context.fillStyle = "rgba(20, 26, 36, 0.72)";
    this.roundRect(context, x, y, width, height, 7);
    context.fill();
    context.fillStyle = display.team === "left" ? "#9fd0ff" : "#ffb0a6";
    context.font = "bold 13px Meiryo, sans-serif";
    context.fillText(teamText, x + 14, y + 19);
    context.fillStyle = "#fff7df";
    context.font = "bold 20px Meiryo, sans-serif";
    context.fillText(text, x + 14, y + 41);
    if (specialLabel) {
      context.fillStyle = "#8ffcff";
      context.font = "bold 15px Meiryo, sans-serif";
      context.fillText(specialLabel, x + 14, y + 62);
    }
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
        context.font = "bold 48px Meiryo, sans-serif";
        context.lineWidth = 8;
        context.strokeStyle = "rgba(38, 50, 65, 0.86)";
        context.fillStyle = effect.color;
        context.strokeText(effect.text, effect.x, effect.y - progress * 58);
        context.fillText(effect.text, effect.x, effect.y - progress * 58);
        context.restore();
        continue;
      }
      if (effect.type === "catchResult") {
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.textAlign = "center";
        context.font = "bold 30px Meiryo, sans-serif";
        context.lineWidth = 6;
        context.strokeStyle = "rgba(30, 38, 48, 0.9)";
        context.fillStyle = effect.color;
        context.strokeText(effect.text, effect.x, effect.y - progress * 34);
        context.fillText(effect.text, effect.x, effect.y - progress * 34);
        context.restore();
        continue;
      }
      if (effect.type === "counterCatch") {
        const radius = 30 + progress * 96;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.strokeStyle = progress < 0.35 ? "#ffffff" : "#79e7ff";
        context.lineWidth = 12 - progress * 6;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#fff36a";
        context.lineWidth = 6;
        for (let index = 0; index < 16; index += 1) {
          const angle = Math.PI * 2 * index / 16;
          const inner = radius * 0.58;
          const outer = radius * (index % 2 === 0 ? 1.38 : 1.16);
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          context.stroke();
        }
        context.restore();
        continue;
      }
      if (effect.type === "kiaiImpact") {
        const radius = 34 + progress * 138;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.fillStyle = "rgba(255, 224, 92, 0.22)";
        context.strokeStyle = progress < 0.38 ? "#ffffff" : "#ffd83d";
        context.lineWidth = 15 - progress * 8;
        context.shadowColor = "#ff8a32";
        context.shadowBlur = 24;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        context.shadowBlur = 0;
        context.strokeStyle = "#fff6b5";
        context.lineWidth = 7;
        for (let index = 0; index < 20; index += 1) {
          const angle = index * Math.PI * 0.1;
          const inner = radius * 0.34;
          const outer = radius * (index % 2 === 0 ? 1.22 : 0.94);
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          context.stroke();
        }

        context.globalCompositeOperation = "source-over";
        context.fillStyle = "rgba(180, 119, 52, 0.48)";
        for (let index = 0; index < 12; index += 1) {
          const angle = Math.PI * 2 * index / 12;
          const distance = 34 + progress * (70 + index % 3 * 18);
          context.beginPath();
          context.ellipse(
            Math.cos(angle) * distance,
            44 + Math.sin(angle) * distance * 0.32,
            13 + progress * 10,
            7 + progress * 6,
            angle,
            0,
            Math.PI * 2
          );
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "slapImpact") {
        const radius = 42 + progress * 145;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.strokeStyle = "#ff4a22";
        context.fillStyle = "rgba(255, 211, 154, 0.2)";
        context.lineWidth = 14 - progress * 6;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.strokeStyle = "#fff2a8";
        context.lineWidth = 7;
        for (let index = 0; index < 18; index += 1) {
          const angle = Math.PI * 2 * index / 18;
          const inner = radius * 0.42;
          const outer = radius * (index % 2 === 0 ? 1.18 : 0.88);
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          context.stroke();
        }
        context.fillStyle = "#ffefb0";
        context.strokeStyle = "#9d2d1f";
        context.lineWidth = 8;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "bold 82px Meiryo, sans-serif";
        context.strokeText("張", 0, -8);
        context.fillText("張", 0, -8);
        context.restore();
        continue;
      }
      const radius = effect.type === "boostBurst"
        ? 34 + progress * 126
        : effect.type === "special"
        ? 30 + progress * 86
        : effect.type === "hit" ? 22 + progress * 58 : 24 + progress * 24;
      context.save();
      context.globalAlpha = 1 - progress;
      context.strokeStyle = effect.color;
      context.lineWidth = effect.type === "boostBurst" ? 12 : effect.type === "special" ? 9 : effect.type === "hit" || effect.type === "catchStrong" ? 7 : 4;
      context.beginPath();
      context.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
      context.stroke();
      if (effect.type === "hit" || effect.type === "catchStrong" || effect.type === "special" || effect.type === "boostBurst") {
        const count = effect.type === "boostBurst" ? 20 : effect.type === "catchStrong" ? 12 : effect.type === "special" ? 14 : 8;
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

  drawTripleBalls(context) {
    if (!this.tripleBalls || this.tripleBalls.length === 0) return;
    for (const shot of this.tripleBalls) {
      const drawY = shot.y - shot.z;
      context.save();
      context.globalAlpha = 0.68;
      context.fillStyle = "rgba(40, 28, 16, 0.18)";
      context.beginPath();
      context.ellipse(shot.x + 3, shot.y + 10, shot.radius, shot.radius * 0.36, 0, 0, Math.PI * 2);
      context.fill();
      context.translate(shot.x, drawY);
      context.rotate(shot.spin);
      context.fillStyle = "#f06a32";
      context.beginPath();
      context.arc(0, 0, shot.radius, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#ffcc8a";
      context.lineWidth = 4;
      context.beginPath();
      context.arc(0, 0, shot.radius * 0.9, -1.1, 1.1);
      context.arc(0, 0, shot.radius * 0.9, Math.PI - 1.1, Math.PI + 1.1);
      context.moveTo(-shot.radius, 0);
      context.lineTo(shot.radius, 0);
      context.stroke();
      context.restore();
    }
  }

  drawChargeEffect() {
    if (!this.chargingThrow || this.chargingThrow.kind !== "shoot") return;
    const charged = this.chargingThrow;
    const actor = charged.actor;
    if (!actor || actor.defeated) return;

    const context = this.context;
    const ratio = Math.min(1, charged.chargeTime / MAX_SHOT_CHARGE_TIME);
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

  drawSpecialAnticipationEffect() {
    if (!this.pendingThrow || !this.pendingThrow.anticipation || !this.pendingThrow.specialType) return;
    const pending = this.pendingThrow;
    if (pending.timer > SPECIAL_SHOT_ANTICIPATION_TIME) return;
    const actor = pending.actor;
    if (!actor || actor.defeated || this.ball.owner !== actor) return;

    const context = this.context;
    const pulse = 0.5 + Math.sin(performance.now() / 42) * 0.5;
    const progress = Math.max(0, Math.min(1, 1 - pending.timer / SPECIAL_SHOT_ANTICIPATION_TIME));
    const x = actor.x;
    const y = actor.y - actor.jumpZ - 66;
    const burstRadius = 82 + progress * 78 + pulse * 18;

    context.save();
    context.globalCompositeOperation = "lighter";
    const glow = context.createRadialGradient(x, y + 10, 10, x, y + 10, burstRadius * 1.15);
    glow.addColorStop(0, "rgba(255, 245, 220, 0.9)");
    glow.addColorStop(0.22, "rgba(255, 94, 82, 0.72)");
    glow.addColorStop(0.58, "rgba(255, 42, 42, 0.3)");
    glow.addColorStop(1, "rgba(255, 30, 30, 0)");
    context.globalAlpha = 0.76;
    context.fillStyle = glow;
    context.beginPath();
    context.arc(x, y + 10, burstRadius * 1.15, 0, Math.PI * 2);
    context.fill();

    context.globalAlpha = 0.34 + pulse * 0.28;
    context.fillStyle = "#ff6f6f";
    context.shadowColor = "#ff3d3d";
    context.shadowBlur = 28 + progress * 22;
    context.beginPath();
    context.ellipse(x, y + 14, 53 + pulse * 7, 86 + pulse * 8, 0, 0, Math.PI * 2);
    context.fill();

    context.shadowBlur = 0;
    context.strokeStyle = "#ff8f83";
    for (let index = 0; index < 3; index += 1) {
      const ringRadius = burstRadius * (0.58 + index * 0.2);
      context.globalAlpha = Math.max(0.18, 0.86 - index * 0.22);
      context.lineWidth = 9 - index * 2;
      context.beginPath();
      context.ellipse(x, y + 8, ringRadius, ringRadius * 0.72, 0, 0, Math.PI * 2);
      context.stroke();
    }

    context.strokeStyle = "#fff0d8";
    context.lineCap = "round";
    context.globalAlpha = 0.88;
    context.lineWidth = 5;
    for (let index = 0; index < 16; index += 1) {
      const angle = performance.now() / 90 + index * Math.PI / 8;
      const innerRadius = 52 + (index % 2) * 12;
      const outerRadius = burstRadius * (0.9 + (index % 3) * 0.12);
      context.beginPath();
      context.moveTo(x + Math.cos(angle) * innerRadius, y + 8 + Math.sin(angle) * innerRadius * 0.72);
      context.lineTo(x + Math.cos(angle) * outerRadius, y + 8 + Math.sin(angle) * outerRadius * 0.72);
      context.stroke();
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

  drawPauseMenu() {
    const context = this.context;
    const centerX = GAME_CONFIG.width * 0.5;
    const items = ["再開", "タイトルへ戻る"];
    context.save();
    context.fillStyle = "rgba(20, 26, 36, 0.54)";
    context.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
    context.textAlign = "center";
    context.fillStyle = "#fff7d7";
    context.strokeStyle = "#27324a";
    context.lineWidth = 8;
    context.font = "bold 64px Meiryo, sans-serif";
    context.strokeText("PAUSE", centerX, 250);
    context.fillText("PAUSE", centerX, 250);

    for (let i = 0; i < items.length; i += 1) {
      const y = 330 + i * 72;
      const selected = i === this.pauseMenuIndex;
      context.fillStyle = selected ? "rgba(255,244,168,0.98)" : "rgba(255,255,255,0.86)";
      context.strokeStyle = selected ? "#263241" : "rgba(38,50,65,0.5)";
      context.lineWidth = selected ? 6 : 3;
      this.roundRect(context, centerX - 180, y - 34, 360, 54, 8);
      context.fill();
      context.stroke();
      context.fillStyle = "#263241";
      context.font = "bold 26px Meiryo, sans-serif";
      context.fillText(items[i], centerX, y + 2);
    }

    context.fillStyle = "#ffffff";
    context.font = "18px Meiryo, sans-serif";
    context.fillText("上下で選択 / ボタン2で決定 / ボタン9で再開", centerX, 505);
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
