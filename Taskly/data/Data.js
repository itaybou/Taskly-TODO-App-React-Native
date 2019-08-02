import React from 'react';
import { AsyncStorage } from 'react-native';
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import Reducer from './reducers/Reducer'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, Reducer);

export const data = createStore(persistedReducer);
export const persistor = persistStore(data);