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
}

const Button = (props: ButtonProps) => {
    const { t } = useTranslation()
    const {
        onPress = () => { },
        text = '',
        buttonStyle = {},
        buttonOuterStyle = {},
        textStyle = {}
    } = props
    return (
        <View style={[Styles.container, buttonOuterStyle]}>
            <Ripple
                style={[Styles.btnCon, buttonStyle]}
                onPress={onPress}
                rippleOpacity={0.2}
            >
                <Text style={[Styles.btnTxt, textStyle]}>
                    {t(`${text}`)}
                </Text>
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
        paddingHorizontal: 20
    },
    btnTxt: {
        color: Colors.color2,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.small1,
        includeFontPadding: false,
        marginBottom: 3
    }
})