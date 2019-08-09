import { UserActionTypes } from '../Constants'
import { THEME_TYPE } from '../Theme'

const initial_state = THEME_TYPE.LIGHT;

export default ThemeReducer = (state = initial_state, action) => {
    switch(action.type) {
        case UserActionTypes.CHANGE_THEME: {
            return action.theme;
        }
        default:
            return state;
    }
}