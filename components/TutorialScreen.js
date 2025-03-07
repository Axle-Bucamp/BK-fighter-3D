import React from 'react';
import styles from '../styles/TutorialScreen.module.css';

const TutorialScreen = ({ onBack }) => {
  return (
    <div className={styles.tutorialContainer}>
      <h1 className={styles.title}>How to Play Burger vs. Jean</h1>
      
      <section className={styles.section}>
        <h2>Game Objective</h2>
        <p>Battle it out as either Burger or Jean! Reduce your opponent's health to zero to win.</p>
      </section>

      <section className={styles.section}>
        <h2>Controls</h2>
        <h3>Burger:</h3>
        <ul>
          <li>Move Left: A</li>
          <li>Move Right: D</li>
          <li>Jump: W</li>
          <li>Attack: Space</li>
          <li>Special Move: Q</li>
        </ul>
        <h3>Jean:</h3>
        <ul>
          <li>Move Left: Left Arrow</li>
          <li>Move Right: Right Arrow</li>
          <li>Jump: Up Arrow</li>
          <li>Attack: Enter</li>
          <li>Special Move: Right Shift</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Special Moves</h2>
        <p>Burger: "Patty Slam" - A powerful downward attack</p>
        <p>Jean: "Denim Dash" - A quick dash attack</p>
      </section>

      <section className={styles.section}>
        <h2>Tips</h2>
        <ul>
          <li>Use a combination of regular attacks and special moves</li>
          <li>Time your jumps to avoid attacks</li>
          <li>Watch your health bar and try to predict your opponent's moves</li>
        </ul>
      </section>

      <button className={styles.backButton} onClick={onBack}>
        Back to Main Menu
      </button>
    </div>
  );
};

export default TutorialScreen;