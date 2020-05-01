const cardWidth = 6;
const cardHeight = 8;

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
    fontSize: "2rem",
    width: "5rem",
    height: "5rem",
    gemStone: {
      width: "2rem",
      height: "2rem",
    },
  },
  card: {
    width: `${cardWidth}rem`,
    height: `${cardHeight}rem`,
    scoreFontSize: "1.5rem",
    amountFontSize: "0.9rem",
    gemStoneType: {
      width: "1rem",
      height: "1rem",
    },
    icon: {
      width: `${cardWidth/10}rem`,
      height: `${cardHeight/10}rem`,
    },
    horizontalLine: {
      x1: `1.75rem`,
      y1: `0.25rem`,
      x2: `1.75rem`,
      y2: `${cardWidth-0.25}rem`,
    },
    diagonalLine: {
      x1: `0.5rem`,
      y1: `${cardHeight-0.5}rem`,
      x2: `${cardWidth-0.5}rem`,
      y2: `0.5rem`,
    },
    gemStone: {
      width: "0.75rem",
      height: "0.75rem",
    }
  },
  board: {
    colLeftRightMargin: `0.5rem`,
    width: `${cardWidth*5+0.5*10+5}rem`,
  },
  player: {
    iconColWidth: `${(cardWidth*5+0.5*10+5)*4/6}rem`,
    nameColWidth: `${(cardWidth*5+0.5*10+5)*1/6}rem`,
    iconColWidth: `${(cardWidth*5+0.5*10+5)*1/6}rem`,
  }
};

export default theme;
