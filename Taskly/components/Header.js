import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { additionalScreens } from '../data/Constants'

export const HeaderBackground = (props) =>
    <LinearGradient
        colors={['#FFE27C', '#ffd027']}
        style={styles.headerBackground}
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
    />

export const HeaderLogo = (props) =>
    <Image 
        style={styles.logo}
        source={require('../assets/logo.png')}
    />

export const HeaderDrawer = (props) => {
    const additional = additionalScreens.includes(props.navigation.state.routeName);
    return additional ? <View></View> :
        (
            <TouchableWithoutFeedback onPress={() => props.navigation.toggleDrawer()}>
                <Icon
                    containerStyle={styles.buttonLeft}
                    size={24}
                    name={'menu'}
                    type={'feather'}
                    color={'#000000'}
                />
            </TouchableWithoutFeedback>
    )
}

export const HeaderDetails = (props) => {
    const subScreen = additionalScreens.includes(props.navigation.state.routeName);
    return (
        <TouchableWithoutFeedback onPress={() => 
            subScreen ?
                props.navigation.navigate("Tasks") :
                props.navigation.navigate("Details")
            }
        >
            <Icon
                containerStyle={styles.buttonRight}
                size={24}
                name={subScreen ? 'arrow-left-circle' : 'help-circle'}
                type={'feather'}
                color={'#000000'}
            />
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    headerBackground: {
        width: '100%',
        height: '100%'
    },

    logo: {
        flex: 1,
        height: 35,
        resizeMode: 'contain'
    },

    buttonLeft: {
        marginStart: 10
    },

    buttonRight: {
        marginEnd: 10
    }
});