import { View, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ActionSheet, Button, OpenSettingsPopup, Text, Textinput } from '../../components'
import { Colors, Fonts } from '../../res'
import { Typography, wp } from '../../global'
import { Switch } from 'react-native-switch'
import { useNavigation } from '@react-navigation/native'
import { getLocalMedia } from '../../services/common/CommonServices'
import { ApiServices, emptyFieldError } from '../../services/api'
import DeviceInfo, { getUniqueId } from 'react-native-device-info';
import { OverlayLoader } from '../../components/loaders'
import { useGlobalContext } from '../../services'

interface JoinMeetingPopupProps {
    visible: boolean,
    onClose: () => void
}

const JoinMeetingPopup = (props: JoinMeetingPopupProps) => {
    const { setLocalMedia, userImage } = useGlobalContext()
    const {
        visible = false,
        onClose = () => null,
    } = props

    const navigation: any = useNavigation()
    const [audioEnabled, setAudioEnabled] = useState(true)
    const [videoEnabled, setVideoEnabled] = useState(false)
    const [meetingID, setMeetingID] = useState('')
    const [meetingIDError, setMeetingIDError] = useState('')
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState('')
    const [openSettingsPopup, setOpenSettingsPopup] = useState(false)


    const onChangeMeetingID = (value: string) => {
        // setMeetingID(value.replace(/\s/g, ""))
        const cleanedInput = value.replace(/\D/g, '');

        const formattedInput = cleanedInput.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, p1, p2, p3) => {
            let result = p1;
            if(p2) result += ' ' + p2;
            if(p3) result += ' ' + p3;
            return result;
        });
        setMeetingID(formattedInput)

    }
    const onChangeName = (value: string) => setName(value)
    const onNameFocus = () => nameError && setNameError('')
    const onMeetingIDFocus = () => meetingIDError && setMeetingIDError('')


    useEffect(() => {
        DeviceInfo.getDeviceName().then((res) => {
            setName(res)
        })
    }, [])


    const [overlayLoader, setOverlayLoader] = useState({
        visible: false,
        message: ''
    })

    const hideSettingsPopup = () => setOpenSettingsPopup(false)
    const onChangeAudio = () => setAudioEnabled(!audioEnabled)
    const onChangeVideo = () => setVideoEnabled(!videoEnabled)

    const hideOverlayLoader = () => {
        setOverlayLoader({
            visible: false,
            message: ''
        })
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

    const onContinuePress = async () => {
        const meetingIDModified = meetingID.trim()
        const nameModified = name.trim()

        if(meetingIDModified.length === 0) {
            setMeetingIDError(emptyFieldError)
        }
        if(nameModified.length === 0) {
            setNameError(emptyFieldError)
        }
        else if(meetingIDModified.length !== 0 && nameModified.length !== 0) {
            const localMedia: any = await getLocalMedia()
            if(!localMedia) {
                setOpenSettingsPopup(false)
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
                message: 'joiningMeeting'
            })
            try {
                const deviceID = await getUniqueId()
                const response = await ApiServices.joinMeeting(meetingID.replace(/\s/g, ""), deviceID, name)
                setMeetingID('')
                setLocalMedia(localMedia)
                onClose()
                hideOverlayLoader()
                navigation.navigate("MeetingRoom",
                    {
                        participantData: {
                            name: name,
                            image: userImage,
                            fromHost: false,
                            isMute: !audioEnabled,
                            video: videoEnabled,
                            screenShare: false
                        },
                        deviceID: deviceID,
                        microphone: audioEnabled,
                        video: videoEnabled,
                        meetingID: meetingID.replace(/\s/g, ""),
                        from: 'participant',
                        meetingStartTime: response?.startTime
                    })
            } catch(error) {
                hideOverlayLoader()
            }
        }
    }


    return (
        <ActionSheet
            visible={visible}
            onClose={onClose}
            style={Styles.actionSheet}
        >
            <Text
                style={Styles.actionSheetHeading}
                overrideStyle={{ marginBottom: 40 }}
            >
                joinMeeting
            </Text>
            <Textinput
                label='meetingID'
                placeholderText='pleaseEnterMeetingID'
                inputStyle={{ backgroundColor: Colors.color9 }}
                value={meetingID}
                onChangeText={onChangeMeetingID}
                onFocus={onMeetingIDFocus}
                error={meetingIDError}
                keyboardType='decimal-pad'
                maxLength={11}
            />
            <Textinput
                label='name'
                placeholderText='enterNameDes'
                inputStyle={{ backgroundColor: Colors.color9 }}
                value={name}
                onChangeText={onChangeName}
                onFocus={onNameFocus}
                error={nameError}
            />
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
            <OverlayLoader
                visible={overlayLoader?.visible}
                message={overlayLoader?.message}
            />
            <Button
                text='continue'
                onPress={onContinuePress}
                buttonOuterStyle={Styles.continueBtn}
            />
            <OpenSettingsPopup
                visible={openSettingsPopup}
                onClose={hideSettingsPopup}
            />
        </ActionSheet>
    )
}

export default JoinMeetingPopup

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
    actionSheet: {
        alignItems: 'center'
    },
    switchFieldCon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp(86),
        marginVertical: 10
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
})