import React from 'react';
import { StyleSheet, View, Text, Image,Linking} from 'react-native';
import { VERSION, GITHUB } from '../data/Constants'
import { withTheme } from '../data/Theme'
import { SettingsScreen } from "react-native-settings-screen"

class DetailsScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    renderLogo = () => {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            <View style={style.logoContainer}>
                <Image
                        style={style.logo}
                        source={require('../assets/logo.png')}
                    />
            </View>
        )
    }

    renderAbout = () => {
        const theme = this.props.theme;
        const style = styles(theme);
        const about = `Taskly is a free-to-use TODO application with the goal of helping you manage your daily tasks easily.\n`;
        const dev = `\nCreated and maintained by Itay Bouganim.`
        const git = `(GitHub link below)`
        return (
            <View style={style.aboutContainer}>
               <Text style={{fontSize: 14, textAlign: 'center', color: theme.primary_text}}>
                    {about}
                </Text>
                <Text style={{fontSize: 14, textAlign: 'center', color: theme.primary_text}}>
                    {dev}
                </Text>
                <Text style={{fontSize: 14, textAlign: 'center', color: theme.primary_text}}>
                    {git}
                </Text>
            </View>
        )
    }

    render() {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            <View style={style.container}>
                <View style={style.titleContainer}>
                    <Text style={{color: theme.primary_text, fontSize: 16, fontWeight: '900'}}>About Taskly</Text>
                </View>
                <SettingsScreen
                    data={[
                        {type: 'CUSTOM_VIEW', key: 'logo', render: this.renderLogo},
                        {type: 'CUSTOM_VIEW', key: 'about', render: this.renderAbout},
                        {
                            type: 'SECTION',
                            header: 'Version'.toUpperCase(),
                            rows: [
                                {
                                    title: 'Current Version',
                                    theme: theme,
                                    renderAccessory: () => (
                                    <View>
                                        <Text style={{color: theme.primary_text}}>{VERSION}</Text>
                                    </View>)
                                },
                            ]
                        },
                        {
                            type: 'SECTION',
                            header: 'Contact'.toUpperCase(),
                            rows: [
                                {
                                    title: 'GitHub',
                                    showDisclosureIndicator: true,
                                    onPress: () => {
                                        const uri = 'https://' + GITHUB;
                                        Linking.openURL(uri).catch(err => console.error('An error occurred', err));
                                    },
                                    theme: theme,
                                    renderAccessory: () => (
                                    <View>
                                        <Text style={{color: theme.accent_primary}}>{GITHUB}</Text>
                                    </View>)
                                },
                            ]
                        }
                    ]}
                    style={style.details}
                    />
            </View>
        );
    }
};

const styles = (theme) => StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background
    },

    logoContainer: {
        marginTop: 0,
        marginBottom: 10,
        paddingVertical: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.main_primary,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.activeTintColor,
        flexDirection: 'row',
    },

    aboutContainer: {
        marginTop: 20,
        marginBottom: 25,
        paddingVertical: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.activeTintColor,
        flexDirection: 'column',
    },

    titleContainer: {
        marginBottom: 50,
        width: '100%',
        backgroundColor: theme.background_selected,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    details: {
        backgroundColor: theme.background_selected,
        borderWidth: 0,
    },

    logo: {
        flex: 1,
        height: 50,
        resizeMode: 'contain',
    }
});


export default (withTheme(DetailsScreen));