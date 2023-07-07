import { CodeFlowChartDoc } from '@/consts/types/codeFlowLab';
import { createAction } from 'typesafe-actions';
import { Operation } from './types';

export const SET_DOCUMENT = 'document/SET_DOCUMENT';
export const SET_DOCUMENT_VALUE = 'document/SET_DOCUMENT_VALUE';
export const RESET_DOCUMENT_VALUE = 'document/RESET_DOCUMENT_VALUE';
export const EMIT_DOCUMENT_VALUE = 'document/EMIT_DOCUMENT_VALUE';

export const setDocumentAction = createAction(SET_DOCUMENT)<CodeFlowChartDoc>();
export const setDocumentValueAction = createAction(SET_DOCUMENT_VALUE)<Operation | Operation[]>();
export const emitDocumentValueAction = createAction(EMIT_DOCUMENT_VALUE)<Operation | Operation[]>();
export const resetDocumentValueAction = createAction(RESET_DOCUMENT_VALUE)();
