import CurvedTextInput from '@/src/components/CurvedTextInput';
import Link from 'next/link';

function Home() {
  return (
    <div>
      <CurvedTextInput width={500} defaultText={'Game List'} />
      <ul>
        <li>
          <Link href="/cross-word">
            <a>cross word(만들기만 가능)</a>
          </Link>
        </li>
        <li>
          <Link href="/aquarium">
            <a>aquarium(그림판만 구현)</a>
          </Link>
        </li>
        <li>
          <Link href="/slide-puzzle">
            <a>slide-puzzle</a>
          </Link>
        </li>
        <li>
          <Link href="/shisen-sho">
            <a>사천성</a>
          </Link>
        </li>
        <li>
          <Link href="/nonogram">
            <a>노노그램? 피크로스?</a>
          </Link>
        </li>
        <li>
          <Link href="/code-flow-lab">
            <a>플로우랩</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
