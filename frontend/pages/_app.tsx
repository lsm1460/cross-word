import CommonLayout from '@/src/layout/common';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <CommonLayout>
      <Component {...pageProps} />
    </CommonLayout>
  );
}
export default App;
