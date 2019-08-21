import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, Keyboard, Dimensions} from 'react-native';
import { Icon, Input } from 'react-native-elements';
import Modal from "react-native-modal";
import { defaultCategoryColor } from '../../data/Constants'
import { connect } from 'react-redux';
import { withTheme } from '../../data/Theme'

class InputModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: this.props.input,
            error: 'none',
            maxInputLength: this.props.maxInput,
            title: this.props.title,
            placeholder: this.props.placeholder,
            edit: this.props.edit,
            previous: this.props.previous
        }
    }

    approve = () => {
        Keyboard.dismiss;
        if(this.state.input !== '') {
            if(this.state.input.length <= this.state.maxInputLength) {
                this.props.approve(this.state.input, this.props.item);
                this.setState({previous: this.state.input, error: 'none'});
                this.closeModal(true);
            } else this.setState({error: 'length'});
        } else this.setState({input: '', error: 'empty'});
    }

    closeModal = (approve) => {
        this.setState({input: this.state.edit && approve ? this.state.input : '', color: defaultCategoryColor});
        this.props.toggleModal();
    }

    render() {
        const theme = this.props.theme;
        const style = styles(theme, this.props.height);
        return (
            <Modal 
                isVisible={this.props.isVisible}
                onBackdropPress={this.closeModal}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
            >
                    <KeyboardAvoidingView contentContainerStyle={style.content} behavior={'position'}>
                    {this.state.edit ? 
                        <View style={{ width: '80%', height: '20%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: theme.primary_text, marginBottom: 5, fontWeight: 'bold', marginEnd: 5, fontSize: 12, lineHeight: 12}}>Previous: </Text>
                            <Text style={{color: theme.primary_text, marginBottom: 5, fontSize: 12, lineHeight: 12}} numberOfLines={3}>{this.state.previous}</Text> 
                        </View> :
                        <View></View>
                     }
                    <Input
                        containerStyle={{width: '95%', height: '80%', maxHeight: 0.5 * Dimensions.get('window').height * this.props.height}}
                        value={this.state.input}
                        label={this.state.title}
                        labelStyle={{color: theme.secondary_text, fontSize: 14}}
                        inputStyle={{color: theme.primary_text, fontSize: this.props.fontSize}}
                        placeholder={this.state.placeholder}
                        placeholderTextColor="#c7c7c7"
                        underlineColorAndroid='transparent'
                        multiline={this.props.height > 0.3}
                        onChangeText={ (input) => this.setState({input: input}) }
                        errorStyle={{ color: 'red' }}
                        errorMessage={this.state.error !== 'none' ? 
                                            this.state.error === 'empty' ? 
                                            "Please enter input" : `Maximum input length is ${this.state.maxInputLength} characters.` 
                                            : ""}
                    />
                    <View style={{width: '100%', flex:1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                        <TouchableOpacity onPress={this.closeModal}>
                            <Icon
                                name='x'
                                type='feather'
                                color={theme.icons}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.approve}>
                            <Icon
                                name='check'
                                type='feather'
                                color={theme.icons}
                            />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        )
    }
}

const styles = (theme, height) => StyleSheet.create({
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
        height: Dimensions.get('window').height * height,
        backgroundColor: theme.background,
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
});

const mapStateToPropsFactory = (state, ownProps) => {
    return function mapStateToProps(state) {
        return {
            input: ownProps.previous !== 'None' ? ownProps.previous : '',
            previous: ownProps.previous
        }
    }
};

export default connect(mapStateToPropsFactory)(withTheme(InputModal));