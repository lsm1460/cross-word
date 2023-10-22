import { TriggerProps, ViewerItem } from '@/consts/types/codeFlowLab';
import { CSSProperties } from 'react';
import ViewerElBlock from '..';

interface Props {
  viewerItem: ViewerItem;
  triggerProps: TriggerProps;
  variables: {
    [x: string]: any;
  };
  addedStyle: CSSProperties;
}
function ViewerParagraphBlock({ viewerItem, triggerProps, variables, addedStyle }: Props) {
  return (
    <p style={{ ...viewerItem.styles, ...addedStyle }} {...triggerProps}>
      {viewerItem.children.map((_item) => (
        <ViewerElBlock key={_item.id} viewerItem={_item} variables={variables} />
      ))}
    </p>
  );
}

export default ViewerParagraphBlock;
