import { CodeFlowChartDoc } from '@/consts/types/codeFlowLab';
import { createAction } from 'typesafe-actions';
import { FlowLog, Operation, SelectModal } from './types';
import { CSSProperties } from 'react';

export const SET_DOCUMENT = 'document/SET_DOCUMENT';
export const SET_DOCUMENT_VALUE = 'document/SET_DOCUMENT_VALUE';
export const RESET_DOCUMENT_VALUE = 'document/RESET_DOCUMENT_VALUE';
export const EMIT_DOCUMENT_VALUE = 'document/EMIT_DOCUMENT_VALUE';
export const SET_SCENE_ORDER = 'document/SET_SCENE_ORDER';
export const SET_DELETE_TARGET_ID_LIST = 'document/SET_DELETE_TARGET_ID_LIST';
export const SET_DELETE_ANIMATION_ID_LIST = 'document/SET_DELETE_ANIMATION_ID_LIST';
export const SET_FLOW_LOG = 'document/SET_FLOW_LOG';
export const RESET_FLOW_LOG = 'document/RESET_FLOW_LOG';
export const SET_OPTION_MODAL_INFO = 'document/SET_OPTION_MODAL_INFO';
export const RESET_OPTION_MODAL_INFO = 'document/RESET_OPTION_MODAL_INFO';
export const SET_ADDED_STYLES = 'document/SET_ADDED_STYLES';
export const SET_REMOVE_STYLES = 'document/SET_REMOVE_STYLES';
export const SET_TOGGLE_STYLES = 'document/SET_TOGGLE_STYLES';

export const setDocumentAction = createAction(SET_DOCUMENT)<CodeFlowChartDoc>();
export const setDocumentValueAction = createAction(SET_DOCUMENT_VALUE)<Operation | Operation[]>();
export const emitDocumentValueAction = createAction(EMIT_DOCUMENT_VALUE)<Operation | Operation[]>();
export const resetDocumentValueAction = createAction(RESET_DOCUMENT_VALUE)();
export const setSceneOrderAction = createAction(SET_SCENE_ORDER)<number>();
export const setDeleteTargetIdListAction = createAction(SET_DELETE_TARGET_ID_LIST)<string[]>();
export const setDeleteAnimationIdListAction = createAction(SET_DELETE_ANIMATION_ID_LIST)<string[]>();
export const setFlowLogAction = createAction(SET_FLOW_LOG)<FlowLog>();
export const resetFlowLogAction = createAction(RESET_FLOW_LOG)();
export const setOptionModalInfoAction = createAction(SET_OPTION_MODAL_INFO)<SelectModal>();
export const resetOptionModalInfoAction = createAction(RESET_OPTION_MODAL_INFO)();
export const setAddedStylesAction = createAction(SET_ADDED_STYLES)<{ id: string; style: CSSProperties }>();
export const setRemoveStylesAction = createAction(SET_REMOVE_STYLES)<{ id: string; style: CSSProperties }>();
export const setToggleStylesAction = createAction(SET_TOGGLE_STYLES)<{ id: string; style: CSSProperties }>();
