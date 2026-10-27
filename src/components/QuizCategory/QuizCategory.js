import QuizQuestion from "../QuizQuestion";

function QuizCategory({ category, images, showScore, onQuestionDone }) {
  return (
    <>
      {category.points.map((point, idx) => {
        return (
          <QuizQuestion
            key={idx}
            point={point}
            images={images}
            showScore={showScore}
            onDone={onQuestionDone}
          />
        );
      })}
    </>
  );
}

export default QuizCategory;
