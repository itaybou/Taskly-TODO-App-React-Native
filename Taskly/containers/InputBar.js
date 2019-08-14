import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { maxTaskTitleLength } from '../data/Constants'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { withTheme } from '../data/Theme'
import { addTask } from '../data/actions/Actions'

class InputBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: ''
        }
    }

    addTask = (input) => {
        this.props.dispatch(addTask(input, this.props.task_id, this.props.cat_id));
        this.setState({input: ''})
    }

    render () {
        const theme = this.props.theme;
        const style = styles(theme);
        return ( //Add clear task from text input on press
            <View style={style.inputContainer}>
                <TextInput style={style.input}
                    value={this.state.input}
                    selectTextOnFocus={ true }
                    removeClippedSubviews={ false }
                    placeholder="Enter A new task"
                    placeholderTextColor={theme.placeholder_text}
                    underlineColorAndroid='transparent'
                    selectionColor={theme.accent_secondary}
                    onChangeText={ (input) => this.setState({input}) }/>
                <TouchableOpacity 
                    style={style.button} 
                    onPress={ () => {
                        Keyboard.dismiss();
                        (this.state.input !== '') ? (
                            (this.state.input.length <= maxTaskTitleLength) ?
                            this.addTask(this.state.input) :
                            Alert.alert("Task title length exceeded", `New tasks must have a maximum title length of ${maxTaskTitleLength} characters.`))
                        : Alert.alert("Task title is empty", "New tasks must have a title so you can identify them.");
                    }}>
                    <Icon
                        name='plus'
                        type='feather'
                        color={theme.button_icons}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = (theme) => StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 3,
        paddingTop: 3
    },

    input: {
        color: theme.primary_text,
        backgroundColor: theme.text_box,
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
        backgroundColor: theme.accent_secondary,
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
    task_id: state.tasks.task_id,
    cat_id: state.categories.curr_cat_id
})};

export default connect(mapStateToProps)(withTheme(InputBar));