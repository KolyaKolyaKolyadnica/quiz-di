import style from "../../components/FlyingBalls/FlyingBalls.module.css";

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

export const createBall = (idx, direction) => {
  if (direction === "up") {
    return (
      <div
        key={idx}
        className={style.ball}
        style={{
          top: `${0}%`,
          left: `${getRandomIntInclusive(-10, 110)}%`,
          animationDuration: `${getRandomIntInclusive(1500, 2000)}ms`,
        }}
      ></div>
    );
  }
  if (direction === "right") {
    return (
      <div
        key={idx}
        className={style.ball}
        style={{
          top: `${getRandomIntInclusive(-10, 110)}%`,
          left: `${110}%`,
          animationDuration: `${getRandomIntInclusive(1500, 2000)}ms`,
        }}
      ></div>
    );
  }
  if (direction === "down") {
    return (
      <div
        key={idx}
        className={style.ball}
        style={{
          top: `${110}%`,
          left: `${getRandomIntInclusive(-10, 110)}%`,
          animationDuration: `${getRandomIntInclusive(1500, 2000)}ms`,
        }}
      ></div>
    );
  }
  if (direction === "left") {
    return (
      <div
        key={idx}
        className={style.ball}
        style={{
          top: `${getRandomIntInclusive(-10, 110)}%`,
          left: `${0}%`,
          animationDuration: `${getRandomIntInclusive(2500, 18000)}ms`,
        }}
      ></div>
    );
  }
};
