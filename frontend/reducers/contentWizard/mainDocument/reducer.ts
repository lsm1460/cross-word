import { ROOT_BLOCK_ID } from '@/consts/codeFlowLab/items';
import { ChartItemType } from '@/consts/types/codeFlowLab';
import { makeNewDocument } from '@/src/utils/content';
import _ from 'lodash';
import { createReducer } from 'typesafe-actions';
import {
  EMIT_DOCUMENT_VALUE,
  RESET_DOCUMENT_VALUE,
  SET_DELETE_ANIMATION_ID_LIST,
  SET_DELETE_TARGET_ID_LIST,
  SET_DOCUMENT,
  SET_DOCUMENT_VALUE,
} from './actions';
import { DocumentAction, DocumentState, Operation } from './types';

const initialState: DocumentState = {
  contentDocument: {
    items: {
      root: {
        id: ROOT_BLOCK_ID,
        name: 'root-name',
        elType: ChartItemType.body,
        zIndex: 1,
        connectionIds: {
          right: [
            {
              id: 'root-dot-right-0-0',
              parentId: ROOT_BLOCK_ID,
              connectId: 'test-id-dot-left-0-0',
              connectParentId: 'test-id',
            },
          ],
        },
      },
      'test-id': {
        id: 'test-id',
        name: 'test-id-name',
        elType: ChartItemType.button,
        zIndex: 2,
        connectionIds: {
          left: [
            {
              id: 'test-id-dot-left-0-0',
              parentId: 'test-id',
              connectId: 'root-dot-right-0-0',
              connectParentId: ROOT_BLOCK_ID,
            },
          ],
          right: [
            {
              id: 'test-id-dot-right-0-0',
              parentId: 'test-id',
              connectId: 'eCYYXl2M-dot-left-0-0',
              connectParentId: 'eCYYXl2M',
            },
            {
              id: 'test-id-dot-right-2-0',
              parentId: 'test-id',
              connectId: 'test-trigger-dot-left-0-0',
              connectParentId: 'test-trigger',
            },
          ],
        },
      },
      'test-trigger': {
        id: 'test-trigger',
        name: 'test-trigger-name',
        elType: ChartItemType.trigger,
        zIndex: 4,
        connectionIds: {
          left: [
            {
              id: 'test-trigger-dot-left-0-0',
              parentId: 'test-trigger',
              connectId: 'test-id-dot-right-2-0',
              connectParentId: 'test-id',
            },
          ],
          right: [
            {
              id: 'test-trigger-dot-right-0-0',
              parentId: 'test-trigger',
              connectId: 'test-function-dot-left-0-0',
              connectParentId: 'test-function',
            },
          ],
        },
        triggerType: 'click',
      },
      'test-function': {
        id: 'test-function',
        name: 'test-function-name',
        elType: ChartItemType.function,
        zIndex: 5,
        connectionIds: {
          left: [
            {
              id: 'test-function-dot-left-0-0',
              parentId: 'test-function',
              connectId: 'test-trigger-dot-right-0-0',
              connectParentId: 'test-trigger',
            },
          ],
          right: [
            {
              id: 'test-function-dot-right-0-0',
              parentId: 'test-function',
              connectId: 'lQJ488Mt-dot-left-0-0',
              connectParentId: 'lQJ488Mt',
            },
          ],
        },
      },
      eCYYXl2M: {
        id: 'eCYYXl2M',
        name: 'Span-1',
        elType: ChartItemType.span,
        pos: {
          left: 0,
          top: 0,
        },
        zIndex: 5,
        connectionIds: {
          left: [
            {
              id: 'eCYYXl2M-dot-left-0-0',
              parentId: 'eCYYXl2M',
              connectId: 'test-id-dot-right-0-0',
              connectParentId: 'test-id',
            },
          ],
          right: [],
        },
        text: 'test',
      },
      lQJ488Mt: {
        id: 'lQJ488Mt',
        name: 'Loop-1',
        elType: ChartItemType.loop,
        pos: {
          left: 0,
          top: 0,
        },
        zIndex: 6,
        connectionIds: {
          left: [
            {
              id: 'lQJ488Mt-dot-left-0-0',
              parentId: 'lQJ488Mt',
              connectId: 'test-function-dot-right-0-0',
              connectParentId: 'test-function',
            },
          ],
          right: [],
        },
        start: 0,
        end: 3,
        increase: 1,
        functionId: '',
      },
    },
    itemsPos: {
      root: { left: 24, top: 57 },
      'test-id': { left: 305, top: 39 },
      'test-style': { left: 80, top: 200 },
      'test-trigger': { left: 247, top: 283 },
      'test-function': { left: 503, top: 399 },
      'test-button': { left: 420, top: 220 },
      eCYYXl2M: { left: 639.5, top: 63.5 },
      lQJ488Mt: { left: 742.5, top: 457.5 },
    },
    scene: {
      'test-scene-01': {
        itemIds: [
          ROOT_BLOCK_ID,
          'test-id',
          'test-style',
          'test-trigger',
          'test-function',
          'test-button',
          'eCYYXl2M',
          'lQJ488Mt',
        ],
        order: 1,
      },
    },
  },
  sceneOrder: 1,
  deleteTargetIdList: [],
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
});

export default documentReducer;
