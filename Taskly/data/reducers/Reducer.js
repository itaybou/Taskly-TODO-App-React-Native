import { combineReducers } from 'redux'
import TaskReducer from './TaskReducer'
import VisibilityReducer from './VisibilityReducer'
import CategoryReducer from './CategoryReducer'

export default Reducer = combineReducers ({
    tasks: TaskReducer,
    visibility: VisibilityReducer,
    categories: CategoryReducer
});