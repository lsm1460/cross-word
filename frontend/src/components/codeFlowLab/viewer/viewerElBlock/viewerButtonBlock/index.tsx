import { TriggerProps, ViewerItem } from '@/consts/types/codeFlowLab';
import ViewerElBlock from '..';

interface Props {
  viewerItem: ViewerItem;
  triggerProps: TriggerProps;
}
function ViewerButtonBlock({ viewerItem, triggerProps }: Props) {
  return (
    <button style={viewerItem.styles} {...triggerProps}>
      {viewerItem.children.map((_item) => (
        <ViewerElBlock key={_item.id} viewerItem={_item} />
      ))}
    </button>
  );
}

export default ViewerButtonBlock;
