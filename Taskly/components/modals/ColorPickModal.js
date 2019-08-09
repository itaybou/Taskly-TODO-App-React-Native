import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { HueSlider, SaturationSlider, LightnessSlider } from 'react-native-color';
import Modal from "react-native-modal";
import { Icon } from 'react-native-elements'
import tinycolor from 'tinycolor2';

export default class ColorPickModel extends React.PureComponent {
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
        return (
            <Modal 
                isVisible={this.props.isVisible}
                onBackdropPress={this.props.toggle}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
            >
                <View style={styles.content}>
                    <View style={{width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginStart: 5, alignItems: 'center'}}>
                        <Text style={{marginEnd: 5, fontWeight: 'bold', fontSize: 18}}>Category:</Text>
                        <Text style={{marginEnd: 5, fontSize: 18}}>{this.props.title !== '' ? this.props.title : "-----"}</Text>
                        <Icon
                            containerStyle={{marginLeft: 3}}
                            size={25}
                            name={'ios-egg'}
                            type='ionicon'
                            color={this.props.defaultColor}
                        />
                    </View>
                    <HueSlider
                        style={styles.sliderRow}
                        gradientSteps={40}
                        value={this.state.color.h}
                        onValueChange={this.updateHue}
                    />
                    <SaturationSlider
                        style={styles.sliderRow}
                        gradientSteps={20}
                        value={this.state.color.s}
                        color={this.state.color}
                        onValueChange={this.updateSaturation}
                    />
                    <LightnessSlider
                        style={styles.sliderRow}
                        gradientSteps={20}
                        value={this.state.color.l}
                        color={this.state.color}
                        onValueChange={this.updateLightness}
                    />
                    <View style={{width: '100%', zIndex: 1, flex:1, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <TouchableOpacity onPress={this.props.toggle}>
                            <Icon
                                name='x'
                                type='feather'
                                color='#000000'
                            />
                        </TouchableOpacity>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginStart: 5, alignItems: 'center'}}>
                            <Text style={{marginEnd: 5, fontWeight: 'bold'}}>Preview:</Text>
                            <View style={{width: 50, height: 50, borderRadius: 50, borderWidth: 1, borderColor: '#DDDDDD', 
                                            backgroundColor: tinycolor(this.state.color).toHslString()}}/>
                        </View>
                        <TouchableOpacity onPress={() => this.props.setColor(this.state.color)}>
                            <Icon
                                name='check'
                                type='feather'
                                color='#000000'
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        height: '35%',
        backgroundColor: '#FFFFFF',
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