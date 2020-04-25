import * as fs from 'fs';
const inFile = "splendorGemStonesInput.csv";
const outFile = "splendorGemStoneOutput.txt"
const gemNames = ["DIAMOND", "SAPPHIRE", "EMERALD", "RUBY", "CHOCOLATE"];
const TIER_OFFSET = 0;
const POINT_OFFSET = 6;
const REQUIRED_GEM_STONE_OFFSET = 1;
const GEM_STONE_TYPE_OFFSTE = 7;

const allGemStones =
  fs.readFileSync(inFile)
    .toString()
    .split("\n")
    .filter((line: string) => line.length > 0)
    .map((line: string) => convertFromLineToObject(
      line.split(",", 13)
    ))
    .join("\n")

function convertFromLineToObject(line: string[]): string {
  const outputString = `{
      pointValue: ${getPointValue(line)},
      gemStoneValue: ${getGemStoneType(line)},
      tier: ${getTier(line)},
      requiredGemStones: [
        ${getRequiredGemStones(line)}
      ],
    },`;
  return outputString;
}

function getTier(line: string[]): string {
  return line[TIER_OFFSET] === "I"
    ? "CardTier.TIER1" : line[TIER_OFFSET] === "II"
      ? "CardTier.TIER2" : "CardTier.TIER3";
}

function getGemStoneType(line: string[]): string {
  for(let ind=0; ind<gemNames.length; ind++) {
    if(line[ind + GEM_STONE_TYPE_OFFSTE].length > 0) {
      return `CardGemStone.${gemNames[ind]}`
    }
  }
  return null;
}

function getPointValue(line: string[]): number {
  return line[POINT_OFFSET].length > 0 ? parseInt(line[POINT_OFFSET]) : 0;
}

function getRequiredGemStones(line: string[]): string {
  return gemNames.map((gemName, ind) => getRequiredGemStone(
    line[ind + REQUIRED_GEM_STONE_OFFSET], gemName)
  ).filter((gemLine: string) => gemLine !== null)
  .join("\n");
}

function getRequiredGemStone(value: string, type: string): string {
  const required = value.length > 0 ? parseInt(value) : 0;
  return required === 0
    ? null
    : `{ gemStone: GemStone.${type}, required: ${required} },`;
}

fs.writeFileSync(outFile, allGemStones);
