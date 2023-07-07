import configureStore from '@/reducers/configureStore';
import CommonLayout from '@/src/layout/common';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import '../styles/globals.css';

export const store = configureStore();

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <CommonLayout>
        <Component {...pageProps} />
      </CommonLayout>
    </Provider>
  );
}
export default App;
