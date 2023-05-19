import { CSSProperties } from 'react';

export enum ChartItemType {
  button = 'button',
}

export enum ConnectionItems {
  style = 'style',
  trigger = 'trigger',
}

interface FlowScene {
  itemIds: string[];
  order: number;
}

export interface ChartItem {
  elType: ChartItemType;
  pos: { left: number; top: number };
  connectionTypeList: ConnectionItems[];
}

export interface ChartButtonItem extends ChartItem {}

export interface ChartStyleItem extends ChartItem {
  connectionIds: string[];
  styles: CSSProperties;
}

export type ChartItems = ChartButtonItem | ChartStyleItem;

export interface CodeFlowChartDoc {
  items: {
    [_itemId: string]: ChartItems;
  };
  scene: {
    [_sceneId: string]: FlowScene;
  };
}
