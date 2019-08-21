import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, TouchableOpacity, Alert, Text, Animated, Share, ActivityIndicator } from 'react-native';
import { toggleCompleted, removeTask, undoRemoveTask, clearCompleted, undoClearCompleted } from '../data/actions/Actions'
import { FilterTabs, windowWidth, defaultCategoryDetails, snackBarTimeout } from '../data/Constants'
import Task, {minimumTaskHeight} from './Task';
import { withTheme } from '../data/Theme'
import { SwipeListView } from 'react-native-swipe-list-view';
import { Icon } from 'react-native-elements'
import SnackBar from 'react-native-snackbar-component'
import CategorySettingsModal from '../components/modals/CategorySettingsModal'
import moment from "moment";

class TaskList extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            isLoading: true,
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
            },
            taskFadeValue: new Animated.Value(1),
            currentDeleted: null,
            additionalVisible: false,
            sort: 'none'
        }
    }
    componentDidMount() {
        this.setState({isLoading: false});
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

    hideAdditionalSettings() {
        this.setState({additionalVisible: false});
    }

    clearCompleted() {
        this.setState({additionalVisible: false}, () => {
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
                            this.props.clearCompleted(this.props.update.category);
                            this.showSnackBar('completed');
                        }
                    }
                ]);
            } else Alert.alert("No completed tasks", "You have no completed tasks to clear at the moment.");
        });
    }

    shareCategory() {
        this.setState({additionalVisible: false}, () => {
            const item = this.props.category;
            let shareMessage = `📄 Category: ${item.title}\n`;
            if(this.props.category_tasks.length > 0) {
                this.props.category_tasks.forEach( task => shareMessage = shareMessage + `\t▪️ ${task.completed? '✅' : '⬜️'} ${task.title}\n`)
            } else shareMessage = shareMessage + 'No tasks.'
            shareMessage = shareMessage + `Sent via Taskly`;
            Share.share({
                title: `Taskly Category share: ${item.title}`,
                message: shareMessage
            },
            {
                dialogTitle: 'Share category tasks details via: ',
            })
        });
    }

    removeTask(item, index) {
        Alert.alert('Delete task', 'Are you sure you want to delete this task?', 
        [{text: 'No', onPress: () => { return false }, style:'cancel'},
        {text: 'Yes', onPress: () => {
            this.setState({currentDeleted: item.id}, () => {
                Animated.timing(this.state.taskFadeValue, {
                    toValue: 0,
                    duration: 250,
                }).start(() => {
                    this.setState({taskFadeValue: new Animated.Value(1)});
                    this.setState({temporary_task: {
                        task: item,
                        index: index
                    }});
                    this.props.removeTask(item, index);
                    this.showSnackBar('task');
                    this.setState({currentDeleted: null});
                    return true;
                });
        })}}])
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

    setSort(sort) {
        this.setState({sort: sort, additionalVisible: false});
    }

    sort(taskList) {
        switch(this.state.sort) {
            case 'Creation date': 
                taskList.sort((task1, task2) => {
                    const task1Date = moment(task1.created_date, 'DD/MM/YYYY HH:mm').toDate();
                    const task2Date = moment(task2.created_date, 'DD/MM/YYYY HH:mm').toDate();
                    return task2Date - task1Date;
                });
                break;
            case 'Task importance': 
                taskList.sort((task1, task2) => task2.importance - task1.importance);
                break;
            case 'Due date': 
                taskList.sort((task1, task2) => {
                    const task1Date = moment(task1.due_date, 'DD-MM-YYYY HH:mm');
                    const task2Date = moment(task2.due_date, 'DD-MM-YYYY HH:mm');
                    if(!task1Date.isValid() && task2Date.isValid())
                        return 1;
                    else if(task1Date.isValid() && !task2Date.isValid())
                        return -1;
                    else if(!task1Date.isValid() && !task2Date.isValid())
                        return 0;
                    else return task1Date.toDate() - task2Date.toDate();
                });
                break;
        }
        return taskList;
    }

    keyExtractor = (item, index) => item.id.toString();

    render() {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            this.state.isLoading ?
            <View style={styles(theme).container}>
                <ActivityIndicator
                    style={{ flex: 1, backgroundColor: theme.background}}
                    color={theme.accent_primary}
                    size="large"
                /> 
                </View> : 
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
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginStart:2, marginEnd: 15 }} onPress={() => this.setState({additionalVisible: true})}>
                            <Text style={{ color: theme.primary_text, fontSize: 12, marginEnd: 5}}>Options</Text>
                            <Icon
                                size={20}
                                name={'format-list-bulleted'}
                                type='material'
                                color={theme.icons}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.state.sort !== 'none' ? 
                    <View style={style.sortContainer}>
                        <View style={style.taskCount}>
                            <Icon
                                size={18}
                                name='sort'
                                type='material'
                                color={theme.icons}
                            />
                            <Text style={{marginStart: 5, fontSize: 12, fontWeight: 'bold', color: theme.primary_text}}>Sorted by:</Text>
                            <Text style={{marginStart: 5, fontSize: 12, color: theme.primary_text}}>{this.state.sort}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.setState({sort: 'Creation date'}, () => {
                                                                            this.sort(this.props.taskList);
                                                                            this.setState({sort: 'none'});
                                                    })}>
                            <View style={style.taskCount}>
                                <Icon
                                    size={15}
                                    name='x'
                                    type='feather'
                                    color={theme.accent_primary}
                                />
                                <Text style={{color: theme.accent_primary, fontSize: 12, marginEnd: 16}}>Cancel sort</Text>
                            </View>
                        </TouchableOpacity>
                    </View> : <View></View>
                }
                <CategorySettingsModal 
                    isVisible={this.state.additionalVisible} 
                    hideModal={this.hideAdditionalSettings.bind(this)}
                    clear={this.clearCompleted.bind(this)}
                    share={this.shareCategory.bind(this)}
                    sort={this.setSort.bind(this)}
                />
                <SwipeListView
                    data={ this.state.sort === 'none' ? this.props.taskList : this.sort(this.props.taskList)}
                    extraData = {this.props.state}
                    maxToRenderPerBatch={5}
                    keyExtractor={this.keyExtractor}
                    renderItem={ ({item, index}) => {
                            return (
                            <Animated.View style={{opacity: item.id  === this.state.currentDeleted ? this.state.taskFadeValue : 1}}>
                                <Task
                                    item={item}
                                    navigation={this.props.navigation}
                                    toggleCompleted={ () => { this.props.toggleTask(item); }}
                                    remove={() => this.removeTask(item, index)}
                                    isExpanded={this.expandedTaskResponse.bind(this)}
                                    isClosed={this.closedTaskResponse.bind(this)}
                                />
                            </Animated.View>)
                        }
                    }
                    renderHiddenItem={ ({item, index}) =>
                        <Animated.View style={item.id === this.state.currentDeleted ? {backgroundColor: 'transparent'} : [item.completed ? style.itemSwipeCompleted : style.itemSwipeNotCompleted]}>
                            {item.id !== this.state.currentDeleted ?
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
                                </TouchableOpacity> : <View></View>
                            }
                        </Animated.View>
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
    },

    sortContainer: { 
        width: '100%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.sort_bar, 
        height: "4%",
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
        justifyContent: "flex-end",
        marginEnd: 0,
    },

    informationText: {
        color: theme.primary_text,
        fontSize: 12,
        marginStart:2,
        marginEnd: 22
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
            category: state.categories.catList.find(cat => cat.id === currentCategory),
            category_tasks: state.tasks.taskList.filter(task => task.category_id === currentCategory),
            update: {
                visibility: state.visibility,
                category: state.categories.curr_cat_id,
                taskList: state.tasks.taskList
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
    clearCompleted: category_id => dispatch(clearCompleted(category_id)),
    undoClearCompleted: completed => dispatch(undoClearCompleted(completed))
})

export default connect(mapStateToPropsFactory, mapDispatchToProps)(withTheme(TaskList));