import React from 'react';
import AppContainer from '../containers/AppContainer';

const TaskScreen = (props) =>
    <AppContainer screen={props.navigation.state.key} {...props} />;


export default TaskScreen;
    