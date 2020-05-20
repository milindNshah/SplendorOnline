import theme from '../styledcomponents/theme.jsx'

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

export function getColorFromGemStone(gemStone) {
  switch (gemStone) {
    case GemStone.DIAMOND:
      return theme.color.diamond
    case GemStone.SAPPHIRE:
      return theme.color.sapphire
    case GemStone.EMERALD:
      return theme.color.emerald
    case GemStone.RUBY:
      return theme.color.ruby
    case GemStone.CHOCOLATE:
      return theme.color.chocolate
    case GemStone.GOLD:
      return theme.color.gold
  }
}

export function getGemStoneOrder(gemStone) {
  switch (gemStone) {
    case GemStone.DIAMOND:
      return 1;
    case GemStone.SAPPHIRE:
      return 2;
    case GemStone.EMERALD:
      return 3;
    case GemStone.RUBY:
      return 4;
    case GemStone.CHOCOLATE:
      return 5;
    case GemStone.GOLD:
      return 6;
  }
}
