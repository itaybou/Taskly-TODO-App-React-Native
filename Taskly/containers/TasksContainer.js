import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, FlatList } from 'react-native';
import { toggleCompleted, removeTask } from '../data/actions/Actions'
import { FilterTabs } from '../data/Constants'
import Task from './Task';

const TaskList = (props) => {
    return (
    <View style={styles.container}>
        <FlatList 
            data={ filterTaskList(props.state, props.taskList) }
            extraData = {props.state}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={ ({item}) => {
                    return (
                        <Task
                            item={item} 
                            toggleCompleted={ () => { props.toggleTask(item); }}
                            removeTask={ () =>{ props.removeTask(item); }}
                        />
                    );
                }
            }
        />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },

    status_bar: {
        backgroundColor: '#ffd027',
        height: 35
    }
});

const filterTaskList = (state, taskList) => {
    switch(state.visibility) {
        case FilterTabs.ALL:
            return taskList;
        case FilterTabs.ACTIVE:
            return taskList.filter(task => !task.completed);
        case FilterTabs.COMPLETED:
            return taskList.filter(task => task.completed);
        default:
            return taskList;
    }
}

const mapStateToProps = (state) => {
    return ({
    state: state,
    taskList: state.tasks.taskList,
})};

const mapDispatchToProps = dispatch => ({
    toggleTask: task => dispatch( toggleCompleted(task)), 
    removeTask: task => dispatch( removeTask(task) )
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
