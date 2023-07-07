import styles from './common.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
//
import Head from 'next/head';

interface Props {
  children;
}
function CommonLayout({ children }: Props) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </Head>
      <div className={cx('container')}>{children}</div>
    </>
  );
}

export default CommonLayout;
