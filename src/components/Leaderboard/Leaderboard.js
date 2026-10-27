import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectRanking } from "../../redux/selectors";
import { chime, confettiCannons } from "../../effects/celebrate";
import style from "./Leaderboard.module.css";

const PODIUM_SIZE = 3;
// podium steps left to right: 2nd, 1st, 3rd
const PODIUM_ORDER = [1, 0, 2];
const MEDALS = ["🥇", "🥈", "🥉"];

function Leaderboard({ onClose }) {
  const ranking = useSelector(selectRanking);
  const podium = ranking.slice(0, PODIUM_SIZE);
  const rest = ranking.slice(PODIUM_SIZE);

  useEffect(() => {
    confettiCannons();
    chime();
  }, []);

  return (
    <div className={style.container}>
      <h2 className={style.title}>Переможці</h2>

      <div className={style.podium}>
        {PODIUM_ORDER.filter((index) => podium[index]).map((index) => {
          const { place, score, scorers } = podium[index];

          return (
            <div
              key={place}
              className={`${style.step} ${style[`place${place}`]}`}
            >
              <ul className={style.names}>
                {scorers.map(({ id, name }) => (
                  <li key={id}>{name}</li>
                ))}
              </ul>

              <div className={style.block}>
                <span className={style.medal}>{MEDALS[index]}</span>
                <span className={style.score}>{score}</span>
              </div>
            </div>
          );
        })}
      </div>

      {rest.length > 0 && (
        <ol className={style.rest}>
          {rest.map(({ place, score, scorers }) => (
            <li key={place} className={style.restItem}>
              <span className={style.restPlace}>{place}</span>
              <span className={style.restNames}>
                {scorers.map(({ name }) => name).join(", ")}
              </span>
              <span className={style.score}>{score}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="modal-button-container">
        <button className="button-secondary" onClick={onClose}>
          До поля
        </button>
      </div>
    </div>
  );
}

export default Leaderboard;
