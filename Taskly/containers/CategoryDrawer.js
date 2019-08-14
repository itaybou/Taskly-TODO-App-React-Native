import React from 'react';
import { StyleSheet, View, Text, InteractionManager, TouchableOpacity, Dimensions} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import { connect } from 'react-redux'
import CategoryItem from './CategoryItem'
import { addCategory, arrangeCategories, changeTheme } from '../data/actions/Actions'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { withTheme, THEME_TYPE } from '../data/Theme'
import AddCategoryModal from '../components/modals/AddCategoryModal'


class CategoryDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            didFinishInitialAnimation: false,
            isAddVisible: false
        };
    }

    componentWillMount() {
        this.props.screenProps.toggleTheme();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                didFinishInitialAnimation: true,
            });
        });
    }

    toggleAddCategoryModal = () => {
        this.setState({ isAddVisible: !this.state.isAddVisible });
    };

    
    changeTheme = () => {
        const next_theme = this.props.theme.name === THEME_TYPE.LIGHT ? THEME_TYPE.DARK : THEME_TYPE.LIGHT;
        this.props.changeTheme(next_theme);
        this.props.screenProps.toggleTheme();
        this.props.navigation.closeDrawer();
    }

    keyExtractor = (item, index) => item.id.toString();

    render() {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            <View style={{flex: 1, backgroundColor: theme.background}}>
                <Header 
                    placement="left"
                    barStyle="light-content" // or directly
                    containerStyle={{
                        backgroundColor: theme.separator,
                        justifyContent: 'space-around',
                        flex: 0.1
                    }}
                >
                <View></View>
                <Text style={{color: theme.primary_text, fontSize: 20, fontWeight: 'bold'}}>Categories</Text>
                <View></View>
                </Header>
                <DraggableFlatList 
                    style={{flex: 1, marginTop: 10}}
                    data={ this.props.catList }
                    extraData = {this.props.catList}
                    keyExtractor={this.keyExtractor}
                    scrollPercent={5}
                    onMoveEnd={({ data }) => this.props.arrangeCategories(data)}
                    renderItem={ ({item, index, move, moveEnd, isDragged}) => 
                        <CategoryItem
                            item={item}
                            move={move}
                            moveEnd={moveEnd}
                            isDragged={isDragged}
                            closeDrawer={this.props.navigation.closeDrawer}
                        />
                    }
                />
                <View style={{flex: 0.2, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginStart: 10, backgroundColor: theme.background}}>    
                <TouchableOpacity 
                        style={style.button} 
                        onPress={this.changeTheme}>
                        <Icon
                            name='ios-contrast'
                            type='ionicon'
                            color={theme.button_icons}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={style.button} 
                        onPress={this.toggleAddCategoryModal}>
                        <Icon
                            name='plus'
                            type='feather'
                            color={theme.button_icons}
                        />
                    </TouchableOpacity>
                    <AddCategoryModal 
                        categoryId={this.props.nextCategoryId} 
                        isAddVisible={this.state.isAddVisible} 
                        toggleModal={this.toggleAddCategoryModal}
                        addCategory={this.props.addCategory}
                        changeColor={this.props.changeCategoryColor}
                    />
                </View>
            </View>
        );
    }
}

const styles = (theme) => StyleSheet.create({
    button: {
        width: 50,
        height: 50,
        marginEnd: 15,
        marginBottom: 25,
        borderRadius: 50,
        flexDirection: 'row',
        backgroundColor: theme.accent_secondary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8
    },

    content: {
        height: Dimensions.get('window').height * 0.25,
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },

    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },

    modalContainer: {
        height: Dimensions.get('window').height * .3,
        width: Dimensions.get('window').width,
        backgroundColor: 'red'
    }
});

const mapStateToProps = (state) => {
    return ({
    nextCategoryId: state.categories.cat_id,
    catList: state.categories.catList,
})};

const mapDispatchToProps = dispatch => ({
    addCategory: (title, id, color) => dispatch(addCategory(title, id, color)),
    arrangeCategories: (data) => dispatch(arrangeCategories(data)),
    changeCategoryColor: (color, category) => dispatch(changeCategoryColor(color, category)),
    changeTheme: (themeName) => dispatch(changeTheme(themeName))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CategoryDrawer));