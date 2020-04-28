/* Should be kept in sync with GemStone.ts on server */
export const GemStone = {
  CHOCOLATE: 'chocolate',
  DIAMOND: 'diamond',
  GOLD: 'gold',
  EMERALD: 'emerald',
  RUBY: 'ruby',
  SAPPHIRE: 'sapphire',
}

export const CardGemStone = {
  CHOCOLATE: 'chocolate',
  DIAMOND: 'diamond',
  EMERALD: 'emerald',
  RUBY: 'ruby',
  SAPPHIRE: 'sapphire',
}

const GemStoneToColor = {
  CHOCOLATE: '#CB6D51',
  DIAMOND: '#CBE3F0',
  GOLD: '#FFD700',
  EMERALD: 'green',
  RUBY: 'red',
  SAPPHIRE: 'blue',
}

export function getColorFromGemStone(gemStone) {
  switch (gemStone) {
    case GemStone.CHOCOLATE:
      return GemStoneToColor.CHOCOLATE;
    case GemStone.DIAMOND:
      return GemStoneToColor.DIAMOND;
    case GemStone.EMERALD:
      return GemStoneToColor.EMERALD;
    case GemStone.GOLD:
      return GemStoneToColor.GOLD;
    case GemStone.RUBY:
      return GemStoneToColor.RUBY;
    case GemStone.SAPPHIRE:
      return GemStoneToColor.SAPPHIRE;
  }
}
