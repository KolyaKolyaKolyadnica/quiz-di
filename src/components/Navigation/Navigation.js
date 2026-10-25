import style from "./Navigation.module.css";
import { useSelector } from "react-redux";
import { selectScorers } from "../../redux/selectors";

function Navigation() {
  const scorers = useSelector(selectScorers);

  return (
    <ol className={style.list}>
      {scorers.map(({ id, name, score }) => (
        <li key={id} className={style.listItem}>
          {name}
          <span key={score} className={style.score}>
            {score}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default Navigation;
