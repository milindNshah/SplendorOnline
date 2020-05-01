import theme from '../styledcomponents/theme.jsx'

/* Should be kept in sync with CardTier(Card.ts) on server */
export const CardTier = {
  TIER1: '1',
  TIER2: '2',
  TIER3: '3',
}

export function getColorFromTier(cardTier) {
  switch(cardTier) {
    case CardTier.TIER1:
      return theme.color.tier1
    case CardTier.TIER2:
      return theme.color.tier2
    case CardTier.TIER3:
      return theme.color.tier3
  }
}

export function getNumberFromTier(cardTier){
  switch(cardTier) {
    case CardTier.TIER1:
      return 1
    case CardTier.TIER2:
      return 2
    case CardTier.TIER3:
      return 3
  }
}
