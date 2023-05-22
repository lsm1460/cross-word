import { CSSProperties } from 'react';

export enum ChartItemType {
  button = 'button',
  style = 'style',
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
  connectionIds: string[];
}

export interface ChartButtonItem extends ChartItem {
  connectionTypeList: ConnectionItems[];
}

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

export type PointPos = { id: string; left: number; top: number; index: number };
