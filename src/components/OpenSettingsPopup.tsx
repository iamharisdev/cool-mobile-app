import { View, Modal, ModalProps, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, Linking, Image } from 'react-native'
import React from 'react'
import { Colors, Fonts, Images } from '../res'
import { Animation } from '../animations'
import { Typography, wp } from '../global'
import Ripple from 'react-native-material-ripple'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Text from './Text'
import AntDesign from 'react-native-vector-icons/AntDesign'

interface OpenSettingsPopupProps extends ModalProps {
    onClose?: () => void
}

const OpenSettingsPopup = (props: OpenSettingsPopupProps) => {
    const {
        onClose = () => { },
    } = props

    const onOpenSettingsPress = () => {
        Linking.openSettings().then(() => onClose())
    }

    return (
        <Modal
            onRequestClose={onClose}
            transparent
            animationType="fade"
            {...props}
        >
            <SafeAreaView style={{ backgroundColor: Colors.color1RGBA60 }} />
            <StatusBar barStyle={'light-content'} backgroundColor={Colors.color1RGBA60} />
            <TouchableOpacity style={Styles.container}
                activeOpacity={1}
                onPress={onClose}
            >
                <Animation style={Styles.contentContainer}>
                    <Image
                        source={Images.camMic}
                        resizeMode='contain'
                        style={Styles.camMic}
                    />

                    <Text style={Styles.heading}>
                        cameraMicPermission
                    </Text>
                    <Text style={Styles.description}>
                        cameraMicPermissionDescription
                    </Text>

                    <View style={Styles.buttonOuter}>
                        <Ripple style={Styles.button}
                            onPress={onOpenSettingsPress}
                        >
                            <Ionicons name='settings-outline' color={Colors.color4} size={30} style={Styles.settingsIcon} />
                            <Text style={Styles.buttonTxt}>
                                openSettings
                            </Text>
                        </Ripple>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={Styles.close}
                        onPress={onClose}
                    >
                        <AntDesign name='close' size={20} color={Colors.color1} />
                    </TouchableOpacity>
                </Animation>
            </TouchableOpacity>
        </Modal>
    )
}

export default OpenSettingsPopup

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.color1RGBA60,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 50
    },
    contentContainer: {
        width: wp(85),
        backgroundColor: Colors.color2,
        borderRadius: 12,
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: wp(5)
    },
    heading: {
        fontFamily: Fonts.APPFONT_SB,
        color: Colors.color1,
        fontSize: Typography.small3,
        includeFontPadding: false,
        marginTop: 20
    },
    description: {
        includeFontPadding: false,
        textAlign: 'center',
        fontFamily: Fonts.APPFONT_R,
        marginTop: 10,
        color: Colors.color1,
        fontSize: Typography.small
    },
    buttonOuter: {
        marginTop: 30,
        borderRadius: wp(14) / 2,
        overflow: 'hidden',
        borderColor: 'rgba(68, 93, 72, 0.6)',
        borderWidth: 1,
        backgroundColor: 'rgba(68, 93, 72, 0.2)',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(60),
        height: wp(14),
    },
    settingsIcon: {
        position: 'absolute',
        left: wp(3)
    },
    buttonTxt: {
        color: Colors.color4,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.small1,
        includeFontPadding: false
    },
    close: {
        height: 28,
        width: 28,
        backgroundColor: Colors.color8,
        borderRadius: 28 / 2,
        position: 'absolute',
        top: 5,
        right: wp(1.5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    camMic: {
        width: 60,
        height: 60
    }
})