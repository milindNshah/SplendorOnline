const cardWidth = 6;
const cardHeight = 8;
const spaceBetweenCards = 0.5;

const theme = {
  color: {
    primary: "#28a745",
    secondary: '#17a2b8',
    orangeSelect: "rgba(255, 127, 80, 1)",
    error: "red",
    white: "white",
    black: "black",
    grey: "rgba(0, 0, 0, 0.5)",
    lightgrey: "rgba(0, 0, 0, 0.2)",
    diamond: "white",
    sapphire: "blue",
    emerald: "green",
    ruby: "red",
    chocolate: "#CB6D51",
    gold: "#FFD700",
    tier1: "green",
    tier2: "purple",
    tier3: "#eb6b34",
    placeHolder: "#AAA",
    inputBorder: "#BCBCBC",
  },
  fontFamily: {
    primary: "Raleway",
    secondary: "Roboto Slab",
  },
  fontSize: "1rem",
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
    spaceBetween: `${spaceBetweenCards}`,
  },
};

export default theme;
