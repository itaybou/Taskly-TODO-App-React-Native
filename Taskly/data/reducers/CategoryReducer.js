import { UserActionTypes, defaultCategoryDetails } from '../Constants'

const CategoryReducer = (state = {curr_cat_id: defaultCategoryDetails.id, 
        catList:[{id: defaultCategoryDetails.id, title:defaultCategoryDetails.name, color: defaultCategoryDetails.color}], cat_id: defaultCategoryDetails.id + 1}, action) => {
    switch(action.type) {
        case UserActionTypes.ADD_CAT:
            return {
                catList:
                [
                    {
                        id: action.id,
                        title: action.title,
                        color: action.color
                    }, ...state.catList
                ],
                cat_id: ++state.cat_id
            }

        case UserActionTypes.REMOVE_CAT: 
            return { catList: state.catList.filter( cat => cat.id !== action.cat.id),
                    cat_id: state.cat_id }
        
        case UserActionTypes.SWITCH_CAT:
            return {curr_cat_id: action.cat.id, catList: action.catList, cat_id: action.cat_id}

        case UserActionTypes.CAT_COLOR:
            return {curr_cat_id: state.curr_cat_id,
                    catList: state.catList.map(cat => cat.id === action.category_id ? { ...cat, color: action.color} : cat),
                    cat_id: state.cat_id}
                    
        default:
            return state;
    }
}

export default CategoryReducer;