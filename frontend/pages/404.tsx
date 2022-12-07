import Link from 'next/link';

function Error404() {
  return (
    <div>
      <p>not found 404...</p>
      <Link href="/">
        <a>move to home</a>
      </Link>
    </div>
  );
}

export default Error404;
