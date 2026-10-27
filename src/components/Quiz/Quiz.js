import QuizCategory from "../QuizCategory";
import style from "./Quiz.module.css";

function Quiz({ categories, images, showScore, onQuestionDone }) {
  return (
    <div className={style.container}>
      <table className={style.table}>
        <tbody>
          {categories.map((category, index) => {
            return (
              <tr key={category.name + index}>
                <QuizCategory
                  category={category}
                  images={images}
                  showScore={showScore}
                  onQuestionDone={onQuestionDone}
                />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Quiz;
