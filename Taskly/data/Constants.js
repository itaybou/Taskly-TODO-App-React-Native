import { Dimensions, Platform } from "react-native";

export const FilterTabs = {
    ALL: 'All',
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
};

export const UserActionTypes = {
    ADD: 'ADD',
    TOGGLE: 'TOGGLE',
    REMOVE: 'REMOVE',
    UNDO_REMOVE: 'UNDO_REMOVE',
    IMPORTANCE: 'SET_TASK_IMPORTANCE',
    DUE_DATE: 'SET_TASK_DUE_DATE',
    FILTER: 'FILTER_TASKS',
    SET_NOTIFICATION: 'SET_TASK_NOTIFICATION',
    SORT: 'SORT_TASKS',
    CLEAR: 'CLEAR_COMPLETED',
    UNDO_CLEAR: 'UNDO_CLEAR_COMPLETED',
    ADD_CAT: 'ADD_CATEGORY',
    REMOVE_CAT: 'REMOVE_CATEGORY',
    SWITCH_CAT: 'SWITCH_CATEGORY',
    CAT_COLOR: 'CHANGE_CATEGORY_COLOR',
    ARRANGE_CAT: 'ARRANGE_CATEGORIES',
    CHANGE_THEME: 'CHANGE_THEME'
}

export const SCREENS = {
    TASKS: 'Tasks',
    DETAILS: 'Details',
    EDIT_TASK: 'Edit_Task'
}

export const screens = ['Tasks', 'Details', 'Edit_Task'];

export const additionalScreens = screens.splice(1);

export const defaultCategoryDetails = {
    id: 0,
    name: 'All Tasks',
    color: 'transparent'
}

export const isIOS = Platform.OS === 'ios';
export const isANDROID = Platform.OS === 'android';

export const snackBarTimeout = 3500; // Timeout in milliseconds
export const maxTaskImportance = 10; // Max importance (range is 0 to maxTaskImportance)
export const defaultCategoryColor = '#FFE27C';
export const maxCategoryNameLength = 20;
export const maxTaskTitleLength = 40;
export const TabCount = 3;
export const windowWidth = Dimensions.get("window").width;
export const defaultFilter = FilterTabs.ALL;