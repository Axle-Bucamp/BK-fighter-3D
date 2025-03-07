import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const INITIAL_HEALTH = 100;
const ATTACK_DAMAGE = 10;
const ROUND_TIME = 60;
const MOVE_SPEED = 1;
const JUMP_HEIGHT = 2;
const ATTACK_COOLDOWN = 500;
const JUMP_VELOCITY = 5; // Initial velocity for the jump
const GRAVITY = -9.8; // Simulated gravity
const MOVE_VELOCITY = 2; // Speed per frame
const MOVE_DURATION = 300; // Movement lasts for 300ms
const ATTACK_RANGE = 2; // Define attack range


export const useGameLogic = (burgerRef, jeanRef) => {
  const [burgerHealth, setBurgerHealth] = useState(INITIAL_HEALTH);
  const [jeanHealth, setJeanHealth] = useState(INITIAL_HEALTH);
  const [gameStates, setGameState] = useState('ready');
  const [winner, setWinner] = useState(null);
  const [roundTime, setRoundTime] = useState(ROUND_TIME);
  const [burgerAnimation, setBurgerAnimation] = useState('idle');
  const [jeanAnimation, setJeanAnimation] = useState('idle');
  const [canAttack, setCanAttack] = useState(true);
  const [burgerPosition, setBurgerPosition] = useState([1,0,0]);
  const [jeanPosition, setJeanPosition] = useState([0,0,0]);
  const isJumpingRef = useRef({ Burger: false, Jean: false });


  const resetGame = useCallback(() => {
    console.log("reset-direct")
    setBurgerHealth(INITIAL_HEALTH);
    setJeanHealth(INITIAL_HEALTH);
    setGameState('ready');
    setWinner(null);
    setRoundTime(ROUND_TIME);
    setBurgerAnimation('idle');
    setJeanAnimation('idle');
    setBurgerPosition([1,0,0]);
    setJeanPosition([0,0,0]);
    setCanAttack(true);
  }, []);

  const startRound = useCallback(() => {
    setGameState('fighting');
  }, []);

  const endRound = useCallback(() => {
    setGameState('roundOver'); // Prevent instant reset
    if (burgerHealth > jeanHealth) {
      setWinner('Burger');
    } else if (jeanHealth > burgerHealth) {
      setWinner('Jean');
    } else {
      setWinner('Draw');
    }
  
    // Delay reset to avoid immediate return to "ready"
    console.log("reset")
    setTimeout(() => {
      resetGame();
    }, 3000); // 3 seconds delay before resetting
  }, [burgerHealth, jeanHealth, resetGame]);
  

  const handleAttack = useCallback((attacker) => {
    console.log("attack")
    if (!canAttack) return; // Prevent spamming attacks
  
    let success = false;
    let position = null;
    let attackerPosition, defenderPosition, setDefenderHealth, defenderAnimation;
    console.log(attacker)

    if (attacker === 'Burger') {
      attackerPosition = burgerPosition;
      defenderPosition = jeanPosition;
      setDefenderHealth = setJeanHealth;
      defenderAnimation = jeanAnimation;
      setBurgerAnimation('attack')
      setTimeout(() => setBurgerAnimation('idle'), 500);
    } else {
      attackerPosition = jeanPosition;
      defenderPosition = burgerPosition;
      setDefenderHealth = setBurgerHealth;
      defenderAnimation = burgerAnimation;
      setJeanAnimation('attack')
      setTimeout(() => setJeanAnimation('idle'), 500);
    }
  
    // Calculate distance between characters
    const distance = Math.abs(attackerPosition[0] - defenderPosition[0]);
    console.log(distance)
    // Check if within range & defender is not in attack state
    if (distance <= ATTACK_RANGE && defenderAnimation !== 'attack') {
      success = true;
      position = [attackerPosition[0], attackerPosition[1]]; // Impact position
  
      setDefenderHealth(prevHealth => Math.max(0, prevHealth - ATTACK_DAMAGE));
      console.log(jeanHealth)
    }
  
    // Set cooldown to prevent spamming attacks
    setCanAttack(false);
    setTimeout(() => setCanAttack(true), ATTACK_COOLDOWN);
  
    return [success, position];
  }, [burgerPosition, jeanPosition, burgerAnimation, jeanAnimation, canAttack]);

  const moveCharacter = useCallback((character, direction) => {
    if (gameStates !== 'fighting') return;
  
    const setPosition = character === 'Burger' ? setBurgerPosition : setJeanPosition;
    const setAnim = character === 'Burger' ? setBurgerAnimation : setJeanAnimation;
  
    let velocity = direction === 'left' ? -MOVE_VELOCITY : MOVE_VELOCITY;
    let startTime = performance.now();
    
    setAnim('run');
  
    const animateMove = (currentTime) => {
      let elapsedTime = currentTime - startTime;
      if (elapsedTime >= MOVE_DURATION) {
        setAnim('idle');
        return;
      }
  
      setPosition((prev) => [prev[0] + velocity * (elapsedTime / MOVE_DURATION) * 0.1, prev[1], prev[2]]);
  
      requestAnimationFrame(animateMove);
    };
  
    requestAnimationFrame(animateMove);
  }, [gameStates]);
  
  const jumpCharacter = useCallback((character) => {
    if (gameStates !== 'fighting') return;
    if (isJumpingRef.current[character]) return; // Prevent double jumping
  
    const setPosition = character === 'Burger' ? setBurgerPosition : setJeanPosition;
    const setAnim = character === 'Burger' ? setBurgerAnimation : setJeanAnimation;
    
    isJumpingRef.current[character] = true; // Mark as jumping
    setAnim('jump');
  
    let velocity = JUMP_VELOCITY;
    let time = 0;
  
    const jumpInterval = setInterval(() => {
      setPosition((prev) => {
        time += 0.05; // Simulating time steps (50ms per frame)
        const newY = prev[1] + velocity * 0.05 + 0.5 * GRAVITY * Math.pow(0.05, 2);
        velocity += GRAVITY * 0.05; // Apply gravity
  
        if (newY <= 0) {
          setAnim('idle');
          isJumpingRef.current[character] = false; // Allow next jump
          clearInterval(jumpInterval);
          return [prev[0], 0, prev[2]]; // Reset to ground level
        }
        return [prev[0], newY, prev[2]];
      });
    }, 50);
  }, [gameStates]);
  
useEffect(() => {
  //if ( gameStates !== 'fighting') return;
  
  const timer = setInterval(() => {
    setRoundTime((prevTime) => {
      if (prevTime <= 1) {
        clearInterval(timer);
        setTimeout(endRound, 1000); // Give a delay before ending the round
        return 0;
      }
      return prevTime - 1;
    });
  }, 6000);

  return () => clearInterval(timer);
}, [gameStates, endRound]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      
      if ( gameStates === 'fighting') {
        switch (event.key) {
          case 'a': moveCharacter('Burger', 'left'); break;
          case 'd': moveCharacter('Burger', 'right'); break;
          case 'w': jumpCharacter('Burger'); break;
          case 'j': moveCharacter('Jean', 'left'); break;
          case 'l': moveCharacter('Jean', 'right'); break;
          case 'i': jumpCharacter('Jean'); break;
          case 's': handleAttack?.('Burger'); break; // Added optional chaining to prevent errors
          case 'k': handleAttack?.('Jean'); break;
          default: break;
        }
      }
      console.log(event.key)
      console.log(gameStates)
  
      if (gameStates === 'ready' || gameStates === 'roundOver') {
        if (event.key === ' ') startRound();
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleAttack, moveCharacter, jumpCharacter, gameStates, startRound]);

  return {
    burgerHealth,
    jeanHealth,
    gameStates,
    winner,
    roundTime,
    burgerAnimation,
    jeanAnimation,
    startRound,
    resetGame,
    handleAttack,
    burgerPosition,
    jeanPosition,
  };
};

export default useGameLogic;
