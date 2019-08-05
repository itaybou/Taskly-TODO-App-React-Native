import { Dimensions } from "react-native";

export const FilterTabs = {
    ALL: 'All',
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
};

export const UserActionTypes = {
    ADD: 'ADD',
    TOGGLE: 'TOGGLE',
    REMOVE: 'REMOVE',
    RATING: 'RATE_TASK',
    FILTER: 'FILTER_TASKS',
    SORT: 'SORT_TASKS',
    CLEAR: 'CLEAR_COMPLETED',
    ADD_CAT: 'ADD_CATEGORY',
    REMOVE_CAT: 'REMOVE_CATEGORY',
    SWITCH_CAT: 'SWITCH_CATEGORY',
    CAT_COLOR: 'CHANGE_CATEGORY_COLOR'
}

export const defaultCategoryDetails = {
    id: 0,
    name: 'All Tasks',
    color: 'transparent'
}

export const defaultCategoryColor = '#DDDDDD';
export const colorPicks = ['#bada55', '#f7347a', '#ffa500', '#800000', '#008080', '#ffff66', '#008000', '#7fffd4',
    '#66cdaa', '#ff4040', '#8a2be2', '#6897bb', '#dddddd', '#ff6666', '#333333', '#ffd027', '#00ced1', '#4ca3dd', '#9B1B30', '#797B3A', '#6B5B95']
export const maxTaskTitleLength = 40;
export const TabCount = 3;
export const windowWidth = Dimensions.get("window").width;
export const defaultScreen = FilterTabs.ALL;