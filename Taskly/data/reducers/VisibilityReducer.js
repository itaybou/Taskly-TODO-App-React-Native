import { UserActionTypes, FilterTabs } from '../Constants'

export default VisibilityReducer = (state = FilterTabs.ALL, action) => {
    switch(action.type) {
        case UserActionTypes.FILTER:
            return action.screen;
        default:
            return state;
    }
}