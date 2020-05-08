import React from 'react'
import styled from "styled-components"
import Button from '../../styledcomponents/button.jsx'
import theme from '../../styledcomponents/theme.jsx'
import {SectionName, getDisplayNameFromSection} from '../../enums/sectionname'

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  max-height: 90vh;
`
const RulesContainer = styled.div`
  padding: ${ props => `${props.theme.modal.padding}rem`};
  background-color: ${ props => props.theme.color.white};
  width: 80vw;
  overflow: scroll;
  text-align: center;
`
const Title = styled.div`
  color: ${ props => props.theme.color.primary};
  font-size: 2rem;
  margin: 0.5rem 0rem;
`
const Section = styled.div`
  margin: 2rem;
`
const SectionHeader = styled.div`
  color: ${ props => props.theme.color.darkgrey};
  font-size: 1.5rem;
  font-weight: 300;
  margin: 0.5rem 0rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-decoration: underline;
`
const HeaderIcon = styled.span`
  cursor: pointer;
  &:hover {
    color: ${ props => props.theme.color.secondary };
  }
`
const SectionContent = styled.div`
  color: ${ props => props.theme.color.darkgrey};
  font-size: 1rem;
  margin: 0.25rem 0rem;
  text-align: left;
`
const HighlightText = styled.span`
  color: ${ props => props.theme.color.secondary};
`
const Indent = styled.span`
  margin-right: 1rem;
`

const objectiveText = (
  <div>
    <p>The objective of the game is to get 15 or more points. Points are obtained from collecting development cards and nobles. A development card may be worth anywhere between 0 and 5 points. A noble is worth 3 points each. In order to win, you must be the player with the most points at the end of a full game round.</p>
  </div>
)

const gameSetupText = (
  <div>
    <p><HighlightText>Development Cards:</HighlightText> The development cards will be split into 3 decks by tier. 4 cards from each tier will be placed face-up on the board. These are the active development cards.</p>
    <p><HighlightText>Nobles:</HighlightText> Either 3, 4, or 5 nobles will be placed face up on the board. The number of nobles in play is the number of players + 1.</p>
    <p><HighlightText>Tokens:</HighlightText> 5 gold tokens will be placed on the board. If there are 2 players, 4 tokens of each type (except Gold) will be placed on the board. If there are 3 players, 5 tokens of each type (except Gold) will be placed on the board. If there are 4 players, 7 tokens of each type (except Gold) will be placed on the board.</p>
  </div>
)

const howToPlayText = (
  <div>
    <p>This is a turn based game. Each player will have 1 turn in a round. On a given turn a player may perform 1 of the following 4 actions:</p>
    <p><Indent/>1. Take 3 tokens of different types (if available).</p>
    <p><Indent/>2. Take 2 tokens of the same type (if more than 4 of that type are available).</p>
    <p><Indent/>3. Reserve 1 development card and Obtain 1 Joker Token (if available).</p>
    <p><Indent/>4. Purchase 1 development card.</p>
    <p><HighlightText>Taking 3 tokens of different types:</HighlightText> A player may take 3 tokens (or less) of different types on their turn. There must be atleast 1 token available for each selected type. A player may have no more than 10 tokens at the end of their turn so if a player ends up with more than 10 tokens, they must return tokens until they have 10 tokens exactly (no less).</p>
    <p><HighlightText>Taking 2 tokens of same type:</HighlightText> A player may take 2 tokens of the same type. However, they cannot have taken any other tokens of any type on this turn. There must be atleast 4 tokens available of that type in order for the player to take 2 tokens of that type.A player may have no more than 10 tokens at the end of their turn so if a player ends up with more than 10 tokens, they must return tokens until they have 10 tokens exactly (no less).</p>
    <p><HighlightText>Reserving a development card:</HighlightText> A player can reserve a development card by taking any card on the board, or the first card from any development card deck, and placing it in their hand. The reserved card cannot be bought by any player but the player who reserved it. A player may only have up to 3 reserved cards at a given time and cannot reserve if they already have 3 reserved cards. A reserved card cannot be discarded, only purchased. When reserving a card, the player will receive a gold token if there are any gold tokens available.</p>
    <p><HighlightText>Purchasing a development card:</HighlightText> A player can purchase a previously reserved card or purchase any development card from the board as long as the player has the required tokens. The required tokens must be spent and returned to the board when purchasing a card. A gold token can be used in place of any 1 other token. If the purchased card was purchased from the board, replace the card with another card from the deck of the same tier (if any cards of that tier are available).</p>
    <p>Once a card is purchased, it provides a permament bonus to the player who purchased it. Each development card has an associated gemstone type. Each development card reduces the number of required tokens by 1 for it's associated gemstone type when purchasing future development cards.</p>
    <p><HighlightText>Obtaining a Noble:</HighlightText> This is not an action but is executed at the end of each player's turn. If a player has enough purchased cards (bonuses) to meet the noble's requirements, they will obtain the noble. The points associated with the noble will be added to the player's point total. The noble will belong to only the first player that achieves the noble's requirements. The noble will be removed from the board and will not be replaced by another noble. A player may obtain multiple nobles on a single turn if they meet the requirements for them.</p>
  </div>
)

const tieBreakerText = (
  <div>
    <p> The winner is the player with the most points (with a minimum of 15 points) at the end of a game round. It is possible that multiple players end the game round with the same number of points. In that case the player with the least amount of development cards (amongst the players who tied) wins. If players are still tied, further game rounds are played until one player can break a tie condition.</p>
  </div>
)

const terminologyText = (
  <div>
    <p><HighlightText>Point:</HighlightText> A minimum of 15 points are required to win. Points can be obtained from development cards or from nobles.</p>
    <p><HighlightText>Turn:</HighlightText> Each player has 1 turn in a game round. A player can perform only 1 action per turn.</p>
    <p><HighlightText>Game Round:</HighlightText> A game round is completed when each player has taken their turn.</p>
    <p><HighlightText>Token:</HighlightText>A token is the most basic resource in the game. A token can be of 6 possible gemstone types: Diamond, Sapphire, Emerald, Ruby, Onyx, or Gold. You can use tokens to purchase development cards. The Gold token is a special token and can be used as any of the other 5 types.</p>
    <p><HighlightText>Development Card:</HighlightText> Each development card has a point value represented by a number in the top left. Each development card has an associated gemstone type. The gemstone type can be one of 5 possible gemstone types: Diamond, Sapphire, Emerald, Ruby, or Onyx and is found under the point value. Each development card has an associated cost which is displayed in the bottom right. The cost represents the number and types of tokens that are required in order to purchase that card. A development card can be purchased by using tokens. Once a development card is purchased, it provides a permanent bonus when purchasing future cards for the player who purchased it. The development cards are split into 3 decks, ordered by tier (1, 2, 3). The higher the tier of the card, the more valuable the development card is, but the more difficult it is to obtain. </p>
    <p><HighlightText>Bonus:</HighlightText> Each development card purchased provides a bonus. A development card has a gemstone type. A development card reduces the cost of the required tokens by 1 for it's gemstone type. This is a permanent effect and applied to all development cards.</p>
    <p><HighlightText>Noble:</HighlightText> Nobles can also give you points. A noble cannot be purchased and is automatically given to the first player who is able to achieve the requirements to obtain the noble. The noble has a point value represented in the top left. The requirements to obtain a noble are development cards; the amount and types of which are found in the bottom left.</p>
  </div>
)

class RulesModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      objective: true,
      terminology: false,
      gamesetup: false,
      howtoplay: false,
      tiebreaker: false,
    }
    this.toggleSection = this.toggleSection.bind(this)
    this.renderSection = this.renderSection.bind(this)
  }

  toggleSection(section) {
    this.setState({
      [section]: !this.state[section],
    })
  }

  renderSection(section, sectionText) {
    return (
      <Section>
        <SectionHeader onClick={() => this.toggleSection(section)}>
          {getDisplayNameFromSection(section)}
          {this.state[section]
            ? <HeaderIcon><i className="fa fa-chevron-up" /></HeaderIcon>
            : <HeaderIcon><i className="fa fa-chevron-down" /></HeaderIcon>
          }
        </SectionHeader>
        {this.state[section] ? <SectionContent>{sectionText}</SectionContent> : null}
      </Section>
    )
  }

  // TODO: Rename Chocolate to Onyx in code.
  render() {
    return (
      <ModalContainer>
        <RulesContainer>
          <Title>Game Rules</Title>
          <p>2-4 Players</p>
          {this.renderSection(SectionName.OBJECTIVE, objectiveText)}
          {this.renderSection(SectionName.GAMESETUP, gameSetupText)}
          {this.renderSection(SectionName.HOWTOPLAY, howToPlayText)}
          {this.renderSection(SectionName.TIEBREAKER, tieBreakerText)}
          {this.renderSection(SectionName.TERMINOLOGY, terminologyText)}
          <div>
            <Button
              color={theme.color.error}
              onClick={this.props.handleClose}>
              Close
            </Button>
          </div>
        </RulesContainer>
      </ModalContainer>
    )
  }
}

export default RulesModal
