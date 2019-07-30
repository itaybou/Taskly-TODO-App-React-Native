import React from 'react';
import { Platform, StyleSheet, View, FlatList, AsyncStorage } from 'react-native';
import Header from './components/Header';
import InputBar from './components/InputBar';
import Task from './components/Task';

const ios = 'ios';
const android = 'android';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      taskList: []
    }
  };

  componentDidMount() {
    this.retrieveData();
  }

  storeData = async () => {
    try {
      await AsyncStorage.setItem('state', JSON.stringify(this.state));
    } catch (error) {
      // Error saving data
    }
  }

  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('state');
      if (value !== null) {
        this.setState(JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  addTask() {
    if(this.state.input !== '') {
      let list = this.state.taskList;
      list.unshift({
        id: list.length + 1,
        task: this.state.input,
        date: "",
        completed: false
      });
      this.setState({input: '', taskList: list})
    }
  }

  removeTask(task) {
    let list = this.state.taskList;
    list = list.filter((listItem) => listItem.id !== task.id);
    console.log(list);
    this.setState({taskList: list});
  }
  
  toggleCompleted(task) {
    let list = this.state.taskList;
    list = list.map((listItem) => {
      if(listItem.id === task.id) {
        listItem.completed = !listItem.completed;
      }
      return listItem;
    });
    this.setState({taskList: list});
  }

  render() {
      const status_bar = Platform.OS == ios ? <View style={styles.status_bar}></View> : <View></View>;
      return (
        <View style={styles.container}>
          {status_bar}
          <Header/>
          <InputBar
            input={this.state.input}
            textChange={ (input) => this.setState({input}) } 
            addTask={ () => {
              this.addTask();
              this.storeData();
            }}
          />
          <FlatList 
            data={this.state.taskList}
            extraData = {this.state}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={ ({item}) => {
              return (
                <Task 
                  item={item} 
                  toggleCompleted={ () => {
                    this.toggleCompleted(item);
                    this.storeData();
                  }}
                  removeTask={ () =>{
                    this.removeTask(item);
                    this.storeData();
                  }}
                />
              );
            }
          }
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },

  status_bar: {
    backgroundColor: '#66CDAA',
    height: 35
  }
});
