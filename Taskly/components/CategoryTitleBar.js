import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { clearCompleted } from '../data/actions/Actions'

const CategoryTitleBar = props => { 
    return (
        <View style={styles.container}>
            <View style={styles.categoryTitleContainer}>
                <Text style={styles.categoryName}>{props.category_name}</Text>
            </View>
            <View style={styles.informationContainer}>
                <View style={styles.taskCount}>
                    <Icon
                        size={12}
                        name={'hash'}
                        type='feather'
                        color='#000000'
                    />
                    <Text style={styles.informationText}> {props.taskList.length}</Text>
                </View>
                <View style={styles.filter}>
                    <View style={styles.filter}>
                        <TouchableOpacity onPress={() => props.clearCompleted(props.taskList)}>
                            <Text style={styles.informationText}>Clear completed</Text>
                        </TouchableOpacity>
                    </View>
                    <Icon
                        size={16}
                        name={'filter'}
                        type='feather'
                        color='#000000'
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderWidth: 0,
        flexDirection: "column",
        backgroundColor: '#F8F8F8',
        marginBottom: 5,
        marginTop: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        height: 40, 
        alignItems: "center",
        justifyContent: "space-between"
    },

    categoryTitleContainer: {
        width: '100%',
        flex: 1,
        borderBottomWidth: 0,
        borderBottomColor: '#FADF5E',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },

    informationContainer: {
        width: '100%',
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    categoryName: { 
        fontWeight: '400',
        fontSize: 18,
        fontFamily: 'sans-serif-medium',
        letterSpacing: 0,
        textShadowRadius: 1,
        textShadowOffset: {
            width: 0,
            height: 1
        }
    },

    taskCount: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginStart: 20
    },

    filter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginEnd: 12,
    },

    informationText: {
        fontSize: 12
    }

});

const mapStateToProps = (state) => {
    return ({
    taskList: state.tasks.taskList.filter(task => task.category_id === state.categories.curr_cat_id),
    category_name: state.categories.catList.find(cat => cat.id === state.categories.curr_cat_id).title
    
})};

const mapDispatchToProps = dispatch => ({
    clearCompleted: taskList => dispatch( clearCompleted(taskList)), 
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryTitleBar);