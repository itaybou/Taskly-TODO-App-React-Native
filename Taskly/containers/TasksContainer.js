import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, TouchableOpacity, Alert, Text } from 'react-native';
import { toggleCompleted, removeTask, undoRemoveTask, clearCompleted, undoClearCompleted } from '../data/actions/Actions'
import { FilterTabs, windowWidth, defaultCategoryDetails, snackBarTimeout } from '../data/Constants'
import Task, {minimumTaskHeight} from './Task';
import { withTheme } from '../data/Theme'
import { SwipeListView } from 'react-native-swipe-list-view';
import { Icon } from 'react-native-elements'
import SnackBar from 'react-native-snackbar-component'

class TaskList extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            shareVisible: false,
            snackBar: {
                snackBarVisible: false,
                snackBarPressed: false,
                undoMode: null
            },
            expandedTask: null,
            temporary_completed: [],
            temporary_task: {
                task: null,
                index: null
            }
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

    showSnackBar(mode) {
        this.setState({snackBar: {snackBarVisible: true, undoMode: mode}})
        setTimeout(() => {
            if(this.state.snackBar.snackBarVisible) {
                this.setState({ 
                    temporary_completed: [],
                    temporary_task: {
                        task: null,
                        index: null
                    },
                snackBar: {snackBarVisible: false, undoMode: null}
                });
            }
        }, snackBarTimeout);
    }

    clearCompleted() {
        const completedCount = this.props.completed.length;
        if(this.props.completed.length !== 0) {
            let multiplicity = completedCount > 1 ? 'tasks' : 'task';
            Alert.alert("Clear completed tasks", `You currently have ${completedCount} completed ${multiplicity} in this category. Are you sure you want to clear?`,
            [
                {
                    text: "No",
                    onPress: () => {},
                    style: "cancel"
                },
                { text: "Yes", onPress: () => {
                        this.setState({temporary_completed: this.props.completed});
                        this.props.clearCompleted();
                        this.showSnackBar('completed');
                    }
                }
            ]);
        } else Alert.alert("No completed tasks", "You have no completed tasks to clear at the moment.");
    }

    removeTask(item, index) {
        Alert.alert('Delete task', 'Are you sure you want to delete this task?', 
        [{text: 'No', onPress: () => {}, style:'cancel'},
        {text: 'Yes', onPress: () => {
            this.setState({temporary_task: {
                task: item,
                index: index
            }});
            this.props.removeTask(item, index);
            this.showSnackBar('task');
        }}])
    }

    undo() {
        if(!this.state.snackBar.snackBarPressed) {
            this.setState({snackBar: {snackBarVisible: false, snackBarPressed: true, undoMode: this.state.snackBar.undoMode}}, 
                () => {
                    this.state.snackBar.undoMode === 'completed' ?
                    this.props.undoClearCompleted(this.state.temporary_completed) :
                    this.props.undoRemoveTask(this.state.temporary_task);
                }
            );
        }
    }

    keyExtractor = (item, index) => item.id.toString();

    render() {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            <View style={styles(theme).container}>
                <View style={style.informationContainer}>
                    <View style={style.taskCount}>
                        <Icon
                            size={12}
                            name={'hash'}
                            type='feather'
                            color={theme.icons}
                        />
                        <Text style={style.informationText}>{this.props.taskCount}</Text>
                        <Icon
                            size={12}
                            name={'check'}
                            type='feather'
                            color={theme.icons}
                        />
                        <Text style={style.informationText}>{this.props.completed.length}</Text>
                        <Icon
                            size={8}
                            name={'circle'}
                            type='feather'
                            color={theme.icons}
                        />
                        <Text style={style.informationText}>{this.props.taskCount - this.props.completed.length}</Text>
                    </View>
                    <View style={style.clear}>
                        <TouchableOpacity onPress={() => this.clearCompleted()}>
                            <Text style={style.informationText}>Clear completed</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <SwipeListView
                    data={ this.props.taskList}
                    extraData = {this.props.update}
                    keyExtractor={this.keyExtractor}
                    renderItem={ ({item, index}) => 
                        <Task
                            item={item}
                            navigation={this.props.navigation}
                            toggleCompleted={ () => { this.props.toggleTask(item); }}
                            remove={() => this.removeTask(item, index)}
                            isExpanded={this.expandedTaskResponse.bind(this)}
                            isClosed={this.closedTaskResponse.bind(this)}
                        />
                    }
                    renderHiddenItem={ ({item, index}) =>
                        <View style={[item.completed ? style.itemSwipeCompleted : style.itemSwipeNotCompleted]}>
                            <TouchableOpacity
                                style={style.deleteIcon}
                                onPress={() => this.removeTask(item, index)}
                            >
                                <Icon
                                    style={style.deleteIcon}
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
                
                <SnackBar 
                    visible={this.state.snackBar.snackBarVisible} 
                    textMessage={this.state.snackBar.undoMode === 'completed' ? 'Completed tasks have been cleared!' : 'Task has been deleted!'}
                    actionHandler={this.undo.bind(this)}
                    actionText='UNDO'
                    accentColor={theme.accent_primary}
                    backgroundColor={theme.snackbar_background}
                    messageColor={theme.primary_text}
                />
            </View>
            );
        }
}

const styles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
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
        borderBottomColor: theme.separator,
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
        borderBottomColor: theme.separator,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#FA988F'
    },

    informationContainer: { 
        width: '100%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.background_selected, 
        borderBottomWidth: 1,
        borderBottomColor: theme.separator,
        height: "4%", 
        alignItems: "center",
        justifyContent: "space-between"
    },

    taskCount: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginStart: 20
    },

    clear: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginEnd: 5,
    },

    informationText: {
        color: theme.primary_text,
        fontSize: 12,
        marginStart:2,
        marginEnd: 15
    }
});

const filterTaskList = (filter, taskList, currentCategory) => {
    const displayAllCategories = currentCategory === defaultCategoryDetails.id;
    switch(filter || filter.routeName) {
        case FilterTabs.ALL:
            return taskList.filter(task => (displayAllCategories || (task.category_id === currentCategory)));
        case FilterTabs.ACTIVE:
            return taskList.filter(task => (displayAllCategories || (task.category_id === currentCategory)) && !task.completed);
        case FilterTabs.COMPLETED:
            return taskList.filter(task => (displayAllCategories || (task.category_id === currentCategory)) && task.completed);
        default:
            return taskList;
    }
}

const mapStateToPropsFactory = (initialState, ownProps) => {
    return function mapStateToProps(state) {
        const currentCategory = state.categories.curr_cat_id;
        const defaultCategory = currentCategory === defaultCategoryDetails.id;
        return {
            update: {
                visibility: state.visibility,
                category: state.categories.curr_cat_id
            },
            taskList: filterTaskList(state.visibility, state.tasks.taskList, state.categories.curr_cat_id),
            taskCount: defaultCategory ? state.tasks.taskList.length : state.tasks.taskList.filter(task => task.category_id === currentCategory).length,
            completed: defaultCategory ? state.tasks.taskList.filter(task => task.completed) : 
                        state.tasks.taskList.filter(task => task.category_id === currentCategory && task.completed),
        }
    }
}

const mapDispatchToProps = dispatch => ({
    toggleTask: task => dispatch(toggleCompleted(task)), 
    removeTask: task => dispatch(removeTask(task)),
    undoRemoveTask: indexedTask => dispatch(undoRemoveTask(indexedTask)),
    clearCompleted: () => dispatch(clearCompleted()),
    undoClearCompleted: completed => dispatch(undoClearCompleted(completed))
})

export default connect(mapStateToPropsFactory, mapDispatchToProps)(withTheme(TaskList));