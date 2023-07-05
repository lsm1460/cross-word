import { ChartItemType } from '../types/codeFlowLab';

export const CHART_ELEMENT_ITEMS = [ChartItemType.body, ChartItemType.button];

export const FLOW_CHART_ITEMS_STYLE = {
  [ChartItemType.body]: {
    width: 150,
    height: 70,
    connectionTypeList: {
      right: [ChartItemType.el, ChartItemType.style, ChartItemType.trigger],
    },
    backgroundColor: '#7b7be8',
  },
  [ChartItemType.button]: {
    width: 150,
    height: 70,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.style, ChartItemType.trigger],
    },
    backgroundColor: '#7b7be8',
  },
  [ChartItemType.style]: {
    width: 150,
    height: 100,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.style],
    },
    backgroundColor: '#2ec438',
  },
  [ChartItemType.trigger]: {
    width: 150,
    height: 100,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.function],
    },
    backgroundColor: '#e36775',
  },
  [ChartItemType.function]: {
    width: 150,
    height: 100,
    connectionTypeList: {
      left: [ChartItemType.trigger],
      right: [],
    },
    backgroundColor: '#dadada',
  },
};

export const CONNECT_POINT_START = 15;
export const CONNECT_POINT_SIZE = 15;
export const CONNECT_POINT_GAP = 4;
export const BLOCK_HEADER_SIZE = 30;
export const POINT_LIST_PADDING = 0;

export const TRIGGER_TYPE = ['click', 'hover', 'mouseup', 'mousedown', 'mouseenter', 'mouseleave'];
