import { ChartSpanItem, TriggerProps, ViewerItem } from '@/consts/types/codeFlowLab';

interface SpanViewerItem extends ViewerItem {
  text?: ChartSpanItem['text'];
}

interface Props {
  viewerItem: SpanViewerItem;
  triggerProps: TriggerProps;
}
function ViewerSpanBlock({ viewerItem, triggerProps }: Props) {
  return (
    <span style={viewerItem.styles} {...triggerProps}>
      {viewerItem.text}
    </span>
  );
}

export default ViewerSpanBlock;
