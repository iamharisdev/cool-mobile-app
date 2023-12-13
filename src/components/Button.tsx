import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import Ripple from 'react-native-material-ripple'
import { Colors, Fonts } from '../res';
import { useTranslation } from 'react-i18next';
import { Typography, hp, wp } from '../global';

interface ButtonProps {
    onPress: () => void;
    text: string,
    buttonStyle?: ViewStyle,
    buttonOuterStyle?: ViewStyle,
    textStyle?: TextStyle
    leftChild?:any,
    rightChild?:any
}

const Button = (props: ButtonProps) => {
    const { t } = useTranslation()
    const {
        onPress = () => { },
        text = '',
        buttonStyle = {},
        buttonOuterStyle = {},
        textStyle = {},
        leftChild,
        rightChild,
    } = props
    return (
        <View style={[Styles.container, buttonOuterStyle]}>
            <Ripple
                style={[Styles.btnCon, buttonStyle]}
                onPress={onPress}
                rippleOpacity={0.2}
            >
                {leftChild}
                {text&&
                <Text style={[Styles.btnTxt, textStyle]}>
                    {t(`${text}`)}
                </Text>
}
                {rightChild}
            </Ripple>
        </View>
    )
}

export default Button

const Styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        overflow: 'hidden'
    },
    btnCon: {
        minWidth: 200,
        height: wp(14),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.color4,
        paddingHorizontal: 20,
        flexDirection:'row'
    },
    btnTxt: {
        color: Colors.color2,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.small1,
        includeFontPadding: false,
        marginBottom: 4.5
    }
})