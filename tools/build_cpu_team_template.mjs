import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const rootDir = path.resolve(import.meta.dirname, "..");
const dataDir = path.join(rootDir, "data");
const qaDir = path.join(rootDir, "outputs", "cpu_team_template_qa");
const outputPath = path.join(dataDir, "cpu_team_template.xlsx");

await fs.mkdir(dataDir, { recursive: true });
await fs.mkdir(qaDir, { recursive: true });

const workbook = Workbook.create();
const defaultSheet = workbook.worksheets.add("README");
const teams = workbook.worksheets.add("Teams");
const players = workbook.worksheets.add("Players");
const specials = workbook.worksheets.add("SpecialShots");
const lookups = workbook.worksheets.add("Lookups");

function writeTable(sheet, values) {
  sheet.getRangeByIndexes(0, 0, values.length, values[0].length).values = values;
}

function styleSheet(sheet, usedRows, usedCols, widths = []) {
  sheet.showGridlines = false;
  sheet.freezePanes.freezeRows(1);

  const header = sheet.getRangeByIndexes(0, 0, 1, usedCols);
  header.format.fill.color = "#203040";
  header.format.font.color = "#FFFFFF";
  header.format.font.bold = true;
  header.format.font.size = 11;
  header.format.horizontalAlignment = "center";
  header.format.verticalAlignment = "center";

  const body = sheet.getRangeByIndexes(1, 0, Math.max(usedRows - 1, 1), usedCols);
  body.format.fill.color = "#F8FBFF";
  body.format.font.size = 10;
  body.format.wrapText = true;
  body.format.verticalAlignment = "top";

  sheet.getRangeByIndexes(0, 0, usedRows, usedCols).format.borders.getItem("InsideHorizontal").style = "Continuous";
  sheet.getRangeByIndexes(0, 0, usedRows, usedCols).format.borders.getItem("InsideHorizontal").color = "#D9E2EF";
  sheet.getRangeByIndexes(0, 0, usedRows, usedCols).format.borders.getItem("InsideVertical").style = "Continuous";
  sheet.getRangeByIndexes(0, 0, usedRows, usedCols).format.borders.getItem("InsideVertical").color = "#D9E2EF";

  widths.forEach((width, index) => {
    if (width) {
      sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidth = width;
    }
  });
}

function addListValidation(sheet, address, sourceAddress) {
  sheet.dataValidations.add({
    range: address,
    rule: {
      type: "list",
      formula1: sourceAddress,
    },
  });
}

function addWholeNumberValidation(sheet, address, min, max) {
  sheet.dataValidations.add({
    range: address,
    rule: {
      type: "whole",
      operator: "between",
      formula1: min,
      formula2: max,
    },
  });
}

const readmeValues = [
  ["CPUチーム・選手データひな形"],
  ["このExcelに対戦チーム、選手名、能力値、CPU行動のメモを書いておくと、あとでゲーム側に読み込むデータとして使いやすくなります。"],
  [""],
  ["使うシート"],
  ["Teams: チーム単位の名前、難易度、特徴を入力します。"],
  ["Players: 各チームの選手を入力します。1チームは内野5人、外野3人を想定しています。"],
  ["SpecialShots: 必殺シュートの一覧です。基本的には編集しなくても大丈夫です。"],
  ["Lookups: 入力候補リストです。基本的には編集しなくても大丈夫です。"],
  [""],
  ["入力ルール"],
  ["hp と stamina は数字で入力します。power / speed / jump / technique は1から10で入力します。"],
  ["character_type や special_shot は候補から選べるようにしています。"],
  ["CPUの動きは、まずは日本語メモで自由に書いて大丈夫です。実装時にこちらで読み取りやすい形へ変換できます。"],
];
writeTable(defaultSheet, readmeValues);
defaultSheet.showGridlines = false;
defaultSheet.getRangeByIndexes(0, 0, 1, 1).format.font.bold = true;
defaultSheet.getRangeByIndexes(0, 0, 1, 1).format.font.size = 18;
defaultSheet.getRangeByIndexes(0, 0, readmeValues.length, 1).format.wrapText = true;
defaultSheet.getRangeByIndexes(0, 0, 1, 1).format.fill.color = "#203040";
defaultSheet.getRangeByIndexes(0, 0, 1, 1).format.font.color = "#FFFFFF";
defaultSheet.getRangeByIndexes(0, 0, readmeValues.length, 1).format.columnWidth = 760;

const teamRows = [
  ["team_id", "team_name", "difficulty", "concept", "cpu_style", "default_strategy", "notes"],
  ["rookie", "素人チーム", "Easy", "弱い初心者中心", "passive", "通常シュート多め。キャッチや回避は遅め。", "最初の練習相手"],
  ["sprinters", "俊足チーム", "Normal", "足の速い選手中心", "fast", "逃げ回り、パスを早く回す。", "ちび多めなど"],
  ["power", "怪力チーム", "Hard", "パワー型中心", "power", "溜めとダッシュから強いシュートを狙う。", "デーブ多めなど"],
  ["mages", "魔法チーム", "Normal", "メイジ中心", "technical", "回復と特殊シュートを使う。", "ソウルリカバリー確認用"],
];
for (let i = teamRows.length; i < 24; i += 1) {
  teamRows.push(["", "", "", "", "", "", ""]);
}
writeTable(teams, teamRows);
styleSheet(teams, teamRows.length, teamRows[0].length, [105, 130, 100, 190, 120, 260, 220]);

const playerHeaders = [
  "team_id",
  "slot_no",
  "role",
  "player_id",
  "player_name",
  "character_type",
  "special_shot",
  "hp",
  "stamina",
  "power",
  "speed",
  "jump",
  "technique",
  "cpu_personality",
  "notes",
];
const samplePlayers = [
  ["rookie", 1, "inner", "rookie_i1", "ルーキー1", "normal", "auto", 60, 100, 6, 6, 6, 6, "careful", "内野"],
  ["rookie", 2, "inner", "rookie_i2", "ルーキー2", "normal", "auto", 60, 100, 6, 6, 6, 6, "nervous", "内野"],
  ["rookie", 3, "inner", "rookie_i3", "ルーキー3", "normal", "auto", 60, 100, 6, 6, 6, 6, "careful", "内野"],
  ["rookie", 4, "inner", "rookie_i4", "ルーキー4", "normal", "auto", 60, 100, 6, 6, 6, 6, "passer", "内野"],
  ["rookie", 5, "inner", "rookie_i5", "ルーキー5", "normal", "auto", 60, 100, 6, 6, 6, 6, "defender", "内野"],
  ["rookie", 6, "outer", "rookie_o1", "ルーキー外1", "normal", "auto", 60, 100, 6, 6, 6, 6, "shooter", "外野"],
  ["rookie", 7, "outer", "rookie_o2", "ルーキー外2", "normal", "auto", 60, 100, 6, 6, 6, 6, "passer", "外野"],
  ["rookie", 8, "outer", "rookie_o3", "ルーキー外3", "normal", "auto", 60, 100, 6, 6, 6, 6, "shooter", "外野"],
  ["sprinters", 1, "inner", "dash_i1", "スプリント1", "jump", "boost", 60, 100, 5, 8, 6, 7, "runner", "サンプル"],
  ["power", 1, "inner", "power_i1", "パワー1", "power", "iron", 60, 100, 8, 4, 3, 4, "charger", "サンプル"],
  ["mages", 1, "inner", "mage_i1", "メイジ1", "mage", "soul", 60, 100, 4, 6, 6, 5, "support", "サンプル"],
];
const playerRows = [playerHeaders, ...samplePlayers];
for (let i = playerRows.length; i < 80; i += 1) {
  playerRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
}
writeTable(players, playerRows);
styleSheet(players, playerRows.length, playerHeaders.length, [95, 70, 75, 130, 130, 125, 130, 60, 75, 65, 65, 65, 80, 135, 230]);

const specialRows = [
  ["special_shot", "display_name", "default_character_type", "description"],
  ["auto", "タイプ標準", "", "キャラタイプごとの標準必殺技を使う。"],
  ["lightning", "稲妻シュート", "normal", "青白い電気をまとって直進。命中相手を一瞬しびれさせ、周囲に小ダメージ。"],
  ["iron", "大鉄球シュート", "power", "通常の2倍サイズの鉄球。遅めだが貫通力があり、キャッチが難しい。"],
  ["banana", "バナナシュート", "speed", "大きなU字軌道で曲がるシュート。"],
  ["boost", "ブーストシュート", "jump", "最初は非常に遅く、4段階で急加速するシュート。"],
  ["soul", "ソウルリカバリー", "mage", "敵にダメージを与え、味方全員のHPを5回復する。"],
];
writeTable(specials, specialRows);
styleSheet(specials, 30, specialRows[0].length, [130, 150, 160, 560]);

const lookupRows = [
  ["character_type", "表示名", "標準必殺技", "hp", "stamina", "power", "speed", "jump", "technique"],
  ["normal", "ノーマル", "lightning", 60, 100, 6, 6, 6, 6],
  ["power", "デーブ", "iron", 60, 100, 8, 4, 3, 4],
  ["speed", "のっぽ", "banana", 60, 100, 6, 5, 8, 6],
  ["jump", "ちび", "boost", 60, 100, 5, 8, 6, 7],
  ["mage", "メイジ", "soul", 60, 100, 4, 6, 6, 5],
  ["", "", "", "", "", "", "", "", ""],
  ["role", "表示名", "", "", "", "", "", "", ""],
  ["inner", "内野", "", "", "", "", "", "", ""],
  ["outer", "外野", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["difficulty", "", "", "", "", "", "", "", ""],
  ["Easy", "", "", "", "", "", "", "", ""],
  ["Normal", "", "", "", "", "", "", "", ""],
  ["Hard", "", "", "", "", "", "", "", ""],
  ["Boss", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["cpu_personality", "説明", "", "", "", "", "", "", ""],
  ["careful", "慎重", "", "", "", "", "", "", ""],
  ["nervous", "初心者風", "", "", "", "", "", "", ""],
  ["passer", "パス回し多め", "", "", "", "", "", "", ""],
  ["shooter", "シュート多め", "", "", "", "", "", "", ""],
  ["runner", "走り回る", "", "", "", "", "", "", ""],
  ["charger", "溜め攻撃狙い", "", "", "", "", "", "", ""],
  ["support", "味方支援", "", "", "", "", "", "", ""],
  ["defender", "守備寄り", "", "", "", "", "", "", ""],
];
writeTable(lookups, lookupRows);
styleSheet(lookups, lookupRows.length, lookupRows[0].length, [130, 130, 130, 55, 75, 65, 65, 65, 85]);

addListValidation(teams, "C2:C200", "Lookups!$A$13:$A$16");
addListValidation(players, "A2:A500", "Teams!$A$2:$A$200");
addListValidation(players, "C2:C500", "Lookups!$A$9:$A$10");
addListValidation(players, "F2:F500", "Lookups!$A$2:$A$6");
addListValidation(players, "G2:G500", "SpecialShots!$A$2:$A$7");
addListValidation(players, "N2:N500", "Lookups!$A$19:$A$26");
addWholeNumberValidation(players, "B2:B500", 1, 8);
addWholeNumberValidation(players, "H2:I500", 1, 999);
addWholeNumberValidation(players, "J2:M500", 1, 10);

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);

const renderTargets = [
  ["README", defaultSheet],
  ["Teams", teams],
  ["Players", players],
  ["SpecialShots", specials],
  ["Lookups", lookups],
];

for (const [name, sheet] of renderTargets) {
  const image = await workbook.render({
    sheetName: sheet.name,
    range: "A1:O20",
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  await fs.writeFile(path.join(qaDir, `${name}.png`), new Uint8Array(await image.arrayBuffer()));
}

console.log(outputPath);
