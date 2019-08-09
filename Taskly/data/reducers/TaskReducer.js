import { UserActionTypes } from '../Constants'

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
                        notification_id: action.notification_id,
                        completed: false
                    }, ...state.taskList
                ],
                task_id: ++state.task_id
            }

        case UserActionTypes.REMOVE: 
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
            return { taskList: state.taskList.filter(task => !task.completed), 
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

        case UserActionTypes.SET_NOTIFICATION: {
            return {taskList: state.taskList.map( task => (task.id === action.task.id) ? 
                { ...task, notification_id: action.notification_id} : task), 
                task_id: state.task_id }
        }
                    
        default:
            return state;
    }
}

export default TaskReducer;