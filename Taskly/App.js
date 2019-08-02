import React from 'react';
import { Provider } from 'react-redux'
import { Platform, StyleSheet, View } from 'react-native';
import Navigator from './navigation/Navigator';
import Header from './components/Header';
import { PersistGate } from 'redux-persist/integration/react'
import { data, persistor } from './data/Data';
import { AppLoading } from 'expo';

const ios = 'ios';
const android = 'android';

export default class App extends React.Component {

  state = {
    isReady: false
  };

  render() {
    const status_bar = Platform.OS == ios ? <View style={styles.status_bar}></View> : <View></View>;
    
    return (
      <View style={styles.container}>
        <Provider store={data}>
          <PersistGate loading={ 
              <AppLoading
                startAsync={this._cacheResourcesAsync}
                onFinish={() => this.setState({ isReady: true })}
                onError={console.warn}
              />} 
            persistor={persistor}
          >
            {status_bar}
            <Header />
            <Navigator />
          </PersistGate>
        </Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#FFFFFF'
  }
});