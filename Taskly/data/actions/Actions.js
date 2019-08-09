import { UserActionTypes, defaultCategoryColor } from '../Constants'

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
        created_date: getCurrentDateFormatted(),
        due_date: '',
        completed_date: '',
        description: '',
        importance: 0,
        category_id: cat_id,
        notification_id: null,
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

export const setTaskNotification = (task, notification_id) => {
    return ({
        type: UserActionTypes.SET_NOTIFICATION,
        notification_id,
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

export const clearCompleted = () => {
    return ({
    type: UserActionTypes.CLEAR
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
        type: UserActionTypes.ADD_CAT,
        id: cat_id,
        title,
        color: defaultCategoryColor
})};

export const switchCategory = (category) => {
    return ({
    type: UserActionTypes.SWITCH_CAT,
    category
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