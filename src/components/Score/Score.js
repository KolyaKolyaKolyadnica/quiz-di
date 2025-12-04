import { useSelector } from "react-redux";
import style from "./Score.module.css";

function Score() {
  const players = useSelector((state) => state.playersList.players);
  const score = useSelector((state) => state.playersList.score);

  return (
    <div className={style.container}>
      <h2 className={style.title}>Кількість балів у гравців.</h2>

      <ul className={style.list}>
        {players.map((player, index) => (
          <li key={player} className={style.listItemOfRezult}>
            <span>
              {player} : {score[index]} балів
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Score;
