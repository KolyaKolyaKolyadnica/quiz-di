import series from "./series.json";
import halloween from "./halloween.json";

import SeriesLogo from "../assets/photo_5319271719010766001_x.jpg";
import SeriesBg from "../assets/owl-bg.jpg";
import Koala from "../assets/koala.jpg";
import Notr from "../assets/notr.png";
import HalloweenLogo from "../assets/halloween.jpg";

// Game accent colors, applied to the CSS variables from index.css.
const blueTheme = {
  "--accent": "#3a72e0",
  "--accent-hover": "#4c84f0",
  "--accent-glow": "rgba(58, 114, 224, 0.3)",
  "--on-accent": "#fff",
};

const pumpkinTheme = {
  "--accent": "#d07a1e",
  "--accent-hover": "#e08a2e",
  "--accent-glow": "rgba(208, 122, 30, 0.3)",
  "--on-accent": "#16120a",
};

// New game: add questions json to src/data, images to src/assets, and an entry here.
// images: key = "img"/"questionImg" value in json; YouTube: "questionVideo": "<id after v=>".
const games = [
  {
    id: "series",
    title: "Що? Де? Коли? 🦉",
    data: series,
    logo: SeriesLogo,
    background: SeriesBg,
    theme: blueTheme,
    images: {
      "koala.jpg": Koala,
      "notr.png": Notr,
    },
  },
  {
    id: "halloween",
    title: "Хелловін 🎃",
    data: halloween,
    logo: HalloweenLogo,
    background: HalloweenLogo,
    theme: pumpkinTheme,
    images: {},
  },
];

export const getGameById = (id) =>
  games.find((game) => game.id === id) || games[0];

export default games;
