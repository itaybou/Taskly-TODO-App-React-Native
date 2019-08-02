import React from 'react';
import { createBottomTabNavigator, createAppContainer} from 'react-navigation';
import TaskScreen from '../screens/TaskScreen';
import TabBottomBar from '../components/TabBottomBar';
import { Icon } from 'react-native-elements'
import { FilterTabs } from '../data/Constants'

const getIcons = (navigation) => {
    const { routeName } = navigation.state;
    switch (routeName) {
        case FilterTabs.ALL:
            return 'format-list-bulleted';
        case FilterTabs.ACTIVE:
            return 'filter-center-focus';
        case FilterTabs.COMPLETED:
            return 'playlist-add-check';
    }
}
const commonNavigationOptions = ({ navigation }) => ({
    header: null,
    tabBarIcon:({tintColor}) => {
        let iconName = getIcons(navigation);
        return (
            <Icon
            name={iconName}
            type='material'
            color={tintColor}
            />
        );
    },
    title: navigation.state.routeName,
});

const routeOptions = {
    screen: TaskScreen,
    navigationOptions: commonNavigationOptions
};

const TaskFilterTabs = createBottomTabNavigator({
    [FilterTabs.ALL]: routeOptions,
    [FilterTabs.ACTIVE]: routeOptions,
    [FilterTabs.COMPLETED]: routeOptions,
    },
    {
        tabBarComponent: TabBottomBar,
        tabBarOptions: {
            activeTintColor: "#eeeeee",
            inactiveTintColor: "#222222",
            tabBarPosition: 'bottom',
            animationEnabled: true,
            swipeEnabled: true,
        }
    }
);

export default createAppContainer(TaskFilterTabs);
