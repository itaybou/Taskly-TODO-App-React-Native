import React from 'react';
import { StyleSheet, View, Text, InteractionManager, TouchableOpacity} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import { ScrollView, FlatList, TextInput } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import CategoryItem from './CategoryItem'
import Modal from "react-native-modal";
import { addCategory, arrangeCategories } from '../data/actions/Actions'
import DraggableFlatList from 'react-native-draggable-flatlist'

class AddCategoryModel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            color: 'transparent'
        }
    }

    addCategory = (input) => {
        this.props.addCategory(this.state.input, this.props.categoryId, 'transparent');
        this.closeModal();
    }

    closeModal = () => {
        this.setState({input: '', color: 'transparent'});
        this.props.toggleModal();
    }

    render() {
        return (
            <Modal 
                isVisible={this.props.isAddVisible}
                onBackdropPress={this.closeModal}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
            >
                <View style={styles.content}>
                    <View style={{borderBottomColor: '#A0A0A0', borderBottomWidth: 1, borderBottomEndRadius: 5}}>
                        <TextInput
                            style={{width: '80%', fontSize: 18, }}
                            value={this.state.input}
                            placeholder="Enter category name"
                            placeholderTextColor="#c7c7c7"
                            underlineColorAndroid='transparent'
                            onChangeText={ (input) => this.setState({input: input}) }
                        />
                    </View>
                    <View style={{width: '100%', flex:1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <TouchableOpacity onPress={this.closeModal}>
                            <Icon
                                name='x'
                                type='feather'
                                color='#6B3C2A'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.addCategory}>
                            <Icon
                                name='check'
                                type='feather'
                                color='#6B3C2A'
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}

class CategoryDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            didFinishInitialAnimation: false,
            isAddVisible: false
        };
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

    keyExtractor = (item, index) => item.id.toString();

    render() {
        return (
            <View style={{flex: 1}}>
                <Header 
                    placement="left"
                    barStyle="light-content" // or directly
                    containerStyle={{
                        backgroundColor: '#DDDDDD',
                        justifyContent: 'space-around',
                        flex: 0.1
                    }}
                >
                <View></View>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Categories</Text>
                <View></View>
                </Header>
                <DraggableFlatList 
                    style={{flex: 1}}
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
                        />
                    }
                />
                <View style={{flex: 0.2, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={this.toggleAddCategoryModal}>
                        <Icon
                            name='plus'
                            type='feather'
                            color='#6B3C2A'
                        />
                    </TouchableOpacity>
                    <AddCategoryModel 
                        categoryId={this.props.nextCategoryId} 
                        isAddVisible={this.state.isAddVisible} 
                        toggleModal={this.toggleAddCategoryModal}
                        addCategory={this.props.addCategory}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        width: 50,
        height: 50,
        marginEnd: 15,
        marginBottom: 25,
        borderRadius: 50,
        flexDirection: 'row',
        backgroundColor: '#F68B5F',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8
    },

    content: {
        height: '20%',
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
});

const mapStateToProps = (state) => {
    return ({
    nextCategoryId: state.categories.cat_id,
    catList: state.categories.catList
})};

const mapDispatchToProps = dispatch => ({
    addCategory: (title, id, color) => dispatch( addCategory(title, id, color)),
    arrangeCategories: (data) => dispatch(arrangeCategories(data))
})


export default connect(mapStateToProps, mapDispatchToProps)(CategoryDrawer);