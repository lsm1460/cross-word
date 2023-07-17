import { ViewerItem } from '@/consts/types/codeFlowLab';
import ViewerElBlock from '..';

interface Props {
  viewerItem: ViewerItem;
}
function ViewerButtonBlock({ viewerItem }: Props) {
  return (
    <button style={viewerItem.styles}>
      {viewerItem.children.map((_item) => (
        <ViewerElBlock key={_item.id} viewerItem={_item} />
      ))}
    </button>
  );
}

export default ViewerButtonBlock;
