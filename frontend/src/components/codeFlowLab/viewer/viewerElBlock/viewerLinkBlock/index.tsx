import { ChartLinkItem, TriggerProps, ViewerItem } from '@/consts/types/codeFlowLab';
import { CSSProperties } from 'react';
import ViewerElBlock from '..';

interface LinkViewerItem extends ViewerItem {
  link?: ChartLinkItem['link'];
}

interface Props {
  viewerItem: LinkViewerItem;
  triggerProps: TriggerProps;
  variables: {
    [x: string]: any;
  };
  addedStyle: CSSProperties;
}
function ViewerLinkBlock({ viewerItem, triggerProps, variables, addedStyle }: Props) {
  return (
    <a style={{ ...viewerItem.styles, ...addedStyle }} {...triggerProps} href={viewerItem.link} target="_blank">
      {viewerItem.children.map((_item) => (
        <ViewerElBlock key={_item.id} viewerItem={_item} variables={variables} />
      ))}
    </a>
  );
}

export default ViewerLinkBlock;
