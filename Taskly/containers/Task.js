import React from 'react';
import { StyleSheet, View, TouchableHighlight, Animated, Text } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements'
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { connect } from 'react-redux';
import Slider from "react-native-slider";
import { SCREENS, maxTaskImportance } from '../data/Constants'
import { withTheme } from '../data/Theme'


export const minimumTaskHeight = 45;

class Task extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            menu: null,
            expanded: false,
            animation: new Animated.Value(minimumTaskHeight),
            toggleClose: this.toggleExpand.bind(this)
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

    toggleExpand() {
        let initialValue = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;
        this.setState({
            expanded : !this.state.expanded  //Step 2
        }, () => this.state.expanded ? this.props.isExpanded(this) : this.props.isClosed());
        this.state.animation.setValue(initialValue);  //Step 3
        Animated.spring(     //Step 4
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();  //Step 5
    }

    setMaxHeight(event){
        this.setState({
            maxHeight: event.nativeEvent.layout.height
        });
    }
    
    setMinHeight(event){
        this.setState({
            minHeight: event.nativeEvent.layout.height
        });
    }

    complete() {
        this.props.toggleCompleted();
    }

    editTask() {
        this.hideMenu();
        this.props.navigation.navigate(SCREENS.EDIT_TASK, {itemID: this.props.item.id})
    }

    remove() {
        this.hideMenu();
        this.props.remove();
    }
    
    render() {
        const theme = this.props.theme;
        const style = styles(theme);
        const item = this.props.item;
        return (
            <Animated.View style={[style.container, {height: this.state.animation}]}>
                <View style={[style.taskContainer, {backgroundColor: this.state.expanded ? theme.background_selected : theme.background}]} onLayout={this.setMinHeight.bind(this)}>
                        <View style={style.checkBoxContainer}>
                            <View style={{width: '1.5%', height:'100%', backgroundColor: this.props.category.color}} />
                            <CheckBox
                                size={28}
                                iconType={'feather'}
                                checkedIcon={'check-circle'}
                                uncheckedIcon={'circle'}
                                containerStyle={style.checkBox}
                                checked={item.completed}
                                titleProps={ {
                                    numberOfLines: 2
                                }}
                                checkedColor= {theme.accent_primary}
                                uncheckedColor = {theme.icons_secondary}
                                title={item.title}
                                onPress={this.toggleExpand.bind(this)}
                                onLongPress={this.editTask.bind(this)}
                                onIconPress={this.complete.bind(this)}
                                textStyle={item.completed ? style.textCompleted : style.textNotCompleted}
                            />
                            <View style={{flex:1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                                <TouchableHighlight 
                                    style={style.button} 
                                    onPress={this.showMenu}
                                    underlayColor={theme.background}
                                >
                                    <View style={style.taskIconsContainer}>
                                        <Menu
                                            ref={this.setMenuRef}
                                            style={{backgroundColor: theme.background_selected, }}
                                            button={
                                                    <Icon
                                                        containerStyle={style.taskIcons}
                                                        size={24}
                                                        name={'more-horizontal'}
                                                        type='feather'
                                                        color={this.state.expanded ? theme.accent_secondary : theme.icons}
                                                    />
                                            }
                                        >
                                            <MenuItem textStyle={{color: theme.primary_text}} onPress={this.editTask.bind(this)}>Edit</MenuItem>
                                            <MenuDivider color={theme.activeTintColor}/>
                                            <MenuItem textStyle={{color: theme.primary_text}} onPress={this.remove.bind(this)}>Remove</MenuItem>
                                        </Menu>
                                    </View>
                                </TouchableHighlight>
                                <View style={{flex: 0.5, flexDirection: 'row', justifyContent:'flex-end', alignItems: 'flex-end', marginEnd: 10, marginTop: 10}}>
                                    {this.state.expanded ? <View></View> :
                                        item.importance !== 0 ?
                                        <Slider
                                            style={{width: '62%', height: '50%', marginBottom: 1}}
                                            trackStyle={style.importanceSliderTrack}
                                            thumbStyle={style.importanceSliderThumb}
                                            thumbTintColor={theme.main_secondary}
                                            minimumValue={0}
                                            disabled={true}
                                            maximumValue={maxTaskImportance}
                                            minimumTrackTintColor={theme.accent_primary}
                                            maximumTrackTintColor={theme.separator}
                                            step={1}
                                            value={item.importance}
                                        /> : <View></View>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={style.body} onLayout={this.setMaxHeight.bind(this)}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems:'flex-end'}}>
                            <Text style={{fontSize: 12, fontWeight: 'bold'}}>Task description:</Text>
                            <View style={{flexDirection:'row', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                                <Text style={{fontSize: 12, fontWeight: 'bold'}}>Category: </Text>
                                <Text style={{fontSize: 12}}>{this.props.category.title}</Text>
                                <Icon
                                    containerStyle={{marginLeft: 3}}
                                    size={13}
                                    name={'ios-egg'}
                                    type='ionicon'
                                    color={this.props.category.color}
                                />
                            </View>
                        </View>
                        <AutoGrowingTextInput 
                            style={style.descriptionInput}
                            maxHeight={200}
                            minHeight={45}
                            Value={item.description}
                            placeholder={'Insert task description'} 
                            placeholderTextColor="#c7c7c7"
                            underlineColorAndroid='transparent'
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems:'flex-end'}}>
                            <View style={{flexDirection:'row', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                                <Text style={{fontSize: 12}}>Created: {item.created_date}</Text>
                            </View>
                            {item.completed ? 
                                <View style={{flexDirection:'row', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                                    <Text style={{fontSize: 12}}>Completed: {item.completed_date}</Text>
                                </View> : <View></View>
                            }
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems:'flex-end'}}>
                            <View style={{flexDirection:'row', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                                <Text style={{fontSize: 12}}>Importance: </Text>
                                <Slider
                                    style={{width: '40%', height: '50%'}}
                                    trackStyle={style.importanceSliderTrack}
                                    thumbStyle={style.importanceSliderThumb}
                                    minimumValue={0}
                                    disabled={true}
                                    maximumValue={maxTaskImportance}
                                    minimumTrackTintColor={theme.accent_primary}
                                    maximumTrackTintColor={theme.separator}
                                    step={1}
                                    value={item.importance}
                                />
                            </View>
                            {item.due_date !== '' ? (
                                <View style={{flexDirection:'row', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                                        <Icon
                                            containerStyle={{marginRight: 4}}
                                            size={13}
                                            name={'clock'}
                                            type='feather'
                                            color={theme.icons}
                                        />
                                        <Text style={{fontSize: 12, fontWeight: '500', textDecorationLine: 'underline'}}>Due</Text>
                                        <Text style={{fontSize: 12, fontWeight: '400'}}>: {item.due_date}</Text>
                                </View>)  : <View></View>
                            }
                        </View>
                    </View>
            </Animated.View>
        );
    }
}

const styles = (theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.background,
        overflow: 'hidden'
    },

    taskContainer: {
        width: '100%',
        height: minimumTaskHeight,
        padding: 0,
        borderBottomColor: theme.separator,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: theme.background
    },
    
    checkBoxContainer: {
        width: '100%',
        height: 42,
        padding: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    taskIconsContainer: {
        flex:0.1,
        width: '100%',
        height: '100%',
        flexDirection: 'row', 
        justifyContent:'center',
        alignItems: 'flex-end',
        marginTop: 20
    },

    checkBox: {
        width: '70%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        borderColor: 'transparent'
    },

    taskIcons: {
        marginEnd: 10
    },

    additionalInfo: {
        width: '100%',
        height: '15',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },

    dueDateIcon: {
        marginStart: 0,
        marginEnd: 0
    },

    dueDateText: {
        fontSize:8,
    },

    body: {
        height: 'auto',
        backgroundColor: theme.background,
        marginStart: 0,
        padding: 10,
        paddingTop: 5,
        borderBottomColor: theme.separator,
        borderBottomWidth: 4
    },

    descriptionInput: {
        backgroundColor: theme.text_box,
        height:12,
        fontSize: 12,
        margin: 2,
        textAlign: 'center',
        borderRadius: 10
    },

    textCompleted: {
        opacity: 0.3,
        color: theme.secondary_text,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },

    textNotCompleted: {
        color: theme.primary_text,
        opacity: 1
    },

    importanceSliderTrack: {
        height: 5,
        borderRadius: 5,
    },

    importanceSliderThumb: {
        width: 5,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.accent_third
    }
});

const mapStateToPropsFactory = (state, ownProps) => {
    return function mapStateToProps(state) {
        return {
            category: state.categories.catList.find(cat => cat.id === ownProps.item.category_id)
        }
    }
};

export default connect(mapStateToPropsFactory)(withTheme(Task));