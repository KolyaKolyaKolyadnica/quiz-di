import { useEffect, useState } from "react";
import style from "./Timer.module.css";
import ringSound from "../../assets/mixkit-vintage-telephone-ringtone-1356.wav";

const DURATION = 60;

function Timer({ handleAnswer }) {
  const [secondsLeft, setSecondsLeft] = useState(DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [timeIsOver, setTimeIsOver] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsRunning(false);
          setTimeIsOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    if (!timeIsOver) return;

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
  }, [timeIsOver]);

  const handleStart = () => {
    setSecondsLeft(DURATION);
    setIsRunning(true);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className={style.container}>
      <div className={style.time}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>

      <div className="modal-button-container">
        {!isRunning && !timeIsOver && (
          <button
            className={style.button}
            onClick={handleStart}
            disabled={isRunning}
          >
            Старт
          </button>
        )}

        {(isRunning || timeIsOver) && (
          <button className={style.button} onClick={handleAnswer}>
            Далі
          </button>
        )}
      </div>
    </div>
  );
}

export default Timer;
