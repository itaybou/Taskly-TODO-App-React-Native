import { UserActionTypes, FilterTabs, defaultFilter } from '../Constants'

const initial_state = defaultFilter;

export default VisibilityReducer = (state = initial_state, action) => {
    switch(action.type) {
        case UserActionTypes.FILTER:
            return action.screen;
        default:
            return state;
    }
}