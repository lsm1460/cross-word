import { CHART_ELEMENT_ITEMS } from '@/consts/codeFlowLab/items';
import { RootState } from '@/reducers';
import { setDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { getChartItem, getSceneId } from '@/src/utils/content';
import _ from 'lodash';
import { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PropertyBlock from '../propertyBlock';

interface Props {
  id: string;
  elId: string;
}
function IdSelectBlock({ id, elId }: Props) {
  const dispatch = useDispatch();

  const { chartItems, sceneItemIds } = useSelector((state: RootState) => {
    const sceneId = getSceneId(state.mainDocument.contentDocument.scene, state.mainDocument.sceneOrder);

    return {
      sceneId,
      sceneOrder: state.mainDocument.sceneOrder,
      chartItems: state.mainDocument.contentDocument.items,
      sceneItemIds: state.mainDocument.contentDocument.scene[sceneId]?.itemIds || [],
    };
  }, shallowEqual);

  const valueList = useMemo(() => {
    const selectedChartItem = getChartItem(sceneItemIds, chartItems);
    const elChartItem = _.pickBy(selectedChartItem, (_item) => CHART_ELEMENT_ITEMS.includes(_item.elType));

    return _.map(elChartItem, (_item) => ({ value: _item.id, label: _item.name }));
  }, [chartItems, sceneItemIds]);

  const onChangeValue = (_key: string, _id: string | number) => {
    dispatch(setDocumentValueAction({ key: `items.${id}.elId`, value: _id }));
  };

  return (
    <div>
      <PropertyBlock id={id} propertyKey={'element'} value={elId} onChangeValue={onChangeValue} valueList={valueList} />
    </div>
  );
}

export default IdSelectBlock;
