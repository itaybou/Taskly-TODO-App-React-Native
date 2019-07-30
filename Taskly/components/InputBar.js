import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';

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
                <Image 
                    style={styles.addIcon}
                    source={require('../assets/add_icon.png')}
                />
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
        fontSize: 13,
        height: 40,
        margin: 2,
        textAlign: 'center',
        borderRadius: 10
    },

    button: {
        width: 100,
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

export default InputBar;