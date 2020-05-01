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
