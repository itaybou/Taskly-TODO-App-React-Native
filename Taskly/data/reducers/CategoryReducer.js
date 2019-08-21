import { UserActionTypes, defaultCategoryDetails } from '../Constants'

const initial_state = {
    curr_cat_id: defaultCategoryDetails.id, 
    catList:[{id: defaultCategoryDetails.id, title:defaultCategoryDetails.name, color: defaultCategoryDetails.color}],
    cat_id: defaultCategoryDetails.id + 1
}

export const categories_exclude_persist = ['curr_cat_id'];

const CategoryReducer = (state = initial_state, action) => {
    switch(action.type) {
        case UserActionTypes.ADD_CAT:
            return {
                curr_cat_id: action.id,
                catList:
                [
                    ...state.catList,
                    {
                        id: action.id,
                        title: action.title,
                        color: action.color
                    }
                ],
                cat_id: ++state.cat_id
            }

        case UserActionTypes.REMOVE_CAT: 
            return { curr_cat_id: defaultCategoryDetails.id,
                    catList: state.catList.filter( cat => cat.id !== action.category.id),
                    cat_id: state.cat_id }
        
        case UserActionTypes.SWITCH_CAT:
            return {curr_cat_id: action.category.id, catList: state.catList, cat_id: state.cat_id}

        case UserActionTypes.CAT_COLOR:
            return {curr_cat_id: state.curr_cat_id,
                    catList: state.catList.map(cat => cat.id === action.category_id ? { ...cat, color: action.color} : cat),
                    cat_id: state.cat_id}
        
        case UserActionTypes.ARRANGE_CAT:
            return { curr_cat_id: state.curr_cat_id,
                    catList: action.catList,
                    cat_id: state.cat_id}

        case UserActionTypes.RENAME_CAT:
            return {curr_cat_id: state.curr_cat_id,
                    catList: state.catList.map(cat => cat.id === action.category.id ? { ...cat, title: action.name} : cat),
                    cat_id: state.cat_id}
                    
        default:
            return state;
    }
}

export default CategoryReducer;