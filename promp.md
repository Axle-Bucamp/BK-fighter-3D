# 🍔 VS 🏃‍♂️ - Multiplayer Fighting Game

## 🎮 Overview
This project is a **real-time multiplayer fighting game** featuring two characters: **Burger** and **Jean**. The game involves movement, jumping, and attacking mechanics, with health tracking and smooth animations. It is built using **React Three Fiber** for rendering 3D elements and handling physics-based character interactions.

## 🚀 Features
- **Character Selection**: Choose between Burger and Jean.
- **Smooth Character Movement**: Real-time position updates and velocity-based motion.
- **Jumping Physics**: Gravity-based jumping mechanics with prevention of double jumps.
- **Attack System**: Includes range detection, damage calculation, and conditional attack states.
- **Health System**: Dynamic health bars that update based on damage received.
- **Realistic Animations**: Idle, attack, hurt, and movement animations.
- **Game UI**: Interactive start screen, health indicators, and game-over overlay.

## 🏗️ Technologies Used
- **React Three Fiber** (`@react-three/fiber`) - 3D rendering in React
- **Drei** (`@react-three/drei`) - Helpers for scene elements
- **React Hooks** (`useRef`, `useState`, `useCallback`) - State and event handling
- **CSS Modules** - Styled components for the UI elements

## 🎮 Gameplay Mechanics
### 🎭 Character Movement
- Uses **velocity-based movement** for smoother transitions.
- Movement controlled by `moveCharacter` function with interval updates.

### 🦘 Jump System
- Characters can only jump if they are **not already jumping**.
- Implements **gravity effects** and **parabolic motion**.

### ⚔️ Attack System
- Attacks **only land if the opponent is not in an attack state**.
- Includes **randomized success rate and range-based impact**.
- Health **decreases dynamically** upon a successful hit.

## 🎨 UI Components
- **Health Bars**: Positioned above characters, with animated updates.
- **Start Screen**: Displays a semi-transparent overlay before the game begins.
- **Game Over Screen**: Triggers when a character’s health reaches zero.


## 🔮 Requested Enhancements
- Multiplayer mode using WebSockets
- More characters with unique abilities
- Improved AI for single-player mode
- Sound effects and background music
- 3D asset from tripoSR (.obj) rigged
- 3D animation from AnimateAnything (.obj) rigged
- 3D battle field (depth map from AR )

