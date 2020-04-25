import * as fs from 'fs';

const inFile = "splendorNobleInput.csv";
const outFile = "splendorNobleOutput.txt"
const gemNames = ["DIAMOND", "SAPPHIRE", "EMERALD", "RUBY", "CHOCOLATE"];
const REQUIRED_CARD_STONE_OFFSET = 1;

const allNobles =
  fs.readFileSync(inFile)
    .toString()
    .split("\n")
    .filter((line: string) => line.length > 0)
    .map((line: string) => convertFromLineToObject(
      line.split(",", 6)
    ))
    .join("\n")

function convertFromLineToObject(line: string[]): string {
  return `{
    requiredCards: [
      ${getRequiredCards(line)}
    ]
  },`
}

function getRequiredCards(line: string[]): string {
  return gemNames.map((gemName: string, ind: number) => getRequiredCard(
    line[ind + REQUIRED_CARD_STONE_OFFSET], gemName
  )).filter((gemLine: string) => gemLine !== null)
    .join("\n")
}

function getRequiredCard(value: string, type: string): string {
  const required = value.length > 0 ? parseInt(value) : 0;
  return required === 0
    ? null
    : `{ cardType: CardGemStone.${type}, required: ${required} },`
}

fs.writeFileSync(outFile, allNobles);
