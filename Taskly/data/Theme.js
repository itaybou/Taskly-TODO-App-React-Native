import { createTheming } from '@callstack/react-theme-provider';

export const THEME_TYPE = {
    LIGHT: 'light',
    DARK: 'dark'
}

export const THEMES = {
    light: {
        name: THEME_TYPE.LIGHT,
        main_primary: '#FFE27C',
        main_secondary: '#ffd027',
        accent_primary: '#E03A02',
        accent_secondary: '#F68B5F',
        accent_third: '#EB6E1B',
        separator: '#DDDDDD',
        background: '#FFFFFF',
        icons: '#000000',
        button_icons: '#6B3C2A',
        tab_bar: '#FCFCFC',
        icons_secondary: '#BFBFBF',
        background_selected: '#F2F2F2',
        primary_text: '#000000',
        secondary_text: '#858584',
        placeholder_text: "#C7C7C7",
        activeTintColor: "#EEEEEE",
        inactiveTintColor: "#222222",
        tintHighlight: '#FF7E65',
        text_box: '#EDEDED',
        snackbar_background: '#DCDCDC'
    },

    dark: {
        name: THEME_TYPE.DARK,
        main_primary: '#FFE27C',
        main_secondary: '#ffd027',
        accent_primary: '#E03A02',
        accent_secondary: '#F68B5F',
        accent_third: '#EB6E1B',
        separator: '#212121',
        background: '#303030',
        icons: '#FFFFFF',
        button_icons: '#6B3C2A',
        tab_bar: '#212121',
        icons_secondary: '#878787',
        background_selected: '#212121',
        primary_text: '#FFFFFF',
        secondary_text: '#D3D3D3',
        placeholder_text: "#C7C7C7",
        activeTintColor: "#000000",
        inactiveTintColor: "#EEEEEE",
        tintHighlight: '#CC5431',
        text_box: '#424242',
        snackbar_background: '#484848'
    },
};

export const { ThemeProvider, withTheme } = createTheming();