import { UserActionTypes } from '../Constants'

const TaskReducer = (state = {taskList:[], task_id:0}, action) => {
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
                        rating: action.rating,
                        category_id: action.category_id,
                        completed: false
                    }, ...state.taskList
                ],
                task_id: ++state.task_id
            }

        case UserActionTypes.REMOVE: 
            return { taskList: state.taskList.filter( task => task.id !== action.task.id),
                    task_id: state.task_id }

        case UserActionTypes.TOGGLE: {
            return { taskList: state.taskList.map( task => (task.id === action.task.id) ? 
                    { ...task, completed: !task.completed, completed_date: action.completed_date} : task), 
                    task_id: state.task_id }
            }
        
        case UserActionTypes.CLEAR: {
            return { taskList: state.taskList.filter(task => !task.completed), 
                    task_id: state.task_id}
            }

        case UserActionTypes.RATING: {
            console.log(state.taskList);
            return {taskList: state.taskList.map( task => (task.id === action.task.id) ? 
                    { ...task, rating: action.rating} : task), 
                    task_id: state.task_id }
        }
                    
        default:
            return state;
    }
}

export default TaskReducer;