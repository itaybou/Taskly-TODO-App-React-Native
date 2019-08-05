import React from 'react';
import { StyleSheet, View, Text, Button} from 'react-native';
import { connect } from 'react-redux'
import {switchCategory, changeCategoryColor } from '../data/actions/Actions'
import { Icon } from 'react-native-elements'
import Modal from "react-native-modal";
import { TouchableOpacity } from 'react-native-gesture-handler';
import ColorPalette from 'react-native-color-palette'
import { colorPicks, defaultCategoryDetails } from '../data/Constants'

class CategoryItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isColorPickVisible: false
        }
    }

    toggleColorPick = () => {
        this.setState({ isColorPickVisible: !this.state.isModalVisible });
    };

    render() {
        return (
            <TouchableOpacity 
                onPress={() => this.props.switchCategory(this.props.item)}         
                onLongPress={this.props.move}
                onPressOut={this.props.moveEnd}
            >
            <View style={[styles.categoryContainer, {backgroundColor: this.props.current_category === this.props.item.id ? '#F2F2F2' : '#FFFFFF'}]}>
                <View style={[styles.categoryColorContainer, {backgroundColor: 'transparent'}]}>
                    {
                        this.props.item.id !== defaultCategoryDetails.id ?
                            <TouchableOpacity onPress={this.toggleColorPick}>
                                <Icon
                                    containerStyle={styles.taskIcons}
                                    size={50}
                                    name={'primitive-dot'}
                                    type='octicon'
                                    color={this.props.item.color}
                                />
                            </TouchableOpacity> :
                            <Icon
                                containerStyle={styles.taskIcons}
                                size={22}
                                name={'bookmark'}
                                type='feather'
                                color={'#000000'}
                            />
                    }
                    <Modal 
                        isVisible={this.state.isColorPickVisible}
                        onBackdropPress={() => this.setState({ isColorPickVisible: false })}
                        animationIn="slideInLeft"
                        animationOut="slideOutRight"
                    >
                        <View style={styles.content}>
                            <ColorPalette
                                onChange={color => {
                                        this.props.changeCategoryColor(color, this.props.item);
                                        this.setState({ isColorPickVisible: false });
                                    }
                                }
                                value={this.props.item.color}
                                colors={colorPicks}
                                title={"Choose category color:"}
                                icon={
                                    <Icon
                                        size={20}
                                        containerStyle={{opacity: 0.8, shadowOpacity: 0.5, shadowRadius: 2}}
                                        name={'check'}
                                        type='feather'
                                        color={'black'}
                                    />
                                }
                            />
                        </View>
                    </Modal>
                </View>

                    <View style={styles.categoryNameContainer}>
                        <Text style={styles.categoryTitle}>{this.props.item.title}</Text>
                    </View>

            </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    categoryContainer: {
        width: '100%',
        height: 42,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#DDD'
    },

    content: {
        height: '35%',
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
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
        fontSize: 16
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryItem);