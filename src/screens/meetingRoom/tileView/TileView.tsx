import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FlatList } from 'react-native'
import { Typography, wp } from '../../../global'
import { Colors, Fonts } from '../../../res'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import Ripple from 'react-native-material-ripple'
import { Animation } from '../../../animations'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useTranslation } from 'react-i18next'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { MediaStream, RTCView } from 'react-native-webrtc'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DeviceInfo from 'react-native-device-info'

const { width } = Dimensions.get('window')

interface TileViewProps {
    rtcAllConnections: [],
    video: boolean,
    microphone: boolean,
    screenShare: boolean,
    localMedia: any
    onStopScreenSharingPress: () => void,
    handleFullScreen: () => void,
    meetingEnderDeviceID: string,
    emptyMeetingEnderDeviceID: () => void
}

const TileView = (props: TileViewProps) => {
    const { t } = useTranslation()
    const [isFullScreen, setIsFullScreen] = useState(false)
    const { rtcAllConnections, video, screenShare,
        onStopScreenSharingPress = () => { },
        localMedia,
        microphone = true,
    } = props
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [microphoneLocal, setMicrophoneLocal] = useState(microphone)
    const onItemPress = (item: any, index: any, remoteStream: any) => {
        if(remoteStream) {
            item.remoteStream = remoteStream
        }
        item.index = index
        setSelectedItem(item)
    }

    useEffect(() => {
        setMicrophoneLocal(microphone)
    }, [microphone])


    useEffect(() => {
        if(props?.meetingEnderDeviceID && props?.meetingEnderDeviceID?.length !== 0) {
            if(selectedItem && selectedItem.length !== 0) {
                if(props?.meetingEnderDeviceID === selectedItem?.senderDeviceID) {
                    onSelectedItemClose()
                    props?.emptyMeetingEnderDeviceID()
                }
                else {
                    props?.emptyMeetingEnderDeviceID()
                }
            }
            else {
                props?.emptyMeetingEnderDeviceID()
            }
        }
    }, [props?.meetingEnderDeviceID])


    const renderItems = (item: any, index: any, fromHorizontal: any) => {
        const participantData = item?.participantData
        let showItem = false
        if(fromHorizontal) {
            showItem = selectedItem?.index === index ? false : selectedItem?.index !== index && participantData ? true : false
        }
        else {
            showItem = participantData && !selectedItem ? true : false
        }

        const transceivers = item?._transceivers;
        let remoteStream = null;

        for(const transceiver of transceivers) {
            const receiver = transceiver?.transceiver?._receiver;
            if(receiver && receiver?._track && receiver?._track.kind === 'video') {
                receiver._track._muted = false
                remoteStream = [receiver?._track]
                break;
            }
        }

        return (
            showItem ? <Animation style={fromHorizontal ? Styles.horizontalItemCon : Styles.itemContainer} >
                <TouchableOpacity
                    style={fromHorizontal ? Styles.horizontalItemContainerInner : Styles.itemContainerInner}
                    onPress={onItemPress.bind(null, item, index, remoteStream)}
                >
                    {
                        item?.you && screenShare ?
                            <TouchableOpacity style={Styles.stopSharingBtn}
                                onPress={onStopScreenSharingPress}
                            >
                                <MaterialCommunityIcons name='close-box-outline' color={Colors.color8} size={23} />
                                <Text style={Styles.stopSharingTxt}>
                                    {t('stopSharing')}
                                </Text>
                            </TouchableOpacity>
                            :
                            item?.you && video ?
                                <RTCView
                                    streamURL={localMedia?.toURL()}
                                    style={Styles.videoItem}
                                    objectFit='cover'
                                />
                                : !item?.you
                                    && (participantData?.video || participantData?.screenShare)
                                    && remoteStream ?
                                    <RTCView
                                        streamURL={new MediaStream(remoteStream)?.toURL()}
                                        style={Styles.videoItem}
                                        objectFit={participantData.screenShare ? 'contain' : 'cover'}
                                    />
                                    :
                                    <View style={fromHorizontal ? Styles.horizontalItemImage : Styles.image}>
                                        {
                                            participantData?.image ?
                                                <Image
                                                    source={{ uri: participantData?.image }}
                                                    resizeMode='cover'
                                                    style={fromHorizontal ? Styles.horizontalItemImage : Styles.image}
                                                />
                                                :
                                                <FontAwesome6
                                                    name='user-large'
                                                    size={fromHorizontal ? width * 0.1 : width * 0.22}
                                                    color={Colors.color11}
                                                    style={fromHorizontal ? Styles.horizontalItemUserIcon : Styles.userIcon}
                                                />
                                        }
                                    </View>
                    }
                    <Text style={fromHorizontal ? Styles.horizontalItemUserName : Styles.userName}>
                        {item?.you ? t('you') : participantData?.name}
                    </Text>
                    {
                        (participantData?.isMute || (item?.you && !microphoneLocal)) &&
                        <Ionicons name='mic-off-outline' color={Colors.color2} size={fromHorizontal ? 18 : 24}
                            style={fromHorizontal ? Styles.horizontalItemMuterMic : Styles.mutedMic} />
                    }
                </TouchableOpacity>
            </Animation> : null
        )
    }

    const onSelectedItemClose = () => {
        setSelectedItem(null)
        isFullScreen && (
            setIsFullScreen(false),
            props?.handleFullScreen && props?.handleFullScreen()
        )
    }
    const handleFullScreenPress = () => {
        setIsFullScreen(!isFullScreen)
        props?.handleFullScreen && props?.handleFullScreen()
    }

    const renderSelectedItem = () => {
        return (
            <Animation
                style={[Styles.selectedItemContainer, isFullScreen && Styles.selectedItemContainerModal]}
                animation={'fadeInUp'}
                duration={600}
            >
                {
                    selectedItem?.you && screenShare ?
                        <TouchableOpacity style={Styles.stopSharingBtn}
                            onPress={onStopScreenSharingPress}
                        >
                            <MaterialCommunityIcons name='close-box-outline' color={Colors.color8} size={23} />
                            <Text style={Styles.stopSharingTxt}>
                                {t('stopSharing')}
                            </Text>
                        </TouchableOpacity>
                        :
                        selectedItem?.you && video ?
                            <RTCView
                                streamURL={localMedia?.toURL()}
                                style={Styles.videoItem}
                                objectFit='cover'
                            />
                            :
                            !selectedItem?.participantData?.you &&
                                selectedItem?.remoteStream &&
                                (selectedItem?.participantData?.video ||
                                    selectedItem?.participantData?.screenShare
                                ) ?
                                <RTCView
                                    streamURL={new MediaStream(selectedItem?.remoteStream)?.toURL()}
                                    style={Styles.videoItem}
                                    objectFit={selectedItem?.participantData?.screenShare ? 'contain' : 'cover'}
                                />
                                :
                                <View style={Styles.selectedImage}>
                                    {
                                        selectedItem?.participantData?.image ?
                                            <Image
                                                source={{ uri: selectedItem?.participantData?.image }}
                                                resizeMode='cover'
                                                style={Styles.selectedImage}
                                            />
                                            :
                                            <FontAwesome6
                                                name='user-large'
                                                size={width * 0.55}
                                                color={Colors.color11}
                                                style={Styles.selectedUserIcon}
                                            />
                                    }
                                </View>
                }
                <View style={Styles.selectedItemCloseOuter}>
                    <Ripple style={Styles.selectedItemClose}
                        onPress={onSelectedItemClose}
                    >
                        <AntDesign name='close' color={Colors.color2} size={25} />
                    </Ripple>
                </View>
                {
                    selectedItem?.participantData?.isMute &&
                    <Ionicons name='mic-off-outline' color={Colors.color2}
                        size={24}
                        style={Styles.selectedItemMutedMic}
                    />
                }
                <Text style={[Styles.userName, { left: wp(4), bottom: 10 }]}>
                    {selectedItem?.participantData?.name}
                </Text>
                <View style={Styles.selectedItemFullScreenBtn}>
                    <Ripple style={Styles.selectedItemFullScreenInner}
                        onPress={handleFullScreenPress}
                    >
                        {
                            isFullScreen ?
                                <MaterialIcons name='fullscreen-exit' color={Colors.color2} size={38} />
                                :
                                <Octicons name='screen-full' color={Colors.color2} size={25} />
                        }
                    </Ripple>
                </View>
            </Animation>
        )
    }



    return (
        <View style={[Styles.container, isFullScreen && Styles.containerFullScreen]}>
            <FlatList
                data={rtcAllConnections}
                renderItem={({ item, index }) => renderItems(item, index, false)}
                contentContainerStyle={Styles.listContainer}
                numColumns={2}
            />
            {
                selectedItem &&
                <View style={Styles.selectedItemOuterCon}>
                    {renderSelectedItem()}
                    {
                        rtcAllConnections?.length > 1 && !isFullScreen &&
                        <Animation
                            animation='fadeInRightBig'
                            duration={800}
                        >
                            <FlatList
                                data={rtcAllConnections}
                                renderItem={({ item, index }) => renderItems(item, index, true)}
                                horizontal
                                contentContainerStyle={Styles.horizontalListContainer}
                                showsHorizontalScrollIndicator={false}
                            />
                        </Animation>
                    }
                </View>
            }
        </View>
    )
}

export default TileView

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        paddingBottom: 10
    },
    containerFullScreen: {
        paddingTop: 0,
        paddingBottom: 0
    },
    listContainer: {
        flexGrow: 1,
        paddingBottom: 20,
        paddingTop: 10,
    },
    itemContainer: {
        marginRight: wp(2),
        marginBottom: 10,
        borderRadius: 12,
        overflow: 'hidden'
    },
    itemContainerInner: {
        borderRadius: 12,
        width: wp(45),
        height: 200,
        backgroundColor: Colors.color13,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userIcon: {
        marginTop: 23
    },
    image: {
        width: width * 0.27,
        height: width * 0.27 * 1,
        borderRadius: width * 0.27 * 1 / 2,
        backgroundColor: Colors.color1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    userName: {
        includeFontPadding: false,
        position: 'absolute',
        color: Colors.color2,
        fontFamily: Fonts.APPFONT_B,
        fontSize: Typography.tiny1,
        maxWidth: wp(35),
        left: wp(2.5),
        bottom: 8,
        textShadowColor: Colors.color1,
        textShadowOffset: { width: 0, height: 1.5 },
        textShadowRadius: 4,
    },
    mutedMic: {
        position: 'absolute',
        top: 8,
        right: wp(2.5),
    },
    screenShareItemCon: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    selectedItemOuterCon: {
        position: 'absolute',
        backgroundColor: Colors.color1,
        width: wp(100),
        marginLeft: wp(-4),
        height: '100%',
    },
    selectedItemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.color13,
        marginHorizontal: wp(3.5),
        marginTop: 8,
        borderRadius: 15,
        overflow: 'hidden',
        flex: 1,
        marginBottom: 10
    },
    selectedItemContainerModal: {
        marginTop: 0,
        marginBottom: 0,
        marginHorizontal: 0,
    },
    screenShare: {
        width: '100%',
        height: '100%',
    },
    selectedItemCloseOuter: {
        position: 'absolute',
        top: 5,
        right: 6,
        borderRadius: width * 1 * 0.1 / 2,
        overflow: 'hidden'
    },
    selectedItemClose: {
        width: width * 0.1,
        height: width * 1 * 0.1,
        borderRadius: width * 1 * 0.1 / 2,
        backgroundColor: Colors.color1RGBA60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedItemMutedMic: {
        position: 'absolute',
        top: 12,
        left: 10,
    },
    selectedImage: {
        width: width * 0.65,
        height: width * 0.65 * 1,
        borderRadius: width * 0.65 * 1 / 2,
        backgroundColor: Colors.color1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    selectedUserIcon: {
        marginTop: 47
    },
    horizontalItemCon: {
        marginRight: wp(2),
        borderRadius: 12,
        overflow: 'hidden'
    },
    horizontalListContainer: {
        marginLeft: wp(4),
        paddingRight: wp(6)
    },
    horizontalItemContainerInner: {
        borderRadius: 12,
        width: 110,
        height: 110,
        backgroundColor: Colors.color13,
        justifyContent: 'center',
        alignItems: 'center'
    },
    horizontalItemImage: {
        width: width * 0.15,
        height: width * 0.15 * 1,
        borderRadius: width * 0.15 * 1 / 2,
        backgroundColor: Colors.color1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    horizontalItemUserIcon: {
        marginTop: 20
    },
    horizontalItemUserName: {
        includeFontPadding: false,
        position: 'absolute',
        color: Colors.color2,
        fontFamily: Fonts.APPFONT_B,
        fontSize: 13,
        maxWidth: wp(24),
        left: wp(2),
        bottom: 3,
        textShadowColor: Colors.color1,
        textShadowOffset: { width: 0, height: 1.5 },
        textShadowRadius: 4,
    },
    horizontalItemMuterMic: {
        position: 'absolute',
        top: 5,
        right: wp(1),
    },
    videoItem: {
        width: '100%',
        height: '100%',
    },
    stopSharingBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.color1,
        paddingVertical: 12,
        paddingHorizontal: wp(5),
        borderRadius: 8
    },
    stopSharingTxt: {
        color: Colors.color8,
        includeFontPadding: false,
        fontFamily: Fonts.APPFONT_R,
        fontSize: Typography.tiny,
        marginLeft: wp(2),
        marginBottom: 3
    },
    selectedItemFullScreenBtn: {
        position: 'absolute',
        bottom: 5,
        right: 6,
        borderRadius: width * 1 * 0.1 / 10,
        overflow: 'hidden'
    },
    selectedItemFullScreenInner: {
        width: width * 0.1,
        height: width * 1 * 0.1,
        borderRadius: width * 1 * 0.1 / 10,
        backgroundColor: Colors.color1RGBA60,
        justifyContent: 'center',
        alignItems: 'center'
    }
})