import series from "./series.json";
import halloween from "./halloween.json";

import SeriesLogo from "../assets/photo_5319271719010766001_x.jpg";
import SeriesBg from "../assets/owl-bg.jpg";
import Koala from "../assets/koala.jpg";
import Notr from "../assets/notr.png";
import HalloweenLogo from "../assets/halloween.jpg";

// Кольори акценту гри, підставляються в CSS-змінні з index.css.
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

// Щоб додати нову гру: створи json з питаннями в src/data,
// поклади картинки в src/assets і додай сюди ще один об'єкт.
// images — картинки до питань, ключ = значення "img"/"questionImg" у json.
// Відео з YouTube до питання: "questionVideo": "<id з посилання після v=>".
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
