import { UserActionTypes } from '../Constants'

const getCurrentDateFormatted = (datetime) => {
    const twoDigitFormat = (number) => (number <= 9) ? '0' + number : number;
    var date = new Date();
    var day = date.getDate(); //Current Date
    var month = date.getMonth() + 1; //Current Month
    var year = date.getFullYear(); //Current Year
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var formattedDate = twoDigitFormat(day) + '/' + twoDigitFormat(month) + '/' + year;

    return datetime ? formattedDate + (' ' + twoDigitFormat(hour) + ":" + twoDigitFormat(minutes)) : formattedDate;
}

//User actions
export const addTask = (title, task_id, cat_id) => {
    return ({
        type: UserActionTypes.ADD,
        id: task_id,
        created_date: getCurrentDateFormatted(true),
        due_date: '',
        completed_date: '',
        description: '',
        importance: 0,
        category_id: cat_id,
        notification: {
            notification_id: null,
            notify_ahead: 0
        },
        title
})};

export const removeTask = (task) => {
    return ({
    type: UserActionTypes.REMOVE,
    task
})};

export const undoRemoveTask = (indexedTask) => {
    return ({
        type: UserActionTypes.UNDO_REMOVE,
        indexedTask
})};

export const toggleCompleted = (task) => {
    return ({
    type: UserActionTypes.TOGGLE,
    completed_date: task.completed ? '' : getCurrentDateFormatted(true),
    task
})};

export const setTaskNotification = (task, notification_id, notify_ahead) => {
    return ({
        type: UserActionTypes.SET_NOTIFICATION,
        notification_id,
        notify_ahead,
        task
})};

export const addTaskImportance = (task) => {
    return ({
    type: UserActionTypes.IMPORTANCE,
    task
})};

export const setTaskImportance = (task, importance) => {
    return ({
    type: UserActionTypes.IMPORTANCE,
    task,
    importance
})};

export const setTaskDueDate = (task, date) => {
    return ({
    type: UserActionTypes.DUE_DATE,
    task,
    date
})};

export const changeVisibility = (screen) => {
    return ({
    type: UserActionTypes.FILTER,
    screen: screen.routeName
})};

export const clearCompleted = (current_category_id) => {
    return ({
    type: UserActionTypes.CLEAR,
    current_category_id
})};

export const undoClearCompleted = (completed) => {
    return ({
    type: UserActionTypes.UNDO_CLEAR,
    completed
})};

export const addCategory = (title, cat_id, color) => {
    return ({
        type: UserActionTypes.ADD_CAT,
        id: cat_id,
        title,
        color: color
})};

export const removeCategory = (category) => {
    return ({
        type: UserActionTypes.REMOVE_CAT,
        category,
})};

export const removeAllCategory = (category) => {
    return ({
        type: UserActionTypes.REMOVE_ALL,
        category,
})}

export const moveTasks = (category, next_category) => {
    return ({
        type: UserActionTypes.MOVE_TASKS,
        category,
        next_category
})};

export const renameCategory = (name, category) => {
    return ({
        type: UserActionTypes.RENAME_CAT,
        name,
        category
})};

export const switchCategory = (category) => {
    return ({
    type: UserActionTypes.SWITCH_CAT,
    category
})};

export const changeTaskCategory = (category, task) => {
    return ({
    type: UserActionTypes.CHANGE_TASK_CAT,
    task,
    category
})};

export const changeTaskTitle = (task, newTitle) => {
    return ({
    type: UserActionTypes.CHANGE_TASK_TITLE,
    task,
    newTitle
})};

export const setTaskDescription = (task, description) => {
    return ({
    type: UserActionTypes.SET_TASK_DESCRIPTION,
    task,
    description
})};

export const changeCategoryColor = (color, category) => {
    return ({
    type: UserActionTypes.CAT_COLOR,
    category_id: category.id,
    category,
    color
})};

export const arrangeCategories = (catList) => {
    return ({
    type: UserActionTypes.ARRANGE_CAT,
    catList
})};

export const changeTheme = (theme) => {
    return ({
    type: UserActionTypes.CHANGE_THEME,
    theme
})};