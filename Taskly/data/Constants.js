import { Dimensions, Platform } from "react-native";

export const VERSION = 'Beta 0.0.2';
export const GITHUB = 'github.com/itaybou';

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
    CHANGE_TASK_CAT: 'CHANGE_TASK_CATEGORY',
    SET_TASK_DESCRIPTION: 'SET_TASK, DESCRIPTION',
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
    RENAME_CAT: 'RENAME_CATEGORY',
    CHANGE_THEME: 'CHANGE_THEME',
    CHANGE_TASK_TITLE: 'CHANGE_TASK_TITLE',
    MOVE_TASKS: 'MOVE_TASKS_CATEGORY',
    REMOVE_ALL: 'REMOVE_ALL_TASKS_CATEGORY'
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

export const notification_ahead_times = [
    {
        label: 'Same time',
        value: 0
    },
    {
        label: '30 seconds',
        value: 30000
    },
    {
        label: '1 minute',
        value: 60000
    },
    {
        label: '5 minutes',
        value: 300000
    },
    {
        label: '10 minutes',
        value: 600000
    },
    {
        label: '30 minutes',
        value: 1800000
    },
    {
        label: '45 minutes',
        value: 2700000
    },
    {
        label: '1 hour',
        value: 3600000
    },
    {
        label: '2 hours',
        value: 7200000
    },
    {
        label: '5 hours',
        value: 18000000
    },
    {
        label: '12 hours',
        value: 43200000
    },
    {
        label: '1 day',
        value: 86400000
    },
    {
        label: '2 days',
        value: 172800000
    },
    {
        label: '1 week',
        value: 604800000
    },
    {
        label: '2 weeks',
        value: 1209600000
    },
    {
        label: '4 weeks',
        value: 2419200000
    },
]

export const isIOS = Platform.OS === 'ios';
export const isANDROID = Platform.OS === 'android';

export const snackBarTimeout = 3500; // Timeout in milliseconds
export const maxTaskImportance = 10; // Max importance (range is 0 to maxTaskImportance)
export const defaultCategoryColor = '#FFE27C';
export const maxCategoryNameLength = 20;
export const maxTaskTitleLength = 60;
export const maxDescriptionLength = 200;
export const TabCount = 3;
export const windowWidth = Dimensions.get("window").width;
export const defaultFilter = FilterTabs.ALL;
export const SHARE_APPS = ['WhatsApp', 'Gmail', 'SMS'];