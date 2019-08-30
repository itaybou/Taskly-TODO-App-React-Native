import React from "react";
import posed from "react-native-pose";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TabCount, windowWidth } from '../data/Constants'
import { changeVisibility } from "../data/actions/Actions";
import { connect } from 'react-redux'
import { withTheme } from '../data/Theme'

const tabWidth = windowWidth / TabCount;

const SpotLight = posed.View({
    route0: { x: 0 },
    route1: { x: tabWidth },
    route2: { x: tabWidth * 2 },
});

const IconScaler = posed.View({
    active: { scale: 1.25 },
    inactive: { scale: 1 }
});

const TabBar = props => {
    const theme = props.theme;
    const style = styles(theme);
    const {
        renderIcon,
        getLabelText,
        onTabPress,
        onTabLongPress,
        getAccessibilityLabel,
        navigation
    } = props;

    const tint = {
        activeTintColor: theme.activeTintColor,
        inactiveTintColor: theme.inactiveTintColor
    }
    const { routes, index: activeRouteIndex } = navigation.state;
    return (
        <View style={style.container}>
            <View style={StyleSheet.absoluteFillObject}>
                <SpotLight style={style.spotLight} pose={`route${activeRouteIndex}`}>
                    <View style={style.spotLightInner} />
                </SpotLight>
            </View>
            {routes.map((route, routeIndex) => {
                const isRouteActive = routeIndex === activeRouteIndex;
                const tintColor = isRouteActive ? tint.activeTintColor : tint.inactiveTintColor;
    
            return (
                <TouchableOpacity
                    key={routeIndex}
                    style={style.tabButton}
                    onPress={() => {
                        props.dispatch(changeVisibility(route));
                        onTabPress({ route });
                    }}
                    onLongPress={() => { 
                        props.dispatch(changeVisibility(route));
                        onTabLongPress({ route }); 
                    }}
                    accessibilityLabel={ getAccessibilityLabel({ route }) }
                >
                    <IconScaler style={style.scaler} pose={isRouteActive ? "active" : "inactive"}>
                        {renderIcon({ route, focused: isRouteActive, tintColor })}
                    </IconScaler>
                    <Text style={style.tabText}>{getLabelText({ route })}</Text>
                </TouchableOpacity>
            );
            })}
        </View>
    );
}

const styles = (theme) => StyleSheet.create({
    container: { 
        backgroundColor: theme.tab_bar,
        flexDirection: "row", 
        height: 55, 
        elevation: 2,
        alignItems: "center"
    },

    tabButton: { 
        flex: 1,
        alignItems: "center", 
        justifyContent: "center" 
    },

    tabText: {
        color: theme.primary_text,
        fontSize: 12,
        flex: 1,
    },

    spotLight: {
        width: tabWidth,
        height: "100%",
        alignItems: "center", 
        justifyContent: "center" 
    },

    spotLightInner: {
        width: tabWidth/1.5,
        height: 50, 
        backgroundColor: theme.tintHighlight,
        borderRadius: 50
    },

    scaler: { 
        flex: 1,
        padding: 6,
        alignItems: "center", 
        justifyContent: "center" 
    }
});

export default connect()(withTheme(TabBar));