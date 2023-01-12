import CurvedTextInput from '@/src/components/CurvedTextInput';
import Link from 'next/link';

function Home() {
  return (
    <div>
      <CurvedTextInput width={500} defaultText={'Game List'} />
      <ul>
        <li>
          <Link href="/cross-word">
            <a>cross word</a>
          </Link>
        </li>
        <li>
          <Link href="/aquarium">
            <a>aquarium</a>
          </Link>
        </li>
        <li>
          <Link href="/slide-puzzle">
            <a>slide-puzzle</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
