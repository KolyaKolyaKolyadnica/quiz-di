import { useDispatch, useSelector } from "react-redux";
import playersActions from "../../redux/actions";
import style from "./ScoreEdit.module.css";

function ScoreEdit({ costOfQuestion, closeModal }) {
  const players = useSelector((state) => state.playersList.players);
  const score = useSelector((state) => state.playersList.score);

  const dispatch = useDispatch();

  const changeScore = (costOfQuestion, playerIndex) => {
    dispatch(playersActions.increasePlayerScore(costOfQuestion, playerIndex));
    closeModal();
  };

  return (
    <div className={style.container}>
      <h2 className={style.title}>Хто ж відповів вірно?</h2>

      <div className={style.listContainer}>
        <ul className={style.list}>
          {players.map((player, index) => (
            <li
              key={player}
              onClick={() => changeScore(1, index)}
              className={style.listItem}
            >
              <span>{player}</span>+ {1}
            </li>
          ))}
        </ul>
      </div>

      <div className="modal-button-container">
        <button onClick={() => closeModal()}>Ні хто не вгадав</button>
      </div>
    </div>
  );
}

export default ScoreEdit;
