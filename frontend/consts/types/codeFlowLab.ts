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
}

interface FlowScene {
  itemIds: string[];
  order: number;
}

export interface ChartItem {
  id: string;
  name: string;
  elType: ChartItemType;
  zIndex: number;
  pos?: { left: number; top: number };
  connectionIds: {
    left?: string[];
    right?: string[];
  };
}

export interface ChartItemPos {
  left: number;
  top: number;
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

export type ChartItems =
  | ChartBodyItem
  | ChartButtonItem
  | ChartStyleItem
  | ChartTriggerItem
  | ChartFunctionItem
  | ChartSpanItem;

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
  id: string;
  left: number;
  top: number;
  index: number;
  typeIndex: number;
  connectType: 'right' | 'left';
  connectionIds: string[];
  connectElType: ChartItemType;
};

export interface ViewerItem extends ChartItem {
  children: ViewerItem[];
  styles: React.CSSProperties;
}
