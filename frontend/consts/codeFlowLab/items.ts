import { ChartItemType } from '../types/codeFlowLab';

export const CHART_ELEMENT_ITEMS = [
  ChartItemType.body,
  ChartItemType.div,
  ChartItemType.paragraph,
  ChartItemType.span,
  ChartItemType.button,
  ChartItemType.image,
];

export const FLOW_CHART_ITEMS_STYLE: {
  [_key in ChartItemType]: {
    width: number;
    height: number;
    connectionTypeList: {
      right?: ChartItemType[];
      left?: ChartItemType[];
    };
    backgroundColor: string;
  };
} = {
  [ChartItemType.body]: {
    width: 200,
    height: 70,
    connectionTypeList: {
      right: [ChartItemType.el, ChartItemType.style, ChartItemType.trigger],
    },
    backgroundColor: '#7b7be8',
  },
  [ChartItemType.button]: {
    width: 200,
    height: 70,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.span, ChartItemType.style, ChartItemType.trigger],
    },
    backgroundColor: '#7b7be8',
  },
  [ChartItemType.div]: {
    width: 200,
    height: 70,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.el, ChartItemType.style, ChartItemType.trigger],
    },
    backgroundColor: '#7b7be8',
  },
  [ChartItemType.paragraph]: {
    width: 200,
    height: 70,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.span, ChartItemType.style, ChartItemType.trigger],
    },
    backgroundColor: '#7b7be8',
  },
  [ChartItemType.span]: {
    width: 200,
    height: 70,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.style, ChartItemType.trigger],
    },
    backgroundColor: '#7b7be8',
  },
  [ChartItemType.note]: {
    width: 200,
    height: 70,
    connectionTypeList: {
      left: [],
      right: [],
    },
    backgroundColor: '#ffe980',
  },
  [ChartItemType.el]: {
    //dummy
    width: 0,
    height: 0,
    connectionTypeList: {
      left: [],
      right: [],
    },
    backgroundColor: '#7b7be8',
  },
  [ChartItemType.image]: {
    width: 200,
    height: 70,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.style, ChartItemType.trigger],
    },
    backgroundColor: '#7b7be8',
  },
  [ChartItemType.style]: {
    width: 200,
    height: 100,
    connectionTypeList: {
      left: [ChartItemType.el, ChartItemType.style],
      right: [ChartItemType.style],
    },
    backgroundColor: '#2ec438',
  },
  [ChartItemType.trigger]: {
    width: 200,
    height: 100,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.function],
    },
    backgroundColor: '#e36775',
  },
  [ChartItemType.function]: {
    width: 200,
    height: 100,
    connectionTypeList: {
      left: [ChartItemType.trigger],
      right: [],
    },
    backgroundColor: '#dadada',
  },
};

export const FLOW_ITEM_DEFAULT_INFO = {
  id: '',
  name: '',
  elType: '',
  pos: { left: 0, top: 0 },
  zIndex: 0,
  connectionIds: {},
};

export const FLOW_ITEM_ADDITIONAL_INFO = {
  [ChartItemType.style]: {
    styles: {
      display: 'block',
    },
  },
  [ChartItemType.trigger]: {
    triggerType: 'click',
  },
  [ChartItemType.span]: {
    text: '',
  },
};

export const CONNECT_POINT_START = 15;
export const CONNECT_POINT_SIZE = 15;
export const CONNECT_POINT_GAP = 4;
export const BLOCK_HEADER_SIZE = 30;
export const POINT_LIST_PADDING = 0;

export const TRIGGER_TYPE = ['click', 'hover', 'mouseup', 'mousedown', 'mouseenter', 'mouseleave'];

export const ZOOM_AREA_ELEMENT_ID = 'flowZoomArea';
export const SELECTOR_CLASS_PREFIX = 'property-select';
export const CONNECT_POINT_CLASS = 'connect-draw-point';

export const ROOT_BLOCK_ID = 'root';
