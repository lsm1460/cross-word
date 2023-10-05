import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import {
  EMIT_DOCUMENT_VALUE,
  SET_DELETE_ANIMATION_ID_LIST,
  SET_DELETE_TARGET_ID_LIST,
  SET_DOCUMENT_VALUE,
} from './actions';
import { Operation, SagaOperationParam } from './types';

import { RootState } from '@/reducers';
import { addHistory } from '@/src/utils/history';
import _ from 'lodash';
import { getSceneId } from '@/src/utils/content';
import { ConnectPoint } from '@/consts/types/codeFlowLab';

function* handleSetDocumentValue({ payload }: SagaOperationParam) {
  const { mainDocument }: RootState = yield select();

  let operations: Operation[] = [];

  if (!_.isArray(payload)) {
    operations = [{ ...payload }];
  } else {
    operations = _.map(payload, (operation) => ({
      ...operation,
    }));
  }

  operations = _.map(operations, (op) => {
    const beforeValue = op.key.split('.').reduce((acc, val) => (acc ? acc[val] : ''), mainDocument.contentDocument);

    return {
      ...op,
      beforeValue,
    };
  });

  yield put({ type: EMIT_DOCUMENT_VALUE, payload: operations });
}

function* handleEmitValue({ payload }: SagaOperationParam) {
  addHistory(payload);
}

function* handleDeleteBlock({ payload }: { type: string; payload: string[] }) {
  const {
    mainDocument: {
      sceneOrder,
      deleteTargetIdList,
      contentDocument: { items, itemsPos, scene },
    },
  }: RootState = yield select();
  if (deleteTargetIdList.length > 0) {
    return;
  }

  yield put({ type: SET_DELETE_ANIMATION_ID_LIST, payload });

  const selectedSceneId = getSceneId(scene, sceneOrder);
  const sceneItemIds = scene[selectedSceneId]?.itemIds || [];

  yield delay((payload.length + 1) * 100);

  const ops = [];

  const filterPoint = (_point: ConnectPoint) => !payload.includes(_point.connectParentId);

  let newChartItems = _.pickBy(items, (_item) => !payload.includes(_item.id));
  newChartItems = _.mapValues(newChartItems, (_item) => ({
    ..._item,
    connectionIds: {
      ..._item.connectionIds,
      left: [...(_item.connectionIds?.left || []).filter(filterPoint)],
      right: [...(_item.connectionIds?.right || []).filter(filterPoint)],
    },
    ...(_item.connectionVariables && {
      connectionVariables: _item.connectionVariables.map((_point) =>
        payload.includes(_point?.connectParentId) ? undefined : _point
      ),
    }),
  }));

  ops.push({
    key: 'items',
    value: newChartItems,
  });
  ops.push({
    key: 'itemsPos',
    value: _.pickBy(itemsPos, (_v, _itemId) => !payload.includes(_itemId)),
  });
  ops.push({
    key: `scene.${selectedSceneId}.itemIds`,
    value: sceneItemIds.filter((_id) => !payload.includes(_id)),
  });

  yield put({ type: SET_DELETE_ANIMATION_ID_LIST, payload: [] });
  yield put({ type: SET_DOCUMENT_VALUE, payload: ops });
}

export default function* documentSaga() {
  yield takeLatest(SET_DOCUMENT_VALUE, handleSetDocumentValue);
  yield takeLatest(EMIT_DOCUMENT_VALUE, handleEmitValue);
  yield takeEvery(SET_DELETE_TARGET_ID_LIST, handleDeleteBlock);
}
