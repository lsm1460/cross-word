import { ViewerItem } from '@/consts/types/codeFlowLab';
import ViewerElBlock from '..';

interface Props {
  viewerItem: ViewerItem;
}
function ViewerDivBlock({ viewerItem }: Props) {
  return (
    <div style={viewerItem.styles}>
      {viewerItem.children.map((_item) => (
        <ViewerElBlock key={_item.id} viewerItem={_item} />
      ))}
    </div>
  );
}

export default ViewerDivBlock;
