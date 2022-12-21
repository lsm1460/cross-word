import CurvedTextInput from '@/src/components/CurvedTextInput';
import GameList from '@/src/components/home/gameList';

function Home() {
  return (
    <div>
      <CurvedTextInput width={500} />
      <GameList />
    </div>
  );
}

export default Home;
