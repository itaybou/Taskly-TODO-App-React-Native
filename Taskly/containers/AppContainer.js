import React from 'react';
import InputBar from './InputBar';
import TasksContainer from './TasksContainer'
import { StyleSheet, View } from 'react-native';

export default class AppContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <InputBar/>
                <TasksContainer screen={this.props.screen} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
});