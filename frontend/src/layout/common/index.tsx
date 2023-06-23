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
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </Head>
      <div className={cx('container')}>{children}</div>
    </>
  );
}

export default CommonLayout;
