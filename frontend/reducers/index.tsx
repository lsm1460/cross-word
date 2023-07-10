import { combineReducers } from 'redux';

import { all } from 'redux-saga/effects';
import { mainDocumentReducer } from './contentWizard';
import { documentSaga } from './contentWizard/mainDocument';

const rootReducer = combineReducers({
  mainDocument: mainDocumentReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
  yield all([documentSaga()]);
}
