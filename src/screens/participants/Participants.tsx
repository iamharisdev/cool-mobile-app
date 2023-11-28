import { View, Text as ReactText, StyleSheet, Dimensions, Image, TouchableOpacity, Alert, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ActionSheet, Text } from '../../components'
import { Colors, Fonts, Images } from '../../res'
import SearchBar from './SearchBar'
import { Typography, hp, wp } from '../../global'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import Ripple from 'react-native-material-ripple'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import { useGlobalContext } from '../../services'
import { getDeviceID } from '../../services/common/CommonServices'
import { OverlayLoader } from '../../components/loaders'
import { flashSuccessMessage } from '../../components/FlashMessage'

interface ParticipantsProps {
    visible: boolean,
    microphone: boolean,
    onClose: () => void,
    onMicDisablePress: () => void,
    onMicEnablePress: () => void,
    onMuteAll: () => void,
    isMuteAll: boolean
}
const Participants = (props: ParticipantsProps) => {
    const { socket, rtcAllConnections, setRtcAllConnections } = useGlobalContext()
    const [rtcAllConnectionsLocal, setRtcAllConnectionsLocal] = useState([])
    const { t } = useTranslation()
    const {
        visible = false,
        microphone = true,
        onClose = () => { },
        onMicDisablePress = () => { },
        onMicEnablePress = () => { },
        isMuteAll = false
    } = props
    const [muteAll, setMuteAll] = useState(isMuteAll)
    const [overlayLoader, setOverlayLoader] = useState({
        visible: false,
        message: ''
    })


    useEffect(() => {
        setRtcAllConnectionsLocal(rtcAllConnections)
    }, [rtcAllConnections])

    const onParticipantDataUpdate = async (item: any) => {
        const foundIndex = rtcAllConnections.findIndex((element: any) => element?.senderDeviceID === item?.senderDeviceID);
        if(foundIndex !== -1) {
            rtcAllConnections[foundIndex] = item
            setRtcAllConnections(rtcAllConnections)
        }
    }

    const onMutePress = async (item: any) => {
        item.participantData.isMute = true
        onParticipantDataUpdate(item)
        if(item?.you) {
            onMicDisablePress()
        }
        else {
            await socket.emit('room.private-message', {
                activityType: 'participantMic',
                deviceID: item?.senderDeviceID,
                isMute: true
            })
        }
    }
    const onUnMutePress = async (item: any) => {
        item.participantData.isMute = false
        onParticipantDataUpdate(item)
        if(item?.you) {
            onMicEnablePress()
        }
        else {
            await socket.emit('room.private-message', {
                activityType: 'participantMic',
                deviceID: item?.senderDeviceID,
                isMute: false
            })
        }
    }

    const onItemScreenSharePress = async (item: any) => {
        await socket.emit('room.private-message', {
            activityType: 'screenShareRequest',
            deviceID: item?.senderDeviceID,
        })
        flashSuccessMessage('screenSharingRequestSent')
    }

    const renderParticipants = ({ item, index }: any) => {
        const isLast = (rtcAllConnections?.length - 1) === index ? true : false

        return (
            <View style={Styles.itemCon}>
                <View style={Styles.image}>
                    {
                        item?.participantData?.image ?
                            <Image
                                source={{ uri: item?.participantData?.image }}
                                resizeMode="cover"
                                style={Styles.image}
                            />
                            :
                            <FontAwesome6
                                name='user-large'
                                size={width * 0.1}
                                color={Colors.color11}
                                style={Styles.userIcon}
                            />
                    }
                </View>
                <View style={[Styles.itemDetailCon, { borderBottomWidth: isLast ? 0 : 1 }]}>
                    <Text style={Styles.userName}>
                        {item?.you ? t('you') : item?.participantData?.name}
                    </Text>
                    <View style={Styles.controlsCon}>
                        {
                            !item?.you && !item?.participantData.screenShare &&
                            <Ripple
                                onPress={onItemScreenSharePress.bind(null, item)}
                            >
                                <Image
                                    source={Images.screenShare}
                                    resizeMode="contain"
                                    style={Styles.screenShare}
                                />
                            </Ripple>
                        }
                        {
                            item?.participantData?.isMute || (item?.you && !microphone) ?
                                <Ripple onPress={onUnMutePress.bind(null, item)}>
                                    <Ionicons name='mic-off-outline' color={Colors.color2} size={24} />
                                </Ripple>
                                :
                                <Ripple onPress={onMutePress.bind(null, item)}>
                                    <MaterialIcons name='mic-none' color={Colors.color2} size={25} />
                                </Ripple>
                        }
                    </View>
                </View>
            </View>
        )
    }

    const hideOverlayLoader = () => {
        setOverlayLoader({
            visible: false,
            message: ''
        })
    }

    const onMuteAllPress = async () => {
        setOverlayLoader({
            visible: true,
            message: !muteAll ? 'muttingAll' : 'UnMutting All'
        })
        const deviceID = await getDeviceID()
        await socket.emit('room.activity', {
            activityType: 'muteAll',
            senderDeviceID: deviceID,
            muteAll: !muteAll
        })
        !muteAll ? Alert.alert(t('allMuted')) : Alert.alert(t('allUnMuted'))
        setMuteAll(!muteAll)
        hideOverlayLoader()
        props?.onMuteAll && props?.onMuteAll()
    }

    const onSearch = (text: any) => {
        const filteredConnections = rtcAllConnectionsLocal.filter((connection: any) => {
            const lowerCaseName = connection?.participantData?.name?.toLowerCase()?.trim(); // Convert name to lowercase and trim
            return lowerCaseName.includes(text.toLowerCase().trim());
        });
        setRtcAllConnectionsLocal(filteredConnections)
    }

    const loadInitial = () => {
        setRtcAllConnectionsLocal(rtcAllConnections)
    }

    return (
        <ActionSheet
            visible={visible}
            onClose={onClose}
            indicatorStyle={{ backgroundColor: Colors.color13 }}
            containerStyle={Styles.actionSheetContainer}
            closeButtonStyle={Styles.closeButtonStyle}
            closeIconColor={Colors.color8}
            style={Styles.actionSheet}
        >
            <ReactText style={Styles.headerHeading}>
                {t('meetingParticipants')} ({rtcAllConnections?.length})
            </ReactText>
            <SearchBar
                onSearch={onSearch}
                loadInitial={loadInitial}
            />
            {
                rtcAllConnectionsLocal?.length !== 0 &&
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onMuteAllPress}
                >
                    <ReactText style={Styles.muteAll}>
                        {muteAll ? t('unMuteAll') : t('muteAll')}
                    </ReactText>
                </TouchableOpacity>
            }
            <OverlayLoader
                visible={overlayLoader?.visible}
                message={overlayLoader?.message}
            />
            <FlatList
                data={rtcAllConnectionsLocal}
                renderItem={renderParticipants}
                contentContainerStyle={Styles.listContainer}
            />
        </ActionSheet>
    )
}

export default Participants

const { width } = Dimensions.get('window')

const Styles = StyleSheet.create({
    actionSheetContainer: {
        backgroundColor: Colors.color13,
        paddingBottom: 30,
    },
    closeButtonStyle: {
        backgroundColor: Colors.color1
    },
    actionSheet: {
        paddingTop: 40,
        paddingHorizontal: wp(5),
        height: hp(87)
    },
    headerHeading: {
        position: 'absolute',
        alignSelf: 'center',
        includeFontPadding: false,
        color: Colors.color8,
        fontFamily: Fonts.APPFONT_SB,
        top: -6.5,
        fontSize: Typography.tiny1
    },
    listContainer: {
        paddingTop: 15
    },
    itemCon: {
        flexDirection: 'row',
        paddingVertical: 10
    },
    image: {
        width: width * 0.13,
        height: width * 1 * 0.13,
        borderRadius: width * 1 * 0.13 / 2,
        backgroundColor: Colors.color1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    userIcon: {
        marginTop: 12
    },
    itemDetailCon: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.color16,
        paddingBottom: 10,
        marginBottom: -10,
        flex: 1,
        marginLeft: wp(2),
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    userName: {
        color: Colors.color8,
        fontFamily: Fonts.APPFONT_SB,
        includeFontPadding: false,
        fontSize: Typography.small1,
    },
    controlsCon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    screenShare: {
        width: width * 0.068,
        height: width * 1 * 0.068,
        marginRight: wp(5),
        marginTop: 2
    },
    muteAll: {
        color: Colors.color8,
        fontFamily: Fonts.APPFONT_SB,
        alignSelf: 'flex-end',
        fontSize: Typography.small,
        includeFontPadding: false,
        marginTop: 20,
    }
})