import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux'
import {switchCategory, changeCategoryColor } from '../data/actions/Actions'
import { Icon } from 'react-native-elements'
import { defaultCategoryDetails } from '../data/Constants'
import tinycolor from 'tinycolor2';
import ColorPickModal from '../components/modals/ColorPickModal'
import { withTheme } from '../data/Theme'

class CategoryItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isColorPickVisible: false,
        }
    }

    switchCategory = () => {
        this.props.switchCategory(this.props.item);
        this.props.closeDrawer();
    }

    setCategoryColor = (color) => {
        this.props.changeCategoryColor(tinycolor(color).toHslString(), this.props.item);
        this.toggleColorPick();
    };

    toggleColorPick = () => {
        this.setState({ isColorPickVisible: !this.state.isColorPickVisible });
    };

    render() {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            <TouchableOpacity 
                onPress={this.switchCategory.bind(this)}     
                onLongPress={this.props.move}
                onPressOut={this.props.moveEnd}
            >
                <View style={[style.categoryContainer, {backgroundColor: this.props.current_category === this.props.item.id ? theme.background_selected : theme.background}]}>
                    <View style={[style.categoryColorContainer, {backgroundColor: 'transparent'}]}>
                        {
                            this.props.item.id !== defaultCategoryDetails.id ?
                                <TouchableOpacity onPress={this.toggleColorPick}>
                                    <Icon
                                        containerStyle={style.taskIcons}
                                        size={50}
                                        name={'primitive-dot'}
                                        type='octicon'
                                        color={this.props.item.color}
                                    />
                                </TouchableOpacity> :
                                <Icon
                                    containerStyle={style.taskIcons}
                                    size={22}
                                    name={'bookmark'}
                                    type='feather'
                                    color={theme.icons}
                                />
                        }
                    </View>
                    <View style={style.categoryNameContainer}>
                        <Text style={style.categoryTitle} numberOfLines={1}>{this.props.item.title}</Text>
                    </View>
                </View>
                <ColorPickModal isVisible={this.state.isColorPickVisible} setColor={this.setCategoryColor} toggle={this.toggleColorPick} defaultColor={this.props.item.color} title={this.props.item.title}/>
            </TouchableOpacity>
        );
    }
}

const styles = (theme) => StyleSheet.create({
    categoryContainer: {
        width: '100%',
        height: 42,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: theme.separator
    },

    content: {
        height: '35%',
        backgroundColor: theme.background,
        padding: 22,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },

    categoryColorContainer: {
        width: '15%',
        height: '100%',
        marginStart: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },

    categoryNameContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        marginLeft: 10
    },

    categoryTitle: {
        color: theme.primary_text,
        fontSize: 14
    }
});

const mapStateToProps = (state) => {
    return ({
        current_category: state.categories.curr_cat_id
})};

const mapDispatchToProps = (dispatch) => ({
    switchCategory: cat => dispatch( switchCategory(cat)),
    changeCategoryColor: (color, category) => dispatch(changeCategoryColor(color, category))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CategoryItem));