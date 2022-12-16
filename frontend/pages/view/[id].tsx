import { MakerData } from '@/consts/types';
import CrossWordViewer from '@/src/components/crossWord/viewer';
import { GetServerSideProps } from 'next';
import { getGame } from '../../src/utils/api';

interface Props {
  title: string;
  makerData: MakerData;
}
function Viewer({ title, makerData }: Props) {
  return <CrossWordViewer title={title} makerData={makerData} />;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const templateDocument = await getGame(query.id as string);
    return {
      props: {
        ...templateDocument,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      notFound: true,
    };
  }
};

export default Viewer;
