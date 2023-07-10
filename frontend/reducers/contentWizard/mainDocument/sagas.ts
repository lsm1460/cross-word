import { put, select, takeLatest } from 'redux-saga/effects';
import { EMIT_DOCUMENT_VALUE, SET_DOCUMENT_VALUE } from './actions';
import { Operation, SagaOperationParam } from './types';

import { RootState } from '@/reducers';
import { addHistory } from '@/src/utils/history';
import _ from 'lodash';

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

export function* documentSaga() {
  yield takeLatest(SET_DOCUMENT_VALUE, handleSetDocumentValue);
  yield takeLatest(EMIT_DOCUMENT_VALUE, handleEmitValue);
}
