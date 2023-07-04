import { ChartItemType } from '../types/codeFlowLab';

export const CHART_ELEMENT_ITEMS = [ChartItemType.body, ChartItemType.button];

export const FLOW_CHART_ITEMS_STYLE = {
  [ChartItemType.body]: {
    width: 150,
    height: 70,
    connectorPosition: [['right', 'bottom']],
    connectionTypeList: {
      right: [ChartItemType.el, ChartItemType.style, ChartItemType.trigger],
    },
    backgroundColor: '#c2cae8',
  },
  [ChartItemType.button]: {
    width: 150,
    height: 70,
    connectorPosition: [
      ['left', 'top'],
      ['right', 'bottom'],
    ],
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.style, ChartItemType.trigger],
    },
    backgroundColor: '#c2cae8',
  },
  [ChartItemType.style]: {
    width: 150,
    height: 100,
    connectorPosition: [
      ['left', 'top'],
      ['right', 'bottom'],
    ],
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.style],
    },
    backgroundColor: '#c2e8d6',
  },
  [ChartItemType.trigger]: {
    width: 150,
    height: 100,
    connectorPosition: [
      ['left', 'top'],
      ['right', 'bottom'],
    ],
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.function],
    },
    backgroundColor: '#e8c2c2',
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
      right: [],
    },
    backgroundColor: '#dadada',
  },
};

export const CONNECT_POINT_START = 15;
export const CONNECT_POINT_SIZE = 9;
export const CONNECT_POINT_GAP = 10;

export const TRIGGER_TYPE = ['click', 'hover', 'mouseup', 'mousedown', 'mouseenter', 'mouseleave'];
