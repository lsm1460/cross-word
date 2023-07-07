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
        id: 'root',
        elType: ChartItemType.body,
        pos: { left: 20, top: 20 },
        zIndex: 1,
        connectionIds: { right: ['test-id', 'test-button'] },
      },
      'test-id': {
        id: 'test-id',
        elType: ChartItemType.button,
        pos: { left: 120, top: 120 },
        zIndex: 2,
        connectionIds: { left: ['root'], right: [] },
      },
      'test-style': {
        id: 'test-style',
        elType: ChartItemType.style,
        pos: { left: 80, top: 200 },
        zIndex: 3,
        connectionIds: { left: [], right: [] },
        styles: {},
      },
      'test-trigger': {
        id: 'test-trigger',
        elType: ChartItemType.trigger,
        pos: { left: 20, top: 300 },
        zIndex: 4,
        connectionIds: { left: [], right: [] },
        triggerType: 'click',
      },
      'test-function': {
        id: 'test-function',
        elType: ChartItemType.function,
        pos: { left: 120, top: 500 },
        zIndex: 5,
        connectionIds: { left: [], right: [] },
      },
      'test-button': {
        id: 'test-button',
        elType: ChartItemType.button,
        pos: { left: 420, top: 220 },
        zIndex: 6,
        connectionIds: { left: ['root'], right: [] },
      },
    },
    scene: {
      'test-scene-01': {
        itemIds: ['root', 'test-id', 'test-style', 'test-trigger', 'test-function', 'test-button'],
        order: 1,
      },
    },
  },
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
