import { UserActionTypes } from '../Constants'
let next_id = 0;

//User actions
export const addTask = (title, task_id) => {
    return ({
    type: UserActionTypes.ADD,
    id: task_id,
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
    task
})};

export const changeVisibility = (screen) => {
    return ({
    type: UserActionTypes.FILTER,
    screen
})};