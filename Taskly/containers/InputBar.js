import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { addTask } from '../data/actions/Actions'

class InputBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: ''
        }
    }

    addTask = (input) => {
        this.props.dispatch(addTask(input, this.props.task_id));
        this.setState({input: ''})
    }

    render () {
        return ( //Add clear task from text input on press
            <View style={styles.inputContainer}>
                <TextInput style={styles.input}
                    value={this.state.input}
                    placeholder="Enter A new task"
                    placeholderTextColor="#c7c7c7"
                    underlineColorAndroid='transparent'
                    onChangeText={ (input) => this.setState({input}) }/>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={ () => {
                        Keyboard.dismiss();
                        (this.state.input !== '') ? this.addTask(this.state.input) 
                        : Alert.alert("Task title is empty", "New tasks must have a title so you can identify them.");
                    }}>
                    <Icon
                        name='plus'
                        type='feather'
                        color='#6B3C2A'
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',

        paddingHorizontal: 3
    },

    input: {
        backgroundColor: '#ededed',
        flex: 1,
        fontSize: 13,
        height: 40,
        margin: 2,
        textAlign: 'center',
        borderRadius: 10
    },

    button: {
        width: 60,
        margin: 2,
        borderRadius: 50,
        flexDirection: 'row',
        backgroundColor: '#F68B5F',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8
    },

    buttonText: {
        flex: 1,
        color: 'black',
        fontSize: 15,
        fontWeight: '900'
    },

    addIcon: {
        flex: 1,
        height: 20,
        resizeMode: 'contain'
    }
});

const mapStateToProps = (state) => {
    return ({
    task_id: state.tasks.task_id
})};

export default connect(mapStateToProps)(InputBar);