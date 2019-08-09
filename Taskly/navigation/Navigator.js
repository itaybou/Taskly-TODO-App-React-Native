import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, createDrawerNavigator} from 'react-navigation';
import TaskScreen from '../screens/TaskScreen';
import DetailsScreen from '../screens/DetailsScreen';
import TabBottomBar from '../components/TabBottomBar';
import { HeaderBackground, HeaderLogo, HeaderDrawer, HeaderDetails } from '../components/Header';
import CategoryDrawer from '../containers/CategoryDrawer';
import { Icon } from 'react-native-elements'
import { FilterTabs, windowWidth } from '../data/Constants'
import EditTaskScreen from '../screens/EditTaskScreen';

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
        [FilterTabs.COMPLETED]: routeOptions
    },
    {
        tabBarComponent: TabBottomBar,
        tabBarOptions: {
            tabBarPosition: 'bottom',
            animationEnabled: true,
            swipeEnabled: true,
        }
    }
);

const CategoryNavigator = createDrawerNavigator({
        Home: TaskFilterTabs
    }, 
    {
        contentComponent: CategoryDrawer,
        drawerWidth: windowWidth/1.5
});

const navigationOptions = ({navigation}) => {
    return {
        headerBackground: <HeaderBackground/>,
        headerTitle: <HeaderLogo/>,
        headerLeft: <HeaderDrawer navigation={navigation}/>,
        headerRight: <HeaderDetails navigation={navigation}/>
    };
}

const StackNavigator = createStackNavigator({
        Tasks: CategoryNavigator,
        Details: DetailsScreen,
        Edit_Task: EditTaskScreen
    },
    {
        defaultNavigationOptions: navigationOptions
});

export default createAppContainer(StackNavigator);
