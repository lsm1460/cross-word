import { ChartItemType } from '../types/codeFlowLab';

export const CHART_ELEMENT_ITEMS = [ChartItemType.body, ChartItemType.button];

export const FLOW_CHART_ITEMS_STYLE = {
  [ChartItemType.body]: {
    width: 150,
    height: 70,
    connectorPosition: [['right', 'bottom']],
    connectionTypeList: {
      right: [...CHART_ELEMENT_ITEMS, ChartItemType.style, ChartItemType.trigger],
    },
  },
  [ChartItemType.button]: {
    width: 150,
    height: 70,
    connectorPosition: [
      ['left', 'top'],
      ['right', 'bottom'],
    ],
    connectionTypeList: {
      left: [],
      right: [ChartItemType.style, ChartItemType.trigger],
    },
  },
  [ChartItemType.style]: {
    width: 150,
    height: 100,
    connectorPosition: [
      ['left', 'top'],
      ['right', 'bottom'],
    ],
    connectionTypeList: {
      left: CHART_ELEMENT_ITEMS,
      right: [ChartItemType.style],
    },
  },
  [ChartItemType.trigger]: {
    width: 150,
    height: 100,
    connectorPosition: [
      ['left', 'top'],
      ['right', 'bottom'],
    ],
    connectionTypeList: {
      left: CHART_ELEMENT_ITEMS,
      right: [ChartItemType.function],
    },
  },
  [ChartItemType.function]: {
    width: 150,
    height: 100,
    connectorPosition: [
      ['left', 'top'],
      ['right', 'bottom'],
    ],
    connectionTypeList: {
      left: [ChartItemType.trigger],
    },
  },
};

export const CONNECT_POINT_START = 15;
export const CONNECT_POINT_SIZE = 9;
export const CONNECT_POINT_GAP = 10;

export const TRIGGER_TYPE = ['click', 'hover', 'mouseup', 'mousedown', 'mouseenter', 'mouseleave'];
