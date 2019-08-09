import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { withTheme } from '../data/Theme'

const CategoryTitleBar = props => {
    const theme = props.theme;
    const style = styles(theme);
    return (
        <View style={style.container}>
            <View style={style.categoryTitleContainer}>
                <Text style={style.categoryName}>{props.category.title}</Text>
                <Icon
                    containerStyle={{marginLeft: 10}}
                    size={20}
                    name={'ios-egg'}
                    type='ionicon'
                    color={props.category.color}
                />
            </View>
        </View>
    );
}

const styles = (theme) => StyleSheet.create({
    container: {
        width: '100%',
        borderWidth: 0,
        flexDirection: "column",
        backgroundColor: theme.background_selected,
        marginBottom: 2,
        marginTop: 2,
        borderBottomWidth: 1,
        borderBottomColor: theme.separator,
        height: 30, 
        alignItems: "center",
        justifyContent: "space-between"
    },

    categoryTitleContainer: {
        width: '100%',
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },

    categoryName: {
        color: theme.primary_text,
        fontWeight: '400',
        fontSize: 18,
        fontFamily: 'sans-serif-medium',
        letterSpacing: 0,
        textShadowRadius: 1,
        textShadowOffset: {
            width: 0,
            height: 1
        }
    }

});

const mapStateToProps = (state) => {
    const currentCategory = state.categories.curr_cat_id;
    return ({
        category: state.categories.catList.find(cat => cat.id === currentCategory),
})};

export default connect(mapStateToProps)(withTheme(CategoryTitleBar));