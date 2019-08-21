import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, TouchableNativeFeedback, TouchableWithoutFeedback, Dimensions} from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import { isANDROID } from '../../data/Constants'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { withTheme } from '../../data/Theme'

const TEXT_HEIGHT = 18;
const ICON_SIZE = 50;
const TextTouchable = isANDROID ? TouchableNativeFeedback : TouchableWithoutFeedback;

class CategorySettingsModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            sortMenu: null,
            isVisible: false
        }
    }

    setMenuRef = ref => {
        this.state.sortMenu = ref;
    };

    
    hideMenu = () => {
        this.state.sortMenu.hide();
    };
    
    showMenu = () => {
        this.state.sortMenu.show();
    };

    render() {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            <Modal 
                backdropColor={'transparent'}
                onBackdropPress={this.props.hideModal}
                isVisible={this.props.isVisible}
                animationIn="slideInRight"
                animationOut="slideOutRight"
                animationInTiming={200}
                animationOutTiming={200}
                onSwipeComplete={this.props.hideModal}
                swipeThreshold={50}
                swipeDirection={['right']}
                coverScreen={false}
                style=
                {{
                    justifyContent: 'flex-start',
                    alignItems: 'flex-end',
                    marginTop: 40,
                    marginEnd: 0,
                }}
            >
                <View style={style.content}>
                    <View style={{width: '100%', flex:1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                        <View style={{flexDirection:'row', justifyContent:'center', alignItems: 'center'}}>
                            {this.renderTitle(`Clear\nCompleted`, 2, this.props.clear)}
                            <TouchableOpacity 
                                style={style.button} 
                                onPress={this.props.clear}>
                                <Icon
                                    size={12}
                                    name='x'
                                    type='feather'
                                    color={theme.button_icons}
                                />
                                <Icon
                                    name='clear-all'
                                    type='material'
                                    color={theme.button_icons}
                                />
                            </TouchableOpacity>
                        </View>
                        <Menu
                            ref={this.setMenuRef}
                            style={{backgroundColor: theme.background_selected, }}
                            button={
                                <View style={{flexDirection:'row', justifyContent:'center', alignItems: 'center'}}>
                                    {this.renderTitle('Sort', 1)}
                                    <TouchableOpacity 
                                        style={style.button} 
                                        onPress={this.showMenu}>
                                        <Icon
                                            name='sort'
                                            type='material'
                                            color={theme.button_icons}
                                        />
                                    </TouchableOpacity>
                                </View>
                            }
                        >
                            <MenuItem disabled={true} textStyle={{color: theme.accent_primary}}>Sort by:</MenuItem>
                            <MenuDivider color={theme.activeTintColor}/>
                            <MenuItem textStyle={{color: theme.primary_text}} onPress={() => {
                                this.hideMenu();
                                this.props.sort('Creation date');
                                }}>Creation date</MenuItem>
                            <MenuDivider color={theme.activeTintColor}/>
                            <MenuItem textStyle={{color: theme.primary_text}} onPress={() => {
                                this.hideMenu();
                                this.props.sort('Task importance');
                                }}>Task importance</MenuItem>
                            <MenuDivider color={theme.activeTintColor}/>
                            <MenuItem textStyle={{color: theme.primary_text}} onPress={() => {
                                this.hideMenu();
                                this.props.sort('Due date');
                                }}>Due date</MenuItem>
                        </Menu>

                        <View style={{flexDirection:'row', justifyContent:'center', alignItems: 'center'}}>
                            {this.renderTitle('Share', 1, this.props.share)}
                            <TouchableOpacity 
                                style={style.button} 
                                onPress={this.props.share}>
                                <Icon
                                    name='share'
                                    type='material'
                                    color={theme.button_icons}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    renderTitle(title, lines, func) {
        const offsetTop = Math.max(55 / 2 - TEXT_HEIGHT / 2, 0);
        const theme = this.props.theme;
        const style = styles(theme, offsetTop, lines);

        return (
        <TextTouchable
            onPress={func}
        >
            <View style={style.textContainer}>
                <Text
                    allowFontScaling={false}
                    style={[style.text]}
                    >
                    {title}
                </Text>
            </View>
        </TextTouchable>
        );
    }
}

const styles = (theme, offsetTop, lines) => StyleSheet.create({
    button: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        marginEnd: 15,
        marginBottom: 25,
        borderRadius: 50,
        flexDirection: 'row',
        backgroundColor: theme.main_primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8
    },

    content: {
        height: Dimensions.get('window').height * .3,
        width: Dimensions.get('window').width * .4,
        backgroundColor: 'transparent',
        padding: 0,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },

    textContainer: {
        position: "absolute",
        paddingVertical: isANDROID ? 1 : 2,
        paddingHorizontal: 8,
        marginHorizontal: ICON_SIZE/2 - 5,
        borderRadius: 3,
        top: offsetTop / lines,
        right: ICON_SIZE,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.separator,
        backgroundColor: theme.background_selected,
        height: TEXT_HEIGHT * lines,
        elevation: 2
    },

    text: {
        color: theme.secondary_text,
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
    }
});

export default withTheme(CategorySettingsModal);