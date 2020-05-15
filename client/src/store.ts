import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';
import reducer from './reducer';
import { Store } from './shim/redux';
import { State } from './state';

const stateSanitizer = (state: State): any => {
  const {
    movement,
    hastyRemainingMs,
    containerSize,
    commentEntities,
    signEntities,
    consoleEntries,
    commentInputText,
    ...state_
  } = state;
  return state_;
};

const compose = composeWithDevTools({
  actionsBlacklist: [
    '\\[Ticker]',
    '\\[PixiStage] (up|down|left|right)',
    '\\[Console]',
    'Comments loaded from backend',
    'Console entry used',
    'Console entry released',
  ],
  stateSanitizer: stateSanitizer as any,
});

const persistWhitelist: (keyof State)[] = ['volume', 'tutorial'];

const persistConfig: PersistConfig<State> = {
  key: 'danmakucraft:root',
  storage: localStorage,
  serialize: true,
  whitelist: persistWhitelist,
  debug: __DEV__,
};

const store: Store = createStore(persistReducer(persistConfig, reducer), compose());

export const persistor = persistStore(store);

export default store;
