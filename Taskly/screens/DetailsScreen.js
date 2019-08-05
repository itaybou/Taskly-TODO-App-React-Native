import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const DetailsScreen = (props) => {
    return (
        <View style={styles.container}>
            <Text>Hello</Text>
        </View>
)};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
});

export default DetailsScreen;