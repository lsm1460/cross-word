import { CSSProperties } from 'react';
import { TRIGGER_TYPE } from '../codeFlowLab/items';

export enum ChartItemType {
  button = 'button',
  div = 'div',
  paragraph = 'paragraph',
  span = 'span',
  image = 'image',
  style = 'style',
  trigger = 'trigger',
  function = 'function',
  body = 'body',
  el = 'element',
  note = 'note',
  console = 'console',
  loop = 'loop',
  script = 'script',
  variable = 'variable',
  if = 'if',
  condition = 'condition',
  size = 'size',
  includes = 'includes',
  indexOf = 'indexOf',
  changeValue = 'changeValue',
  addStyle = 'addStyle',
}

interface FlowScene {
  itemIds: string[];
  order: number;
}

export type ConnectPoint = {
  parentId: string;
  connectParentId: string;
  connectType: ChartItemType;
  index: number;
};

export interface ChartItem {
  id: string;
  name: string;
  elType: ChartItemType;
  zIndex: number;
  pos?: { left: number; top: number };
  connectionIds: {
    left?: ConnectPoint[];
    right?: ConnectPoint[];
  };
  connectionVariables?: ConnectPoint[];
}

export interface ChartItemPos {
  [sceneId: string]: {
    left: number;
    top: number;
  };
}

export interface ChartBodyItem extends ChartItem {
  elType: ChartItemType.body;
}

export interface ChartButtonItem extends ChartItem {
  elType: ChartItemType.button;
}

export interface ChartSpanItem extends ChartItem {
  elType: ChartItemType.span;
  text: string;
}

export interface ChartStyleItem extends ChartItem {
  elType: ChartItemType.style;
  styles: CSSProperties;
}

export interface ChartTriggerItem extends ChartItem {
  elType: ChartItemType.trigger;
  triggerType: (typeof TRIGGER_TYPE)[number];
}

export interface ChartFunctionItem extends ChartItem {
  elType: ChartItemType.function;
}

export interface ChartConsoleItem extends ChartItem {
  elType: ChartItemType.console;
  text: string;
}

export interface ChartLoopItem extends ChartItem {
  elType: ChartItemType.loop;
  loop: {
    start: number;
    end: number;
    increase: number;
  };
}

export interface ChartVariableItem extends ChartItem {
  elType: ChartItemType.variable;
  var: string;
  sceneId: string;
}

export interface ChartIfItem extends ChartItem {
  elType: ChartItemType.if;
  conditions: {
    [_posId: string]: '' | '&&' | '||';
  };
}

export interface ChartConditionItem extends ChartItem {
  elType: ChartItemType.condition;
  textList: string[];
  conditions: '==' | '!=' | '&&' | '||';
}

export interface ChartSizeItem extends ChartItem {
  elType: ChartItemType.size;
  text: string;
}

export interface ChartIncludesItem extends ChartItem {
  elType: ChartItemType.includes;
  text: string;
}

export interface ChartIndexOfItem extends ChartItem {
  elType: ChartItemType.indexOf;
  text: string;
}

export interface ChartChangeValueItem extends ChartItem {
  elType: ChartItemType.changeValue;
  operator: '=' | '+=' | '-=' | '*=' | '/=';
  isNumber: boolean;
  text: string;
  varId: string;
}

export interface ChartAddStyleItem extends ChartItem {
  elType: ChartItemType.addStyle;
  elId: string;
}

export type ChartItems =
  | ChartBodyItem
  | ChartButtonItem
  | ChartStyleItem
  | ChartTriggerItem
  | ChartFunctionItem
  | ChartSpanItem
  | ChartConsoleItem
  | ChartLoopItem
  | ChartVariableItem
  | ChartIfItem
  | ChartConditionItem
  | ChartSizeItem
  | ChartIncludesItem
  | ChartIndexOfItem
  | ChartChangeValueItem
  | ChartAddStyleItem;

export type ChartUtilsItems = ChartSizeItem | ChartIncludesItem | ChartIndexOfItem;

export interface CodeFlowChartDoc {
  items: {
    [_itemId: string]: ChartItems;
  };
  itemsPos: {
    [_itemId: string]: ChartItemPos;
  };
  scene: {
    [_sceneId: string]: FlowScene;
  };
}

export type PointPos = {
  el: HTMLElement;
  parentId: string;
  left: number;
  top: number;
  index: number;
  typeIndex: number;
  connectDir: 'right' | 'left';
  connectType: ChartItemType;
  isSlave: boolean;
  // connectionIds: string[];
};

export interface ScriptTriggerItem extends ChartTriggerItem {
  script: ScriptItem[];
}

export interface ScriptLoopItem extends ChartLoopItem {
  script: ScriptItem[];
}
export interface ScriptConsoleItem extends ChartConsoleItem {
  script: ScriptItem[];
}

export interface ScriptIfItem extends ChartIfItem {
  script: ScriptItem[];
}

export interface ScriptChangeValueItem extends ChartChangeValueItem {
  script: ScriptItem[];
}

export interface ScriptAddStyleItem extends ChartAddStyleItem {
  script: ScriptItem[];
}

export type ScriptItem =
  | ScriptTriggerItem
  | ScriptLoopItem
  | ScriptConsoleItem
  | ScriptIfItem
  | ScriptChangeValueItem
  | ScriptAddStyleItem;

export interface ViewerItem extends ChartItem {
  children: ViewerItem[];
  styles: React.CSSProperties;
  triggers: ScriptItem[];
}

export interface TriggerProps {
  onClick?: () => void;
}
