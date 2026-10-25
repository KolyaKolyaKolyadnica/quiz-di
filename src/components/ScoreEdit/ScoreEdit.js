import { useDispatch, useSelector } from "react-redux";
import playersActions from "../../redux/actions";
import { selectScorers } from "../../redux/selectors";
import style from "./ScoreEdit.module.css";

function ScoreEdit({ closeModal }) {
  const scorers = useSelector(selectScorers);

  const dispatch = useDispatch();

  const changeScore = (value, scorerId) => {
    dispatch(playersActions.increaseScore(value, scorerId));
    closeModal();
  };

  return (
    <div className={style.container}>
      <h2 className={style.title}>Хто ж відповів вірно?</h2>

      <div className={style.listContainer}>
        <ul className={style.list}>
          {scorers.map(({ id, name }) => (
            <li
              key={id}
              onClick={() => changeScore(1, id)}
              className={style.listItem}
            >
              <span>{name}</span>+ {1}
            </li>
          ))}
        </ul>
      </div>

      <div className="modal-button-container">
        <button className="button-secondary" onClick={() => closeModal()}>
          Ніхто не вгадав
        </button>
      </div>
    </div>
  );
}

export default ScoreEdit;
