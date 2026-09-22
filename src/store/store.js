import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import localforage from 'localforage';
import recipesReducer from './recipesSlice';
import planReducer from './planSlice';

// localforage bascule automatiquement sur IndexedDB (bien plus de marge que
// localStorage — utile si un jour vous stockez des photos de plats en base64)
localforage.config({ name: 'popote-cie' });

const rootReducer = combineReducers({
  recipes: recipesReducer,
  plan: planReducer,
});

const persistedReducer = persistReducer(
  { key: 'popote-cie-root', storage: localforage, version: 1 },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
