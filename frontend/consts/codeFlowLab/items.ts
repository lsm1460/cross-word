import { ChartItemType } from '../types/codeFlowLab';

export const FLOW_CHART_ITEMS_STYLE = {
  [ChartItemType.button]: {
    width: 150,
    height: 70,
    connectorPosition: [['right', 'bottom']],
    connectionTypeList: {
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
      left: [ChartItemType.button],
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
      left: [ChartItemType.button],
      right: [ChartItemType.function],
    },
  },
};

export const CONNECT_POINT_START = 15;
export const CONNECT_POINT_SIZE = 9;
export const CONNECT_POINT_GAP = 10;
