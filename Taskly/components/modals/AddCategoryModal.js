import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, Keyboard, Dimensions} from 'react-native';
import { Icon, Input } from 'react-native-elements';
import Modal from "react-native-modal";
import ColorPickModal from './ColorPickModal'
import { maxCategoryNameLength, defaultCategoryColor } from '../../data/Constants'
import tinycolor from 'tinycolor2';
import { withTheme } from '../../data/Theme'

class AddCategoryModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            color: defaultCategoryColor,
            error: 'none',
            isColorPickVisible: false
        }
    }

    toggleColorPick = () => {
        this.setState({ isColorPickVisible: !this.state.isColorPickVisible });
    };

    setCategoryColor = (color) => {
        this.setState({color: tinycolor(color).toHslString()})
        this.toggleColorPick();
    };

    addCategory = () => {
        Keyboard.dismiss;
        if(this.state.input !== '') {
            if(this.state.input.length <= maxCategoryNameLength) {
                this.props.addCategory(this.state.input, this.props.categoryId, this.state.color);
                this.setState({input: '', error: 'none'});
                this.closeModal();
            } else this.setState({input: '', error: 'length'});
        } else this.setState({input: '', error: 'empty'});
    }

    closeModal = () => {
        this.setState({input: '', color: defaultCategoryColor});
        this.props.toggleModal();
    }

    render() {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            <Modal 
                isVisible={this.props.isAddVisible}
                onBackdropPress={this.closeModal}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
            >
                    <KeyboardAvoidingView contentContainerStyle={style.content} behavior={'position'}>
                    <Input
                        style={{ width: '80%', fontSize: 18 }}
                        value={this.state.input}
                        label="Category name:"
                        placeholder="Enter new category name"
                        placeholderTextColor="#c7c7c7"
                        underlineColorAndroid='transparent'
                        onChangeText={ (input) => this.setState({input: input}) }
                        leftIconContainerStyle={{marginRight: 10}}
                        leftIcon={
                            <Icon
                                name='playlist-add'
                                type='material'
                                color='#000000'
                            />
                        }
                        errorStyle={{ color: 'red' }}
                        errorMessage={this.state.error !== 'none' ? 
                                            this.state.error === 'empty' ? 
                                            "Please enter category name" : `Maximum category name is ${maxCategoryNameLength} characters.` 
                                            : ""}
                    />
                    <View style={{width: '100%', flex:1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <TouchableOpacity onPress={this.closeModal}>
                            <Icon
                                name='x'
                                type='feather'
                                color='#000000'
                            />
                        </TouchableOpacity>
                        <View>
                            <Text style={{marginRight: 5}}>Category color:</Text>
                            <TouchableOpacity onPress={this.toggleColorPick}>
                                    <Icon
                                        containerStyle={style.taskIcons}
                                        size={50}
                                        name={'primitive-dot'}
                                        type='octicon'
                                        color={this.state.color}
                                    />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={this.addCategory}>
                            <Icon
                                name='check'
                                type='feather'
                                color='#000000'
                            />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
                <ColorPickModal isVisible={this.state.isColorPickVisible} setColor={this.setCategoryColor} toggle={this.toggleColorPick} defaultColor={'#DDDDDD'} title={this.state.input}/>
            </Modal>
        )
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

export default withTheme(AddCategoryModal);