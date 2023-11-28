import { View, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import Spinner from 'react-native-spinkit'
import { Colors, Fonts } from '../../res'
import { Typography, hp, wp } from '../../global'
import { useTranslation } from 'react-i18next'

interface OverlayLoaderProps {
    visible: boolean,
    message?: string,
    containerStyle?: ViewStyle,
    messageStyle?: TextStyle
}

const Loader = (props: OverlayLoaderProps) => {
    const { t } = useTranslation()
    const {
        visible = false,
        message = 'loading',
        containerStyle = {},
        messageStyle = {}
    } = props

    return (
        visible &&
        <View style={[styles.container, containerStyle]}>
            <Spinner
                isVisible={true}
                type='Bounce'
                color={Colors.color1}
                size={100}
            />
            <Text style={[styles.loaderMessage, messageStyle]}>
                {t(message)}....
            </Text>
        </View>
    )
}

export default Loader


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderMessage: {
        color: Colors.color1,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.small,
        includeFontPadding: false,
        marginVertical: hp(3),
        alignSelf: 'center',
        textAlign: 'center',
        marginHorizontal: wp(8),
    }
})