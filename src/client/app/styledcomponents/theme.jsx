const cardWidth = 6;
const cardHeight = 8;
const spaceBetweenCards = 0.5;

const theme = {
  color: {
    primary: "#28a745",
    secondary: '#17a2b8',
    tertiary: "#ff6726",
    error: "red",
    white: "white",
    black: "black",
    darkgrey: "rgba(0, 0, 0, 0.75)",
    grey: "rgba(0, 0, 0, 0.5)",
    lightgrey: "rgba(0, 0, 0, 0.25)",
    diamond: "#b9f2ff",
    sapphire: "#0040ff",
    emerald: "#50C878",
    ruby: "red",
    chocolate: "#CB6D51",
    gold: "#FFD700",
    tier1: "green",
    tier2: "#CC00FF",
    tier3: "#eb6b34",
    placeHolder: "#AAA",
    inputBorder: "#BCBCBC",
    yourTurn: "rgba(255, 0, 0, 0.9)",
  },
  fontFamily: {
    primary: "Raleway",
    secondary: "Roboto Slab",
    tertiary: "Source Sans Pro",
  },
  gemStoneIsZero: {
    opacity: 0.1,
  },
  gemStoneIsGold: {
    opacity: 0.3,
  },
  fontSize: "1rem",
  button: {
    height: 2.25,
    width: 9,
  },
  token: {
    width: 5,
    height: 5,
    modal: {
      width: 3,
      height: 3,
    },
  },
  modal: {
    padding: 2,
  },
  card: {
    width: `${cardWidth}`,
    height: `${cardHeight}`,
    modal: {
      width: 12,
      height: 16,
    },
    icon: {
      width: `${cardWidth/2}`,
      height: `${cardHeight/2}`,
      gemStone: {
        width: `${cardWidth*1/5}`,
        height: `${cardWidth*1/5}`,
      },
    },
    reservedCol: {
      width: `${cardWidth*3/4}`,
      height: `${cardHeight*3/4}`,
    },
    spaceBetween: `${spaceBetweenCards}`,
  },
  actionLog: {
    width: 16,
    minHeight: 12,
    midHeight: 30,
    maxHeight: 40,
  }
};

export default theme;
