import style from "./FlyingBalls.module.css";
import { createBall } from "../../js/BallAnimation/BallAnimation";

function FlyingBalls() {
  const arr = [1, 2, 3, 4, 5];

  return (
    <div className={style.ballContainer}>
      {arr.map((_, idx) => createBall(idx, "up"))}
      {arr.map((_, idx) => createBall(idx, "right"))}
      {arr.map((_, idx) => createBall(idx, "down"))}
      {arr.map((_, idx) => createBall(idx, "left"))}
    </div>
  );
}

export default FlyingBalls;
