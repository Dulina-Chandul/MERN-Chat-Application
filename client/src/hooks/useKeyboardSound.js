const keyStrokeSound = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];

function useKeyboardSound() {
  const playRandomKeyStrokeSound = () => {
    const randomIndex = Math.floor(Math.random() * keyStrokeSound.length);
    const sound = keyStrokeSound[randomIndex];

    sound.currentTime = 0;
    sound.play().catch((error) => console.error("Error playing sound:", error));
  };

  return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;
