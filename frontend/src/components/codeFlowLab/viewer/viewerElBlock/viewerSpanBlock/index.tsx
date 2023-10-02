import { ChartSpanItem, TriggerProps, ViewerItem } from '@/consts/types/codeFlowLab';
import { RootState } from '@/reducers';
import { getSceneId, getVariables } from '@/src/utils/content';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

interface SpanViewerItem extends ViewerItem {
  text?: ChartSpanItem['text'];
}

interface Props {
  viewerItem: SpanViewerItem;
  triggerProps: TriggerProps;
}
function ViewerSpanBlock({ viewerItem, triggerProps }: Props) {
  const variables = useSelector((state: RootState) => {
    const sceneId = getSceneId(state.mainDocument.contentDocument.scene, state.mainDocument.sceneOrder);

    return getVariables(sceneId, state.mainDocument.contentDocument.items);
  }, shallowEqual);

  const textVariable = useMemo(
    () => variables[viewerItem.connectionVariables[0]?.connectParentId],
    [variables, viewerItem]
  );

  return (
    <span style={viewerItem.styles} {...triggerProps}>
      {_.isUndefined(textVariable) ? viewerItem.text : textVariable}
    </span>
  );
}

export default ViewerSpanBlock;
