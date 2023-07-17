import { ChartItemType, ViewerItem } from '@/consts/types/codeFlowLab';
import ViewerButtonBlock from './viewerButtonBlock';
import ViewerDivBlock from './viewerDivBlock';
import ViewerSpanBlock from './viewerSpanBlock';
import ViewerParagraphBlock from './viewerParagraphBlock';

interface Props {
  viewerItem: ViewerItem;
}
function ViewerElBlock({ viewerItem }: Props) {
  return (
    <>
      {viewerItem.elType === ChartItemType.div && <ViewerDivBlock viewerItem={viewerItem} />}
      {viewerItem.elType === ChartItemType.button && <ViewerButtonBlock viewerItem={viewerItem} />}
      {viewerItem.elType === ChartItemType.paragraph && <ViewerParagraphBlock viewerItem={viewerItem} />}
      {viewerItem.elType === ChartItemType.span && <ViewerSpanBlock viewerItem={viewerItem} />}
    </>
  );
}

export default ViewerElBlock;
