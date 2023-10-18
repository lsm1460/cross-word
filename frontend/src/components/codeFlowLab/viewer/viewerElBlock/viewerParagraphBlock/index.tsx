import { TriggerProps, ViewerItem } from '@/consts/types/codeFlowLab';
import ViewerElBlock from '..';

interface Props {
  viewerItem: ViewerItem;
  triggerProps: TriggerProps;
  variables: {
    [x: string]: any;
  };
}
function ViewerParagraphBlock({ viewerItem, triggerProps, variables }: Props) {
  return (
    <p style={viewerItem.styles} {...triggerProps}>
      {viewerItem.children.map((_item) => (
        <ViewerElBlock key={_item.id} viewerItem={_item} variables={variables} />
      ))}
    </p>
  );
}

export default ViewerParagraphBlock;
