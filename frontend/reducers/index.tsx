import { combineReducers } from 'redux';

import { all } from 'redux-saga/effects';
import { documentSaga, mainDocumentReducer } from './contentWizard';

const rootReducer = combineReducers({
  mainDocument: mainDocumentReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
  yield all([documentSaga()]);
}
