const cardWidth = 6;
const cardHeight = cardWidth*4/3;

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
    fontSize: 2, // TODO: Remove.
    width: 5,
    height: 5,
    modal: {
      width: 2.5,
      height: 2.5,
    },
  },
  amount: {
    fontSize: `${cardWidth/6}rem`, // TODO: Remove.
  },
  card: {
    width: `${cardWidth}rem`,
    height: `${cardHeight}rem`,
    score: {
      fontSize: `${cardWidth/4}rem`,
      padding: `${cardWidth/24}rem ${cardWidth/12}rem`
    },
    gemStoneType: {
      width: `${cardWidth/6}`, // TODO: Remove after converting card.width/height. Need to replace this calc code instead of using the theme.
      height: `${cardWidth/6}`,
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
      padding: `${cardWidth/60}rem ${cardWidth/24}rem`,
      width: `${cardHeight/10}`,
      height: `${cardHeight/10}`,
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
