import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import { moveTasks } from '../../data/actions/Actions'
import { Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import { Dropdown } from 'react-native-material-dropdown';
import { withTheme } from '../../data/Theme'
import { connect } from 'react-redux'

class MoveToCategoryModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            categories: this.props.categories.filter((category) => (category.id !== this.props.item.id)),
            current: this.props.item
        }
    }

    approve() {
        this.props.moveTasks(this.props.item, this.state.current);
        this.props.approve();
    }

    render() {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            <Modal 
                isVisible={this.props.isVisible}
                onBackdropPress={this.props.toggle}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
            >
                <View style={style.content} >
                    <View style={{ width: '80%', height: '20%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: theme.primary_text, marginBottom: 5, fontSize: 12, lineHeight: 12}} numberOfLines={3}>{this.state.title}</Text> 
                    </View>
                    <View style={{ width: '70%'}}>
                        <Dropdown
                            textColor={theme.primary_text}
                            baseColor={theme.secondary_text}
                            label='Choose category to move to'
                            value={this.state.current.title}
                            data={this.state.categories}
                            labelExtractor={(label) => label.title}
                            pickerStyle={{
                                backgroundColor: theme.background_selected
                            }}
                            onChangeText={async (value, index, data) => {
                                this.setState({current: data[index]});
                            }}
                        />
                    </View>
                    <View style={{width: '100%', flex:1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                        <TouchableOpacity onPress={this.props.toggle}>
                            <Icon
                                name='x'
                                type='feather'
                                color={theme.icons}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.approve.bind(this)}>
                            <Icon
                                name='check'
                                type='feather'
                                color={theme.icons}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
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
        height: Dimensions.get('window').height * 0.2,
        backgroundColor: theme.background,
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
});

const mapDispatchToProps = (dispatch) => ({
    moveTasks: (category, next_category) => dispatch(moveTasks(category, next_category))
});

export default connect(null, mapDispatchToProps)(withTheme(MoveToCategoryModal));