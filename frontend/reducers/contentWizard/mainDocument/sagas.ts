import _ from 'lodash';
import { put, select, takeEvery } from 'redux-saga/effects';
import { EMIT_DOCUMENT_VALUE, SET_DOCUMENT_VALUE } from './actions';
import { SagaOperationParam } from './types';

import { RootState } from '@/reducers';
import { emitDocumentValueAction } from '@/reducers/contentWizard/mainDocument';
import { getDocumentValue } from '@/src/utils/content';
import { addHistory } from '@/src/utils/history';

function* handleSetDocumentValue({ payload }: SagaOperationParam) {
  const { mainDocument }: RootState = yield select();

  let operations = [];

  if (!_.isArray(payload)) {
    operations = [{ ...payload }];
  } else {
    operations = _.map(payload, (operation) => ({
      ...operation,
    }));
  }

  operations = _.map(operations, (op) => {
    const beforeValue = getDocumentValue({
      document: mainDocument.contentDocument,
      keys: op.key.split('.'),
    });

    return {
      ...op,
      beforeValue,
    };
  });

  yield put(emitDocumentValueAction(operations));
}

function* handleEmitValue({ payload }: SagaOperationParam) {
  addHistory(payload);
}

export function* documentSaga() {
  yield takeEvery(SET_DOCUMENT_VALUE, handleSetDocumentValue);
  yield takeEvery(EMIT_DOCUMENT_VALUE, handleEmitValue);
}
