import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import style from "./YouTubeVideo.module.css";

let apiPromise;

const loadYouTubeApi = () => {
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve(window.YT);
        return;
      }
      window.onYouTubeIframeAPIReady = () => resolve(window.YT);

      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    });
  }
  return apiPromise;
};

// start: seconds to begin the video from
function YouTubeVideo({ videoId, start = 0, timerStatus, onStart }) {
  const wrapperRef = useRef(null);
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initPlayer = async () => {
      const YT = await loadYouTubeApi();

      if (!isMounted) {
        return;
      }

      const el = document.createElement("div");
      wrapperRef.current.appendChild(el);

      playerRef.current = new YT.Player(el, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          start,
        },
        events: {
          onReady: () => setIsReady(true),
          onStateChange: ({ data }) =>
            setIsPlaying(data === YT.PlayerState.PLAYING),
        },
      });
    };

    initPlayer();

    return () => {
      isMounted = false;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, start]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (timerStatus === "running" || timerStatus === "watching") {
      playerRef.current.playVideo();
    }
    if (timerStatus === "paused" || timerStatus === "over") {
      playerRef.current.pauseVideo();
    }
  }, [isReady, timerStatus]);

  const togglePlay = () => {
    if (timerStatus === "idle") {
      onStart();
      return;
    }

    if (!isReady) {
      return;
    }

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  return (
    <div className={style.container}>
      <div ref={wrapperRef} className={style.player} />

      <button
        className={`${style.overlay} ${isPlaying ? style.overlayPlaying : ""}`}
        onClick={togglePlay}
        aria-label={isPlaying ? "Пауза" : "Відтворити"}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </div>
  );
}

export default YouTubeVideo;
