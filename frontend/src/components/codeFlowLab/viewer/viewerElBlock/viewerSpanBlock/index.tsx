import { ChartSpanItem, TriggerProps, ViewerItem } from '@/consts/types/codeFlowLab';
import _ from 'lodash';
import { CSSProperties, useMemo } from 'react';

interface SpanViewerItem extends ViewerItem {
  text?: ChartSpanItem['text'];
}

interface Props {
  viewerItem: SpanViewerItem;
  triggerProps: TriggerProps;
  variables: {
    [x: string]: any;
  };
  addedStyle: CSSProperties;
}
function ViewerSpanBlock({ viewerItem, triggerProps, variables, addedStyle }: Props) {
  const textVariable = useMemo(
    () => variables[viewerItem.connectionVariables[0]?.connectParentId],
    [variables, viewerItem]
  );

  return (
    <span style={{ ...viewerItem.styles, ...addedStyle }} {...triggerProps}>
      {_.isUndefined(textVariable) ? viewerItem.text : textVariable}
    </span>
  );
}

export default ViewerSpanBlock;
