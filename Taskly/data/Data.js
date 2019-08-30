import { AsyncStorage } from 'react-native';
import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import TaskReducer from './reducers/TaskReducer'
import VisibilityReducer from './reducers/VisibilityReducer'
import CategoryReducer, { categories_exclude_persist } from './reducers/CategoryReducer'
import ThemeReducer from './reducers/ThemeReducer'

export const REDUCERS = {
    tasks: 'tasks',
    visibility: 'visibility',
    categories: 'categories',
    theme: 'theme'
}

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: [REDUCERS.visibility, REDUCERS.categories]
}

const categoriesPersistConfig = {
    key: 'categories',
    storage: AsyncStorage,
    blacklist: categories_exclude_persist
}

export default rootReducer = combineReducers ({
    tasks: TaskReducer,
    visibility: VisibilityReducer,
    categories: persistReducer(categoriesPersistConfig, CategoryReducer),
    theme: ThemeReducer
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const data = createStore(persistedReducer);
export const persistor = persistStore(data);