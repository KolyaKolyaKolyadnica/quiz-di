import style from "./Navigation.module.css";
import { useSelector } from "react-redux";

function Navigation() {
  const players = useSelector((state) => state.playersList.players);
  const score = useSelector((state) => state.playersList.score);

  return (
    <ol className={style.list}>
      {players.map((player, index) => (
        <li key={player + index} className={style.listItem}>
          {player} : <span>{score[index]} балів</span>
        </li>
      ))}
    </ol>
  );
}

export default Navigation;
