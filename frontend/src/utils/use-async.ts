import { useReducer, useEffect, Reducer } from 'react';

type LoadingAction = {
  type: 'LOADING';
};

type SuccessAction<T> = {
  type: 'SUCCESS';
  data: T;
};

type ErrorAction<T> = {
  type: 'ERROR';
  error: T;
};

type AsyncAction<D, E> = LoadingAction | SuccessAction<D> | ErrorAction<E>;

export type AsyncState<D, E> = {
  loading: boolean;
  success: boolean;
  data: D | null;
  error: E | null;
};

function asyncReducer<D, E>(state: AsyncState<D, E>, action: AsyncAction<D, E>): AsyncState<D, E> {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        success: false,
        data: null,
        error: null,
      };
    case 'SUCCESS':
      return {
        loading: false,
        success: true,
        data: action.data,
        error: null,
      };
    case 'ERROR':
      return {
        loading: false,
        success: false,
        data: null,
        error: action.error,
      };
  }
}

type PromiseFn<T> = (...args: any) => Promise<T>;

export function useAsync<D, E, F extends PromiseFn<D>>(promiseFn: F) {
  const [state, dispatch] = useReducer<Reducer<AsyncState<D, E>, AsyncAction<D, E>>>(asyncReducer, {
    loading: null,
    success: null,
    data: null,
    error: null,
  } as AsyncState<D, E>);

  async function run(...params: Parameters<F>) {
    dispatch({ type: 'LOADING' });
    try {
      const data = await promiseFn(...params);
      dispatch({
        type: 'SUCCESS',
        data,
      });

      return data;
    } catch (e) {
      dispatch({
        type: 'ERROR',
        error: e,
      });
    }
  }

  return [state, run] as const;
}

export function useAsyncEffect<D, E, F extends PromiseFn<D>>(promiseFn: F, params: Parameters<F>, deps: any[]) {
  const [state, run] = useAsync<D, E, typeof promiseFn>(promiseFn);
  useEffect(
    () => {
      run(...params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  return [state, run] as const;
}
