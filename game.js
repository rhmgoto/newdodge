const DEBUG_MODE = false;
const SHOW_HITBOXES = false;
const LAST_UPDATED_AT = "2026/08/01 19:44";
const TEAM_SELECTION_COUNT = 8;
const TEAM_SELECT_COLUMNS = 5;
const CPU_OPPONENT_SLOT = TEAM_SELECTION_COUNT;
const START_SLOT = TEAM_SELECTION_COUNT + 1;
const CUSTOM_TEAM_CONFIRM_SLOT = TEAM_SELECTION_COUNT + 2;
const BRAVES_JOB_ORDER = ["hero", "warrior", "paladin", "cleric", "mage", "martialArtist", "bard", "archer"];
const BRAVES_INNER_JOB_ORDER = BRAVES_JOB_ORDER.filter((jobId) => jobId !== "archer");
const BRAVES_DEFAULT_SELECTION = ["hero", "warrior", "paladin", "cleric", "mage", "archer", "archer", "archer"];
const BRAVES_JOB_NAMES = {
  hero: { job: "勇者", name: "アレス" },
  warrior: { job: "戦士", name: "ガロン" },
  paladin: { job: "聖騎士", name: "レオンハルト" },
  cleric: { job: "僧侶", name: "ソフィア" },
  mage: { job: "魔法使い", name: "ルナ" },
  martialArtist: { job: "武闘家", name: "リュウ" },
  bard: { job: "吟遊詩人", name: "ノエル" },
  archer: { job: "弓使い", name: "ロイ" }
};
const BRAVES_OUTFIELD_ARCHER_NAMES = ["ロイ", "レイ", "ルイ"];
const GRAND_HEAL_CONFIG = {
  duration: 2.6,
  tickInterval: 0.26,
  healRatioPerTick: 0.015,
  startProgress: 0.25,
  cooldown: 60
};
const DISSONANCE_FEINT_CONFIG = {
  damageScale: 0.9,
  catchWindowScale: 0.9,
  catchAreaScale: 0.92
};
const NO_DEFENSE_HITBOX_CONFIG = {
  normalScale: 1.2,
  specialScale: 1.3,
  closeSpecialScale: 1.2,
  closeSpecialDistance: 180
};
const CATCH_DURATION_SCALE_CONFIG = {
  base: 0.9,
  shot: 0.9,
  special: 0.95
};
const NORMAL_SHOT_DISTANCE_CATCH_CONFIG = {
  startDistance: 350,
  maxDistance: 950,
  maxScale: 1.4
};
const LATE_MATCH_PRESSURE_CONFIG = {
  firstDamageTime: 90,
  secondDamageTime: 120,
  firstDamageScale: 1.1,
  secondDamageScale: 1.2,
  noDamageSeconds: 10,
  noDamageHitboxScale: 1.15
};
const BRAVES_JOB_DEFINITIONS = {
  hero: {
    label: "勇者",
    characterType: "normal",
    maxHp: 350,
    maxStamina: 130,
    stats: { power: 15, speed: 13, jump: 13, technique: 13, defense: 12, pass: 11 },
    specialShotType: "braveSlash",
    uniformColor: "#2f73e8",
    pantsColor: "#243a68",
    trimColor: "#d83232",
    hairColor: "#b86f36",
    faceColor: "#ffd9b0",
    eyeColor: "#2c6ee8"
  },
  warrior: {
    label: "戦士",
    characterType: "power",
    maxHp: 280,
    maxStamina: 115,
    stats: { power: 18, speed: 7, jump: 7, technique: 8, defense: 10, pass: 8 },
    specialShotType: "gigaBreak",
    uniformColor: "#8f3b25",
    pantsColor: "#3a2a22",
    trimColor: "#5b6874",
    hairColor: "#5b2c18",
    faceColor: "#f0b887",
    eyeColor: "#263241"
  },
  swordwoman: {
    label: "女剣士",
    characterType: "speed",
    maxHp: 150,
    maxStamina: 135,
    stats: { power: 8, speed: 13, jump: 12, technique: 12, defense: 5, pass: 8 },
    specialShotType: "holyLance",
    uniformColor: "#e7edf8",
    pantsColor: "#24325b",
    trimColor: "#a63f7a",
    hairColor: "#17191d",
    faceColor: "#ffd1ad",
    eyeColor: "#485d7c"
  },
  knight: {
    label: "騎士",
    characterType: "power",
    maxHp: 220,
    maxStamina: 120,
    stats: { power: 10, speed: 6, jump: 6, technique: 9, defense: 10, pass: 6 },
    specialShotType: "fireball",
    uniformColor: "#c9d2da",
    pantsColor: "#8b99a6",
    trimColor: "#2f73d9",
    hairColor: "#d8a24a",
    faceColor: "#ffd1ad",
    eyeColor: "#2f73d9"
  },
  paladin: {
    label: "聖騎士",
    characterType: "normal",
    maxHp: 300,
    maxStamina: 140,
    stats: { power: 10, speed: 9, jump: 9, technique: 12, defense: 15, pass: 7 },
    specialShotType: "shiningArrow",
    uniformColor: "#f8fbff",
    pantsColor: "#dbefff",
    trimColor: "#d7a331",
    hairColor: "#f1d66c",
    faceColor: "#ffd8b0",
    eyeColor: "#4aa8ff"
  },
  mage: {
    label: "魔法使い",
    characterType: "mage",
    maxHp: 200,
    maxStamina: 150,
    stats: { power: 13, speed: 8, jump: 8, technique: 9, defense: 7, pass: 8 },
    specialShotType: "lunaticMirage",
    uniformColor: "#4b1f78",
    pantsColor: "#321052",
    trimColor: "#d8b6ff",
    hairColor: "#f0c14b",
    faceColor: "#ffd1ad",
    eyeColor: "#2f73d9"
  },
  cleric: {
    label: "僧侶",
    characterType: "normal",
    maxHp: 210,
    maxStamina: 150,
    stats: { power: 8, speed: 9, jump: 8, technique: 9, defense: 8, pass: 9 },
    specialShotType: "grandHeal",
    uniformColor: "#fbfbf1",
    pantsColor: "#dff1e2",
    trimColor: "#74bc85",
    hairColor: "#7a4a2a",
    faceColor: "#ffd7b7",
    eyeColor: "#5aa36a"
  },
  archer: {
    label: "弓使い",
    characterType: "speed",
    maxHp: 145,
    maxStamina: 135,
    stats: { power: 10, speed: 12, jump: 12, technique: 11, defense: 6, pass: 14 },
    specialShotType: "none",
    uniformColor: "#4f8f45",
    pantsColor: "#7a5334",
    trimColor: "#d8c08d",
    hairColor: "#b87436",
    faceColor: "#ffd0a3",
    eyeColor: "#466238"
  },
  martialArtist: {
    label: "武闘家",
    characterType: "jump",
    maxHp: 230,
    maxStamina: 135,
    stats: { power: 14, speed: 18, jump: 18, technique: 13, defense: 9, pass: 12 },
    specialShotType: "hundredRush",
    uniformColor: "#f7f3e7",
    pantsColor: "#f7f3e7",
    trimColor: "#17191d",
    hairColor: "#17191d",
    faceColor: "#f5c090",
    eyeColor: "#263241"
  },
  bard: {
    label: "吟遊詩人",
    characterType: "speed",
    maxHp: 210,
    maxStamina: 145,
    stats: { power: 7, speed: 9, jump: 8, technique: 8, defense: 7, pass: 9 },
    specialShotType: "victoryMarch",
    uniformColor: "#7d2240",
    pantsColor: "#253b2d",
    trimColor: "#e9d9a5",
    hairColor: "#d99a36",
    faceColor: "#ffd0a4",
    eyeColor: "#365c46"
  }
};
const STATUS_DEFENSE_PASS_OVERRIDES = new Map([
  ["あお", { defense: 6, pass: 6 }],
  ["ぐんじょう", { defense: 6, pass: 6 }],
  ["こおり", { defense: 6, pass: 6 }],
  ["うみ", { defense: 6, pass: 6 }],
  ["そら", { defense: 6, pass: 6 }],
  ["ブルー", { defense: 6, pass: 6 }],
  ["アクア", { defense: 6, pass: 6 }],
  ["オーシャン", { defense: 6, pass: 6 }],
  ["あか", { defense: 6, pass: 6 }],
  ["しんく", { defense: 6, pass: 6 }],
  ["もみじ", { defense: 6, pass: 6 }],
  ["れっか", { defense: 6, pass: 6 }],
  ["ほむら", { defense: 6, pass: 6 }],
  ["ぐれん", { defense: 6, pass: 6 }],
  ["べに", { defense: 6, pass: 6 }],
  ["かえん", { defense: 6, pass: 6 }],
  ["たけし", { defense: 5, pass: 5 }],
  ["こうた", { defense: 5, pass: 5 }],
  ["まさる", { defense: 5, pass: 5 }],
  ["ゆうき", { defense: 5, pass: 5 }],
  ["しんぺい", { defense: 5, pass: 5 }],
  ["ひろし", { defense: 5, pass: 5 }],
  ["けんじ", { defense: 5, pass: 5 }],
  ["たかし", { defense: 5, pass: 5 }],
  ["たける", { defense: 6, pass: 6 }],
  ["りょうた", { defense: 6, pass: 6 }],
  ["しょうた", { defense: 8, pass: 8 }],
  ["ゆうま", { defense: 6, pass: 6 }],
  ["はるき", { defense: 6, pass: 6 }],
  ["だいき", { defense: 6, pass: 6 }],
  ["けいた", { defense: 6, pass: 6 }],
  ["しゅん", { defense: 6, pass: 6 }],
  ["よこづな", { defense: 10, pass: 6 }],
  ["らいのふじ", { defense: 8, pass: 6 }],
  ["はりておう", { defense: 8, pass: 6 }],
  ["がんさい", { defense: 8, pass: 6 }],
  ["ごうのやま", { defense: 8, pass: 6 }],
  ["だいふんか", { defense: 8, pass: 6 }],
  ["かいりきやま", { defense: 8, pass: 6 }],
  ["ちゃんこまる", { defense: 8, pass: 6 }],
  ["シュナイダー", { defense: 10, pass: 8 }],
  ["ミュラー", { defense: 8, pass: 6 }],
  ["クライン", { defense: 8, pass: 6 }],
  ["ベッカー", { defense: 8, pass: 6 }],
  ["ホフマン", { defense: 8, pass: 6 }],
  ["リヒター", { defense: 8, pass: 6 }],
  ["ケラー", { defense: 8, pass: 6 }],
  ["フィッシャー", { defense: 8, pass: 6 }],
  ["れつ", { defense: 8, pass: 8 }],
  ["むさし", { defense: 8, pass: 8 }],
  ["しょう", { defense: 8, pass: 8 }],
  ["じん", { defense: 8, pass: 8 }],
  ["だいち", { defense: 10, pass: 10 }],
  ["はやと", { defense: 8, pass: 8 }],
  ["えんじ", { defense: 8, pass: 8 }],
  ["ひかる", { defense: 8, pass: 8 }],
  ["たこへい", { defense: 9, pass: 11 }],
  ["おこのみ", { defense: 7, pass: 9 }],
  ["くしかつ", { defense: 7, pass: 9 }],
  ["くいだおれ", { defense: 7, pass: 9 }],
  ["おおきに", { defense: 7, pass: 9 }],
  ["なんでや", { defense: 7, pass: 9 }],
  ["まいど", { defense: 7, pass: 9 }],
  ["どうとん", { defense: 7, pass: 9 }],
  ["トム", { defense: 9, pass: 9 }],
  ["ブライアン", { defense: 9, pass: 9 }],
  ["ジョー", { defense: 13, pass: 13 }],
  ["ニック", { defense: 9, pass: 9 }],
  ["マックス", { defense: 9, pass: 9 }],
  ["スティーブ", { defense: 9, pass: 9 }],
  ["レックス", { defense: 9, pass: 9 }],
  ["ブロック", { defense: 9, pass: 9 }],
  ["ゼロ", { defense: 11, pass: 8 }],
  ["ボルト", { defense: 9, pass: 7 }],
  ["ギア", { defense: 9, pass: 7 }],
  ["ピストン", { defense: 9, pass: 7 }],
  ["センサー", { defense: 9, pass: 7 }],
  ["レーダー", { defense: 9, pass: 7 }],
  ["コイル", { defense: 9, pass: 7 }],
  ["ビット", { defense: 9, pass: 7 }],
  ["大魔王アークマ", { defense: 12, pass: 10 }],
  ["溶岩ゴーレム", { defense: 12, pass: 6 }],
  ["吸血鬼ヴァルド", { defense: 10, pass: 7 }],
  ["シールドデビル", { defense: 13, pass: 16 }],
  ["魔女メルティ", { defense: 6, pass: 8 }],
  ["ピコ|devilClaw", { defense: 6, pass: 16 }],
  ["ペコ", { defense: 6, pass: 16 }],
  ["ポコ", { defense: 6, pass: 16 }],
  ["オクト", { defense: 9, pass: 8 }],
  ["ピコ|ufoSpin", { defense: 7, pass: 7 }],
  ["グニャ", { defense: 7, pass: 7 }],
  ["フワン", { defense: 7, pass: 7 }],
  ["キュル", { defense: 7, pass: 7 }],
  ["ポル", { defense: 7, pass: 7 }],
  ["ニュル", { defense: 7, pass: 7 }],
  ["モニョ", { defense: 7, pass: 7 }],
  ["勇者", { defense: 11, pass: 11 }],
  ["戦士", { defense: 9, pass: 8 }],
  ["魔法使い", { defense: 7, pass: 8 }],
  ["聖騎士", { defense: 13, pass: 7 }],
  ["僧侶", { defense: 8, pass: 9 }],
  ["弓使い", { defense: 6, pass: 14 }],
  ["武闘家", { defense: 8, pass: 9 }],
  ["吟遊詩人", { defense: 7, pass: 11 }],
]);

function getStatusDefensePassOverride(name, specialShotType) {
  return STATUS_DEFENSE_PASS_OVERRIDES.get(`${name}|${specialShotType}`) ||
    STATUS_DEFENSE_PASS_OVERRIDES.get(name) ||
    null;
}

const MAX_SHOT_CHARGE_TIME = 1.5;
const SPECIAL_SHOT_ANTICIPATION_TIME = 0.15;
const SPECIAL_SHOT_ANTICIPATION_TIMES = {
  slap: 0.5
};
const SHOT_WINDUP_TIME = 0.38 * 1.3;
const SHOT_DAMAGE_SCALE = 1.69;
const VICTORY_MARCH_DURATION = 15;
const QUICK_SHOT_CONFIG = {
  windowDuration: 0.55,
  windupTime: SHOT_WINDUP_TIME * 0.5,
  speedScale: 1.2,
  damageScale: 1.1
};
const MARTIAL_ARTIST_QIGONG_SHOT_CONFIG = {
  closeDistance: 150,
  midDistance: 250,
  closeDamageScale: 1.25,
  midDamageScale: 1.15
};
const HUNDRED_RUSH_CONFIG = {
  closeDistance: 260,
  baseDamageScale: 2.28,
  closeDamageScale: 1.12,
  catchWindowScale: 0.82,
  catchAreaScale: 0.72
};
const CATCH_DIFFICULTY = {
  normal: { duration: 0.2, areaScale: 1 },
  heroStraight: { duration: 0.165, areaScale: 0.94 },
  melodyShot: {
    duration: 0.18 * DISSONANCE_FEINT_CONFIG.catchWindowScale,
    areaScale: DISSONANCE_FEINT_CONFIG.catchAreaScale
  },
  kiai: { duration: 0.11, areaScale: 0.9 },
  braveSlash: { duration: 0.09, areaScale: 0.82 },
  gigaBreak: { duration: 0.075, areaScale: 0.72 },
  fireball: { duration: 0.095, areaScale: 0.84 },
  holyLance: { duration: 0.07, areaScale: 0.72 },
  shiningArrow: { duration: 0.065, areaScale: 0.68 },
  hundredRush: { duration: 0.085 * HUNDRED_RUSH_CONFIG.catchWindowScale, areaScale: HUNDRED_RUSH_CONFIG.catchAreaScale },
  lunaticMirage: { duration: 0.07, areaScale: 0.68 },
  victoryMarch: { duration: 0.12, areaScale: 1 },
  soul: { duration: 0.11, areaScale: 0.88 },
  triple: { duration: 0.09, areaScale: 0.82 },
  lightning: { duration: 0.08, areaScale: 0.78 },
  boomerang: { duration: 0.08, areaScale: 0.78 },
  devilShield: { duration: 0.075, areaScale: 0.76 },
  boost: { duration: 0.07, areaScale: 0.72 },
  iron: { duration: 0.06, areaScale: 0.68 },
  slap: { duration: 0.06, areaScale: 0.72 },
  tsutenkaku: { duration: 0.07, areaScale: 0.75 },
  clockStop: { duration: 0.07, areaScale: 0.73 },
  lockRocket: { duration: 0.07, areaScale: 0.72 },
  ufoSpin: { duration: 0.08, areaScale: 0.76 },
  hellfire: { duration: 0.0455, areaScale: 0.504, cpuCatchAttemptScale: 0.7 },
  meteorCrash: { duration: 0.035, areaScale: 0.48, cpuCatchAttemptScale: 0.45 },
  bloodDrain: { duration: 0.08, areaScale: 0.8 },
  arcanaSphere: { duration: 0.075, areaScale: 0.74, chargeCatchWindowPenalty: 0.25 },
  devilClaw: { duration: 0.07, areaScale: 0.72 }
};
const HELLFIRE_CONFIG = {
  speedScale: 1.38,
  damageScale: 2.05,
  burnDamage: 5,
  burnTicks: 3,
  burnInterval: 0.45,
  catchDamage: 7,
  flameDuration: 3.2,
  flameRadius: 118,
  flameSlowScale: 0.58,
  flameSlowDuration: 0.34,
  flameTouchDamage: 2.5,
  flameTickInterval: 0.5
};
const METEOR_CRASH_CONFIG = {
  radius: 265,
  markerRadiusYScale: 0.45,
  innerRadius: 107,
  damageScale: 2.9,
  outerDamageScale: 0.45,
  knockbackScale: 2.35,
  lavaDuration: 2.8,
  lavaRadius: 245,
  lavaTickInterval: 0.42,
  lavaTouchDamage: 5,
  lavaSlowScale: 0.68,
  lavaSlowDuration: 0.55
};
const MOON_BARRIER_CONFIG = {
  chance: 0.3,
  staminaCost: 25,
  cooldown: 3,
  timer: 0.58,
  knockbackScale: 0.34
};
const BLESSING_SHOT_CONFIG = {
  healRatio: 0.25,
  minHeal: 4
};
const GUARDIAN_SHIELD_CONFIG = {
  range: 220,
  normalChance: 0.4,
  specialChance: 0.25,
  counterChance: 0.3,
  normalStaminaCost: 18,
  specialStaminaCost: 28,
  guardTimer: 0.74
};
const BARD_RHYTHM_STEP_CONFIG = {
  range: 245,
  duration: 4.2,
  cooldownMin: 7,
  cooldownMax: 11,
  minNearbyAllies: 1
};
const AUDIO_CONFIG = {
  bgmVolume: 0.38,
  sfxVolume: 0.72,
  damageCooldown: 0.12,
  catchCooldown: 0.08,
  paths: {
    koutei: "music/koutei.mp3",
    daimao: "music/daimao.mp3",
    pass: "music/pass.mp3",
    shoot: "music/shoot.mp3",
    special: "music/special.mp3",
    counter: "music/counter.mp3",
    catch: "music/catch.mp3",
    damage: "music/damage.mp3"
  }
};
const BLOOD_DRAIN_CONFIG = {
  damageScale: 1.015,
  selfHealRatio: 0.45,
  arkmaHealRatio: 0.3,
  normalDrainRatio: 0.5,
  normalCatchDrainRatio: 1 / 3,
  catchHeal: 8,
  lightWeaknessScale: 1.35
};
const ARCANA_SPHERE_DAMAGE_CONFIG = {
  minDamageScale: 0.8,
  maxDamageScale: 1.8,
  maxChargeDistance: 600,
  maxKnockbackScale: 1.4
};
const COUNTER_CONFIG = {
  lockDuration: 0.2,
  windowDuration: 0.55,
  catchDuration: 0.12,
  catchDurationPenaltyPerChain: 0.01,
  minCatchDuration: 0.04,
  damageScale: 1.5,
  speedScale: 2.145,
  knockbackScale: 1.4,
  staminaCost: 22,
  releaseDelay: 0.16
};
const SPECIAL_SHOT_DAMAGE_RULES = {
  kiai: 1.7,
  braveSlash: 1.95,
  gigaBreak: 2.55,
  fireball: 2.15,
  holyLance: 2.25,
  shiningArrow: (travelDistance = 0) => 1.9 + Math.min(0.45, Math.max(0, travelDistance) / 1800 * 0.45),
  hundredRush: (travelDistance = 0) => {
    const distance = Math.max(0, travelDistance);
    const closeRate = distance < HUNDRED_RUSH_CONFIG.closeDistance
      ? 1 - distance / HUNDRED_RUSH_CONFIG.closeDistance
      : 0;
    return HUNDRED_RUSH_CONFIG.baseDamageScale *
      (1 + (HUNDRED_RUSH_CONFIG.closeDamageScale - 1) * closeRate);
  },
  lunaticMirage: (travelDistance = 0) => (1.92 + Math.min(0.32, Math.max(0, travelDistance) / 1500 * 0.32)) * 1.15,
  lightning: 2,
  triple: 2,
  boomerang: 2.2,
  devilShield: 1.9,
  devilClaw: 1.85,
  boost: (travelDistance = 0) => 1.7 + Math.min(0.8, travelDistance / 1900 * 0.8),
  iron: 3,
  tsutenkaku: 2.4,
  soul: 1.2,
  slap: (travelDistance = 0) => 2.8 - Math.min(1.75, Math.max(0, travelDistance) / 897),
  clockStop: 2.2,
  lockRocket: 2.415,
  ufoSpin: 1.8,
  hellfire: () => HELLFIRE_CONFIG.damageScale,
  meteorCrash: () => METEOR_CRASH_CONFIG.damageScale,
  bloodDrain: () => BLOOD_DRAIN_CONFIG.damageScale,
  arcanaSphere: (travelDistance = 0) => {
    const charge = Math.max(0, Math.min(1, travelDistance / ARCANA_SPHERE_DAMAGE_CONFIG.maxChargeDistance));
    return ARCANA_SPHERE_DAMAGE_CONFIG.minDamageScale +
      (ARCANA_SPHERE_DAMAGE_CONFIG.maxDamageScale - ARCANA_SPHERE_DAMAGE_CONFIG.minDamageScale) * charge;
  }
};
const SPIRIT_GAIN_CONFIG = {
  spiritPassGain: 0.3,
  spiritNormalShotFireGain: 1.05,
  spiritStrongShotFireGain: 1.35,
  spiritJumpShotFireGain: 1.35,
  spiritSpecialShotFireGain: 1.5,
  spiritCounterShotFireGain: 1.95,
  spiritNormalShotHitGain: 1.5,
  spiritQuickShotHitGain: 1.8,
  spiritCounterHitGain: 2.25,
  spiritCatchGain: 3.75,
  spiritDodgeGain: 3,
  spiritSpecialDodgeBonus: 0.75,
  spiritCloseDodgeBonus: 0.75,
  spiritPassCutGain: 2.25,
  spiritDamageGain: 1.5,
  spiritDefeatGain: 7.5
};
const SPIRIT_GAIN_RATE_SCALE = 0.5;
const CPU_CATCH_DURATION_SCALE = 1.05;

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
    worldBottomPadding: 0,
    screenOffsetY: 56
  },
  player: {
    maxHp: 60,
    maxStamina: 100,
    speed: 306,
    throwPower: 20,
    stats: {
      power: 5,
      speed: 5,
      jump: 5,
      technique: 5,
      defense: 6,
      pass: 6
    }
  },
  ball: {
    radius: 37,
    damage: 20,
    shootSpeed: 2065,
    specialShootSpeed: 1646,
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
    hitRecoveryDuration: 0.55,
    invincibleTime: 1,
    knockbackSpeed: 410,
    downTime: 0.9,
    exitDelay: 1.5,
    cpuCatchChance: 0.5,
    jumpVelocity: 630,
    jumpGravity: 920,
    dashSpeedMultiplier: 3.2,
    dodgeCooldown: 0.55,
    dodgeSuccessRecovery: 0.1,
    turnDuration: 0,
    turnSpeedMultiplier: 1,
    depthTop: 140,
    depthBottom: 1080,
    characterScale: 1.56,
    spiritMax: 10,
    spiritFillSeconds: 120,
    ...SPIRIT_GAIN_CONFIG,
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
    this.bravesSelections = {
      left: this.createDefaultBravesSelection(),
      right: this.createDefaultBravesSelection()
    };
    this.rosterChoiceMenu = null;
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
    this.hellfireZones = [];
    this.meteorLavaZones = [];
    this.audio = this.createAudioState();
    this.installAudioUnlockHandlers();
    this.installPointerHandlers();
    this.screenShakeTimer = 0;
    this.screenShakeDuration = 0;
    this.screenShakeStrength = 0;
    this.hellfireFlashTimer = 0;
    this.hellfireFlashDuration = 0;
    this.counterFreezeTimer = 0;
    this.boostEffectStage = 0;
    this.boomerangTurnPresented = false;
    this.looseOutfieldRecoveryTimer = 0;
    this.looseOutfieldTotalTimer = 0;
    this.looseBallRecoveryTimer = 0;
    this.lastLooseOutfieldBallPosition = null;
    this.lastLooseOutfieldReceiverDistance = Infinity;
    this.heldBallWatchdog = { ownerId: null, timer: 0 };
    this.message = "READY";
    this.setupMatch();
    requestAnimationFrame((time) => this.loop(time));
  }

  createDefaultTeamSelection() {
    return Array(TEAM_SELECTION_COUNT).fill("normal");
  }

  createDefaultBravesSelection() {
    return [...BRAVES_DEFAULT_SELECTION];
  }

  createAudioState() {
    const supported = typeof Audio !== "undefined";
    const bgm = {};
    const sfxPools = {};
    if (supported) {
      for (const key of ["koutei", "daimao"]) {
        const audio = new Audio(AUDIO_CONFIG.paths[key]);
        audio.loop = true;
        audio.volume = AUDIO_CONFIG.bgmVolume;
        audio.preload = "auto";
        bgm[key] = audio;
      }
      for (const key of ["pass", "shoot", "special", "counter", "catch", "damage"]) {
        sfxPools[key] = Array.from({ length: key === "damage" ? 4 : 3 }, () => {
          const audio = new Audio(AUDIO_CONFIG.paths[key]);
          audio.volume = AUDIO_CONFIG.sfxVolume;
          audio.preload = "auto";
          return audio;
        });
      }
    }
    return {
      supported,
      enabled: true,
      bgm,
      currentBgm: null,
      sfxPools,
      sfxIndex: {},
      cooldowns: {},
      unlocked: false
    };
  }

  isAudioEnabled() {
    return Boolean(this.audio?.supported && this.audio.enabled);
  }

  toggleAudioEnabled() {
    if (!this.audio?.supported) return;
    this.audio.enabled = !this.audio.enabled;
    if (!this.audio.enabled) {
      this.stopBgm();
      return;
    }
    this.unlockAudio();
    if (this.state === "playing") this.startMatchBgm();
  }

  unlockAudio() {
    if (!this.audio?.supported || this.audio.unlocked) return;
    this.audio.unlocked = true;
    for (const audio of [...Object.values(this.audio.bgm), ...Object.values(this.audio.sfxPools).flat()]) {
      audio.load?.();
    }
    if (this.state === "playing") this.startMatchBgm();
  }

  installAudioUnlockHandlers() {
    if (!this.audio?.supported || typeof window === "undefined") return;
    const unlock = () => this.unlockAudio();
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock, { passive: true });
    window.addEventListener("gamepadconnected", unlock, { passive: true });
  }

  installPointerHandlers() {
    if (!this.canvas?.addEventListener) return;
    this.canvas.addEventListener("pointerdown", (event) => this.handleCanvasPointerDown(event));
  }

  getCanvasPointerPosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = GAME_CONFIG.width / Math.max(1, rect.width);
    const scaleY = GAME_CONFIG.height / Math.max(1, rect.height);
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  isPointInRect(point, rect) {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.w &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.h
    );
  }

  getModeSelectHitRects() {
    return [0, 1, 2].map((index) => ({
      index,
      x: 310 + index * 410 - 140,
      y: 275,
      w: 280,
      h: 140
    }));
  }

  getPauseMenuHitRects() {
    const centerX = GAME_CONFIG.width * 0.5;
    return [0, 1].map((index) => ({
      index,
      x: centerX - 180,
      y: 330 + index * 72 - 34,
      w: 360,
      h: 54
    }));
  }

  getMatchTitleButtonRect() {
    return { x: 18, y: 58, w: 126, h: 34 };
  }

  getTeamSelectSideX(side) {
    return side === "left" ? 90 : 760;
  }

  getTeamChoicePanelRect(side) {
    return { x: this.getTeamSelectSideX(side), y: 122, w: 590, h: 58 };
  }

  getTeamChoiceListHitRects(side) {
    if (!this.isTeamSelectSlotSelected(side, CPU_OPPONENT_SLOT)) return [];
    const teams = this.getSelectableTeams();
    const selectedIndex = this.selectedTeamIndices?.[side] ?? 0;
    const visibleCount = Math.min(5, teams.length);
    const start = Math.max(0, Math.min(selectedIndex - 2, teams.length - visibleCount));
    const panel = this.getTeamChoicePanelRect(side);
    const listY = panel.y + 64;
    const rowHeight = 38;
    return Array.from({ length: visibleCount }, (_, row) => ({
      index: start + row,
      x: panel.x,
      y: listY + 10 + row * rowHeight,
      w: panel.w,
      h: rowHeight - 6
    }));
  }

  getTeamCardHitRects(side) {
    const x = this.getTeamSelectSideX(side);
    const y = 264;
    return Array.from({ length: TEAM_SELECTION_COUNT }, (_, slot) => ({
      slot,
      x: x + (slot % 4) * 136,
      y: y + Math.floor(slot / 4) * 180,
      w: 122,
      h: 170
    }));
  }

  getTeamRosterConfirmRect(side) {
    const x = this.getTeamSelectSideX(side);
    return { x: x + 548, y: 382, w: 94, h: 62 };
  }

  getMatchStartButtonRect() {
    const centerX = GAME_CONFIG.width * 0.5;
    return { x: centerX - 200, y: 620, w: 400, h: 44 };
  }

  getRosterChoiceMenuHitRects() {
    const menu = this.rosterChoiceMenu;
    if (!menu) return [];
    const team = this.getSelectedTeamForSide(menu.side);
    const options = this.getRosterChoiceOptions(menu.side, menu.slot, team);
    if (options.length === 0) return [];
    const x = this.getTeamSelectSideX(menu.side);
    const y = 264;
    const row = Math.floor(menu.slot / 4);
    const col = menu.slot % 4;
    const cardX = x + col * 136;
    const cardY = y + row * 180;
    const width = this.isBravesTeam(team) ? 214 : 170;
    const rowHeight = 30;
    const menuHeight = options.length * rowHeight + 44;
    const menuX = Math.min(GAME_CONFIG.width - width - 24, cardX + 82);
    const menuY = Math.max(94, Math.min(GAME_CONFIG.height - menuHeight - 20, cardY + 22));
    return options.map((option, index) => ({
      index,
      value: option.value,
      x: menuX + 8,
      y: menuY + 36 + index * rowHeight,
      w: width - 16,
      h: rowHeight - 5
    }));
  }

  handleCanvasPointerDown(event) {
    const point = this.getCanvasPointerPosition(event);

    if (this.state === "modeSelect") {
      const hit = this.getModeSelectHitRects().find((rect) => this.isPointInRect(point, rect));
      if (hit) {
        event.preventDefault();
        this.modeIndex = hit.index;
        this.confirmModeSelection();
      }
      return;
    }

    if (this.state === "teamSelect") {
      if (this.handleTeamSelectPointer(point)) {
        event.preventDefault();
      }
      return;
    }

    if (this.state === "paused") {
      const hit = this.getPauseMenuHitRects().find((rect) => this.isPointInRect(point, rect));
      if (hit) {
        event.preventDefault();
        if (hit.index === 0) {
          this.state = "playing";
        } else {
          this.enterModeSelectState();
          this.pauseMenuIndex = 0;
        }
      }
      return;
    }

    if (this.state === "playing" && this.isPointInRect(point, this.getMatchTitleButtonRect())) {
      event.preventDefault();
      this.enterModeSelectState();
      this.pauseMenuIndex = 0;
    }
  }

  stopBgm() {
    if (!this.audio?.supported) return;
    for (const audio of Object.values(this.audio.bgm)) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.audio.currentBgm = null;
  }

  startMatchBgm() {
    if (!this.isAudioEnabled() || !this.audio.unlocked) return;
    const key = this.isArkmazMatch() ? "daimao" : "koutei";
    if (this.audio.currentBgm === key && !this.audio.bgm[key].paused) return;
    for (const [name, audio] of Object.entries(this.audio.bgm)) {
      if (name === key) continue;
      audio.pause();
      audio.currentTime = 0;
    }
    const bgm = this.audio.bgm[key];
    if (!bgm) return;
    bgm.volume = AUDIO_CONFIG.bgmVolume;
    bgm.currentTime = bgm.currentTime || 0;
    const playPromise = bgm.play();
    if (playPromise?.catch) playPromise.catch(() => {});
    this.audio.currentBgm = key;
  }

  playSound(key, options = {}) {
    if (!this.isAudioEnabled() || !this.audio.unlocked) return;
    const now = performance.now() / 1000;
    const cooldown = options.cooldown || 0;
    if (cooldown > 0 && now < (this.audio.cooldowns[key] || 0)) return;
    if (cooldown > 0) this.audio.cooldowns[key] = now + cooldown;
    const pool = this.audio.sfxPools[key];
    if (!pool?.length) return;
    const index = this.audio.sfxIndex[key] || 0;
    const audio = pool[index % pool.length];
    this.audio.sfxIndex[key] = index + 1;
    audio.pause();
    audio.currentTime = 0;
    audio.volume = options.volume ?? AUDIO_CONFIG.sfxVolume;
    const playPromise = audio.play();
    if (playPromise?.catch) playPromise.catch(() => {});
  }

  playThrowSound(kind, specialType = null, counter = false) {
    if (kind === "pass") {
      this.playSound("pass");
    } else if (kind === "shoot") {
      this.playSound(counter ? "counter" : specialType ? "special" : "shoot");
    }
  }

  enterPlayingState() {
    this.state = "playing";
    this.startMatchBgm();
  }

  enterModeSelectState() {
    this.state = "modeSelect";
    this.stopBgm();
  }

  isArkmazMatch() {
    return [this.getTeamDefinitionForSide("left"), this.getTeamDefinitionForSide("right")]
      .some((team) => team?.id === "arkmaz" || team?.name === "アークマーズ");
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
    this.hellfireZones = [];
    this.meteorLavaZones = [];
    this.hellfireFlashTimer = 0;
    this.hellfireFlashDuration = 0;
    this.boostEffectStage = 0;
    this.boomerangTurnPresented = false;
    this.looseOutfieldRecoveryTimer = 0;
    this.looseOutfieldTotalTimer = 0;
    this.looseBallRecoveryTimer = 0;
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
        isSpiritReady: (team) => this.hasFullSpirit(team),
        isOutfieldBallForTeam: (team, x, y) => this.isOutfieldBallForTeam(team, x, y),
        canAcquireBallAt: (member, x, y) => this.canPlayerAcquireBallAt(member, x, y),
        onShotDefenseEvent: (event) => this.recordShotDefenseDebug(event)
      })
      : null;
    this.cpuController = this.gameMode !== "versus"
      ? new CPUController(this.rightTeam, this.leftTeam, this.ball, {
        ...GAME_CONFIG.battle,
        court,
        areas: this.areas,
        teamName: "right",
        opponentName: "left",
        isSpiritReady: (team) => this.hasFullSpirit(team),
        isOutfieldBallForTeam: (team, x, y) => this.isOutfieldBallForTeam(team, x, y),
        canAcquireBallAt: (member, x, y) => this.canPlayerAcquireBallAt(member, x, y),
        onShotDefenseEvent: (event) => this.recordShotDefenseDebug(event)
      })
      : null;
    this.effects = [];
    this.screenShakeTimer = 0;
    this.screenShakeDuration = 0;
    this.screenShakeStrength = 0;
    this.counterFreezeTimer = 0;
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
    this.heldBallWatchdog = { ownerId: null, timer: 0 };
    this.matchElapsedTime = 0;
    this.timeSinceLastDamage = 0;
  }

  createAreas() {
    const c = GAME_CONFIG.court;
    const halfW = c.w / 2;
    const topY = c.y + 10;
    const backY = c.y + 96;
    const frontY = c.y + c.h - 38;
    const outfieldDepth = 280;
    const sideOutWidth = 500;
    const outerExtension = 230;
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
      leftTopOut: { x: c.x - outerExtension, y: backY - outfieldDepth, w: halfW + outerExtension - 22, h: outfieldDepth },
      leftBottomOut: { x: c.x - outerExtension, y: frontY, w: halfW + outerExtension - 22, h: outfieldDepth },
      leftSideOut: trapezoid(
        sideOutTop,
        sideOutBottom,
        projectedX(c.x, sideOutTop) - sideOutWidth,
        projectedX(c.x, sideOutTop) - 10,
        projectedX(c.x, sideOutBottom) - sideOutWidth,
        projectedX(c.x, sideOutBottom) - 10
      ),
      rightTopOut: { x: c.centerX + 22, y: backY - outfieldDepth, w: halfW + outerExtension - 22, h: outfieldDepth },
      rightBottomOut: { x: c.centerX + 22, y: frontY, w: halfW + outerExtension - 22, h: outfieldDepth },
      rightSideOut: trapezoid(
        sideOutTop,
        sideOutBottom,
        projectedX(c.x + c.w, sideOutTop) + 10,
        projectedX(c.x + c.w, sideOutTop) + sideOutWidth,
        projectedX(c.x + c.w, sideOutBottom) + 10,
        projectedX(c.x + c.w, sideOutBottom) + sideOutWidth
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
    const bravesTeam = this.isBravesTeam(teamDefinition);
    const cpuTeam = teamDefinition?.isCustom || bravesTeam ? null : teamDefinition;
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

    const getCpuPlayer = (slot) => bravesTeam
      ? this.getBravesPlayerDefinition(team, slot)
      : cpuTeam?.players?.[slot] || null;
    const roster = innerPositions.map((position, index) => {
      const cpuPlayer = getCpuPlayer(index);
      return makePlayer({
        id: `${prefix}-inner-${index + 1}`,
        name: cpuPlayer?.name || teamDefinition?.innerNames?.[index] || `${prefix}-inner-${index + 1}`,
        role: "inner",
        zone: innerZone,
        x: position.x,
        y: position.y,
        radius: cpuPlayer?.radius,
        characterType: cpuPlayer?.characterType || (teamDefinition?.isCustom ? selectedTypes[index] : teamDefinition?.characterType) || selectedTypes[index],
        maxHp: cpuPlayer?.maxHp ?? teamDefinition?.maxHp,
        maxStamina: cpuPlayer?.maxStamina ?? teamDefinition?.maxStamina,
        stats: cpuPlayer?.stats || teamDefinition?.stats,
        uniformColor: cpuPlayer?.uniformColor || teamDefinition?.uniformColor,
        pantsColor: cpuPlayer?.pantsColor || teamDefinition?.pantsColor,
        trimColor: cpuPlayer?.trimColor || teamDefinition?.trimColor,
        hairColor: cpuPlayer?.hairColor || teamDefinition?.hairColor || (index === 1 ? "#6d3a1d" : index === 2 ? "#1f1f22" : undefined),
        faceColor: cpuPlayer?.faceColor || teamDefinition?.faceColor,
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
        uniformColor: getCpuPlayer(5)?.uniformColor || teamDefinition?.uniformColor,
        pantsColor: getCpuPlayer(5)?.pantsColor || teamDefinition?.pantsColor,
        trimColor: getCpuPlayer(5)?.trimColor || teamDefinition?.trimColor,
        hairColor: getCpuPlayer(5)?.hairColor || teamDefinition?.hairColor,
        faceColor: getCpuPlayer(5)?.faceColor || teamDefinition?.faceColor,
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
        uniformColor: getCpuPlayer(6)?.uniformColor || teamDefinition?.uniformColor,
        pantsColor: getCpuPlayer(6)?.pantsColor || teamDefinition?.pantsColor,
        trimColor: getCpuPlayer(6)?.trimColor || teamDefinition?.trimColor,
        hairColor: getCpuPlayer(6)?.hairColor || teamDefinition?.hairColor,
        faceColor: getCpuPlayer(6)?.faceColor || teamDefinition?.faceColor,
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
        uniformColor: getCpuPlayer(7)?.uniformColor || teamDefinition?.uniformColor,
        pantsColor: getCpuPlayer(7)?.pantsColor || teamDefinition?.pantsColor,
        trimColor: getCpuPlayer(7)?.trimColor || teamDefinition?.trimColor,
        hairColor: getCpuPlayer(7)?.hairColor || teamDefinition?.hairColor,
        faceColor: getCpuPlayer(7)?.faceColor || teamDefinition?.faceColor,
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
      const area = this.getMoveArea(player, false);
      player.clampToArea(area);
      player.homeX = player.x;
      player.homeY = player.y;
    }
    return roster;
  }

  getCpuOpponentTeams() {
    const player = (name, position, characterType, maxHp, maxStamina, power, speed, jump, technique, specialShotType, extra = {}) => {
      const statusStats = getStatusDefensePassOverride(name, specialShotType);
      return {
        name,
        position,
        characterType,
        maxHp,
        maxStamina,
        stats: {
          power,
          speed,
          jump,
          technique,
          defense: extra.defense ?? statusStats?.defense ?? 6,
          pass: extra.pass ?? statusStats?.pass ?? 6
        },
        specialShotType,
        ...extra
      };
    };
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
          player("たけし", "inner", "normal", 50, 100, 5, 5, 5, 5, "kiai", { defense: 5, pass: 5 }),
          player("こうた", "inner", "normal", 50, 100, 5, 5, 5, 5, "kiai", { defense: 5, pass: 5 }),
          player("まさる", "inner", "normal", 80, 100, 7, 7, 7, 7, "kiai", { pass: 5,  defense: 5,  captain: true }),
          player("ゆうき", "inner", "normal", 50, 100, 5, 5, 5, 5, "kiai", { defense: 5, pass: 5 }),
          player("しんぺい", "inner", "normal", 50, 100, 5, 5, 5, 5, "kiai", { defense: 5, pass: 5 }),
          player("ひろし", "out", "normal", 50, 100, 5, 5, 5, 5, "kiai", { defense: 5, pass: 5 }),
          player("けんじ", "out", "normal", 50, 100, 5, 5, 5, 5, "kiai", { defense: 5, pass: 5 }),
          player("たかし", "out", "normal", 50, 100, 5, 5, 5, 5, "kiai", { defense: 5, pass: 5 })
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
          player("たける", "inner", "jump", 70, 100, 6, 8, 7, 6, "kiai", { defense: 6, pass: 6 }),
          player("りょうた", "inner", "jump", 70, 100, 6, 8, 7, 6, "kiai", { defense: 6, pass: 6 }),
          player("しょうた", "inner", "jump", 110, 100, 8, 10, 8, 8, "boost", { pass: 8,  defense: 8,  captain: true }),
          player("ゆうま", "inner", "jump", 70, 100, 6, 8, 7, 6, "kiai", { defense: 6, pass: 6 }),
          player("はるき", "inner", "jump", 70, 100, 6, 8, 7, 6, "kiai", { defense: 6, pass: 6 }),
          player("だいき", "out", "jump", 70, 100, 6, 8, 7, 6, "kiai", { defense: 6, pass: 6 }),
          player("けいた", "out", "jump", 70, 100, 6, 8, 7, 6, "kiai", { defense: 6, pass: 6 }),
          player("しゅん", "out", "jump", 70, 100, 6, 8, 7, 6, "kiai", { defense: 6, pass: 6 })
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
          player("れつ", "inner", "jump", 170, 110, 8, 11, 9, 8, "kiai", { defense: 8, pass: 8 }),
          player("むさし", "inner", "normal", 170, 110, 9, 9, 9, 8, "kiai", { defense: 8, pass: 8 }),
          player("しょう", "inner", "speed", 170, 110, 9, 8, 10, 7, "boomerang", { defense: 8, pass: 8 }),
          player("じん", "inner", "normal", 170, 110, 9, 9, 9, 8, "kiai", { defense: 8, pass: 8 }),
          player("だいち", "inner", "power", 240, 150, 13, 7, 9, 8, "lightning", { pass: 10,  defense: 10,  captain: true }),
          player("はやと", "out", "normal", 170, 110, 9, 9, 9, 7, "kiai", { defense: 8, pass: 8 }),
          player("えんじ", "out", "speed", 170, 110, 9, 8, 9, 7, "kiai", { defense: 8, pass: 8 }),
          player("ひかる", "out", "jump", 170, 110, 8, 11, 9, 7, "kiai", { defense: 8, pass: 8 })
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
          player("\u30c8\u30e0", "inner", "speed", 180, 100, 9, 12, 13, 8, "kiai", { defense: 9, pass: 9 }),
          player("\u30d6\u30e9\u30a4\u30a2\u30f3", "inner", "power", 180, 100, 11, 9, 8, 7, "kiai", { defense: 9, pass: 9 }),
          player("\u30b8\u30e7\u30fc", "inner", "normal", 250, 150, 16, 13, 13, 13, "triple", { pass: 13,  defense: 13,  captain: true }),
          player("\u30cb\u30c3\u30af", "inner", "normal", 180, 100, 10, 11, 10, 8, "kiai", { defense: 9, pass: 9 }),
          player("\u30de\u30c3\u30af\u30b9", "inner", "jump", 180, 100, 8, 13, 9, 8, "kiai", { defense: 9, pass: 9 }),
          player("\u30b9\u30c6\u30a3\u30fc\u30d6", "out", "normal", 180, 100, 9, 8, 9, 7, "kiai", { defense: 9, pass: 9 }),
          player("\u30ec\u30c3\u30af\u30b9", "out", "power", 180, 100, 11, 7, 10, 7, "kiai", { defense: 9, pass: 9 }),
          player("\u30d6\u30ed\u30c3\u30af", "out", "speed", 180, 100, 9, 9, 13, 8, "kiai", { defense: 9, pass: 9 })
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
          player("シュナイダー", "inner", "normal", 220, 100, 12, 8, 9, 8, "iron", { pass: 8,  defense: 10,  captain: true }),
          player("ミュラー", "inner", "normal", 140, 100, 9, 8, 8, 7, "iron", { defense: 8, pass: 6 }),
          player("クライン", "inner", "normal", 140, 100, 9, 8, 7, 8, "iron", { defense: 8, pass: 6 }),
          player("ベッカー", "inner", "normal", 140, 100, 8, 9, 9, 7, "iron", { defense: 8, pass: 6 }),
          player("ホフマン", "inner", "normal", 140, 100, 9, 8, 8, 8, "iron", { defense: 8, pass: 6 }),
          player("リヒター", "out", "normal", 140, 100, 8, 7, 9, 8, "iron", { defense: 8, pass: 6 }),
          player("ケラー", "out", "normal", 140, 100, 9, 8, 8, 7, "iron", { defense: 8, pass: 6 }),
          player("フィッシャー", "out", "normal", 140, 100, 7, 8, 8, 8, "iron", { defense: 8, pass: 6 })
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
          player("\u305f\u3053\u3078\u3044", "inner", "jump", 160, 100, 9, 8, 9, 9, "tsutenkaku", { pass: 11,  defense: 9,  uniformEmblem: "takoBib" }),
          player("\u304a\u3053\u306e\u307f", "inner", "normal", 120, 100, 6, 6, 8, 6, "kiai", { defense: 7, pass: 9 }),
          player("\u304f\u3057\u304b\u3064", "inner", "normal", 120, 100, 8, 8, 7, 8, "kiai", { defense: 7, pass: 9 }),
          player("\u304f\u3044\u3060\u304a\u308c", "inner", "normal", 120, 100, 7, 8, 7, 7, "kiai", { defense: 7, pass: 9 }),
          player("\u304a\u304a\u304d\u306b", "inner", "normal", 120, 100, 7, 5, 9, 7, "kiai", { defense: 7, pass: 9 }),
          player("\u306a\u3093\u3067\u3084", "out", "normal", 120, 100, 7, 6, 7, 6, "kiai", { defense: 7, pass: 9 }),
          player("\u307e\u3044\u3069", "out", "normal", 120, 100, 6, 7, 6, 7, "kiai", { defense: 7, pass: 9 }),
          player("\u3069\u3046\u3068\u3093", "out", "normal", 120, 100, 8, 6, 7, 7, "kiai", { defense: 7, pass: 9 })
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
          player("よこづな", "inner", "power", 200, 100, 15, 7, 8, 8, "slap", { pass: 6,  defense: 10,  uniformEmblem: "sumoGold" }),
          player("らいのふじ", "inner", "power", 130, 100, 11, 4, 7, 7, "slap", { pass: 6,  defense: 8,  uniformEmblem: "sumo" }),
          player("はりておう", "inner", "power", 130, 100, 12, 4, 7, 7, "slap", { pass: 6,  defense: 8,  uniformEmblem: "sumo" }),
          player("がんさい", "inner", "power", 130, 100, 10, 4, 7, 7, "slap", { pass: 6,  defense: 8,  uniformEmblem: "sumo" }),
          player("ごうのやま", "inner", "power", 130, 100, 10, 4, 7, 7, "slap", { pass: 6,  defense: 8,  uniformEmblem: "sumo" }),
          player("だいふんか", "out", "power", 130, 100, 10, 4, 7, 7, "slap", { pass: 6,  defense: 8,  uniformEmblem: "sumo" }),
          player("かいりきやま", "out", "power", 130, 100, 12, 4, 7, 7, "slap", { pass: 6,  defense: 8,  uniformEmblem: "sumo" }),
          player("ちゃんこまる", "out", "power", 130, 100, 9, 4, 8, 6, "slap", { pass: 6,  defense: 8,  uniformEmblem: "sumo" })
        ]
      },
      {
        id: "galactakos",
        name: "\u30ae\u30e3\u30e9\u30af\u30bf\u30b3\u30fc\u30ba",
        description: "\u5b87\u5b99\u304b\u3089\u6765\u305f\u6d6e\u904a\u578b\u30bf\u30b3\u30c1\u30fc\u30e0",
        characterType: "alien",
        innerNames: ["\u30aa\u30af\u30c8", "\u30d4\u30b3", "\u30b0\u30cb\u30e3", "\u30d5\u30ef\u30f3", "\u30ad\u30e5\u30eb"],
        outNames: ["\u30dd\u30eb", "\u30cb\u30e5\u30eb", "\u30e2\u30cb\u30e7"],
        uniformColor: "#1d9ec4",
        pantsColor: "#167f9d",
        trimColor: "#7cffcb",
        hairColor: "#167f9d",
        faceColor: "#48d7b8",
        eyeColor: "#7cffcb",
        uniformEmblem: "galactako",
        maxHp: 250,
        maxStamina: 115,
        stats: { power: 9, speed: 7, jump: 16, technique: 12 },
        cpuProfile: "galactakos",
        players: [
          player("\u30aa\u30af\u30c8", "inner", "alien", 300, 130, 14, 8, 20, 13, "ufoSpin", { pass: 8,  defense: 10,  captain: true, uniformEmblem: "galactakoCaptain" }),
          player("\u30d4\u30b3", "inner", "alien", 200, 115, 9, 8, 16, 10, "ufoSpin", { defense: 7, pass: 7 }),
          player("\u30b0\u30cb\u30e3", "inner", "alien", 200, 115, 9, 6, 16, 10, "ufoSpin", { defense: 7, pass: 7 }),
          player("\u30d5\u30ef\u30f3", "inner", "alien", 200, 120, 9, 7, 16, 10, "ufoSpin", { defense: 7, pass: 7 }),
          player("\u30ad\u30e5\u30eb", "inner", "alien", 200, 115, 9, 8, 16, 10, "ufoSpin", { defense: 7, pass: 7 }),
          player("\u30dd\u30eb", "out", "alien", 200, 115, 10, 7, 16, 10, "ufoSpin", { defense: 7, pass: 7 }),
          player("\u30cb\u30e5\u30eb", "out", "alien", 200, 120, 8, 8, 16, 10, "ufoSpin", { defense: 7, pass: 7 }),
          player("\u30e2\u30cb\u30e7", "out", "alien", 200, 115, 9, 6, 16, 10, "ufoSpin", { defense: 7, pass: 7 })
        ]
      },
      {
        id: "zenmai-gears",
        name: "ゼンマイギアーズ",
        description: "機械的な精密動作と誘導シュートで攻めるロボットチーム",
        characterType: "normal",
        innerNames: ["ゼロ", "ボルト", "ギア", "ピストン", "センサー"],
        outNames: ["レーダー", "コイル", "ビット"],
        uniformColor: "#bfc8ce",
        pantsColor: "#929da5",
        trimColor: "#42e5d0",
        eyeColor: "#37f3df",
        uniformEmblem: "robot",
        maxHp: 200,
        maxStamina: 200,
        stats: { power: 11, speed: 7, jump: 6, technique: 11 },
        cpuProfile: "zenmaiGears",
        players: [
          player("ゼロ", "inner", "normal", 320, 200, 15, 8, 8, 14, "lockRocket", { pass: 9,  defense: 13,  captain: true, uniformEmblem: "robotCaptain" }),
          player("ボルト", "inner", "normal", 200, 200, 13, 6, 6, 11, "clockStop", { pass: 8,  defense: 10,  uniformEmblem: "robot" }),
          player("ギア", "inner", "normal", 200, 200, 13, 6, 6, 11, "clockStop", { pass: 8,  defense: 10,  uniformEmblem: "robot" }),
          player("ピストン", "inner", "normal", 200, 200, 13, 6, 6, 11, "clockStop", { pass: 8,  defense: 10,  uniformEmblem: "robot" }),
          player("センサー", "inner", "normal", 200, 200, 13, 6, 6, 11, "clockStop", { pass: 8,  defense: 10,  uniformEmblem: "robot" }),
          player("レーダー", "out", "normal", 200, 200, 13, 6, 6, 11, "clockStop", { pass: 8,  defense: 10,  uniformEmblem: "robot" }),
          player("コイル", "out", "normal", 200, 200, 13, 6, 6, 11, "clockStop", { pass: 8,  defense: 10,  uniformEmblem: "robot" }),
          player("ビット", "out", "normal", 200, 200, 13, 6, 6, 11, "clockStop", { pass: 8,  defense: 10,  uniformEmblem: "robot" })
        ]
      },
      {
        id: "arkmaz",
        name: "\u30a2\u30fc\u30af\u30de\u30fc\u30ba",
        description: "\u5927\u9b54\u738b\u30a2\u30fc\u30af\u30de\u304c\u7387\u3044\u308b\u30e9\u30b9\u30dc\u30b9\u30c1\u30fc\u30e0",
        characterType: "normal",
        innerNames: ["\u5927\u9b54\u738b\u30a2\u30fc\u30af\u30de", "\u6eb6\u5ca9\u30b4\u30fc\u30ec\u30e0", "\u5438\u8840\u9b3c\u30f4\u30a1\u30eb\u30c9", "\u30b7\u30fc\u30eb\u30c9\u30c7\u30d3\u30eb", "\u9b54\u5973\u30e1\u30eb\u30c6\u30a3"],
        outNames: ["\u30d4\u30b3", "\u30da\u30b3", "\u30dd\u30b3"],
        uniformColor: "#0057ff",
        pantsColor: "#0057ff",
        trimColor: "#f6fbff",
        hairColor: "#f2c14e",
        maxHp: 120,
        maxStamina: 100,
        stats: { power: 7, speed: 7, jump: 7, technique: 7 },
        cpuProfile: "arkmaz",
        players: [
          player("\u5927\u9b54\u738b\u30a2\u30fc\u30af\u30de", "inner", "demon", 400, 200, 20, 13, 13, 13, "hellfire", {
            captain: true,
            uniformEmblem: "arkmaLord",
            uniformColor: "#161018",
            pantsColor: "#24101c",
            trimColor: "#d7a331",
            hairColor: "#09070d",
            faceColor: "#43205f",
            eyeColor: "#ff304a",
            defense: 12,
            pass: 10
          }),
          player("\u6eb6\u5ca9\u30b4\u30fc\u30ec\u30e0", "inner", "lavaGolem", 300, 150, 16, 5, 4, 9, "meteorCrash", {
            uniformEmblem: "lavaGolem",
            radius: 66,
            uniformColor: "#4a3024",
            pantsColor: "#2a1a14",
            trimColor: "#ff7a1f",
            hairColor: "#231512",
            faceColor: "#4a3024",
            eyeColor: "#ffd43b",
            cpuProfile: "arkmaz",
            defense: 14,
            pass: 6
          }),
          player("\u5438\u8840\u9b3c\u30f4\u30a1\u30eb\u30c9", "inner", "vampire", 230, 150, 12, 11, 9, 11, "bloodDrain", {
            uniformEmblem: "vampire",
            uniformColor: "#7a1630",
            pantsColor: "#361227",
            trimColor: "#d6284a",
            hairColor: "#e9eef8",
            faceColor: "#d8edf6",
            eyeColor: "#d81942",
            defense: 10,
            pass: 7
          }),
          player("\u30b7\u30fc\u30eb\u30c9\u30c7\u30d3\u30eb", "inner", "shieldDevil", 250, 150, 10, 12, 8, 13, "devilShield", {
            uniformEmblem: "shieldDevil",
            uniformColor: "#d8dde6",
            pantsColor: "#a8b0bc",
            trimColor: "#f8fbff",
            hairColor: "#0b0612",
            faceColor: "#c8d0dc",
            eyeColor: "#56eaff",
            cpuProfile: "arkmaGuard",
            defense: 13,
            pass: 16
          }),
          player("\u9b54\u5973\u30e1\u30eb\u30c6\u30a3", "inner", "witch", 230, 150, 14, 10, 9, 11, "arcanaSphere", {
            uniformEmblem: "witch",
            uniformColor: "#6f2aa6",
            pantsColor: "#35114f",
            trimColor: "#d8b6ff",
            hairColor: "#edf1ff",
            faceColor: "#f4d4c8",
            eyeColor: "#e0183c",
            cpuProfile: "arkmaz",
            defense: 6,
            pass: 8
          }),
          player("\u30d4\u30b3", "out", "miniDevil", 200, 135, 11, 13, 13, 11, "devilClaw", {
            uniformEmblem: "miniDevil",
            uniformColor: "#17101f",
            pantsColor: "#050407",
            trimColor: "#c91f35",
            faceColor: "#7b3eb0",
            eyeColor: "#ff304a",
            cpuProfile: "arkmaz",
            defense: 6,
            pass: 16
          }),
          player("\u30da\u30b3", "out", "miniDevil", 200, 135, 11, 13, 13, 11, "devilClaw", {
            uniformEmblem: "miniDevil",
            uniformColor: "#17101f",
            pantsColor: "#050407",
            trimColor: "#c91f35",
            faceColor: "#7b3eb0",
            eyeColor: "#ff304a",
            cpuProfile: "arkmaz",
            defense: 6,
            pass: 16
          }),
          player("\u30dd\u30b3", "out", "miniDevil", 200, 135, 11, 13, 13, 11, "devilClaw", {
            uniformEmblem: "miniDevil",
            uniformColor: "#17101f",
            pantsColor: "#050407",
            trimColor: "#c91f35",
            faceColor: "#7b3eb0",
            eyeColor: "#ff304a",
            cpuProfile: "arkmaz",
            defense: 6,
            pass: 16
          })
        ]
      },
      {
        id: "braves",
        name: "ブレーブス",
        description: "魔王チームに立ち向かう明るい正統派ファンタジーチーム",
        isBraves: true,
        characterType: "normal",
        innerNames: ["勇者", "職業枠1", "職業枠2", "職業枠3", "職業枠4"],
        outNames: ["職業枠5", "職業枠6", "職業枠7"],
        uniformColor: "#2f73e8",
        pantsColor: "#f7f9ff",
        trimColor: "#e3352f",
        hairColor: "#f0c14b",
        faceColor: "#ffd9b0",
        eyeColor: "#2c6ee8",
        maxHp: 160,
        maxStamina: 130,
        stats: { power: 9, speed: 9, jump: 9, technique: 9, defense: 6, pass: 6 },
        cpuProfile: "balanced",
        players: this.createBravesPlayerDefinitions()
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

  isBravesTeam(team) {
    return team?.id === "braves" || team?.isBraves;
  }

  isEditableRosterTeam(team) {
    return Boolean(team?.isCustom || this.isBravesTeam(team));
  }

  getBravesSelectionForSide(side) {
    if (!this.bravesSelections?.[side]) {
      if (!this.bravesSelections) this.bravesSelections = {};
      this.bravesSelections[side] = this.createDefaultBravesSelection();
    }
    this.normalizeBravesSelection(this.bravesSelections[side]);
    return this.bravesSelections[side];
  }

  normalizeBravesSelection(selection) {
    while (selection.length < TEAM_SELECTION_COUNT) {
      selection.push(selection.length >= 5 ? "archer" : BRAVES_INNER_JOB_ORDER[selection.length % BRAVES_INNER_JOB_ORDER.length]);
    }
    const usedInnerJobs = new Set();
    for (let i = 0; i < TEAM_SELECTION_COUNT; i += 1) {
      if (selection[i] === "swordwoman") {
        selection[i] = "mage";
      }
      if (selection[i] === "knight") {
        selection[i] = "paladin";
      }
      if (i >= 5) {
        selection[i] = "archer";
        continue;
      }
      if (!BRAVES_INNER_JOB_ORDER.includes(selection[i]) || usedInnerJobs.has(selection[i])) {
        selection[i] = BRAVES_INNER_JOB_ORDER.find((jobId) => !usedInnerJobs.has(jobId)) || "hero";
      }
      usedInnerJobs.add(selection[i]);
    }
    return selection;
  }

  getBravesJobDefinition(jobId) {
    return BRAVES_JOB_DEFINITIONS[jobId] || BRAVES_JOB_DEFINITIONS.warrior;
  }

  createBravesPlayerDefinitions(selection = this.createDefaultBravesSelection()) {
    const normalizedSelection = [...selection];
    this.normalizeBravesSelection(normalizedSelection);
    return normalizedSelection.slice(0, TEAM_SELECTION_COUNT).map((jobId, slot) => {
      const job = this.getBravesJobDefinition(jobId);
      const jobName = BRAVES_JOB_NAMES[jobId];
      return {
        name: slot >= 5 && jobId === "archer" ? BRAVES_OUTFIELD_ARCHER_NAMES[slot - 5] : jobName?.name || job.label,
        position: slot < 5 ? "inner" : "out",
        characterType: job.characterType,
        maxHp: job.maxHp,
        maxStamina: job.maxStamina,
        stats: job.stats,
        specialShotType: job.specialShotType,
        uniformEmblem: `braves-${jobId}`,
        cpuProfile: jobId === "paladin" ? "bravesPaladin" : undefined,
        uniformColor: job.uniformColor,
        pantsColor: job.pantsColor,
        trimColor: job.trimColor,
        hairColor: job.hairColor,
        faceColor: job.faceColor,
        eyeColor: job.eyeColor,
        captain: jobId === "hero"
      };
    });
  }

  getBravesPlayerDefinition(side, slot) {
    return this.createBravesPlayerDefinitions(this.getBravesSelectionForSide(side))[slot];
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
      return this.getSelectedTeamForSide(team);
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
    this.rosterChoiceMenu = null;
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

  setSelectedTeamIndex(side, index) {
    const teams = this.getSelectableTeams();
    if (teams.length === 0) return;
    this.selectedTeamIndices[side] = ((index % teams.length) + teams.length) % teams.length;
    this.rosterChoiceMenu = null;
    if (this.teamSelectionConfirmed) this.teamSelectionConfirmed[side] = false;
    if (this.teamRosterConfirmed) this.teamRosterConfirmed[side] = false;
    if (this.gameMode === "single" && side === "right") {
      this.cpuOpponentIndex = this.selectedTeamIndices.right;
    }
  }

  setTeamSelectPointerSlot(side, slot) {
    if (this.gameMode === "versus") {
      this.teamSelectionSlots[side] = slot;
      return;
    }
    this.teamSelectionSide = side;
    this.teamSelectionSlot = slot;
  }

  startSelectedMatchIfReady() {
    if (!this.canStartSelectedMatch()) return false;
    this.setupMatch();
    this.enterPlayingState();
    return true;
  }

  activateTeamSelectSlot(side, slot) {
    this.setTeamSelectPointerSlot(side, slot);
    const selectedTeam = this.getSelectedTeamForSide(side);

    if (slot < TEAM_SELECTION_COUNT) {
      if (this.isEditableRosterTeam(selectedTeam) && this.teamSelectionConfirmed?.[side]) {
        this.openRosterChoiceMenu(side, slot);
      }
      return true;
    }

    if (slot === CUSTOM_TEAM_CONFIRM_SLOT) {
      if (this.isEditableRosterTeam(selectedTeam)) this.confirmTeamRoster(side);
      return true;
    }

    if (slot === START_SLOT) {
      this.startSelectedMatchIfReady();
      return true;
    }

    if (slot !== CPU_OPPONENT_SLOT) return false;

    if (this.gameMode === "versus") {
      if (!this.teamSelectionConfirmed[side]) {
        this.teamSelectionConfirmed[side] = true;
        if (this.isEditableRosterTeam(selectedTeam)) {
          this.teamSelectionSlots[side] = 0;
        } else {
          this.teamRosterConfirmed[side] = true;
          this.teamSelectionSlots[side] = START_SLOT;
        }
      } else {
        this.teamSelectionSlots[side] = this.isEditableRosterTeam(selectedTeam) ? 0 : START_SLOT;
      }
      return true;
    }

    if (!this.teamSelectionConfirmed[side]) {
      this.teamSelectionConfirmed[side] = true;
      if (this.isEditableRosterTeam(selectedTeam)) {
        this.teamSelectionSide = side;
        this.teamSelectionSlot = 0;
      } else if (side === "left") {
        this.teamRosterConfirmed[side] = true;
        this.teamSelectionSide = "right";
        this.teamSelectionSlot = CPU_OPPONENT_SLOT;
      } else {
        this.teamRosterConfirmed[side] = true;
        this.teamSelectionSide = side;
        this.teamSelectionSlot = START_SLOT;
      }
    } else if (this.isEditableRosterTeam(selectedTeam)) {
      this.teamSelectionSide = side;
      this.teamSelectionSlot = 0;
    } else if (side === "left") {
      this.teamSelectionSide = "right";
      this.teamSelectionSlot = CPU_OPPONENT_SLOT;
    } else {
      this.teamSelectionSide = side;
      this.teamSelectionSlot = START_SLOT;
    }
    return true;
  }

  handleTeamSelectPointer(point) {
    const rosterHit = this.getRosterChoiceMenuHitRects().find((rect) => this.isPointInRect(point, rect));
    if (rosterHit && this.rosterChoiceMenu) {
      const menu = this.rosterChoiceMenu;
      const team = this.getSelectedTeamForSide(menu.side);
      this.applyRosterChoice(menu.side, menu.slot, rosterHit.value, team);
      this.rosterChoiceMenu = null;
      return true;
    }
    if (this.rosterChoiceMenu) {
      this.rosterChoiceMenu = null;
      return true;
    }

    if (this.isPointInRect(point, this.getMatchStartButtonRect())) {
      this.activateTeamSelectSlot(this.teamSelectionSide || "left", START_SLOT);
      return true;
    }

    for (const side of ["left", "right"]) {
      const teamRow = this.getTeamChoiceListHitRects(side).find((rect) => this.isPointInRect(point, rect));
      if (teamRow) {
        this.setSelectedTeamIndex(side, teamRow.index);
        this.setTeamSelectPointerSlot(side, CPU_OPPONENT_SLOT);
        return true;
      }
    }

    for (const side of ["left", "right"]) {
      if (this.isPointInRect(point, this.getTeamChoicePanelRect(side))) {
        return this.activateTeamSelectSlot(side, CPU_OPPONENT_SLOT);
      }
    }

    for (const side of ["left", "right"]) {
      const team = this.getSelectedTeamForSide(side);
      if (this.isEditableRosterTeam(team) && this.teamSelectionConfirmed?.[side]) {
        if (this.isPointInRect(point, this.getTeamRosterConfirmRect(side))) {
          return this.activateTeamSelectSlot(side, CUSTOM_TEAM_CONFIRM_SLOT);
        }
        const card = this.getTeamCardHitRects(side).find((rect) => this.isPointInRect(point, rect));
        if (card) {
          return this.activateTeamSelectSlot(side, card.slot);
        }
      }
    }

    return false;
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
        this.enterModeSelectState();
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
        this.enterModeSelectState();
        this.pauseMenuIndex = 0;
      }
    }
  }

  confirmModeSelection() {
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
      this.selectedTeamIndices = { left: 2, right: 3 };
      this.watchCpuLeftIndex = 2;
      this.watchCpuRightIndex = 3;
    }
  }

  updateModeSelect() {
    if (this.input.wasPressed("button0")) {
      this.toggleAudioEnabled();
    }
    if (this.wasMenuDirectionPressed("left") || this.wasMenuDirectionPressed("up")) {
      this.modeIndex = Math.max(0, this.modeIndex - 1);
    }
    if (this.wasMenuDirectionPressed("right") || this.wasMenuDirectionPressed("down")) {
      this.modeIndex = Math.min(2, this.modeIndex + 1);
    }
    if (this.input.wasPressed("button1") || this.input.wasPressed("button2")) {
      this.confirmModeSelection();
    }
  }

  updateTeamSelect() {
    if (this.gameMode === "watch") {
      this.updateSingleTeamSelectCursor();
    } else if (this.gameMode === "versus") {
      this.updateTeamSelectCursor("left", 1);
      this.updateTeamSelectCursor("right", 2);
    } else {
      this.updateSingleTeamSelectCursor();
    }

    if (this.input.wasPressed("pause")) {
      this.enterModeSelectState();
    }
  }

  updateSingleTeamSelectCursor() {
    if (this.updateRosterChoiceMenu(1)) return;
    const moved = this.moveTeamSelectCursor(this.teamSelectionSide, this.teamSelectionSlot, 1);
    this.teamSelectionSide = moved.side;
    this.teamSelectionSlot = moved.slot;
    const selectedTeam = this.getSelectedTeamForSide(this.teamSelectionSide);
    if (this.input.wasPressed("button2") && this.teamSelectionSlot < TEAM_SELECTION_COUNT && this.isEditableRosterTeam(selectedTeam)) {
      this.openRosterChoiceMenu(this.teamSelectionSide, this.teamSelectionSlot);
    }
    if (this.input.wasPressed("button2") && this.teamSelectionSlot === CUSTOM_TEAM_CONFIRM_SLOT && this.isEditableRosterTeam(selectedTeam)) {
      this.confirmTeamRoster(this.teamSelectionSide);
      return;
    }
    if (this.input.wasPressed("button2") && this.teamSelectionSlot === CPU_OPPONENT_SLOT) {
      if (!this.teamSelectionConfirmed[this.teamSelectionSide]) {
        this.teamSelectionConfirmed[this.teamSelectionSide] = true;
        if (this.isEditableRosterTeam(selectedTeam)) {
          this.teamSelectionSlot = 0;
        } else if (this.teamSelectionSide === "left") {
          this.teamRosterConfirmed[this.teamSelectionSide] = true;
          this.teamSelectionSide = "right";
        } else {
          this.teamRosterConfirmed[this.teamSelectionSide] = true;
          this.teamSelectionSlot = START_SLOT;
        }
      } else if (this.isEditableRosterTeam(selectedTeam)) {
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
        this.enterPlayingState();
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
      this.enterModeSelectState();
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
        this.enterPlayingState();
      }
    }
    if (this.input.wasPressed("button1")) {
      if (this.watchSelectionSlot > 0) {
        this.watchSelectionSlot -= 1;
      } else {
        this.enterModeSelectState();
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
    if (this.gameMode === "single" || this.gameMode === "watch") {
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
    if (this.updateRosterChoiceMenu(playerIndex, side)) return;
    const moved = this.moveTeamSelectCursor(side, this.teamSelectionSlots[side], playerIndex, true);
    this.teamSelectionSlots[side] = moved.slot;
    const slot = moved.slot;
    const selectedTeam = this.getSelectedTeamForSide(side);

    if (this.input.wasPressed("button2", playerIndex) && slot < TEAM_SELECTION_COUNT && this.isEditableRosterTeam(selectedTeam)) {
      this.openRosterChoiceMenu(side, slot);
    }
    if (this.input.wasPressed("button2", playerIndex) && slot === CUSTOM_TEAM_CONFIRM_SLOT && this.isEditableRosterTeam(selectedTeam)) {
      this.confirmTeamRoster(side);
      return;
    }
    if (this.input.wasPressed("button2", playerIndex) && slot === CPU_OPPONENT_SLOT) {
      if (!this.teamSelectionConfirmed[side]) {
        this.teamSelectionConfirmed[side] = true;
        if (this.isEditableRosterTeam(selectedTeam)) {
          this.teamSelectionSlots[side] = 0;
        } else {
          this.teamRosterConfirmed[side] = true;
          this.teamSelectionSlots[side] = START_SLOT;
        }
      } else {
        this.teamSelectionSlots[side] = this.isEditableRosterTeam(selectedTeam) ? 0 : START_SLOT;
      }
    }
    if (this.input.wasPressed("button2", playerIndex) && slot === START_SLOT) {
      if (this.canStartSelectedMatch()) {
        this.setupMatch();
        this.enterPlayingState();
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
      this.enterModeSelectState();
    }
  }

  openRosterChoiceMenu(side, slot) {
    const team = this.getSelectedTeamForSide(side);
    const options = this.getRosterChoiceOptions(side, slot, team);
    if (options.length <= 1) return false;
    const currentValue = this.getRosterChoiceCurrentValue(side, slot, team);
    let index = options.findIndex((option) => option.value === currentValue);
    if (index < 0) index = 0;
    this.rosterChoiceMenu = { side, slot, index };
    return true;
  }

  updateRosterChoiceMenu(playerIndex = 1, side = null) {
    const menu = this.rosterChoiceMenu;
    if (!menu) return false;
    if (side && menu.side !== side) return true;
    const team = this.getSelectedTeamForSide(menu.side);
    const options = this.getRosterChoiceOptions(menu.side, menu.slot, team);
    if (options.length === 0) {
      this.rosterChoiceMenu = null;
      return true;
    }
    if (this.wasMenuDirectionPressed("up", playerIndex)) {
      menu.index = (menu.index - 1 + options.length) % options.length;
    }
    if (this.wasMenuDirectionPressed("down", playerIndex)) {
      menu.index = (menu.index + 1) % options.length;
    }
    if (this.input.wasPressed("button2", playerIndex)) {
      this.applyRosterChoice(menu.side, menu.slot, options[menu.index]?.value, team);
      this.rosterChoiceMenu = null;
    }
    if (this.input.wasPressed("button1", playerIndex) || this.input.wasPressed("pause", playerIndex)) {
      this.rosterChoiceMenu = null;
    }
    return true;
  }

  getRosterChoiceCurrentValue(side, slot, team) {
    if (this.isBravesTeam(team)) return this.getBravesSelectionForSide(side)[slot] || "hero";
    return this.teamSelections[side]?.[slot] || "normal";
  }

  getRosterChoiceOptions(side, slot, team) {
    if (!this.isEditableRosterTeam(team) || slot < 0 || slot >= TEAM_SELECTION_COUNT) return [];
    if (this.isBravesTeam(team)) {
      if (slot >= 5) return [];
      const selections = this.getBravesSelectionForSide(side);
      const usedJobs = new Set(selections.slice(0, 5).filter((jobId, index) => index !== slot && BRAVES_INNER_JOB_ORDER.includes(jobId)));
      return BRAVES_INNER_JOB_ORDER.map((jobId) => {
        const display = BRAVES_JOB_NAMES[jobId];
        return {
          value: jobId,
          disabled: usedJobs.has(jobId),
          label: display ? `${display.job} ${display.name}` : this.getBravesJobDefinition(jobId).label
        };
      }).filter((option) => !option.disabled || option.value === selections[slot]);
    }
    return this.typeOrder.map((type) => ({
      value: type,
      label: CHARACTER_TYPES[type]?.label || type
    }));
  }

  applyRosterChoice(side, slot, value, team) {
    if (!value) return;
    if (this.isBravesTeam(team)) {
      if (slot >= 0 && slot < 5 && BRAVES_INNER_JOB_ORDER.includes(value)) {
        const selections = this.getBravesSelectionForSide(side);
        if (!selections.slice(0, 5).some((jobId, index) => index !== slot && jobId === value)) {
          selections[slot] = value;
        }
      }
      return;
    }
    if (this.teamSelections[side] && this.typeOrder.includes(value)) {
      this.teamSelections[side][slot] = value;
    }
  }

  isShiningPassActor(actor) {
    return Boolean(actor && actor.role === "out" && actor.uniformEmblem === "braves-archer");
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

    const selectColumns = this.isEditableRosterTeam(this.getSelectedTeamForSide(nextSide)) && this.teamSelectionConfirmed?.[nextSide]
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
        nextSlot = this.isEditableRosterTeam(this.getSelectedTeamForSide(nextSide)) && this.teamSelectionConfirmed?.[nextSide]
          ? CUSTOM_TEAM_CONFIRM_SLOT
          : CPU_OPPONENT_SLOT;
      }
    }
    if (up && row > 0) nextSlot -= TEAM_SELECT_COLUMNS;
    if (down) {
      nextSlot = row < lastRow
        ? Math.min(nextSlot + selectColumns, TEAM_SELECTION_COUNT - 1)
        : this.isEditableRosterTeam(this.getSelectedTeamForSide(nextSide)) && this.teamSelectionConfirmed?.[nextSide]
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

  changeSelectedBravesJob(side, slot, direction) {
    if (slot < 0 || slot >= 5) return;
    const selections = this.getBravesSelectionForSide(side);
    const currentJob = selections[slot] || BRAVES_INNER_JOB_ORDER[slot % BRAVES_INNER_JOB_ORDER.length];
    const availableJobs = BRAVES_INNER_JOB_ORDER.filter((jobId) => jobId === currentJob || !selections.slice(0, 5).includes(jobId));
    let index = availableJobs.indexOf(currentJob);
    if (index < 0) index = 0;
    index = (index + direction + availableJobs.length) % availableJobs.length;
    selections[slot] = availableJobs[index];
  }

  canUseCharacterType(side, slot, type) {
    return true;
  }

  updatePlaying(delta) {
    if (this.counterFreezeTimer > 0) {
      this.counterFreezeTimer = Math.max(0, this.counterFreezeTimer - delta);
      return;
    }
    this.matchElapsedTime = (this.matchElapsedTime || 0) + delta;
    this.timeSinceLastDamage = (this.timeSinceLastDamage || 0) + delta;
    this.updateEffects(delta);
    this.updateHellfireZones(delta);
    this.updateMeteorLavaZones(delta);
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
    this.handleForcedCounterThrows();
    this.handlePlayerButtons();
    this.handleCpuButtons(delta);
    this.updateChargingThrow(delta);
    this.updatePendingThrow(delta);
    this.recoverStalledHeldBall(delta);
    this.updateRhythmStep(delta);
    this.updatePlayers(delta);
    this.resolvePlayerCollisions();
    this.autoPickupLooseBall();
    this.ball.update(delta, this.ballBounds);
    this.updateBoostPresentation();
    this.updateBoomerangPresentation();
    this.updateTripleBalls(delta);
    this.autoPickupLooseBall();
    this.resetUnreachableOutfieldBall(delta);
    this.recoverStuckLooseBall(delta);
    this.handleManualCatch(this.leftTeam);
    this.handleManualCatch(this.rightTeam);
    this.handlePassReceives();
    this.handleFriendlyMissedReceives(this.leftTeam);
    this.handleFriendlyMissedReceives(this.rightTeam);
    this.handleHits();
    this.handleTsutenkakuImpact();
    this.handleMeteorCrashImpact();
    this.handleLightningZigzagImpact();
    this.handleHellfireGroundImpact();
    this.handleBoostShotExit();
    this.handleLockRocketExit();
    this.handleTripleBallHits();
    this.ensureBallIsPlayable();
    this.checkGameOver();
  }

  updateSpirit(delta) {
    const max = GAME_CONFIG.battle.spiritMax;
    const gain = (max / GAME_CONFIG.battle.spiritFillSeconds) * SPIRIT_GAIN_RATE_SCALE;
    this.spiritPoints.left = Math.min(max, this.spiritPoints.left + gain * delta);
    this.spiritPoints.right = Math.min(max, this.spiritPoints.right + gain * delta);
  }

  updateTripleBalls(delta) {
    if (!this.tripleBalls || this.tripleBalls.length === 0) return;
    this.tripleBalls = this.tripleBalls.filter((shot) => {
      shot.life -= delta;
      shot.age += delta;
      shot.x += shot.vx * delta;
      shot.y += shot.vy * delta;
      shot.z += shot.vz * delta;
      shot.vz -= GAME_CONFIG.ball.gravity * delta;
      shot.spin += Math.hypot(shot.vx, shot.vy) * delta * 0.025;
      shot.trail.push({ x: shot.x, y: shot.y, z: shot.z });
      if (shot.trail.length > 16) shot.trail.shift();
      if (shot.z <= 0 || shot.life <= 0) return false;
      return this.isPointInsideBallBounds(shot.x, shot.y);
    });
  }

  spawnTripleDummyBalls(actor, aim, multiplier) {
    const length = Math.hypot(aim?.x || actor.facing || 1, aim?.y || 0) || 1;
    const baseAim = { x: (aim?.x || actor.facing || 1) / length, y: (aim?.y || 0) / length };
    const speed = (GAME_CONFIG.ball.specialShootSpeed || GAME_CONFIG.ball.shootSpeed) * 1.12;
    const offsets = [-0.18, 0.18];
    this.spawnEffect(actor.x + actor.facing * 46, actor.y - actor.jumpZ - 48, "#ffffff", "tripleSplit");
    this.startScreenShake(6, 0.09);
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
        z: actor.jumpZ + 24,
        vx: dir.x * speed + actor.vx * GAME_CONFIG.ball.moveBonus * 0.03,
        vy: dir.y * speed + actor.vy * GAME_CONFIG.ball.moveBonus * 0.03,
        vz: 180 + Math.max(0, multiplier - 0.7) * 28 + actor.jumpZ * 0.04,
        radius: GAME_CONFIG.ball.radius * 0.88 * 1.3,
        team: actor.team,
        thrower: actor,
        specialShotType: "triple",
        power: (actor.getEffectiveThrowPower?.() ?? actor.throwPower) * Math.max(0.7, multiplier) * 0.2 * SHOT_DAMAGE_SCALE,
        life: 1.85,
        age: 0,
        lane: angle < 0 ? -1 : 1,
        color: angle < 0 ? "#68e8ff" : "#ffd83d",
        trail: [],
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
        const counterStarted = this.startCounterThrow(holder, 1);
        if (!counterStarted) {
          if (holder.quickShotReadyTimer > 0) this.startQuickShot(holder, 1);
          else this.startChargedThrow(holder, "shoot");
        }
      }
      if (this.input.wasPressed("button0") && this.canUseSpiritSpecial(holder)) {
        this.startChargedThrow(holder, "shoot", 1, true);
      }
      if (this.input.wasPressed("button1")) {
        this.startChargedThrow(holder, "pass");
      }
      if (this.input.wasReleased("button2")) {
        if (!this.chargingThrow?.specialRequested) this.releaseChargedThrow(holder, "shoot");
      }
      if (this.input.wasReleased("button0")) {
        if (this.chargingThrow?.specialRequested) this.releaseChargedThrow(holder, "shoot");
      }
      if (this.input.wasReleased("button1")) {
        this.releaseChargedThrow(holder, "pass");
      }
    } else {
      const dodgePressed = this.input.wasPressed("avoid") || this.input.wasPressed("button1");
      if (dodgePressed) {
        active.startDodge(0, 0, GAME_CONFIG.battle);
      } else if (this.input.wasPressed("catch")) {
        active.startCatch(this.getCatchDuration(active));
      }
    }

    if (this.gameMode === "versus") {
      if (rightTeamHasBall) {
        this.controlledRightPlayerId = holder.id;
        if (this.input.wasPressed("button2", 2)) {
          const counterStarted = this.startCounterThrow(holder, 2);
          if (!counterStarted) {
            if (holder.quickShotReadyTimer > 0) this.startQuickShot(holder, 2);
            else this.startChargedThrow(holder, "shoot", 2);
          }
        }
        if (this.input.wasPressed("button0", 2) && this.canUseSpiritSpecial(holder)) {
          this.startChargedThrow(holder, "shoot", 2, true);
        }
        if (this.input.wasPressed("button1", 2)) {
          this.startChargedThrow(holder, "pass", 2);
        }
        if (this.input.wasReleased("button2", 2)) {
          if (!this.chargingThrow?.specialRequested) this.releaseChargedThrow(holder, "shoot", 2);
        }
        if (this.input.wasReleased("button0", 2)) {
          if (this.chargingThrow?.specialRequested) this.releaseChargedThrow(holder, "shoot", 2);
        }
        if (this.input.wasReleased("button1", 2)) {
          this.releaseChargedThrow(holder, "pass", 2);
        }
      } else if (activeRight && !activeRight.defeated) {
        const dodgePressedP2 = this.input.wasPressed("avoid", 2) || this.input.wasPressed("button1", 2);
        if (dodgePressedP2) {
          activeRight.startDodge(0, 0, GAME_CONFIG.battle);
        } else if (this.input.wasPressed("catch", 2)) {
          activeRight.startCatch(this.getCatchDuration(activeRight));
        }
      }
    }
  }

  handleCpuButtons(delta = 0) {
    if (this.gameMode === "versus") return;
    if (this.gameMode === "watch") {
      this.handleCpuTeamButtons(this.leftTeam, this.cpuControllerLeft, this.rightTeam, delta);
    }
    this.handleCpuTeamButtons(this.rightTeam, this.cpuController, this.leftTeam, delta);
  }

  handleForcedCounterThrows() {
    const holder = this.ball.owner;
    if (!holder || !holder.canCounterThrow?.() || holder.counterAutoTimer > 0) return;
    if (!holder.cpuControlled) return;
    const playerIndex = this.gameMode === "versus" && holder.team === "right" ? 2 : holder.team === "left" ? 1 : 0;
    this.startCounterThrow(holder, playerIndex, true);
  }

  handleCpuTeamButtons(team, controller, opponents, delta = 0) {
    if (!controller) return;
    for (const member of team) {
      const command = controller.getCommand(member);
      if (this.ball.owner === member) {
        if (this.updateCpuHolderStall(member, controller, opponents, delta)) continue;
      } else {
        member.cpuHoldStallTimer = 0;
      }
      if (
        this.ball.owner === member &&
        member.canCounterThrow() &&
        member.counterAutoTimer <= 0 &&
        this.startCounterThrow(member, 0, true)
      ) {
        continue;
      }
      if (command.catch) member.startCatch(this.getCatchDuration(member) * CPU_CATCH_DURATION_SCALE);
      if (command.crouch) member.startDodge(0, 0, GAME_CONFIG.battle);
      if (command.jump) member.jump(GAME_CONFIG.battle);
      if (command.chargeShoot && this.ball.owner === member) {
        const started = this.startCpuChargedShoot(member, command.chargeTime, command.chargeReleaseMode);
        if (!started) controller.resetHolderPlanSoon?.();
      }
      if (command.shoot && this.ball.owner === member) {
        const started = member.quickShotReadyTimer > 0 && !this.hasFullSpirit(member.team)
          ? this.startQuickShot(member)
          : this.launchFromAi(member, "shoot", opponents);
        if (!started) controller.resetHolderPlanSoon?.();
      }
      if (command.pass && this.ball.owner === member) {
        const started = this.launchFromAi(member, "pass", team.filter((p) => p !== member));
        if (!started) controller.resetHolderPlanSoon?.();
      }
    }
  }

  updateCpuHolderStall(member, controller, opponents, delta) {
    if (this.pendingThrow || this.chargingThrow || member.throwLockTimer > 0 || member.counterThrowTimer > 0) {
      member.cpuHoldStallTimer = 0;
      return;
    }
    member.cpuHoldStallTimer = (member.cpuHoldStallTimer || 0) + delta;
    if (member.cpuHoldStallTimer < 3.2) return false;

    member.cpuHoldStallTimer = 0;
    member.cpuPreferredPassTargetId = null;
    controller.specialAttackState = null;
    if (controller.attackTactic) controller.attackTactic.finished = true;
    controller.resetHolderPlanSoon?.();
    if (!this.startCpuChargedShoot(member, 0.55, "time", false)) {
      this.launchFromAi(member, "shoot", opponents, false);
    }
    return true;
  }

  recoverStalledHeldBall(delta = 0) {
    const owner = this.ball?.owner;
    if (!owner || this.ball.isFlying || this.ball.isLoose) {
      this.heldBallWatchdog = { ownerId: null, timer: 0 };
      return;
    }

    const ownerValid = this.players.includes(owner) && !owner.defeated && owner.hp > 0 && owner.downTimer <= 0;
    if (!ownerValid) {
      if (owner) owner.hasBall = false;
      this.releaseBallAt(
        Number.isFinite(owner?.x) ? owner.x : GAME_CONFIG.court.centerX,
        Number.isFinite(owner?.y) ? owner.y : GAME_CONFIG.court.y + GAME_CONFIG.court.h * 0.55,
        "loose"
      );
      this.heldBallWatchdog = { ownerId: null, timer: 0 };
      return;
    }

    owner.hasBall = true;
    for (const member of this.players) {
      if (member !== owner && member.hasBall) member.hasBall = false;
    }

    const ownerId = owner.id ?? owner.name;
    if (this.heldBallWatchdog.ownerId !== ownerId) {
      this.heldBallWatchdog = { ownerId, timer: 0 };
    }
    this.heldBallWatchdog.timer += Math.max(0, delta);

    const cpuLimit = this.pendingThrow?.actor === owner || this.chargingThrow?.actor === owner ? 5.2 : 4.0;
    const playerLimit = 12;
    const limit = owner.cpuControlled ? cpuLimit : playerLimit;
    if (this.heldBallWatchdog.timer < limit) return;

    if (this.pendingThrow?.actor === owner) {
      owner.clockStopAnticipation = false;
      owner.arcanaAnticipation = false;
      this.pendingThrow = null;
    }
    if (this.chargingThrow?.actor === owner) {
      owner.clockStopAnticipation = false;
      owner.arcanaAnticipation = false;
      this.chargingThrow = null;
    }

    owner.throwLockTimer = 0;
    owner.throwTimer = 0;
    owner.throwPhase = "none";
    owner.throwKind = "none";
    owner.counterThrowTimer = 0;
    owner.hitRecoveryTimer = 0;
    owner.cpuHoldStallTimer = 0;

    if (owner.cpuControlled) {
      const opponents = owner.team === "left" ? this.rightTeam : this.leftTeam;
      const started = this.startCpuChargedShoot(owner, 0.35, "time", false) ||
        this.launchFromAi(owner, "shoot", opponents, false);
      if (started) {
        this.heldBallWatchdog = { ownerId: null, timer: 0 };
        return;
      }
    }

    this.releaseBallAt(owner.x, owner.y - 24, "loose");
    this.heldBallWatchdog = { ownerId: null, timer: 0 };
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
    return this.applyInnerVisualMovementPadding(member, this.areas[member.zone]);
  }

  applyInnerVisualMovementPadding(member, area) {
    if (!member || member.role !== "inner" || !area?.trapezoid) return area;
    const padding = this.getInnerVisualBottomPadding(member);
    if (padding <= 0) return area;
    const t = area.trapezoid;
    const yBottom = Math.max(t.yTop + 80, t.yBottom - padding);
    const bottom = this.getTrapezoidBoundsAtY(t, yBottom);
    if (!bottom) return area;
    return {
      ...area,
      h: yBottom - t.yTop,
      trapezoid: {
        ...t,
        yBottom,
        leftBottom: bottom.left,
        rightBottom: bottom.right
      }
    };
  }

  getInnerVisualBottomPadding(member) {
    if (member.isDemonStyle?.()) return 170;
    if (member.isLavaGolemStyle?.()) return 120;
    return 0;
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
    return {
      rects: [
        ...zones.map((zone) => this.areas[zone]),
        ...this.getOutfieldConnectorAreas(team)
      ]
    };
  }

  getOutfieldConnectorAreas(team) {
    const rightSide = team === "left";
    const topArea = this.areas[rightSide ? "rightTopOut" : "leftTopOut"];
    const bottomArea = this.areas[rightSide ? "rightBottomOut" : "leftBottomOut"];
    const sideArea = this.areas[rightSide ? "rightSideOut" : "leftSideOut"];
    const side = sideArea?.trapezoid;
    if (!side) return [];

    const depth = 120;
    const topSample = this.getTrapezoidBoundsAtY(side, Math.min(side.yBottom, side.yTop + depth));
    const bottomSample = this.getTrapezoidBoundsAtY(side, side.yBottom);
    if (!topSample || !bottomSample) return [];

    const makeConnector = (sample, area, y) => {
      const bounds = this.getAreaBounds(area);
      if (rightSide) {
        const right = Math.max(sample.right, bounds.x + bounds.w);
        return { x: sample.left, y, w: right - sample.left, h: depth * 2 };
      }
      const left = Math.min(sample.left, bounds.x);
      return { x: left, y, w: sample.right - left, h: depth * 2 };
    };

    return [
      makeConnector(topSample, topArea, side.yTop - depth),
      makeConnector(bottomSample, bottomArea, side.yBottom - depth)
    ];
  }

  isOutfieldBallForTeam(team, x, y) {
    const territory = this.getLooseBallTerritory(x, y);
    return territory?.team === team && territory.role === "out";
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
    const candidates = this.players
      .filter((member) => {
        if (member.defeated || member.downTimer > 0 || member.stunTimer > 0 || member.hitRecoveryTimer > 0) return false;
        if (member.dodgeTimer > 0) return false;
        if (member.pickupLockTimer > 0) return false;
        return this.canPlayerAcquireBallAt(member, this.ball.x, this.ball.y);
      })
      .sort((a, b) => (
        Math.hypot(a.x - this.ball.x, a.y - this.ball.y) -
        Math.hypot(b.x - this.ball.x, b.y - this.ball.y)
      ));

    for (const member of candidates) {
      if (this.ball.canBePickedUpBy(member, pickupDistance)) {
        this.ball.pickUp(member);
        this.setControlledMember(member.team, member);
  }
    }
  }

  canPlayerAcquireBallAt(member, x, y) {
    if (!member || member.defeated) return false;
    const territory = this.getLooseBallTerritory(x, y);
    if (territory) {
      return member.team === territory.team && member.role === territory.role;
    }
    return this.isPointInsideArea(x, y, 0, this.getMoveArea(member, false));
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
      this.looseOutfieldTotalTimer = 0;
      this.lastLooseOutfieldBallPosition = null;
      this.lastLooseOutfieldReceiverDistance = Infinity;
      return;
    }

    const territory = this.getLooseBallTerritory(this.ball.x, this.ball.y);
    const outfield = territory?.role === "out"
      ? this.getOutfieldSideForBall(this.ball.x, this.ball.y)
      : null;
    if (!outfield || outfield.team !== territory.team) {
      this.looseOutfieldRecoveryTimer = 0;
      this.looseOutfieldTotalTimer = 0;
      this.lastLooseOutfieldBallPosition = null;
      this.lastLooseOutfieldReceiverDistance = Infinity;
      return;
    }
    this.looseOutfieldTotalTimer += delta;

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

    const recoveryTimedOut = (
      this.looseOutfieldRecoveryTimer >= 1.2 ||
      this.looseOutfieldTotalTimer >= 3
    );
    if (!beyondSide && !beyondBottom && !beyondTop && !rollingFarAway && !outsideScreen && !recoveryTimedOut) return;

    const area = this.getTeamOutfieldArea(receiver.team);
    const point = this.clampPointToArea({ x: this.ball.x, y: this.ball.y }, area, receiver.radius);
    receiver.x = point.x;
    receiver.y = point.y;
    this.ball.pickUp(receiver);
    this.setControlledMember(receiver.team, receiver);
    this.looseOutfieldRecoveryTimer = 0;
    this.looseOutfieldTotalTimer = 0;
    this.lastLooseOutfieldBallPosition = null;
    this.lastLooseOutfieldReceiverDistance = Infinity;
    this.spawnEffect(receiver.x, receiver.y - 58, "#ffffff", "catch");
  }

  recoverStuckLooseBall(delta = 0) {
    if (this.ball.owner || this.ball.isFlying || !this.ball.isLoose) {
      this.looseBallRecoveryTimer = 0;
      return;
    }

    const speed = Math.hypot(this.ball.vx, this.ball.vy);
    const settled = this.ball.hasBounced && speed < 38 && this.ball.z <= 28;
    if (!settled) {
      this.looseBallRecoveryTimer = 0;
      return;
    }

    const candidates = this.players
      .filter((member) => {
        if (member.defeated || member.downTimer > 0 || member.stunTimer > 0 || member.hitRecoveryTimer > 0) return false;
        if (member.dodgeTimer > 0) return false;
        if (member.pickupLockTimer > 0) return false;
        return this.canPlayerAcquireBallAt(member, this.ball.x, this.ball.y);
      })
      .map((member) => ({
        member,
        distance: Math.hypot(member.x - this.ball.x, member.y - this.ball.y),
        canStandAtBall: this.isPointInsideArea(this.ball.x, this.ball.y, member.radius, this.getMoveArea(member, false))
      }))
      .sort((a, b) => a.distance - b.distance);

    const receiver = candidates[0]?.member || null;
    if (!receiver) {
      this.looseBallRecoveryTimer = 0;
      return;
    }

    const unreachable = candidates[0].distance > GAME_CONFIG.battle.rollingPickupDistance * 0.95 || !candidates[0].canStandAtBall;
    this.looseBallRecoveryTimer = unreachable ? this.looseBallRecoveryTimer + delta : 0;
    if (this.looseBallRecoveryTimer < 0.85) return;

    const area = this.getMoveArea(receiver, false);
    const point = this.clampPointToArea({ x: this.ball.x, y: this.ball.y }, area, receiver.radius);
    receiver.x = point.x;
    receiver.y = point.y;
    receiver.vx = 0;
    receiver.vy = 0;
    this.ball.pickUp(receiver);
    this.setControlledMember(receiver.team, receiver);
    this.looseBallRecoveryTimer = 0;
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
    // 内野の球を外野の強制回収対象にしない。
    if (
      this.isPointInsideArea(x, y, 0, this.areas.leftInner) ||
      this.isPointInsideArea(x, y, 0, this.areas.rightInner)
    ) {
      return null;
    }

    const candidates = [
      { team: "left", side: "right", zones: ["rightTopOut", "rightBottomOut", "rightSideOut"] },
      { team: "right", side: "left", zones: ["leftTopOut", "leftBottomOut", "leftSideOut"] }
    ];

    for (const candidate of candidates) {
      const area = this.getTeamOutfieldArea(candidate.team);
      if (this.isPointInsideArea(x, y, 0, area)) {
        return candidate;
      }
    }

    // 内野以外へ出た球は、距離にかかわらず最寄りの外野へ帰属させる。
    let nearest = null;
    let nearestDistance = Infinity;
    for (const candidate of candidates) {
      const area = this.getTeamOutfieldArea(candidate.team);
      const point = this.clampPointToArea({ x, y }, area, 0);
      const distance = Math.hypot(x - point.x, y - point.y);
      if (distance < nearestDistance) {
        nearest = candidate;
        nearestDistance = distance;
      }
    }
    return nearest;
  }

  findNearestOutfielder(team, x, y) {
    const members = (team === "left" ? this.leftTeam : this.rightTeam).filter((p) => (
      p.role === "out" && !p.defeated && p.hitRecoveryTimer <= 0
    ));
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

  startChargedThrow(actor, kind, playerIndex = 1, specialRequested = false) {
    if (this.pendingThrow || this.chargingThrow || this.ball.owner !== actor || actor.defeated || actor.hitRecoveryTimer > 0 || actor.throwLockTimer > 0) return false;
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
      specialRequested: kind === "shoot" && specialRequested && this.canUseSpiritSpecial(actor),
      aerialCombo: kind === "shoot" && actor.jumpZ > 0 && actor.aerialPassCatchTimer > 0
    };
    actor.markThrowing(0.5 * this.getThrowWindupScale(actor), kind);
    return true;
  }

  startCounterThrow(actor, playerIndex = 0, ignoreStamina = false) {
    if (
      this.pendingThrow ||
      this.chargingThrow ||
      this.ball.owner !== actor ||
      actor.defeated ||
      actor.hitRecoveryTimer > 0 ||
      !actor.canCounterThrow()
    ) return false;
    const target = this.getCounterTarget(actor, playerIndex);
    if (!target) return false;
    if (
      !ignoreStamina &&
      !actor.consumeStamina(COUNTER_CONFIG.staminaCost, GAME_CONFIG.battle.stamina.recoveryDelay)
    ) return false;

    const aim = this.normalizedVector(target.x - actor.x, target.y - actor.y);
    const galeCounter = this.isBravesMartialArtist(actor);
    const sourceDamage = actor.counterSourceDamage;
    const counterChainCount = actor.counterChainCount || 0;
    const counterDamage = sourceDamage * (galeCounter ? 2 : COUNTER_CONFIG.damageScale) / SHOT_DAMAGE_SCALE;
    const counterIntensity = (actor.counterVisualIntensity || 1) * (galeCounter ? 1.25 : 1);
    const windupScale = this.getThrowWindupScale(actor);
    actor.clearCounterOpportunity();
    actor.counterThrowTimer = 0.34;
    actor.counterThrowIntensity = counterIntensity;
    this.pendingThrow = {
      actor,
      target,
      kind: "shoot",
      aim,
      shotMultiplier: 1,
      specialType: null,
      counter: true,
      counterDamage,
      counterIntensity,
      counterChainCount,
      galeCounter,
      timer: COUNTER_CONFIG.releaseDelay * windupScale
    };
    actor.markThrowing(0.34 * windupScale, "shoot");
    actor.throwLockTimer = Math.max(actor.throwLockTimer, 0.34 * windupScale);
    this.setControlledMember(target.team, target);
    this.setAutoSwitchCooldown(target.team, 0.28);
    return true;
  }

  startQuickShot(actor, playerIndex = 0) {
    if (
      this.pendingThrow ||
      this.chargingThrow ||
      this.ball.owner !== actor ||
      actor.defeated ||
      actor.hitRecoveryTimer > 0 ||
      actor.quickShotReadyTimer <= 0
    ) return false;
    if (!actor.consumeStamina(
      GAME_CONFIG.battle.stamina.shootCost,
      GAME_CONFIG.battle.stamina.recoveryDelay
    )) return false;

    const selection = playerIndex > 0
      ? this.getShootSelection(actor, playerIndex)
      : this.getCpuShootSelection(actor);
    const target = selection.target;
    const aim = target
      ? this.normalizedVector(target.x - actor.x, target.y - 38 - actor.y)
      : selection.aim || { x: actor.team === "left" ? 1 : -1, y: 0 };
    actor.quickShotReadyTimer = 0;
    const windupScale = this.getThrowWindupScale(actor);
    this.pendingThrow = {
      actor,
      target,
      kind: "shoot",
      aim,
      shotMultiplier: QUICK_SHOT_CONFIG.damageScale,
      specialType: null,
      quickShot: true,
      timer: QUICK_SHOT_CONFIG.windupTime * windupScale
    };
    const quickThrowDuration = (QUICK_SHOT_CONFIG.windupTime + 0.18) * windupScale;
    actor.markThrowing(quickThrowDuration, "shoot");
    actor.throwLockTimer = Math.max(actor.throwLockTimer, quickThrowDuration);
    if (target && target.team !== actor.team) {
      this.setControlledMember(target.team, target);
      this.setAutoSwitchCooldown(target.team, 0.3);
    }
    return true;
  }

  getCounterTarget(actor, playerIndex = 0) {
    const savedTarget = actor.counterTarget;
    if (savedTarget && savedTarget.role === "inner" && !savedTarget.defeated) {
      return savedTarget;
    }

    const enemies = actor.team === "left" ? this.rightTeam : this.leftTeam;
    const innerTargets = enemies.filter((member) => !member.defeated && member.role === "inner");
    if (innerTargets.length === 0) return null;

    let aim = null;
    if (playerIndex > 0) {
      const input = this.input.getCurrent(playerIndex);
      if (Math.hypot(input.moveX, input.moveY) >= 0.35) {
        aim = this.normalizedVector(input.moveX, input.moveY);
      }
    }
    if (!aim && savedTarget) {
      aim = this.normalizedVector(savedTarget.x - actor.x, savedTarget.y - actor.y);
    }
    if (!aim) {
      aim = { x: actor.team === "left" ? 1 : -1, y: 0 };
    }

    return this.findDirectionalTarget(actor, innerTargets, aim, "shoot")
      || this.getNearestFrom(actor, innerTargets);
  }

  startCpuChargedShoot(actor, chargeTime = 1, releaseMode = "time", specialRequested = true) {
    if (this.pendingThrow || this.chargingThrow || this.ball.owner !== actor || actor.defeated || actor.hitRecoveryTimer > 0 || actor.throwLockTimer > 0) return false;

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
      specialRequested: specialRequested && this.canUseSpiritSpecial(actor),
      cpuReleaseTime: Math.max(0.35, Math.min(MAX_SHOT_CHARGE_TIME, chargeTime)),
      cpuReleaseMode: releaseMode,
      aerialCombo: actor.jumpZ > 0 && actor.aerialPassCatchTimer > 0
    };
    actor.markThrowing(0.5 * this.getThrowWindupScale(actor), "shoot");
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
    const windupScale = this.getThrowWindupScale(actor);
    const multiplier = kind === "shoot"
      ? this.getShotMultiplier(actor, charged.aim, chargeRatio, charged.aerialCombo)
      : 1 + chargeRatio * 0.85;
    actor.throwLockTimer = Math.max(actor.throwLockTimer, (kind === "shoot" ? 0.3 : 0.18) * windupScale);
    actor.markThrowing((kind === "shoot" ? 0.32 : 0.22) * windupScale, kind);
    const specialType = kind === "shoot" && charged.specialRequested ? this.getSpecialShotType(actor) : null;
    const remainingWindup = kind === "shoot"
      ? Math.max(0, SHOT_WINDUP_TIME * windupScale - charged.chargeTime)
      : 0;
    const releaseDelay = remainingWindup + (specialType ? this.getSpecialAnticipationTime(specialType) : 0);
    if (releaseDelay > 0) {
      this.pendingThrow = {
        actor,
        target: charged.target,
        kind,
        aim: charged.aim,
        shotMultiplier: multiplier,
        specialType,
        specialRequested: Boolean(specialType),
        timer: releaseDelay,
        anticipation: Boolean(specialType),
        aerialCombo: charged.aerialCombo
      };
      actor.markThrowing(releaseDelay + 0.18 * windupScale, kind);
      actor.throwLockTimer = Math.max(actor.throwLockTimer, releaseDelay + 0.06 * windupScale);
      if (specialType === "arcanaSphere") {
        actor.arcanaAnticipation = true;
      }
      return true;
    }
    if (this.isSupportSpecialShot(specialType)) {
      this.consumeSpirit(actor.team);
      this.applySupportSpecial(actor, specialType);
      this.addSpiritForShotFire({ actor, kind, specialType, shotMultiplier: multiplier, aerialCombo: charged.aerialCombo });
      this.playSound("special");
      if (kind === "shoot") this.showShotMultiplier(multiplier, actor, specialType);
      return true;
    }
    this.updateHeroBondIntensityFor(actor);
    if (this.ball.launch(actor, charged.target, kind, charged.aim, multiplier, specialType)) {
      if (specialType) this.consumeSpirit(actor.team);
      this.addSpiritForShotFire({ actor, kind, specialType, shotMultiplier: multiplier, aerialCombo: charged.aerialCombo });
      this.playThrowSound(kind, specialType, false);
      if (kind === "shoot") this.showShotMultiplier(multiplier, actor, specialType);
      if (kind === "pass" && this.isShiningPassActor(actor)) {
        this.spawnEffect(actor.x + actor.facing * 46, actor.y - actor.jumpZ - 66, "#fff4a8", "shiningPassBow", 1.05);
      }
      if (kind === "shoot" && this.isWitchSparkShotBall(this.ball)) {
        this.spawnEffect(actor.x + actor.facing * 32, actor.y - actor.jumpZ - 74, "#d8b6ff", "witchSparkLaunch", 1);
      }
      this.spawnEffect(
        actor.x + actor.facing * 40,
        actor.y - 48 - actor.jumpZ,
        specialType ? "#66f6ff" : this.ball.demonShot ? "#5a0636" : charged.aerialCombo ? "#66f6ff" : kind === "shoot" ? "#ffe46a" : "#ffffff",
        specialType ? "special" : this.ball.demonShot ? "maouLaunch" : charged.aerialCombo ? "special" : kind
      );
      if (specialType === "hellfire") {
        this.startHellfireFlash(0.36);
        this.startScreenShake(12, 0.12);
      }
      this.playBraversSpecialLaunchEffect(actor, specialType);
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

  launchFromAi(actor, kind, candidates, specialRequested = true) {
    if (kind === "shoot") {
      const selection = this.getCpuShootSelection(actor);
      return this.queueThrow(actor, selection.target, kind, selection.aim, true, specialRequested);
    }

    const target = this.getCpuPassTarget(actor);
    const aim = target
      ? this.normalizedVector(target.x - actor.x, target.y - actor.y)
      : this.getDefaultShootAim(actor, actor.team === "left" ? this.rightTeam : this.leftTeam);
    return this.queueThrow(actor, target, kind, aim, true);
  }

  queueThrow(actor, target, kind, aim, ignoreStamina = false, specialRequested = false) {
    if (this.pendingThrow || this.chargingThrow || this.ball.owner !== actor || actor.defeated || actor.hitRecoveryTimer > 0) return false;
    if (!target && kind !== "shoot") return false;
    if (kind === "shoot" && !ignoreStamina && !actor.consumeStamina(
      GAME_CONFIG.battle.stamina.shootCost,
      GAME_CONFIG.battle.stamina.recoveryDelay
    )) return false;

    const shotAim = kind === "shoot" ? this.getShotAim(actor, target, aim) : null;
    const windupScale = this.getThrowWindupScale(actor);
    this.pendingThrow = {
      actor,
      target,
      kind,
      aim: shotAim || { x: aim.x, y: aim.y },
      shotMultiplier: kind === "shoot" ? this.getShotMultiplier(actor, shotAim) : 1,
      specialType: null,
      specialRequested: kind === "shoot" && specialRequested && this.canUseSpiritSpecial(actor),
      devilTrianglePass: kind === "pass" && Boolean(actor.cpuDevilTrianglePass),
      anticipation: false,
      timer: kind === "shoot" ? SHOT_WINDUP_TIME * windupScale : 0.2 * windupScale
    };
    if (kind === "pass") actor.cpuDevilTrianglePass = false;
    if (kind === "shoot") {
      this.pendingThrow.specialType = specialRequested ? this.getSpecialShotType(actor) : null;
      if (this.pendingThrow.specialType) {
        this.pendingThrow.timer += this.getSpecialAnticipationTime(this.pendingThrow.specialType);
        this.pendingThrow.anticipation = true;
        if (this.pendingThrow.specialType === "clockStop") {
          actor.clockStopAnticipation = true;
        }
        if (this.pendingThrow.specialType === "arcanaSphere") {
          actor.arcanaAnticipation = true;
        }
      }
    }
    const throwDuration = kind === "shoot"
      ? this.pendingThrow.timer + 0.3 * windupScale
      : 0.4 * windupScale;
    actor.markThrowing(throwDuration, kind);
    actor.throwLockTimer = Math.max(actor.throwLockTimer, throwDuration);

    if (kind === "shoot" && target && target.team !== actor.team) {
      const supportSpecial = this.isSupportSpecialShot(this.pendingThrow.specialType);
      if (!supportSpecial) {
        this.setControlledMember(target.team, target);
        this.setAutoSwitchCooldown(target.team, 0.4);
        this.spawnEffect(target.x, target.y - 72, "#ffffff", "catch");
      }
    }
    return true;
  }

  updatePendingThrow(delta) {
    if (!this.pendingThrow) return;

    const pending = this.pendingThrow;
    if (pending.actor.defeated || pending.actor.hitRecoveryTimer > 0 || this.ball.owner !== pending.actor) {
      pending.actor.clockStopAnticipation = false;
      pending.actor.arcanaAnticipation = false;
      this.pendingThrow = null;
      return;
    }

    pending.timer -= delta;
    if (pending.timer > 0) return;

    this.pendingThrow = null;
    pending.actor.clockStopAnticipation = false;
    pending.actor.arcanaAnticipation = false;
    const specialType = pending.counter || pending.quickShot
      ? null
      : pending.kind === "shoot"
      ? pending.specialType
      : null;
    const launchTarget = pending.quickShot ? null : pending.target;
    const launchMultiplier = pending.quickShot ? 1 : pending.shotMultiplier;
    if (pending.devilTrianglePass) {
      pending.actor.cpuDevilTrianglePass = true;
    }
    if (this.isSupportSpecialShot(specialType)) {
      this.consumeSpirit(pending.actor.team);
      this.applySupportSpecial(pending.actor, specialType);
      this.addSpiritForShotFire(pending);
      this.playSound("special");
      if (pending.kind === "shoot") this.showShotMultiplier(pending.shotMultiplier, pending.actor, specialType);
      return;
    }
    this.updateHeroBondIntensityFor(pending.actor);
    if (this.ball.launch(pending.actor, launchTarget, pending.kind, pending.aim, launchMultiplier, specialType)) {
      if (!specialType) this.addSpiritForShotFire(pending);
      this.playThrowSound(pending.kind, specialType, Boolean(pending.counter));
      if (pending.devilTrianglePass) {
        this.ball.devilTrianglePass = true;
      }
      if (pending.kind === "pass" && this.isShiningPassActor(pending.actor)) {
        this.spawnEffect(pending.actor.x + pending.actor.facing * 46, pending.actor.y - pending.actor.jumpZ - 66, "#fff4a8", "shiningPassBow", 1.05);
      }
      if (pending.kind === "shoot" && this.isWitchSparkShotBall(this.ball)) {
        this.spawnEffect(pending.actor.x + pending.actor.facing * 32, pending.actor.y - pending.actor.jumpZ - 74, "#d8b6ff", "witchSparkLaunch", 1);
      }
      if (pending.counter) {
        const targetX = pending.target?.x ?? this.ball.x + pending.aim.x * 900;
        const targetY = pending.target ? pending.target.y - 38 : this.ball.y + pending.aim.y * 900;
        const dx = targetX - this.ball.x;
        const dy = targetY - this.ball.y;
        const length = Math.hypot(dx, dy) || 1;
        const speed = GAME_CONFIG.ball.shootSpeed * COUNTER_CONFIG.speedScale * (pending.galeCounter ? 1.18 : 1);
        const aerialCounter = pending.actor.jumpZ > 20;
        this.ball.vx = dx / length * speed;
        this.ball.vy = dy / length * speed;
        if (aerialCounter) {
          const flightTime = Math.max(0.16, length / Math.max(1, speed));
          const targetZ = pending.target ? (pending.target.jumpZ || 0) + 40 : this.ball.z;
          this.ball.vz = Math.max(
            -260,
            Math.min(
              420,
              (targetZ - this.ball.z + 0.5 * GAME_CONFIG.ball.gravity * flightTime * flightTime) / flightTime
            )
          );
        } else {
          this.ball.z = Math.min(62, this.ball.z);
          this.ball.vz = 0;
        }
        this.ball.power = pending.counterDamage;
        this.ball.shotMultiplier = COUNTER_CONFIG.speedScale;
        this.ball.counterShot = true;
        this.ball.galeCounter = Boolean(pending.galeCounter);
        this.ball.counterChainCount = pending.counterChainCount || 0;
        this.ball.radius = this.ball.baseRadius * 1.5;
        this.ball.counterFlightZ = this.ball.z;
        this.ball.counterIntensity = pending.counterIntensity || 1;
        this.spawnEffect(
          pending.actor.x + pending.actor.facing * 42,
          pending.actor.y - 52,
          "#8ffcff",
          "counterLaunch",
          pending.counterIntensity || 1
        );
        if (pending.galeCounter) {
          this.spawnEffect(
            pending.actor.x + pending.actor.facing * 52,
            pending.actor.y - pending.actor.jumpZ - 68,
            "#dffcff",
            "galeCounterLaunch",
            pending.counterIntensity || 1.2
          );
        }
        this.startScreenShake(7 + (pending.counterIntensity || 1) * 2, 0.1);
        this.spawnCatchResultLabel(pending.actor, pending.galeCounter ? "疾風連撃!" : "COUNTER!", pending.galeCounter ? "#dffcff" : "#fff36a");
        return;
      }
      if (pending.quickShot) {
        this.ball.target = pending.target;
        this.ball.vx *= QUICK_SHOT_CONFIG.speedScale;
        this.ball.vy *= QUICK_SHOT_CONFIG.speedScale;
        this.ball.z = Math.min(62, this.ball.z);
        this.ball.vz = 0;
        this.ball.power = (pending.actor.getEffectiveThrowPower?.() ?? pending.actor.throwPower) * QUICK_SHOT_CONFIG.damageScale;
        this.ball.shotMultiplier = QUICK_SHOT_CONFIG.damageScale;
        this.ball.quickShot = true;
        this.ball.quickFlightZ = this.ball.z;
        this.spawnEffect(pending.actor.x + pending.actor.facing * 40, pending.actor.y - 48, "#fff27a", "shoot");
        this.spawnCatchResultLabel(pending.actor, "QUICK!", "#fff27a");
        return;
      }
      if (specialType) {
        this.consumeSpirit(pending.actor.team);
        this.addSpiritForShotFire(pending);
      }
      if (specialType === "triple") this.spawnTripleDummyBalls(pending.actor, pending.aim, pending.shotMultiplier);
      if (pending.kind === "shoot") this.showShotMultiplier(pending.shotMultiplier, pending.actor, specialType);
      if (specialType === "hellfire") {
        this.startHellfireFlash(0.36);
        this.startScreenShake(12, 0.12);
      }
      this.playBraversSpecialLaunchEffect(pending.actor, specialType);
      this.spawnEffect(
        pending.actor.x + pending.actor.facing * 40,
        pending.actor.y - 48,
        specialType ? this.getSpecialHitColor(specialType) : this.ball.demonShot ? "#5a0636" : pending.kind === "shoot" ? "#ffe46a" : "#ffffff",
        specialType ? "special" : this.ball.demonShot ? "maouLaunch" : pending.kind
      );
    }
  }

  updateChargingThrow(delta) {
    if (!this.chargingThrow) return;

    const charged = this.chargingThrow;
    if (charged.actor.defeated || charged.actor.hitRecoveryTimer > 0 || this.ball.owner !== charged.actor) {
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
    } else {
      const selection = this.getPassSelection(charged.actor, charged.playerIndex);
      charged.target = selection.target;
      charged.aim = selection.aim;
    }

    charged.actor.markThrowing(0.42 * this.getThrowWindupScale(charged.actor), charged.kind);
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
    if (actor.cpuProfile === "zenmaiGears") {
      const target = this.getZenmaiShootTarget(actor, enemies);
      if (target) {
        return {
          target,
          aim: this.normalizedVector(target.x - actor.x, target.y - 38 - actor.y)
        };
      }
    }
    const aim = this.getDefaultShootAim(actor, enemies);
    return {
      target: this.findShootTargetInAim(actor, enemies, aim),
      aim
    };
  }

  getZenmaiShootTarget(actor, enemies) {
    const alive = enemies.filter((target) => !target.defeated && target.role === "inner");
    let best = null;
    let bestScore = -Infinity;
    for (const target of alive) {
      const dx = actor.x - target.x;
      const dy = actor.y - target.y;
      const horizontal = Math.abs(dx) >= Math.abs(dy);
      let exposure = 0;
      if (horizontal) {
        const facingActor = target.facing === Math.sign(dx || 1);
        exposure = facingActor ? 0 : 2;
      } else {
        const expectedDirection = dy < 0 ? "up" : "down";
        exposure = target.visualDirection === expectedDirection ? 0 : 2;
      }
      if (
        (horizontal && (target.visualDirection === "up" || target.visualDirection === "down")) ||
        (!horizontal && target.visualDirection !== "up" && target.visualDirection !== "down")
      ) {
        exposure = Math.max(exposure, 1);
      }
      const distance = Math.hypot(dx, dy);
      const hpRatio = target.hp / Math.max(1, target.maxHp);
      const score = exposure * 4.5 + (1 - hpRatio) * 1.4 - distance * 0.0005;
      if (score > bestScore) {
        best = target;
        bestScore = score;
      }
    }
    return best;
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

  getSpecialShotType(actor) {
    if (actor.specialShotType === "none") return null;
    if (actor.specialShotType) return actor.specialShotType;
    if (actor.characterType === "witch" || actor.uniformEmblem === "witch") return "arcanaSphere";
    if (actor.characterType === "mage") return "soul";
    if (actor.characterType === "jump") return "boost";
    if (actor.characterType === "alien") return "ufoSpin";
    if (actor.characterType === "power") return "iron";
    if (actor.characterType === "speed") return "boomerang";
    return "lightning";
  }

  getSpecialAnticipationTime(specialType) {
    return SPECIAL_SHOT_ANTICIPATION_TIMES[specialType] ?? SPECIAL_SHOT_ANTICIPATION_TIME;
  }

  isBravesMartialArtist(player) {
    return player?.uniformEmblem === "braves-martialArtist";
  }

  getMartialArtistQigongShotDamageScale(travelDistance = 0) {
    const distance = Math.max(0, travelDistance || 0);
    if (distance < MARTIAL_ARTIST_QIGONG_SHOT_CONFIG.closeDistance) {
      return MARTIAL_ARTIST_QIGONG_SHOT_CONFIG.closeDamageScale;
    }
    if (distance < MARTIAL_ARTIST_QIGONG_SHOT_CONFIG.midDistance) {
      return MARTIAL_ARTIST_QIGONG_SHOT_CONFIG.midDamageScale;
    }
    return 1;
  }

  getMartialArtistSpecialCatchScale(catcher) {
    return (
      this.isBravesMartialArtist(catcher) &&
      this.ball?.isFlying &&
      this.ball.kind === "shoot" &&
      this.ball.specialShotType &&
      this.ball.thrower &&
      this.ball.thrower.team !== catcher.team
    ) ? 1.3 : 1;
  }

  canUseSpiritSpecial(actor) {
    if (!actor || actor.role === "out" || !this.hasFullSpirit(actor.team)) return false;
    const specialType = this.getSpecialShotType(actor);
    if (specialType === "grandHeal" && (actor.grandHealCooldownTimer || 0) > 0) return false;
    return true;
  }

  getThrowWindupScale(actor) {
    return actor?.isRobotOverdrive?.() ? ROBOT_OVERDRIVE_CONFIG.windupTimeScale : 1;
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

    const preferredTargetId = actor.cpuPreferredPassTargetId;
    actor.cpuPreferredPassTargetId = null;
    if (preferredTargetId) {
      const preferredTarget = candidates.find((candidate) => candidate.id === preferredTargetId);
      if (preferredTarget) return preferredTarget;
    }

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

    if (actor.cpuProfile === "hinomaruBombers" && actor.role === "inner" && this.hasFullSpirit(actor.team)) {
      const specialShooters = candidates.filter(
        (p) => (p.name === "だいち" || p.name === "しょう") && p.role === "inner" && p.hp > 0
      );
      if (specialShooters.length > 0 && Math.random() < 0.86) {
        if (specialShooters.length === 1) return specialShooters[0];
        return Math.random() < 0.55
          ? specialShooters.find((p) => p.name === "だいち") || specialShooters[0]
          : specialShooters.find((p) => p.name === "しょう") || specialShooters[0];
      }
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
    if (target.hitRecoveryTimer > 0) return;
    if (target.dodgeTimer > 0 || target.pickupLockTimer > 0) return;
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
      if (!this.canPlayerAcquireBallAt(target, this.ball.x, this.ball.y)) return;
      const passingTeam = this.ball.thrower?.team;
      if (target.jumpZ > 18) {
        target.aerialPassCatchTimer = 1.1;
      }
      target.passChainBlockTimer = 1.4;
      target.startCatch(0.34);
      this.ball.pickUp(target);
      this.playSound("catch", { cooldown: AUDIO_CONFIG.catchCooldown });
      this.addSpirit(passingTeam, GAME_CONFIG.battle.spiritPassGain);
      target.quickShotReadyTimer = QUICK_SHOT_CONFIG.windowDuration;
      if (target.cpuControlled) {
        target.setPostPassAction?.("shoot", 2.2, {
          aerial: target.jumpZ > 18,
          source: "passReceive"
        });
      }
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
      if (catcher.defeated || catcher.hitRecoveryTimer > 0 || catcher.catchTimer <= 0 || catcher === this.ball.thrower) continue;
      if (catcher.dodgeTimer > 0) continue;
      const friendly = catcher.team === this.ball.thrower.team;
      if (friendly && this.ball.kind === "shoot") continue;
      if (!friendly && this.ball.kind === "shoot" && catcher !== this.ball.target) continue;
      if (friendly && (this.ball.specialShotType === "boomerang" || this.ball.specialShotType === "devilShield")) continue;
      if (!this.canPlayerAcquireBallAt(catcher, this.ball.x, this.ball.y)) continue;
      const box = this.getCatchArea(catcher, friendly);
      if (!this.circleRectOverlap(this.ball.x, this.ball.y - this.ball.z, this.ball.radius, box)) continue;
      if (!friendly && this.ball.kind === "pass" && this.ball.devilTrianglePass && Math.random() >= 0.05) {
        catcher.catchTimer = 0;
        this.spawnCatchResultLabel(catcher, "MISS", "#ff4d8d");
        continue;
      }
      const catchResult = this.getManualCatchResult(catcher, friendly);
      if (catchResult === "wait") continue;
      if (catchResult === "miss") {
        this.applyCatchMissPenalty(catcher);
        catcher.catchTimer = 0;
        this.spawnCatchResultLabel(catcher, "MISS", "#ff806f");
        if (!friendly) this.recordShotDefenseDebug({ player: catcher, action: "キャッチ", result: "MISS" });
        continue;
      }
      const caughtFriendlyPassInAir = friendly && this.ball.kind === "pass" && catcher.jumpZ > 18;
      const caughtFriendlyPass = friendly && this.ball.kind === "pass";
      const cutEnemyPass = !friendly && this.ball.kind === "pass";
      const caughtEnemyShot = !friendly && this.ball.kind === "shoot";
      const throwingTeam = this.ball.thrower.team;
      const caughtShotDamage = caughtEnemyShot
        ? this.getSpecialShotDamage(this.ball.power, this.ball.specialShotType, this.ball.travelDistance)
        : 0;
      const caughtThrower = this.ball.thrower;
      const counterTarget = caughtEnemyShot ? this.ball.thrower : null;
      const caughtIronShot = caughtEnemyShot && this.ball.specialShotType === "iron";
      const caughtArcanaShot = caughtEnemyShot && this.ball.specialShotType === "arcanaSphere";
      const caughtBloodDrainShot = caughtEnemyShot && this.ball.specialShotType === "bloodDrain";
      const caughtVampireNormalShot = caughtEnemyShot && !this.ball.specialShotType && this.isVampirePlayer(caughtThrower);
      const caughtArcanaCharge = caughtArcanaShot ? this.getArcanaSphereChargeRate(this.ball.travelDistance) : 0;
      const arcanaDirection = caughtArcanaShot ? (this.ball.vx >= 0 ? 1 : -1) : 0;
      const ironDirection = caughtIronShot ? (this.ball.vx >= 0 ? 1 : -1) : 0;
      const ironVerticalDirection = caughtIronShot ? (this.ball.vy >= 0 ? 1 : -1) : 0;
      const counterChainCount = caughtEnemyShot && this.ball.counterShot ? (this.ball.counterChainCount || 0) + 1 : 0;
      this.ball.pickUp(catcher);
      this.playSound("catch", { cooldown: AUDIO_CONFIG.catchCooldown });
      if (caughtFriendlyPass) {
        this.addSpirit(throwingTeam, GAME_CONFIG.battle.spiritPassGain);
        catcher.quickShotReadyTimer = QUICK_SHOT_CONFIG.windowDuration;
        catcher.passChainBlockTimer = 1.4;
        if (catcher.cpuControlled) {
          catcher.setPostPassAction?.("shoot", 2.2, {
            aerial: caughtFriendlyPassInAir,
            source: "manualPassCatch"
          });
        }
      }
      if (cutEnemyPass) {
        this.addSpirit(catcher.team, GAME_CONFIG.battle.spiritPassCutGain);
      }
      if (caughtFriendlyPassInAir) {
        catcher.aerialPassCatchTimer = 1.1;
      }
      if (caughtEnemyShot) {
        this.addSpirit(catcher.team, GAME_CONFIG.battle.spiritCatchGain);
        catcher.startCatchSuccess();
        this.recordShotDefenseDebug({ player: catcher, action: "キャッチ", result: "成功" });
        if (this.isVampirePlayer(catcher)) {
          this.healPlayer(catcher, BLOOD_DRAIN_CONFIG.catchHeal, "#ff5a75");
        }
        if (caughtBloodDrainShot && this.isVampirePlayer(caughtThrower)) {
          this.applyVampireDrain(caughtThrower, caughtShotDamage / 3, "bloodDrain", catcher);
          this.spawnEffect(catcher.x, catcher.y - catcher.jumpZ - 66, "#ff5a75", "special", 0.62);
        }
        if (caughtVampireNormalShot) {
          this.healPlayer(caughtThrower, caughtShotDamage * BLOOD_DRAIN_CONFIG.normalCatchDrainRatio, "#ff5a75");
          this.spawnBloodDrainLink(catcher, caughtThrower, "#ff6f8f", 0.58);
          this.spawnEffect(catcher.x, catcher.y - catcher.jumpZ - 58, "#ff6f8f", "special", 0.48);
        }
        catcher.startCounterOpportunity(caughtShotDamage, counterTarget, COUNTER_CONFIG, counterChainCount);
        if (caughtIronShot) {
          catcher.knockbackX += ironDirection * GAME_CONFIG.battle.knockbackSpeed * 2.2;
          catcher.knockbackY += ironVerticalDirection * GAME_CONFIG.battle.knockbackSpeed * 0.55;
        }
        if (caughtArcanaShot && caughtArcanaCharge > 0.55) {
          catcher.knockbackX += arcanaDirection * GAME_CONFIG.battle.knockbackSpeed * (0.35 + caughtArcanaCharge * 0.45);
          catcher.drainStamina?.(5 + caughtArcanaCharge * 10, GAME_CONFIG.battle.stamina.recoveryDelay * 0.6);
          this.spawnEffect(catcher.x, catcher.y - catcher.jumpZ - 72, "#d8b6ff", "arcanaImpact", 0.45 + caughtArcanaCharge * 0.35);
        }
        if (this.ball.specialShotType === "hellfire") {
          const hpBefore = catcher.hp;
          if (catcher.takeBurnDamage?.(HELLFIRE_CONFIG.catchDamage, GAME_CONFIG.battle)) {
            this.addSpiritForDamage(catcher.team, hpBefore, catcher.hp);
            this.spawnDamageNumber(catcher, HELLFIRE_CONFIG.catchDamage);
          }
          if (catcher.hp <= 0) {
            this.ball.drop();
          }
          this.spawnEffect(catcher.x, catcher.y - catcher.jumpZ - 66, "#2b0a30", "hellfireImpact", 0.65);
        }
        if (this.ball.specialShotType === "gigaBreak") {
          const braceDirection = this.ball.vx >= 0 ? 1 : -1;
          catcher.knockbackX += braceDirection * GAME_CONFIG.battle.knockbackSpeed * 0.95;
          catcher.knockbackY += (this.ball.vy >= 0 ? 1 : -1) * GAME_CONFIG.battle.knockbackSpeed * 0.16;
          this.spawnEffect(catcher.x, catcher.y + 8, "#d9442e", "gigaBreakCatchBrace", 1);
          this.startScreenShake(16, 0.18);
        }
      }
      catcher.throwLockTimer = 0.2;
      catcher.catchTimer = 0;
      this.setControlledMember(catcher.team, catcher);
      this.spawnEffect(
        catcher.x,
        catcher.y - 55,
        caughtEnemyShot ? "#8fffe8" : "#ffffff",
        caughtEnemyShot ? "counterCatch" : "catch",
        caughtEnemyShot ? Math.max(1, Math.min(2.5, caughtShotDamage / 32)) : 1
      );
      if (caughtEnemyShot) {
        this.counterFreezeTimer = Math.max(this.counterFreezeTimer, 0.06);
        this.startScreenShake(6 + Math.min(5, caughtShotDamage / 24), 0.12);
        this.spawnCatchResultLabel(catcher, "CATCH", "#8fffe8");
      }
    }
  }

  isHeroPlayer(player) {
    return Boolean(player && player.uniformEmblem === "braves-hero");
  }

  isBardPlayer(player) {
    return Boolean(player && player.uniformEmblem === "braves-bard");
  }

  isHeroRoyalStraightBall(ball = this.ball) {
    return Boolean(
      ball?.isFlying &&
      ball.kind === "shoot" &&
      !ball.specialShotType &&
      !ball.counterShot &&
      this.isHeroPlayer(ball.thrower)
    );
  }

  isBardMelodyShotBall(ball = this.ball) {
    return Boolean(
      ball?.isFlying &&
      ball.kind === "shoot" &&
      !ball.specialShotType &&
      !ball.counterShot &&
      this.isBardPlayer(ball.thrower)
    );
  }

  isWitchSparkShotBall(ball = this.ball) {
    return Boolean(
      ball?.isFlying &&
      ball.kind === "shoot" &&
      !ball.specialShotType &&
      !ball.counterShot &&
      ball.witchSparkShot
    );
  }

  getHeroBondIntensity(hero) {
    if (!this.isHeroPlayer(hero)) return 0;
    const team = hero.team === "left" ? this.leftTeam : this.rightTeam;
    const allies = team.filter(member => member && member !== hero);
    if (!allies.length) return 0;

    const totalMaxHp = allies.reduce((sum, member) => sum + Math.max(1, member.maxHp || member.hp || 1), 0);
    if (totalMaxHp <= 0) return 0;

    const missingHp = allies.reduce((sum, member) => {
      const maxHp = Math.max(1, member.maxHp || member.hp || 1);
      if (member.defeated || member.hp <= 0) return sum + maxHp;
      return sum + Math.max(0, maxHp - member.hp);
    }, 0);
    return Math.max(0, Math.min(1, missingHp / totalMaxHp));
  }

  updateHeroBondIntensityFor(actor) {
    if (!actor) return;
    actor.heroBondIntensity = this.getHeroBondIntensity(actor);
  }

  getCatchDifficulty(catcher) {
    const enemyHeroStraight = (
      this.isHeroRoyalStraightBall(this.ball) &&
      this.ball.thrower &&
      this.ball.thrower.team !== catcher.team
    );
    if (enemyHeroStraight) return CATCH_DIFFICULTY.heroStraight;

    const enemyMelodyShot = (
      this.isBardMelodyShotBall(this.ball) &&
      this.ball.thrower &&
      this.ball.thrower.team !== catcher.team
    );
    if (enemyMelodyShot) return CATCH_DIFFICULTY.melodyShot;

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
    const enemyShot = (
      this.ball?.isFlying &&
      this.ball.kind === "shoot" &&
      this.ball.thrower &&
      this.ball.thrower.team !== catcher.team
    );
    if (!enemyShot) return 0.3;

    const difficulty = this.getCatchDifficulty(catcher);
    const baseCatchDurationScale = CATCH_DURATION_SCALE_CONFIG.base;
    const shotCatchDurationScale = CATCH_DURATION_SCALE_CONFIG.shot;
    const specialCatchDurationScale = this.ball.specialShotType ? CATCH_DURATION_SCALE_CONFIG.special : 1;
    if (this.ball.counterShot) {
      return Math.max(
        COUNTER_CONFIG.minCatchDuration * baseCatchDurationScale,
        (COUNTER_CONFIG.catchDuration - (this.ball.counterChainCount || 0) * COUNTER_CONFIG.catchDurationPenaltyPerChain) * baseCatchDurationScale
      );
    }

    const chargeCatchWindowPenalty = difficulty.chargeCatchWindowPenalty || 0;
    const chargeCatchScale = chargeCatchWindowPenalty > 0
      ? 1 - this.getArcanaSphereChargeRate(this.ball.travelDistance) * chargeCatchWindowPenalty
      : 1;
    const baseDuration = (this.ball.quickShot
      ? 0.14
      : difficulty.duration) * chargeCatchScale;
    const techniqueScale = this.getCatchTechniqueWindowScale(catcher.stats?.technique || 5);
    const facingQuality = this.getIncomingFacingQuality(catcher);
    const facingScale = facingQuality === "front" ? 1 : facingQuality === "side" ? 0.55 : 0.2;
    const travelRatio = Math.max(0, Math.min(1, (this.ball.travelDistance || 0) / 850));
    const distanceScale = 0.75 + travelRatio * 0.4;
    const projectedDamage = this.ball.specialShotType
      ? this.getSpecialShotDamage(this.ball.power || 20, this.ball.specialShotType, this.ball.travelDistance)
      : this.ball.power || 20;
    const powerScale = Math.max(0.72, Math.min(1.08, 1.06 - Math.max(0, projectedDamage - 20) * 0.004));

    // 入力時に決まった受付時間内へボールが入れば成功する。乱数は使用しない。
    const victoryScale = catcher.getVictoryMarchCatchScale?.() ?? 1;
    const martialArtistScale = this.getMartialArtistSpecialCatchScale(catcher);
    let cpuCatchSuccessScale = catcher.cpuControlled ? 0.9 : 1;
    if (catcher.cpuControlled && this.ball.specialShotType) cpuCatchSuccessScale *= 0.9;
    const normalShotDistanceCatchScale = this.getNormalShotDistanceCatchScale();
    const durationScale = baseCatchDurationScale * shotCatchDurationScale * specialCatchDurationScale;
    return Math.max(
      0.045 * durationScale,
      Math.min(0.26 * durationScale * normalShotDistanceCatchScale, baseDuration * techniqueScale * facingScale * distanceScale * normalShotDistanceCatchScale * powerScale * victoryScale * martialArtistScale * cpuCatchSuccessScale * durationScale)
    );
  }

  getNormalShotDistanceCatchScale() {
    if (
      !this.ball?.isFlying ||
      this.ball.kind !== "shoot" ||
      this.ball.specialShotType ||
      this.ball.counterShot
    ) {
      return 1;
    }
    const start = NORMAL_SHOT_DISTANCE_CATCH_CONFIG.startDistance;
    const end = NORMAL_SHOT_DISTANCE_CATCH_CONFIG.maxDistance;
    const maxScale = NORMAL_SHOT_DISTANCE_CATCH_CONFIG.maxScale;
    const ratio = Math.max(0, Math.min(1, ((this.ball.travelDistance || 0) - start) / Math.max(1, end - start)));
    return 1 + (maxScale - 1) * ratio;
  }

  getCatchTechniqueWindowScale(technique) {
    const value = Math.max(1, Math.min(20, technique || 5));
    const points = [
      { technique: 1, scale: 0.75 },
      { technique: 5, scale: 0.9 },
      { technique: 7, scale: 1 },
      { technique: 10, scale: 1.12 },
      { technique: 15, scale: 1.3 },
      { technique: 20, scale: 1.45 }
    ];

    for (let index = 1; index < points.length; index += 1) {
      const next = points[index];
      if (value > next.technique) continue;
      const previous = points[index - 1];
      const ratio = (value - previous.technique) / (next.technique - previous.technique);
      return previous.scale + (next.scale - previous.scale) * ratio;
    }

    return points[points.length - 1].scale;
  }

  getManualCatchResult(catcher, friendly) {
    if (this.ball.kind === "pass") {
      return "perfect";
    }

    if (this.ball.kind !== "shoot") {
      return friendly ? "perfect" : "miss";
    }

    if (friendly) return "perfect";
    return "perfect";
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
    if (!isEnemyShot || (!this.ball.specialShotType && !this.isHeroRoyalStraightBall(this.ball) && !this.isBardMelodyShotBall(this.ball))) return area;

    const scale = this.getCatchDifficulty(catcher).areaScale * (catcher.getVictoryMarchCatchScale?.() ?? 1) * this.getMartialArtistSpecialCatchScale(catcher);
    const centerX = area.x + area.w * 0.5;
    const centerY = area.y + area.h * 0.5;
    return {
      x: centerX - area.w * scale * 0.5,
      y: centerY - area.h * scale * 0.5,
      w: area.w * scale,
      h: area.h * scale
    };
  }

  isSuccessfulDodgeOverlap(target, ballX, ballY, ballRadius) {
    if (target.dodgeTimer <= 0) return false;
    const scale = target.lastDrawScale || 1;
    const standingBox = {
      x: target.x - 31 * scale,
      y: target.y - target.jumpZ - 108 * scale,
      w: 62 * scale,
      h: 126 * scale
    };
    return this.circleRectOverlap(ballX, ballY, ballRadius, standingBox);
  }

  isNoDefenseTarget(target) {
    return Boolean(
      target &&
      (target.catchTimer || 0) <= 0 &&
      (target.dodgeTimer || 0) <= 0
    );
  }

  getLateMatchShotDamageScale() {
    const elapsed = this.matchElapsedTime || 0;
    if (elapsed >= LATE_MATCH_PRESSURE_CONFIG.secondDamageTime) {
      return LATE_MATCH_PRESSURE_CONFIG.secondDamageScale;
    }
    if (elapsed >= LATE_MATCH_PRESSURE_CONFIG.firstDamageTime) {
      return LATE_MATCH_PRESSURE_CONFIG.firstDamageScale;
    }
    return 1;
  }

  getNoDamagePressureHitboxScale() {
    return (this.timeSinceLastDamage || 0) >= LATE_MATCH_PRESSURE_CONFIG.noDamageSeconds
      ? LATE_MATCH_PRESSURE_CONFIG.noDamageHitboxScale
      : 1;
  }

  recordShotDamage() {
    this.timeSinceLastDamage = 0;
  }

  getShotHitRadius(shot, target = null) {
    const baseRadius = shot?.radius || 0;
    let radius = shot?.specialShotType ? baseRadius * 1.2 : baseRadius;
    radius *= this.getNoDamagePressureHitboxScale();
    if (!shot || shot.kind !== "shoot" || shot.counterShot || !this.isNoDefenseTarget(target)) {
      return radius;
    }

    if (shot.specialShotType) {
      radius *= NO_DEFENSE_HITBOX_CONFIG.specialScale;
      const ballY = shot.y - (shot.z || 0);
      const distance = Math.hypot((shot.x || 0) - target.x, ballY - target.y);
      if (distance < NO_DEFENSE_HITBOX_CONFIG.closeSpecialDistance) {
        radius *= NO_DEFENSE_HITBOX_CONFIG.closeSpecialScale;
      }
      return radius;
    }

    return radius * NO_DEFENSE_HITBOX_CONFIG.normalScale;
  }

  isPiercingShot(specialType) {
    return false;
  }

  endShotAfterDodge(target) {
    this.ball.isFlying = true;
    this.ball.isLoose = false;
    this.ball.catchable = false;
    this.ball.target = null;
    this.ball.z = Math.max(this.ball.z || 0, 32);
    this.ball.vz = Math.max(this.ball.vz || 0, -10);
    this.ball.dodgePassThroughTimer = 0.52;
    this.ball.hitPlayerIds?.add(target.id);
    for (const member of this.players) {
      if (member.team === target.team) {
        member.pickupLockTimer = Math.max(member.pickupLockTimer || 0, 0.6);
      }
    }
    target.hitRecoveryTimer = Math.max(target.hitRecoveryTimer || 0, GAME_CONFIG.battle.dodgeSuccessRecovery);
    this.spawnEffect(target.x, target.y - target.jumpZ - 64, "#bdf8ff", "dodge");
  }

  completeShieldDevilThrownGuard(protector, target, direction) {
    protector.shieldAlertTimer = Math.max(protector.shieldAlertTimer || 0, 0.9);
    protector.shieldGuardTimer = Math.max(protector.shieldGuardTimer || 0, 0.82);
    this.ball.hitPlayerIds?.add(target.id);
    this.ball.hitPlayerIds?.add(protector.id);
    this.ball.drop();
    this.ball.x = protector.x - direction * Math.min(68, Math.max(34, this.ball.radius * 1.35));
    this.ball.y = protector.y + (Math.random() - 0.5) * 34;
    this.ball.z = Math.max(18, Math.min(58, protector.jumpZ * 0.22 + 20));
    this.ball.vx = -direction * (190 + Math.random() * 80);
    this.ball.vy = (Math.random() - 0.5) * 120;
    this.ball.vz = 120 + Math.random() * 80;
    this.addSpirit(protector.team, GAME_CONFIG.battle.spiritCatchGain);
    this.startScreenShake(22, 0.24);
    this.spawnEffect(protector.x, protector.y - protector.jumpZ - 72, "#9b2cff", "shieldImpact", 1.48);
    this.spawnEffect(protector.x - direction * 34, protector.y - protector.jumpZ - 78, "#fff7a0", "shieldImpact", 0.94);
    this.spawnEffect(target.x, target.y - target.jumpZ - 82, "#fff7a0", "shieldImpact", 0.82);
    this.spawnCatchResultLabel(protector, "GUARD", "#fff7a0");
  }

  resolveArkmaShieldDevilGuard(target, targets, ballY) {
    if (!target?.isDemonStyle?.() || target.uniformEmblem !== "arkmaLord") return null;
    const flightSerial = this.ball.flightSerial || 0;
    if (this.ball.shieldDevilGuardFlight !== flightSerial) {
      this.ball.shieldDevilGuardFlight = flightSerial;
      this.ball.shieldDevilProtectorId = Math.random() < 0.4
        ? targets.find((member) => member.isShieldDevilStyle?.() && !member.defeated && member.role === "inner")?.id || null
        : null;
    }
    const protector = targets.find((member) => member.id === this.ball.shieldDevilProtectorId && !member.defeated && member.hp > 0);
    if (!protector || protector === target || this.ball.hitPlayerIds?.has(protector.id)) return null;

    const direction = this.ball.vx >= 0 ? 1 : -1;
    protector.shieldAlertTimer = Math.max(protector.shieldAlertTimer || 0, 0.72);
    protector.shieldGuardTimer = Math.max(protector.shieldGuardTimer || 0, 0.58);
    protector.x = target.x - direction * 64;
    protector.y = target.y + Math.max(-46, Math.min(46, this.ball.y - target.y));
    protector.jumpZ = 0;
    protector.jumpVelocity = 0;
    protector.facing = -direction;
    protector.clampToArea(this.areas[protector.zone]);

    this.spawnEffect(protector.x, protector.y - 82, "#fff7a0", "shieldImpact", 0.78);
    this.completeShieldDevilThrownGuard(protector, target, direction);
    return "shielded";
  }

  isLeonhardtPlayer(player) {
    return Boolean(player && player.uniformEmblem === "braves-paladin" && player.specialShotType === "holyLance");
  }

  completeGuardianShieldGuard(protector, target, direction, ballY) {
    protector.shieldAlertTimer = Math.max(protector.shieldAlertTimer || 0, 0.68);
    protector.shieldGuardTimer = Math.max(protector.shieldGuardTimer || 0, GUARDIAN_SHIELD_CONFIG.guardTimer);
    protector.facing = -direction;
    protector.visualDirection = direction >= 0 ? "left" : "right";
    this.ball.hitPlayerIds?.add(target.id);
    this.ball.hitPlayerIds?.add(protector.id);
    this.ball.drop();
    this.ball.x = protector.x - direction * Math.min(78, Math.max(42, this.ball.radius * 1.45));
    this.ball.y = protector.y + (Math.random() - 0.5) * 42;
    this.ball.z = Math.max(14, Math.min(54, protector.jumpZ * 0.2 + 18));
    this.ball.vx = -direction * (150 + Math.random() * 70);
    this.ball.vy = (Math.random() - 0.5) * 105;
    this.ball.vz = 95 + Math.random() * 55;
    this.addSpirit(protector.team, GAME_CONFIG.battle.spiritCatchGain * 0.65);
    this.startScreenShake(12, 0.14);
    this.spawnEffect(protector.x - direction * 34, protector.y - protector.jumpZ - 72, "#fff4a8", "shieldImpact", 1.08);
    this.spawnEffect(this.ball.x, ballY, "#ffffff", "shieldImpact", 0.72);
    if (protector !== target) {
      this.spawnEffect(target.x, target.y - target.jumpZ - 76, "#fff4a8", "shieldImpact", 0.48);
    }
    this.spawnCatchResultLabel(protector, "GUARD", "#fff4a8");
  }

  resolveGuardianShieldGuard(target, targets, ballY) {
    if (!target || target.defeated || target.role !== "inner") return false;
    const flightSerial = this.ball.flightSerial || 0;
    if (this.ball.guardianShieldFlight !== flightSerial) {
      this.ball.guardianShieldFlight = flightSerial;
      this.ball.guardianShieldProtectorId = null;
      const special = Boolean(this.ball.specialShotType);
      const chance = this.ball.counterShot
        ? GUARDIAN_SHIELD_CONFIG.counterChance
        : special
          ? GUARDIAN_SHIELD_CONFIG.specialChance
          : GUARDIAN_SHIELD_CONFIG.normalChance;
      const staminaCost = special ? GUARDIAN_SHIELD_CONFIG.specialStaminaCost : GUARDIAN_SHIELD_CONFIG.normalStaminaCost;
      const candidates = targets
        .filter((member) => (
          this.isLeonhardtPlayer(member) &&
          !member.defeated &&
          member.hp > 0 &&
          member.role === "inner" &&
          !this.ball.hitPlayerIds?.has(member.id) &&
          (member === target || Math.hypot(member.x - target.x, member.y - target.y) <= GUARDIAN_SHIELD_CONFIG.range)
        ))
        .sort((a, b) => (
          (a === target ? -10000 : Math.hypot(a.x - target.x, a.y - target.y)) -
          (b === target ? -10000 : Math.hypot(b.x - target.x, b.y - target.y))
        ));
      if (candidates.length > 0 && Math.random() < chance) {
        this.ball.guardianShieldProtectorId = candidates[0].id;
      }
    }
    const protector = targets.find((member) => member.id === this.ball.guardianShieldProtectorId && !member.defeated && member.hp > 0);
    if (!protector) return false;

    const special = Boolean(this.ball.specialShotType);
    const staminaCost = special ? GUARDIAN_SHIELD_CONFIG.specialStaminaCost : GUARDIAN_SHIELD_CONFIG.normalStaminaCost;
    protector.drainStamina?.(staminaCost, GAME_CONFIG.battle.stamina.recoveryDelay * 0.55);
    const direction = this.ball.vx >= 0 ? 1 : -1;
    if (protector !== target) {
      protector.x = target.x - direction * 72;
      protector.y = target.y + Math.max(-54, Math.min(54, this.ball.y - target.y));
      protector.jumpZ = 0;
      protector.jumpVelocity = 0;
      protector.clampToArea(this.getMoveArea(protector, false));
    }
    this.completeGuardianShieldGuard(protector, target, direction, ballY);
    return true;
  }

  getRandomPointInArea(area, padding = 40) {
    if (!area) return null;
    if (area.trapezoid) {
      const t = 0.12 + Math.random() * 0.76;
      const y = area.trapezoid.yTop + (area.trapezoid.yBottom - area.trapezoid.yTop) * t;
      const left = area.trapezoid.leftTop + (area.trapezoid.leftBottom - area.trapezoid.leftTop) * t + padding;
      const right = area.trapezoid.rightTop + (area.trapezoid.rightBottom - area.trapezoid.rightTop) * t - padding;
      return { x: left + Math.random() * Math.max(1, right - left), y };
    }
    const rects = area.rects || [area];
    const rect = rects[Math.floor(Math.random() * rects.length)] || area;
    return {
      x: rect.x + padding + Math.random() * Math.max(1, rect.w - padding * 2),
      y: rect.y + padding + Math.random() * Math.max(1, rect.h - padding * 2)
    };
  }

  tryWitchWarpEscape(target, ballY, rollResolved = false) {
    if (!target?.isWitchStyle?.() || target.hp <= 0 || target.defeated) return false;
    if (target.witchWarpTimer > 0 || target.hitRecoveryTimer > 0 || target.invincibleTime > 0) return false;
    if (!rollResolved && Math.random() >= 0.4) return false;

    const area = this.areas[target.zone];
    const oldX = target.x;
    const oldY = target.y;
    let destination = null;
    for (let attempt = 0; attempt < 18; attempt += 1) {
      const point = this.getRandomPointInArea(area, target.radius + 34);
      if (!point) break;
      const ballDistance = Math.hypot(point.x - this.ball.x, point.y - this.ball.y);
      const oldDistance = Math.hypot(point.x - oldX, point.y - oldY);
      if (ballDistance > 170 && oldDistance > 150) {
        destination = point;
        break;
      }
      destination = destination || point;
    }
    if (!destination) return false;

    this.spawnEffect(oldX, oldY - target.jumpZ - 62, "#d8b6ff", "witchWarp", 1.22);
    target.x = destination.x;
    target.y = destination.y;
    target.jumpZ = 0;
    target.jumpVelocity = 0;
    target.knockbackX = 0;
    target.knockbackY = 0;
    target.witchWarpTimer = 0.55;
    target.invincibleTime = Math.max(target.invincibleTime || 0, 0.64);
    target.clampToArea(area);
    this.ball.hitPlayerIds?.add(target.id);
    if (this.ball.target === target) this.ball.target = null;
    this.spawnEffect(target.x, target.y - 62, "#9fdcff", "witchWarp", 1.38);
    this.spawnEffect(target.x, target.y - 26, "#ff6ee7", "arcanaImpact", 0.32);
    this.spawnCatchResultLabel(target, "WARP", "#d8b6ff");
    this.startScreenShake(8, 0.1);
    return true;
  }

  isWitchWarpThreat(target) {
    if (!target?.isWitchStyle?.() || target.hp <= 0 || target.defeated) return false;
    if (!this.ball.isFlying || this.ball.kind !== "shoot" || !this.ball.thrower) return false;
    if (this.ball.thrower.team === target.team) return false;
    const flightSerial = this.ball.flightSerial || 0;
    if (this.ball.witchWarpFlight !== flightSerial) {
      this.ball.witchWarpFlight = flightSerial;
      this.ball.witchWarpCheckedIds?.clear();
    }
    if (this.ball.witchWarpCheckedIds?.has(target.id) || this.ball.hitPlayerIds?.has(target.id)) return false;
    const ballY = this.ball.y - this.ball.z;
    const dx = target.x - this.ball.x;
    const dy = target.y - ballY;
    const distance = Math.hypot(dx, dy);
    const speed = Math.hypot(this.ball.vx, this.ball.vy) || 1;
    const approaching = (dx * this.ball.vx + dy * this.ball.vy) / speed;
    const aimedAtMelty = this.ball.target === target;
    const nearLine = Math.abs(dx * this.ball.vy - dy * this.ball.vx) / speed < 92 + this.ball.radius;
    return aimedAtMelty
      ? distance < 620 && approaching > -80
      : distance < 390 && approaching > 80 && nearLine;
  }

  tryIncomingWitchWarpEscapes(targets) {
    for (const target of targets) {
      if (!this.isWitchWarpThreat(target)) continue;
      this.ball.witchWarpCheckedIds?.add(target.id);
      if (Math.random() < 0.4 && this.tryWitchWarpEscape(target, this.ball.y - this.ball.z, true)) {
        return true;
      }
    }
    return false;
  }

  isLunaPlayer(player) {
    return Boolean(player && player.uniformEmblem === "braves-mage" && player.specialShotType === "lunaticMirage");
  }

  tryMoonBarrier(target, ballY, damage, direction) {
    if (!this.isLunaPlayer(target)) return false;
    if (target.moonBarrierCooldownTimer > 0) return false;
    if (Math.random() >= MOON_BARRIER_CONFIG.chance) return false;
    target.drainStamina?.(MOON_BARRIER_CONFIG.staminaCost, GAME_CONFIG.battle.stamina.recoveryDelay * 0.65);
    target.moonBarrierTimer = MOON_BARRIER_CONFIG.timer;
    target.moonBarrierCooldownTimer = MOON_BARRIER_CONFIG.cooldown;
    const hpBefore = target.hp;
    const reducedDamage = damage * 0.5;
    const damaged = target.takeDamage(reducedDamage, direction, GAME_CONFIG.battle, MOON_BARRIER_CONFIG.knockbackScale);
    this.ball.hitPlayerIds?.add(target.id);
    if (damaged) {
      this.addSpiritForDamage(target.team, hpBefore, target.hp);
      this.spawnDamageNumber(target, reducedDamage);
    }
    this.spawnEffect(target.x, target.y - target.jumpZ - 66, "#b98cff", "moonBarrier", 1.1);
    this.spawnEffect(this.ball.x, ballY, "#f8f1ff", "moonBarrierImpact", Math.max(0.8, Math.min(1.45, reducedDamage / 24)));
    this.spawnCatchResultLabel(target, "BARRIER", "#d8b6ff");
    this.startScreenShake(6, 0.08);
    this.spillHitBallInDefenderCourt(target, direction, Math.max(8, reducedDamage));
    return true;
  }

  handleHits() {
    if (!this.ball.isFlying || this.ball.kind !== "shoot" || !this.ball.thrower || this.ball.hasBounced) return;
    if (this.ball.specialShotType === "clockStop" && this.ball.clockStopPhase === "hold") return;
    if (this.ball.specialShotType === "meteorCrash") return;
    const targets = this.ball.thrower.team === "left" ? this.rightTeam : this.leftTeam;
    if (this.tryIncomingWitchWarpEscapes(targets)) return;

    let target = this.ball.target;
    if (!target || !targets.includes(target) || target.defeated || target.role !== "inner") return;
    if (this.ball.hitPlayerIds?.has(target.id)) return;
      const originalTarget = target;
      const hit = target.getHitBox();
      const ballY = this.ball.y - this.ball.z;
      const hitRadius = this.getShotHitRadius(this.ball, target);
      if (this.resolveWitchReflectShield(target, ballY)) return;
      if (!this.circleRectOverlap(this.ball.x, ballY, hitRadius, hit)) {
        if (this.isSuccessfulDodgeOverlap(target, this.ball.x, ballY, this.ball.radius)) {
          this.addSpiritForDodge(target, this.ball);
          this.recordShotDefenseDebug({ player: target, action: "回避", result: "成功" });
          if (this.isPiercingShot(this.ball.specialShotType)) {
            this.ball.hitPlayerIds?.add(target.id);
          } else {
            this.endShotAfterDodge(target);
            return;
          }
        }
        return;
      }
      if (this.resolveGuardianShieldGuard(originalTarget, targets, ballY)) return;
      const guardedTarget = this.resolveArkmaShieldDevilGuard(originalTarget, targets, ballY);
      if (guardedTarget === "caught") return;
      if (guardedTarget === "shielded") return;
      if (guardedTarget) target = guardedTarget;
      if (
        target?.isWitchStyle?.() &&
        !this.ball.witchWarpCheckedIds?.has(target.id)
      ) {
        this.ball.witchWarpCheckedIds?.add(target.id);
        if (this.tryWitchWarpEscape(target, ballY)) return;
      }

      const direction = this.ball.vx >= 0 ? 1 : -1;
      const specialType = this.ball.specialShotType;
      const demonShot = Boolean(this.ball.demonShot);
      const qigongShot = !specialType && !demonShot && !this.ball.counterShot && this.isBravesMartialArtist(this.ball.thrower);
      const qigongShotDamageScale = qigongShot
        ? this.getMartialArtistQigongShotDamageScale(this.ball.travelDistance)
        : 1;
      let damage = this.getSpecialShotDamage(this.ball.power, specialType, this.ball.travelDistance);
      if (demonShot) {
        damage *= 1.18;
      }
      if (qigongShot) {
        damage *= qigongShotDamageScale;
      }
      damage *= this.getLateMatchShotDamageScale();
      if (this.isVampireLightWeakness(target, specialType)) {
        damage *= BLOOD_DRAIN_CONFIG.lightWeaknessScale;
      }
      const shieldGuardBlock = target.isShieldDevilStyle?.() && this.ball.shieldDevilProtectorId === target.id && target.shieldGuardTimer > 0;
      if (shieldGuardBlock) {
        damage *= 0.55;
      }
      const arcanaCharge = specialType === "arcanaSphere"
        ? this.getArcanaSphereChargeRate(this.ball.travelDistance)
        : 0;
      let knockbackScale = this.ball.counterShot
        ? COUNTER_CONFIG.knockbackScale
        : specialType === "lockRocket"
          ? 1.6
          : specialType === "gigaBreak"
            ? 2.55
            : specialType === "holyLance"
              ? 1.75
              : specialType === "hundredRush"
                ? 1.95
                : specialType === "lunaticMirage"
                  ? 1.55
                : specialType === "shiningArrow"
                  ? 1.2
                  : specialType === "braveSlash"
                    ? 1.45
          : specialType
            ? 1.5
            : demonShot ? 1.18 : 1;
      if (shieldGuardBlock) knockbackScale *= 0.45;
      if (specialType === "arcanaSphere" && arcanaCharge >= 0.92) {
        knockbackScale *= ARCANA_SPHERE_DAMAGE_CONFIG.maxKnockbackScale;
      }
      if (!shieldGuardBlock && this.tryMoonBarrier(target, ballY, damage, direction)) return;
      const hpBefore = target.hp;
      const wasDodging = target.dodgeTimer > 0;
      const wasTryingCatch = target.catchTimer > 0;
      const damaged = target.takeDamage(damage, direction, GAME_CONFIG.battle, knockbackScale);
      if (damaged) {
        if (wasTryingCatch) this.applyCatchMissPenalty(target, this.ball);
        this.recordShotDefenseDebug({
          player: target,
          action: wasTryingCatch ? "キャッチ" : wasDodging ? "回避" : "防御なし",
          result: "被弾"
        });
        const actualDamage = Math.max(0, hpBefore - target.hp);
        this.addSpiritForDamage(target.team, hpBefore, target.hp);
        this.addSpiritForShotHit(this.ball);
        this.ball.hitPlayerIds?.add(target.id);
        if (!specialType && !demonShot && !this.ball.counterShot) {
          this.applyBlessingShot(this.ball.thrower, actualDamage);
        }
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
        if (this.isVampirePlayer(this.ball.thrower)) {
          this.applyVampireDrain(this.ball.thrower, damage, specialType, target);
        }
        if (specialType === "tsutenkaku") {
          this.applyTsutenkakuSplash(target, damage, this.ball.tsutenkakuTargetX, this.ball.tsutenkakuTargetY);
        }
        if (specialType === "kiai") {
          this.startScreenShake(11, 0.12);
        }
        if (specialType === "braveSlash") {
          this.addSpirit(target.team, -1.2);
          target.knockbackX += direction * GAME_CONFIG.battle.knockbackSpeed * 0.78;
          this.startScreenShake(15, 0.15);
        }
        if (specialType === "gigaBreak") {
          target.knockbackX += direction * GAME_CONFIG.battle.knockbackSpeed * 1.65;
          target.knockbackY += (this.ball.vy >= 0 ? 1 : -1) * GAME_CONFIG.battle.knockbackSpeed * 0.35;
          this.startScreenShake(20, 0.2);
        }
        if (specialType === "fireball") {
          this.applyFireballSplash(target, damage, this.ball.x, this.ball.y);
          this.spawnEffect(this.ball.x, ballY + 24, "#ff7a1f", "fireballBurn", 0.9);
          this.startScreenShake(13, 0.15);
        }
        if (specialType === "holyLance") {
          this.startScreenShake(10, 0.11);
        }
        if (specialType === "shiningArrow") {
          this.startScreenShake(7, 0.08);
        }
        if (specialType === "hundredRush") {
          target.knockbackX += direction * GAME_CONFIG.battle.knockbackSpeed * 0.9;
          this.startScreenShake(15, 0.16);
        }
        if (specialType === "lunaticMirage") {
          target.knockbackX += direction * GAME_CONFIG.battle.knockbackSpeed * 0.45;
          this.startScreenShake(10, 0.12);
        }
        if (specialType === "triple") {
          this.startScreenShake(9, 0.11);
        }
        if (specialType === "boomerang" || specialType === "devilShield") {
          this.startScreenShake(10, 0.13);
        }
        if (specialType === "clockStop") {
          this.startScreenShake(13, 0.16);
        }
        if (specialType === "lockRocket") {
          this.startScreenShake(15, 0.18);
        }
        if (specialType === "ufoSpin") {
          this.startScreenShake(10, 0.12);
        }
        if (specialType === "hellfire") {
          this.startScreenShake(14, 0.16);
          this.applyHellfireBurn(target, direction);
        }
        if (specialType === "arcanaSphere") {
          this.startScreenShake(12 + arcanaCharge * 8, 0.13 + arcanaCharge * 0.08);
        }
        if (shieldGuardBlock) {
          this.startScreenShake(12, 0.12);
        }
        this.spawnEffect(
          this.ball.x,
          ballY,
          shieldGuardBlock ? "#9b2cff" : this.ball.galeCounter ? "#7dffd8" : this.ball.counterShot ? "#bdf8ff" : demonShot ? "#5a0636" : this.getSpecialHitColor(specialType),
          this.ball.counterShot
            ? (this.ball.galeCounter ? "galeCounterImpact" : "counterImpact")
            : shieldGuardBlock ? "shieldImpact"
            : specialType === "triple" ? "tripleImpact"
            : specialType === "boomerang" ? "bananaImpact"
            : specialType === "devilShield" ? "shieldImpact"
            : specialType === "clockStop" ? "clockImpact"
            : specialType === "lockRocket" ? "lockRocketImpact"
            : specialType === "gigaBreak" ? "gigaBreakImpact"
            : specialType === "fireball" ? "fireballImpact"
            : specialType === "holyLance" ? "holyLanceImpact"
            : specialType === "shiningArrow" ? "shiningArrowImpact"
            : specialType === "hundredRush" ? "hundredRushImpact"
            : specialType === "lunaticMirage" ? "lunaticMirageImpact"
            : specialType === "hellfire" ? "hellfireImpact"
            : specialType === "arcanaSphere" ? "arcanaImpact"
            : specialType === "ufoSpin" ? "ufoSpinImpact"
            : specialType === "braveSlash" ? "braveSlashImpact"
            : specialType === "slap" ? "slapImpact" : specialType === "kiai" ? "kiaiImpact" : specialType ? "special" : demonShot ? "maouImpact" : "hit",
          this.ball.counterShot ? this.ball.counterIntensity || 1 : 1
        );
        if (qigongShot) {
          this.spawnEffect(this.ball.x, ballY, "#ffffff", "qigongShotImpact", 0.85 + (qigongShotDamageScale - 1) * 1.8);
          target.knockbackX += direction * GAME_CONFIG.battle.knockbackSpeed * 0.18;
        }
        if (!specialType && !demonShot && !this.ball.counterShot && this.isHeroRoyalStraightBall(this.ball)) {
          this.spawnEffect(this.ball.x, ballY, "#8ffcff", "heroStraightImpact", 0.75 + (this.ball.heroBondIntensity || 0) * 0.45);
        }
        if (!specialType && !demonShot && !this.ball.counterShot && this.isBardMelodyShotBall(this.ball)) {
          this.spawnEffect(this.ball.x, ballY, "#ffd83d", "melodyShotImpact", 0.9);
        }
        if (!specialType && !demonShot && !this.ball.counterShot && this.isWitchSparkShotBall(this.ball)) {
          this.spawnEffect(this.ball.x, ballY, "#d8b6ff", "witchSparkImpact", 0.9);
        }
        if (this.ball.counterShot) {
          this.startScreenShake(10 + (this.ball.counterIntensity || 1) * 3, 0.14);
        }
        this.spawnDamageNumber(target, damage);
        this.spillHitBallInDefenderCourt(target, direction, damage);
        return;
      } else if (wasDodging) {
        this.addSpiritForDodge(target, this.ball);
        if (this.isPiercingShot(this.ball.specialShotType)) {
          this.ball.hitPlayerIds?.add(target.id);
        } else {
          this.endShotAfterDodge(target);
          return;
        }
      }
  }

  resolveWitchReflectShield(target, ballY) {
    return false;
  }

  getNearestOpponentFor(player) {
    const enemies = player.team === "left" ? this.rightTeam : this.leftTeam;
    let best = null;
    let bestDistance = Infinity;
    for (const enemy of enemies) {
      if (enemy.defeated || enemy.role !== "inner") continue;
      const distance = Math.hypot(enemy.x - player.x, enemy.y - player.y);
      if (distance < bestDistance) {
        best = enemy;
        bestDistance = distance;
      }
    }
    return best;
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
    const areaBounds = this.getAreaBounds(area);
    const areaCenterX = areaBounds.x + areaBounds.w * 0.5;
    const towardAreaCenter = Math.sign(areaCenterX - point.x) || -direction || 1;
    const speed = Math.max(80, Math.min(190, GAME_CONFIG.ball.hitBounceX * 0.34));
    this.ball.vx = towardAreaCenter * speed;
    this.ball.vy = (Math.random() - 0.5) * Math.max(60, GAME_CONFIG.ball.hitBounceY * 0.28);
    this.ball.vz = Math.max(70, Math.min(135, damage * 1.4));
    this.looseOutfieldRecoveryTimer = 0;
    this.looseOutfieldTotalTimer = 0;
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
        const hitRadius = this.getShotHitRadius(shot, target);
        if (!this.circleRectOverlap(shot.x, ballY, hitRadius, hit)) {
          if (this.isSuccessfulDodgeOverlap(target, shot.x, ballY, shot.radius)) {
            this.addSpiritForDodge(target, { specialShotType: "triple", thrower: this.ball?.thrower });
            shot.hitPlayerIds.add(target.id);
            consumed = true;
            break;
          }
          continue;
        }
        const direction = shot.vx >= 0 ? 1 : -1;
        const hpBefore = target.hp;
        const wasDodging = target.dodgeTimer > 0;
        const shotDamage = shot.power * this.getLateMatchShotDamageScale();
        if (target.takeDamage(shotDamage, direction, GAME_CONFIG.battle, 0.55)) {
          this.addSpiritForDamage(target.team, hpBefore, target.hp);
          this.spawnEffect(shot.x, ballY, shot.color || "#ffcc8a", "tripleSpark");
          this.spawnDamageNumber(target, shotDamage);
        } else if (wasDodging) {
          this.addSpiritForDodge(target, { specialShotType: "triple", thrower: this.ball?.thrower });
          shot.hitPlayerIds.add(target.id);
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

    const damage = this.getSpecialShotDamage(this.ball.power, "lightning", this.ball.travelDistance)
      * this.getLateMatchShotDamageScale();
    this.ball.lightningImpactPending = false;
    this.applyLightningSplash(null, damage, this.ball.lightningTargetX, this.ball.lightningTargetY);
    this.spawnEffect(this.ball.lightningTargetX, this.ball.lightningTargetY - 48, "#ffd400", "special");
  }

  handleHellfireGroundImpact() {
    if (
      !this.ball.thrower ||
      this.ball.kind !== "shoot" ||
      this.ball.specialShotType !== "hellfire" ||
      !this.ball.hasBounced
    ) return;
    this.spawnHellfireZone(this.ball.x, this.ball.y, this.ball.thrower.team);
    this.ball.specialShotType = null;
    this.ball.specialShot = false;
  }

  handleTsutenkakuImpact() {
    if (
      !this.ball.tsutenkakuImpactPending ||
      this.ball.specialShotType !== "tsutenkaku" ||
      !this.ball.thrower
    ) return;

    const centerX = this.ball.tsutenkakuTargetX;
    const centerY = this.ball.tsutenkakuTargetY;
    const damage = this.getSpecialShotDamage(this.ball.power, "tsutenkaku", this.ball.travelDistance)
      * this.getLateMatchShotDamageScale();
    this.ball.tsutenkakuImpactPending = false;
    this.applyTsutenkakuSplash(null, damage, centerX, centerY);
    this.ball.drop();
  }

  handleMeteorCrashImpact() {
    if (
      !this.ball.meteorCrashImpactPending ||
      this.ball.specialShotType !== "meteorCrash" ||
      !this.ball.thrower
    ) return;

    const centerX = this.ball.meteorCrashTargetX;
    const centerY = this.ball.meteorCrashTargetY;
    const meteorHeatScale = 1 + ((this.ball.meteorCrashHeatScale || 1) - 1) * 0.5;
    const baseDamage = this.getSpecialShotDamage(this.ball.power, "meteorCrash", this.ball.travelDistance)
      * meteorHeatScale
      * this.getLateMatchShotDamageScale();
    this.ball.meteorCrashImpactPending = false;
    this.applyMeteorCrashSplash(baseDamage, centerX, centerY);
    this.spawnMeteorLavaZone(centerX, centerY, this.ball.thrower.team);
    this.ball.drop();
  }

  getSpecialShotDamage(baseDamage, specialType, travelDistance = 0) {
    const rule = SPECIAL_SHOT_DAMAGE_RULES[specialType];
    const damageScale = typeof rule === "function" ? rule(travelDistance) : rule ?? 1;
    return baseDamage * damageScale * SHOT_DAMAGE_SCALE;
  }

  getArcanaSphereChargeRate(travelDistance = 0) {
    return Math.max(0, Math.min(1, travelDistance / ARCANA_SPHERE_DAMAGE_CONFIG.maxChargeDistance));
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
      this.playSound("catch", { cooldown: AUDIO_CONFIG.catchCooldown });
      receiver.throwLockTimer = Math.max(receiver.throwLockTimer, 0.2);
      this.setControlledMember(receiver.team, receiver);
      this.spawnEffect(receiver.x, receiver.y - 58, "#ffb347", "catch");
      return;
    }

    this.releaseBallAt(GAME_CONFIG.court.centerX, GAME_CONFIG.court.y + GAME_CONFIG.court.h * 0.55, "loose");
  }

  handleLockRocketExit() {
    if (
      !this.ball.isFlying ||
      this.ball.kind !== "shoot" ||
      this.ball.specialShotType !== "lockRocket" ||
      this.ball.lockRocketPhase !== "terminal"
    ) return;

    // 誘導中は画面外から戻る可能性があるため、追尾終了後だけ回収する。
    const margin = 220;
    const outside = (
      this.ball.x < this.ballBounds.x - margin ||
      this.ball.x > this.ballBounds.x + this.ballBounds.w + margin ||
      this.ball.y < this.ballBounds.y - margin ||
      this.ball.y > this.ballBounds.y + this.ballBounds.h + margin
    );
    if (!outside) return;

    const throwerTeam = this.ball.thrower?.team;
    const receiver = throwerTeam
      ? this.findNearestOutfielder(throwerTeam, this.ball.x, this.ball.y)
      : null;
    if (receiver) {
      this.ball.pickUp(receiver);
      this.playSound("catch", { cooldown: AUDIO_CONFIG.catchCooldown });
      receiver.throwLockTimer = Math.max(receiver.throwLockTimer, 0.2);
      this.setControlledMember(receiver.team, receiver);
      this.spawnEffect(receiver.x, receiver.y - 58, "#55dfff", "catch");
      return;
    }

    this.releaseBallAt(
      GAME_CONFIG.court.centerX,
      GAME_CONFIG.court.y + GAME_CONFIG.court.h * 0.55,
      "loose"
    );
  }

  addSpirit(team, amount) {
    if (!this.spiritPoints || !team) return;
    const max = GAME_CONFIG.battle.spiritMax;
    const scaledAmount = amount > 0 ? amount * SPIRIT_GAIN_RATE_SCALE : amount;
    this.spiritPoints[team] = Math.max(0, Math.min(max, (this.spiritPoints[team] || 0) + scaledAmount));
  }

  addSpiritForDodge(player, shot = this.ball) {
    if (!player) return;
    let gain = GAME_CONFIG.battle.spiritDodgeGain;
    if (shot?.specialShotType) gain += GAME_CONFIG.battle.spiritSpecialDodgeBonus;
    const throwerDistance = shot?.thrower
      ? Math.hypot(shot.thrower.x - player.x, shot.thrower.y - player.y)
      : Infinity;
    if (throwerDistance < 260) gain += GAME_CONFIG.battle.spiritCloseDodgeBonus;
    this.addSpirit(player.team, gain);
  }

  applyCatchMissPenalty(catcher, shot = this.ball) {
    if (!catcher || shot?.kind !== "shoot" || shot?.counterShot) return;
    const penalty = shot?.specialShotType ? 0.7 : 0.3;
    catcher.hitRecoveryTimer = Math.max(catcher.hitRecoveryTimer || 0, penalty);
    catcher.catchTimer = 0;
  }

  addSpiritForShotFire(throwInfo) {
    const actor = throwInfo?.actor;
    if (!actor || throwInfo.kind !== "shoot") return;

    const config = GAME_CONFIG.battle;
    let gain = 0;
    if (throwInfo.specialType) {
      gain = config.spiritSpecialShotFireGain;
    } else if (throwInfo.counter) {
      gain = config.spiritCounterShotFireGain;
    } else if ((actor.jumpZ || 0) > 20 || throwInfo.aerialCombo) {
      gain = config.spiritJumpShotFireGain;
    } else if ((throwInfo.shotMultiplier || 1) >= 1.28) {
      gain = config.spiritStrongShotFireGain;
    } else {
      gain = config.spiritNormalShotFireGain;
    }
    this.addSpirit(actor.team, gain);
  }

  addSpiritForShotHit(ball) {
    if (!ball?.thrower || ball.specialShotType) return;
    const gain = ball.counterShot
      ? GAME_CONFIG.battle.spiritCounterHitGain
      : ball.quickShot
        ? GAME_CONFIG.battle.spiritQuickShotHitGain
        : GAME_CONFIG.battle.spiritNormalShotHitGain;
    this.addSpirit(ball.thrower.team, gain);
  }

  addSpiritForDamage(team, hpBefore, hpAfter) {
    if (hpBefore <= 0) return;
    if (hpAfter < hpBefore) this.recordShotDamage();
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

  isSupportSpecialShot(specialType) {
    return specialType === "victoryMarch" || specialType === "grandHeal";
  }

  applySupportSpecial(actor, specialType) {
    if (specialType === "grandHeal") {
      this.applyGrandHeal(actor);
      return;
    }
    this.applyVictoryMarch(actor);
  }

  applyVictoryMarch(actor) {
    if (!actor) return;
    const team = actor.team === "left" ? this.leftTeam : this.rightTeam;
    for (const member of team) {
      if (member.defeated || member.hp <= 0) continue;
      member.applyVictoryMarch?.(VICTORY_MARCH_DURATION);
      this.spawnEffect(member.x, member.y - member.jumpZ - 82, "#ffd83d", "victoryMarchBuff", 1.05);
      this.spawnEffect(member.x + (Math.random() - 0.5) * 46, member.y - member.jumpZ - 116, "#fff4a8", "musicNote", 0.9);
    }
    this.effects.push({
      type: "victoryMarchWave",
      team: actor.team,
      x: actor.x,
      y: actor.y - actor.jumpZ - 74,
      color: "#ffd83d",
      life: 1.35,
      maxLife: 1.35
    });
    this.effects.push({
      type: "victoryMarchScreenNotes",
      team: actor.team,
      x: actor.x,
      y: actor.y - actor.jumpZ - 92,
      color: "#ffd83d",
      life: 1.6,
      maxLife: 1.6
    });
    this.startScreenShake(5, 0.08);
    this.spawnCatchResultLabel(actor, "MARCH!", "#ffd83d");
  }

  updateRhythmStep(delta) {
    for (const bard of this.players) {
      if (!this.isBardPlayer(bard) || bard.defeated || bard.hp <= 0 || bard.downTimer > 0) continue;
      if (bard.rhythmStepCooldownTimer > 0 || bard.rhythmStepTimer > 0) continue;
      const team = bard.team === "left" ? this.leftTeam : this.rightTeam;
      const allies = team.filter((member) => (
        member &&
        member !== bard &&
        !member.defeated &&
        member.hp > 0 &&
        member.downTimer <= 0 &&
        Math.hypot(member.x - bard.x, member.y - bard.y) <= BARD_RHYTHM_STEP_CONFIG.range
      ));
      if (allies.length < BARD_RHYTHM_STEP_CONFIG.minNearbyAllies) {
        bard.rhythmStepCooldownTimer = 1.6;
        continue;
      }

      bard.applyRhythmStep?.(BARD_RHYTHM_STEP_CONFIG.duration);
      for (const member of allies) {
        member.applyRhythmStep?.(BARD_RHYTHM_STEP_CONFIG.duration);
        this.spawnEffect(member.x, member.y - member.jumpZ - 82, "#ffd83d", "rhythmStepBuff", 0.82);
        this.spawnEffect(member.x + (Math.random() - 0.5) * 34, member.y - member.jumpZ - 112, "#8b1e4d", "musicNote", 0.55);
      }
      this.spawnEffect(bard.x, bard.y - bard.jumpZ - 92, "#ffd83d", "rhythmStepCast", 1);
      bard.rhythmStepCooldownTimer = BARD_RHYTHM_STEP_CONFIG.cooldownMin + Math.random() * (BARD_RHYTHM_STEP_CONFIG.cooldownMax - BARD_RHYTHM_STEP_CONFIG.cooldownMin);
    }
  }

  applyGrandHeal(actor) {
    if (!actor) return;
    actor.grandHealCooldownTimer = GRAND_HEAL_CONFIG.cooldown;
    const team = actor.team === "left" ? this.leftTeam : this.rightTeam;
    this.effects.push({
      type: "grandHealRitual",
      team: actor.team,
      actor,
      x: actor.x,
      y: actor.y,
      color: "#fff4a8",
      tickTimer: GRAND_HEAL_CONFIG.tickInterval,
      life: GRAND_HEAL_CONFIG.duration,
      maxLife: GRAND_HEAL_CONFIG.duration
    });
    this.spawnEffect(actor.x, actor.y - actor.jumpZ - 112, "#fff4a8", "grandHealCast", 1.2);
    for (const member of team) {
      if (member.defeated || member.hp <= 0) continue;
      this.spawnEffect(member.x, member.y - member.jumpZ - 8, "#fff4a8", "grandHealCircle", 0.85);
    }
    this.startScreenShake(4, 0.08);
    this.spawnCatchResultLabel(actor, "HEAL!", "#fff4a8");
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

  healPlayer(player, amount, color = "#bdf8ff") {
    if (!player || player.defeated || player.hp <= 0 || amount <= 0) return 0;
    const before = player.hp;
    player.hp = Math.min(player.maxHp, player.hp + amount);
    const healed = player.hp - before;
    if (healed > 0) {
      this.spawnEffect(player.x, player.y - player.jumpZ - 88, color, "heal");
    }
    return healed;
  }

  isSophiaPlayer(player) {
    return Boolean(player && player.uniformEmblem === "braves-cleric" && player.specialShotType === "grandHeal");
  }

  findLowestHpRatioAlly(teamName) {
    const team = teamName === "left" ? this.leftTeam : this.rightTeam;
    let best = null;
    let bestRatio = Infinity;
    for (const member of team) {
      if (!member || member.defeated || member.hp <= 0 || member.hp >= member.maxHp) continue;
      const ratio = member.hp / Math.max(1, member.maxHp);
      if (ratio < bestRatio) {
        best = member;
        bestRatio = ratio;
      }
    }
    return best;
  }

  applyBlessingShot(attacker, actualDamage) {
    if (!this.isSophiaPlayer(attacker) || !actualDamage || actualDamage <= 0) return;
    const target = this.findLowestHpRatioAlly(attacker.team);
    if (!target) return;
    const healAmount = Math.max(BLESSING_SHOT_CONFIG.minHeal, actualDamage * BLESSING_SHOT_CONFIG.healRatio);
    const healed = this.healPlayer(target, healAmount, "#bdf8ff");
    if (healed <= 0) return;
    this.effects.push({
      type: "blessingRibbon",
      fromX: attacker.x,
      fromY: attacker.y - attacker.jumpZ - 80,
      target,
      x: target.x,
      y: target.y - target.jumpZ - 82,
      color: "#fff4a8",
      life: 0.72,
      maxLife: 0.72
    });
    this.spawnEffect(target.x, target.y - target.jumpZ - 8, "#fff4a8", "blessingStar", 0.85);
    this.spawnCatchResultLabel(target, `+${Math.round(healed)}`, "#bdf8ff");
  }

  isVampirePlayer(player) {
    return player?.characterType === "vampire" || player?.uniformEmblem === "vampire";
  }

  isVampireLightWeakness(target, specialType) {
    if (!this.isVampirePlayer(target)) return false;
    return specialType === "lightning" || specialType === "kiai" || specialType === "braveSlash" || specialType === "holyLance";
  }

  applyVampireDrain(attacker, damage, specialType, target = null) {
    if (!this.isVampirePlayer(attacker) || damage <= 0) return;
    const selfRatio = specialType === "bloodDrain"
      ? BLOOD_DRAIN_CONFIG.selfHealRatio
      : BLOOD_DRAIN_CONFIG.normalDrainRatio;
    if (target) {
      this.spawnBloodDrainLink(target, attacker, specialType === "bloodDrain" ? "#ff315d" : "#ff6f8f", specialType === "bloodDrain" ? 1.15 : 0.72);
    }
    this.healPlayer(attacker, damage * selfRatio, "#ff5a75");
    if (specialType !== "bloodDrain") return;
    const team = attacker.team === "left" ? this.leftTeam : this.rightTeam;
    const arkma = team.find((member) => member.uniformEmblem === "arkmaLord" && !member.defeated && member.hp > 0);
    if (arkma) {
      if (target) {
        this.spawnBloodDrainLink(target, arkma, "#9b2cff", 0.95);
      }
      this.healPlayer(arkma, damage * BLOOD_DRAIN_CONFIG.arkmaHealRatio, "#b31534");
    }
  }

  spawnBloodDrainLink(from, to, color, intensity = 1) {
    if (!from || !to) return;
    this.effects.push({
      type: "bloodDrainLink",
      from,
      to,
      color,
      intensity,
      life: 0.78,
      maxLife: 0.78
    });
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
      const finalSplashDamage = this.isVampireLightWeakness(enemy, "lightning")
        ? splashDamage * BLOOD_DRAIN_CONFIG.lightWeaknessScale
        : splashDamage;
      const hpBefore = enemy.hp;
      const wasDodging = enemy.dodgeTimer > 0;
      if (enemy.takeDamage(finalSplashDamage, direction, GAME_CONFIG.battle, 1.5)) {
        this.addSpiritForDamage(enemy.team, hpBefore, enemy.hp);
        enemy.stun(0.36);
        this.spawnEffect(enemy.x, enemy.y - enemy.jumpZ - 70, "#8ffcff", "special");
        this.spawnDamageNumber(enemy, finalSplashDamage);
      } else if (enemy.hp > 0) {
        if (wasDodging) {
          this.addSpiritForDodge(enemy, this.ball);
        }
        enemy.stun(0.24);
        this.spawnEffect(enemy.x, enemy.y - enemy.jumpZ - 70, "#8ffcff", "special");
      }
    }
  }

  applyFireballSplash(primaryTarget, baseDamage, centerX = primaryTarget?.x, centerY = primaryTarget?.y) {
    const enemies = this.ball.thrower.team === "left" ? this.rightTeam : this.leftTeam;
    const splashRadius = 185;
    const splashDamage = Math.max(1, baseDamage * 0.28);
    for (const enemy of enemies) {
      if (enemy === primaryTarget || enemy.defeated || enemy.role !== "inner") continue;
      const dx = enemy.x - centerX;
      const dy = enemy.y - centerY;
      const distance = Math.hypot(dx, dy);
      if (distance > splashRadius) continue;
      const direction = dx >= 0 ? 1 : -1;
      const scale = 1 - Math.min(1, distance / splashRadius) * 0.45;
      const finalDamage = splashDamage * scale;
      const hpBefore = enemy.hp;
      const wasDodging = enemy.dodgeTimer > 0;
      if (enemy.takeDamage(finalDamage, direction, GAME_CONFIG.battle, 1.25)) {
        this.addSpiritForDamage(enemy.team, hpBefore, enemy.hp);
        this.spawnEffect(enemy.x, enemy.y - enemy.jumpZ - 58, "#ff7a1f", "special", 0.78);
        this.spawnDamageNumber(enemy, finalDamage);
      } else if (wasDodging) {
        this.addSpiritForDodge(enemy, this.ball);
      }
    }
  }

  applyTsutenkakuSplash(primaryTarget, baseDamage, centerX, centerY) {
    const enemies = this.ball.thrower.team === "left" ? this.rightTeam : this.leftTeam;
    const splashRadius = 300;
    // 旧直撃2.0倍の20％を基準に、指定どおり1.5倍（通常威力の0.6倍）にする。
    const splashDamage = Math.max(1, baseDamage * 0.25);
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

  applyMeteorCrashSplash(baseDamage, centerX, centerY) {
    const enemies = this.ball.thrower.team === "left" ? this.rightTeam : this.leftTeam;
    const meteorStage = Math.max(0, Math.min(4, Math.round(this.ball.meteorCrashHeatStage || 0)));
    const meteorColors = ["#ff7a1f", "#ff681f", "#ff4a28", "#ff2632", "#ff1038"];
    const meteorColor = meteorColors[meteorStage] || meteorColors[0];
    const radius = METEOR_CRASH_CONFIG.radius;
    const radiusY = radius * METEOR_CRASH_CONFIG.markerRadiusYScale;
    const innerRadius = METEOR_CRASH_CONFIG.innerRadius;
    for (const enemy of enemies) {
      if (enemy.defeated || enemy.role !== "inner") continue;
      const dx = enemy.x - centerX;
      const dy = enemy.y - centerY;
      const markerDistance = Math.hypot(dx / radius, dy / radiusY);
      if (markerDistance > 1) continue;

      const distance = Math.hypot(dx, dy);
      const markerRadiusAtAngle = distance / Math.max(0.001, markerDistance);
      const innerRatio = Math.min(0.85, innerRadius / Math.max(1, markerRadiusAtAngle));
      const t = Math.max(0, Math.min(1, (markerDistance - innerRatio) / Math.max(0.001, 1 - innerRatio)));
      const damageScale = 1 - t * (1 - METEOR_CRASH_CONFIG.outerDamageScale);
      const finalDamage = Math.max(1, baseDamage * damageScale);
      const direction = dx >= 0 ? 1 : -1;
      const length = distance || 1;
      const hpBefore = enemy.hp;
      if (enemy.takeDamage(finalDamage, direction, GAME_CONFIG.battle, METEOR_CRASH_CONFIG.knockbackScale, true)) {
        this.addSpiritForDamage(enemy.team, hpBefore, enemy.hp);
        enemy.knockbackX += dx / length * GAME_CONFIG.battle.knockbackSpeed * (1.05 + (1 - t) * 0.45);
        enemy.knockbackY += dy / length * GAME_CONFIG.battle.knockbackSpeed * (0.78 + (1 - t) * 0.34);
        enemy.stun?.(0.18 + (1 - t) * 0.2);
        this.spawnEffect(enemy.x, enemy.y - enemy.jumpZ - 62, meteorColor, "special");
        this.spawnDamageNumber(enemy, finalDamage);
      }
    }
    this.startScreenShake(22, 0.24);
    this.spawnMeteorCrashImpactEffects(centerX, centerY, meteorColor);
  }

  spawnMeteorCrashImpactEffects(centerX, centerY, color = "#ff5a1f") {
    this.spawnEffect(centerX, centerY - 70, color, "special", 1.35);
    this.spawnEffect(centerX, centerY - 38, "#2b0905", "hellfireImpact", 0.55);
    for (let index = 0; index < 14; index += 1) {
      const angle = index * Math.PI * 2 / 14;
      const distance = 90 + (index % 5) * 38;
      this.spawnEffect(
        centerX + Math.cos(angle) * distance,
        centerY + Math.sin(angle) * distance * 0.48 - 44,
        index % 2 === 0 ? "#ff5a1f" : "#ffd36a",
        "special",
        0.72
      );
    }
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

  applyHellfireBurn(target, direction = 1) {
    for (let tick = 1; tick <= HELLFIRE_CONFIG.burnTicks; tick += 1) {
      this.effects.push({
        type: "hellfireBurn",
        target,
        direction,
        damage: HELLFIRE_CONFIG.burnDamage,
        life: tick * HELLFIRE_CONFIG.burnInterval,
        maxLife: tick * HELLFIRE_CONFIG.burnInterval
      });
    }
  }

  spawnHellfireZone(x, y, ownerTeam) {
    this.hellfireZones.push({
      x,
      y,
      ownerTeam,
      radius: HELLFIRE_CONFIG.flameRadius,
      life: HELLFIRE_CONFIG.flameDuration,
      maxLife: HELLFIRE_CONFIG.flameDuration,
      tickTimer: 0
    });
    this.spawnEffect(x, y - 32, "#2b0a30", "hellfireImpact", 0.8);
  }

  spawnMeteorLavaZone(x, y, ownerTeam) {
    this.meteorLavaZones.push({
      x,
      y,
      ownerTeam,
      radius: METEOR_CRASH_CONFIG.lavaRadius,
      life: METEOR_CRASH_CONFIG.lavaDuration,
      maxLife: METEOR_CRASH_CONFIG.lavaDuration,
      tickTimer: 0
    });
  }

  updateHellfireZones(delta) {
    if (!this.hellfireZones || this.hellfireZones.length === 0) return;
    this.hellfireZones = this.hellfireZones.filter((zone) => {
      zone.life -= delta;
      zone.tickTimer -= delta;
      const activePlayers = this.players.filter((player) => (
        !player.defeated &&
        player.hp > 0 &&
        player.team !== zone.ownerTeam &&
        Math.hypot(player.x - zone.x, player.y - zone.y) <= zone.radius
      ));
      for (const player of activePlayers) {
        player.applySlow?.(HELLFIRE_CONFIG.flameSlowScale, HELLFIRE_CONFIG.flameSlowDuration);
      }
      if (zone.tickTimer <= 0) {
        zone.tickTimer = HELLFIRE_CONFIG.flameTickInterval;
        for (const player of activePlayers) {
          const hpBefore = player.hp;
          if (player.takeBurnDamage?.(HELLFIRE_CONFIG.flameTouchDamage, GAME_CONFIG.battle)) {
            this.addSpiritForDamage(player.team, hpBefore, player.hp);
            this.spawnDamageNumber(player, HELLFIRE_CONFIG.flameTouchDamage);
          }
        }
      }
      return zone.life > 0;
    });
  }

  getSpecialHitColor(specialType) {
    if (specialType === "kiai") return "#fff06a";
    if (specialType === "braveSlash") return "#8ffcff";
    if (specialType === "gigaBreak") return "#d9442e";
    if (specialType === "fireball") return "#ff7a1f";
    if (specialType === "holyLance") return "#fff4a8";
    if (specialType === "shiningArrow") return "#ffe36a";
    if (specialType === "hundredRush") return "#f7f7ff";
    if (specialType === "lunaticMirage") return "#b98cff";
    if (specialType === "triple") return "#ffcc8a";
    if (specialType === "boost") return "#ff7a1f";
    if (specialType === "lightning") return "#8ffcff";
    if (specialType === "iron") return "#aeb4bf";
    if (specialType === "boomerang") return "#a8ff6b";
    if (specialType === "devilShield") return "#9b2cff";
    if (specialType === "devilClaw") return "#ff4fb8";
    if (specialType === "soul") return "#ffc4e5";
    if (specialType === "slap") return "#ff6b35";
    if (specialType === "tsutenkaku") return "#ffd83d";
    if (specialType === "clockStop") return "#50f5e0";
    if (specialType === "lockRocket") return "#55dfff";
    if (specialType === "ufoSpin") return "#7cffcb";
    if (specialType === "hellfire") return "#2b0a30";
    if (specialType === "meteorCrash") return "#ff5a1f";
    if (specialType === "bloodDrain") return "#8d061e";
    if (specialType === "arcanaSphere") return "#9b2cff";
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
      this.stopBgm();
      this.message = "YOU WIN";
    } else if (!leftAlive) {
      if (!this.isEliminationAnimationFinished(this.leftTeam)) {
        this.message = this.ball.owner ? (this.ball.owner.team === "left" ? "MY TEAM BALL" : "ENEMY BALL") : "LOOSE BALL";
        return;
      }
      this.state = "gameOver";
      this.stopBgm();
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
      offsetY: (GAME_CONFIG.height - worldHeight * scale) * 0.5 + (GAME_CONFIG.view.screenOffsetY || 0)
    };
  }

  getPlayerControlledMember() {
    const holder = this.ball.owner && this.ball.owner.team === "left" ? this.ball.owner : null;
    if (holder) return holder;
    const found = this.leftTeam.find((p) => p.id === this.controlledPlayerId && !p.defeated && p.hitRecoveryTimer <= 0);
    return found || this.getControllableLeftMembers()[0] || this.leftTeam[0];
  }

  getRightControlledMember() {
    const holder = this.ball.owner && this.ball.owner.team === "right" ? this.ball.owner : null;
    if (holder) return holder;
    const found = this.rightTeam.find((p) => p.id === this.controlledRightPlayerId && !p.defeated && p.hitRecoveryTimer <= 0);
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
    return this.getTeamMembers(team).filter((p) => !p.defeated && p.hitRecoveryTimer <= 0 && (!innerOnly || p.role === "inner"));
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
    if (!target || target.team !== team || target.defeated || target.hitRecoveryTimer > 0) return;
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

  spawnEffect(x, y, color, type, intensity = 1) {
    const duration = type === "counterImpact"
      ? 0.5
      : type === "maouImpact" ? 0.56
      : type === "maouLaunch" ? 0.42
      : type === "tripleSplit" ? 0.42
      : type === "fireballBurn" ? 0.5
      : type === "victoryMarchBuff" ? 0.9
      : type === "musicNote" ? 1
      : type === "rhythmStepBuff" ? 0.74
      : type === "rhythmStepCast" ? 0.82
      : type === "grandHealCast" ? 1
      : type === "grandHealCircle" ? 0.82
      : type === "grandHealFeather" ? 1.05
      : type === "blessingStar" ? 0.72
      : type === "braveSlashLaunch" ? 0.46
      : type === "gigaBreakLaunch" ? 0.58
      : type === "gigaBreakCatchBrace" ? 0.72
      : type === "moonBarrier" ? 0.58
      : type === "moonBarrierImpact" ? 0.5
      : type === "lunaticMirageLaunch" ? 0.62
      : type === "heroStraightImpact" ? 0.46
      : type === "melodyShotImpact" ? 0.48
      : type === "qigongShotImpact" ? 0.42
      : type === "witchSparkLaunch" ? 0.38
      : type === "witchSparkImpact" ? 0.44
      : type === "shiningPassBow" ? 0.46
      : type === "galeCounterLaunch" ? 0.58
      : type === "galeCounterImpact" ? 0.62
      : type === "tripleImpact" || type === "bananaImpact" || type === "shieldImpact" || type === "clockImpact" || type === "lockRocketImpact" || type === "ufoSpinImpact" || type === "hellfireImpact" || type === "arcanaImpact" || type === "braveSlashImpact" || type === "gigaBreakImpact" || type === "fireballImpact" || type === "holyLanceImpact" || type === "shiningArrowImpact" || type === "hundredRushImpact" || type === "lunaticMirageImpact" ? 0.62
      : type === "kiaiImpact" ? 0.46 : type === "counterCatch" ? 0.48 : 0.32;
    this.effects.push({ x, y, color, type, intensity, life: duration, maxLife: duration });
  }

  startScreenShake(strength, duration) {
    this.screenShakeStrength = Math.max(this.screenShakeStrength, strength);
    this.screenShakeDuration = Math.max(this.screenShakeDuration, duration);
    this.screenShakeTimer = Math.max(this.screenShakeTimer, duration);
  }

  startHellfireFlash(duration = 0.36) {
    this.hellfireFlashDuration = Math.max(this.hellfireFlashDuration || 0, duration);
    this.hellfireFlashTimer = Math.max(this.hellfireFlashTimer || 0, duration);
  }

  playBraversSpecialLaunchEffect(actor, specialType) {
    if (!actor || !specialType) return;
    if (specialType === "braveSlash") {
      this.spawnEffect(actor.x + actor.facing * 46, actor.y + 10, "#ffd83d", "braveSlashLaunch", 1.15);
      this.startScreenShake(8, 0.1);
      return;
    }
    if (specialType === "gigaBreak") {
      this.spawnEffect(actor.x + actor.facing * 50, actor.y + 12, "#d9442e", "gigaBreakLaunch", 1.25);
      actor.knockbackX -= actor.facing * GAME_CONFIG.battle.knockbackSpeed * 0.32;
      this.startScreenShake(22, 0.18);
      return;
    }
    if (specialType === "lunaticMirage") {
      this.spawnEffect(actor.x + actor.facing * 34, actor.y - actor.jumpZ - 72, "#b98cff", "lunaticMirageLaunch", 1.1);
    }
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

  updateBoomerangPresentation() {
    const active = this.ball?.isFlying && (this.ball.specialShotType === "boomerang" || this.ball.specialShotType === "devilShield");
    if (!active) {
      this.boomerangTurnPresented = false;
      return;
    }
    if (!this.ball.returning || this.boomerangTurnPresented) return;
    this.boomerangTurnPresented = true;
    this.startScreenShake(8, 0.12);
  }

  spawnDamageNumber(target, amount) {
    this.playSound("damage", { cooldown: AUDIO_CONFIG.damageCooldown });
    const displayAmount = target.getIncomingDamageAmount?.(amount) ?? amount;
    this.effects.push({
      x: target.x + target.facing * -34,
      y: target.y - target.jumpZ - 92,
      color: "#ff3d2f",
      type: "damageNumber",
      text: `-${Math.round(displayAmount)}`,
      life: 0.95,
      maxLife: 0.95
    });
  }

  updateMeteorLavaZones(delta) {
    if (!this.meteorLavaZones || this.meteorLavaZones.length === 0) return;
    this.meteorLavaZones = this.meteorLavaZones.filter((zone) => {
      zone.life -= delta;
      zone.tickTimer -= delta;
      const activePlayers = this.players.filter((player) => (
        !player.defeated &&
        player.hp > 0 &&
        player.team !== zone.ownerTeam &&
        Math.hypot(player.x - zone.x, player.y - zone.y) <= zone.radius
      ));
      for (const player of activePlayers) {
        player.applySlow?.(METEOR_CRASH_CONFIG.lavaSlowScale, METEOR_CRASH_CONFIG.lavaSlowDuration);
      }
      if (zone.tickTimer <= 0) {
        zone.tickTimer = METEOR_CRASH_CONFIG.lavaTickInterval;
        for (const player of activePlayers) {
          const hpBefore = player.hp;
          if (player.takeBurnDamage?.(METEOR_CRASH_CONFIG.lavaTouchDamage, GAME_CONFIG.battle)) {
            this.addSpiritForDamage(player.team, hpBefore, player.hp);
            this.spawnDamageNumber(player, METEOR_CRASH_CONFIG.lavaTouchDamage);
          }
        }
      }
      return zone.life > 0;
    });
  }

  showShotMultiplier(multiplier, actor, specialType = null) {
    this.shotMultiplierDisplay = {
      multiplier,
      team: actor.team,
      specialType,
      counterShot: Boolean(this.ball?.counterShot),
      quickShot: Boolean(this.ball?.quickShot),
      defenseLines: [],
      life: 2.6,
      maxLife: 2.6
    };
  }

  recordShotDefenseDebug(event = {}) {
    if (!event.player && !this.ball?.target) return;
    const player = event.player || this.ball.target;
    if (this.ball?.kind === "shoot" && this.ball.target && player !== this.ball.target) return;
    const display = this.shotMultiplierDisplay || {
      multiplier: this.ball?.shotMultiplier || 1,
      team: this.ball?.thrower?.team || player.team,
      specialType: this.ball?.specialShotType || null,
      counterShot: Boolean(this.ball?.counterShot),
      quickShot: Boolean(this.ball?.quickShot),
      defenseLines: [],
      life: 2.6,
      maxLife: 2.6
    };
    const name = player?.name || "CPU";
    const chanceText = Number.isFinite(event.chance) ? ` ${Math.round(event.chance * 100)}%` : "";
    const resultText = event.result ? ` ${event.result}` : "";
    const detailText = event.detail ? ` ${event.detail}` : "";
    const line = `${name}: ${event.action || "防御"}${chanceText}${resultText}${detailText}`;
    display.defenseLines = [line, ...(display.defenseLines || []).filter((item) => item !== line)].slice(0, 3);
    display.life = Math.max(display.life || 0, 2.2);
    display.maxLife = Math.max(display.maxLife || 0, 2.6);
    this.shotMultiplierDisplay = display;
  }

  getShotDebugTypeLabel(display) {
    if (display.counterShot) return "カウンター";
    const specialLabel = this.getSpecialShotLabel(display.specialType);
    if (specialLabel) return specialLabel;
    if (display.quickShot) return "クイック通常";
    const multiplier = display.multiplier || 1;
    if (multiplier >= 1.28) return "強通常";
    if (multiplier <= 1.08) return "弱通常";
    return "通常";
  }

  getSpecialShotLabel(specialType) {
    if (specialType === "kiai") return "気合ストレート";
    if (specialType === "braveSlash") return "ブレイブスラッシュ";
    if (specialType === "gigaBreak") return "ギガブレイク";
    if (specialType === "fireball") return "ファイアボール";
    if (specialType === "holyLance") return "ホーリーランス";
    if (specialType === "shiningArrow") return "シャイニングアロー";
    if (specialType === "hundredRush") return "百裂気功弾";
    if (specialType === "lunaticMirage") return "ルナティックミラージュ";
    if (specialType === "victoryMarch") return "勝利の行進曲";
    if (specialType === "grandHeal") return "グランドヒール";
    if (specialType === "none") return "なし";
    if (specialType === "triple") return "\u30c8\u30ea\u30d7\u30eb\u30b7\u30e7\u30c3\u30c8";
    if (specialType === "boost") return "BOOST";
    if (specialType === "lightning") return "LIGHTNING";
    if (specialType === "iron") return "IRON";
    if (specialType === "boomerang") return "BANANA";
    if (specialType === "devilShield") return "デビルシールド";
    if (specialType === "devilClaw") return "デビルクロー";
    if (specialType === "soul") return "SOUL RECOVERY";
    if (specialType === "slap") return "張り手シュート";
    if (specialType === "tsutenkaku") return "\u901a\u5929\u95a3\u843d\u3068\u3057";
    if (specialType === "meteorCrash") return "\u30e1\u30c6\u30aa\u30af\u30e9\u30c3\u30b7\u30e5";
    if (specialType === "clockStop") return "クロックストップ";
    if (specialType === "lockRocket") return "ロックオン・ロケット";
    if (specialType === "ufoSpin") return "UFO SPIN";
    if (specialType === "hellfire") return "\u30d8\u30eb\u30d5\u30a1\u30a4\u30a2";
    if (specialType === "bloodDrain") return "\u30d6\u30e9\u30c3\u30c9\u30c9\u30ec\u30a4\u30f3";
    if (specialType === "arcanaSphere") return "\u30a2\u30eb\u30ab\u30ca\u30b9\u30d5\u30a3\u30a2";
    return "";
  }

  updateEffects(delta) {
    this.screenShakeTimer = Math.max(0, this.screenShakeTimer - delta);
    if (this.screenShakeTimer <= 0) {
      this.screenShakeDuration = 0;
      this.screenShakeStrength = 0;
    }
    this.hellfireFlashTimer = Math.max(0, (this.hellfireFlashTimer || 0) - delta);
    if (this.hellfireFlashTimer <= 0) {
      this.hellfireFlashDuration = 0;
    }
    if (this.shotMultiplierDisplay) {
      this.shotMultiplierDisplay.life -= delta;
      if (this.shotMultiplierDisplay.life <= 0) this.shotMultiplierDisplay = null;
    }
    const triggeredHellfire = [];
    const triggeredGrandHealEffects = [];
    this.effects = this.effects.filter((effect) => {
      effect.life -= delta;
      if (effect.type === "grandHealRitual") {
        const progress = 1 - effect.life / Math.max(0.001, effect.maxLife || GRAND_HEAL_CONFIG.duration);
        if (progress >= GRAND_HEAL_CONFIG.startProgress) {
          effect.tickTimer -= delta;
          if (effect.tickTimer <= 0) {
            effect.tickTimer += GRAND_HEAL_CONFIG.tickInterval;
            const team = effect.team === "left" ? this.leftTeam : this.rightTeam;
            for (const member of team) {
              if (member.defeated || member.hp <= 0) continue;
              const before = member.hp;
              member.hp = Math.min(member.maxHp, member.hp + member.maxHp * GRAND_HEAL_CONFIG.healRatioPerTick);
              if (member.hp > before) {
                triggeredGrandHealEffects.push(member);
              }
            }
          }
        }
      }
      if (effect.type === "hellfireBurn" && effect.life <= 0) {
        triggeredHellfire.push(effect);
        return false;
      }
      return effect.life > 0;
    });
    for (const member of triggeredGrandHealEffects) {
      this.spawnEffect(member.x, member.y - member.jumpZ - 88, "#fff4a8", "heal");
      this.spawnEffect(member.x, member.y - member.jumpZ - 6, "#fff4a8", "grandHealCircle", 0.5);
      this.spawnEffect(member.x + (Math.random() - 0.5) * 42, member.y - member.jumpZ - 112, "#ffffff", "grandHealFeather", 0.55);
    }
    for (const effect of triggeredHellfire) {
      const target = effect.target;
      if (target && !target.defeated && target.hp > 0) {
        const hpBefore = target.hp;
        if (target.takeBurnDamage?.(effect.damage, GAME_CONFIG.battle)) {
          this.addSpiritForDamage(target.team, hpBefore, target.hp);
          this.spawnDamageNumber(target, effect.damage);
          this.spawnEffect(target.x, target.y - target.jumpZ - 62, "#2b0a30", "hellfireImpact", 0.45);
        }
      }
    }
  }

  draw() {
    const context = this.context;
    context.clearRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
    if (this.state === "modeSelect") {
      this.drawModeSelect();
      this.drawModeSelectOverlay();
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
    this.drawCounterReadyEffects(context);
    this.drawHellfireZones(context);
    this.drawMeteorLavaZones(context);

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

    this.drawSpecialShotTargetWarning(context);
    this.drawEffects();
    this.drawTripleBalls(context);
    this.drawChargeEffect();
    this.drawSpecialAnticipationEffect();
    this.drawMatchPlayerNames(context);
    if (DEBUG_MODE) this.drawDebugAreas();
    context.restore();

    this.drawHellfireFlash();
    this.drawTeamHpAdvantageGraph();
    this.drawSpiritGauges();
    if (this.state === "playing") this.drawMatchTitleButton();
    this.drawGamepadButtonMonitor();
    this.drawShotMultiplierDebug();

    if (this.state === "paused") {
      this.drawPauseMenu();
    } else if (this.state === "gameOver") {
      this.drawOverlay(this.message, "ボタン1またはSpaceでモード選択へ");
    }
  }

  drawSpecialShotTargetWarning(context) {
    const target = this.ball?.target;
    if (
      !this.ball?.isFlying ||
      this.ball.kind !== "shoot" ||
      !target ||
      target.defeated
    ) return;

    const phase = performance.now() / 95;
    const pulse = 0.5 + Math.sin(phase) * 0.5;
    const visualTop = target.getVisualTop();
    const visualBottom = target.y - target.jumpZ + 18;
    const bodyCenterY = (visualTop + visualBottom) * 0.5;
    const bodyRadius = Math.max(108, (visualBottom - visualTop) * 0.74);
    const y = visualTop - 136 - Math.sin(phase * 0.55) * 8;
    context.save();
    context.globalCompositeOperation = "screen";
    context.translate(target.x, bodyCenterY);
    context.scale(0.72, 1);
    const aura = context.createRadialGradient(0, 0, bodyRadius * 0.12, 0, 0, bodyRadius);
    aura.addColorStop(0, `rgba(255,245,120,${0.16 + pulse * 0.12})`);
    aura.addColorStop(0.48, `rgba(255,92,48,${0.2 + pulse * 0.16})`);
    aura.addColorStop(1, "rgba(255,40,24,0)");
    context.fillStyle = aura;
    context.shadowColor = "#ff4b2c";
    context.shadowBlur = 34 + pulse * 22;
    context.beginPath();
    context.arc(0, 0, bodyRadius * (0.96 + pulse * 0.08), 0, Math.PI * 2);
    context.fill();
    context.restore();

    context.save();
    context.globalCompositeOperation = "lighter";
    context.translate(target.x, bodyCenterY);
    context.scale(1, 0.56);
    context.rotate(phase * 0.16);
    context.globalAlpha = 0.72 + pulse * 0.28;
    context.strokeStyle = "#ff304a";
    context.lineWidth = 8;
    context.beginPath();
    context.arc(0, 0, bodyRadius * (0.86 + pulse * 0.04), 0, Math.PI * 2);
    context.stroke();
    context.strokeStyle = "#fff15a";
    context.lineWidth = 4;
    for (let mark = 0; mark < 4; mark += 1) {
      const angle = mark * Math.PI / 2;
      const inner = bodyRadius * 0.56;
      const outer = bodyRadius * 1.08;
      context.beginPath();
      context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
      context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
      context.stroke();
    }
    context.restore();

    context.save();
    context.globalAlpha = 0.42 + pulse * 0.58;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 98px Meiryo, sans-serif";
    context.lineJoin = "round";
    context.lineWidth = 14;
    context.strokeStyle = "rgba(255,255,255,0.96)";
    context.shadowColor = "#ff3b20";
    context.shadowBlur = 24 + pulse * 16;
    context.strokeText("!", target.x, y);
    context.lineWidth = 6;
    context.strokeStyle = "#8e1712";
    context.fillStyle = pulse > 0.5 ? "#fff15a" : "#ff4430";
    context.strokeText("!", target.x, y);
    context.fillText("!", target.x, y);
    context.restore();
  }

  drawModeSelectOverlay() {
    const context = this.context;
    const centerX = GAME_CONFIG.width * 0.5;
    const audioStatus = this.audio?.supported
      ? this.audio.enabled ? "ON" : "OFF"
      : "未対応";

    context.save();
    context.textAlign = "center";
    context.font = "18px Meiryo, sans-serif";
    context.fillStyle = this.audio?.enabled ? "#fff7df" : "#ffd0d0";
    context.fillText(`音声: ${audioStatus} / ボタン0で切替`, centerX, 555);

    context.textAlign = "right";
    context.font = "14px Meiryo, sans-serif";
    context.fillStyle = "rgba(255,247,223,0.78)";
    context.fillText(`最終更新: ${LAST_UPDATED_AT}`, GAME_CONFIG.width - 18, GAME_CONFIG.height - 18);
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

  drawWatchTeamSelect() {
    this.drawPlayableTeamSelectSide("left", 90, "LEFT CPU TEAM", "#0057ff");
    this.drawPlayableTeamSelectSide("right", 760, "RIGHT CPU TEAM", "#f01818");
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
    context.fillText("D", x + 326, y + 92);
    context.fillText("Pa", x + 350, y + 92);
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
      context.fillText(String(stats.defense ?? 6), x + 330, rowY);
      context.fillText(String(stats.pass ?? 6), x + 354, rowY);
      context.fillText(this.getSpecialShotShortLabel(player.specialShotType), x + 384, rowY);
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
    context.fillText("D", x + 292, y + 64);
    context.fillText("Pa", x + 316, y + 64);
    context.fillText("技", x + 348, y + 64);

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
      context.fillText(String(stats.defense ?? 6), x + 296, rowY);
      context.fillText(String(stats.pass ?? 6), x + 322, rowY);
      context.fillText(this.getSpecialShotShortLabel(player.specialShotType), x + 350, rowY);
    }
  }

  getSpecialShotShortLabel(specialType) {
    if (specialType === "kiai") return "気";
    if (specialType === "braveSlash") return "勇";
    if (specialType === "gigaBreak") return "剛";
    if (specialType === "fireball") return "炎";
    if (specialType === "holyLance") return "聖";
    if (specialType === "shiningArrow") return "矢";
    if (specialType === "hundredRush") return "拳";
    if (specialType === "lunaticMirage") return "幻";
    if (specialType === "victoryMarch") return "奏";
    if (specialType === "grandHeal") return "癒";
    if (specialType === "none") return "-";
    if (specialType === "triple") return "三";
    if (specialType === "boost") return "ブ";
    if (specialType === "lightning") return "雷";
    if (specialType === "iron") return "鉄";
    if (specialType === "boomerang") return "バ";
    if (specialType === "devilShield") return "盾";
    if (specialType === "devilClaw") return "爪";
    if (specialType === "soul") return "魂";
    if (specialType === "slap") return "張";
    if (specialType === "tsutenkaku") return "\u901a";
    if (specialType === "meteorCrash") return "\u30e1";
    if (specialType === "clockStop") return "時";
    if (specialType === "lockRocket") return "ロ";
    if (specialType === "ufoSpin") return "G";
    if (specialType === "hellfire") return "\u706b";
    if (specialType === "bloodDrain") return "\u5438";
    if (specialType === "arcanaSphere") return "\u9b54";
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
      context.fillText(i < 5 ? `内野 ${i + 1}` : `外野 ${i - 4}`, cardX + 54, cardY + 50);
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

  drawPlayableTeamSelectSide(side, x, title, color) {
    const team = this.getSelectedTeamForSide(side);
    const editable = Boolean(this.isEditableRosterTeam(team) && this.teamSelectionConfirmed?.[side]);
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
    context.fillText(editable ? (this.isBravesTeam(team) ? "職業選択メンバー" : "自由編成メンバー") : team?.name || "", x, y - 12);

    for (let i = 0; i < TEAM_SELECTION_COUNT; i += 1) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      const cardX = x + col * 136;
      const cardY = y + row * 180;
      if (i === 0) {
        context.fillStyle = "#dff8ff";
        context.fillRect(x - 8, y - 36, 600, 34);
      }
      const bravesPlayer = this.isBravesTeam(team) ? this.getBravesPlayerDefinition(side, i) : null;
      const player = editable && team?.isCustom ? null : bravesPlayer || team?.players?.[i];
      const type = editable && team?.isCustom
        ? this.teamSelections[side][i]
        : player?.characterType || team?.characterType || "normal";
      const definition = CHARACTER_TYPES[type] || CHARACTER_TYPES.normal;
      const stats = editable && team?.isCustom ? definition.stats : player?.stats || team?.stats || definition.stats;
      const maxHp = editable && team?.isCustom ? definition.maxHp : player?.maxHp ?? team?.maxHp ?? definition.maxHp;
      const roleLabel = editable
        ? (this.isBravesTeam(team) && i >= 5 ? `外野 ${i - 4}` : i < 5 ? `内野 ${i + 1}` : `外野 ${i - 4}`)
        : (player?.position === "out" ? "外野" : "内野");
      const bravesJobId = this.isBravesTeam(team) ? String(player?.uniformEmblem || "").replace("braves-", "") : "";
      const bravesDisplay = bravesJobId ? BRAVES_JOB_NAMES[bravesJobId] : null;
      const title = editable && team?.isCustom
        ? this.getTeamSlotName(team, i) || definition.label
        : bravesDisplay
          ? `${bravesDisplay.job} ${player?.name || bravesDisplay.name}`
          : player?.name || definition.label;
      const selected = editable && this.isTeamSelectSlotSelected(side, i);
      const previewStyle = editable && team?.isCustom ? null : {
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
      context.textAlign = "left";
      context.fillText(roleLabel, cardX + 13, cardY + 32);
      context.textAlign = "right";
      context.font = "bold 12px Meiryo, sans-serif";
      context.fillText(`HP ${maxHp}`, cardX + 111, cardY + 32);

      context.save();
      context.beginPath();
      context.rect(cardX + 5, cardY + 38, 112, 90);
      context.clip();
      this.drawCharacterPreview(cardX + 61, cardY + 116, side, type, previewStyle, 0.36);
      context.restore();

      context.fillStyle = "#263241";
      context.textAlign = "center";
      context.font = "11px Meiryo, sans-serif";
      context.fillText(
        `P${stats.power ?? "-"} S${stats.speed ?? "-"} J${stats.jump ?? "-"} T${stats.technique ?? "-"}`,
        cardX + 61,
        cardY + 143
      );
      context.font = "10px Meiryo, sans-serif";
      context.fillText(
        `D${stats.defense ?? 6} Pa${stats.pass ?? 6}`,
        cardX + 61,
        cardY + 156
      );
      context.fillText(
        this.isBravesTeam(team) && editable && i >= 5 ? "弓使い" : this.getSpecialShotLabel(player?.specialShotType),
        cardX + 61,
        cardY + 168
      );
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
    this.drawRosterChoiceMenu(side, team, x, y, editable);
    context.restore();
  }

  drawRosterChoiceMenu(side, team, x, y, editable) {
    const menu = this.rosterChoiceMenu;
    if (!editable || !menu || menu.side !== side) return;
    const options = this.getRosterChoiceOptions(side, menu.slot, team);
    if (options.length === 0) return;

    const context = this.context;
    const row = Math.floor(menu.slot / 4);
    const col = menu.slot % 4;
    const cardX = x + col * 136;
    const cardY = y + row * 180;
    const width = this.isBravesTeam(team) ? 214 : 170;
    const rowHeight = 30;
    const menuHeight = options.length * rowHeight + 44;
    const menuX = Math.min(GAME_CONFIG.width - width - 24, cardX + 82);
    const menuY = Math.max(94, Math.min(GAME_CONFIG.height - menuHeight - 20, cardY + 22));

    context.save();
    context.fillStyle = "rgba(255,255,255,0.98)";
    context.strokeStyle = "#263241";
    context.lineWidth = 4;
    this.roundRect(context, menuX, menuY, width, menuHeight, 8);
    context.fill();
    context.stroke();

    context.textAlign = "left";
    context.fillStyle = "#263241";
    context.font = "bold 14px Meiryo, sans-serif";
    context.fillText(this.isBravesTeam(team) ? "キャラ選択" : "タイプ選択", menuX + 14, menuY + 24);

    for (let i = 0; i < options.length; i += 1) {
      const optionY = menuY + 36 + i * rowHeight;
      const selected = i === menu.index;
      if (selected) {
        context.fillStyle = "rgba(255,216,61,0.9)";
        this.roundRect(context, menuX + 8, optionY, width - 16, rowHeight - 5, 6);
        context.fill();
      }
      context.fillStyle = "#263241";
      context.font = selected ? "bold 15px Meiryo, sans-serif" : "14px Meiryo, sans-serif";
      context.fillText(options[i].label, menuX + 18, optionY + 19);
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
      ? this.teamSelectionSlot === START_SLOT
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
    if (
      style?.uniformEmblem === "arkmaLord" ||
      style?.uniformEmblem === "lavaGolem" ||
      style?.uniformEmblem === "vampire" ||
      style?.uniformEmblem === "witch" ||
      style?.uniformEmblem === "shieldDevil" ||
      style?.uniformEmblem === "miniDevil" ||
      String(style?.uniformEmblem || "").startsWith("braves-") ||
      type === "demon" ||
      type === "lavaGolem" ||
      type === "vampire" ||
      type === "witch" ||
      type === "shieldDevil" ||
      type === "miniDevil"
    ) {
      this.drawPlayerModelPreview(x, y, side, type, style, scale);
      return;
    }
    if (style?.uniformEmblem === "robot" || style?.uniformEmblem === "robotCaptain") {
      this.drawRobotPreview(x, y, style, scale);
      return;
    }
    if (type === "demon" || style?.uniformEmblem === "arkmaLord") {
      this.drawDemonPreview(x, y, style, scale);
      return;
    }
    if (type === "lavaGolem" || style?.uniformEmblem === "lavaGolem") {
      this.drawLavaGolemPreview(x, y, style, scale);
      return;
    }
    const body = CHARACTER_TYPES[type] || CHARACTER_TYPES.normal;
    const suit = style?.uniformColor || (side === "left" ? "#0057ff" : "#f01818");
    const pants = style?.pantsColor || suit;
    const hair = style?.hairColor || "#f2c14e";
    const skin = style?.faceColor || "#ffd1a3";
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
    context.strokeStyle = skin;
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
    context.fillStyle = skin;
    context.beginPath();
    context.arc(0, -100, 29, 0, Math.PI * 2);
    if (body.headScale && body.headScale !== 1) {
      context.restore();
      context.save();
      context.translate(x, y);
      context.scale(body.scaleX * scale, body.scaleY * scale);
      context.fillStyle = skin;
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

  drawPlayerModelPreview(x, y, side, type, style = null, scale = 0.48) {
    const previewPlayer = new Player({
      id: `preview-${style?.name || type || "player"}`,
      name: style?.name || "",
      team: side,
      role: "out",
      zone: "out",
      x,
      y,
      radius: style?.radius || (type === "lavaGolem" || style?.uniformEmblem === "lavaGolem" ? 66 : 37),
      characterType: type || style?.characterType || "normal",
      stats: style?.stats,
      maxHp: style?.maxHp,
      maxStamina: style?.maxStamina,
      uniformColor: style?.uniformColor,
      pantsColor: style?.pantsColor,
      uniformEmblem: style?.uniformEmblem,
      trimColor: style?.trimColor,
      faceColor: style?.faceColor,
      hairColor: style?.hairColor,
      eyeColor: style?.eyeColor,
      specialShotType: style?.specialShotType,
      cpuControlled: true
    });
    previewPlayer.visualDirection = "down";
    previewPlayer.robotBodyDirection = "down";
    previewPlayer.robotHeadDirection = "down";
    previewPlayer.facing = 1;
    previewPlayer.lastDrawScale = 1;

    const modelScale = (type === "demon" || style?.uniformEmblem === "arkmaLord")
      ? scale * 0.56
      : (type === "lavaGolem" || style?.uniformEmblem === "lavaGolem")
        ? scale * 0.46
        : (type === "shieldDevil" || style?.uniformEmblem === "shieldDevil")
          ? scale * 0.82
          : (type === "miniDevil" || style?.uniformEmblem === "miniDevil")
            ? scale * 0.82
            : (type === "vampire" || style?.uniformEmblem === "vampire")
              ? scale * 0.95
              : (type === "witch" || style?.uniformEmblem === "witch")
                ? scale * 0.94
                : scale;
    const previewConfig = {
      ...GAME_CONFIG.battle,
      depthTop: y - 120,
      depthBottom: y + 120,
      characterScale: modelScale * 1.55,
      exitDelay: GAME_CONFIG.battle.exitDelay || 0.9
    };
    previewPlayer.draw(this.context, previewConfig, false, false, false, false, false, 1);
  }

  drawDemonPreview(x, y, style = null, scale = 0.48) {
    const context = this.context;
    const bodyColor = style?.faceColor || "#43205f";
    const armor = style?.uniformColor || "#0c0a10";
    const gold = style?.trimColor || "#d7a331";
    const eyeColor = style?.eyeColor || "#ff304a";
    context.save();
    context.translate(x, y);
    context.scale(scale * 1.08, scale * 1.08);

    const cape = context.createLinearGradient(0, -80, 0, 86);
    cape.addColorStop(0, "#050407");
    cape.addColorStop(0.56, "#0c060a");
    cape.addColorStop(1, "#3a050b");
    context.fillStyle = cape;
    context.strokeStyle = "#050407";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(-45, -77);
    context.quadraticCurveTo(-78, -63, -84, 84);
    context.lineTo(-31, 60);
    context.quadraticCurveTo(-18, 17, -20, -65);
    context.lineTo(20, -65);
    context.quadraticCurveTo(18, 17, 31, 60);
    context.lineTo(84, 84);
    context.quadraticCurveTo(78, -63, 45, -77);
    context.closePath();
    context.fill();
    context.stroke();

    context.save();
    context.globalAlpha = 0.38;
    context.strokeStyle = "#5d0a17";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-35, -66);
    context.quadraticCurveTo(-47, -25, -49, 52);
    context.moveTo(35, -66);
    context.quadraticCurveTo(47, -25, 49, 52);
    context.stroke();
    context.restore();

    context.strokeStyle = "#171019";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 20;
    context.beginPath();
    context.moveTo(-13, 8);
    context.lineTo(-18, 45);
    context.lineTo(-20, 100);
    context.moveTo(13, 8);
    context.lineTo(18, 45);
    context.lineTo(20, 100);
    context.stroke();

    context.strokeStyle = bodyColor;
    context.lineWidth = 13;
    context.beginPath();
    context.moveTo(-39, -70);
    context.lineTo(-49, -24);
    context.lineTo(-43, -1);
    context.moveTo(39, -70);
    context.lineTo(49, -24);
    context.lineTo(43, -1);
    context.stroke();

    context.fillStyle = gold;
    context.strokeStyle = "#4d3209";
    context.lineWidth = 3;
    for (const side of [-1, 1]) {
      context.beginPath();
      context.ellipse(side * 33, -71, 16, 11, side * -0.2, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    }

    context.fillStyle = armor;
    context.strokeStyle = "#050407";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(-30, -68);
    context.lineTo(30, -68);
    context.lineTo(17, 1);
    context.lineTo(0, 10);
    context.lineTo(-17, 1);
    context.closePath();
    context.fill();
    context.stroke();

    context.fillStyle = "#4f0e18";
    context.strokeStyle = "#20040a";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(-11, -62);
    context.lineTo(11, -62);
    context.lineTo(7, -1);
    context.lineTo(-7, -1);
    context.closePath();
    context.fill();
    context.stroke();

    context.strokeStyle = gold;
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(-9, -31);
    context.lineTo(0, -45);
    context.lineTo(9, -31);
    context.lineTo(0, -17);
    context.closePath();
    context.stroke();
    context.fillStyle = gold;
    context.fill();

    context.fillStyle = gold;
    context.fillRect(-22, 8, 44, 8);
    context.strokeStyle = "#4d3209";
    context.lineWidth = 2;
    context.strokeRect(-22, 8, 44, 8);

    const mantleFront = context.createLinearGradient(0, -76, 0, 106);
    mantleFront.addColorStop(0, "#050407");
    mantleFront.addColorStop(0.52, "#060407");
    mantleFront.addColorStop(1, "#26050c");
    context.fillStyle = mantleFront;
    context.strokeStyle = "#020103";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(-49, -76);
    context.quadraticCurveTo(-63, -64, -68, -36);
    context.quadraticCurveTo(-76, 21, -62, 100);
    context.quadraticCurveTo(-34, 110, 0, 106);
    context.quadraticCurveTo(34, 110, 62, 100);
    context.quadraticCurveTo(76, 21, 68, -36);
    context.quadraticCurveTo(63, -64, 49, -76);
    context.quadraticCurveTo(28, -66, 14, -53);
    context.quadraticCurveTo(7, 8, 0, 8);
    context.quadraticCurveTo(-7, 8, -14, -53);
    context.quadraticCurveTo(-28, -66, -49, -76);
    context.closePath();
    context.fill();
    context.stroke();
    context.save();
    context.globalAlpha = 0.4;
    context.strokeStyle = "#5d0a17";
    context.lineWidth = 2.5;
    context.beginPath();
    context.moveTo(-33, -60);
    context.quadraticCurveTo(-39, 18, -32, 92);
    context.moveTo(33, -60);
    context.quadraticCurveTo(39, 18, 32, 92);
    context.stroke();
    context.restore();

    context.fillStyle = bodyColor;
    context.strokeStyle = "#251133";
    context.lineWidth = 3;
    context.beginPath();
    context.ellipse(0, -93, 21, 25, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.fillStyle = bodyColor;
    context.beginPath();
    context.moveTo(-19, -94);
    context.lineTo(-40, -98);
    context.lineTo(-24, -84);
    context.moveTo(19, -94);
    context.lineTo(40, -98);
    context.lineTo(24, -84);
    context.fill();

    context.fillStyle = "#050407";
    context.beginPath();
    context.moveTo(-17, -115);
    context.quadraticCurveTo(-54, -151, -80, -147);
    context.quadraticCurveTo(-55, -136, -26, -103);
    context.quadraticCurveTo(-21, -111, -17, -115);
    context.moveTo(17, -115);
    context.quadraticCurveTo(54, -151, 80, -147);
    context.quadraticCurveTo(55, -136, 26, -103);
    context.quadraticCurveTo(21, -111, 17, -115);
    context.fill();
    context.strokeStyle = "#171019";
    context.lineWidth = 3;
    context.stroke();

    context.fillStyle = "#050407";
    context.strokeStyle = "#1b1720";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(-23, -116);
    context.lineTo(-14, -129);
    context.lineTo(-6, -122);
    context.lineTo(0, -134);
    context.lineTo(6, -122);
    context.lineTo(14, -129);
    context.lineTo(23, -116);
    context.lineTo(15, -110);
    context.lineTo(-15, -110);
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = "#b31534";
    context.strokeStyle = "#ffb85a";
    context.lineWidth = 1.5;
    context.beginPath();
    context.arc(0, -119, 4.2, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.fillStyle = eyeColor;
    context.shadowColor = eyeColor;
    context.shadowBlur = 12;
    context.beginPath();
    context.arc(-10, -98, 5, 0, Math.PI * 2);
    context.arc(10, -98, 5, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;
    context.restore();
  }

  drawFireDragonPreview(x, y, style = null, scale = 0.48) {
    const context = this.context;
    const skin = style?.faceColor || "#7c1914";
    const horn = style?.trimColor || "#d9a831";
    context.save();
    context.translate(x, y);
    context.scale(scale * 1.22, scale * 1.28);
    context.fillStyle = "#0a0506";
    context.strokeStyle = "#050303";
    context.lineWidth = 3;
    for (const side of [-1, 1]) {
      context.beginPath();
      context.moveTo(side * 18, -62);
      context.quadraticCurveTo(side * 70, -92, side * 88, -52);
      context.quadraticCurveTo(side * 58, -30, side * 22, -35);
      context.closePath();
      context.fillStyle = "#a51c1c";
      context.fill();
      context.stroke();
      context.strokeStyle = "#070404";
      context.beginPath();
      context.moveTo(side * 22, -61);
      context.lineTo(side * 78, -53);
      context.stroke();
    }
    context.strokeStyle = skin;
    context.lineCap = "round";
    context.lineWidth = 17;
    context.beginPath();
    context.moveTo(-24, -48);
    context.lineTo(-44, -12);
    context.lineTo(-51, 25);
    context.moveTo(24, -48);
    context.lineTo(44, -12);
    context.lineTo(51, 25);
    context.stroke();
    context.lineWidth = 16;
    context.beginPath();
    context.moveTo(-15, 1);
    context.lineTo(-23, 36);
    context.lineTo(-21, 66);
    context.moveTo(15, 1);
    context.lineTo(23, 36);
    context.lineTo(21, 66);
    context.stroke();
    context.fillStyle = skin;
    context.strokeStyle = "#190504";
    context.lineWidth = 4;
    context.beginPath();
    context.ellipse(0, -27, 42, 53, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = "#eed7a1";
    context.beginPath();
    context.ellipse(0, -14, 19, 39, 0, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#ff5a1f";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-30, -59);
    context.lineTo(-16, -37);
    context.moveTo(30, -57);
    context.lineTo(16, -35);
    context.stroke();
    context.fillStyle = skin;
    context.strokeStyle = "#190504";
    context.lineWidth = 4;
    context.beginPath();
    context.ellipse(6, -92, 35, 30, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.beginPath();
    context.ellipse(30, -84, 34, 17, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = horn;
    for (const side of [-1, 1]) {
      context.beginPath();
      context.moveTo(side * 15, -116);
      context.quadraticCurveTo(side * 52, -142, side * 76, -132);
      context.quadraticCurveTo(side * 46, -125, side * 26, -99);
      context.closePath();
      context.fill();
    }
    context.fillStyle = "#ffd43b";
    context.beginPath();
    context.ellipse(-2, -92, 7, 4, 0, 0, Math.PI * 2);
    context.ellipse(20, -91, 7, 4, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#050505";
    context.fillRect(-2, -96, 2, 8);
    context.fillRect(20, -95, 2, 8);
    context.fillStyle = "#ff7a18";
    context.beginPath();
    context.ellipse(63, -84, 11, 5, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#080505";
    context.beginPath();
    context.moveTo(-9, 11);
    context.quadraticCurveTo(-58, 31, -76, 62);
    context.lineTo(-63, 57);
    context.quadraticCurveTo(-42, 38, -16, 28);
    context.closePath();
    context.fill();
    context.restore();
  }

  drawLavaGolemPreview(x, y, style = null, scale = 0.48) {
    const context = this.context;
    const rock = style?.faceColor || "#4a3024";
    const rockShadow = "#2a1a14";
    const lava = style?.trimColor || "#ff7a1f";
    context.save();
    context.translate(x, y);
    context.scale(scale * 1.83, scale * 1.62);

    context.fillStyle = rockShadow;
    context.strokeStyle = "#1b100c";
    context.lineWidth = 4;
    context.beginPath();
    context.ellipse(-75, 35, 31, 15, -0.45, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.strokeStyle = rock;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 22;
    context.beginPath();
    context.moveTo(-34, -45);
    context.lineTo(-62, -15);
    context.lineTo(-72, 20);
    context.moveTo(34, -45);
    context.lineTo(62, -15);
    context.lineTo(72, 20);
    context.moveTo(-20, 12);
    context.lineTo(-27, 38);
    context.lineTo(-31, 51);
    context.moveTo(20, 12);
    context.lineTo(27, 38);
    context.lineTo(31, 51);
    context.stroke();

    context.fillStyle = rock;
    context.strokeStyle = "#1b100c";
    context.lineWidth = 5;
    context.beginPath();
    context.ellipse(0, -21, 80, 87, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = "#6a4030";
    context.beginPath();
    context.ellipse(-24, -30, 42, 54, -0.2, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = rockShadow;
    context.beginPath();
    context.ellipse(27, -1, 47, 51, 0.2, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    const crack = (points, width = 5) => {
      context.save();
      context.globalCompositeOperation = "lighter";
      context.strokeStyle = lava;
      context.lineWidth = width;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.beginPath();
      context.moveTo(points[0], points[1]);
      for (let i = 2; i < points.length; i += 2) context.lineTo(points[i], points[i + 1]);
      context.stroke();
      context.strokeStyle = "#ffd36a";
      context.lineWidth = 2;
      context.stroke();
      context.restore();
    };
    crack([-42, -68, -14, -38, -29, -6, -3, 38]);
    crack([18, -84, 45, -52, 27, -19, 60, 15], 4);
    crack([-8, -99, 6, -62, -11, -23, 14, 16], 4);

    context.fillStyle = rock;
    context.strokeStyle = "#1b100c";
    context.lineWidth = 5;
    context.beginPath();
    context.ellipse(0, -83, 39, 30, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = "#ffd43b";
    context.beginPath();
    context.ellipse(-14, -83, 8, 5, 0, 0, Math.PI * 2);
    context.ellipse(14, -83, 8, 5, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#fff0a6";
    context.beginPath();
    context.ellipse(-14, -83, 3, 2, 0, 0, Math.PI * 2);
    context.ellipse(14, -83, 3, 2, 0, 0, Math.PI * 2);
    context.fill();

    context.save();
    context.globalCompositeOperation = "lighter";
    context.fillStyle = lava;
    context.beginPath();
    context.ellipse(0, -116, 13, 7, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ffd36a";
    context.beginPath();
    context.ellipse(0, -119, 6, 4, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();

    context.fillStyle = rock;
    for (const hand of [{ x: -72, y: 20 }, { x: 72, y: 20 }]) {
      context.beginPath();
      context.ellipse(hand.x, hand.y, 20, 16, 0, 0, Math.PI * 2);
      context.fill();
      crack([hand.x - 8, hand.y - 4, hand.x + 1, hand.y + 1, hand.x + 9, hand.y - 5], 3);
    }

    context.restore();
  }

  drawRobotPreview(x, y, style, scale) {
    const context = this.context;
    const captain = style?.uniformEmblem === "robotCaptain";
    const robotNumbers = {
      "ゼロ": "00", "ボルト": "01", "ギア": "02", "ピストン": "03",
      "センサー": "04", "レーダー": "05", "コイル": "06", "ビット": "07"
    };
    context.save();
    context.translate(x, y);
    context.scale(scale, scale);
    context.lineCap = "round";
    context.lineJoin = "round";

    if (captain) {
      context.fillStyle = "#b9272f";
      context.strokeStyle = "#68141a";
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(-24, -78);
      context.lineTo(-46, -4);
      context.lineTo(-10, -18);
      context.closePath();
      context.fill();
      context.stroke();
    }

    context.strokeStyle = "#1d2428";
    context.lineWidth = 18;
    context.beginPath();
    context.moveTo(-13, -34);
    context.lineTo(-20, 15);
    context.moveTo(13, -34);
    context.lineTo(20, 15);
    context.moveTo(-26, -75);
    context.lineTo(-43, -30);
    context.moveTo(26, -75);
    context.lineTo(43, -30);
    context.stroke();
    context.strokeStyle = "#aeb9bf";
    context.lineWidth = 10;
    context.stroke();

    const metal = context.createLinearGradient(-34, -108, 34, -22);
    metal.addColorStop(0, "#f7fafb");
    metal.addColorStop(0.5, "#b9c3c9");
    metal.addColorStop(1, "#707c84");
    context.fillStyle = metal;
    context.strokeStyle = "#46525a";
    context.lineWidth = 4;
    this.roundRect(context, -31, -102, 62, 72, 17);
    context.fill();
    context.stroke();
    context.fillStyle = "#263139";
    this.roundRect(context, -18, -79, 36, 27, 4);
    context.fill();
    context.fillStyle = "#dffefa";
    context.font = "bold 17px Consolas, monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(robotNumbers[style?.name] || "99", 0, -65);

    context.fillStyle = metal;
    this.roundRect(context, -36, -151, 72, 54, 22);
    context.fill();
    context.stroke();
    context.fillStyle = "#17252a";
    this.roundRect(context, -27, -132, 54, 17, 8);
    context.fill();
    context.shadowColor = "#41f2dc";
    context.shadowBlur = 12;
    context.fillStyle = "#41f2dc";
    this.roundRect(context, -21, -128, 42, 9, 5);
    context.fill();
    context.shadowBlur = 0;

    context.strokeStyle = "#56636b";
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(0, -151);
    context.lineTo(0, -168);
    context.stroke();
    context.fillStyle = captain ? "#f1c33d" : "#829099";
    context.strokeStyle = captain ? "#9d7411" : "#46525a";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(0, -173, captain ? 9 : 7, 0, Math.PI * 2);
    context.fill();
    context.stroke();
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
    if (this.isFinalBattleCourt()) {
      this.drawFinalBattleBackground();
      return;
    }
    const context = this.context;
    const c = GAME_CONFIG.court;
    const width = c.x + c.w + 260;
    context.fillStyle = "#bfc36d";
    context.fillRect(c.x - 420, c.y - 310, width + 840, c.h + 620);
    this.drawBench(c.centerX - 650, -56, "#3087f2");
    this.drawBench(c.centerX + 430, -56, "#f05a45");
    this.drawMatchTimeBoard(c.centerX, -42, false);
  }

  getMatchTimeText() {
    const totalSeconds = Math.max(0, Math.floor(this.matchElapsedTime || 0));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  drawMatchTimeBoard(x, y, dark = false) {
    const context = this.context;
    const timeText = this.getMatchTimeText();
    context.save();
    context.translate(x, y);
    context.fillStyle = "rgba(0,0,0,0.18)";
    context.beginPath();
    context.ellipse(0, 64, 126, 12, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = dark ? "#17101c" : "#f7f0d2";
    context.strokeStyle = dark ? "#8e6b2b" : "#473f31";
    context.lineWidth = 4;
    this.roundRect(context, -118, -32, 236, 82, 7);
    context.fill();
    context.stroke();
    context.fillStyle = dark ? "#2c2034" : "#3e4b3f";
    this.roundRect(context, -100, -17, 200, 52, 5);
    context.fill();
    context.strokeStyle = dark ? "rgba(255,214,106,0.55)" : "rgba(255,255,255,0.28)";
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = dark ? "#f6d276" : "#fff36a";
    context.font = "bold 15px Meiryo, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("TIME", 0, -4);
    context.fillStyle = dark ? "#fff4a8" : "#ffffff";
    context.font = "bold 34px Consolas, 'Courier New', monospace";
    context.fillText(timeText, 0, 23);
    context.fillStyle = dark ? "#6c5428" : "#6b5a37";
    context.fillRect(-91, 50, 10, 40);
    context.fillRect(81, 50, 10, 40);
    context.restore();
  }

  isFinalBattleCourt() {
    const teams = [...(this.leftTeam || []), ...(this.rightTeam || [])];
    return teams.some((member) => (
      member?.cpuProfile === "arkmaz" ||
      member?.cpuProfile === "arkmaGuard" ||
      member?.uniformEmblem === "arkmaLord"
    ));
  }

  drawFinalBattleBackground() {
    const context = this.context;
    const c = GAME_CONFIG.court;
    const time = performance.now();
    const left = c.x - 760;
    const top = c.y - 520;
    const width = c.w + 1520;
    const height = c.h + 920;
    const bg = context.createLinearGradient(0, top, 0, top + height);
    bg.addColorStop(0, "#12091f");
    bg.addColorStop(0.34, "#251334");
    bg.addColorStop(0.7, "#3a243c");
    bg.addColorStop(1, "#4c3842");
    context.fillStyle = bg;
    context.fillRect(left, top, width, height);

    const moonX = c.centerX + 860;
    const moonY = c.y - 314;
    const moonGlow = context.createRadialGradient(moonX, moonY, 20, moonX, moonY, 290);
    moonGlow.addColorStop(0, "rgba(255,110,96,0.95)");
    moonGlow.addColorStop(0.42, "rgba(178,30,52,0.6)");
    moonGlow.addColorStop(1, "rgba(178,30,52,0)");
    context.fillStyle = moonGlow;
    context.beginPath();
    context.arc(moonX, moonY, 292, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#b82338";
    context.beginPath();
    context.arc(moonX, moonY, 164, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "rgba(55,8,24,0.28)";
    for (let i = 0; i < 5; i += 1) {
      context.beginPath();
      context.ellipse(moonX - 68 + i * 35, moonY - 46 + Math.sin(i) * 34, 20 + i * 5, 9 + i * 2, 0.4, 0, Math.PI * 2);
      context.fill();
    }

    context.fillStyle = "rgba(16,8,24,0.72)";
    for (let i = 0; i < 9; i += 1) {
      const x = left + 180 + i * 440 + Math.sin(time / 2400 + i) * 30;
      const y = top + 95 + (i % 3) * 58;
      context.beginPath();
      context.ellipse(x, y, 180, 42, 0, 0, Math.PI * 2);
      context.ellipse(x + 96, y + 14, 130, 34, 0, 0, Math.PI * 2);
      context.ellipse(x - 92, y + 18, 120, 30, 0, 0, Math.PI * 2);
      context.fill();
    }

    const lightningPhase = Math.floor(time / 900) % 5;
    if (lightningPhase === 0 || lightningPhase === 3) {
      context.save();
      context.globalAlpha = 0.42;
      context.strokeStyle = "#b78cff";
      context.lineWidth = 12;
      context.lineJoin = "round";
      context.beginPath();
      const lx = c.centerX - 720 + (lightningPhase === 3 ? 1470 : 0);
      context.moveTo(lx, top + 70);
      context.lineTo(lx + 70, top + 168);
      context.lineTo(lx + 18, top + 168);
      context.lineTo(lx + 104, top + 302);
      context.lineTo(lx + 34, top + 224);
      context.stroke();
      context.strokeStyle = "#f4d8ff";
      context.lineWidth = 4;
      context.stroke();
      context.restore();
    }

    const floorBackY = c.y - 60;
    const wall = context.createLinearGradient(0, top + 220, 0, floorBackY + 120);
    wall.addColorStop(0, "#14121d");
    wall.addColorStop(1, "#262033");
    context.fillStyle = wall;
    context.fillRect(left, top + 260, width, floorBackY - top);

    for (let i = 0; i < 7; i += 1) {
      const side = i < 4 ? -1 : 1;
      const index = i < 4 ? i : i - 4;
      const x = c.centerX + side * (520 + index * 330);
      const pillarTop = c.y - 320;
      const pillarH = 520;
      context.fillStyle = "#171520";
      context.fillRect(x - 38, pillarTop, 76, pillarH);
      context.fillStyle = "#2a2434";
      context.fillRect(x - 24, pillarTop + 28, 48, pillarH - 44);
      context.fillStyle = "#0c0a11";
      context.fillRect(x - 52, pillarTop - 12, 104, 28);
      context.fillRect(x - 58, pillarTop + pillarH - 18, 116, 34);
      context.fillStyle = "#a22532";
      context.beginPath();
      context.moveTo(x - 30, pillarTop + 64);
      context.lineTo(x + 30, pillarTop + 64);
      context.lineTo(x + 18, pillarTop + 158);
      context.lineTo(x, pillarTop + 130);
      context.lineTo(x - 18, pillarTop + 158);
      context.closePath();
      context.fill();
    }

    this.drawFinalBattleThrone(c.centerX, c.y - 126);
    this.drawFinalBattleTorch(c.centerX - 1010, c.y - 92, "#57b8ff");
    this.drawFinalBattleTorch(c.centerX + 1010, c.y - 92, "#d52b66");
    this.drawMatchTimeBoard(c.centerX, -42, true);

    context.fillStyle = "rgba(255,94,34,0.26)";
    for (let i = 0; i < 8; i += 1) {
      const x = left + 220 + i * 360;
      const y = c.y + c.h + 250 + Math.sin(time / 700 + i) * 8;
      context.beginPath();
      context.ellipse(x, y, 150, 24, 0, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "rgba(255,160,42,0.45)";
      context.beginPath();
      context.moveTo(x - 38, y - 12);
      context.quadraticCurveTo(x, y - 80 - (i % 3) * 16, x + 38, y - 12);
      context.fill();
      context.fillStyle = "rgba(255,94,34,0.26)";
    }

    for (let i = 0; i < 10; i += 1) {
      const x = c.centerX + 520 + Math.sin(time / 1500 + i * 0.7) * 620 + i * 70;
      const y = c.y - 270 + Math.cos(time / 1900 + i) * 70;
      context.fillStyle = "rgba(6,4,10,0.75)";
      context.beginPath();
      context.moveTo(x, y);
      context.quadraticCurveTo(x - 18, y - 12, x - 42, y);
      context.quadraticCurveTo(x - 18, y + 3, x, y);
      context.quadraticCurveTo(x + 18, y - 12, x + 42, y);
      context.quadraticCurveTo(x + 18, y + 3, x, y);
      context.fill();
    }
  }

  drawFinalBattleThrone(x, y) {
    const context = this.context;
    context.save();
    context.translate(x, y);
    context.fillStyle = "rgba(0,0,0,0.28)";
    context.beginPath();
    context.ellipse(0, 178, 260, 36, 0, 0, Math.PI * 2);
    context.fill();
    const throne = context.createLinearGradient(0, -180, 0, 190);
    throne.addColorStop(0, "#2d2431");
    throne.addColorStop(0.55, "#17101c");
    throne.addColorStop(1, "#09070d");
    context.fillStyle = throne;
    context.strokeStyle = "#8e6b2b";
    context.lineWidth = 8;
    context.beginPath();
    context.moveTo(-140, 170);
    context.lineTo(-124, -68);
    context.lineTo(-72, -168);
    context.lineTo(-32, -92);
    context.lineTo(0, -202);
    context.lineTo(32, -92);
    context.lineTo(72, -168);
    context.lineTo(124, -68);
    context.lineTo(140, 170);
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = "#5a1024";
    context.beginPath();
    context.moveTo(-78, 142);
    context.quadraticCurveTo(0, 72, 78, 142);
    context.lineTo(68, -32);
    context.quadraticCurveTo(0, -76, -68, -32);
    context.closePath();
    context.fill();
    context.strokeStyle = "rgba(255,190,86,0.54)";
    context.lineWidth = 4;
    for (let i = -1; i <= 1; i += 1) {
      context.beginPath();
      context.moveTo(i * 44, -44);
      context.lineTo(i * 58, 130);
      context.stroke();
    }
    context.restore();
  }

  drawFinalBattleTorch(x, y, color) {
    const context = this.context;
    const time = performance.now();
    context.save();
    context.translate(x, y);
    context.fillStyle = "#161018";
    context.fillRect(-20, 0, 40, 170);
    context.fillStyle = "#6c5428";
    context.fillRect(-34, -8, 68, 24);
    const glow = context.createRadialGradient(0, -32, 6, 0, -32, 112);
    glow.addColorStop(0, color);
    glow.addColorStop(0.45, "rgba(255,90,55,0.5)");
    glow.addColorStop(1, "rgba(255,90,55,0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(0, -32, 112, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(-28, -5);
    context.quadraticCurveTo(-8, -72 - Math.sin(time / 160) * 10, 0, -30);
    context.quadraticCurveTo(8, -82 + Math.cos(time / 140) * 10, 28, -5);
    context.closePath();
    context.fill();
    context.restore();
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
    if (this.isFinalBattleCourt()) {
      this.drawFinalBattleCourt();
      return;
    }
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

  drawFinalBattleCourt() {
    const context = this.context;
    const c = GAME_CONFIG.court;
    const time = performance.now();
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

    const floorGradient = context.createLinearGradient(0, backY, 0, frontY);
    floorGradient.addColorStop(0, "#51495f");
    floorGradient.addColorStop(0.48, "#6e6680");
    floorGradient.addColorStop(1, "#837b90");
    drawProjectedQuad(c.x, backY, c.w, frontY - backY, floorGradient);

    context.save();
    context.strokeStyle = "rgba(42,34,50,0.26)";
    context.lineWidth = 3;
    for (let y = backY + 70; y < frontY; y += 112) {
      strokeProjectedLine(c.x, y, c.x + c.w, y);
    }
    for (let i = -7; i <= 7; i += 1) {
      const x = c.centerX + i * 230;
      strokeProjectedLine(x, backY, x + i * 16, frontY);
    }
    context.restore();

    context.save();
    context.shadowBlur = 18;
    context.shadowColor = "#f4b94a";
    context.strokeStyle = "#f6d276";
    context.lineWidth = 7;
    strokeProjectedLine(c.x, backY, c.x + c.w, backY);
    strokeProjectedLine(c.x + c.w, backY, c.x + c.w, frontY);
    strokeProjectedLine(c.x + c.w, frontY, c.x, frontY);
    strokeProjectedLine(c.x, frontY, c.x, backY);
    context.shadowColor = "#ff465e";
    context.strokeStyle = "#e6a850";
    context.lineWidth = 8;
    strokeProjectedLine(c.centerX, backY, c.centerX, frontY);
    context.strokeStyle = "rgba(255,40,80,0.62)";
    context.lineWidth = 3;
    strokeProjectedLine(c.centerX - 14, backY, c.centerX - 14, frontY);
    strokeProjectedLine(c.centerX + 14, backY, c.centerX + 14, frontY);
    context.restore();

    context.save();
    const circleY = (backY + frontY) / 2 + 22;
    const pulse = 0.5 + Math.sin(time / 520) * 0.5;
    context.translate(c.centerX, circleY);
    context.globalCompositeOperation = "lighter";
    context.strokeStyle = `rgba(189,112,255,${0.44 + pulse * 0.12})`;
    context.lineWidth = 9;
    context.beginPath();
    context.ellipse(0, 0, 330, 122, 0, 0, Math.PI * 2);
    context.stroke();
    context.strokeStyle = "rgba(255,80,128,0.5)";
    context.lineWidth = 5;
    context.beginPath();
    context.ellipse(0, 0, 220, 82, 0, 0, Math.PI * 2);
    context.stroke();
    context.strokeStyle = "rgba(255,214,106,0.48)";
    context.lineWidth = 4;
    for (let i = 0; i < 8; i += 1) {
      const angle = i * Math.PI / 4 + time / 2600;
      context.beginPath();
      context.moveTo(Math.cos(angle) * 82, Math.sin(angle) * 30);
      context.lineTo(Math.cos(angle) * 306, Math.sin(angle) * 112);
      context.stroke();
    }
    context.strokeStyle = "rgba(210,150,255,0.58)";
    context.lineWidth = 4;
    context.beginPath();
    for (let i = 0; i <= 6; i += 1) {
      const angle = -Math.PI / 2 + i * Math.PI * 2 / 6;
      const x = Math.cos(angle) * 164;
      const y = Math.sin(angle) * 60;
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
    context.restore();

    this.drawFinalBattleEmblem(c.centerX - 620, circleY + 42, "hero");
    this.drawFinalBattleEmblem(c.centerX + 620, circleY + 42, "demon");
  }

  drawFinalBattleEmblem(x, y, type) {
    const context = this.context;
    context.save();
    context.translate(x, y);
    context.globalCompositeOperation = "lighter";
    context.globalAlpha = 0.62;
    context.strokeStyle = type === "hero" ? "#a8e8ff" : "#ff4f8a";
    context.fillStyle = type === "hero" ? "rgba(125,210,255,0.11)" : "rgba(190,30,92,0.14)";
    context.lineWidth = 6;
    context.beginPath();
    context.ellipse(0, 0, 120, 44, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.lineWidth = 5;
    context.beginPath();
    if (type === "hero") {
      context.moveTo(0, -30);
      context.lineTo(0, 30);
      context.moveTo(-48, 0);
      context.quadraticCurveTo(-22, -28, 0, -3);
      context.quadraticCurveTo(22, -28, 48, 0);
      context.moveTo(-58, 18);
      context.quadraticCurveTo(-20, 34, 0, 8);
      context.quadraticCurveTo(20, 34, 58, 18);
    } else {
      context.moveTo(0, -35);
      context.lineTo(32, -6);
      context.lineTo(18, 32);
      context.lineTo(0, 12);
      context.lineTo(-18, 32);
      context.lineTo(-32, -6);
      context.closePath();
      context.moveTo(-46, -14);
      context.quadraticCurveTo(-74, -42, -98, -10);
      context.moveTo(46, -14);
      context.quadraticCurveTo(74, -42, 98, -10);
    }
    context.stroke();
    context.restore();
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
      const displayValue = Math.floor(value * 10) / 10;
      context.fillText(`${displayValue.toFixed(Number.isInteger(displayValue) ? 0 : 1)}/${max}`, x + 258, y + 27);
      context.restore();
    };
    drawGauge("left", 18, 6, "#3087f2", "1P 気合");
    drawGauge("right", GAME_CONFIG.width - 288, 6, "#f05a45", this.gameMode === "single" ? "CPU 気合" : "2P 気合");
  }

  getTeamHpSummary(team) {
    const summary = { current: 0, max: 0 };
    for (const member of team || []) {
      if (!member) continue;
      if (member.role !== "inner") continue;
      summary.current += Math.max(0, member.hp || 0);
      summary.max += Math.max(0, member.maxHp || 0);
    }
    summary.current = Math.round(summary.current);
    summary.max = Math.round(summary.max);
    summary.ratio = summary.max > 0 ? summary.current / summary.max : 0;
    return summary;
  }

  drawTeamHpAdvantageGraph() {
    const context = this.context;
    const left = this.getTeamHpSummary(this.leftTeam);
    const right = this.getTeamHpSummary(this.rightTeam);
    const totalCurrent = left.current + right.current;
    const leftShare = totalCurrent > 0 ? left.current / totalCurrent : 0.5;
    const rightShare = 1 - leftShare;

    const width = 650;
    const height = 38;
    const x = (GAME_CONFIG.width - width) / 2;
    const y = 6;
    const barX = x + 14;
    const barY = y + 9;
    const barW = width - 28;
    const barH = 20;
    const dividerX = barX + barW * leftShare;

    context.save();
    context.fillStyle = "rgba(21, 29, 38, 0.74)";
    this.roundRect(context, x, y, width, height, 8);
    context.fill();
    context.strokeStyle = "rgba(255,255,255,0.42)";
    context.lineWidth = 2;
    context.stroke();

    context.fillStyle = "rgba(255,255,255,0.18)";
    this.roundRect(context, barX, barY, barW, barH, 6);
    context.fill();

    context.save();
    this.roundRect(context, barX, barY, barW, barH, 6);
    context.clip();
    const leftGradient = context.createLinearGradient(barX, barY, dividerX, barY);
    leftGradient.addColorStop(0, "#2d87ff");
    leftGradient.addColorStop(1, "#64c4ff");
    context.fillStyle = leftGradient;
    context.fillRect(barX, barY, Math.max(0, barW * leftShare), barH);

    const rightGradient = context.createLinearGradient(dividerX, barY, barX + barW, barY);
    rightGradient.addColorStop(0, "#ff8a61");
    rightGradient.addColorStop(1, "#f03e3e");
    context.fillStyle = rightGradient;
    context.fillRect(dividerX, barY, Math.max(0, barW * rightShare), barH);
    context.restore();

    context.strokeStyle = "rgba(255,255,255,0.72)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(dividerX, barY - 3);
    context.lineTo(dividerX, barY + barH + 3);
    context.stroke();

    context.strokeStyle = "rgba(255,255,255,0.34)";
    context.lineWidth = 1;
    const centerMarkerX = barX + barW * 0.5;
    context.beginPath();
    context.moveTo(centerMarkerX, barY - 4);
    context.lineTo(centerMarkerX, barY + barH + 4);
    context.stroke();

    context.font = "bold 14px Meiryo, sans-serif";
    context.textBaseline = "middle";
    context.shadowColor = "rgba(0,0,0,0.72)";
    context.shadowBlur = 4;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.textAlign = "left";
    context.fillStyle = "#ffffff";
    context.fillText(`1P ${left.current}/${left.max}`, barX + 12, barY + barH / 2);
    context.textAlign = "right";
    context.fillText(`${this.gameMode === "single" ? "CPU" : "2P"} ${right.current}/${right.max}`, barX + barW - 12, barY + barH / 2);
    context.restore();
  }

  drawMatchTitleButton() {
    const context = this.context;
    const rect = this.getMatchTitleButtonRect();
    context.save();
    context.fillStyle = "rgba(31, 38, 36, 0.82)";
    context.strokeStyle = "rgba(255, 247, 188, 0.9)";
    context.lineWidth = 3;
    this.roundRect(context, rect.x, rect.y, rect.w, rect.h, 8);
    context.fill();
    context.stroke();
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#fff7d7";
    context.font = "bold 15px Meiryo, sans-serif";
    context.fillText("TITLE", rect.x + rect.w * 0.5, rect.y + rect.h * 0.5);
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

  drawShotMultiplierDebug() {
    if (!this.shotMultiplierDisplay) return;
    const context = this.context;
    const display = this.shotMultiplierDisplay;
    const alpha = Math.max(0, Math.min(1, display.life / 0.35, 1));
    const shotLabel = this.getShotDebugTypeLabel(display);
    const text = `SHOT x${display.multiplier.toFixed(2)}`;
    const teamText = display.team === "left" ? "1P" : "2P";
    const defenseLines = display.defenseLines || [];
    const height = 66 + defenseLines.length * 18;

    context.save();
    context.globalAlpha = alpha;
    context.font = "bold 18px Meiryo, sans-serif";
    context.textAlign = "left";
    const measuredLines = [text, shotLabel, ...defenseLines];
    const width = Math.max(156, ...measuredLines.map((line) => context.measureText(line).width + 34));
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
    context.fillStyle = "#8ffcff";
    context.font = "bold 15px Meiryo, sans-serif";
    context.fillText(shotLabel, x + 14, y + 62);
    if (defenseLines.length > 0) {
      context.font = "bold 13px Meiryo, sans-serif";
      defenseLines.forEach((line, index) => {
        context.fillStyle = line.includes("被弾") || line.includes("MISS")
          ? "#ffb0a6"
          : line.includes("成功")
            ? "#9fffd8"
            : "#fff7df";
        context.fillText(line, x + 14, y + 82 + index * 18);
      });
    }
    context.restore();
  }

  drawCounterReadyEffects(context) {
    const now = performance.now() * 0.001;
    for (const player of this.players) {
      const ready = player.counterWindowTimer > 0 && player.hasBall;
      const throwing = player.counterThrowTimer > 0;
      if (!ready && !throwing) continue;

      const galeCounter = this.isBravesMartialArtist(player);
      const intensity = ready ? player.counterVisualIntensity || 1 : player.counterThrowIntensity || 1;
      const remainingRatio = ready
        ? Math.max(0, Math.min(1, player.counterWindowTimer / (COUNTER_CONFIG.lockDuration + COUNTER_CONFIG.windowDuration)))
        : 0;
      const pulse = 1 + Math.sin(now * 18) * 0.08;
      const baseY = player.y + 8;
      const ballX = player.x + player.facing * 32;
      const ballY = player.y - player.jumpZ - 38;

      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = ready ? 0.44 + remainingRatio * 0.26 : 0.54;
      context.strokeStyle = galeCounter ? "#7dffd8" : player.counterReadyTimer > 0 ? "#79e7ff" : "#fff36a";
      context.lineWidth = 7 + intensity * 1.5;
      context.beginPath();
      context.ellipse(player.x, baseY, (54 + remainingRatio * 42) * pulse, (18 + remainingRatio * 10) * pulse, 0, 0, Math.PI * 2);
      context.stroke();
      context.globalAlpha *= 0.62;
      context.strokeStyle = galeCounter ? "#dffcff" : "#bdf8ff";
      context.lineWidth = 3;
      context.beginPath();
      context.ellipse(player.x, baseY, (74 + remainingRatio * 54) * pulse, (26 + remainingRatio * 14) * pulse, 0, 0, Math.PI * 2);
      context.stroke();

      context.globalAlpha = 0.64;
      context.strokeStyle = "#ffd83d";
      context.lineWidth = 4;
      const orbitRadius = 30 + intensity * 3;
      for (let index = 0; index < 3; index += 1) {
        const start = now * (3.8 + index * 0.35) + index * Math.PI * 0.66;
        context.beginPath();
        context.arc(ballX, ballY, orbitRadius + index * 7, start, start + Math.PI * 0.72);
        context.stroke();
      }

      const particleCount = 8 + Math.round(intensity * 3);
      for (let index = 0; index < particleCount; index += 1) {
        const phase = (now * (0.9 + index * 0.03) + index / particleCount) % 1;
        const angle = index * 2.399;
        const radius = 34 + Math.sin(index * 1.7) * 18;
        const px = player.x + Math.cos(angle) * radius;
        const py = player.y - 10 - phase * 116 - Math.sin(angle) * 18;
        context.globalAlpha = (1 - phase) * 0.7;
        context.fillStyle = galeCounter ? (index % 2 === 0 ? "#dffcff" : "#7dffd8") : index % 3 === 0 ? "#fff36a" : "#a9f4ff";
        context.beginPath();
        context.arc(px, py, 3 + intensity * 0.8, 0, Math.PI * 2);
        context.fill();
      }

      if (throwing) {
        const throwProgress = 1 - Math.max(0, Math.min(1, player.counterThrowTimer / 0.34));
        context.globalAlpha = 0.72 * (1 - throwProgress * 0.35);
        context.strokeStyle = galeCounter ? "#7dffd8" : "#8ffcff";
        context.lineCap = "round";
        for (let index = 0; index < 3; index += 1) {
          const offset = index * 12;
          context.lineWidth = 12 - index * 3;
          context.beginPath();
          context.moveTo(player.x - player.facing * (10 + offset), player.y - player.jumpZ - 82 + index * 4);
          context.quadraticCurveTo(
            player.x - player.facing * (52 + offset),
            player.y - player.jumpZ - 122,
            player.x + player.facing * (18 - offset),
            player.y - player.jumpZ - 142 + throwProgress * 38
          );
          context.stroke();
        }
      }
      context.restore();
    }
  }

  drawEffects() {
    const context = this.context;
    for (const effect of this.effects) {
      if (effect.type === "hellfireBurn") continue;
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
      if (effect.type === "bloodDrainLink") {
        const from = effect.from;
        const to = effect.to;
        if (!from || !to) continue;
        const intensity = effect.intensity || 1;
        const fromX = from.x;
        const fromY = from.y - from.jumpZ - 72;
        const toX = to.x;
        const toY = to.y - to.jumpZ - 88;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const distance = Math.hypot(dx, dy) || 1;
        const sideX = -dy / distance;
        const sideY = dx / distance;
        const dirX = dx / distance;
        const dirY = dy / distance;
        const flow = progress * 1.9;
        context.save();
        context.globalCompositeOperation = "lighter";
        context.lineCap = "round";

        const sourceRadius = 34 * intensity + progress * 22;
        context.globalAlpha = Math.max(0, (1 - progress * 0.8) * 0.46);
        context.fillStyle = effect.color;
        for (let burst = 0; burst < 18; burst += 1) {
          const angle = burst * Math.PI * 2 / 18 + progress * 1.7;
          const radius = sourceRadius * (0.35 + (burst % 4) * 0.18);
          context.beginPath();
          context.arc(
            fromX + Math.cos(angle) * radius,
            fromY + Math.sin(angle) * radius * 0.72,
            4 + burst % 3,
            0,
            Math.PI * 2
          );
          context.fill();
        }

        for (let stream = 0; stream < 46; stream += 1) {
          const seed = stream * 12.9898;
          const lane = ((stream % 13) - 6) / 6;
          const t = (flow + (stream * 0.071)) % 1;
          const spreadStart = lane * (54 + (stream % 5) * 8) * intensity;
          const arc = Math.sin(t * Math.PI) * (36 + (stream % 7) * 6) * intensity;
          const swirl = Math.sin(progress * 7.2 + seed) * (10 + (stream % 4) * 4) * intensity;
          const shower = (1 - t) * spreadStart + Math.sin(t * Math.PI * 2 + seed) * swirl;
          const px = fromX + dx * t + sideX * (shower + arc * lane);
          const py = fromY + dy * t + sideY * (shower + arc * lane) - Math.sin(t * Math.PI) * (18 + (stream % 3) * 8);
          const size = (3.2 + (stream % 5) * 1.3) * intensity * (0.7 + t * 0.55);
          context.globalAlpha = Math.max(0, (1 - progress * 0.82) * (0.28 + t * 0.62));
          context.fillStyle = stream % 4 === 0 ? "#ffd1dc" : effect.color;
          context.beginPath();
          context.arc(px, py, size, 0, Math.PI * 2);
          context.fill();

          if (stream % 3 === 0) {
            context.strokeStyle = effect.color;
            context.lineWidth = Math.max(1.5, size * 0.48);
            context.globalAlpha *= 0.48;
            context.beginPath();
            context.moveTo(px - dirX * size * 4, py - dirY * size * 4);
            context.lineTo(px + dirX * size * 1.6, py + dirY * size * 1.6);
            context.stroke();
          }
        }

        const batCount = Math.max(2, Math.round(3 + intensity * 3));
        context.globalCompositeOperation = "source-over";
        for (let bat = 0; bat < batCount; bat += 1) {
          const seed = bat * 1.31;
          const t = (flow * 0.72 + bat / batCount + 0.12) % 1;
          const lane = ((bat % 5) - 2) / 2;
          const arc = Math.sin(t * Math.PI) * (44 + bat * 5) * intensity;
          const wingWave = Math.sin(progress * 12 + seed) * 6;
          const px = fromX + dx * t + sideX * (arc * lane + Math.sin(progress * 6 + seed) * 16);
          const py = fromY + dy * t + sideY * (arc * lane) - Math.sin(t * Math.PI) * (24 + bat * 3);
          const size = (0.68 + (bat % 3) * 0.12) * intensity;
          context.save();
          context.translate(px, py);
          context.rotate(Math.atan2(dy, dx) + Math.sin(progress * 4 + seed) * 0.35);
          context.scale(size, size);
          context.globalAlpha = Math.max(0, (1 - progress * 0.72) * 0.84);
          context.fillStyle = "#160014";
          context.strokeStyle = bat % 2 === 0 ? "#ff5a75" : "#8b1e4d";
          context.lineWidth = 1.8;
          context.beginPath();
          context.moveTo(0, 0);
          context.quadraticCurveTo(-12, -9 - wingWave, -28, 2);
          context.quadraticCurveTo(-14, 8, 0, 3);
          context.quadraticCurveTo(14, 8, 28, 2);
          context.quadraticCurveTo(12, -9 + wingWave, 0, 0);
          context.closePath();
          context.fill();
          context.stroke();
          context.restore();
        }
        context.globalCompositeOperation = "lighter";

        context.globalAlpha = Math.max(0, (1 - progress) * 0.34);
        context.fillStyle = effect.color;
        context.beginPath();
        context.ellipse(
          toX - dirX * 20,
          toY - dirY * 20,
          42 * intensity,
          26 * intensity,
          Math.atan2(dy, dx),
          0,
          Math.PI * 2
        );
        context.fill();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.strokeStyle = effect.color;
        context.lineWidth = 7 * intensity;
        context.beginPath();
        context.arc(toX, toY, 24 + progress * 58, 0, Math.PI * 2);
        context.stroke();
        context.restore();
        continue;
      }
      if (effect.type === "tripleSplit") {
        const radius = 26 + progress * 132;
        const colors = ["#ff6655", "#68e8ff", "#ffd83d"];
        context.save();
        context.globalCompositeOperation = "lighter";
        context.translate(effect.x, effect.y);
        context.globalAlpha = Math.max(0, 1 - progress);
        context.fillStyle = `rgba(255,255,255,${Math.max(0, 0.72 - progress * 1.5)})`;
        context.beginPath();
        context.arc(0, 0, 42, 0, Math.PI * 2);
        context.fill();
        for (let index = 0; index < 3; index += 1) {
          const angle = -Math.PI * 0.5 + index * Math.PI * 2 / 3;
          const offset = progress * 58;
          context.strokeStyle = colors[index];
          context.lineWidth = 10 - progress * 5;
          context.beginPath();
          context.arc(Math.cos(angle) * offset, Math.sin(angle) * offset, radius * (0.7 + index * 0.08), 0, Math.PI * 2);
          context.stroke();
        }
        context.strokeStyle = "#ffffff";
        context.lineWidth = 6;
        context.beginPath();
        for (let index = 0; index < 3; index += 1) {
          const angle = -Math.PI * 0.5 + index * Math.PI * 2 / 3;
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          if (index === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.closePath();
        context.stroke();
        context.restore();
        continue;
      }
      if (effect.type === "tripleImpact") {
        const radius = 30 + progress * 142;
        const colors = ["#ff6655", "#68e8ff", "#ffd83d"];
        context.save();
        context.globalCompositeOperation = "lighter";
        context.translate(effect.x, effect.y);
        context.globalAlpha = Math.max(0, 1 - progress);
        context.fillStyle = `rgba(255,255,255,${Math.max(0, 0.86 - progress * 1.5)})`;
        context.beginPath();
        context.arc(0, 0, 48, 0, Math.PI * 2);
        context.fill();
        for (let index = 0; index < 3; index += 1) {
          const angle = -Math.PI * 0.5 + index * Math.PI * 2 / 3;
          context.strokeStyle = colors[index];
          context.lineWidth = 14 - progress * 8;
          context.beginPath();
          context.arc(Math.cos(angle) * radius * 0.18, Math.sin(angle) * radius * 0.18, radius * (0.82 + index * 0.09), 0, Math.PI * 2);
          context.stroke();
        }
        context.strokeStyle = "#ffffff";
        context.lineWidth = 6;
        for (let index = 0; index < 18; index += 1) {
          const angle = index * Math.PI * 2 / 18;
          context.beginPath();
          context.moveTo(Math.cos(angle) * radius * 0.38, Math.sin(angle) * radius * 0.38);
          context.lineTo(Math.cos(angle) * radius * 1.35, Math.sin(angle) * radius * 1.35);
          context.stroke();
        }
        context.restore();
        continue;
      }
      if (effect.type === "tripleSpark") {
        const radius = 18 + progress * 76;
        context.save();
        context.globalCompositeOperation = "lighter";
        context.translate(effect.x, effect.y);
        context.globalAlpha = Math.max(0, 1 - progress);
        context.strokeStyle = effect.color;
        context.lineWidth = 7 - progress * 3;
        for (let index = 0; index < 10; index += 1) {
          const angle = index * Math.PI * 2 / 10;
          context.beginPath();
          context.moveTo(Math.cos(angle) * radius * 0.2, Math.sin(angle) * radius * 0.2);
          context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
          context.stroke();
        }
        context.restore();
        continue;
      }
      if (effect.type === "bananaImpact") {
        const radius = 48 + progress * 168;
        context.save();
        context.globalCompositeOperation = "lighter";
        context.translate(effect.x, effect.y);
        context.globalAlpha = Math.max(0, 1 - progress);
        context.fillStyle = `rgba(255,255,255,${Math.max(0, 0.8 - progress * 1.5)})`;
        context.beginPath();
        context.arc(0, 0, 42, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#fff4a6";
        context.lineWidth = 22 - progress * 11;
        context.beginPath();
        context.arc(0, 0, radius, -Math.PI * 0.78, Math.PI * 0.78);
        context.stroke();
        context.strokeStyle = "#ffd000";
        context.lineWidth = 11 - progress * 5;
        context.beginPath();
        context.arc(0, 0, radius * 1.18, -Math.PI * 0.74, Math.PI * 0.74);
        context.stroke();
        const colors = ["#ffffff", "#ffd83d", "#9be33f"];
        for (let index = 0; index < 15; index += 1) {
          const angle = index * Math.PI * 2 / 15;
          context.strokeStyle = colors[index % colors.length];
          context.lineWidth = 5;
          context.beginPath();
          context.moveTo(Math.cos(angle) * radius * 0.4, Math.sin(angle) * radius * 0.4);
          context.lineTo(Math.cos(angle) * radius * 1.38, Math.sin(angle) * radius * 1.38);
          context.stroke();
        }
        context.restore();
        continue;
      }
      if (effect.type === "lockRocketImpact") {
        const radius = 28 + progress * 165;
        context.save();
        context.translate(effect.x, effect.y);
        context.globalAlpha = Math.max(0, 1 - progress);
        context.globalCompositeOperation = "lighter";
        context.strokeStyle = progress < 0.35 ? "#ffffff" : "#55dfff";
        context.lineWidth = 14 - progress * 8;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#ffca55";
        context.lineWidth = 6;
        for (let spark = 0; spark < 18; spark += 1) {
          const angle = spark * Math.PI * 2 / 18 + progress * 0.6;
          const inner = radius * 0.28;
          const outer = radius * (1.05 + spark % 3 * 0.2);
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          context.stroke();
        }
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "rgba(75, 86, 92, 0.48)";
        for (let smoke = 0; smoke < 8; smoke += 1) {
          const angle = smoke * Math.PI * 2 / 8;
          context.beginPath();
          context.arc(
            Math.cos(angle) * radius * 0.62,
            Math.sin(angle) * radius * 0.38,
            12 + progress * 18,
            0,
            Math.PI * 2
          );
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "ufoSpinImpact") {
        const radius = 26 + progress * 150;
        context.save();
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = Math.max(0, 1 - progress);
        context.strokeStyle = "#7cffcb";
        context.lineWidth = 10 - progress * 6;
        for (let ring = 0; ring < 4; ring += 1) {
          context.save();
          context.rotate(progress * (ring % 2 === 0 ? 4.5 : -3.8) + ring * 0.7);
          context.beginPath();
          context.ellipse(0, 0, radius * (0.48 + ring * 0.18), radius * (0.12 + ring * 0.04), 0, 0, Math.PI * 2);
          context.stroke();
          context.restore();
        }
        context.fillStyle = "rgba(88, 215, 255, 0.42)";
        context.beginPath();
        context.ellipse(0, 0, radius * 0.62, radius * 0.18, progress * 4, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 4;
        for (let spark = 0; spark < 12; spark += 1) {
          const angle = spark * Math.PI * 2 / 12 + progress * 2;
          context.beginPath();
          context.moveTo(Math.cos(angle) * radius * 0.25, Math.sin(angle) * radius * 0.1);
          context.lineTo(Math.cos(angle) * radius * 0.9, Math.sin(angle) * radius * 0.36);
          context.stroke();
        }
        context.restore();
        continue;
      }
      if (effect.type === "shieldImpact") {
        const intensity = effect.intensity || 1;
        const radius = (52 + progress * 218) * (0.82 + intensity * 0.2);
        context.save();
        context.globalCompositeOperation = "lighter";
        context.translate(effect.x, effect.y);
        context.globalAlpha = Math.max(0, 1 - progress);
        context.fillStyle = `rgba(34, 6, 52, ${Math.max(0, 0.56 - progress * 0.3)})`;
        context.beginPath();
        context.arc(0, 0, radius * 0.82, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = `rgba(255, 247, 160, ${Math.max(0, 0.24 - progress * 0.16)})`;
        context.beginPath();
        context.ellipse(0, 0, radius * 1.05, radius * 0.78, 0, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#f8fbff";
        context.lineWidth = Math.max(5, 38 - progress * 20);
        context.beginPath();
        context.moveTo(0, -radius);
        context.quadraticCurveTo(radius * 0.88, -radius * 0.65, radius * 0.78, radius * 0.1);
        context.quadraticCurveTo(radius * 0.48, radius * 0.82, 0, radius * 1.02);
        context.quadraticCurveTo(-radius * 0.48, radius * 0.82, -radius * 0.78, radius * 0.1);
        context.quadraticCurveTo(-radius * 0.88, -radius * 0.65, 0, -radius);
        context.closePath();
        context.stroke();
        context.strokeStyle = "#fff7a0";
        context.lineWidth = Math.max(4, 22 - progress * 11);
        context.beginPath();
        context.moveTo(0, -radius * 1.18);
        context.quadraticCurveTo(radius * 1.04, -radius * 0.78, radius * 0.96, radius * 0.12);
        context.quadraticCurveTo(radius * 0.58, radius * 0.98, 0, radius * 1.24);
        context.quadraticCurveTo(-radius * 0.58, radius * 0.98, -radius * 0.96, radius * 0.12);
        context.quadraticCurveTo(-radius * 1.04, -radius * 0.78, 0, -radius * 1.18);
        context.closePath();
        context.stroke();
        context.strokeStyle = "#9b2cff";
        context.lineWidth = Math.max(3, 20 - progress * 9);
        context.beginPath();
        context.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
        context.stroke();
        context.save();
        context.rotate(progress * 2.2);
        context.scale(1, 0.58);
        context.strokeStyle = "#dff7ff";
        context.lineWidth = Math.max(3, 12 - progress * 5);
        for (let ring = 0; ring < 3; ring += 1) {
          context.beginPath();
          context.arc(0, 0, radius * (0.48 + ring * 0.22), 0, Math.PI * 2);
          context.stroke();
        }
        context.restore();
        context.strokeStyle = "#fff7a0";
        context.lineWidth = Math.max(3, 10 - progress * 4);
        context.beginPath();
        context.moveTo(0, -radius * 0.82);
        context.lineTo(0, radius * 0.72);
        context.moveTo(-radius * 0.58, -radius * 0.08);
        context.lineTo(radius * 0.58, -radius * 0.08);
        context.stroke();
        context.strokeStyle = "#ff304a";
        context.lineWidth = Math.max(2, 8 - progress * 2);
        for (let index = 0; index < 28; index += 1) {
          const angle = index * Math.PI * 2 / 28 + progress * 1.1;
          context.beginPath();
          context.moveTo(Math.cos(angle) * radius * 0.28, Math.sin(angle) * radius * 0.28);
          context.lineTo(Math.cos(angle) * radius * (1.1 + (index % 3) * 0.12), Math.sin(angle) * radius * (1.1 + (index % 3) * 0.12));
          context.stroke();
        }
        context.fillStyle = "#ffffff";
        for (let spark = 0; spark < 24; spark += 1) {
          const angle = spark * Math.PI * 2 / 24 - progress * 3.2;
          const dist = radius * (0.48 + (spark % 4) * 0.16);
          context.globalAlpha = Math.max(0, (1 - progress) * (0.42 + (spark % 3) * 0.16));
          context.beginPath();
          context.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 3 + (spark % 3), 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
        return;
      }
      if (effect.type === "witchWarp") {
        const intensity = effect.intensity || 1;
        const radius = (28 + progress * 126) * intensity;
        context.save();
        context.globalCompositeOperation = "lighter";
        context.translate(effect.x, effect.y);
        context.globalAlpha = Math.max(0, 1 - progress);
        context.strokeStyle = "#d8b6ff";
        context.lineWidth = 8 - progress * 4;
        for (let ring = 0; ring < 3; ring += 1) {
          context.save();
          context.rotate(progress * (ring % 2 === 0 ? 3 : -4) + ring * 0.7);
          context.scale(1, 0.42);
          context.beginPath();
          context.arc(0, 0, radius * (0.52 + ring * 0.22), 0, Math.PI * 2);
          context.stroke();
          context.restore();
        }
        context.fillStyle = `rgba(155, 44, 255, ${Math.max(0, 0.36 - progress * 0.24)})`;
        context.beginPath();
        context.ellipse(0, 0, radius * 0.52, radius * 1.08, 0, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#9fdcff";
        context.lineWidth = 4;
        for (let ray = 0; ray < 12; ray += 1) {
          const angle = ray * Math.PI * 2 / 12 + progress * 2.4;
          context.beginPath();
          context.moveTo(Math.cos(angle) * radius * 0.18, Math.sin(angle) * radius * 0.42);
          context.lineTo(Math.cos(angle) * radius * 0.95, Math.sin(angle) * radius * 1.2);
          context.stroke();
        }
        context.restore();
        return;
      }
      if (effect.type === "clockImpact") {
        const radius = 34 + progress * 150;
        context.save();
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = Math.max(0, 1 - progress);
        context.strokeStyle = "#6affec";
        context.lineWidth = 12 - progress * 7;
        for (let gear = 0; gear < 3; gear += 1) {
          context.save();
          context.rotate((gear % 2 === 0 ? 1 : -1) * progress * 5 + gear * 1.7);
          context.beginPath();
          const gearRadius = radius * (0.55 + gear * 0.24);
          for (let tooth = 0; tooth < 24; tooth += 1) {
            const angle = tooth * Math.PI * 2 / 24;
            const toothRadius = gearRadius * (tooth % 2 === 0 ? 1.16 : 0.9);
            const px = Math.cos(angle) * toothRadius;
            const py = Math.sin(angle) * toothRadius;
            if (tooth === 0) context.moveTo(px, py);
            else context.lineTo(px, py);
          }
          context.closePath();
          context.stroke();
          context.restore();
        }
        context.strokeStyle = "#fff06a";
        context.lineWidth = 6;
        for (let spark = 0; spark < 14; spark += 1) {
          const angle = spark * Math.PI * 2 / 14;
          context.beginPath();
          context.moveTo(Math.cos(angle) * radius * 0.28, Math.sin(angle) * radius * 0.28);
          context.lineTo(Math.cos(angle) * radius * 1.45, Math.sin(angle) * radius * 1.45);
          context.stroke();
        }
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "rgba(68,255,229,0.72)";
        for (let noise = 0; noise < 18; noise += 1) {
          const nx = Math.sin(noise * 17.3) * radius * 1.15;
          const ny = Math.cos(noise * 9.7) * radius * 0.72;
          context.fillRect(nx, ny, 18 + noise % 4 * 8, 3 + noise % 3 * 2);
        }
        context.restore();
        continue;
      }
      if (effect.type === "counterCatch") {
        const intensity = effect.intensity || 1;
        const radius = 30 + progress * (104 + intensity * 18);
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.fillStyle = `rgba(255,255,255,${Math.max(0, 0.72 - progress * 1.4)})`;
        context.beginPath();
        context.arc(0, 0, 46 + intensity * 9, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = progress < 0.35 ? "#ffffff" : "#79e7ff";
        context.lineWidth = 14 + intensity * 2 - progress * 8;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.stroke();
        context.globalAlpha = Math.max(0, (1 - progress) * 0.72);
        context.strokeStyle = "#1f6fff";
        context.lineWidth = 7;
        context.beginPath();
        context.arc(0, 0, radius * 1.35, 0, Math.PI * 2);
        context.stroke();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.strokeStyle = "#fff36a";
        context.lineWidth = 6;
        const rayCount = 18 + Math.round(intensity * 2);
        for (let index = 0; index < rayCount; index += 1) {
          const angle = Math.PI * 2 * index / rayCount;
          const inner = radius * 0.58;
          const outer = radius * (index % 2 === 0 ? 1.5 : 1.2);
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          context.stroke();
        }
        context.restore();
        continue;
      }
      if (effect.type === "counterLaunch") {
        const intensity = effect.intensity || 1;
        const radius = 22 + progress * (112 + intensity * 18);
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.strokeStyle = "#ffffff";
        context.lineWidth = 14 - progress * 8;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#67dfff";
        context.lineWidth = 8;
        context.beginPath();
        context.arc(0, 0, radius * 1.34, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#fff36a";
        context.lineWidth = 5;
        for (let index = 0; index < 14; index += 1) {
          const angle = Math.PI * 2 * index / 14;
          context.beginPath();
          context.moveTo(Math.cos(angle) * radius * 0.4, Math.sin(angle) * radius * 0.4);
          context.lineTo(Math.cos(angle) * radius * 1.45, Math.sin(angle) * radius * 1.45);
          context.stroke();
        }
        context.restore();
        continue;
      }
      if (effect.type === "galeCounterLaunch") {
        const intensity = effect.intensity || 1;
        const radius = 28 + progress * (132 + intensity * 24);
        context.save();
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = Math.max(0, 1 - progress) * 0.9;
        context.translate(effect.x, effect.y);
        context.strokeStyle = "#7dffd8";
        context.lineCap = "round";
        for (let index = 0; index < 5; index += 1) {
          const angle = progress * Math.PI * 4 + index * Math.PI * 2 / 5;
          context.lineWidth = 10 - index;
          context.beginPath();
          context.arc(0, 0, radius * (0.34 + index * 0.12), angle, angle + Math.PI * 0.85);
          context.stroke();
        }
        context.strokeStyle = "#ffffff";
        context.lineWidth = 4;
        for (let index = 0; index < 12; index += 1) {
          const angle = progress * Math.PI * 5 + index * Math.PI * 2 / 12;
          const inner = radius * 0.22;
          const outer = radius * (0.62 + (index % 3) * 0.12);
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          context.stroke();
        }
        context.restore();
        continue;
      }
      if (effect.type === "counterImpact") {
        const intensity = effect.intensity || 1;
        const radius = 32 + progress * (126 + intensity * 24);
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.fillStyle = `rgba(255,255,255,${Math.max(0, 0.88 - progress * 1.5)})`;
        context.beginPath();
        context.arc(0, 0, 54 + intensity * 9, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#bdf8ff";
        context.lineWidth = 16 - progress * 9;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 13 - progress * 6;
        context.beginPath();
        context.moveTo(-radius * 1.35, 0);
        context.lineTo(radius * 1.35, 0);
        context.moveTo(0, -radius * 1.35);
        context.lineTo(0, radius * 1.35);
        context.stroke();
        context.strokeStyle = "#fff36a";
        context.lineWidth = 6;
        for (let index = 0; index < 16; index += 1) {
          const angle = Math.PI * 2 * index / 16;
          context.beginPath();
          context.moveTo(Math.cos(angle) * radius * 0.52, Math.sin(angle) * radius * 0.52);
          context.lineTo(Math.cos(angle) * radius * 1.42, Math.sin(angle) * radius * 1.42);
          context.stroke();
        }
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "rgba(152,112,56,0.55)";
        for (let index = 0; index < 12; index += 1) {
          const angle = Math.PI * 2 * index / 12;
          const distance = 34 + progress * (76 + index % 3 * 14);
          context.beginPath();
          context.ellipse(
            Math.cos(angle) * distance,
            52 + Math.sin(angle) * distance * 0.28,
            12 + progress * 12,
            7 + progress * 7,
            angle,
            0,
            Math.PI * 2
          );
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "galeCounterImpact") {
        const intensity = effect.intensity || 1;
        const radius = 38 + progress * (154 + intensity * 28);
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.strokeStyle = "#7dffd8";
        context.fillStyle = "rgba(125,255,216,0.18)";
        context.lineWidth = 16 - progress * 8;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.strokeStyle = "#ffffff";
        context.lineCap = "round";
        for (let index = 0; index < 18; index += 1) {
          const angle = progress * Math.PI * 3 + index * Math.PI * 2 / 18;
          const inner = radius * 0.28;
          const outer = radius * (1.12 + (index % 3) * 0.14);
          context.lineWidth = index % 2 === 0 ? 6 : 3;
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          context.quadraticCurveTo(
            Math.cos(angle + 0.45) * radius * 0.72,
            Math.sin(angle + 0.45) * radius * 0.72,
            Math.cos(angle + 0.18) * outer,
            Math.sin(angle + 0.18) * outer
          );
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
      if (effect.type === "braveSlashLaunch") {
        const radius = 32 + progress * 150;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.strokeStyle = "#ffd83d";
        context.lineWidth = 8 - progress * 4;
        context.beginPath();
        context.ellipse(0, 0, radius, radius * 0.26, 0, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#fffdf1";
        context.lineWidth = 5;
        for (let index = -2; index <= 2; index += 1) {
          context.beginPath();
          context.moveTo(-radius * 0.45, index * 12);
          context.lineTo(radius * (0.55 + progress * 0.2), index * 5);
          context.stroke();
        }
        context.fillStyle = "#8fd8ff";
        for (let index = 0; index < 10; index += 1) {
          const angle = -0.3 + index * Math.PI * 1.55 / 9;
          const dist = radius * (0.35 + (index % 3) * 0.16);
          context.beginPath();
          context.arc(Math.cos(angle) * dist, Math.sin(angle) * dist * 0.28, 3, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "gigaBreakLaunch") {
        const radius = 40 + progress * 168;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.fillStyle = "rgba(255,255,255,0.22)";
        context.fillRect(-radius * 0.55, -radius * 0.2, radius * 1.15, radius * 0.4);
        context.strokeStyle = "#1b1110";
        context.lineWidth = 12 - progress * 5;
        context.lineCap = "round";
        for (let index = -2; index <= 2; index += 1) {
          context.beginPath();
          context.moveTo(-radius * 0.25, index * 16);
          context.lineTo(radius * 0.82, index * 8);
          context.stroke();
        }
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "rgba(82, 55, 36, 0.58)";
        for (let index = 0; index < 14; index += 1) {
          const angle = Math.PI * 2 * index / 14;
          const dist = 24 + progress * (70 + (index % 3) * 18);
          context.beginPath();
          context.ellipse(Math.cos(angle) * dist, 32 + Math.sin(angle) * dist * 0.22, 18 + progress * 9, 8 + progress * 5, angle, 0, Math.PI * 2);
          context.fill();
        }
        context.strokeStyle = "#5a2a18";
        context.lineWidth = 4;
        for (let index = 0; index < 8; index += 1) {
          const angle = -0.6 + index * Math.PI * 1.2 / 7;
          context.beginPath();
          context.moveTo(0, 38);
          context.lineTo(Math.cos(angle) * radius * 0.65, 38 + Math.sin(angle) * radius * 0.2);
          context.stroke();
        }
        context.restore();
        continue;
      }
      if (effect.type === "gigaBreakCatchBrace") {
        const radius = 34 + progress * 126;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "rgba(82, 55, 36, 0.62)";
        for (let index = 0; index < 12; index += 1) {
          const x = -radius * 0.45 + index * radius * 0.09;
          context.beginPath();
          context.ellipse(x, 18 + Math.sin(index) * 6, 22 + progress * 10, 8 + progress * 4, 0, 0, Math.PI * 2);
          context.fill();
        }
        context.globalCompositeOperation = "lighter";
        context.strokeStyle = "#d9442e";
        context.lineWidth = 6 - progress * 2;
        context.beginPath();
        context.ellipse(0, 0, radius, radius * 0.28, 0, Math.PI * 0.15, Math.PI * 0.85);
        context.stroke();
        context.restore();
        continue;
      }
      if (effect.type === "braveSlashImpact") {
        const radius = 30 + progress * 150;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.fillStyle = "rgba(255, 216, 61, 0.16)";
        context.strokeStyle = progress < 0.42 ? "#ffffff" : "#ffd83d";
        context.lineWidth = 13 - progress * 6;
        context.shadowColor = "#ffd83d";
        context.shadowBlur = 28;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        context.shadowBlur = 0;
        context.lineCap = "round";
        context.strokeStyle = "#ffffff";
        context.lineWidth = 14 - progress * 7;
        context.beginPath();
        context.moveTo(-18, -radius * 0.9);
        context.lineTo(14, radius * 0.92);
        context.stroke();
        context.strokeStyle = "#ffd83d";
        context.lineWidth = 8 - progress * 3;
        context.beginPath();
        context.moveTo(-118 - progress * 28, 0);
        context.lineTo(138 + progress * 62, 0);
        context.stroke();

        context.fillStyle = "#fffdf1";
        for (let index = 0; index < 18; index += 1) {
          const angle = index * Math.PI * 2 / 18;
          const outer = radius * (0.42 + (index % 4) * 0.14);
          context.beginPath();
          if (index % 3 === 0) {
            context.moveTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
            context.lineTo(Math.cos(angle + 0.18) * (outer + 12), Math.sin(angle + 0.18) * (outer + 12));
            context.lineTo(Math.cos(angle - 0.18) * (outer + 12), Math.sin(angle - 0.18) * (outer + 12));
            context.closePath();
          } else {
            context.arc(Math.cos(angle) * outer, Math.sin(angle) * outer, 3 + index % 2, 0, Math.PI * 2);
          }
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "gigaBreakImpact") {
        const radius = 46 + progress * 178;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.fillStyle = "rgba(88, 28, 18, 0.22)";
        context.strokeStyle = "#1b1110";
        context.lineWidth = 20 - progress * 9;
        context.beginPath();
        context.ellipse(0, 38, radius * 1.1, radius * 0.36, 0, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 9 - progress * 4;
        context.beginPath();
        context.moveTo(-radius * 0.92, -radius * 0.18);
        context.lineTo(radius * 0.92, radius * 0.12);
        context.moveTo(-radius * 0.72, radius * 0.16);
        context.lineTo(radius * 0.74, -radius * 0.18);
        context.stroke();
        context.lineCap = "round";
        for (let index = 0; index < 14; index += 1) {
          const angle = -0.8 + index * Math.PI * 1.6 / 13;
          const inner = radius * 0.22;
          const outer = radius * (0.78 + (index % 3) * 0.16);
          context.strokeStyle = index % 2 === 0 ? "#ffb347" : "#d9442e";
          context.lineWidth = 7 - progress * 2;
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, 34 + Math.sin(angle) * inner * 0.34);
          context.lineTo(Math.cos(angle) * outer, 34 + Math.sin(angle) * outer * 0.34);
          context.stroke();
        }
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "rgba(80, 54, 38, 0.48)";
        for (let index = 0; index < 12; index += 1) {
          const angle = Math.PI * 2 * index / 12;
          const dist = 36 + progress * (92 + (index % 3) * 18);
          context.beginPath();
          context.ellipse(Math.cos(angle) * dist, 48 + Math.sin(angle) * dist * 0.24, 15 + progress * 10, 8 + progress * 5, angle, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "fireballImpact") {
        const radius = 36 + progress * 122;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.fillStyle = "rgba(255, 104, 24, 0.34)";
        context.strokeStyle = progress < 0.38 ? "#fff0a0" : "#ff7a1f";
        context.lineWidth = 14 - progress * 7;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.fillStyle = "#ff4a16";
        for (let index = 0; index < 18; index += 1) {
          const angle = index * Math.PI * 2 / 18;
          const dist = radius * (0.36 + (index % 4) * 0.18);
          context.beginPath();
          context.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 5 + index % 4, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "holyLanceImpact") {
        const radius = 34 + progress * 132;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.fillStyle = "rgba(255, 255, 255, 0.18)";
        context.strokeStyle = "#fff4a8";
        context.lineWidth = 8 - progress * 3;
        for (let petal = 0; petal < 8; petal += 1) {
          const angle = petal * Math.PI * 2 / 8;
          context.save();
          context.rotate(angle);
          context.beginPath();
          context.ellipse(radius * 0.42, 0, radius * 0.34, radius * 0.1, 0, 0, Math.PI * 2);
          context.fill();
          context.stroke();
          context.restore();
        }
        context.strokeStyle = "#ffffff";
        context.lineWidth = 5;
        context.beginPath();
        context.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
        context.stroke();
        context.restore();
        continue;
      }
      if (effect.type === "fireballBurn") {
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress) * 0.7;
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.fillStyle = "#ff7a1f";
        context.beginPath();
        context.ellipse(0, 0, 42 + progress * 16, 14 + progress * 5, 0, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#ffd36a";
        for (let index = 0; index < 6; index += 1) {
          const x = -24 + index * 9;
          context.beginPath();
          context.ellipse(x, -8 - Math.sin(progress * Math.PI + index) * 8, 5, 12, 0, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "shiningArrowImpact") {
        const radius = 26 + progress * 110;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.strokeStyle = "#ffe36a";
        context.lineWidth = 6 - progress * 2;
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(-96 - progress * 28, 0);
        context.lineTo(112 + progress * 54, 0);
        context.stroke();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(-62, -18);
        context.lineTo(62 + progress * 28, 18);
        context.moveTo(-62, 18);
        context.lineTo(62 + progress * 28, -18);
        context.stroke();
        context.fillStyle = "rgba(255,227,106,0.18)";
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
        continue;
      }
      if (effect.type === "hundredRushImpact") {
        const intensity = effect.intensity || 1;
        const radius = (46 + progress * 188) * intensity;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.fillStyle = "rgba(255,255,255,0.18)";
        context.beginPath();
        context.ellipse(0, 22, radius * 1.04, radius * 0.34, 0, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 18 - progress * 8;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#cfd7ff";
        context.lineWidth = 8;
        context.lineCap = "round";
        for (let index = 0; index < 30; index += 1) {
          const angle = index * Math.PI * 2 / 30;
          const inner = radius * 0.28;
          const outer = radius * (0.9 + (index % 4) * 0.12);
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          context.stroke();
        }
        context.strokeStyle = "#ffffff";
        context.lineWidth = 10 - progress * 4;
        for (let fist = -3; fist <= 3; fist += 1) {
          context.beginPath();
          context.moveTo(-radius * 0.92, fist * 16);
          context.quadraticCurveTo(-radius * 0.14, fist * 5, radius * 0.92, -fist * 11);
          context.stroke();
        }
        context.fillStyle = "rgba(255,255,255,0.62)";
        for (let fist = 0; fist < 8; fist += 1) {
          const angle = -0.35 + fist * Math.PI * 2 / 8;
          const x = Math.cos(angle) * radius * (0.34 + (fist % 3) * 0.12);
          const y = Math.sin(angle) * radius * 0.32;
          context.beginPath();
          context.ellipse(x, y, 20 - progress * 7, 12 - progress * 4, angle, 0, Math.PI * 2);
          context.fill();
        }
        context.globalCompositeOperation = "source-over";
        context.globalAlpha = Math.max(0, 1 - progress) * 0.56;
        context.fillStyle = "rgba(92,70,46,0.5)";
        for (let dust = 0; dust < 10; dust += 1) {
          const x = -radius * 0.45 + dust * radius * 0.1;
          context.beginPath();
          context.ellipse(x, 38 + Math.sin(dust) * 5, 18 + progress * 14, 7 + progress * 4, 0, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "qigongShotImpact") {
        const radius = 26 + progress * 86;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress) * 0.88;
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.strokeStyle = "#ffffff";
        context.lineWidth = 8 - progress * 4;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#cfd7ff";
        context.lineWidth = 4;
        for (let index = 0; index < 10; index += 1) {
          const angle = index * Math.PI * 2 / 10;
          context.beginPath();
          context.moveTo(Math.cos(angle) * radius * 0.35, Math.sin(angle) * radius * 0.35);
          context.lineTo(Math.cos(angle) * radius * 1.08, Math.sin(angle) * radius * 1.08);
          context.stroke();
        }
        context.restore();
        continue;
      }
      if (effect.type === "heroStraightImpact") {
        const intensity = effect.intensity || 1;
        const radius = (22 + progress * 74) * intensity;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress) * 0.82;
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.strokeStyle = "#8ffcff";
        context.lineWidth = 5 - progress * 2;
        context.beginPath();
        context.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#fff4a8";
        context.lineWidth = 3;
        context.beginPath();
        context.ellipse(0, 0, radius * 1.06, radius * 0.34, -0.42, 0, Math.PI * 2);
        context.stroke();
        context.fillStyle = "#ffffff";
        for (let index = 0; index < 8; index += 1) {
          const angle = index * Math.PI * 2 / 8;
          const inner = radius * 0.22;
          const outer = radius * (0.82 + (index % 2) * 0.16);
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          context.stroke();
        }
        context.restore();
        continue;
      }
      if (effect.type === "melodyShotImpact") {
        const radius = (24 + progress * 88) * (effect.intensity || 1);
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress) * 0.82;
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.strokeStyle = "#ffd83d";
        context.lineWidth = 5 - progress * 2;
        context.beginPath();
        context.arc(0, 0, radius * 0.58, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#8b1e4d";
        context.lineWidth = 3;
        context.beginPath();
        context.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
        context.stroke();
        context.font = `bold ${28 + progress * 8}px Meiryo, sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        for (let index = 0; index < 6; index += 1) {
          const angle = index * Math.PI * 2 / 6 + progress * 1.2;
          const x = Math.cos(angle) * radius * 0.62;
          const y = Math.sin(angle) * radius * 0.36;
          context.fillStyle = index % 2 === 0 ? "#ffd83d" : "#8b1e4d";
          context.strokeStyle = "#ffffff";
          const text = index % 2 === 0 ? "♪" : "♫";
          context.strokeText(text, x, y);
          context.fillText(text, x, y);
        }
        context.restore();
        continue;
      }
      if (effect.type === "witchSparkLaunch") {
        const radius = (18 + progress * 34) * (effect.intensity || 1);
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress) * 0.88;
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.fillStyle = "rgba(216,182,255,0.42)";
        context.beginPath();
        context.arc(0, 0, radius * 0.75, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#9b2cff";
        context.lineWidth = 4 - progress * 1.7;
        for (let index = 0; index < 6; index += 1) {
          const angle = index * Math.PI * 2 / 6 + progress * 1.8;
          const inner = radius * 0.22;
          const outer = radius * (0.92 + (index % 2) * 0.18);
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          context.stroke();
        }
        context.fillStyle = "#f0d7ff";
        context.beginPath();
        context.arc(0, 0, Math.max(3, radius * 0.16), 0, Math.PI * 2);
        context.fill();
        context.restore();
        continue;
      }
      if (effect.type === "witchSparkImpact") {
        const radius = (18 + progress * 70) * (effect.intensity || 1);
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress) * 0.86;
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.strokeStyle = "#d8b6ff";
        context.lineWidth = 5 - progress * 2;
        context.beginPath();
        context.arc(0, 0, radius * 0.52, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#9b2cff";
        context.lineWidth = 3;
        context.beginPath();
        context.ellipse(0, 0, radius * 0.95, radius * 0.32, progress * 1.7, 0, Math.PI * 2);
        context.stroke();
        context.fillStyle = "#f0d7ff";
        for (let index = 0; index < 8; index += 1) {
          const angle = index * Math.PI * 2 / 8 + progress * 1.2;
          const inner = radius * 0.18;
          const outer = radius * (0.72 + (index % 2) * 0.2);
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          context.stroke();
          context.beginPath();
          context.arc(Math.cos(angle) * outer, Math.sin(angle) * outer, 2.5, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "moonBarrier" || effect.type === "moonBarrierImpact") {
        const impact = effect.type === "moonBarrierImpact";
        const radius = (impact ? 36 + progress * 104 : 70 + Math.sin(progress * Math.PI) * 12) * (effect.intensity || 1);
        context.save();
        context.globalAlpha = impact ? Math.max(0, 1 - progress) : Math.max(0, 1 - progress * 0.82);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        const bubble = context.createRadialGradient(-radius * 0.24, -radius * 0.34, 4, 0, 0, radius);
        bubble.addColorStop(0, impact ? "rgba(255,255,255,0.92)" : "rgba(248,241,255,0.78)");
        bubble.addColorStop(0.38, "rgba(158,231,255,0.28)");
        bubble.addColorStop(0.72, "rgba(185,140,255,0.2)");
        bubble.addColorStop(1, "rgba(107,92,255,0)");
        context.fillStyle = bubble;
        context.beginPath();
        context.ellipse(0, 12, radius * 0.82, radius, 0, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = impact ? "#ffffff" : "#d8b6ff";
        context.lineWidth = impact ? 7 - progress * 3 : 5;
        context.beginPath();
        context.ellipse(0, 12, radius * (0.82 + progress * 0.18), radius * (1 + progress * 0.22), 0, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#9ee7ff";
        context.lineWidth = 3;
        for (let ring = 0; ring < 2; ring += 1) {
          context.save();
          context.rotate(performance.now() / 520 + ring * Math.PI / 2);
          context.scale(1, 0.36);
          context.beginPath();
          context.arc(0, 0, radius * (0.72 + ring * 0.22), Math.PI * 0.12, Math.PI * 1.88);
          context.stroke();
          context.restore();
        }
        context.fillStyle = "#f8f1ff";
        for (let i = 0; i < 12; i += 1) {
          const angle = performance.now() / 310 + i * Math.PI * 2 / 12;
          const dist = radius * (0.42 + (i % 4) * 0.13);
          context.beginPath();
          context.arc(Math.cos(angle) * dist, 12 + Math.sin(angle) * dist * 0.92, 2 + i % 2, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "lunaticMirageLaunch") {
        const time = performance.now();
        const radius = 28 + progress * 92;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress) * 0.86;
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.fillStyle = "rgba(52, 38, 118, 0.28)";
        context.beginPath();
        context.arc(0, 0, radius * 0.82, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#b98cff";
        context.lineWidth = 6 - progress * 2.4;
        for (let ring = 0; ring < 4; ring += 1) {
          context.save();
          context.rotate(time / 460 + ring * Math.PI / 4);
          context.scale(1, 0.44);
          context.beginPath();
          context.arc(0, 0, radius + ring * 13, Math.PI * 0.15, Math.PI * 1.86);
          context.stroke();
          context.restore();
        }
        context.fillStyle = "#f8f1ff";
        context.beginPath();
        context.arc(-radius * 0.08, -radius * 0.12, radius * 0.44, -Math.PI * 0.72, Math.PI * 0.72);
        context.quadraticCurveTo(radius * 0.16, -radius * 0.12, -radius * 0.08, -radius * 0.46);
        context.closePath();
        context.fill();
        context.strokeStyle = "#9ee7ff";
        context.lineWidth = 3;
        context.beginPath();
        context.arc(-radius * 0.08, -radius * 0.12, radius * 0.52, -Math.PI * 0.68, Math.PI * 0.68);
        context.stroke();
        context.fillStyle = "#f1dcff";
        for (let index = 0; index < 22; index += 1) {
          const angle = time / 230 + index * Math.PI * 2 / 22;
          const dist = radius * (0.28 + (index % 5) * 0.14);
          context.beginPath();
          context.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 2 + index % 3, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "lunaticMirageImpact") {
        const radius = 38 + progress * 166;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress);
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.fillStyle = "rgba(107, 92, 255, 0.18)";
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 10 - progress * 5;
        context.beginPath();
        context.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
        context.stroke();
        context.lineCap = "round";
        for (let slash = -1; slash <= 1; slash += 1) {
          context.save();
          context.rotate(-0.78 + slash * 0.34);
          context.strokeStyle = slash === 0 ? "#ffffff" : "#9ee7ff";
          context.lineWidth = slash === 0 ? 12 - progress * 5 : 7 - progress * 3;
          context.beginPath();
          context.moveTo(-radius * (0.72 + progress * 0.18), slash * 18);
          context.quadraticCurveTo(0, -radius * 0.16 + slash * 8, radius * (0.86 + progress * 0.22), slash * -18);
          context.stroke();
          context.restore();
        }
        context.strokeStyle = "#b98cff";
        context.lineWidth = 5;
        for (let ring = 0; ring < 3; ring += 1) {
          context.save();
          context.rotate(ring * Math.PI / 3 + progress * 2.4);
          context.scale(1, 0.38);
          context.beginPath();
          context.arc(0, 0, radius * (0.42 + ring * 0.24), Math.PI * 0.1, Math.PI * 1.9);
          context.stroke();
          context.restore();
        }
        context.fillStyle = "#f8f1ff";
        for (let index = 0; index < 18; index += 1) {
          const angle = index * Math.PI * 2 / 18 + progress * 1.6;
          const dist = radius * (0.28 + (index % 5) * 0.14);
          const size = 3 + index % 3;
          context.beginPath();
          context.moveTo(Math.cos(angle) * dist, Math.sin(angle) * dist - size);
          context.lineTo(Math.cos(angle) * dist + size, Math.sin(angle) * dist);
          context.lineTo(Math.cos(angle) * dist, Math.sin(angle) * dist + size);
          context.lineTo(Math.cos(angle) * dist - size, Math.sin(angle) * dist);
          context.closePath();
          context.fill();
        }
        context.globalAlpha = Math.max(0, 1 - progress) * 0.42;
        context.fillStyle = "rgba(216, 182, 255, 0.36)";
        for (let ghost = -1; ghost <= 1; ghost += 1) {
          context.beginPath();
          context.arc(ghost * radius * 0.42, -radius * 0.08 * ghost, 18 + progress * 12, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "victoryMarchBuff" || effect.type === "musicNote" || effect.type === "rhythmStepBuff" || effect.type === "rhythmStepCast") {
        context.save();
        const rhythmStep = effect.type === "rhythmStepBuff" || effect.type === "rhythmStepCast";
        context.globalAlpha = Math.max(0, 1 - progress) * (effect.type === "musicNote" ? 0.95 : rhythmStep ? 0.74 : 0.68);
        context.translate(effect.x, effect.y - progress * (rhythmStep ? 14 : 22));
        context.globalCompositeOperation = "lighter";
        context.fillStyle = effect.color || "#ffd83d";
        context.strokeStyle = "#ffffff";
        context.lineWidth = 3;
        context.textAlign = "center";
        context.textBaseline = "middle";
        if (rhythmStep) {
          context.strokeStyle = effect.type === "rhythmStepCast" ? "#fff4a8" : "#8b1e4d";
          context.lineWidth = effect.type === "rhythmStepCast" ? 5 : 3;
          context.beginPath();
          context.ellipse(0, 18, 34 + progress * 42, 12 + progress * 8, 0, 0, Math.PI * 2);
          context.stroke();
        }
        context.font = `bold ${effect.type === "musicNote" ? 30 : rhythmStep ? 32 : 42}px Meiryo, sans-serif`;
        const text = effect.type === "musicNote" ? (Math.floor(progress * 10) % 2 ? "♪" : "♫") : rhythmStep ? "♫" : "♪";
        context.strokeText(text, 0, 0);
        context.fillText(text, 0, 0);
        context.restore();
        continue;
      }
      if (effect.type === "victoryMarchWave") {
        const radius = 70 + progress * 520;
        context.save();
        context.globalAlpha = Math.max(0, 1 - progress) * 0.55;
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.strokeStyle = "#ffd83d";
        context.lineWidth = 7 - progress * 3;
        for (let line = -2; line <= 2; line += 1) {
          context.beginPath();
          context.arc(0, line * 18, radius + line * 10, Math.PI * 0.08, Math.PI * 0.92);
          context.stroke();
        }
        context.restore();
        continue;
      }
      if (effect.type === "victoryMarchScreenNotes") {
        const time = performance.now();
        context.save();
        context.globalCompositeOperation = "lighter";
        context.textAlign = "center";
        context.textBaseline = "middle";
        const notes = ["♪", "♫", "♬", "♩"];
        for (let index = 0; index < 28; index += 1) {
          const lane = index % 7;
          const row = Math.floor(index / 7);
          const direction = effect.team === "left" ? 1 : -1;
          const baseX = direction > 0 ? -80 : GAME_CONFIG.width + 80;
          const travel = progress * (GAME_CONFIG.width + 260);
          const x = baseX + direction * travel + lane * 68 * direction + Math.sin(time / 180 + index) * 22;
          const y = 98 + row * 118 + Math.sin(time / 130 + index * 0.7) * 24;
          const size = 26 + (index % 4) * 4 + Math.sin(time / 100 + index) * 3;
          context.globalAlpha = Math.max(0, 1 - progress * 0.75) * (0.42 + (index % 3) * 0.12);
          context.font = `bold ${size}px Meiryo, sans-serif`;
          context.fillStyle = index % 2 === 0 ? "#fff4a8" : "#ffd83d";
          context.strokeStyle = "rgba(255,255,255,0.72)";
          context.lineWidth = 3;
          context.strokeText(notes[index % notes.length], x, y);
          context.fillText(notes[index % notes.length], x, y);
        }
        context.restore();
        continue;
      }
      if (effect.type === "grandHealRitual") {
        const actor = effect.actor;
        const centerX = actor && !actor.defeated ? actor.x : effect.x;
        const groundY = actor && !actor.defeated ? actor.y + 8 : effect.y + 8;
        const castY = actor && !actor.defeated ? actor.y - actor.jumpZ - 116 : effect.y - 116;
        const pulse = 0.5 + Math.sin(performance.now() / 140) * 0.5;
        context.save();
        context.translate(centerX, groundY);
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = Math.min(1, progress * 3) * Math.max(0.2, 1 - Math.max(0, progress - 0.78) * 3);
        context.fillStyle = "rgba(255, 244, 168, 0.18)";
        context.strokeStyle = "#fff4a8";
        context.lineWidth = 7;
        context.beginPath();
        context.ellipse(0, 0, 118 + pulse * 16, 38 + pulse * 5, 0, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 3;
        for (let index = 0; index < 12; index += 1) {
          const angle = index * Math.PI * 2 / 12 + performance.now() / 900;
          context.beginPath();
          context.moveTo(Math.cos(angle) * 34, Math.sin(angle) * 11);
          context.lineTo(Math.cos(angle) * 108, Math.sin(angle) * 34);
          context.stroke();
        }
        context.fillStyle = "#ffffff";
        context.font = "bold 38px Meiryo, sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("✝", 0, 3);
        context.restore();

        context.save();
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = Math.min(0.78, progress * 2.2);
        const beam = context.createLinearGradient(centerX, 60, centerX, groundY);
        beam.addColorStop(0, "rgba(255,255,255,0)");
        beam.addColorStop(0.25, "rgba(255,255,255,0.78)");
        beam.addColorStop(0.62, "rgba(255,244,168,0.48)");
        beam.addColorStop(1, "rgba(255,244,168,0)");
        context.fillStyle = beam;
        context.beginPath();
        context.moveTo(centerX - 34 - pulse * 12, 46);
        context.lineTo(centerX + 34 + pulse * 12, 46);
        context.lineTo(centerX + 70 + pulse * 18, groundY);
        context.lineTo(centerX - 70 - pulse * 18, groundY);
        context.closePath();
        context.fill();
        context.fillStyle = "#fff4a8";
        context.beginPath();
        context.arc(centerX, 70, 34 + pulse * 7, 0, Math.PI * 2);
        context.fill();
        context.restore();
        continue;
      }
      if (effect.type === "grandHealCast" || effect.type === "grandHealCircle" || effect.type === "grandHealFeather") {
        context.save();
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = Math.max(0, 1 - progress) * 0.85;
        context.translate(effect.x, effect.y - progress * (effect.type === "grandHealFeather" ? 34 : 10));
        if (effect.type === "grandHealFeather") {
          context.fillStyle = "#ffffff";
          context.strokeStyle = "#fff4a8";
          context.lineWidth = 2;
          context.rotate(Math.sin(progress * Math.PI * 3) * 0.35);
          context.beginPath();
          context.ellipse(0, 0, 7 * (effect.intensity || 1), 18 * (effect.intensity || 1), -0.35, 0, Math.PI * 2);
          context.fill();
          context.stroke();
          context.strokeStyle = "rgba(255,244,168,0.75)";
          context.beginPath();
          context.moveTo(0, -12);
          context.lineTo(0, 14);
          context.stroke();
        } else {
          const radius = effect.type === "grandHealCast" ? 44 + progress * 34 : 34 + progress * 18;
          context.strokeStyle = effect.type === "grandHealCast" ? "#ffffff" : "#fff4a8";
          context.fillStyle = "rgba(255,244,168,0.16)";
          context.lineWidth = effect.type === "grandHealCast" ? 7 : 4;
          context.beginPath();
          context.ellipse(0, effect.type === "grandHealCircle" ? 18 : 0, radius, radius * 0.32, 0, 0, Math.PI * 2);
          context.fill();
          context.stroke();
          context.fillStyle = "#ffffff";
          context.font = `bold ${effect.type === "grandHealCast" ? 30 : 22}px Meiryo, sans-serif`;
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText("✦", 0, effect.type === "grandHealCircle" ? 16 : 0);
        }
        context.restore();
        continue;
      }
      if (effect.type === "blessingRibbon") {
        const target = effect.target;
        const toX = target && !target.defeated ? target.x : effect.x;
        const toY = target && !target.defeated ? target.y - target.jumpZ - 82 : effect.y;
        const fromX = effect.fromX;
        const fromY = effect.fromY;
        const controlX = (fromX + toX) / 2;
        const controlY = Math.min(fromY, toY) - 70;
        context.save();
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = Math.max(0, 1 - progress) * 0.92;
        context.lineCap = "round";
        for (let lane = 0; lane < 3; lane += 1) {
          context.strokeStyle = lane === 0 ? "rgba(255,244,168,0.72)" : lane === 1 ? "rgba(189,248,255,0.66)" : "rgba(255,255,255,0.92)";
          context.lineWidth = lane === 0 ? 9 : lane === 1 ? 5 : 2.5;
          context.beginPath();
          context.moveTo(fromX, fromY + lane * 3);
          context.quadraticCurveTo(controlX, controlY - lane * 10, toX, toY);
          context.stroke();
        }
        context.fillStyle = "#fffdf1";
        for (let i = 0; i < 9; i += 1) {
          const t = (progress * 0.35 + i / 9) % 1;
          const x = (1 - t) * (1 - t) * fromX + 2 * (1 - t) * t * controlX + t * t * toX;
          const y = (1 - t) * (1 - t) * fromY + 2 * (1 - t) * t * controlY + t * t * toY;
          const size = 3 + i % 3;
          context.beginPath();
          context.moveTo(x, y - size);
          context.lineTo(x + size, y);
          context.lineTo(x, y + size);
          context.lineTo(x - size, y);
          context.closePath();
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "blessingStar") {
        const radius = 28 + progress * 56;
        context.save();
        context.translate(effect.x, effect.y - progress * 12);
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = Math.max(0, 1 - progress) * 0.88;
        context.strokeStyle = "#bdf8ff";
        context.fillStyle = "rgba(255,244,168,0.18)";
        context.lineWidth = 4;
        context.beginPath();
        context.ellipse(0, 16, radius, radius * 0.32, 0, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.fillStyle = "#fff4a8";
        context.strokeStyle = "#ffffff";
        context.lineWidth = 2;
        context.beginPath();
        for (let i = 0; i < 10; i += 1) {
          const angle = -Math.PI / 2 + i * Math.PI / 5;
          const r = i % 2 === 0 ? 18 : 8;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
        continue;
      }
      if (effect.type === "shiningPassBow") {
        const pulse = 0.5 + Math.sin(progress * Math.PI * 4) * 0.5;
        context.save();
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = Math.max(0, 1 - progress) * 0.95;
        context.strokeStyle = "#fff4a8";
        context.shadowColor = "#ffd83d";
        context.shadowBlur = 22;
        context.lineCap = "round";
        context.lineWidth = 7;
        context.beginPath();
        context.arc(0, 0, 48 + pulse * 5, -Math.PI * 0.62, Math.PI * 0.62);
        context.stroke();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(Math.cos(-Math.PI * 0.62) * 48, Math.sin(-Math.PI * 0.62) * 48);
        context.quadraticCurveTo(-30 - progress * 30, 0, Math.cos(Math.PI * 0.62) * 48, Math.sin(Math.PI * 0.62) * 48);
        context.stroke();
        context.strokeStyle = "#fff4a8";
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(-28 - progress * 18, 0);
        context.lineTo(70 + progress * 44, 0);
        context.stroke();
        context.fillStyle = "#ffffff";
        context.beginPath();
        context.moveTo(78 + progress * 48, 0);
        context.lineTo(56 + progress * 44, -10);
        context.lineTo(62 + progress * 44, 0);
        context.lineTo(56 + progress * 44, 10);
        context.closePath();
        context.fill();
        context.shadowBlur = 0;
        for (let index = 0; index < 8; index += 1) {
          const angle = index * Math.PI * 2 / 8 + progress * 5;
          const distance = 22 + progress * 72 + (index % 3) * 8;
          context.fillStyle = index % 2 ? "#ffffff" : "#ffd83d";
          context.beginPath();
          context.arc(Math.cos(angle) * distance, Math.sin(angle) * distance * 0.55, 3 + index % 3, 0, Math.PI * 2);
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
      if (effect.type === "maouLaunch") {
        const radius = 34 + progress * 128;
        context.save();
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = Math.max(0, 1 - progress);
        context.strokeStyle = "#7b19ff";
        context.lineWidth = 10 - progress * 5;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#9d0f2b";
        context.lineWidth = 6;
        for (let index = 0; index < 12; index += 1) {
          const angle = index * Math.PI * 2 / 12 + progress * 1.4;
          context.beginPath();
          context.moveTo(Math.cos(angle) * radius * 0.35, Math.sin(angle) * radius * 0.35);
          context.lineTo(Math.cos(angle) * radius * 1.24, Math.sin(angle) * radius * 1.24);
          context.stroke();
        }
        context.fillStyle = "rgba(30, 0, 12, 0.55)";
        context.beginPath();
        context.arc(0, 0, radius * 0.42, 0, Math.PI * 2);
        context.fill();
        context.restore();
        continue;
      }
      if (effect.type === "maouImpact") {
        const radius = 38 + progress * 150;
        context.save();
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = Math.max(0, 1 - progress);
        context.fillStyle = "rgba(24, 0, 20, 0.42)";
        context.beginPath();
        context.arc(0, 0, radius * 0.82, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#6c18ff";
        context.lineWidth = 16 - progress * 9;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#a40f2d";
        context.lineWidth = 9 - progress * 5;
        context.beginPath();
        context.arc(0, 0, radius * 1.35, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#050108";
        context.lineWidth = 18 - progress * 8;
        context.beginPath();
        context.moveTo(-radius * 1.45, 0);
        context.lineTo(radius * 1.45, 0);
        context.moveTo(0, -radius * 0.95);
        context.lineTo(0, radius * 0.95);
        context.stroke();
        context.strokeStyle = "#ff314b";
        context.lineWidth = 5;
        for (let index = 0; index < 18; index += 1) {
          const angle = index * Math.PI * 2 / 18 + progress * 0.55;
          const inner = radius * 0.48;
          const outer = radius * (index % 2 === 0 ? 1.58 : 1.16);
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          context.stroke();
        }
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "rgba(42, 25, 32, 0.5)";
        for (let index = 0; index < 10; index += 1) {
          const angle = index * Math.PI * 2 / 10;
          const distance = 36 + progress * (68 + index % 3 * 16);
          context.beginPath();
          context.ellipse(
            Math.cos(angle) * distance,
            48 + Math.sin(angle) * distance * 0.3,
            14 + progress * 10,
            7 + progress * 7,
            angle,
            0,
            Math.PI * 2
          );
          context.fill();
        }
        context.restore();
        continue;
      }
      if (effect.type === "arcanaImpact") {
        const intensity = effect.intensity || 1;
        const radius = 42 + progress * (188 + intensity * 58);
        const columnHeight = 110 + progress * (250 + intensity * 80);
        context.save();
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = Math.max(0, 1 - progress);
        const column = context.createLinearGradient(0, 36, 0, -columnHeight);
        column.addColorStop(0, "rgba(159,220,255,0.04)");
        column.addColorStop(0.28, "rgba(155,44,255,0.34)");
        column.addColorStop(0.68, "rgba(216,182,255,0.54)");
        column.addColorStop(1, "rgba(255,255,255,0)");
        context.fillStyle = column;
        context.beginPath();
        context.ellipse(0, -columnHeight * 0.42, 44 + intensity * 11, columnHeight * 0.58, 0, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = `rgba(216,182,255,${Math.max(0, 0.65 - progress * 0.72)})`;
        context.beginPath();
        context.arc(0, 0, 42 * (1 - progress * 0.45), 0, Math.PI * 2);
        context.fill();
        context.save();
        context.scale(1, 0.42);
        context.rotate(progress * 1.8);
        context.strokeStyle = "#d8b6ff";
        context.lineWidth = 16 - progress * 7;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#9b2cff";
        context.lineWidth = 8 - progress * 3;
        context.beginPath();
        context.arc(0, 0, radius * 1.24, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#ffffff";
        context.lineWidth = 4;
        for (let mark = 0; mark < 12; mark += 1) {
          const angle = mark * Math.PI * 2 / 12;
          const inner = radius * 0.46;
          const outer = radius * (0.78 + (mark % 3) * 0.08);
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          context.stroke();
        }
        context.strokeStyle = "#8ffcff";
        context.lineWidth = 4;
        context.beginPath();
        for (let i = 0; i < 3; i += 1) {
          const angle = -Math.PI / 2 + i * Math.PI * 2 / 3 + progress * 1.4;
          const px = Math.cos(angle) * radius * 0.72;
          const py = Math.sin(angle) * radius * 0.72;
          if (i === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.closePath();
        context.stroke();
        context.restore();
        const colors = ["#ffffff", "#d8b6ff", "#9b2cff", "#8ffcff"];
        for (let index = 0; index < 28; index += 1) {
          const angle = index * Math.PI * 2 / 28 + progress * 1.3;
          const inner = radius * 0.18;
          const outer = radius * (0.78 + (index % 4) * 0.18);
          context.strokeStyle = colors[index % colors.length];
          context.lineWidth = index % 3 === 0 ? 6 : 3;
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner - progress * 24);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer - progress * 68);
          context.stroke();
        }
        context.fillStyle = "#f5e7ff";
        for (let star = 0; star < 18; star += 1) {
          const angle = star * Math.PI * 2 / 18 + progress * 2.2;
          const dist = radius * (0.24 + (star % 5) * 0.14);
          context.globalAlpha = Math.max(0, (1 - progress) * (0.42 + (star % 4) * 0.12));
          context.save();
          context.translate(Math.cos(angle) * dist, Math.sin(angle) * dist * 0.45 - progress * (40 + star * 5));
          context.rotate(angle);
          context.beginPath();
          context.moveTo(0, -7);
          context.lineTo(2, -2);
          context.lineTo(7, 0);
          context.lineTo(2, 2);
          context.lineTo(0, 7);
          context.lineTo(-2, 2);
          context.lineTo(-7, 0);
          context.lineTo(-2, -2);
          context.closePath();
          context.fill();
          context.restore();
        }
        context.restore();
        return;
      }
      if (effect.type === "hellfireImpact") {
        const intensity = effect.intensity || 1;
        const radius = 44 + progress * (170 + intensity * 48);
        const columnHeight = 80 + progress * (300 + intensity * 90);
        context.save();
        context.translate(effect.x, effect.y);
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = Math.max(0, 1 - progress);
        const column = context.createLinearGradient(0, 28, 0, -columnHeight);
        column.addColorStop(0, "rgba(255, 36, 55, 0.1)");
        column.addColorStop(0.28, "rgba(255, 44, 66, 0.62)");
        column.addColorStop(0.62, "rgba(114, 20, 255, 0.58)");
        column.addColorStop(1, "rgba(4, 1, 8, 0)");
        context.fillStyle = column;
        context.beginPath();
        context.moveTo(-radius * 0.38, 26);
        context.bezierCurveTo(-radius * 0.9, -columnHeight * 0.32, -radius * 0.38, -columnHeight * 0.78, 0, -columnHeight);
        context.bezierCurveTo(radius * 0.5, -columnHeight * 0.76, radius * 0.88, -columnHeight * 0.28, radius * 0.36, 26);
        context.closePath();
        context.fill();

        context.strokeStyle = "#050108";
        context.lineWidth = 18 - progress * 8;
        context.beginPath();
        context.moveTo(0, 20);
        context.lineTo(-radius * 1.1, -columnHeight * 0.32);
        context.moveTo(0, 20);
        context.lineTo(radius * 1.0, -columnHeight * 0.42);
        context.moveTo(0, 20);
        context.lineTo(0, -columnHeight * 0.9);
        context.stroke();

        context.strokeStyle = "#b82fff";
        context.lineWidth = 13 - progress * 7;
        context.beginPath();
        context.ellipse(0, 28, radius, radius * 0.34, 0, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = "#ff334a";
        context.lineWidth = 8 - progress * 4;
        context.beginPath();
        context.ellipse(0, 30, radius * 1.32, radius * 0.42, 0, 0, Math.PI * 2);
        context.stroke();

        context.globalCompositeOperation = "source-over";
        context.strokeStyle = "rgba(22, 6, 18, 0.72)";
        context.lineWidth = 7;
        for (let crack = 0; crack < 9; crack += 1) {
          const angle = crack * Math.PI * 2 / 9 + progress * 0.2;
          const length = radius * (0.8 + crack % 3 * 0.28);
          context.beginPath();
          context.moveTo(Math.cos(angle) * radius * 0.18, 30 + Math.sin(angle) * radius * 0.08);
          context.lineTo(Math.cos(angle) * length, 30 + Math.sin(angle) * length * 0.24);
          context.stroke();
        }
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
      context.globalCompositeOperation = "lighter";
      if (shot.trail.length > 1) {
        context.lineCap = "round";
        context.lineJoin = "round";
        context.globalAlpha = 0.24;
        context.strokeStyle = shot.color;
        context.lineWidth = 24;
        context.beginPath();
        shot.trail.forEach((point, index) => {
          const pointY = point.y - point.z;
          if (index === 0) context.moveTo(point.x, pointY);
          else context.lineTo(point.x, pointY);
        });
        context.stroke();
        context.globalAlpha = 0.74;
        context.strokeStyle = shot.color;
        context.lineWidth = 11;
        context.beginPath();
        shot.trail.forEach((point, index) => {
          const pointY = point.y - point.z;
          if (index === 0) context.moveTo(point.x, pointY);
          else context.lineTo(point.x, pointY);
        });
        context.stroke();
        context.globalAlpha = 0.9;
        context.strokeStyle = "#ffffff";
        context.lineWidth = 4;
        context.beginPath();
        shot.trail.forEach((point, index) => {
          const pointY = point.y - point.z;
          if (index === 0) context.moveTo(point.x, pointY);
          else context.lineTo(point.x, pointY);
        });
        context.stroke();
      }

      const speed = Math.hypot(shot.vx, shot.vy) || 1;
      const tailX = -shot.vx / speed;
      const tailY = -shot.vy / speed;
      const sideX = -tailY;
      const sideY = tailX;
      context.globalAlpha = 0.74;
      context.strokeStyle = shot.color;
      context.lineWidth = 5;
      context.beginPath();
      for (let index = 0; index <= 10; index += 1) {
        const distance = 10 + index * 12;
        const wave = Math.sin(shot.spin * 0.6 + index * 0.88 + shot.lane) * 17;
        const px = shot.x + tailX * distance + sideX * wave;
        const py = drawY + tailY * distance + sideY * wave;
        if (index === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.stroke();

      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 0.68;
      context.fillStyle = "rgba(40, 28, 16, 0.18)";
      context.beginPath();
      context.ellipse(shot.x + 3, shot.y + 10, shot.radius, shot.radius * 0.36, 0, 0, Math.PI * 2);
      context.fill();
      context.translate(shot.x, drawY);
      context.rotate(shot.spin);
      const orb = context.createRadialGradient(-shot.radius * 0.3, -shot.radius * 0.3, 3, 0, 0, shot.radius);
      orb.addColorStop(0, "#ffffff");
      orb.addColorStop(0.42, shot.color);
      orb.addColorStop(1, shot.lane < 0 ? "#208bbd" : "#d28717");
      context.fillStyle = orb;
      context.beginPath();
      context.arc(0, 0, shot.radius, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#ffffff";
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

  drawHellfireZones(context) {
    if (!this.hellfireZones || this.hellfireZones.length === 0) return;
    context.save();
    for (const zone of this.hellfireZones) {
      const progress = 1 - zone.life / Math.max(0.01, zone.maxLife);
      const time = performance.now();
      const pulse = 0.9 + Math.sin(time / 82 + zone.x * 0.01) * 0.13;
      const radius = zone.radius * 1.48 * (0.9 + progress * 0.16) * pulse;
      context.globalAlpha = Math.max(0, 0.84 - progress * 0.42);
      context.fillStyle = "rgba(10, 1, 12, 0.78)";
      context.beginPath();
      context.ellipse(zone.x, zone.y + 8, radius, radius * 0.42, 0, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = Math.max(0, 0.58 - progress * 0.24);
      context.strokeStyle = "#7d18ff";
      context.lineWidth = 20;
      context.beginPath();
      context.ellipse(zone.x, zone.y + 8, radius * 1.08, radius * 0.48, 0, 0, Math.PI * 2);
      context.stroke();
      context.globalAlpha = Math.max(0, 0.72 - progress * 0.34);
      context.strokeStyle = "#ff314b";
      context.lineWidth = 8;
      context.beginPath();
      context.ellipse(zone.x, zone.y + 8, radius * 0.82, radius * 0.31, 0, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = "rgba(15, 4, 12, 0.72)";
      context.lineWidth = 6;
      for (let crack = 0; crack < 12; crack += 1) {
        const angle = crack * Math.PI * 2 / 12 + progress * 0.25;
        const inner = radius * 0.2;
        const outer = radius * (0.72 + crack % 4 * 0.12);
        context.beginPath();
        context.moveTo(zone.x + Math.cos(angle) * inner, zone.y + 8 + Math.sin(angle) * inner * 0.28);
        context.lineTo(zone.x + Math.cos(angle) * outer, zone.y + 8 + Math.sin(angle) * outer * 0.28);
        context.stroke();
      }
      context.globalCompositeOperation = "lighter";
      for (let flame = 0; flame < 14; flame += 1) {
        const angle = flame * Math.PI * 2 / 14 + progress * 1.2;
        const fx = zone.x + Math.cos(angle) * radius * 0.52;
        const fy = zone.y + Math.sin(angle) * radius * 0.22;
        const height = 58 + Math.sin(time / 100 + flame) * 18 + (flame % 3) * 12;
        context.fillStyle = flame % 3 === 0 ? "rgba(176, 45, 255, 0.58)" : flame % 3 === 1 ? "rgba(255, 49, 75, 0.42)" : "rgba(18, 3, 24, 0.84)";
        context.beginPath();
        context.moveTo(fx - 18, fy + 10);
        context.quadraticCurveTo(fx - 12, fy - height * 0.58, fx + Math.sin(time / 60 + flame) * 8, fy - height);
        context.quadraticCurveTo(fx + 13, fy - height * 0.48, fx + 18, fy + 10);
        context.closePath();
        context.fill();
      }
      context.globalCompositeOperation = "source-over";
    }
    context.restore();
  }

  drawMeteorLavaZones(context) {
    if (!this.meteorLavaZones || this.meteorLavaZones.length === 0) return;
    context.save();
    const time = performance.now();
    for (const zone of this.meteorLavaZones) {
      const progress = 1 - zone.life / Math.max(0.01, zone.maxLife);
      const pulse = 0.9 + Math.sin(time / 96 + zone.x * 0.01) * 0.12;
      const radius = zone.radius * (0.94 + progress * 0.08) * pulse;
      context.globalAlpha = Math.max(0, 0.78 - progress * 0.38);
      context.fillStyle = "rgba(35, 7, 3, 0.72)";
      context.beginPath();
      context.ellipse(zone.x, zone.y + 8, radius, radius * 0.42, 0, 0, Math.PI * 2);
      context.fill();

      context.globalCompositeOperation = "lighter";
      context.globalAlpha = Math.max(0, 0.6 - progress * 0.26);
      context.fillStyle = "rgba(255, 88, 24, 0.52)";
      context.beginPath();
      context.ellipse(zone.x, zone.y + 8, radius * 0.78, radius * 0.29, 0, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#ffd36a";
      context.lineWidth = 5;
      context.beginPath();
      context.ellipse(zone.x, zone.y + 8, radius * 0.62, radius * 0.23, 0, 0, Math.PI * 2);
      context.stroke();
      context.globalCompositeOperation = "source-over";

      context.strokeStyle = "rgba(30, 8, 4, 0.82)";
      context.lineWidth = 7;
      context.lineCap = "round";
      for (let crack = 0; crack < 12; crack += 1) {
        const angle = crack * Math.PI * 2 / 12 + progress * 0.2;
        const inner = radius * 0.18;
        const outer = radius * (0.64 + (crack % 4) * 0.09);
        context.beginPath();
        context.moveTo(zone.x + Math.cos(angle) * inner, zone.y + 8 + Math.sin(angle) * inner * 0.28);
        context.lineTo(zone.x + Math.cos(angle) * outer, zone.y + 8 + Math.sin(angle) * outer * 0.28);
        context.stroke();
      }

      context.globalCompositeOperation = "lighter";
      for (let spark = 0; spark < 10; spark += 1) {
        const angle = spark * Math.PI * 2 / 10 + time / 460;
        const dist = radius * (0.24 + (spark % 5) * 0.1);
        const sx = zone.x + Math.cos(angle) * dist;
        const sy = zone.y + 8 + Math.sin(angle) * dist * 0.24;
        context.globalAlpha = 0.28 + (spark % 3) * 0.08;
        context.fillStyle = spark % 2 === 0 ? "#ff5a1f" : "#ffd36a";
        context.beginPath();
        context.arc(sx, sy - Math.sin(time / 120 + spark) * 10, 3 + (spark % 3), 0, Math.PI * 2);
        context.fill();
      }
      context.globalCompositeOperation = "source-over";
    }
    context.restore();
  }

  drawHellfireFlash() {
    if (!this.hellfireFlashTimer || this.hellfireFlashTimer <= 0) return;
    const context = this.context;
    const ratio = this.hellfireFlashTimer / Math.max(0.01, this.hellfireFlashDuration || 0.36);
    const progress = 1 - ratio;
    const alpha = Math.max(0, ratio) * 0.42;

    context.save();
    context.globalCompositeOperation = "source-over";
    context.fillStyle = `rgba(3, 0, 8, ${alpha})`;
    context.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

    context.globalCompositeOperation = "lighter";
    const centerX = GAME_CONFIG.width * 0.5;
    const centerY = GAME_CONFIG.height * 0.45;
    const radius = 120 + progress * 780;
    const glow = context.createRadialGradient(centerX, centerY, 20, centerX, centerY, radius);
    glow.addColorStop(0, `rgba(255, 49, 75, ${ratio * 0.32})`);
    glow.addColorStop(0.34, `rgba(123, 28, 255, ${ratio * 0.22})`);
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

    context.globalAlpha = ratio * 0.5;
    context.strokeStyle = "#ff314b";
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(centerX - radius * 0.75, centerY);
    context.lineTo(centerX + radius * 0.75, centerY);
    context.moveTo(centerX, centerY - radius * 0.42);
    context.lineTo(centerX, centerY + radius * 0.42);
    context.stroke();
    context.restore();
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
    const anticipationTime = this.getSpecialAnticipationTime(pending.specialType);
    if (pending.timer > anticipationTime) return;
    const actor = pending.actor;
    if (!actor || actor.defeated || this.ball.owner !== actor) return;

    const context = this.context;
    const pulse = 0.5 + Math.sin(performance.now() / 42) * 0.5;
    const progress = Math.max(0, Math.min(1, 1 - pending.timer / anticipationTime));
    const x = actor.x;
    const y = actor.y - actor.jumpZ - 66;
    const burstRadius = 82 + progress * 78 + pulse * 18;

    if (pending.specialType === "slap") {
      const time = performance.now();
      const groundY = actor.y + 10;
      const palmX = actor.x + actor.facing * (42 + progress * 16);
      const palmY = actor.y - actor.jumpZ - 70;
      context.save();
      context.globalCompositeOperation = "lighter";

      context.globalAlpha = 0.28 + progress * 0.38;
      context.fillStyle = "rgba(255, 168, 74, 0.34)";
      context.beginPath();
      context.ellipse(actor.x, groundY, 70 + progress * 44, 22 + progress * 8, 0, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = "#ffb35c";
      context.lineWidth = 5 + progress * 4;
      for (let ring = 0; ring < 3; ring += 1) {
        context.save();
        context.translate(actor.x, groundY);
        context.rotate((ring % 2 === 0 ? 1 : -1) * time / (360 + ring * 80));
        context.scale(1, 0.34);
        context.globalAlpha = 0.72 - ring * 0.14;
        context.beginPath();
        context.arc(0, 0, 44 + progress * 36 + ring * 19, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      }

      const palmGlow = context.createRadialGradient(palmX, palmY, 6, palmX, palmY, 76 + progress * 58);
      palmGlow.addColorStop(0, "rgba(255, 255, 210, 0.95)");
      palmGlow.addColorStop(0.28, "rgba(255, 117, 48, 0.72)");
      palmGlow.addColorStop(0.72, "rgba(255, 55, 24, 0.22)");
      palmGlow.addColorStop(1, "rgba(255, 55, 24, 0)");
      context.globalAlpha = 0.78;
      context.fillStyle = palmGlow;
      context.beginPath();
      context.arc(palmX, palmY, 62 + progress * 52 + pulse * 9, 0, Math.PI * 2);
      context.fill();

      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 0.9;
      context.fillStyle = "#ffe7a0";
      context.strokeStyle = "#8b2d12";
      context.lineWidth = 4;
      context.save();
      context.translate(palmX, palmY);
      context.rotate(actor.facing * (-0.18 + progress * 0.08));
      context.scale(actor.facing, 1);
      context.beginPath();
      context.ellipse(0, 0, 18 + progress * 7, 24 + progress * 8, 0, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      for (let finger = 0; finger < 4; finger += 1) {
        this.roundRect(context, -20 + finger * 10, -32 - progress * 4, 8, 24 + progress * 8, 4);
        context.fill();
        context.stroke();
      }
      context.beginPath();
      context.ellipse(-21, -4, 8, 18, -0.5, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.restore();

      context.globalCompositeOperation = "lighter";
      context.strokeStyle = "#fff0a0";
      context.lineWidth = 5;
      for (let i = 0; i < 12; i += 1) {
        const angle = time / 90 + i * Math.PI * 2 / 12;
        const inner = 34 + progress * 16;
        const outer = 76 + progress * 74 + (i % 3) * 12;
        context.globalAlpha = 0.42 + progress * 0.32;
        context.beginPath();
        context.moveTo(palmX + Math.cos(angle) * inner, palmY + Math.sin(angle) * inner * 0.72);
        context.lineTo(palmX + Math.cos(angle) * outer, palmY + Math.sin(angle) * outer * 0.72);
        context.stroke();
      }
      context.restore();
      return;
    }

    if (pending.specialType === "hellfire") {
      const groundY = actor.y + 10;
      const time = performance.now();
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.34 + progress * 0.44;
      context.fillStyle = "rgba(8, 1, 12, 0.72)";
      context.beginPath();
      context.ellipse(actor.x, groundY, 104 + progress * 54, 38 + progress * 16, 0, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = "#7b1cff";
      context.lineWidth = 7 + progress * 5;
      for (let ring = 0; ring < 3; ring += 1) {
        context.save();
        context.translate(actor.x, groundY);
        context.rotate((ring % 2 === 0 ? 1 : -1) * time / (520 + ring * 120));
        context.globalAlpha = 0.72 - ring * 0.14;
        context.beginPath();
        context.ellipse(0, 0, 78 + progress * 46 + ring * 28, 26 + progress * 11 + ring * 9, 0, 0, Math.PI * 2);
        context.stroke();
        for (let mark = 0; mark < 8; mark += 1) {
          const angle = mark * Math.PI * 2 / 8;
          const inner = 42 + ring * 20;
          const outer = 64 + progress * 42 + ring * 24;
          context.beginPath();
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner * 0.34);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer * 0.34);
          context.stroke();
        }
        context.restore();
      }

      const handGlow = context.createRadialGradient(x, y, 6, x, y, burstRadius * 1.35);
      handGlow.addColorStop(0, "rgba(255, 49, 75, 0.88)");
      handGlow.addColorStop(0.35, "rgba(123, 28, 255, 0.54)");
      handGlow.addColorStop(1, "rgba(5, 1, 8, 0)");
      context.globalAlpha = 0.82;
      context.fillStyle = handGlow;
      context.beginPath();
      context.arc(x, y, burstRadius * 1.25, 0, Math.PI * 2);
      context.fill();

      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 0.92;
      context.fillStyle = "#050108";
      context.beginPath();
      context.arc(x, y, 28 + progress * 18 + pulse * 5, 0, Math.PI * 2);
      context.fill();
      context.globalCompositeOperation = "lighter";
      context.strokeStyle = "#ff314b";
      context.lineWidth = 5;
      for (let crack = 0; crack < 6; crack += 1) {
        const angle = time / 110 + crack * Math.PI * 2 / 6;
        const inner = 8 + progress * 5;
        const outer = 34 + progress * 36 + (crack % 2) * 12;
        context.beginPath();
        context.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
        context.lineTo(x + Math.cos(angle + 0.18) * outer, y + Math.sin(angle + 0.18) * outer);
        context.stroke();
      }

      context.strokeStyle = "#ff314b";
      context.lineWidth = 6;
      context.globalAlpha = 0.88;
      for (let index = 0; index < 18; index += 1) {
        const angle = time / 70 + index * Math.PI * 2 / 18;
        const inner = 36 + progress * 18;
        const outer = burstRadius * (0.78 + (index % 3) * 0.12);
        context.beginPath();
        context.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
        context.lineTo(x + Math.cos(angle) * outer, y + Math.sin(angle) * outer);
        context.stroke();
      }
      context.restore();
      return;
    }

    if (pending.specialType === "arcanaSphere") {
      const groundY = actor.y + 12;
      const time = performance.now();
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.28 + progress * 0.48;
      context.fillStyle = "rgba(54, 12, 88, 0.42)";
      context.beginPath();
      context.ellipse(actor.x, groundY, 92 + progress * 54, 30 + progress * 18, 0, 0, Math.PI * 2);
      context.fill();

      for (let ring = 0; ring < 3; ring += 1) {
        context.save();
        context.translate(actor.x, groundY);
        context.rotate((ring % 2 === 0 ? 1 : -1) * time / (430 + ring * 95));
        context.scale(1, 0.38);
        context.globalAlpha = 0.88 - ring * 0.18;
        context.strokeStyle = ring === 0 ? "#f5e7ff" : ring === 1 ? "#9fdcff" : "#ff6ee7";
        context.lineWidth = 5 + progress * 3 - ring;
        const ringRadius = 58 + progress * 44 + ring * 24;
        context.beginPath();
        context.arc(0, 0, ringRadius, 0, Math.PI * 2);
        context.stroke();
        context.lineWidth = 3;
        context.beginPath();
        for (let mark = 0; mark < 12; mark += 1) {
          const angle = mark * Math.PI * 2 / 12;
          const inner = ringRadius * 0.58;
          const outer = ringRadius * 0.84;
          context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
        }
        context.stroke();
        context.restore();
      }

      const handGlow = context.createRadialGradient(x, y, 4, x, y, burstRadius * 1.15);
      handGlow.addColorStop(0, "rgba(255,255,255,0.95)");
      handGlow.addColorStop(0.2, "rgba(216,182,255,0.82)");
      handGlow.addColorStop(0.5, "rgba(155,44,255,0.48)");
      handGlow.addColorStop(1, "rgba(10,3,18,0)");
      context.globalAlpha = 0.82;
      context.fillStyle = handGlow;
      context.beginPath();
      context.arc(x, y, burstRadius * (0.82 + pulse * 0.12), 0, Math.PI * 2);
      context.fill();

      context.save();
      context.translate(x, y);
      context.rotate(time / 95);
      context.strokeStyle = "#ffffff";
      context.lineWidth = 4 + progress * 2;
      for (let ring = 0; ring < 3; ring += 1) {
        context.save();
        context.rotate(ring * Math.PI / 3);
        context.scale(ring === 1 ? 0.72 : 1, ring === 2 ? 0.62 : 1);
        context.globalAlpha = 0.88 - ring * 0.16;
        context.beginPath();
        context.ellipse(0, 0, 28 + progress * 28 + ring * 12, 12 + progress * 13 + ring * 5, 0, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      }
      context.globalCompositeOperation = "source-over";
      const core = context.createRadialGradient(-8, -8, 3, 0, 0, 34 + progress * 18);
      core.addColorStop(0, "#ffffff");
      core.addColorStop(0.28, "#d8b6ff");
      core.addColorStop(0.62, "#381058");
      core.addColorStop(1, "#050108");
      context.fillStyle = core;
      context.beginPath();
      context.arc(0, 0, 22 + progress * 17 + pulse * 4, 0, Math.PI * 2);
      context.fill();
      context.restore();

      context.globalCompositeOperation = "lighter";
      const colors = ["#ffffff", "#d8b6ff", "#9fdcff", "#ff6ee7"];
      for (let index = 0; index < 22; index += 1) {
        const angle = -time / 85 + index * Math.PI * 2 / 22;
        const dist = 46 + progress * 54 + (index % 4) * 12;
        context.globalAlpha = 0.42 + (index % 4) * 0.1;
        context.fillStyle = colors[index % colors.length];
        context.save();
        context.translate(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist * 0.68);
        context.rotate(angle + time / 260);
        context.beginPath();
        if (index % 3 === 0) {
          context.rect(-4, -7, 8, 14);
        } else {
          context.moveTo(0, -6);
          context.lineTo(5, 5);
          context.lineTo(-5, 5);
          context.closePath();
        }
        context.fill();
        context.restore();
      }
      context.restore();
      return;
    }

    if (pending.specialType === "braveSlash") {
      const groundY = actor.y + 12;
      const time = performance.now();
      const allies = (actor.team === "left" ? this.leftTeam : this.rightTeam)
        .filter((member) => member && member !== actor && !member.defeated && member.hp > 0)
        .sort((a, b) => Math.hypot(a.x - actor.x, a.y - actor.y) - Math.hypot(b.x - actor.x, b.y - actor.y))
        .slice(0, 3);
      const allyPower = allies.length;
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.28 + progress * 0.48;
      context.fillStyle = "rgba(255, 216, 61, 0.24)";
      context.beginPath();
      context.ellipse(actor.x, groundY, 54 + progress * 34, 19 + progress * 9, 0, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = "#ffd83d";
      context.lineWidth = 4 + progress * 3;
      for (let ring = 0; ring < 2; ring += 1) {
        context.save();
        context.translate(actor.x, groundY);
        context.rotate((ring % 2 === 0 ? 1 : -1) * time / (360 + ring * 120));
        context.scale(1, 0.36);
        context.globalAlpha = 0.86 - ring * 0.2;
        context.beginPath();
        context.arc(0, 0, 46 + progress * 32 + ring * 17, 0, Math.PI * 2);
        context.stroke();
        for (let mark = 0; mark < 8; mark += 1) {
          const angle = mark * Math.PI * 2 / 8;
          context.beginPath();
          context.moveTo(Math.cos(angle) * 24, Math.sin(angle) * 24);
          context.lineTo(Math.cos(angle) * (42 + progress * 24), Math.sin(angle) * (42 + progress * 24));
          context.stroke();
        }
        context.restore();
      }

      for (const [index, ally] of allies.entries()) {
        const allyX = ally.x;
        const allyY = ally.y - ally.jumpZ - 80;
        const targetX = actor.x + actor.facing * 8;
        const targetY = actor.y - actor.jumpZ - 76;
        context.globalAlpha = (0.38 + progress * 0.46) * (1 - index * 0.12);
        context.strokeStyle = index === 1 ? "#ffffff" : "#ffd83d";
        context.lineWidth = 3 + progress * 4;
        context.beginPath();
        context.moveTo(allyX, allyY);
        context.quadraticCurveTo(
          (allyX + targetX) / 2,
          Math.min(allyY, targetY) - 36 - index * 10,
          targetX,
          targetY
        );
        context.stroke();
        context.fillStyle = index === 2 ? "#8fd8ff" : "#fffdf1";
        context.beginPath();
        context.arc(allyX, allyY, 5 + progress * 5, 0, Math.PI * 2);
        context.fill();
      }

      const ballX = actor.x + actor.facing * 12;
      const ballY = actor.y - actor.jumpZ - 78;
      const ballGlow = context.createRadialGradient(ballX, ballY, 4, ballX, ballY, 48 + progress * 38);
      ballGlow.addColorStop(0, "rgba(255,255,255,0.98)");
      ballGlow.addColorStop(0.32, "rgba(255,216,61,0.78)");
      ballGlow.addColorStop(0.66, allyPower > 0 ? "rgba(143,216,255,0.28)" : "rgba(210,48,48,0.3)");
      ballGlow.addColorStop(1, "rgba(255,216,61,0)");
      context.globalAlpha = 0.9;
      context.fillStyle = ballGlow;
      context.beginPath();
      context.arc(ballX, ballY, 52 + progress * 24 + pulse * 7, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#fffdf1";
      context.beginPath();
      context.arc(ballX, ballY, 18 + progress * 5, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = allyPower > 0 ? "#ffd83d" : "#d83232";
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(ballX, ballY - 12 - progress * 3);
      context.lineTo(ballX + 10 + progress * 4, ballY);
      context.lineTo(ballX, ballY + 12 + progress * 3);
      context.lineTo(ballX - 10 - progress * 4, ballY);
      context.closePath();
      context.stroke();

      context.globalAlpha = 0.38 + progress * 0.38;
      context.fillStyle = allyPower > 0 ? "rgba(255, 216, 61, 0.18)" : "rgba(210, 48, 48, 0.16)";
      context.beginPath();
      context.moveTo(actor.x - actor.facing * 10, actor.y - actor.jumpZ - 92);
      context.quadraticCurveTo(actor.x - actor.facing * (58 + progress * 24), actor.y - actor.jumpZ - 78, actor.x - actor.facing * (72 + progress * 34), actor.y - actor.jumpZ - 34);
      context.quadraticCurveTo(actor.x - actor.facing * 28, actor.y - actor.jumpZ - 54, actor.x - actor.facing * 10, actor.y - actor.jumpZ - 32);
      context.fill();

      const swordX = actor.x + actor.facing * 34;
      const swordY = actor.y - actor.jumpZ - 112;
      const glow = context.createRadialGradient(swordX, swordY, 4, swordX, swordY, 84 + progress * 42);
      glow.addColorStop(0, "rgba(255,255,255,0.95)");
      glow.addColorStop(0.26, "rgba(255,216,61,0.82)");
      glow.addColorStop(0.58, "rgba(143,216,255,0.36)");
      glow.addColorStop(1, "rgba(255,216,61,0)");
      context.fillStyle = glow;
      context.globalAlpha = 0.82;
      context.beginPath();
      context.arc(swordX, swordY, 86 + progress * 32 + pulse * 8, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = "#ffffff";
      context.lineWidth = 5 + progress * 3;
      context.lineCap = "round";
      context.globalAlpha = 0.92;
      context.beginPath();
      context.moveTo(swordX - actor.facing * 10, swordY + 26);
      context.lineTo(swordX + actor.facing * 22, swordY - 50 - progress * 18);
      context.stroke();
      context.strokeStyle = "#ffd83d";
      context.lineWidth = 11 + progress * 5;
      context.globalAlpha = 0.34 + progress * 0.28;
      context.beginPath();
      context.moveTo(swordX - actor.facing * 10, swordY + 26);
      context.lineTo(swordX + actor.facing * 22, swordY - 50 - progress * 18);
      context.stroke();

      context.fillStyle = "#ffd83d";
      context.globalAlpha = 0.72;
      for (let index = 0; index < 12; index += 1) {
        const angle = time / 90 + index * Math.PI / 6;
        const distance = 42 + progress * 54 + (index % 3) * 8;
        context.beginPath();
        context.arc(
          swordX + Math.cos(angle) * distance,
          swordY + Math.sin(angle) * distance * 0.72,
          3 + progress * 3,
          0,
          Math.PI * 2
        );
        context.fill();
      }
      context.restore();
      return;
    }

    if (pending.specialType === "gigaBreak") {
      const groundY = actor.y + 14;
      const time = performance.now();
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.22 + progress * 0.42;
      context.fillStyle = "rgba(96, 20, 12, 0.5)";
      context.beginPath();
      context.ellipse(actor.x, groundY, 72 + progress * 46, 24 + progress * 12, 0, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#d9442e";
      context.lineWidth = 6 + progress * 5;
      context.lineCap = "round";
      for (let index = 0; index < 9; index += 1) {
        const angle = time / 110 + index * Math.PI * 2 / 9;
        const inner = 34 + progress * 18;
        const outer = 74 + progress * 52 + (index % 3) * 14;
        context.beginPath();
        context.moveTo(actor.x + Math.cos(angle) * inner, groundY + Math.sin(angle) * inner * 0.35);
        context.lineTo(actor.x + Math.cos(angle) * outer, groundY + Math.sin(angle) * outer * 0.35);
        context.stroke();
      }
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 0.58;
      context.fillStyle = "rgba(83, 58, 38, 0.55)";
      for (let index = 0; index < 12; index += 1) {
        const angle = index * Math.PI * 2 / 12;
        const dist = 26 + progress * (58 + (index % 4) * 8);
        context.beginPath();
        context.ellipse(actor.x + Math.cos(angle) * dist, groundY + 22 + Math.sin(angle) * dist * 0.18, 18 + progress * 8, 8 + progress * 5, angle, 0, Math.PI * 2);
        context.fill();
      }
      context.strokeStyle = "#5a2a18";
      context.lineWidth = 4;
      for (let index = 0; index < 8; index += 1) {
        const angle = -0.75 + index * Math.PI * 1.5 / 7;
        context.beginPath();
        context.moveTo(actor.x, groundY + 20);
        context.lineTo(actor.x + Math.cos(angle) * (46 + progress * 44), groundY + 20 + Math.sin(angle) * (15 + progress * 18));
        context.stroke();
      }
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.74;
      context.strokeStyle = "#1b1110";
      context.lineWidth = 16 + progress * 5;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(actor.x - actor.facing * 58, actor.y - actor.jumpZ - 128);
      context.lineTo(actor.x + actor.facing * 62, actor.y - actor.jumpZ - 60);
      context.stroke();
      context.strokeStyle = "#9a9188";
      context.lineWidth = 8 + progress * 2;
      context.beginPath();
      context.moveTo(actor.x - actor.facing * 52, actor.y - actor.jumpZ - 126);
      context.lineTo(actor.x + actor.facing * 56, actor.y - actor.jumpZ - 62);
      context.stroke();

      const ballX = actor.x + actor.facing * 60;
      const ballY = actor.y - actor.jumpZ - 70 + Math.sin(time / 80) * 4;
      context.globalAlpha = 0.82;
      context.fillStyle = "rgba(70, 20, 12, 0.72)";
      context.beginPath();
      context.ellipse(ballX, ballY, 28 + progress * 5, 20 - progress * 3, 0, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#ff6244";
      context.lineWidth = 4;
      context.beginPath();
      context.ellipse(ballX, ballY, 32 + progress * 6, 23 - progress * 2, 0, 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = "#ffb347";
      for (let index = 0; index < 10; index += 1) {
        const angle = time / 55 + index * Math.PI * 2 / 10;
        context.beginPath();
        context.arc(ballX + Math.cos(angle) * (30 + progress * 16), ballY + Math.sin(angle) * (18 + progress * 10), 2.5 + index % 2, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
      return;
    }

    if (pending.specialType === "fireball") {
      const time = performance.now();
      const staffX = actor.x + actor.facing * 26;
      const staffY = actor.y - actor.jumpZ - 96;
      context.save();
      context.globalCompositeOperation = "lighter";
      const glow = context.createRadialGradient(staffX, staffY, 4, staffX, staffY, 78 + progress * 46);
      glow.addColorStop(0, "rgba(255,255,255,0.95)");
      glow.addColorStop(0.24, "rgba(255,210,84,0.88)");
      glow.addColorStop(0.58, "rgba(255,80,20,0.46)");
      glow.addColorStop(1, "rgba(255,42,8,0)");
      context.globalAlpha = 0.86;
      context.fillStyle = glow;
      context.beginPath();
      context.arc(staffX, staffY, 72 + progress * 42 + pulse * 8, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#ff7a1f";
      for (let index = 0; index < 16; index += 1) {
        const angle = time / 62 + index * Math.PI * 2 / 16;
        const distance = 18 + progress * 48 + (index % 4) * 7;
        context.beginPath();
        context.arc(staffX + Math.cos(angle) * distance, staffY + Math.sin(angle) * distance, 3 + index % 4, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 0.94;
      context.fillStyle = "#fff0a0";
      context.beginPath();
      context.arc(staffX, staffY, 16 + progress * 10 + pulse * 3, 0, Math.PI * 2);
      context.fill();
      context.restore();
      return;
    }

    if (pending.specialType === "holyLance") {
      const groundY = actor.y + 12;
      const time = performance.now();
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.24 + progress * 0.46;
      context.strokeStyle = "#fff4a8";
      context.lineWidth = 4 + progress * 3;
      context.beginPath();
      context.ellipse(actor.x, groundY, 58 + progress * 42, 20 + progress * 10, 0, 0, Math.PI * 2);
      context.stroke();
      const centerY = actor.y - actor.jumpZ - 74;
      const glow = context.createRadialGradient(actor.x, centerY, 5, actor.x, centerY, 96 + progress * 48);
      glow.addColorStop(0, "rgba(255,255,255,0.96)");
      glow.addColorStop(0.34, "rgba(255,244,168,0.78)");
      glow.addColorStop(1, "rgba(255,244,168,0)");
      context.fillStyle = glow;
      context.globalAlpha = 0.82;
      context.beginPath();
      context.arc(actor.x, centerY, 90 + progress * 38, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#ffffff";
      context.lineWidth = 5;
      context.lineCap = "round";
      context.globalAlpha = 0.9;
      context.beginPath();
      context.moveTo(actor.x - actor.facing * 46, centerY);
      context.lineTo(actor.x + actor.facing * (86 + progress * 28), centerY);
      context.stroke();
      context.fillStyle = "#ffd83d";
      for (let index = 0; index < 14; index += 1) {
        const angle = time / 95 + index * Math.PI * 2 / 14;
        const dist = 34 + progress * 52 + (index % 3) * 10;
        context.beginPath();
        context.arc(actor.x + Math.cos(angle) * dist, centerY + Math.sin(angle) * dist * 0.62, 3, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
      return;
    }

    if (pending.specialType === "shiningArrow") {
      const time = performance.now();
      const bowX = actor.x + actor.facing * 34;
      const bowY = actor.y - actor.jumpZ - 72;
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.36 + progress * 0.48;
      context.strokeStyle = "#ffe36a";
      context.lineWidth = 6;
      context.lineCap = "round";
      context.beginPath();
      context.arc(bowX, bowY, 54 + progress * 18, -Math.PI * 0.58, Math.PI * 0.58);
      context.stroke();
      context.strokeStyle = "#ffffff";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(bowX + actor.facing * 44, bowY - 46);
      context.lineTo(bowX - actor.facing * (28 + progress * 18), bowY);
      context.lineTo(bowX + actor.facing * 44, bowY + 46);
      context.stroke();
      context.strokeStyle = "#fff4a8";
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(bowX - actor.facing * 46, bowY);
      context.lineTo(bowX + actor.facing * (88 + progress * 34), bowY);
      context.stroke();
      context.fillStyle = "#ffd83d";
      for (let index = 0; index < 14; index += 1) {
        const angle = time / 80 + index * Math.PI * 2 / 14;
        const dist = 34 + progress * 38 + (index % 3) * 8;
        context.beginPath();
        context.arc(bowX + Math.cos(angle) * dist, bowY + Math.sin(angle) * dist * 0.7, 3, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
      return;
    }

    if (pending.specialType === "hundredRush") {
      const time = performance.now();
      const centerY = actor.y - actor.jumpZ - 70;
      const ballX = actor.x + actor.facing * 28;
      const ballY = centerY - 4 + Math.sin(time / 42) * 3;
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.24 + progress * 0.36;
      context.fillStyle = "rgba(247,247,255,0.2)";
      context.beginPath();
      context.arc(ballX, ballY, 54 + progress * 26, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "rgba(255,255,255,0.64)";
      context.lineWidth = 4;
      context.lineCap = "round";
      for (let index = 0; index < 24; index += 1) {
        const side = index % 2 === 0 ? -1 : 1;
        const phase = time / 22 + index * 0.62;
        const yOffset = -46 + (index % 8) * 13;
        const startX = ballX + side * (76 + Math.sin(phase) * 14);
        const endX = ballX + side * (14 + progress * 8);
        context.beginPath();
        context.moveTo(startX, ballY + yOffset);
        context.lineTo(endX, ballY + yOffset * 0.42);
        context.stroke();
        context.globalAlpha = 0.22 + progress * 0.32;
        context.fillStyle = "#ffffff";
        context.beginPath();
        context.ellipse(endX - side * 6, ballY + yOffset * 0.42, 12, 8, side * 0.2, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 0.24 + progress * 0.36;
      }
      context.strokeStyle = "#ffffff";
      context.lineWidth = 8;
      context.beginPath();
      context.arc(ballX, ballY, 30 + progress * 22, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = "#cfd7ff";
      context.lineWidth = 4;
      for (let ring = 0; ring < 3; ring += 1) {
        context.beginPath();
        context.ellipse(ballX, ballY + 6, 42 + ring * 18 + progress * 16, 15 + ring * 5 + progress * 5, 0, 0, Math.PI * 2);
        context.stroke();
      }
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 0.36 + progress * 0.28;
      context.fillStyle = "rgba(92,70,46,0.45)";
      for (let dust = 0; dust < 8; dust += 1) {
        const x = actor.x - actor.facing * 10 + (dust - 3.5) * 12;
        context.beginPath();
        context.ellipse(x, actor.y + 18 + Math.sin(time / 90 + dust) * 3, 18, 6, 0, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
      return;
    }

    if (pending.specialType === "lunaticMirage") {
      const time = performance.now();
      const centerY = actor.y - actor.jumpZ - 76;
      const ballX = actor.x + actor.facing * 20;
      const ballY = centerY + Math.sin(time / 130) * 4;
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.38 + progress * 0.42;
      context.strokeStyle = "#b98cff";
      context.lineWidth = 4;
      context.beginPath();
      context.ellipse(actor.x, actor.y + 14, 44 + progress * 38, 14 + progress * 7, 0, 0, Math.PI * 2);
      context.stroke();
      context.strokeStyle = "#9ee7ff";
      context.lineWidth = 2;
      for (let rune = 0; rune < 6; rune += 1) {
        const angle = time / 520 + rune * Math.PI * 2 / 6;
        const x = actor.x + Math.cos(angle) * (24 + progress * 28);
        const y = actor.y + 14 + Math.sin(angle) * (7 + progress * 5);
        context.beginPath();
        context.moveTo(x - 5, y);
        context.lineTo(x + 5, y);
        context.moveTo(x, y - 5);
        context.lineTo(x, y + 5);
        context.stroke();
      }
      context.save();
      context.translate(actor.x, centerY - 72 - progress * 12);
      context.rotate(Math.sin(time / 500) * 0.08);
      context.globalAlpha = 0.48 + progress * 0.34;
      context.fillStyle = "#f8f1ff";
      context.beginPath();
      context.arc(0, 0, 28 + progress * 10, -Math.PI * 0.72, Math.PI * 0.72);
      context.quadraticCurveTo(10 + progress * 8, 0, 0, -20 - progress * 7);
      context.closePath();
      context.fill();
      context.strokeStyle = "#9ee7ff";
      context.lineWidth = 3;
      context.beginPath();
      context.arc(0, 0, 34 + progress * 12, -Math.PI * 0.68, Math.PI * 0.68);
      context.stroke();
      context.restore();
      context.globalAlpha = 0.34 + progress * 0.46;
      context.fillStyle = "rgba(107,92,255,0.2)";
      context.beginPath();
      context.arc(ballX, ballY, 54 + progress * 30, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#b98cff";
      context.lineWidth = 5;
      for (let ring = 0; ring < 3; ring += 1) {
        context.save();
        context.translate(ballX, ballY);
        context.rotate(time / 560 + ring * Math.PI / 3);
        context.scale(1, 0.42);
        context.beginPath();
        context.arc(0, 0, 32 + progress * 34 + ring * 12, Math.PI * 0.12, Math.PI * 1.88);
        context.stroke();
        context.restore();
      }
      for (let index = 0; index < 3; index += 1) {
        const angle = time / 360 + index * Math.PI * 2 / 3;
        const px = ballX + Math.cos(angle) * (44 + progress * 22);
        const py = ballY + Math.sin(angle) * (26 + progress * 14);
        context.globalAlpha = (0.22 + progress * 0.24) * (1 - index * 0.08);
        context.fillStyle = "rgba(216,182,255,0.72)";
        context.beginPath();
        context.arc(px, py, 14 - index, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = index === 1 ? "#9ee7ff" : "#f8f1ff";
        context.lineWidth = 3;
        context.beginPath();
        context.arc(px, py, 18 - index, 0, Math.PI * 2);
        context.stroke();
      }
      context.globalAlpha = 0.82;
      context.fillStyle = "#f8f1ff";
      for (let index = 0; index < 16; index += 1) {
        const angle = time / 280 + index * Math.PI * 2 / 16;
        const dist = 24 + (index % 5) * 14 + progress * 18;
        context.beginPath();
        context.arc(ballX + Math.cos(angle) * dist, ballY + Math.sin(angle) * dist * 0.78, 2 + index % 2, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 0.72;
      context.strokeStyle = "#9ee7ff";
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(actor.x - actor.facing * 24, actor.y + 12);
      context.quadraticCurveTo(actor.x, actor.y + 34 + progress * 18, actor.x + actor.facing * 58, actor.y + 12);
      context.stroke();
      context.restore();
      return;
    }

    if (pending.specialType === "victoryMarch") {
      const time = performance.now();
      const centerY = actor.y - actor.jumpZ - 70;
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.34 + progress * 0.42;
      context.strokeStyle = "#ffd83d";
      context.lineWidth = 4;
      for (let line = -2; line <= 2; line += 1) {
        context.beginPath();
        context.moveTo(actor.x - 110 - progress * 24, centerY + line * 12);
        context.lineTo(actor.x + 110 + progress * 24, centerY + line * 12 + Math.sin(time / 150 + line) * 7);
        context.stroke();
      }
      context.fillStyle = "#fff4a8";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "bold 34px Meiryo, sans-serif";
      for (let index = 0; index < 10; index += 1) {
        const px = actor.x - 92 + index * 22;
        const py = centerY - 28 + Math.sin(time / 120 + index) * 28;
        context.fillText(index % 2 ? "♪" : "♫", px, py);
      }
      context.restore();
      return;
    }

    if (pending.specialType === "grandHeal") {
      const time = performance.now();
      const centerY = actor.y - actor.jumpZ - 78;
      const groundY = actor.y + 12;
      const pulse = 0.5 + Math.sin(time / 120) * 0.5;
      context.save();
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.32 + progress * 0.48;
      context.strokeStyle = "#fff4a8";
      context.fillStyle = "rgba(255,244,168,0.2)";
      context.lineWidth = 5;
      context.beginPath();
      context.arc(actor.x, centerY, 38 + progress * 42 + pulse * 8, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.strokeStyle = "#ffffff";
      context.lineWidth = 3;
      for (let index = 0; index < 8; index += 1) {
        const angle = time / 520 + index * Math.PI * 2 / 8;
        context.beginPath();
        context.moveTo(actor.x + Math.cos(angle) * 18, centerY + Math.sin(angle) * 18);
        context.lineTo(actor.x + Math.cos(angle) * (68 + progress * 24), centerY + Math.sin(angle) * (68 + progress * 24));
        context.stroke();
      }
      context.strokeStyle = "#ffd83d";
      context.lineWidth = 5;
      context.beginPath();
      context.ellipse(actor.x, groundY, 62 + progress * 48, 20 + progress * 12, 0, 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = "#ffffff";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "bold 34px Meiryo, sans-serif";
      context.fillText("✝", actor.x, centerY + 2);
      context.restore();
      return;
    }

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
  // ブラウザ試験やデバッグから、現在の試合状態を安全に参照できるようにする。
  window.dodgeballGame = new DodgeballGame();
});
