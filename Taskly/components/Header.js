import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Header = (props) => {    // State-less component
    return (
    <View style={styles.header}>
        <Text style={styles.title}>{props.title}</Text>
    </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#66CDAA',
        height: 80,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 8
    },

    title: {
        color: '#000000',
        fontSize: 25,
        fontWeight: '900',
        textTransform: 'uppercase'
    }
});

export default Header;