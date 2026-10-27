// Host and players talk browser-to-browser (WebRTC via PeerJS); the public PeerJS server only connects them.

// no look-alike chars (0/O, 1/I) so the code is easy to dictate
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const createRoomCode = () =>
  Array.from(
    { length: 5 },
    () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  ).join("");

export const hostPeerId = (roomCode) => `quiz-di-${roomCode}`;

export const joinUrl = (roomCode) =>
  `${window.location.origin}${window.location.pathname}?room=${roomCode}`;

export const getRoomFromUrl = () =>
  new URLSearchParams(window.location.search).get("room");

export const RETRY_DELAY = 3000;

// player -> host: { type: "hello", id, name }, { type: "buzz" }
// host -> player: { type: "state", ...buzzer state, teams and score }, { type: "kicked" }
