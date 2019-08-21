import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Share, Alert} from 'react-native';
import { connect } from 'react-redux'
import {switchCategory, changeCategoryColor, renameCategory, removeCategory, removeAllCategory } from '../data/actions/Actions'
import { Icon } from 'react-native-elements'
import { defaultCategoryDetails, maxCategoryNameLength } from '../data/Constants'
import tinycolor from 'tinycolor2';
import ColorPickModal from '../components/modals/ColorPickModal'
import InputModal from '../components/modals/InputModal'
import { withTheme } from '../data/Theme'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import MoveToCategoryModal from '../components/modals/MoveToCategoryModal';

class CategoryItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isColorPickVisible: false,
            isRenameVisible: false,
            isRemoveVisible: false,
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
        this.setState({ isColorPickVisible: !this.state.isColorPickVisible }, () => this.hideMenu());
    };

    toggleRename = () => {
        this.setState({ isRenameVisible: !this.state.isRenameVisible }, () => this.hideMenu());
    };

    toggleRemove = () => {
        this.setState({ isRemoveVisible: !this.state.isRemoveVisible }, () => this.hideMenu());
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

    remove() {
        this.hideMenu();
        Alert.alert(
            'Remove task category',
            `Are you sure you want to remove the category '${this.props.item.title}'?`,
            [
                {
                    text: 'Yes', onPress: () => {
                        Alert.alert('Category tasks', `Do you want to remove all tasks from category '${this.props.item.title}'?`,
                        [
                            {
                                text: 'Remove all tasks',
                                onPress: () => {
                                    this.props.removeAllCategory(this.props.item);
                                    this.props.removeCategory(this.props.item);
                                }
                            },
                            {
                                text: 'Move to other category',
                                onPress: () => {this.toggleRemove()}
                            },
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            }
                        ]);
                    }
                },
                {
                    text: 'No',
                    style: 'cancel',
                }
            ],
            {cancelable: true},
        );
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
                                {this.props.item.id !== defaultCategoryDetails.id ? 
                                    <View>
                                       <MenuItem textStyle={{color: theme.primary_text}} onPress={this.toggleRename.bind(this)}>Rename</MenuItem>
                                        <MenuDivider color={theme.activeTintColor}/>
                                        <MenuItem textStyle={{color: theme.primary_text}} onPress={this.toggleColorPick.bind(this)}>Set color</MenuItem>
                                        <MenuDivider color={theme.activeTintColor}/>
                                    </View> : <View/> }
                                <MenuItem textStyle={{color: theme.primary_text}} onPress={this.toggleShare.bind(this)}>Share</MenuItem>
                                <MenuDivider color={theme.activeTintColor}/>
                                {this.props.item.id !== defaultCategoryDetails.id ? 
                                    <View>
                                    <MenuItem textStyle={{color: theme.primary_text}} onPress={this.remove.bind(this)}>Remove</MenuItem>
                                    <MenuDivider color={theme.activeTintColor}/>
                                    </View> : <View/>
                                }
                            </Menu>
                        </View>
                    </TouchableOpacity>
                </View>
                <ColorPickModal isVisible={this.state.isColorPickVisible} setColor={this.setCategoryColor} toggle={this.toggleColorPick} defaultColor={this.props.item.color} title={this.props.item.title}/>
                <InputModal 
                    isVisible={this.state.isRenameVisible}
                    edit={true}
                    previous={this.props.item.title}
                    title='Rename category' 
                    placeholder='Enter new category name'
                    maxInput={maxCategoryNameLength} 
                    approve={this.props.renameCategory}
                    toggleModal={this.toggleRename}
                    item={this.props.item}
                    fontSize={14}
                    height={0.25}
                />
                <MoveToCategoryModal
                    isVisible={this.state.isRemoveVisible}
                    title={`Choose a category to move all tasks from category '${this.props.item.title}':`}
                    approve={() => this.props.removeCategory(this.props.item)}
                    categories={this.props.categories}
                    item={this.props.item}
                    toggle={this.toggleRemove.bind(this)}
                />
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
            category_tasks: state.tasks.taskList.filter(task => task.category_id === ownProps.item.id),
            categories: state.categories.catList
        }
    }
};

const mapDispatchToProps = (dispatch) => ({
    switchCategory: cat => dispatch( switchCategory(cat)),
    changeCategoryColor: (color, category) => dispatch(changeCategoryColor(color, category)),
    renameCategory: (name, category) => dispatch(renameCategory(name, category)),
    removeCategory: (category) => dispatch(removeCategory(category)),
    removeAllCategory: (category) => dispatch(removeAllCategory(category))
});

export default connect(mapStateToPropsFactory, mapDispatchToProps)(withTheme(CategoryItem));