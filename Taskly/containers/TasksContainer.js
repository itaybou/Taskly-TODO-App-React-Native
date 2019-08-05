import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { toggleCompleted, removeTask } from '../data/actions/Actions'
import { FilterTabs, windowWidth } from '../data/Constants'
import Task, {minimumTaskHeight} from './Task';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Icon } from 'react-native-elements'


class TaskList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state= {
            expandedTask: null
        }
    }

    expandedTaskResponse = async (expanded) => {
        if(this.state.expandedTask !== null) {
            await this.state.expandedTask.state.toggleClose();
        }
        this.setState({expandedTask: expanded});
    }

    closedTaskResponse() {
        this.setState({expandedTask: null});
    }

    keyExtractor = (item, index) => item.id.toString();

    render() {
        return (
            <View style={styles.container}>
                <SwipeListView
                    data={ this.props.taskList }
                    extraData = {this.props.state}
                    keyExtractor={this.keyExtractor}
                    renderItem={ ({item}) => 
                        <Task
                            item={item}
                            itemList={this.props.taskList}
                            navigation={this.props.navigation}
                            toggleCompleted={ () => { this.props.toggleTask(item); }}
                            isExpanded={this.expandedTaskResponse.bind(this)}
                            isClosed={this.closedTaskResponse.bind(this)}
                        />
                    }
                    renderHiddenItem={ ({item}) =>
                        <View style={[item.completed ? styles.itemSwipeCompleted : styles.itemSwipeNotCompleted]}>
                            <TouchableOpacity
                                style={styles.deleteIcon}
                                onPress={ () => 
                                    Alert.alert('Delete task', 'Are you sure you want to delete this task?', 
                                    [{text: 'No', onPress: () => {}, style:'cancel'},
                                    {text: 'Yes', onPress: () => this.props.removeTask(item)}])
                                }
                            >
                                <Icon
                                    style={styles.deleteIcon}
                                    name={'trash-2'}
                                    type={'feather'}
                                    color={'#000000'}
                                />
                            </TouchableOpacity>
                        </View>
                    }
                    friction={25}
                    stopRightSwipe={-windowWidth/3}
                    rightOpenValue={-60}
                    swipeToClosePercent={1}
                    swipeToOpenPercent={100}
                    disableRightSwipe={true}
                    disableLeftSwipe={this.state.expandedTask !== null}
                    closeOnRowBeginSwipe={true}
                    closeOnRowPress={true}
                    closeOnRowOpen={true}
                    closeOnScroll={true}
                />
            </View>
            );
        }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },

    deleteIcon: {
        height: 22,
        opacity: 0.4,
        resizeMode: 'contain'
    },

    itemSwipeCompleted: {
        width: '100%',
        height: minimumTaskHeight,
        padding: 16,
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#F86C5F'
    },

    itemSwipeNotCompleted: {
        width: '100%',
        height: minimumTaskHeight,
        padding: 16,
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#FA988F'
    },
});

const filterTaskList = (filter, taskList, categories) => {
    switch(filter) {
        case FilterTabs.ALL:
            return taskList.filter(task => task.category_id === categories.curr_cat_id);
        case FilterTabs.ACTIVE:
            return taskList.filter(task => task.category_id === categories.curr_cat_id && !task.completed);
        case FilterTabs.COMPLETED:
            return taskList.filter(task => task.category_id === categories.curr_cat_id && task.completed);
        default:
            return taskList;
    }
}

const mapStateToProps = (state) => {
    return ({
    state: state,
    taskList: filterTaskList(state.visibility.routeName, state.tasks.taskList, state.categories)
})};

const mapDispatchToProps = dispatch => ({
    toggleTask: task => dispatch( toggleCompleted(task)), 
    removeTask: task => dispatch( removeTask(task) )
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);