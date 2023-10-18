import { TriggerProps, ViewerItem } from '@/consts/types/codeFlowLab';
import ViewerElBlock from '..';

interface Props {
  viewerItem: ViewerItem;
  triggerProps: TriggerProps;
  variables: {
    [x: string]: any;
  };
}
function ViewerButtonBlock({ viewerItem, triggerProps, variables }: Props) {
  return (
    <button style={viewerItem.styles} {...triggerProps}>
      {viewerItem.children.map((_item) => (
        <ViewerElBlock key={_item.id} viewerItem={_item} variables={variables} />
      ))}
    </button>
  );
}

export default ViewerButtonBlock;
