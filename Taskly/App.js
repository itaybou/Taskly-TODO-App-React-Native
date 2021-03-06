import React from 'react';
import { Provider } from 'react-redux'
import { StyleSheet, View, I18nManager } from 'react-native';
import Navigator from './navigation/Navigator';
import { PersistGate } from 'redux-persist/integration/react'
import { data, persistor } from './data/Data';
import { isIOS } from './data/Constants'
import { ThemeProvider, THEMES } from './data/Theme';
import { AppLoading } from 'expo';
import { askPermissions, setPopup } from './data/actions/Notifications'
import NotificationPopup from 'react-native-push-notification-popup';

export default class App extends React.Component {
    state = {
      isReady: false,
      theme: data.getState().theme
    };

    componentWillMount() {
      I18nManager.allowRTL(false);
    }

  async componentDidMount() {
      await askPermissions();
  }

  toggleTheme() {
    this.setState({theme: data.getState().theme});
  }

  render() {
    const status_bar = isIOS ? <View style={styles.status_bar}></View> : <View></View>;
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
              <NotificationPopup ref={ref => setPopup(ref)} />
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
      flex: 1
  }
});

