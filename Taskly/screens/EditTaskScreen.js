import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Switch, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements'
import { toggleCompleted, setTaskImportance, setTaskDueDate, setTaskNotification  } from '../data/actions/Actions'
import DatePicker from 'react-native-datepicker'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import Slider from "react-native-slider";
import { maxTaskImportance } from '../data/Constants'
import DropDownItem from 'react-native-drop-down-item';
import { withTheme } from '../data/Theme'
import { sendScheduledNotification, cancelScheduledNotification } from '../data/actions/Notifications'
import { SettingsScreen } from "react-native-settings-screen"
class EditTaskScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemID: this.props.navigation.getParam('itemID'),
            importance: this.props.item.importance,
            description: this.props.item.description,
            due_date: this.props.item.due_date,
            notification: this.props.item.notification_id === null ? false : true,
            notify_time: 0
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
            <View style={style.descriptionContainer}>
                <AutoGrowingTextInput
                    ref={input => { this.textInput = input }}
                    style={{backgroundColor: theme.text_box}}
                    maxHeight={200}
                    minHeight={45}
                    placeholder={'Insert task description'}
                    placeholderTextColor={theme.placeholder_text}
                    underlineColorAndroid='transparent'
                    onChangeText={ (input) => this.setState({description: input}) }
                />
            </View>
        )
    }

    toggleNotification() {
        this.setState({notification: !this.state.notification}, async () => {
            if(this.state.notification) {
                if(this.props.item.due_date !== '') {
                    const notification_id = await sendScheduledNotification(
                        "Your task is due!",
                        this.props.item.title,
                        this.props.item,
                        this.props.item.due_date,
                        this.state.notify_time
                    );
                    if(notification_id !== 'illegal' && notification_id !== 'none') {
                        this.props.setTaskNotification(this.props.item, notification_id);
                    } else {
                        this.setState({notification: false});
                        alert('too early!')
                    }
                } else {
                    this.setState({notification: false});
                    alert ('No due date entered')
                }
            } else {
                await cancelScheduledNotification(this.props.item.notification_id);
                this.props.setTaskNotification(this.props.item, null);
            }
        });
        console.log(this.props.item);
    }

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
                        {
                            type: 'SECTION',
                            header: 'Task details'.toUpperCase(),
                            rows: [
                                {
                                    title: 'Category',
                                    showDisclosureIndicator: true,
                                    theme: theme
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
                                    title: 'Description',
                                    theme: theme,
                                    renderAccessory: () => (
                                        /*<DropDownItem
                                            style={{width: '100%'}}
                                            invisibleImage={IC_ARR_DOWN}
                                            visibleImage={IC_ARR_UP}
                                            contentVisible={false}
                                            header={
                                                    <Text numberOfLines={1} style={{color: theme.primary_text, marginStart: 8}}>{this.props.item.description}kgkgkh</Text>
                                            }
                                        >
                                        <Text>Hello World</Text>
                                        </DropDownItem>*/
                                        <Text>Hello</Text>
                                    ),
                                    showDisclosureIndicator: true
                                }
                            ]
                        },
                        {
                            type: 'SECTION',
                            header: 'Task schedule'.toUpperCase(),
                            footer: 'Task additional data is saved on change.',
                            rows: [
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
                                                        this.props.setDueDate(this.props.item, '');
                                                        if(this.state.notification) {
                                                            this.toggleNotification();
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
                            setTimeout(() => this.setState({ refreshing: false }), 3000)
                            }}
                        />
                        ),
                    }}
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
        backgroundColor: theme.background_selected,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    checkboxContainer: {
        marginTop: 20,
        marginBottom: 30,
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
        justifyContent: 'center',
        alignItems: 'center',
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
            category: state.categories.catList.find(cat => cat.id === item.category_id),
            categories: state.categories.catList
        }
    }
};

const mapDispatchToProps = dispatch => ({
    toggleTask: task => dispatch( toggleCompleted(task)), 
    taskImportance: (task, importance) => dispatch(setTaskImportance(task, importance)),
    setDueDate: (task, date) => dispatch(setTaskDueDate(task, date)),
    setTaskNotification: (task, notification_id) => dispatch(setTaskNotification(task, notification_id))
})

export default connect(mapStateToPropsFactory, mapDispatchToProps)(withTheme(EditTaskScreen));