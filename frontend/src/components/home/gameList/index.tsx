import { getGameList, GetGameListReturn } from '@/src/utils/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAsyncEffect } from '@/src/utils/use-async';
import { useRouter } from 'next/dist/client/router';

const perPage = 30;

function GameList() {
  const router = useRouter();

  const [gameListState] = useAsyncEffect<GetGameListReturn, Error, typeof getGameList>(
    getGameList,
    [parseInt(router.query.page as string, 10) || 1, perPage],
    [router.query]
  );

  return (
    <div>
      <Link href="/edit">
        <button>만들기</button>
      </Link>
      <br />
      <p>작성된 게임 리스트</p>

      {gameListState.loading && <p>loading..</p>}
      {gameListState.error && <p>error occurred..</p>}
      {gameListState.success && (
        <ul>
          {(gameListState.data?.list || []).map((_item) => (
            <li key={_item.id}>
              <Link href={`/view/${_item.id}`}>
                <a>
                  title: {_item.nickname} createAt: {new Date(_item.createdAt).toDateString()}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GameList;
