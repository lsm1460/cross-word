import { ROOT_BLOCK_ID } from '@/consts/codeFlowLab/items';
import { ChartItemType } from '@/consts/types/codeFlowLab';
import { makeNewDocument } from '@/src/utils/content';
import _ from 'lodash';
import { createReducer } from 'typesafe-actions';
import {
  EMIT_DOCUMENT_VALUE,
  RESET_DOCUMENT_VALUE,
  RESET_OPTION_MODAL_INFO,
  SET_DELETE_ANIMATION_ID_LIST,
  SET_DELETE_TARGET_ID_LIST,
  SET_DOCUMENT,
  SET_DOCUMENT_VALUE,
  SET_FLOW_LOG,
  SET_OPTION_MODAL_INFO,
  SET_SCENE_ORDER,
} from './actions';
import { DocumentAction, DocumentState, Operation } from './types';

const initialState: DocumentState = {
  contentDocument: {
    items: {
      [`${ROOT_BLOCK_ID}-1`]: {
        id: `${ROOT_BLOCK_ID}-1`,
        name: 'root-name',
        elType: ChartItemType.body,
        zIndex: 1,
        connectionIds: {
          right: [],
        },
      },
    },
    itemsPos: {
      [`${ROOT_BLOCK_ID}-1`]: { 'origin-scene': { left: 24, top: 57 } },
    },
    scene: {
      'origin-scene': {
        itemIds: [`${ROOT_BLOCK_ID}-1`],
        order: 1,
      },
    },
  },
  sceneOrder: 1,
  deleteTargetIdList: [],
  flowLogList: [],
  selectModal: null,
};

const documentReducer = createReducer<DocumentState, DocumentAction>(initialState, {
  [SET_DOCUMENT]: (state, { payload }) => ({
    ...state,
    contentDocument: payload,
  }),
  [SET_DOCUMENT_VALUE]: (state) => state,
  [EMIT_DOCUMENT_VALUE]: (state, { payload }) => {
    let operations = _.map(payload, (operation: Operation) => ({
      ...operation,
    }));

    const newDocument = _.reduce(
      operations,
      (document, op) =>
        makeNewDocument({
          document,
          keys: op.key.split('.'),
          value: op.value,
        }),
      state.contentDocument
    );

    return {
      ...state,
      contentDocument: newDocument,
    };
  },
  [RESET_DOCUMENT_VALUE]: (state) => initialState,
  [SET_DELETE_TARGET_ID_LIST]: (state) => state,
  [SET_DELETE_ANIMATION_ID_LIST]: (state, { payload }) => ({ ...state, deleteTargetIdList: payload }),
  [SET_SCENE_ORDER]: (state, { payload: _order }) => ({ ...state, sceneOrder: _order }),
  [SET_FLOW_LOG]: (state, { payload }) => {
    const logList = [...state.flowLogList, payload];
    logList.slice(-50, state.flowLogList.length);

    return {
      ...state,
      flowLogList: logList,
    };
  },
  [SET_OPTION_MODAL_INFO]: (state, { payload: selectModal }) => ({ ...state, selectModal }),
  [RESET_OPTION_MODAL_INFO]: (state) => ({ ...state, selectModal: null }),
});

export default documentReducer;
