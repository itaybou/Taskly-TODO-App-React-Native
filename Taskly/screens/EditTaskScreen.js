import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';
import { CheckBox, Icon, Rating } from 'react-native-elements'
import { toggleCompleted, setTaskRating  } from '../data/actions/Actions'
import DatePicker from 'react-native-datepicker'
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';

class EditTaskScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemID: this.props.navigation.getParam('itemID')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={{fontSize: 16, fontWeight: '900'}}>Additional task details</Text>
                </View>
                <View style={styles.details}>
                    <CheckBox
                        size={35}
                        iconType={'feather'}
                        checkedIcon={'check-circle'}
                        uncheckedIcon={'circle'}
                        containerStyle={styles.checkBox}
                        checked={this.props.item.completed}
                        checkedColor= {'#E03A02'}
                        title={this.props.item.title}
                        onIconPress={ () => this.props.toggleTask(this.props.item)}
                        textStyle={this.props.item.completed ? styles.textCompleted : styles.textNotCompleted}
                    
                    />
                    <Text style={{textDecorationLine: 'underline', textDecorationColor:this.props.category.color}}>Category: {this.props.category.title}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>Importance:  </Text>
                        <Rating
                            ratingColor={'#E03A02'}
                            ratingCount={5}
                            imageSize={35}
                            defaultRating={0}
                            startingValue={this.props.item.rating}
                            showRating={false}
                            readonly={false}
                            onFinishRating={(rating) => this.props.rateTask(this.props.item, rating)}
                        />
                        {this.props.item.rating !== 0 ? <Text>{this.props.item.rating}/5</Text> : <View></View>}
                    </View>
                    <View>
                        <DatePicker
                            style={{width: 200}}
                            date={this.props.item.due_date !== '' ? this.props.item.due_date : ''}
                            mode="datetime"
                            placeholder="select date"
                            format="YYYY-MM-DD"
                            minDate="2019-07-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            iconComponent={
                                <Icon
                                    containerStyle={styles.taskIcons}
                                    size={25}
                                    name={'clock'}
                                    type='feather'
                                    color='#000000'
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
                                borderColor: '#DDD'
                            }
                            // ... You can check the source to find the other keys.
                            }}
                        />
                        <Text>Created: {this.props.item.created_date}</Text>
                        <Text>Completed: {this.props.item.completed_date}</Text>
                    </View>
                    <View>
                        <AutoGrowingTextInput 
                            style={{backgroundColor: '#DDDDDD'}}
                            maxHeight={200}
                            minHeight={45}
                            placeholder={'Insert task description'} 
                            placeholderTextColor="#c7c7c7"
                            underlineColorAndroid='transparent'
                        />
                    </View>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#FFFFFF'
    },

    details: {
        flex: 1,
        width: '85%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderWidth: 0
    },

    titleContainer: {
        backgroundColor: '#E0E0E0',
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

    ratingContainer: {
        flex: 0.1,
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
    }
});

const mapStateToProps = (state, ownProps) => {
    const item = state.tasks.taskList.find(task => task.id === ownProps.navigation.getParam('itemID'))
    return ({
        item: item,
        category: state.categories.catList.find(cat => cat.id === item.category_id)
})}

const mapDispatchToProps = dispatch => ({
    toggleTask: task => dispatch( toggleCompleted(task)), 
    rateTask: (task, rating) => dispatch(setTaskRating(task, rating))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditTaskScreen);