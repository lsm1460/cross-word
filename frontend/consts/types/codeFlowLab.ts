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
  id: string;
  elType: ChartItemType;
  pos: { left: number; top: number };
  zIndex: number;
  connectionTypeList: ConnectionItems[];
  connectionIds: string[];
}

export interface ChartButtonItem extends ChartItem {}

export interface ChartStyleItem extends ChartItem {
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
