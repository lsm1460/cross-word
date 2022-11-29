import { MakerData } from '@/consts/types';
import CrossWordViewer from '@/src/components/crossWord/viewer';
import { GetServerSideProps } from 'next';

interface Props {
  makerData: MakerData;
}
function Viewer({ makerData }: Props) {
  return <CrossWordViewer makerData={makerData} />;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  let makerData = null;

  if (query.id === 'dummy') {
    makerData = require('../../src/utils/dummyData.json');

    makerData = {
      ...makerData,
      board: makerData.board.map((_line) => _line.map((_item) => (_item.trim() ? null : _item))),
    };
  } else {
  }

  return {
    props: {
      makerData,
    },
  };
};

export default Viewer;
