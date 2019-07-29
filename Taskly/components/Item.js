import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { CheckBox } from 'react-native-elements'

export default class Item extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const item = this.props.item;
        console.log(item);
        return (
            <View style={styles.item}>
                <CheckBox
                    style={styles.checkBox}
                    checked={item.completed}
                    checkedColor= {'red'}
                    onPress={ () => this.props.toggleCompleted() }
                    title={item.task}
                />
                <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={ () => this.props.removeItem() }>
                    <Image 
                    style={item.completed? styles.deleteIconCompleted : styles.deleteIconNotCompleted}
                    source={require('../assets/remove-icon.png')}
                    />
                </TouchableOpacity>
            </View>
        );
        }
}

const styles = StyleSheet.create({
    item: {
        width: '100%',
        height: 40,
        padding: 15,
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    checkBox: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: 'white'
    },

    deleteIcon: {
        height: 25,
        width: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    deleteIconCompleted: {
        opacity: 1,
        width:25,
        resizeMode: 'contain'
    },

    deleteIconNotCompleted: {
        opacity: 0.5,
        width: 25,
        resizeMode: 'contain'
    }
});