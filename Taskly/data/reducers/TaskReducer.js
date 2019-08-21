import { UserActionTypes, defaultCategoryDetails } from '../Constants'
import { cancelScheduledNotification } from '../../data/actions/Notifications'

const initial_state = {
    taskList: [],
    task_id: 0
}

const TaskReducer = (state = initial_state, action) => {
    switch(action.type) {
        case UserActionTypes.ADD:
            return {
                taskList:
                [
                    {
                        id: action.id,
                        title: action.title,
                        created_date: action.created_date,
                        due_date: action.due_date,
                        completed_date: action.completed_date,
                        description: action.description,
                        importance: action.importance,
                        category_id: action.category_id,
                        notification: {
                            notification_id: action.notification.notification_id,
                            notify_ahead: action.notification.notify_ahead
                        },
                        completed: false
                    }, ...state.taskList
                ],
                task_id: ++state.task_id
            }

        case UserActionTypes.REMOVE: 
            const toDelete = state.taskList.find( task => task.id === action.task.id);
            if (toDelete.notification.notification_id !== null)
                cancelScheduledNotification(toDelete.notification.notification_id);
            return { taskList: state.taskList.filter( task => task.id !== action.task.id),
                    task_id: state.task_id }

        case UserActionTypes.UNDO_REMOVE: {
                const undoTaskList = state.taskList.slice();
                undoTaskList.splice(action.indexedTask.index, 0, action.indexedTask.task);
                return { taskList: undoTaskList, task_id: state.task_id }
            }

        case UserActionTypes.TOGGLE: {
            return { taskList: state.taskList.map( task => (task.id === action.task.id) ? 
                    { ...task, completed: !task.completed, completed_date: action.completed_date} : task), 
                    task_id: state.task_id }
            }
        
        case UserActionTypes.CLEAR: {
            const filter = (task) => action.current_category_id === defaultCategoryDetails.id ?  !task.completed :
                                    task.category_id === action.current_category_id ? !task.completed : task;
            return { taskList: state.taskList.filter(task => filter(task)), 
                    task_id: state.task_id}
            }
        
        case UserActionTypes.UNDO_CLEAR: {
            return { taskList: state.taskList.concat(action.completed), 
                task_id: state.task_id}
        }

        case UserActionTypes.IMPORTANCE: {
            return {taskList: state.taskList.map( task => (task.id === action.task.id) ? 
                    { ...task, importance: action.importance} : task), 
                    task_id: state.task_id }
        }

        case UserActionTypes.DUE_DATE: {
            return {taskList: state.taskList.map( task => (task.id === action.task.id) ? 
                    { ...task, due_date: action.date} : task), 
                    task_id: state.task_id }
        }

        case UserActionTypes.CHANGE_TASK_CAT: {
            return {taskList: state.taskList.map( task => (task.id === action.task.id) ? 
                    { ...task, category_id: action.category.id} : task), 
                    task_id: state.task_id }
        }

        case UserActionTypes.SET_NOTIFICATION: {
            return {taskList: state.taskList.map( task => (task.id === action.task.id) ? 
                { ...task, notification: {
                    notification_id: action.notification_id,
                    notify_ahead: action.notify_ahead
                }} : task), 
                task_id: state.task_id }
        }

        case UserActionTypes.CHANGE_TASK_TITLE: {
            return {taskList: state.taskList.map( task => (task.id === action.task.id) ? 
                { ...task, title: action.newTitle} : task), 
                task_id: state.task_id }
        }

        case UserActionTypes.SET_TASK_DESCRIPTION: {
            return {taskList: state.taskList.map( task => (task.id === action.task.id) ? 
                { ...task, description: action.description} : task), 
                task_id: state.task_id }
        }

        case UserActionTypes.REMOVE_ALL: {
                return { taskList: state.taskList.filter(task => task.category_id !== action.category.id), 
                    task_id: state.task_id}
        }

        case UserActionTypes.MOVE_TASKS: {
                return {taskList: state.taskList.map( task => (task.category_id === action.category.id) ? 
                    { ...task, category_id: action.next_category.id} : task), 
                    task_id: state.task_id }
        }

        default:
            return state;
    }
}

export default TaskReducer;