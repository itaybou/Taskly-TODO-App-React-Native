import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { CheckBox, Icon } from 'react-native-elements'

export default class Task extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const item = this.props.item;
        return (
            <SwipeRow
                closeOnRowPress={true}
                disableRightSwipe={true}
                swipeToOpenPercent={30}
                swipeToClosePercent={0}
                rightOpenValue={-60}
            >
                <View style={item.completed ? styles.itemSwipeCompleted : styles.itemSwipeNotCompleted}>
                    <TouchableOpacity
                        style={styles.deleteIcon}
                        onPress={ () => this.props.removeTask() }>
                        <Icon
                            style={styles.deleteIcon}
                            name={'trash-2'}
                            type={'feather'}
                            color={'#000000'}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.item}>
                    <CheckBox
                        size={25}
                        iconType={'feather'}
                        checkedIcon={'check-square'}
                        uncheckedIcon={'square'}
                        containerStyle={styles.checkBox}
                        checked={item.completed}
                        checkedColor= {'#E03A02'}
                        title={item.title}
                        onPress={ () => this.props.toggleCompleted() }
                        textStyle={item.completed ? styles.textCompleted : styles.textNotCompleted}
                    />
                </View>
            </SwipeRow>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        width: '100%',
        height: 42,
        padding: 0,
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF'
    },

    itemSwipeCompleted: {
        width: '100%',
        height: 42,
        padding: 16,
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#F86C5F'
    },

    itemSwipeNotCompleted: {
        width: '100%',
        height: 42,
        padding: 16,
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#FA988F'
    },

    checkBox: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        borderColor: 'transparent'
    },

    deleteIcon: {
        height: 22,
        opacity: 0.4,
        resizeMode: 'contain'
    },

    textCompleted: {
        opacity: 0.3,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },

    textNotCompleted: {
        opacity: 1
    }
});