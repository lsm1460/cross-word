import classNames from 'classnames/bind';
import styles from './panelItem.module.scss';
const cx = classNames.bind(styles);
//
import {
  FLOW_CHART_ITEMS_STYLE,
  FLOW_ITEM_ADDITIONAL_INFO,
  FLOW_ITEM_DEFAULT_INFO,
  ZOOM_AREA_ELEMENT_ID,
} from '@/consts/codeFlowLab/items';
import { ChartItemType } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { Operation, setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { getChartItem, getRandomId, getSceneId } from '@/src/utils/content';
import _ from 'lodash';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getElType } from '@/src/components/codeFlowLab/editor/flowChart/utils';

interface Props {
  itemType: ChartItemType;
}
function PanelItem({ itemType }: Props) {
  const dispatch = useDispatch();

  const { chartItems, selectedChartItems, selectedSceneId, sceneItemIds } = useSelector((state: RootState) => {
    const selectedSceneId = getSceneId(state.mainDocument.contentDocument.scene, state.mainDocument.sceneOrder);

    return {
      chartItems: state.mainDocument.contentDocument.items,
      selectedChartItems: getChartItem(state.mainDocument),
      selectedSceneId,
      sceneItemIds: state.mainDocument.contentDocument.scene[selectedSceneId]?.itemIds || [],
    };
  }, shallowEqual);

  const itemDesc = {
    [ChartItemType.div]: '엘리먼트의 그룹을 만들기 위한 단위 입니다.',
    [ChartItemType.text]: '텍스트를 입력하기 위한 플로우 박스 입니다.',
    [ChartItemType.button]: '스크립트 기능을 실행하기 위한 플로우 박스 입니다.',
    [ChartItemType.image]: '이미지를 불러올 수 있는 플로우 박스 입니다.',
  };

  const handleMakeItem = () => {
    const zoomArea = document.getElementById(ZOOM_AREA_ELEMENT_ID);

    const { scale, transX, transY } = zoomArea.dataset;

    const { width, height } = zoomArea.parentElement.getBoundingClientRect();

    const newItemId = getRandomId();

    const itemList = Object.values(selectedChartItems);
    const lastEl = itemList[itemList.length - 1];
    const itemSize = _.filter(itemList, (_item) => _item.elType === itemType).length;

    let pos = {
      left: width / parseFloat(scale) / 2 - parseFloat(transX),
      top: height / parseFloat(scale) / 2 - parseFloat(transY),
    };

    if (lastEl.pos.left === pos.left && lastEl.pos.top === pos.top) {
      pos = {
        left: pos.left + 10,
        top: pos.top + 10,
      };
    }

    const newFlowItem = {
      ...FLOW_ITEM_DEFAULT_INFO,
      id: newItemId,
      name: `${itemType.replace(/\b[a-z]/g, (char) => char.toUpperCase())}-${itemSize + 1}`,
      elType: itemType,
      pos,
      zIndex: itemList.length + 1,
      connectionIds: _.mapValues(FLOW_CHART_ITEMS_STYLE[itemType].connectionTypeList, () => []),
      ...(FLOW_ITEM_ADDITIONAL_INFO[itemType] && FLOW_ITEM_ADDITIONAL_INFO[itemType]),
    };

    const operations: Operation[] = [
      {
        key: 'items',
        value: {
          ...chartItems,
          [newItemId]: newFlowItem,
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
      <p className={cx('panel-title', getElType(itemType))}>
        <span>{itemType}</span>
      </p>
      <p className={cx('panel-desc')}>{itemDesc[itemType]}</p>
    </div>
  );
}

export default PanelItem;
