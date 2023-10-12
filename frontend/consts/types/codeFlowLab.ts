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
  | ChartConditionItem;

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

export type ScriptItem = ScriptTriggerItem | ScriptLoopItem | ScriptConsoleItem;

export interface ViewerItem extends ChartItem {
  children: ViewerItem[];
  styles: React.CSSProperties;
  triggers: ScriptItem[];
}

export interface TriggerProps {
  onClick?: () => void;
}
