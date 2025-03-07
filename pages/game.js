import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const GameScene = dynamic(() => import('../components/GameScene'), { ssr: false });

export default function GamePage() {
  const router = useRouter();
  const { player1, player2 } = router.query;

  if (!player1 || !player2) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GameScene player1Character={player1} player2Character={player2} />
    </div>
  );
}