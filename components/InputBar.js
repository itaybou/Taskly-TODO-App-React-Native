import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

const InputBar = (props) => {
    return ( //Add clear task from text input on press
        <View style={styles.inputContainer}>
            <TextInput style={styles.input}
                value={props.input}
                placeholder="Enter A new task"
                placeholderTextColor="#c7c7c7"
                underlineColorAndroid='transparent'
                onChangeText={ (input) => props.textChange(input) }/>
            <TouchableOpacity style={styles.button} onPress={props.addTask}> 
                <Text style={styles.buttonText}>ADD</Text>
            </TouchableOpacity>
        </View>
    );
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
        fontSize: 18,
        height: 40,
        margin: 2,
        textAlign: 'center',
        borderRadius: 10
    },

    button: {
        width: 100,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonText: {
        color: 'black',
        fontSize: 20,
        fontWeight: '900'
    }
});

export default InputBar;