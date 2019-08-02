import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Header = (props) => {    // State-less component
    return (
        <LinearGradient
            colors={['#FFE27C', '#ffd027']}
            style={styles.header}
            start={{ x: 1, y: 1 }}
            end={{ x: 1, y: 0 }}
        >
            <Image 
                style={styles.logo}
                source={require('../assets/logo.png')}
            />
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 80,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 8
    },

    title: {
        fontSize: 25,
        fontWeight: '900',
        textTransform: 'uppercase'
    },

    logo: {
        height: 35,
        resizeMode: 'contain'
    }
});

export default Header;