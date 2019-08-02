import { combineReducers } from 'redux'
import TaskReducer from './TaskReducer'
import VisibilityReducer from './VisibilityReducer'

export default Reducer = combineReducers ({
    tasks: TaskReducer,
    visibility: VisibilityReducer
});