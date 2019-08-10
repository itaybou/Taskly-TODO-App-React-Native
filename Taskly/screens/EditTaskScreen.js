import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { CheckBox, Icon, Card, Button } from 'react-native-elements'
import { toggleCompleted, setTaskImportance, setTaskDueDate, setTaskNotification  } from '../data/actions/Actions'
import DatePicker from 'react-native-datepicker'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import Slider from "react-native-slider";
import { maxTaskImportance } from '../data/Constants'
import { Dropdown } from 'react-native-material-dropdown';
import { withTheme } from '../data/Theme'
import { sendScheduledNotification, cancelScheduledNotification } from '../data/actions/Notifications'

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
                <Card
                    title='ADDITIONAL TASK DETAILS'
                >
                    <View style={{width: '100%', marginBottom: 25}}>
                        <CheckBox
                                size={35}
                                iconType={'feather'}
                                checkedIcon={'check-circle'}
                                uncheckedIcon={'circle'}
                                containerStyle={style.checkBox}
                                checked={this.props.item.completed}
                                checkedColor= {theme.accent_primary}
                                title={this.props.item.title}
                                onIconPress={ () => this.props.toggleTask(this.props.item)}
                                textStyle={this.props.item.completed ? style.textCompleted : style.textNotCompleted}
                            
                            />
                        </View>
                </Card>
                <Card
                    title='TASK CATEGORY'
                >
                    <View style={{width: '100%', marginBottom: 25}}>
                        <CheckBox
                                size={35}
                                iconType={'feather'}
                                checkedIcon={'check-circle'}
                                uncheckedIcon={'circle'}
                                containerStyle={style.checkBox}
                                checked={this.props.item.completed}
                                checkedColor= {theme.accent_primary}
                                title={this.props.item.title}
                                onIconPress={ () => this.props.toggleTask(this.props.item)}
                                textStyle={this.props.item.completed ? style.textCompleted : style.textNotCompleted}
                            
                            />
                        </View>
                </Card>
                <View style={{margin: 15, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <View style={{flexDirection:'row', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                        <Dropdown
                            containerStyle={{width: '60%'}}
                            animationDuration={100}
                            label='Move category:'
                            labelFontSize={14}
                            data={this.props.categories}
                            valueExtractor={(item) => item.title}
                        />
                        <Text style={{color: theme.primary_text, textDecorationLine: 'underline', textDecorationColor:this.props.category.color}}>Category: {this.props.category.title}</Text>
                        <Icon
                            containerStyle={{marginLeft: 3}}
                            size={15}
                            name={'ios-egg'}
                            type='ionicon'
                            color={this.props.category.color}
                        />
                    </View>
                    <View style={{
                        backgroundColor: theme.background_selected, 
                        width: '100%',
                        height: '80%',
                        shadowColor: "#000000",
                        shadowOpacity: 0.8,
                        borderRadius: 20,
                        shadowRadius: 2,
                        shadowOffset: {
                        }}}>
                        <View style={style.importanceContainer}>
                            <Text style={{color: theme.primary_text, fontWeight: 'bold'}}>Importance:  </Text>
                            <Slider
                                style={{width: 200, height: 100}}
                                trackStyle={style.importanceSliderTrack}
                                thumbStyle={style.importanceSliderThumb}
                                animationType={'spring'}
                                animateTransitions={true}
                                minimumValue={0}
                                maximumValue={maxTaskImportance}
                                minimumTrackTintColor={theme.accent_primary}
                                maximumTrackTintColor={theme.background}
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
                        <View>
                            <DatePicker
                                onDateChange={(date) => {
                                    this.setState({due_date: date});
                                    this.props.setDueDate(this.props.item, date);
                                }}
                                style={{width: 200}}
                                date={this.state.due_date}
                                mode="datetime"
                                placeholder="select date"
                                format="DD-MM-YYYY HH:mm"
                                minDate="2019-07-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                iconComponent={
                                    <Icon
                                        containerStyle={style.taskIcons}
                                        size={25}
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
                                        marginEnd: 5
                                    },
                                    dateInput: {
                                        height: 25,
                                        marginLeft: 36,
                                        borderColor: theme.separator
                                    }
                                }}
                            />
                            <Switch 
                                thumbColor={theme.accent_primary}
                                trackColor={{true: theme.main_secondary, false: theme.background}}
                                value={this.state.notification}
                                onValueChange={this.toggleNotification.bind(this)}
                            />
                            <Text style={{color: theme.primary_text}}>Created: {this.props.item.created_date}</Text>
                            <Text style={{color: theme.primary_text}}>Completed: {this.props.item.completed_date}</Text>
                        </View>
                        <View style={{width: '100%', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start'}}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: theme.primary_text}}>Task description:</Text>
                                <View>
                                    <Text style={{color: theme.primary_text}}>Test</Text>
                                </View>
                            </View>
                            <View>
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
                        </View>
                    </View>
                </View>
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
        flex: 1,
        width: '85%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme.background,
        borderWidth: 0,
        margin: 20
    },

    titleContainer: {
        backgroundColor: theme.background_selected,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    checkBox: {
        width: '85%',
        flex: 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        marginTop: 5,
        marginStart: 15
    },

    importanceContainer: {
        flex: 0.15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginStart: 20
    },

    textCompleted: {
        fontSize: 20,
        opacity: 0.3,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },

    textNotCompleted: {
        fontSize: 20,
        opacity: 1
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