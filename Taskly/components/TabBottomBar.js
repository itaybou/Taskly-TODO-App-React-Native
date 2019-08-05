import React from "react";
import posed from "react-native-pose";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TabCount, windowWidth, FilterTabs } from '../data/Constants'
import { changeVisibility } from "../data/actions/Actions";
import { connect } from 'react-redux'

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
    const {
        renderIcon,
        getLabelText,
        activeTintColor,
        inactiveTintColor,
        onTabPress,
        onTabLongPress,
        getAccessibilityLabel,
        navigation
    } = props;
    const { routes, index: activeRouteIndex } = navigation.state;
    return (
        <View style={styles.container}>
            <View style={StyleSheet.absoluteFillObject}>
                <SpotLight style={styles.spotLight} pose={`route${activeRouteIndex}`}>
                    <View style={styles.spotLightInner} />
                </SpotLight>
            </View>
            {routes.map((route, routeIndex) => {
                const isRouteActive = routeIndex === activeRouteIndex;
                const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;
    
            return (
                <TouchableOpacity
                    key={routeIndex}
                    style={styles.tabButton}
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
                    <IconScaler style={styles.scaler} pose={isRouteActive ? "active" : "inactive"}>
                        {renderIcon({ route, focused: isRouteActive, tintColor })}
                    </IconScaler>
                    <Text style={styles.tabText}>{getLabelText({ route })}</Text>
                </TouchableOpacity>
            );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        backgroundColor: '#fcfcfc',
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
        backgroundColor: "#ee0000",
        opacity:0.5,
        borderRadius: 50
    },

    scaler: { 
        flex: 1,
        padding: 6,
        alignItems: "center", 
        justifyContent: "center" 
    }
});

export default connect()(TabBar);