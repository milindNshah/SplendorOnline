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
    grey: "rgba(0, 0, 0, 0.5)",
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
  modal: {
    padding: 2,
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
    token: { // TODO: Remove and delete.
      width: 3,
      height: 4,
    }
  },
  board: {
    width: `${cardWidth*5+spaceBetweenCards*10+5}`,
  },
};

export default theme;
