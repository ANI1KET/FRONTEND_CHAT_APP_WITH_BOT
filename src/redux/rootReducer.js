import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';

import appReducer from './slices/app';
import audioCallReducer from './slices/audioCall';
import videoCallReducer from './slices/videoCall';
import authReducer from './slices/auth';
import conversationReducer from './slices/conversation';

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  keyPrefix: 'redux-',
  // blacklist: ['app']
  //   whitelist: [],
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  conversation: conversationReducer,
  audioCall: audioCallReducer,
  videoCall: videoCallReducer,
});

export { rootPersistConfig, rootReducer };
