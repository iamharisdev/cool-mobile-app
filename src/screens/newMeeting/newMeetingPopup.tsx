import { View, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ActionSheet, Button, OpenSettingsPopup, Text } from '../../components'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Colors, Fonts } from '../../res'
import { Typography, wp } from '../../global'
import Ripple from 'react-native-material-ripple'
import { Switch } from 'react-native-switch'
import { flashSuccessMessage } from '../../components/FlashMessage'
import Clipboard from '@react-native-clipboard/clipboard';
import { OverlayLoader } from '../../components/loaders'
import { ApiServices } from '../../services/api'
import { getDeviceID, getLocalMedia } from '../../services/common/CommonServices'
import { useGlobalContext } from '../../services'



interface NewMeetingPopupProps {
    newMeetingPopupVisible: boolean
    onClose: () => void,
    navigation: any
}

const NewMeetingPopup = (props: NewMeetingPopupProps) => {
    const { setLocalMedia, userImage } = useGlobalContext()
    const { currentUser } = useGlobalContext()
    const [audioEnabled, setAudioEnabled] = useState(true)
    const [videoEnabled, setVideoEnabled] = useState(false)
    const [meetingID, setMeetingID] = useState('')
    const [overlayLoader, setOverlayLoader] = useState({
        visible: false,
        message: ''
    })
    const [openSettingsPopup, setOpenSettingsPopup] = useState(false)


    const {
        newMeetingPopupVisible = false,
        onClose = () => null,
        navigation = {}
    } = props

    const onChangeAudio = () => setAudioEnabled(!audioEnabled)
    const onChangeVideo = () => setVideoEnabled(!videoEnabled)

    const hideSettingsPopup = () => setOpenSettingsPopup(false)

    const hideOverlayLoader = () => {
        setOverlayLoader({
            visible: false,
            message: ''
        })
    }

    const onContinuePress = async () => {
        const localMedia: any = await getLocalMedia()

        if(!localMedia) {
            setOpenSettingsPopup(true)
            return
        }
        if(localMedia) {
            const audioTrack = await localMedia?.getAudioTracks()
            const videoTrack = await localMedia?.getVideoTracks()

            if(!audioTrack || !videoTrack || audioTrack.length === 0 || videoTrack.length === 0) {
                setOpenSettingsPopup(true)
                return
            }
        }
        if(localMedia && !audioEnabled) {
            localMedia?.getAudioTracks().forEach((track: any) => {
                track.enabled = false;
            })
        }

        if(localMedia && !videoEnabled) {
            localMedia?.getVideoTracks().forEach((track: any) => {
                track.enabled = false;
            })
        }

        setOverlayLoader({
            visible: true,
            message: 'creatingMeeting'
        })
        try {
            const deviceID = await getDeviceID()
            await ApiServices.createMeeting(meetingID)
            setLocalMedia(localMedia)
            onClose()
            hideOverlayLoader()
            flashSuccessMessage('meetingStarted')
            navigation.navigate("MeetingRoom", {
                participantData: {
                    name: currentUser?.displayName,
                    image: userImage,
                    fromHost: true,
                    isMute: !audioEnabled,
                    video: videoEnabled,
                    screenShare: false
                },
                deviceID: deviceID,
                microphone: audioEnabled,
                video: videoEnabled,
                meetingID,
                from: 'host',
            })
        } catch(error) {
            hideOverlayLoader()
        }
    }

    const renderSwitchField = (text: string, onValueChange: () => void, value: boolean) => {
        return (
            <View style={Styles.switchFieldCon}>
                <Text style={Styles.switchLabel}>
                    {text}
                </Text>
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    renderActiveText={false}
                    renderInActiveText={false}
                    circleSize={22}
                    backgroundActive={Colors.color4}
                    backgroundInactive={Colors.color8}
                    innerCircleStyle={Styles.switchInner}
                />
            </View>
        )
    }

    const onCopyPress = () => {
        Clipboard.setString(meetingID);
        flashSuccessMessage('coppied')
    }

    const generateRandomID = async () => {
        try {
            const timestamp = Date.now().toString()
            const trimmedRandomID = timestamp.slice(-9);
            // const trimmedRandomID = timestamp.slice(-3);
            setMeetingID(trimmedRandomID)
        } catch(error) {
            console.log('Error while getting device ID:', error);
            throw error;
        }
    }

    useEffect(() => {
        generateRandomID()
    }, [])

    return (
        <ActionSheet
            visible={newMeetingPopupVisible}
            onClose={onClose}
        >
            <Text style={Styles.actionSheetHeading} overrideStyle={{ marginBottom: 5 }}>
                startAMeeting
            </Text>
            <Text style={Styles.actionSheetDescription}>
                startMeetingDescription
            </Text>
            <View style={Styles.meetingIDCopyBtnOuter}>
                <Ripple style={Styles.meetingIDCopyBtn}
                    onPress={onCopyPress}
                >
                    <Text style={Styles.meetingID}>
                        {meetingID.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}
                    </Text>
                    <Ionicons name='copy-outline' color={Colors.color1} size={20} />
                </Ripple>
            </View>

            {renderSwitchField(
                'audio',
                onChangeAudio,
                audioEnabled
            )}
            {renderSwitchField(
                'video',
                onChangeVideo,
                videoEnabled
            )}
            <Button
                text='continue'
                onPress={onContinuePress}
                buttonOuterStyle={Styles.continueBtn}
            />
            <OverlayLoader
                visible={overlayLoader?.visible}
                message={overlayLoader.message}
            />
            <OpenSettingsPopup
                visible={openSettingsPopup}
                onClose={hideSettingsPopup}
            />
        </ActionSheet>
    )
}

export default NewMeetingPopup

const Styles = StyleSheet.create({
    actionSheetHeading: {
        color: Colors.color1,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: Fonts.APPFONT_B,
        fontSize: Typography.small2,
        includeFontPadding: false,
        marginTop: 40,
    },
    actionSheetDescription: {
        color: Colors.color1,
        fontFamily: Fonts.APPFONT_R,
        fontSize: Typography.tiny1,
        marginHorizontal: wp(10),
        marginTop: 10,
        includeFontPadding: false,
        textAlign: 'center'
    },
    switchFieldCon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(10),
        marginBottom: 20
    },
    switchInner: {
        borderWidth: 1,
        borderColor: Colors.color8,
    },
    switchLabel: {
        color: Colors.color1,
        fontFamily: Fonts.APPFONT_R,
        fontSize: Typography.small1,
        includeFontPadding: false
    },
    continueBtn: {
        marginHorizontal: wp(10),
        marginTop: 50,
        marginBottom: 20
    },
    meetingIDCopyBtnOuter: {
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 60,
        marginHorizontal: wp(10),
    },
    meetingIDCopyBtn: {
        height: wp(14),
        backgroundColor: Colors.color10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
    },
    meetingID: {
        color: Colors.color1,
        fontFamily: Fonts.APPFONT_R,
        fontSize: Typography.small,
        includeFontPadding: false
    }
})