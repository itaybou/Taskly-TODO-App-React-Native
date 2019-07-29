import React from 'react';
import { StyleSheet, Text, Button, TouchableOpacity } from 'react-native';

export default class Item extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const item = this.props.item;
        console.log(item);
        return (
            <TouchableOpacity 
                style={styles.item}
                onPress={ () => this.props.toggleCompleted() }
            >
                <Text style={item.completed ? styles.completedItem : styles.notCompletedItem}>
                    {item.task}
                </Text>
                <Button
                    title="Remove"
                    color={item.completed ? 'rgba(255, 0, 0, 1)' : 'rgba(200, 0, 0, 0.3)'}
                    onPress={ () => this.props.removeItem() }
                />
            </TouchableOpacity>
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

    completedItem: {
        color: 'red',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },

    notCompletedItem: {
        color: '#313131'
    }
});