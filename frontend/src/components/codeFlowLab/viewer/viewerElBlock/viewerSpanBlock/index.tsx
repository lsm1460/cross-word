import { ChartSpanItem, ViewerItem } from '@/consts/types/codeFlowLab';

interface SpanViewerItem extends ViewerItem {
  text?: ChartSpanItem['text'];
}

interface Props {
  viewerItem: SpanViewerItem;
}
function ViewerSpanBlock({ viewerItem }: Props) {
  return <span style={viewerItem.styles}>{viewerItem.text}</span>;
}

export default ViewerSpanBlock;
