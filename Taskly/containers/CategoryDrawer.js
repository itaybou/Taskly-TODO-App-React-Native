import React from 'react';
import { StyleSheet, View, Text, InteractionManager, Image } from 'react-native';
import { Icon, Header } from 'react-native-elements';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import CategoryItem from './CategoryItem'

class CategoryDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            didFinishInitialAnimation: false,
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                didFinishInitialAnimation: true,
            });
        });
    }

    keyExtractor = (item, index) => item.id.toString();

    render() {
        return (
            <View style={styles.container}>
                <Header 
                    placement="left"
                    barStyle="light-content" // or directly
                    containerStyle={{
                        backgroundColor: '#DDDDDD',
                        justifyContent: 'space-around',
                        height: '28%'
                    }}
                >
                <View></View>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Categories</Text>
                <View></View>
                </Header>
                <ScrollView>
                    <FlatList 
                        data={ this.props.catList }
                        extraData = {this.props.state}
                        keyExtractor={this.keyExtractor}
                        renderItem={ ({item}) => 
                            <CategoryItem
                                item={item}
                            />
                        }
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sideMenuContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 20,
    },

    sideMenuProfileIcon: {
        resizeMode: 'center',
        width: 150,
        height: 150,
        marginTop: 20,
        borderRadius: 150 / 2,
    },
});

const mapStateToProps = (state) => {
    console.log(state.categories.catList);
    return ({
    state: state,
    catList: state.categories.catList
})};

export default connect(mapStateToProps)(CategoryDrawer);