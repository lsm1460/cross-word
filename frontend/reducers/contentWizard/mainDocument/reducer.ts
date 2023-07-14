import { ROOT_BLOCK_ID } from '@/consts/codeFlowLab/items';
import { ChartItemType } from '@/consts/types/codeFlowLab';
import { makeNewDocument } from '@/src/utils/content';
import _ from 'lodash';
import { createReducer } from 'typesafe-actions';
import { EMIT_DOCUMENT_VALUE, RESET_DOCUMENT_VALUE, SET_DOCUMENT, SET_DOCUMENT_VALUE } from './actions';
import { DocumentAction, DocumentState, Operation } from './types';

const initialState: DocumentState = {
  contentDocument: {
    items: {
      root: {
        id: ROOT_BLOCK_ID,
        name: 'root-name',
        elType: ChartItemType.body,
        zIndex: 1,
        connectionIds: { right: ['test-id', 'test-button'] },
      },
      'test-id': {
        id: 'test-id',
        name: 'test-id-name',
        elType: ChartItemType.button,
        zIndex: 2,
        connectionIds: { left: [ROOT_BLOCK_ID], right: [] },
      },
      'test-style': {
        id: 'test-style',
        name: 'test-style-name',
        elType: ChartItemType.style,
        zIndex: 3,
        connectionIds: { left: [], right: [] },
        styles: {
          display: 'block',
        },
      },
      'test-trigger': {
        id: 'test-trigger',
        name: 'test-trigger-name',
        elType: ChartItemType.trigger,
        zIndex: 4,
        connectionIds: { left: [], right: [] },
        triggerType: 'click',
      },
      'test-function': {
        id: 'test-function',
        name: 'test-function-name',
        elType: ChartItemType.function,
        zIndex: 5,
        connectionIds: { left: [], right: [] },
      },
      'test-button': {
        id: 'test-button',
        name: 'test-button-name',
        elType: ChartItemType.button,
        zIndex: 6,
        connectionIds: { left: [ROOT_BLOCK_ID], right: [] },
      },
    },
    itemsPos: {
      root: { left: 20, top: 20 },
      'test-id': { left: 120, top: 120 },
      'test-style': { left: 80, top: 200 },
      'test-trigger': { left: 20, top: 300 },
      'test-function': { left: 120, top: 500 },
      'test-button': { left: 420, top: 220 },
    },
    scene: {
      'test-scene-01': {
        itemIds: [ROOT_BLOCK_ID, 'test-id', 'test-style', 'test-trigger', 'test-function', 'test-button'],
        order: 1,
      },
    },
  },
  sceneOrder: 1,
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
});

export default documentReducer;
