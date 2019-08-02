import { UserActionTypes } from '../Constants'

const TaskReducer = (state = {taskList:[], task_id:0}, action) => {
    console.log(action.title);
    switch(action.type) {
        case UserActionTypes.ADD:
            return {
                taskList:
                [
                    {
                        id: action.id,
                        title: action.title,
                        completed: false
                    }, ...state.taskList
                ],
                task_id: ++state.task_id
            }

        case UserActionTypes.REMOVE: 
            return { taskList: state.taskList.filter( task => task.id !== action.task.id),
                    task_id: state.task_id }

        case UserActionTypes.TOGGLE: 
            return { taskList: state.taskList.map( task => (task.id === action.task.id) ? 
                    { ...task, completed: !task.completed} : task), 
                    task_id: state.task_id }

        default:
            return state;
    }
}

export default TaskReducer;