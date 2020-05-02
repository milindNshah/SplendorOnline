const cardWidth = 6;
const cardHeight = 8;
const spaceBetweenCards = 0.5;

const theme = {
  color: {
    primary: "#28a745",
    secondary: '#17a2b8',
    error: "red",
    white: "white",
    black: "black",
    diamond: "white",
    sapphire: "blue",
    emerald: "green",
    ruby: "red",
    chocolate: "#CB6D51",
    gold: "#FFD700",
    tier1: "green",
    tier2: "purple",
    tier3: "#eb6b34",
  },
  fontFamily: {
    primary: "Raleway",
    secondary: "Roboto Slab",
  },
  fontSize: "1rem",
  button: {
    width: "9rem",
  },
  input: {
    width: "15rem",
    hoverColor: "#17a2b8",
    borderColor: "#BCBCBC",
    placeHolderColor: "#AAA",
    errorColor: "red",
  },
  token: {
    width: 5,
    height: 5,
    modal: {
      width: 3,
      height: 3,
    },
  },
  card: {
    width: `${cardWidth}`,
    height: `${cardHeight}`,
    modal: {
      width: 12,
      height: 16,
    }
  },
  board: {
    spaceBetweenCards: `${spaceBetweenCards}`,
    width: `${cardWidth*5+spaceBetweenCards*10+5}rem`,
  },
  player: {
    iconColWidth: `${(cardWidth*5+spaceBetweenCards*10+5)*4/6}rem`,
    nameColWidth: `${(cardWidth*5+spaceBetweenCards*10+5)*1/6}rem`,
    iconColWidth: `${(cardWidth*5+spaceBetweenCards*10+5)*1/6}rem`,
  }
};

export default theme;
