import { CSSProperties } from 'react';
import { TRIGGER_TYPE } from '../codeFlowLab/items';

export enum ChartItemType {
  button = 'button',
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
  pos: { left: number; top: number };
  zIndex: number;
  connectionIds: {
    left?: string[];
    right?: string[];
  };
}

export interface ChartBodyItem extends ChartItem {
  elType: ChartItemType.body;
}

export interface ChartButtonItem extends ChartItem {
  elType: ChartItemType.button;
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

export type ChartItems = ChartBodyItem | ChartButtonItem | ChartStyleItem | ChartTriggerItem | ChartFunctionItem;

export interface CodeFlowChartDoc {
  items: {
    [_itemId: string]: ChartItems;
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
  connectType: 'right' | 'left';
  connectionIds: string[];
  connectElType: ChartItemType;
};
