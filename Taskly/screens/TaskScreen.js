import React from 'react';
import AppContainer from '../containers/AppContainer';

const TaskScreen = (props) =>
    <AppContainer navigation={props.navigation} {...props} />;

export default TaskScreen;