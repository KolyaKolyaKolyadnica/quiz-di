import QuizQuestion from "../QuizQuestion";

function QuizCategory({ category, images, showScore }) {
  return (
    <>
      {category.points.map((point, idx) => {
        return (
          <QuizQuestion
            key={idx}
            point={point}
            images={images}
            showScore={showScore}
          />
        );
      })}
    </>
  );
}

export default QuizCategory;
