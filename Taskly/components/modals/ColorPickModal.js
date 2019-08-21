import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { HueSlider, SaturationSlider, LightnessSlider } from 'react-native-color';
import Modal from "react-native-modal";
import { Icon } from 'react-native-elements'
import { withTheme } from '../../data/Theme'
import tinycolor from 'tinycolor2';

class ColorPickModel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            color: tinycolor(this.props.defaultColor).toHsl()
        }
    }

    updateHue = h => this.setState({ color: { ...this.state.color, h: h } });
    updateSaturation = s => this.setState({ color: { ...this.state.color, s: s } });
    updateLightness = l => this.setState({ color: { ...this.state.color, l: l } });

    setColor() {
        this.props.setColor(this.state.color);
    }

    render() {
        const theme = this.props.theme;
        const style = styles(theme);
        return (
            <Modal 
                isVisible={this.props.isVisible}
                onBackdropPress={this.props.toggle}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
            >
                <View style={style.content}>
                    <View style={{width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginStart: 5, alignItems: 'center'}}>
                        <Text style={{marginEnd: 5, fontWeight: 'bold', fontSize: 18, color: theme.primary_text}}>Category:</Text>
                        <Text style={{marginEnd: 5, fontSize: 18, color: theme.primary_text}}>{this.props.title !== '' ? this.props.title : "-----"}</Text>
                        <Icon
                            containerStyle={{marginLeft: 3}}
                            size={25}
                            name={'ios-egg'}
                            type='ionicon'
                            color={this.props.defaultColor}
                        />
                    </View>
                    <HueSlider
                        style={style.sliderRow}
                        gradientSteps={40}
                        value={this.state.color.h}
                        onValueChange={this.updateHue}
                    />
                    <SaturationSlider
                        style={style.sliderRow}
                        gradientSteps={20}
                        value={this.state.color.s}
                        color={this.state.color}
                        onValueChange={this.updateSaturation}
                    />
                    <LightnessSlider
                        style={style.sliderRow}
                        gradientSteps={20}
                        value={this.state.color.l}
                        color={this.state.color}
                        onValueChange={this.updateLightness}
                    />
                    <View style={{width: '100%', zIndex: 1, flex:1, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                        <TouchableOpacity onPress={this.props.toggle}>
                            <Icon
                                name='x'
                                type='feather'
                                color={theme.icons}
                            />
                        </TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginStart: 5, alignItems: 'center'}}>
                            <Text style={{marginEnd: 5, fontWeight: 'bold', color: theme.primary_text}}>Preview:</Text>
                            <View style={{width: 50, height: 50, borderRadius: 50, borderWidth: 1, borderColor: theme.separator, 
                                            backgroundColor: tinycolor(this.state.color).toHslString()}}/>
                        </View>
                        <TouchableOpacity onPress={() => this.props.setColor(this.state.color)}>
                            <Icon
                                name='check'
                                type='feather'
                                color={theme.icons}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = (theme) => StyleSheet.create({
    content: {
        height: '35%',
        backgroundColor: theme.background,
        padding: 22,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },

    sliderRow: {
        alignSelf: 'stretch'
    },
});

export default withTheme(ColorPickModel);