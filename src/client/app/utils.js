
/*
* @Input: purchasedCardsObject: Object<cardID, card>
* @Return: Map<gemStone, card[]>
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

/*
* @Input: card: Card
* @Input: purchasedCardsObject: Object<cardID, card>
* @Input: playerGemStonesObject: Object<gemStone, amount>
* @Return: Boolean (Player has sufficient gems to purchase the card)
*/
export function canPurchaseCard(card, purchasedCardsObject, playerGemStonesObject) {
  const requiredGemStones = new Map(Object.entries(card.requiredGemStones))
  const purchasedCardsByTypes = getPurchasedCardsByTypes(purchasedCardsObject);
  const playerGemStones = new Map(Object.entries(playerGemStonesObject));
  let goldLeft = playerGemStones.get(GemStone.GOLD)
  return Array.from(requiredGemStones.keys())
    .map((gemStone) => {
      const have = playerGemStones.get(gemStone)
      const need = requiredGemStones.get(gemStone)
      const purchased = purchasedCardsByTypes.get(gemStone)
        ? purchasedCardsByTypes.get(gemStone).length
        : 0
      if (have + purchased >= need) {
        return true
      } else if (goldLeft > 0 && have + purchased + goldLeft >= need) {
        goldLeft -= (need - (have + purchased))
        return true;
      }
      return false;
    }).reduce((prev, cur) => prev && cur)
}
