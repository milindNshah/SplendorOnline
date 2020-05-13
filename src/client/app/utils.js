
/*
* purchasedCardsObject: Object<cardID, card>
* Return: Map<gemStone, card[]>
*/
export function getPurchasedCardsByTypes(purchasedCardsObject) {
  const purchasedCardsMap = new Map(Object.entries(purchasedCardsObject))
  return Array.from(purchasedCardsMap.values())
    .reduce((map, card) => {
      let cardsForType;
      if (map.has(card.gemStoneType)) {
        cardsForType = map.get(card.gemStoneType)
        cardsForType.push(card)
      } else {
        cardsForType = []
        cardsForType.push(card)
      }
      return map.set(card.gemStoneType, cardsForType)
    }, new Map())
}
