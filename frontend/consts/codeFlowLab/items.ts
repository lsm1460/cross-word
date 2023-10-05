import { ChartItemType } from '../types/codeFlowLab';

export const CHART_ELEMENT_ITEMS = [
  ChartItemType.body,
  ChartItemType.div,
  ChartItemType.paragraph,
  ChartItemType.span,
  ChartItemType.button,
  ChartItemType.image,
];

export const CHART_SCRIPT_ITEMS = [
  ChartItemType.function,
  ChartItemType.console,
  ChartItemType.loop,
  // ChartItemType.variable,
  ChartItemType.if,
];

export const FLOW_CHART_ITEMS_STYLE: {
  [_key in ChartItemType]: {
    width: number;
    height: number;
    connectionTypeList: {
      right?: ChartItemType[];
      left?: ChartItemType[];
    };
  };
} = {
  [ChartItemType.body]: {
    width: 200,
    height: 70,
    connectionTypeList: {
      right: [ChartItemType.el, ChartItemType.style, ChartItemType.trigger],
    },
  },
  [ChartItemType.button]: {
    width: 200,
    height: 70,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.span, ChartItemType.style, ChartItemType.trigger],
    },
  },
  [ChartItemType.div]: {
    width: 200,
    height: 70,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.el, ChartItemType.style, ChartItemType.trigger],
    },
  },
  [ChartItemType.paragraph]: {
    width: 200,
    height: 70,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.span, ChartItemType.style, ChartItemType.trigger],
    },
  },
  [ChartItemType.span]: {
    width: 200,
    height: 70,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.style, ChartItemType.trigger],
    },
  },
  [ChartItemType.note]: {
    width: 200,
    height: 70,
    connectionTypeList: {
      left: [],
      right: [],
    },
  },
  [ChartItemType.el]: {
    //dummy
    width: 0,
    height: 0,
    connectionTypeList: {
      left: [],
      right: [],
    },
  },
  [ChartItemType.image]: {
    width: 200,
    height: 70,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.style, ChartItemType.trigger],
    },
  },
  [ChartItemType.style]: {
    width: 200,
    height: 100,
    connectionTypeList: {
      left: [ChartItemType.el, ChartItemType.style],
      right: [ChartItemType.style],
    },
  },
  [ChartItemType.trigger]: {
    width: 200,
    height: 100,
    connectionTypeList: {
      left: [ChartItemType.el],
      right: [ChartItemType.function],
    },
  },
  [ChartItemType.script]: {
    //dummy
    width: 0,
    height: 0,
    connectionTypeList: {
      left: [],
      right: [],
    },
  },
  [ChartItemType.function]: {
    width: 200,
    height: 100,
    connectionTypeList: {
      left: [ChartItemType.trigger, ChartItemType.function],
      right: [ChartItemType.script],
    },
  },
  [ChartItemType.console]: {
    width: 200,
    height: 100,
    connectionTypeList: {
      left: [ChartItemType.script],
      right: [],
    },
  },
  [ChartItemType.loop]: {
    width: 200,
    height: 100,
    connectionTypeList: {
      left: [ChartItemType.function],
      right: [ChartItemType.function],
    },
  },
  [ChartItemType.variable]: {
    width: 200,
    height: 100,
    connectionTypeList: {
      left: [ChartItemType.variable],
      right: [],
    },
  },
  [ChartItemType.if]: {
    width: 200,
    height: 100,
    connectionTypeList: {
      left: [ChartItemType.function],
      right: [],
    },
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
    connectionVariables: [],
  },
  [ChartItemType.console]: {
    text: '',
    connectionVariables: [],
  },
  [ChartItemType.loop]: {
    loop: {
      start: 0,
      end: 3,
      increase: 1,
    },
    functionId: '',
    connectionVariables: [],
  },
  [ChartItemType.variable]: {
    var: '',
    sceneId: '',
  },
  [ChartItemType.if]: {
    connectionVariables: [],
    conditions: {},
  },
};

export const CONNECT_POINT_START = 15;
export const CONNECT_POINT_SIZE = 15;
export const CONNECT_POINT_GAP = 4;
export const BLOCK_HEADER_SIZE = 30;
export const POINT_LIST_PADDING = 0;

export const TRIGGER_TYPE = ['click', 'hover', 'mouseup', 'mousedown', 'mouseenter', 'mouseleave'];

export const ZOOM_AREA_ELEMENT_ID = 'flowZoomArea';
export const SCROLL_CLASS_PREFIX = 'property-scroll';
export const CONNECT_POINT_CLASS = 'connect-draw-point';

export const ROOT_BLOCK_ID = 'root';
