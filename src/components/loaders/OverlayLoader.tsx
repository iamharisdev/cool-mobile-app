import { View, StyleSheet, Modal, StatusBar, Text } from 'react-native'
import React from 'react'
import Spinner from 'react-native-spinkit'
import { Colors, Fonts } from '../../res'
import { Typography, hp, wp } from '../../global'
import { useTranslation } from 'react-i18next'
import { Animation } from '../../animations'

interface OverlayLoaderProps {
    visible: boolean,
    message?: string,
}
const OverlayLoader = (props: OverlayLoaderProps) => {
    const { t } = useTranslation()
    const {
        visible = false,
        message = 'loading'
    } = props


    return (
        <Modal
            visible={visible}
            transparent={true}
            supportedOrientations={['portrait', 'landscape']}
            animationType="slide"
        >
            <StatusBar barStyle={'light-content'} backgroundColor={Colors.color1RGBA80} />
            <View style={styles.container}>
                <Animation duration={600}>
                    <Spinner
                        isVisible={true}
                        type='Bounce'
                        color={Colors.color2}
                        size={100}
                    />
                </Animation>
                <Animation
                    animation='fadeInDown'
                    duration={850}
                >
                    <Text style={styles.loaderMessage}>
                        {t(message)}....
                    </Text>
                </Animation>

            </View>
        </Modal>
    )
}

export default OverlayLoader

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.color1RGBA80
    },
    loaderMessage: {
        color: Colors.color2,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.small,
        includeFontPadding: false,
        marginVertical: hp(3),
        alignSelf: 'center',
        textAlign: 'center',
        marginHorizontal: wp(8),
    }
})