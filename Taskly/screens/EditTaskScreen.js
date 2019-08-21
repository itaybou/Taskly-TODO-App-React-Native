import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Switch, RefreshControl, TouchableWithoutFeedback, Alert } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements'
import { toggleCompleted, setTaskImportance, setTaskDueDate, setTaskNotification, changeTaskCategory, changeTaskTitle, setTaskDescription  } from '../data/actions/Actions'
import DatePicker from 'react-native-datepicker'
import Slider from "react-native-slider";
import { maxTaskImportance, maxTaskTitleLength, maxDescriptionLength, notification_ahead_times } from '../data/Constants'
import { Dropdown } from 'react-native-material-dropdown';
import { withTheme } from '../data/Theme'
import { sendScheduledNotification, cancelScheduledNotification } from '../data/actions/Notifications'
import { SettingsScreen } from "react-native-settings-screen"
import InputModal from '../components/modals/InputModal'
import moment from "moment";

class EditTaskScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemID: this.props.navigation.getParam('itemID'),
            importance: this.props.item.importance,
            description: this.props.item.description,
            due_date: this.props.item.due_date,
            notification: this.props.item.notification.notification_id === null ? false : true,
            notify_ahead: this.props.item.notification.notify_ahead,
            renameVisible: false,
            descriptionVisible: false
        }
    }

    renderCheckbox = () => {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            <View style={style.checkboxContainer}>
                <CheckBox
                    size={35}
                    iconType={'feather'}
                    checkedIcon={'check-circle'}
                    uncheckedIcon={'circle'}
                    containerStyle={style.checkBox}
                    checked={this.props.item.completed}
                    checkedColor= {theme.accent_primary}
                    uncheckedColor = {theme.icons_secondary}
                    title={this.props.item.title}
                    onIconPress={ () => this.props.toggleTask(this.props.item)}
                    textStyle={this.props.item.completed ? style.textCompleted : style.textNotCompleted}
                />
            </View>
        )
    }

    renderDescription = () => {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            this.props.item.description !== '' ?
            <View style={style.descriptionContainer}>
                <View style={{height: '100%', paddingHorizontal: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: theme.activeTintColor}}>
                    <Text style={{fontSize: 14, color: theme.primary_text, fontWeight: 'bold'}}>Description</Text>
                </View>
                <View style={{flex: 1, height: '100%', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}}>
                    <Text style={{margin: 12, fontSize: 12, color: theme.primary_text, lineHeight: 12}}>{this.props.item.description}</Text>
                </View>
            </View> :
            <View style={style.descriptionContainer}>
                <Text style={{fontSize: 12, color: theme.primary_text}}>No task description</Text>
            </View>
        )
    }

    renderNotification = () => {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            <View style={style.notificationContainer}>
                <View style={{height: '100%', paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: theme.activeTintColor}}>
                    <Text style={{fontSize: 12, color: theme.primary_text, fontWeight: 'bold'}}>Notification</Text>
                </View>
                <View style={{flex: 1, height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Icon
                        containerStyle={{ marginEnd: 4, marginStart: 4, marginBottom: 5}}
                        size={15}
                        name={this.state.notification ? 'notifications' : 'notifications-off'}
                        type='ionicons'
                        color={this.state.notification ? theme.main_secondary : theme.accent_primary}
                    />
                    <Text style={{margin: 8, fontSize: 12, color: theme.primary_text, lineHeight: 12}}>{this.state.notification ? `Set for: ${this.getNotificationTime()}` : 'No notification active.'}</Text>
                </View>
            </View>
        )
    }

    toggleNotification(prev_due) {
        this.setState({notification: !this.state.notification}, async () => {
            if(this.state.notification) {
                if(this.props.item.due_date !== '') {
                    const notification_id = await sendScheduledNotification(
                        "Taskly - Your task is due!",
                        this.props.item.completed ? `Status: Completed\n` : `Status: Active\n` + `Task: ${this.props.item.title}`,
                        this.props.item,
                        this.props.item.due_date,
                        this.state.notify_ahead
                    );
                    if(notification_id !== 'illegal' && notification_id !== 'none') {
                        this.props.setTaskNotification(this.props.item, notification_id, this.state.notify_ahead);
                        Alert.alert('Task notification set', `Task notification is set for:\n${this.getNotificationTime()}`)
                    } else {
                        this.setState({notification: false});
                        Alert.alert("Due time already passed!", `Can't set task notification since ${this.props.item.due_date} already passed or it is the current time.`);
                    }
                } else {
                    this.setState({notification: false});
                    Alert.alert("No due date supplied!", `Can't set task notification since no due date supplied for the task.`);
                }
            } else {
                await cancelScheduledNotification(this.props.item.notification.notification_id);
                this.props.setTaskNotification(this.props.item, null, this.state.notify_ahead);
                Alert.alert('Task notification canceled', `Task notification previously scheduled for: ${this.getNotificationTime(prev_due)}\nis now canceled.`);
            }
        });
    }

    scheduleSection() {
        const theme = this.props.theme;
        const style = styles(theme);
        const notifications =
            [
                {
                    title: 'Created date',
                    theme: theme,
                    renderAccessory: () => <Text style={{color: theme.primary_text}}>{this.props.item.created_date}</Text>
                },
                {
                    title: 'Completed date',
                    theme: theme,
                    renderAccessory: () => <Text style={{color: theme.primary_text}}>{this.props.item.completed_date !== '' ? this.props.item.completed_date : 'Active'}</Text>
                },
                {
                    title: 'Due date',
                    theme: theme,
                    renderAccessory: () => (
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <DatePicker
                                onDateChange={(date) => {
                                    this.setState({due_date: date});
                                    this.props.setDueDate(this.props.item, date);
                                }}
                                style={{width: 200}}
                                date={this.state.due_date}
                                mode="datetime"
                                placeholder="PRESS TO SELECT DATE"
                                format="DD-MM-YYYY HH:mm"
                                minDate="2019-07-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                iconComponent={
                                    <Icon
                                        containerStyle={style.taskIcons}
                                        size={20}
                                        name={'clock'}
                                        type='feather'
                                        color={theme.icons}
                                    />
                                }
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0,
                                        marginRight: 8
                                    },
                                    dateInput: {
                                        color: theme.primary_text,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        height: 25,
                                        marginEnd: 8,
                                        borderColor: theme.separator,
                                        borderWidth: 0
                                    },
                                    dateText: {
                                        color: theme.primary_text
                                    }
                                }}
                            />
                            {this.state.due_date === '' ? <View></View> :
                                <View style={{marginStart: 8}}>
                                    <TouchableWithoutFeedback onPress={() => {
                                        this.setState({due_date: ''});
                                        const prev_due = this.props.item.due_date;
                                        this.props.setDueDate(this.props.item, '');
                                        if(this.state.notification) {
                                            this.toggleNotification(prev_due);
                                        }
                                    }}>
                                        <Icon
                                            containerStyle={styles.buttonLeft}
                                            size={20}
                                            name={'x'}
                                            type={'feather'}
                                            color={theme.icons}
                                        />
                                    </TouchableWithoutFeedback>
                                </View>
                            }
                        </View>
                    )
                }
            ];
        if(this.props.item.due_date !== '') {
            notifications.push(
                {
                    title: 'Notify ahead',
                    theme: theme,
                    subtitle: this.state.notification ? 'Time to notify ahead of due date.' : 'Also check allow due notification.',
                    renderAccessory: () =>  (
                        this.state.notification ? 
                        <Text style={{color: theme.primary_text}}>{this.getCurrentTimeAhead()}</Text> :
                        <View style={{ flex: 0.8}}>
                            <Dropdown
                                textColor={theme.primary_text}
                                baseColor={theme.secondary_text}
                                label='Notify ahead by'
                                value={this.getCurrentTimeAhead()}
                                data={this.getAvailableNotifyAhead()}
                                labelExtractor={(label) => label.label}
                                pickerStyle={{
                                    backgroundColor: theme.background_selected
                                }}
                                onChangeText={async (value, index, data) => {
                                    this.setState({notify_ahead: data[index].value}, () => 
                                        this.props.setTaskNotification(this.props.item, null, this.state.notify_ahead));
                                }}
                            />
                        </View>
                    )
                },
                {
                    title: 'Allow due notification',
                    theme: theme,
                    subtitle: 'Needed app notification permission via settings.',
                    renderAccessory: () =>  (
                        <Switch
                            thumbColor={theme.accent_primary}
                            trackColor={{true: theme.main_secondary, false: theme.background_selected}}
                            value={this.state.notification}
                            onValueChange={this.toggleNotification.bind(this)}
                        />
                    )
                }
            )
        }
        if(this.state.notification) {
            notifications.unshift(
                {
                    title: 'Notification',
                    theme: theme,
                    subtitle: 'Notification reminder time.',
                    renderAccessory: () => <Text style={{color: theme.primary_text}}>{this.getNotificationTime()}</Text>
                }
            );
        }
        return notifications;
    }

    getNotificationTime(prev_due) {
        console.log(this.props.item);
        const notification = moment(this.props.item.due_date !== '' ? this.props.item.due_date : prev_due, 'DD-MM-YYYY HH:mm').toDate().getTime() - this.props.item.notification.notify_ahead;
        const date = new Date(notification);
        if(date.getTime() < (new Date()).getTime()) {
            return 'Notified';
        }
        let day = date.getDate() <= 9 ? `0${date.getDate()}`: date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        day = day <= 9 ? `0${day}` : day;
        month = month <= 9 ? `0${month}` : month;
        hours = hours <= 9 ? `0${hours}` :hours;
        minutes = minutes <= 9 ? `0${minutes}` : minutes;
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    getAvailableNotifyAhead() {
        const now = new Date().getTime();
        return notification_ahead_times.filter((time) => moment(this.props.item.due_date, 'DD-MM-YYYY HH:mm').toDate().getTime() - (now + time.value)  >= 0);
    }

    getCurrentTimeAhead() {
        return notification_ahead_times.find(notification => notification.value === this.props.item.notification.notify_ahead).label
    }

    toggleRenameModal = () => {
        this.setState({ renameVisible: !this.state.renameVisible });
    };

    toggleDescriptionModal = () => {
        this.setState({ descriptionVisible: !this.state.descriptionVisible });
    };

    render() {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            <View style={style.container}>
                <View style={style.titleContainer}>
                    <Text style={{color: theme.primary_text, fontSize: 16, fontWeight: '900'}}>Additional task details</Text>
                </View>
                <SettingsScreen
                    data={[
                        {type: 'CUSTOM_VIEW', key: 'task', render: this.renderCheckbox},
                        {type: 'CUSTOM_VIEW', key: 'notification', render: this.renderNotification},
                        {type: 'CUSTOM_VIEW', key: 'task_description', render: this.renderDescription},
                        {
                            type: 'SECTION',
                            header: 'Task details'.toUpperCase(),
                            rows: [
                                {
                                    title: 'Change title',
                                    showDisclosureIndicator: true,
                                    onPress: () => this.setState({renameVisible: true}),
                                    theme: theme,
                                    renderAccessory: () => (
                                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                                            <Text style={{color: theme.primary_text}} numberOfLines={1}>{this.props.item.title}</Text>
                                            <Icon
                                                containerStyle={{marginLeft: 10}}
                                                size={18}
                                                name={'edit-3'}
                                                type='feather'
                                                color={theme.icons}
                                            />
                                        </View>
                                    )
                                },
                                {
                                    title: 'Category',
                                    theme: theme,
                                    renderAccessory: () => (
                                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                                            <Text style={{color: theme.primary_text}}>{this.props.category.title}</Text>
                                            <Icon
                                                containerStyle={{marginLeft: 10}}
                                                size={20}
                                                name={'ios-egg'}
                                                type='ionicon'
                                                color={this.props.category.color}
                                            />
                                        </View>
                                    )
                                },
                                {
                                    title: 'Move category',
                                    theme: theme,
                                    renderAccessory: () => (
                                        <View style={{ flex: 0.8}}>
                                            <Dropdown
                                                textColor={theme.primary_text}
                                                baseColor={theme.secondary_text}
                                                selectedItemColor={theme.primary_text}
                                                label='Task categories'
                                                value={this.props.category.title}
                                                data={this.props.categories}
                                                labelExtractor={(label) => label.title}
                                                pickerStyle={{
                                                    backgroundColor: theme.background_selected
                                                }}
                                                onChangeText={(value, index, data) => {
                                                    this.props.changeTaskCategory(this.props.item, data, index);
                                                }}
                                            />
                                        </View>
                                    )
                                },
                                {
                                    title: 'Importance',
                                    theme: theme,
                                    renderAccessory: () => (
                                        <View style={style.importanceContainer}>
                                            <Slider
                                                style={{width: 200, height: 100}}
                                                trackStyle={style.importanceSliderTrack}
                                                thumbStyle={style.importanceSliderThumb}
                                                animationType={'spring'}
                                                animateTransitions={true}
                                                minimumValue={0}
                                                maximumValue={maxTaskImportance}
                                                minimumTrackTintColor={theme.accent_primary}
                                                maximumTrackTintColor={theme.background_selected}
                                                thumbTouchSize= {{
                                                    width: 100,
                                                    height: 100
                                                }}
                                                step={1}
                                                value={this.props.item.importance}
                                                onValueChange={(importance) => this.setState({importance: importance})}
                                                onSlidingComplete={(importance) => this.props.taskImportance(this.props.item, importance)}
                                            />
                                            {this.state.importance !== 0 ?
                                                <Text style={{color: theme.primary_text, marginStart: 8}}>{this.state.importance}/{maxTaskImportance}</Text> :
                                                <Text style={{color: theme.primary_text, marginStart: 8}}>None</Text>}
                                    </View>
                                    )
                                },
                                {
                                    title: 'Edit description',
                                    onPress: () => this.setState({descriptionVisible: true}),
                                    showDisclosureIndicator: true,
                                    theme: theme,
                                    renderAccessory: () => (
                                        <View style={{flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                                            <Text style={{color: theme.primary_text}} numberOfLines={1}>{this.props.item.description === '' ? "None" : this.props.item.description}</Text>
                                        </View>
                                    ),
                                }
                            ]
                        },
                        {
                            type: 'SECTION',
                            header: 'Task schedule'.toUpperCase(),
                            rows: this.scheduleSection()
                        },
                        {
                            type: 'SECTION',
                            header: 'MANAGE'.toUpperCase(),
                            footer: 'Task additional data is saved on change.',
                            rows: [
                                {
                                    title: 'Share',
                                    theme: theme,
                                    showDisclosureIndicator: true,
                                    onPress: () => {
                                        this.props.share();
                                    },
                                    renderAccessory: () => (
                                        <Icon
                                            size={20}
                                            name={'share-2'}
                                            type={'feather'}
                                            color={theme.icons}
                                        />
                                    )
                                },
                                {
                                    title: 'Remove',
                                    showDisclosureIndicator: true,
                                    onPress: () => {
                                        this.props.navigation.goBack();
                                        this.props.remove();
                                    },
                                    theme: {background: '#F86C5F', primary_text: theme.primary_text, activeTintColor: theme.activeTintColor},
                                    renderAccessory: () => (
                                        <View style={{opacity: 0.5}}>
                                            <Icon
                                                name={'trash-2'}
                                                type={'feather'}
                                                color={'#000000'}
                                            />
                                        </View>
                                    )
                                }
                            ]
                        }
                    ]}
                    style={style.details}
                    scrollViewProps={{
                        refreshControl: (
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                            this.setState({ refreshing: true })
                            setTimeout(() => this.setState({ refreshing: false }), 1000)
                            }}
                        />
                        ),
                    }}
                />
                <InputModal 
                    isVisible={this.state.renameVisible}
                    edit={true}
                    previous={this.props.item.title}
                    title='Change task title' 
                    placeholder='Enter new task title'
                    maxInput={maxTaskTitleLength} 
                    approve={this.props.changeTaskTitle}
                    toggleModal={this.toggleRenameModal}
                    item={this.props.item}
                    fontSize={14}
                    height={0.28}
                />
                <InputModal 
                    isVisible={this.state.descriptionVisible}
                    edit={true}
                    previous={this.props.item.description === '' ? 'None' : this.props.item.description}
                    title='Enter task description' 
                    placeholder='Enter task description'
                    maxInput={maxDescriptionLength} 
                    approve={this.props.setTaskDescription}
                    toggleModal={this.toggleDescriptionModal}
                    item={this.props.item}
                    fontSize={14}
                    height={0.5}
                />
            </View>
        );
    }
};

const styles = (theme) => StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: theme.background
    },

    details: {
        backgroundColor: theme.background_selected,
        borderWidth: 0,
    },

    titleContainer: {
        width: '100%',
        backgroundColor: theme.background_selected,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    checkboxContainer: {
        marginTop: 20,
        marginBottom: 5,
        paddingVertical: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme.background,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.activeTintColor,
        flexDirection: 'row',
    },

    descriptionContainer: {
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: theme.background,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.activeTintColor,
        flexDirection: 'row',
    },

    notificationContainer: {
        marginBottom: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: theme.background,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.activeTintColor,
        flexDirection: 'row',
    },

    checkBox: {
        flex: 0.85,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        marginTop: 5,
        marginEnd: 15
    },

    importanceContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    textCompleted: {
        opacity: 0.3,
        fontSize: 18,
        color: theme.secondary_text,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },

    textNotCompleted: {
        color: theme.primary_text,
        opacity: 1,
        fontSize: 18,
    },

    importanceSliderTrack: {
        height: 10,
        borderRadius: 5,
    },

    importanceSliderThumb: {
        width: 10,
        height: 30,
        borderRadius: 5,
        backgroundColor: theme.accent_third
    }
});

const mapStateToPropsFactory = (state, ownProps) => {
    return function mapStateToProps(state) {
        const item = state.tasks.taskList.find(task => task.id === ownProps.navigation.getParam('itemID'))
        return {
            item: item,
            share: ownProps.navigation.getParam('share'),
            remove: ownProps.navigation.getParam('remove'),
            category: state.categories.catList.find(cat => cat.id === item.category_id),
            categories: state.categories.catList
        }
    }
};

const mapDispatchToProps = dispatch => ({
    toggleTask: task => dispatch( toggleCompleted(task)), 
    taskImportance: (task, importance) => dispatch(setTaskImportance(task, importance)),
    setDueDate: (task, date) => dispatch(setTaskDueDate(task, date)),
    setTaskNotification: (task, notification_id, notify_ahead) => dispatch(setTaskNotification(task, notification_id, notify_ahead)),
    changeTaskCategory: (task, categories, selection) => dispatch(changeTaskCategory(categories[selection], task)),
    changeTaskTitle: (newTitle, task) => dispatch(changeTaskTitle(task, newTitle)),
    setTaskDescription: (description, task) => dispatch(setTaskDescription(task, description))
})

export default connect(mapStateToPropsFactory, mapDispatchToProps)(withTheme(EditTaskScreen));