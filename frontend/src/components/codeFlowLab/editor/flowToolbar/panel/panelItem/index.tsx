import classNames from 'classnames/bind';
import styles from './panelItem.module.scss';
const cx = classNames.bind(styles);
//
import { ChartItemType } from '@/consts/types/codeFlowLab';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getElType } from '../../../flowChart/utils';
import {
  FLOW_CHART_ITEMS_STYLE,
  FLOW_ITEM_ADDITIONAL_INFO,
  FLOW_ITEM_DEFAULT_INFO,
  ZOOM_AREA_ELEMENT_ID,
} from '@/consts/codeFlowLab/items';
import { getChartItem, getRandomId, getSceneId } from '@/src/utils/content';
import _ from 'lodash';
import { Operation, setDocumentAction, setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { RootState } from '@/reducers';

interface Props {
  itemType: ChartItemType;
}
function PanelItem({ itemType }: Props) {
  const dispatch = useDispatch();

  const { chartItems, selectedSceneId, sceneItemIds } = useSelector((state: RootState) => {
    const selectedSceneId = getSceneId(state.mainDocument.contentDocument.scene, state.mainDocument.sceneOrder);

    return {
      chartItems: state.mainDocument.contentDocument.items,
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

    const { width, height } = zoomArea.getBoundingClientRect();

    const newItemId = getRandomId();

    const newFlowItem = {
      ...FLOW_ITEM_DEFAULT_INFO,
      id: newItemId,
      name: 'test',
      elType: itemType,
      pos: {
        left: (width / 2 + parseFloat(transX)) / parseFloat(scale) || 0,
        top: (height / 2 + parseFloat(transY)) / parseFloat(scale) || 0,
      },
      zIndex: 10,
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
