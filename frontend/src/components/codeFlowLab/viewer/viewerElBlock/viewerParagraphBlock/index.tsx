import { TriggerProps, ViewerItem } from '@/consts/types/codeFlowLab';
import ViewerElBlock from '..';

interface Props {
  viewerItem: ViewerItem;
  triggerProps: TriggerProps;
}
function ViewerParagraphBlock({ viewerItem, triggerProps }: Props) {
  return (
    <p style={viewerItem.styles} {...triggerProps}>
      {viewerItem.children.map((_item) => (
        <ViewerElBlock key={_item.id} viewerItem={_item} />
      ))}
    </p>
  );
}

export default ViewerParagraphBlock;
