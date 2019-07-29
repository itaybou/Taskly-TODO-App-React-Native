import React from 'react';
import { Platform, StyleSheet, Text, View, FlatList } from 'react-native';
import Header from './components/Header';
import InputBar from './components/InputBar';
import Item from './components/Item';

const ios = 'ios';
const android = 'android';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: "",
      list: []
    }
  };

  addTask() {
    if(this.state.input !== '') {
      let list = this.state.list;
      list.unshift({
        id: list.length + 1,
        task: this.state.input,
        completed: false
      });
      this.setState({input: '', list})
      console.log(list);
    }
  }

  removeItem(item) {
    let list = this.state.list;
    list = list.filter((listItem) => listItem.id !== item.id);
    this.setState({list});
  }
  
  toggleCompleted(item) {
    let list = this.state.list;
    list = list.map((listItem) => {
      if(listItem.id === item.id) {
        listItem.completed = !listItem.completed;
      }
      return listItem;
    });
    this.setState(list);
  }

  render() {
      const status_bar = Platform.OS == ios ? <View style={styles.status_bar}></View> : <View></View>;
      return (
        <View style={styles.container}>
          {status_bar}
          <Header title="TASKLY"/>
          <InputBar 
            textChange={ (input) => this.setState({input}) } 
            addTask={ () => this.addTask() }
          />
          <FlatList 
            data={this.state.list}
            extraData = {this.state}
            keyExtractor={(index, item) => index.toString()}
            renderItem={ ({index, item}) => {
              return (
                <Item item={item} toggleCompleted={ () => this.toggleCompleted(item) } removeItem={ () => this.removeItem(item) }/>
              );
            }}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff'
  },

  status_bar: {
    backgroundColor: '#66CDAA',
    height: 35
  }
});
