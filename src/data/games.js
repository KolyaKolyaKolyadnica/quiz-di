import series from "./series.json";
import halloween from "./halloween.json";

import SeriesLogo from "../assets/photo_5319271719010766001_x.jpg";
import SeriesBg from "../assets/owl-bg.jpg";
import Koala from "../assets/koala.jpg";
import Notr from "../assets/notr.png";

// Щоб додати нову гру: створи json з питаннями в src/data,
// поклади картинки в src/assets і додай сюди ще один об'єкт.
// images — картинки до питань, ключ = значення "img"/"questionImg" у json.
const games = [
  {
    id: "series",
    title: "Основна гра",
    data: series,
    logo: SeriesLogo,
    background: SeriesBg,
    images: {
      "koala.jpg": Koala,
      "notr.png": Notr,
    },
  },
  {
    id: "halloween",
    title: "Хелловін",
    data: halloween,
    // TODO: заміни на хелловінські картинки
    logo: SeriesLogo,
    background: SeriesBg,
    images: {},
  },
];

export const getGameById = (id) =>
  games.find((game) => game.id === id) || games[0];

export default games;
