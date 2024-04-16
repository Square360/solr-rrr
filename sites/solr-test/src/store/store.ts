import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';

import { SolangReducer, SolangEpic } from 'solr-rrr';

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    solang: SolangReducer
  },
  middleware: () => [
    epicMiddleware
  ]
});

epicMiddleware.run(SolangEpic);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
