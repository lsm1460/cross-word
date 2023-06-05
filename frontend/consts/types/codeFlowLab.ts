import { CSSProperties } from 'react';

export enum ChartItemType {
  button = 'button',
  style = 'style',
  trigger = 'trigger',
  function = 'function',
}

interface FlowScene {
  itemIds: string[];
  order: number;
}

export interface ChartItem {
  id: string;
  elType: ChartItemType;
  pos: { left: number; top: number };
  zIndex: number;
  connectionIds: {
    left?: string[];
    right?: string[];
  };
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
}

export type ChartItems = ChartButtonItem | ChartStyleItem | ChartTriggerItem;

export interface CodeFlowChartDoc {
  items: {
    [_itemId: string]: ChartItems;
  };
  scene: {
    [_sceneId: string]: FlowScene;
  };
}

export type PointPos = { id: string; left: number; top: number; index: number; connectType: 'right' | 'left' };
