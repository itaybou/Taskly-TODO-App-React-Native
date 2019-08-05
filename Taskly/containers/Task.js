import React from 'react';
import { StyleSheet, View, TouchableHighlight, Animated, Text, TextInput } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements'
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import { Rating } from 'react-native-elements';
import { connect } from 'react-redux';

const isEqual = require("react-fast-compare");
export const minimumTaskHeight = 45;

class Task extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            animation: new Animated.Value(minimumTaskHeight),
            toggleClose: this.toggleExpand.bind(this)
        }
    }

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
    
    render() {
        const item = this.props.item;
        return (
            <Animated.View style={[styles.container, {height: this.state.animation}]}>
                <View style={[styles.taskContainer, {backgroundColor: this.state.expanded? '#F2F2F2' : '#FFFFFF'}]} onLayout={this.setMinHeight.bind(this)}>
                        <View style={styles.checkBoxContainer}>
                            <View style={{width: '1.5%', height:'100%', backgroundColor: this.props.category_color}} />
                            <CheckBox
                                size={28}
                                iconType={'feather'}
                                checkedIcon={'check-circle'}
                                uncheckedIcon={'circle'}
                                containerStyle={styles.checkBox}
                                checked={item.completed}
                                checkedColor= {'#E03A02'}
                                title={item.title}
                                onPress={this.toggleExpand.bind(this)}
                                onLongPress={() => this.props.navigation.navigate("Edit_Task", {itemID: this.props.item.id})}
                                onIconPress={ this.props.toggleCompleted.bind(this) }
                                textStyle={item.completed ? styles.textCompleted : styles.textNotCompleted}
                            />
                            <View style={{flex:1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                                <View style={styles.taskIconsContainer}>
                                <TouchableHighlight 
                                        style={styles.button} 
                                        onPress={() => this.props.navigation.navigate("Edit_Task", {itemID: this.props.item.id})}
                                        underlayColor="#f1f1f1"
                                    >
                                        <Icon
                                            containerStyle={styles.taskIcons}
                                            size={20}
                                            name={'edit'}
                                            type='feather'
                                            color='#000000'
                                        />
                                    </TouchableHighlight>
                                    <TouchableHighlight 
                                        style={styles.button} 
                                        onPress={this.toggleExpand.bind(this)}
                                        underlayColor="#f1f1f1"
                                    >
                                        <Icon
                                            containerStyle={styles.taskIcons}
                                            size={20}
                                            name={this.state.expanded ? 'arrow-up' : 'arrow-down'}
                                            type='feather'
                                            color={this.state.expanded ? '#F68B5F' : '#000000'}
                                        />
                                    </TouchableHighlight>
                                </View>
                                <View style={{flex:1, flexDirection: 'row', justifyContent:'flex-end', alignItems: 'flex-end', marginEnd: 10, marginTop: 10}}>
                                {this.state.expanded ? <View></View> :
                                    item.rating !== 0 ?
                                        <Rating
                                            ratingCount={5}
                                            imageSize={10}
                                            showRating={false}
                                            readonly={true}
                                            startingValue={item.rating}
                                        /> :
                                        <View></View>
                                }
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.body, 
                        this.state.expanded? {backgroundColor:  '#F7F7F7', borderBottomWidth: 4} : 
                                                {backgroundColor:  '#FFFFFF', borderBottomWidth: 1}]}
                        onLayout={this.setMaxHeight.bind(this)}>
                        <Text style={{fontSize: 11, fontWeight: 'bold'}}>Task description:</Text>
                        <AutoGrowingTextInput 
                            style={styles.descriptionInput}
                            onLayout={this.setMaxHeight.bind(this)}
                            maxHeight={200}
                            minHeight={45}
                            Value={item.description}
                            placeholder={'Insert task description'} 
                            placeholderTextColor="#c7c7c7"
                            underlineColorAndroid='transparent'
                        />
                        <Text style={{fontSize: 11}}>Created: {item.created_date}</Text>
                        <Rating
                            ratingCount={5}
                            imageSize={15}
                            showRating={false}
                            readonly={true}
                            startingValue={item.rating}
                        /> 
                    </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        overflow: 'visible'
    },

    taskContainer: {
        width: '100%',
        height: minimumTaskHeight,
        padding: 0,
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF'
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
        flex:1,
        flexDirection: 'row', 
        justifyContent:'flex-end',
        alignItems: 'flex-end',
        marginTop: 20
    },

    checkBox: {
        width: '68%',
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
        marginStart: 0,
        padding: 10,
        paddingTop: 5,
        borderBottomColor: '#DDD',
        borderBottomWidth: 4
    },

    descriptionInput: {
        backgroundColor: '#ededed',
        height:12,
        fontSize: 12,
        margin: 2,
        textAlign: 'center',
        borderRadius: 10
    },

    textCompleted: {
        opacity: 0.3,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },

    textNotCompleted: {
        opacity: 1
    }
});

const mapStateToProps = (state, ownProps) => {
    return ({
        category_color: state.categories.catList.find(cat => cat.id === ownProps.item.category_id).color
})};

export default connect(mapStateToProps)(Task);