import { View, Text, StyleSheet, TextInput, TextInputProps, TextStyle, Platform } from 'react-native'
import React from 'react'
import { Typography, wp } from '../global'
import { Colors, Fonts } from '../res'
import { useTranslation } from 'react-i18next'

interface InputProps extends TextInputProps {
    label: string,
    inputStyle?: TextStyle,
    placeholderText?: string,
    error?: string
}

const GTextinput = (props: InputProps) => {
    const { t } = useTranslation()
    const {
        label = '',
        inputStyle = {},
        placeholderText = '',
        error = null
    } = props

    return (
        <View style={Styles.container}>
            <Text style={Styles.label}>
                {t(label)}
            </Text>
            <TextInput
                placeholder={t(placeholderText)}
                style={[Styles.input, inputStyle]}
                placeholderTextColor={Colors.color1RGBA50}
                {...props}
            />
            {
                error && <Text style={Styles.error}>
                    {t(error)}
                </Text>
            }
        </View>
    )
}

export default GTextinput

const Styles = StyleSheet.create({
    container: {
        width: wp(92),
        paddingHorizontal: wp(2),
        marginBottom: 30
    },
    label: {
        color: Colors.color1,
        fontFamily: Fonts.APPFONT_R,
        fontSize: Typography.small,
        includeFontPadding: false,
    },
    input: {
        color: Colors.color1,
        fontFamily: Fonts.APPFONT_R,
        fontSize: Typography.small1,
        includeFontPadding: false,
        height: wp(14),
        marginTop: 5,
        backgroundColor: Colors.color2,
        borderRadius: 8,
        paddingHorizontal: wp(4),
        paddingBottom: Platform.OS === 'ios' ? 2 : 12,
    },
    error: {
        fontFamily: Fonts.APPFONT_R,
        includeFontPadding: false,
        fontSize: Typography.tiny,
        marginTop: 3,
        color: Colors.color20
    }
})