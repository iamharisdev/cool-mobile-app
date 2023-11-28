import { View, StyleSheet, Dimensions, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ripple from 'react-native-material-ripple'
import { Colors, Fonts, Images } from '../../res'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import { ActionSheet } from '../../components'
import { Typography, wp } from '../../global'
import { Switch } from 'react-native-switch'
import { Text } from '../../components'
import { Participants } from '../participants'
import Messages from '../messages/Messages'
import { useGlobalContext } from '../../services'
import { ApiServices } from '../../services/api'
import { flashSuccessMessage } from '../../components/FlashMessage'

interface controlsProps {
    microphone: boolean,
    video: boolean,
    screenShare: boolean,
    onMicEnablePress: () => void,
    onMicDisablePress: () => void,
    onVideoEnablePress: () => void,
    onVideoDisablePress: () => void,
    onScreenShareEnablePress: () => void,
    onScreenShareDisablePress: () => void
    onEndCall: () => void,
    fromHost: boolean,
    participantData: {},
    meetingID: string
}

const ControlsSection = (props: controlsProps) => {
    const {
        microphone,
        video,
        screenShare,
        fromHost,
        onMicEnablePress = () => { },
        onMicDisablePress = () => { },
        onVideoEnablePress = () => { },
        onVideoDisablePress = () => { },
        onScreenShareEnablePress = () => { },
        onScreenShareDisablePress = () => { },
        participantData = {},
        meetingID = ''
    } = props

    const { messages } = useGlobalContext()
    const [actionSheetVisible, setActionSheetVisible] = useState(false)
    const [participantsVisible, setParticipantsVisible] = useState(false)
    const [micEnabled, setMicEnabled] = useState(microphone)
    const [videoEnabled, setVideoEnabled] = useState(video)
    const [meetingLocked, setMeetingLocked] = useState(false)
    const [messagesVisible, setMessagesVisible] = useState(false)
    const unseenMessages = messages.filter((message: any) => !message.seen).length
    const [isMuteAll, setIsMuteAll] = useState(false)
    const [lockMeetingLoader, setLockMeetingLoader] = useState(false)

    const onEndCallPress = () => {
        props?.onEndCall && props?.onEndCall()
    }

    const onDotsPress = () => {
        setActionSheetVisible(true)
    }
    const hideActionSheet = () => {
        setActionSheetVisible(false)
    }
    const onChangeMeetingLock = async () => {
        setLockMeetingLoader(true)
        try {
            await ApiServices.updateMeetingLock(meetingID, !meetingLocked)
            flashSuccessMessage(meetingLocked ? 'Meeting unlocked' : 'Meeting locked')
            setMeetingLocked(!meetingLocked)
            setLockMeetingLoader(false)
        } catch(error) {
            setLockMeetingLoader(false)
        }
    }

    const showParticipants = () => {
        setParticipantsVisible(true)
    }
    const hideParticipants = () => {
        setParticipantsVisible(false)
    }

    const onMuteAll = () => setIsMuteAll(!isMuteAll)

    const showMessages = () => setMessagesVisible(true)
    const hideMessages = () => setMessagesVisible(false)

    useEffect(() => {
        setMicEnabled(microphone)
    }, [microphone])

    useEffect(() => {
        setVideoEnabled(video)
    }, [video])


    return (
        <View style={Styles.container}>
            <View style={Styles.callEndBtnOuterCon}>
                <Ripple style={Styles.callEndbtnCon}
                    onPress={onEndCallPress}
                >
                    <MaterialIcons name='call-end' color={Colors.color2} size={27} />
                </Ripple>
            </View>
            <View style={Styles.btnOuterCon}>
                {
                    micEnabled ?
                        <Ripple style={Styles.btnCon}
                            onPress={onMicDisablePress}
                        >
                            <MaterialIcons name='mic-none' color={Colors.color2} size={27} />
                        </Ripple>
                        :
                        <Ripple style={[Styles.btnCon, { backgroundColor: Colors.color8 }]}
                            onPress={onMicEnablePress}
                        >
                            <Ionicons name='mic-off-outline' color={Colors.color1} size={26} />
                        </Ripple>
                }
            </View>
            <View style={Styles.btnOuterCon}>
                {
                    videoEnabled ?
                        <Ripple style={Styles.btnCon}
                            onPress={onVideoDisablePress}
                        >
                            <Ionicons name='videocam-outline' color={Colors.color2} size={27} />
                        </Ripple>
                        :
                        <Ripple style={[Styles.btnCon, { backgroundColor: Colors.color8 }]}
                            onPress={onVideoEnablePress}
                        >
                            <Ionicons name='videocam-off-outline' color={Colors.color1} size={26} />
                        </Ripple>
                }
            </View>
            <View style={Styles.btnOuterCon}>
                {
                    screenShare ?
                        <Ripple style={Styles.btnCon}
                            onPress={onScreenShareDisablePress}
                        >
                            <Image
                                source={Images.stopScreenShare}
                                resizeMode="contain"
                                style={Styles.stopScreenShare}
                            />
                        </Ripple>
                        :
                        <Ripple style={Styles.btnCon}
                            onPress={onScreenShareEnablePress}
                        >
                            <Image
                                source={Images.screenShare}
                                resizeMode="contain"
                                style={Styles.screenShare}
                            />
                        </Ripple>
                }
            </View>
            <View>
                <View style={Styles.btnOuterCon}>
                    <Ripple style={Styles.btnCon}
                        onPress={showMessages}
                    >
                        <Ionicons name='chatbubble-ellipses-outline' color={Colors.color2} size={25} />
                    </Ripple>
                </View>
                {
                    unseenMessages > 0 &&
                    <View style={Styles.unSeenMessageCon}>
                        <Text style={Styles.unSeenMessage} numberOfLines={1}>
                            {unseenMessages}
                        </Text>
                    </View>
                }
            </View>
            {
                fromHost &&
                <>
                    <View style={Styles.btnOuterCon}>
                        <Ripple style={Styles.btnCon}
                            onPress={showParticipants}
                        >
                            <Feather name='users' color={Colors.color2} size={21.8} />
                        </Ripple>
                    </View>
                    <View style={Styles.btnOuterCon}>
                        <Ripple style={Styles.btnCon}
                            onPress={onDotsPress}
                        >
                            <MaterialCommunityIcons name='dots-vertical' color={Colors.color2} size={24} />
                        </Ripple>
                    </View>

                    <ActionSheet
                        visible={actionSheetVisible}
                        onClose={hideActionSheet}
                        containerStyle={Styles.actionSheetContainer}
                        indicatorStyle={{ backgroundColor: Colors.color1 }}
                        style={Styles.actionSheet}
                        hideCloseButton
                    >
                        <View style={Styles.lockMeetingHeader}>
                            <View style={Styles.actionSheetFieldCon}>
                                <Octicons name="lock" size={25} color={Colors.color8} />
                                <Text style={Styles.actionSheetFieldheading}>
                                    lockTheMeeting
                                </Text>
                            </View>
                            {
                                lockMeetingLoader ?
                                    <ActivityIndicator color={Colors.color8} size={'small'} />
                                    :
                                    <Switch
                                        value={meetingLocked}
                                        onValueChange={onChangeMeetingLock}
                                        renderActiveText={false}
                                        renderInActiveText={false}
                                        circleSize={22}
                                        backgroundActive={Colors.color4}
                                        backgroundInactive={Colors.color1}
                                        innerCircleStyle={Styles.switchInner}
                                    />
                            }
                        </View>
                        <Text style={Styles.actionSheetFieldDes}>
                            lockTheMeetingDescription
                        </Text>
                    </ActionSheet>
                    {
                        participantsVisible &&
                        <Participants
                            visible={participantsVisible}
                            onClose={hideParticipants}
                            onMicDisablePress={onMicDisablePress}
                            onMicEnablePress={onMicEnablePress}
                            microphone={microphone}
                            onMuteAll={onMuteAll}
                            isMuteAll={isMuteAll}
                        />
                    }
                </>
            }
            {
                messagesVisible &&
                <Messages
                    visible={messagesVisible}
                    onClose={hideMessages}
                    participantData={participantData}
                />
            }
        </View >
    )
}

export default ControlsSection

const { width } = Dimensions.get('window')
const Styles = StyleSheet.create({
    container: {
        borderWidth: 0,
        borderColor: 'red',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    callEndBtnOuterCon: {
        borderRadius: width * 1 * 0.15 / 2,
        overflow: 'hidden',
    },
    callEndbtnCon: {
        width: width * 0.15,
        height: width * 1 * 0.15,
        borderRadius: width * 1 * 0.15 / 2,
        backgroundColor: Colors.color14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnOuterCon: {
        overflow: 'hidden',
        borderRadius: width * 1 * 0.12 / 2,
    },
    btnCon: {
        width: width * 0.12,
        height: width * 1 * 0.12,
        borderRadius: width * 1 * 0.12 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.color13
    },
    screenShare: {
        width: width * 0.068,
        height: width * 1 * 0.068,
    },
    stopScreenShare: {
        width: width * 0.058,
        height: width * 1 * 0.058,
    },
    actionSheet: {
        paddingTop: 15,
        paddingHorizontal: wp(4)
    },
    actionSheetContainer: {
        backgroundColor: Colors.color13,
        paddingBottom: 30,
    },
    actionSheetFieldCon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lockMeetingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    actionSheetFieldheading: {
        color: Colors.color8,
        fontFamily: Fonts.APPFONT_SB,
        includeFontPadding: false,
        fontSize: Typography.small1,
        marginHorizontal: wp(3)
    },
    switchInner: {
        borderWidth: 1,
        borderColor: Colors.color12,
    },
    actionSheetFieldDes: {
        color: Colors.color8,
        fontFamily: Fonts.APPFONT_R,
        fontSize: Typography.tiny1,
        includeFontPadding: false,
        marginTop: 30,
        width: wp(80)
    },
    unSeenMessageCon: {
        minWidth: width * 0.06,
        maxWidth: width * 0.1,
        height: width * 1 * 0.06,
        borderRadius: width * 1 * 0.06 / 2,
        backgroundColor: Colors.color4,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        paddingHorizontal: 2,
        right: 0,
        top: -8
    },
    unSeenMessage: {
        color: Colors.color2,
        fontFamily: Fonts.APPFONT_R,
        includeFontPadding: false,
        fontSize: 13
    }
})