/* Should be kept in sync with GemStone.ts on server */
export const GemStone = {
  DIAMOND: 'diamond',
  SAPPHIRE: 'sapphire',
  EMERALD: 'emerald',
  RUBY: 'ruby',
  CHOCOLATE: 'chocolate',
  GOLD: 'gold',
}

export const CardGemStone = {
  DIAMOND: 'diamond',
  SAPPHIRE: 'sapphire',
  EMERALD: 'emerald',
  RUBY: 'ruby',
  CHOCOLATE: 'chocolate',
}

const GemStoneToColor = {
  DIAMOND: 'white',
  SAPPHIRE: 'blue',
  EMERALD: 'green',
  RUBY: 'red',
  CHOCOLATE: '#CB6D51',
  GOLD: '#FFD700',
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
