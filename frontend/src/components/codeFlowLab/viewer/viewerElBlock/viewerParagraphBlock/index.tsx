import { ViewerItem } from '@/consts/types/codeFlowLab';
import ViewerElBlock from '..';

interface Props {
  viewerItem: ViewerItem;
}
function ViewerParagraphBlock({ viewerItem }: Props) {
  console.log('viewerItem', viewerItem);
  return (
    <p style={viewerItem.styles}>
      {viewerItem.children.map((_item) => (
        <ViewerElBlock key={_item.id} viewerItem={_item} />
      ))}
    </p>
  );
}

export default ViewerParagraphBlock;
