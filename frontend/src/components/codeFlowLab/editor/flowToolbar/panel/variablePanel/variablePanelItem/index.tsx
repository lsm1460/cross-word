import classNames from 'classnames/bind';
import styles from './variablePanelItem.module.scss';
const cx = classNames.bind(styles);
//
import { ChartVariableItem } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { getSceneId } from '@/src/utils/content';
import { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import TextEditBlock from '../../../../flowChart/chartItem/propertiesEditBlock/textEditBlock';
import { Operation, setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';

interface Props {
  chartItem: ChartVariableItem;
}
function VariablePanelItem({ chartItem }: Props) {
  const dispatch = useDispatch();

  const { sceneId, flowScene, flowItemsPos } = useSelector((state: RootState) => {
    const sceneId = getSceneId(state.mainDocument.contentDocument.scene, state.mainDocument.sceneOrder);

    return {
      sceneId,
      sceneOrder: state.mainDocument.sceneOrder,
      flowScene: state.mainDocument.contentDocument.scene,
      flowItemsPos: state.mainDocument.contentDocument.itemsPos,
    };
  }, shallowEqual);

  const sceneOrderList = useMemo(
    () =>
      Object.values(flowScene).reduce((_acc, _cur) => {
        if (_cur.itemIds.includes(chartItem.id)) {
          return [..._acc, _cur.order];
        }

        return _acc;
      }, [] as number[]),
    [flowScene]
  );

  const handleAddItemToCurrentScene = () => {
    if (flowScene[sceneId].itemIds.includes(chartItem.id)) {
      return;
    }

    const _pos = Object.values(flowItemsPos[chartItem.id])[0];

    const operation: Operation[] = [
      {
        key: `itemsPos.${chartItem.id}`,
        value: {
          ...flowItemsPos[chartItem.id],
          [sceneId]: _pos,
        },
      },
      {
        key: `scene.${sceneId}.itemIds`,
        value: [...flowScene[sceneId].itemIds, chartItem.id],
      },
    ];
    dispatch(setDocumentValueAction(operation));
  };

  return (
    <div className={cx('panel-item')} onClick={handleAddItemToCurrentScene}>
      <p className={cx('panel-title', chartItem.elType)}>
        <span>{chartItem.name}</span>
      </p>
      <div className={cx('panel-desc')}>
        <TextEditBlock id={chartItem.id} text={chartItem.var} propertyKey="var" />

        <p className={cx('scene-list-title')}>used scene index list</p>
        <ul className={cx('scene-list')}>
          {sceneOrderList.map((_order) => (
            <li key={_order}>scene-{_order}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default VariablePanelItem;
