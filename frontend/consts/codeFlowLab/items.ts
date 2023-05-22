import { ChartItemType } from '../types/codeFlowLab';

export const FLOW_CHART_ITEMS_STYLE = {
  [ChartItemType.button]: {
    width: 150,
    height: 70,
    connectorPosition: ['bottom', 'right'],
  },
  [ChartItemType.style]: {
    width: 150,
    height: 100,
    connectorPosition: ['top', 'left'],
  },
} as const;

export const CONNECT_POINT_START = 15;
export const CONNECT_POINT_SIZE = 9;
export const CONNECT_POINT_GAP = 10;
