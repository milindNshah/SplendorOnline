import React from 'react'
import styled from "styled-components"
import Button from '../../styledcomponents/button.jsx'
import theme from '../../styledcomponents/theme.jsx'
import {SectionName, getDisplayNameFromSection} from '../../enums/sectionname'
import GemStoneToken from '../GemStoneToken.jsx'
import Card from '../Card.jsx'
import TierCard from '../TierCard.jsx'
import Noble from '../Noble.jsx'
import { GemStone, CardGemStone } from '../../enums/gemstones.js'
import { CardTier } from '../../enums/cardtier.js'


const ModalContainer = styled.div`
  max-height: 80vh;
  width: 80vw;
  background-color: ${ props => props.theme.color.white};
  padding: ${ props => `${props.theme.modal.padding}rem`};
  overflow: scroll;
  font-family: ${ props => props.theme.fontFamily.tertiary};
`

const Title = styled.div`
  color: ${ props => props.theme.color.darkgrey};
  font-weight: 300;
  font-size: 2rem;
  margin: 0.5rem 0rem;
`
const SubTitle = styled.div`
  color: ${ props => props.theme.color.darkgrey};
  margin-top: 0.5rem;
`
const RuleBook = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`
const RulebookText = styled.span`
  color: ${ props => props.theme.color.secondary};
  text-decoration: underline;
  cursor: pointer;
`

const ImagesContainer = styled.div`
  display: flex;
  flex-direction: row wrap;
  width: 100%;
  justify-content: space-around;
`
const ImageContainer = styled.div`
  margin: 0rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const ImageTitle = styled.div`
  color: ${ props => props.theme.color.darkgrey};
  margin-bottom: 0.5rem;
  text-decoration: underline;
`
const Section = styled.div`
  margin: 2rem;
`
const SectionHeader = styled.div`
  color: ${ props => props.theme.color.secondary};
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
    color: ${ props => props.theme.color.tertiary};
  }
`
const SectionContent = styled.div`
  color: ${ props => props.theme.color.darkgrey};
  font-size: 1rem;
  margin: 0.25rem 0rem;
  text-align: justify;
`
const HighlightText = styled.span`
  color: ${ props => props.theme.color.tertiary};
`
const SectionReference = styled.span`
  color: ${ props => props.theme.color.secondary};
`
const Indent = styled.span`
  margin-right: 1rem;
`

const contentText = (
  <div>
    <p><HighlightText>Token: </HighlightText>A token is used to purchase development cards. The token above is of type Emerald. The number in the bottom left represents how many tokens of type Emerald there are (5). There are six tokens types: Diamond, Sapphire, Emerald, Ruby, Onyx, and Gold. The Gold token is a special token and can be used in place of any of the other five types. A player may have at most 10 tokens in their hand at any given time.</p>
    <p><HighlightText>Development Card: </HighlightText>Development cards may be purchased by using tokens. In the top left of each card is a number (4). This number represents how many points the development card is worth. Under the number in the top left is a token type (Sapphire). The player who purchases the development card will gain a permanent bonus (see <HighlightText>Development Card Bonus</HighlightText> below). In the bottom right is the development card's purchase cost (see <HighlightText>Development Card Cost</HighlightText> below).</p>
    <p><HighlightText>Development Card Bonus: </HighlightText>The bonus is found in the top left of a development card under the point value in the form of a token type (Sapphire in this case). The bonus from a development card provides a discount of one token of it's type (Sapphire) when purchasing all future development cards. Development card bonuses do not disappear, and can be stacked. If you have 2 development cards, each with a token type of Sapphire, you gain a 2 Sapphire token discount for every future development card. For example: if a development card costs 3 Sapphire tokens and you have 2 Sapphire development cards, you only need 1 Sapphire token to purchase that development card. There are 5 possible token types for development cards: Diamond, Sapphire, Emerald, Ruby, Onyx.</p>
    <p><HighlightText>Development Card Cost: </HighlightText>The cost of a development card is found in the bottom right. These numbers and symbols represent the amount and types of tokens you need to purchase the development card. In this example you would need 3 Diamond tokens, 3 Ruby Tokens, and 6 Onyx tokens to purchase the development card. Remember, you can use 1 Gold token in place of any 1 other token. For example, you could instead use 3 Diamond Tokens, 3 Ruby Tokens, 5 Onyx Tokens, and 1 Gold Token to buy this card. Don't forget that discount/bonuses from previously purchased development cards also apply.</p>
    <p><HighlightText>Tier Card: </HighlightText>This is the backside of a development card. The development cards are split into 3 decks by tier (Tier1, Tier2, Tier3). A higher tier development card will generally net you more points but will cost more tokens to purchase. The dots at the top represent the tier (Tier2). The number in the bottom left (26) represents how many more development cards of that tier are left in the deck.</p>
    <p><HighlightText>Noble: </HighlightText>The number in the top left (3) represents the points you get from obtaining that noble. A noble is obtained by meeting it's requirements, found in the bottom right. These numbers and symbols represent the number and type of development cards you need. To obtain the noble above, you would need 3 Emerald development cards, 3 Ruby development cards, and 3 Sapphire development cards. A noble cannot be purchased; it is automatically given to the first player that meets it's requirements. The required development cards are not taken away from the player when a noble is obtained. Nobles are not replaced once obtained by a player.</p>
  </div>
)

const objectiveText = (
  <div>
    <p>The objective of the game is to get 15 or more points. Points are obtained from collecting development cards and nobles. A development card may be worth anywhere between 0 and 5 points. A noble is worth 3 points each. In order to win, you must be the player with the most points at the end of the round with a minimum of 15 points (see: <SectionReference>Tie Breaker Conditions</SectionReference> for more details). The winner is determined only once every player has completed their turn for that round.</p>
  </div>
)

const gameSetupText = (
  <div>
    <p><HighlightText>Development Cards:</HighlightText> The development cards will be split into 3 decks by tier. 4 cards from each tier will be placed face-up on the board. These are the active development cards.</p>
    <p><HighlightText>Nobles:</HighlightText> The number of nobles on the board is the number of players + 1.</p>
    <p><HighlightText>Tokens:</HighlightText> For all tokens (except gold), do the following. If there are 2 players, 4 of each token will be placed on the board. If there are 3 players, 5 of each token will be placed on the board. If there are 4 players, 7 of each token will be placed on the board. There will always be 5 Gold tokens on the board, regardless of the number of players.</p>
  </div>
)

const howToPlayText = (
  <div>
    <p>This is a turn-based game. Each player will have 1 turn in a round. There is a timer and if the timer runs out, the player will automatically skip their turn. On a given turn a player may perform only 1 of the following 4 actions:</p>
    <p><Indent/>1. Take 3 tokens of all different types (if available).</p>
    <p><Indent/>2. Take 2 tokens of the same type (if more than 4 of that type are available).</p>
    <p><Indent/>3. Reserve 1 development card and Obtain 1 Gold Token (if available).</p>
    <p><Indent/>4. Purchase 1 development card.</p>
    <p><HighlightText>Taking 3 tokens of different types:</HighlightText> A player may take 3 tokens (or less) of different types on their turn. There must be at least 1 token available for each selected type. A player may have no more than 10 tokens at the end of their turn so if a player ends up with more than 10 tokens, they must return tokens until they have 10 tokens exactly (no less).</p>
    <p><HighlightText>Taking 2 tokens of same type:</HighlightText> A player may take 2 tokens of the same type. However, they cannot have taken any other tokens of any type on this turn and there must be at least 4 tokens available of that type. A player may have no more than 10 tokens at the end of their turn so if a player ends up with more than 10 tokens, they must return tokens until they have 10 tokens exactly (no less). A player may return tokens from their hand or from their selected tokens.</p>
    <p><HighlightText>Reserving a development card:</HighlightText> A player can reserve a development card by taking any card on the board, or the first card from any tier card deck, and placing it in their hand. The reserved card cannot be bought by any player but the player who reserved it. A player may only have up to 3 reserved cards at a given time and cannot reserve if they already have 3 reserved cards. A reserved card cannot be discarded, only purchased. When reserving a card, the player will receive a gold token if there are any gold tokens available. This is the only way to obtain a gold token.</p>
    <p><HighlightText>Purchasing a development card:</HighlightText> A player can purchase a previously reserved card or purchase any development card from the board as long as the player has the required tokens. The required tokens must be spent and are returned to the board when purchasing a card. A gold token can be used in place of any 1 other token. If the purchased card was purchased from the board, replace the card with another card from the deck of the same tier (if any cards of that tier are available).</p>
    <p><HighlightText>Obtaining a Noble:</HighlightText> This is not an action but is executed at the end of each player's turn. If a player has enough purchased cards (bonuses) to meet the noble's requirements, they will obtain the noble. The points associated with the noble will be added to the player's point total. The noble will belong to only the first player that achieves the noble's requirements. The noble will be removed from the board and will not be replaced by another noble. A player may obtain multiple nobles on a single turn if they meet the requirements for them.</p>
  </div>
)

const tieBreakerText = (
  <div>
    <p> The winner is the player with the most points (with a minimum of 15 points) at the end of a round. It is possible that multiple players end the round with the same number of points. In that case the player with the least amount of development cards (amongst the players who tied) wins. If players are still tied, further game rounds are played until one player can break a tie condition.</p>
  </div>
)

const exampleGemStoneToken = {
  type: GemStone.EMERALD,
  amount: 5,
}

const exampleCard = {
  pointValue: 4,
  gemStoneType: CardGemStone.SAPPHIRE,
  tier: CardTier.TIER3,
  requiredGemStones: {
    [GemStone.DIAMOND]: 3,
    [GemStone.RUBY]: 3,
    [GemStone.CHOCOLATE]: 6,
  },
}

const exampleTierCard = {
  tier: CardTier.TIER2,
  remaining: 26,
}

const exampleNoble = {
  pointValue: 3,
  requiredCards: {
    [CardGemStone.EMERALD]: 3,
    [CardGemStone.RUBY]: 3,
    [CardGemStone.SAPPHIRE]: 3,
  }
}

class RulesModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      content: true,
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
        <SectionHeader>
          {getDisplayNameFromSection(section)}
          {this.state[section]
            ? <HeaderIcon onClick={() => this.toggleSection(section)}><i className="fa fa-chevron-up" /></HeaderIcon>
            : <HeaderIcon onClick={() => this.toggleSection(section)}><i className="fa fa-chevron-down" /></HeaderIcon>
          }
        </SectionHeader>
        {this.state[section] ? <SectionContent>{sectionText}</SectionContent> : null}
      </Section>
    )
  }

  render() {
    return (
      <ModalContainer>
          <Title>Game Rules</Title>
          <SubTitle>2-4 Players</SubTitle>
          <RuleBook><RulebookText onClick={()=> window.open("https://cdn.1j1ju.com/medias/7f/91/ba-splendor-rulebook.pdf", "_blank")}>See Offical Rulebook</RulebookText></RuleBook>
          <ImagesContainer>
            <ImageContainer>
              <ImageTitle>Token</ImageTitle>
              <GemStoneToken width={theme.token.width} height={theme.token.height} type={exampleGemStoneToken.type} amount={exampleGemStoneToken.amount} />
            </ImageContainer>
            <ImageContainer>
              <ImageTitle>Development Card</ImageTitle>
              <Card width={theme.card.width} height={theme.card.height} card={exampleCard} />
            </ImageContainer>
            <ImageContainer>
              <ImageTitle>Tier Card</ImageTitle>
              <TierCard width={theme.card.width} height={theme.card.height} tier={exampleTierCard.tier} remaining={exampleTierCard.remaining} />
            </ImageContainer>
            <ImageContainer>
              <ImageTitle>Noble</ImageTitle>
              <Noble width={theme.card.width} height={theme.card.width} noble={exampleNoble} />
            </ImageContainer>
          </ImagesContainer>
          {this.renderSection(SectionName.CONTENT, contentText)}
          {this.renderSection(SectionName.OBJECTIVE, objectiveText)}
          {this.renderSection(SectionName.GAMESETUP, gameSetupText)}
          {this.renderSection(SectionName.HOWTOPLAY, howToPlayText)}
          {this.renderSection(SectionName.TIEBREAKER, tieBreakerText)}
          <div>
            <Button
              color={theme.color.tertiary}
              onClick={this.props.handleClose}>
              Close
            </Button>
          </div>
      </ModalContainer>
    )
  }
}

export default RulesModal
