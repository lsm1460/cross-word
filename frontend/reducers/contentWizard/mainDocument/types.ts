import { CodeFlowChartDoc } from '@/consts/types/codeFlowLab';
import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

export type DocumentAction = ActionType<typeof actions>;

export type DocumentState = {
  contentDocument: CodeFlowChartDoc;
  sceneOrder: number;
  deleteTargetIdList: string[];
};

export interface Operation {
  key: string;
  value: any;
  beforeValue?: any | undefined;
  isSkip?: boolean | undefined;
}

export interface SagaOperationParam {
  type: string;
  payload: Operation | Operation[];
}
