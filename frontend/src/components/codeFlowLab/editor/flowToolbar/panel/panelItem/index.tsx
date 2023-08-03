import classNames from 'classnames/bind';
import styles from './panelItem.module.scss';
const cx = classNames.bind(styles);
//
import { ZOOM_AREA_ELEMENT_ID } from '@/consts/codeFlowLab/items';
import { ChartItemType } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { Operation, setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { getBlockType, makeNewItem } from '@/src/components/codeFlowLab/editor/flowChart/utils';
import { getChartItem, getSceneId } from '@/src/utils/content';
import { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

interface Props {
  itemType: ChartItemType;
}
function PanelItem({ itemType }: Props) {
  const dispatch = useDispatch();

  const { chartItems, itemsPos, selectedSceneId, sceneItemIds } = useSelector((state: RootState) => {
    const selectedSceneId = getSceneId(state.mainDocument.contentDocument.scene, state.mainDocument.sceneOrder);

    return {
      chartItems: state.mainDocument.contentDocument.items,
      itemsPos: state.mainDocument.contentDocument.itemsPos,
      selectedSceneId,
      sceneItemIds: state.mainDocument.contentDocument.scene[selectedSceneId]?.itemIds || [],
    };
  }, shallowEqual);

  const selectedChartItem = useMemo(() => getChartItem(sceneItemIds, chartItems), [chartItems, sceneItemIds]);

  const itemDesc = {
    [ChartItemType.div]: '엘리먼트의 그룹을 만들기 위한 단위 입니다.',
    [ChartItemType.paragraph]: '텍스트를 입력하기 위한 플로우 박스 입니다.',
    [ChartItemType.span]: '텍스트를 입력하는 가장 작은 단위 입니다.',
    [ChartItemType.button]: '스크립트 기능을 실행하기 위한 플로우 박스 입니다.',
    [ChartItemType.image]: '이미지를 불러올 수 있는 플로우 박스 입니다.',
    [ChartItemType.function]: '스크립트 블럭을 만들기 위한 단위입니다.',
    [ChartItemType.loop]: '연결된 Function 블럭을 지정된 횟수 만큼 반복 실행합니다.',
    [ChartItemType.console]: '변수와 함수의 실행 여부 확인을 위해 디버깅 용도로 사용됩니다.',
  };

  const handleMakeItem = () => {
    const zoomArea = document.getElementById(ZOOM_AREA_ELEMENT_ID);

    const [newFlowItem, pos, newItemId] = makeNewItem(zoomArea, selectedChartItem, itemsPos, itemType);

    const operations: Operation[] = [
      {
        key: 'items',
        value: {
          ...chartItems,
          [newItemId]: newFlowItem,
        },
      },
      {
        key: `itemsPos`,
        value: {
          ...itemsPos,
          [newItemId]: pos,
        },
      },
      {
        key: `scene.${selectedSceneId}.itemIds`,
        value: [...sceneItemIds, newItemId],
      },
    ];

    dispatch(setDocumentValueAction(operations));
  };

  return (
    <div className={cx('panel-item')} onClick={handleMakeItem}>
      <p className={cx('panel-title', getBlockType(itemType))}>
        <span>{itemType}</span>
      </p>
      <p className={cx('panel-desc')}>{itemDesc[itemType]}</p>
    </div>
  );
}

export default PanelItem;
