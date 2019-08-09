import React from 'react';
import InputBar from './InputBar';
import CategoryTitleBar from '../components/CategoryTitleBar';
import TasksContainer from './TasksContainer'
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { withTheme } from '../data/Theme'

class AppContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        this.setState({isLoading: false});
    }

    render() {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            this.state.isLoading ?
                <ActivityIndicator
                    style={{ flex: 1, backgroundColor: theme.background}}
                    color={theme.accent_primary}
                    size="large"
                /> :             
                <View style={style.container}>
                    <InputBar/>
                    <CategoryTitleBar />
                    <TasksContainer navigation={this.props.navigation} />
                </View>
        );
    }
}

const styles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },
});

export default withTheme(AppContainer);