import Link from 'next/link';

function Home() {
  return (
    <div>
      <Link href="/edit">
        <button>만들기</button>
      </Link>
      <br />
      <p>작성된 게임 리스트</p>
      <ul>
        <li></li>
      </ul>
    </div>
  );
}

export default Home;
