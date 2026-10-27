import { useEffect, useState } from "react";
import style from "./Timer.module.css";
import ringSound from "../../assets/mixkit-vintage-telephone-ringtone-1356.wav";

const DURATION = 60;
// seconds before auto-start, gives players a moment to read the question
const START_DELAY = 3;

// status: "idle" | "running" | "paused" | "watching" | "over", lives in the parent so the video can follow it
// inline: time and buttons in one row, to save height
function Timer({ status, onStatusChange, handleAnswer, inline = false }) {
  const [secondsLeft, setSecondsLeft] = useState(DURATION);
  const [delayLeft, setDelayLeft] = useState(START_DELAY);

  useEffect(() => {
    if (status !== "idle") {
      return;
    }

    if (delayLeft === 0) {
      onStatusChange("running");
      return;
    }

    const timeoutId = setTimeout(() => setDelayLeft((prev) => prev - 1), 1000);

    return () => clearTimeout(timeoutId);
  }, [status, delayLeft, onStatusChange]);

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
    <div className={`${style.container} ${inline ? style.inline : ""}`}>
      {status === "idle" ? (
        <div key={delayLeft} className={`${style.time} ${style.countdown}`}>
          {delayLeft}
        </div>
      ) : (
        <div className={timeClassName}>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      )}

      <div className="modal-button-container">
        {status === "idle" && (
          <button onClick={() => onStatusChange("running")}>Старт зараз</button>
        )}

        {status !== "idle" && <button onClick={handleAnswer}>Далі</button>}
      </div>
    </div>
  );
}

export default Timer;
