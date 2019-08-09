import React from 'react';
import { Provider } from 'react-redux'
import { Platform, StyleSheet, View } from 'react-native';
import Navigator from './navigation/Navigator';
import { PersistGate } from 'redux-persist/integration/react'
import { data, persistor } from './data/Data';
import { ThemeProvider, THEMES } from './data/Theme';
import { AppLoading } from 'expo';
import { askPermissions } from './data/actions/Notifications'

const ios = 'ios';
const android = 'android';

export default class App extends React.Component {
    state = {
      isReady: false,
      theme: data.getState().theme
    };

  async componentWillMount() {
      await askPermissions();
  }

  toggleTheme() {
    this.setState({theme: data.getState().theme});
  }

  render() {
    const status_bar = Platform.OS == ios ? <View style={styles.status_bar}></View> : <View></View>;
    persistor.purge()
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
            <ThemeProvider theme={THEMES[this.state.theme]}>
              {status_bar}
              <Navigator screenProps={{toggleTheme: this.toggleTheme.bind(this)}}/>
            </ThemeProvider>
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

