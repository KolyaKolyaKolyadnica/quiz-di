import QuizCategory from "../QuizCategory";
import style from "./Quiz.module.css";

function Quiz({ categories, showScore, doneQuestions }) {
  const allQuestionsNum = categories.reduce(
    (acc, cur) => acc + cur.points.length,
    0
  );

  return (
    <div className={style.container}>
      <table className={style.table}>
        <tbody>
          {categories.map((category) => {
            return (
              <tr key={category.name}>
                <th className={style.category}>{category.name}</th>
                <QuizCategory category={category} showScore={showScore} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Quiz;
