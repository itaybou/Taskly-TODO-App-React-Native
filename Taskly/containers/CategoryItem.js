import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Share} from 'react-native';
import { connect } from 'react-redux'
import {switchCategory, changeCategoryColor } from '../data/actions/Actions'
import { Icon } from 'react-native-elements'
import { defaultCategoryDetails } from '../data/Constants'
import tinycolor from 'tinycolor2';
import ColorPickModal from '../components/modals/ColorPickModal'
import { withTheme } from '../data/Theme'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

class CategoryItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isColorPickVisible: false,
            menu: null
        }
    }

    setMenuRef = ref => {
        this.state.menu = ref;
    };

    hideMenu = () => {
        this.state.menu.hide();
    };
    
    showMenu = () => {
        this.state.menu.show();
    };

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

    toggleShare() {
        const item = this.props.item;
        let shareMessage = `📄 Category: ${item.title}\n`;
        if(this.props.category_tasks.length > 0) {
            this.props.category_tasks.forEach( task => shareMessage = shareMessage + `\t▪️ ${task.completed? '✅' : '⬜️'} ${task.title}\n`)
        } else shareMessage = shareMessage + 'No tasks.'
        shareMessage = shareMessage + `Sent via Taskly`;
        this.hideMenu();
        Share.share({
            title: `Taskly Category share: ${item.title}`,
            message: shareMessage
        },
        {
            dialogTitle: 'Share category tasks details via: ',
        })
    }

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
                    <TouchableOpacity
                                style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: '20%'}}
                                onPress={this.showMenu}
                    >
                        <View style={{flex: 1}}>
                            <Menu
                                ref={this.setMenuRef}
                                style={{backgroundColor: theme.background_selected, }}
                                button={
                                        <Icon
                                            containerStyle={{marginEnd: 10}}
                                            size={24}
                                            name={'more-vertical'}
                                            type='feather'
                                            color={theme.icons}
                                        />
                                }
                            >
                                <MenuItem textStyle={{color: theme.primary_text}} onPress={this.toggleShare.bind(this)}>Rename</MenuItem>
                                <MenuDivider color={theme.activeTintColor}/>
                                <MenuItem textStyle={{color: theme.primary_text}} onPress={this.toggleShare.bind(this)}>Share</MenuItem>
                                <MenuDivider color={theme.activeTintColor}/>
                                <MenuItem textStyle={{color: theme.primary_text}} onPress={this.toggleShare.bind(this)}>Remove</MenuItem>
                                <MenuDivider color={theme.activeTintColor}/>
                            </Menu>
                        </View>
                    </TouchableOpacity>
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
        width: '60%',
        marginLeft: 10
    },

    categoryTitle: {
        color: theme.primary_text,
        fontSize: 14
    }
});

const mapStateToPropsFactory = (state, ownProps) => {
    return function mapStateToProps(state) {
        return {
            current_category: state.categories.curr_cat_id,
            category_tasks: state.tasks.taskList.filter(task => task.category_id === ownProps.item.id)
        }
    }
};

const mapDispatchToProps = (dispatch) => ({
    switchCategory: cat => dispatch( switchCategory(cat)),
    changeCategoryColor: (color, category) => dispatch(changeCategoryColor(color, category))
})

export default connect(mapStateToPropsFactory, mapDispatchToProps)(withTheme(CategoryItem));