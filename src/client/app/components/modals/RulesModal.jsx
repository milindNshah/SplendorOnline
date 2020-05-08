import React from 'react'
import styled from "styled-components"
import Button from '../../styledcomponents/button.jsx'
import theme from '../../styledcomponents/theme.jsx'

const RulesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${ props => `${props.theme.modal.padding}rem`};
  background-color: ${ props => props.theme.color.white};
  max-width: 80%;
  overflow: scroll;
`

class RulesModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  // TODO: Rename Chocolate to Onyx
  render() {
    return (
      <RulesContainer>
        <h1>Rules</h1>
        <p>2-4 Players</p>
        <h2>Objective</h2>
        <p>The objective of the game is to get 15 or more points. Points are obtained from collecting development cards or nobles. A development card may have anywhere between 0 and 5 points. A noble is worth 3 points each. In order to get development cards, you must have enough tokens to purchase it. In order to get nobles, you must have enough development cards to obtain it. In order to win, you must be the player with the most points at the end of a full game turn (all players must have had same number of turns).</p>
        <h2>Terminology</h2>
        <p>Turn: </p>
        <p>Game Turn: </p>
        <p>Token: A token is the most basic resource in the game. A token can be of 6 possible gemstone types: Diamond, Sapphire, Emerald, Ruby, Onyx, or Gold. You can use tokens to purchase development cards. The Gold token is a special token and can be used as any of the other 5 types.</p>
        <p>Development Card: Each development card has a point value represented by a number in the top left. Each development card has an associated gemstone type. The gemstone type can be one of 5 possible gemstone types: Diamond, Sapphire, Emerald, Ruby, or Onyx and is found under the point value. Each development card has an associated cost which is displayed in the bottom right. The cost represents the number and types of tokens that are required in order to purchase that card. A development card can be purchased by using tokens. Once a development card is purchased, it provides a permanent bonus when purchasing future cards for the player who purchased it. The development cards are split into 3 decks, ordered by tier (1, 2, 3). The higher the tier, the more valuable the development card is but the more difficult it is to obtain. </p>
        <p>Bonus: Each development card purchased provides a bonus. A development card has a gemstone type. A development card reduces the cost of the required tokens by 1 for it's gemstone type. This is a permanent effect and applied to all development cards</p>
        <p>Noble: Nobles can also give you points. A noble cannot be purchased and is automatically given to the first player who is able to achieve the requirements to obtain the noble. The noble has a point value represented in the top left. The requirements to obtain a noble are development cards; the amount and types of which are found in the bottom left.</p>
        <h2>Game Setup</h2>
        <p>2 players: There will be 4 of each token type except for the Gold type which will have 5. There will be 3 nobles flipped and placed onto the board.</p>
        <p>3 players: There will be 5 of each token type including the Gold type There will be 4 nobles flipped and placed onto the board.</p>
        <p>4 players: There will 7 of each token type except for the Gold type which will have 5.There will be 5 nobles flipped and placed onto the board.</p>
        <p>The development cards will be split into 3 decks according to their tier. 4 cards from each tier will be revealed and placed onto the board.</p>
        <h2>How To Play</h2>
        <p>Each player takes turns. On a given turn a player may perform one of the following 4 actions:
          1. Take 3 tokens of different types (if available)
          2. Take 2 tokens of the same type (if more than 4 of that type are available)
          3. Reserve 1 development card and Obtain 1 Joker Token (if available)
          4. Purchase 1 development card from the middle of the table or a previously reserved one.
        </p>
        <p>Taking 3 tokens of different types: A player may take 3 tokens (or less)of different types on their turn. There must be atleast 1 token available for each selected type. A player may have no more than 10 tokens at the end of their turn so if a player ends up with more than 10 tokens, they must return until they have 10 tokens exactly (no less).</p>
        <p>Taking 2 tokens of same type: A player may take 2 tokens of the same type. However, they cannot have taken any other tokens of any type. There must be atleast 4 tokens available of that type in order for the player to take 2 tokens of that type.A player may have no more than 10 tokens at the end of their turn so if a player ends up with more than 10 tokens, they must return tokens until they have 10 tokens exactly (no less).</p>
        <p>Reserving a development card: A player can reserve a development card by taking any card on the board, or the first card from any deck, and placing it in their hand. The reserved card cannot be bought by any player but the player who reserved it. A player may only have up to 3 reserved cards at a given time and cannot reserve if they already have 3 reserved cards. When reserving a card, the player will receive a gold token if there are any gold tokens available. A reserved card cannot be discarded, only purchased.</p>
        <p>Purchasing a development card: A player can purchase a previously reserved card or purchase a card from the board. The required tokens must be spent and returned to the board when purchasing a card. A gold token can be used in place of any 1 other token. A player receives discounts equal to the number of previously purchased development cards of a given type for that type. If the purchased card was purchased from the board, replace the card with another card from the deck of the same tier (if any cards of that tier are available)</p>
        <p>Obtaining a Noble: This is not an action but is done at the end of each player's turn. If that player has enough purchased cards to meet the noble's requirements, they will obtain the noble. The points associated with the noble will be added to the player's point total. The noble will belong to only the first player that achieves the requirements. The noble will be removed from the board and not be replaced by another noble. A player may obtain multiple nobles on a single turn if the meet the requirements.</p>
        <h2>Tie Breaker Conditions</h2>
        <p>The game ends when a player reaches a minimum of 15 points and has the most amount of points at the end of a game turn. However, players may be tied for highest number of points at the end of a game turn. In that case the player with the least amount of development cards wins. If players are still tied, further game rounds are played until one player can break the tie conditions.</p>
        <div>
          <Button
            color={theme.color.error}
            onClick={this.props.handleClose}>
            Close
          </Button>
        </div>
      </RulesContainer>
    )
  }
}

export default RulesModal
