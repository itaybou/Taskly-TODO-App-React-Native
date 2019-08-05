import { UserActionTypes, defaultCategoryColor } from '../Constants'

const getCurrentDateFormatted = () => {
    const twoDigitFormat = (number) => (number <= 9) ? '0' + number : number;
    var date = new Date();
    var day = date.getDate(); //Current Date
    var month = date.getMonth() + 1; //Current Month
    var year = date.getFullYear(); //Current Year
    return twoDigitFormat(day) + '/' + twoDigitFormat(month) + '/' + year;
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
        rating: 0,
        category_id: cat_id,
        title
})};

export const removeTask = (task) => {
    return ({
    type: UserActionTypes.REMOVE,
    task
})};

export const toggleCompleted = (task) => {
    return ({
    type: UserActionTypes.TOGGLE,
    completed_date: task.completed ? '' : getCurrentDateFormatted(),
    task
})};

export const addTaskRating = (task) => {
    return ({
    type: UserActionTypes.RATING,
    task
})};

export const changeVisibility = (screen) => {
    return ({
    type: UserActionTypes.FILTER,
    screen
})};

export const clearCompleted = (taskList) => {
    return ({
    type: UserActionTypes.CLEAR,
    taskList
})};

export const addCategory = (title, cat_id, color) => {
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

export const setTaskRating = (task, rating) => {
    return ({
    type: UserActionTypes.RATING,
    task,
    rating
})};