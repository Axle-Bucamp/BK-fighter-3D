import React from 'react';
import styles from './TutorialScreen.module.css';

const TutorialScreen = ({ onClose }) => {
  return (
    <div className={styles.tutorialScreen}>
      <h2>How to Play</h2>
      <section>
        <h3>Basic Controls</h3>
        <ul>
          <li>Move Left: A or ←</li>
          <li>Move Right: D or →</li>
          <li>Jump: W or ↑</li>
          <li>Attack: Space</li>
        </ul>
      </section>
      <section>
        <h3>Combo System</h3>
        <p>Chain attacks together quickly to increase your combo count. Higher combos deal more damage!</p>
      </section>
      <section>
        <h3>Special Moves</h3>
        <h4>Burger</h4>
        <p>Burger Slam: ↓ + ↑ + Space</p>
        <h4>Jean</h4>
        <p>Jean Spin: → + ← + Space</p>
      </section>
      <button className={styles.closeButton} onClick={onClose}>Close Tutorial</button>
    </div>
  );
};

export default TutorialScreen;