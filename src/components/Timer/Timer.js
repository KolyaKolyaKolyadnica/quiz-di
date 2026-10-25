import { useEffect, useState } from "react";
import style from "./Timer.module.css";
import ringSound from "../../assets/mixkit-vintage-telephone-ringtone-1356.wav";

const DURATION = 60;

// status: "idle" | "running" | "paused" | "over", lives in the parent so the video can follow it
function Timer({ status, onStatusChange, handleAnswer }) {
  const [secondsLeft, setSecondsLeft] = useState(DURATION);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    if (secondsLeft === 0) {
      onStatusChange("over");
      return;
    }

    const timeoutId = setTimeout(
      () => setSecondsLeft((prev) => prev - 1),
      1000
    );

    return () => clearTimeout(timeoutId);
  }, [status, secondsLeft, onStatusChange]);

  useEffect(() => {
    if (status !== "over") {
      return;
    }

    const audio = new Audio(ringSound);
    audio.currentTime = 0;

    audio.play().catch(() => {});

    const timeoutId = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 1300);

    return () => {
      clearTimeout(timeoutId);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [status]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const timeClassName = [
    style.time,
    status === "running" && style.running,
    ((status === "running" && secondsLeft <= 10) || status === "over") &&
      style.ending,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={style.container}>
      <div className={timeClassName}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      <div className="modal-button-container">
        {status === "idle" && (
          <button onClick={() => onStatusChange("running")}>Старт</button>
        )}

        {status !== "idle" && <button onClick={handleAnswer}>Далі</button>}
      </div>
    </div>
  );
}

export default Timer;
