import QuizQuestion from "../QuizQuestion";

function QuizCategory({ category, showScore }) {
  return (
    <>
      {category.points.map((point, idx) => {
        return <QuizQuestion key={idx} point={point} showScore={showScore} />;
      })}
    </>
  );
}

export default QuizCategory;
