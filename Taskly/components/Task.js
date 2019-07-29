import React from 'react';
import { StyleSheet, Button, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements'
import DatePicker from 'react-native-datepicker';

export default class Task extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const item = this.props.item;
        return (
            <TouchableOpacity 
                style={styles.item}
                onPress={ () => this.props.toggleCompleted() }
            >
                <CheckBox 
                    style={item.completed ? styles.completedItem : styles.notCompletedItem}
                    title={item.task}
                    checked={item.completed}
                />

                <DatePicker
                    style={{width: 120}}
                    date={item.date} //initial date from state
                    mode="date" //The enum of date, datetime and time
                    placeholder="select date"
                    format="DD/MM/YYYY"
                    minDate="01-01-2019"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                        dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                        },
                        dateInput: {
                        marginLeft: 36
                        }
                    }}
                    onDateChange={(date) => {this.props.setDueDate({date: date})}}
                />

                <Button
                    title="Remove"
                    color={item.completed ? 'rgba(255, 0, 0, 0.8)' : 'rgba(200, 0, 0, 0.3)'}
                    onPress={ () => this.props.removeTask() }
                />
            </TouchableOpacity>
        );
        }
}

const styles = StyleSheet.create({
    item: {
        width: '100%',
        height: 45,
        padding: 15,
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    completedItem: {
        color: 'red',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },

    notCompletedItem: {
        color: '#313131'
    }
});