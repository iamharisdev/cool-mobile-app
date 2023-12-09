import {
    View, StyleSheet, Dimensions, FlatList, Modal, SafeAreaView,
    StatusBar, TouchableOpacity, Platform, TextInput, ScrollView, Text as ReactText,
    Image as ReactImage
} from 'react-native'
import React, { useState, useEffect, useReducer } from 'react'
import { Colors, Fonts, Images } from '../../res'
import { Typography, wp } from '../../global'
import { Image, Text } from '../../components'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ripple from 'react-native-material-ripple'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useGlobalContext } from '../../services'
import { getDeviceID, getTimeStamp } from '../../services/common/CommonServices'
import moment from 'moment'
import Clipboard from '@react-native-clipboard/clipboard';
import ImagePicker from 'react-native-image-crop-picker';


interface MeetingProps {
    visible: boolean,
    onClose: () => void,
    participantData: any
}

const Messages = (props: MeetingProps) => {
    const { socket, setMessages, messages } = useGlobalContext()
    const [messageInput, setMessageInput] = useState('')
    const [deviceID, setDeviceID] = useState('')
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [imageToSend, setImageToSend] = useState('')
    const [imageToSendSize, setImageToSendSize] = useState(3)

    const {
        visible = false,
        onClose = () => { },
        participantData = {}
    } = props

    useEffect(() => {
        getDeviceID().then((id) => {
            setDeviceID(id)
        })
    }, [])


    const handleMessageSeen = async () => {
        const hasUnseenMessages = messages.some((message: any) => !message.seen)
        if(hasUnseenMessages) {
            const updatedMessages = messages.map((message: any) => {
                return { ...message, seen: true };
            });
            setMessages(updatedMessages);
        }
    };

    useEffect(() => {
        handleMessageSeen();
    }, [messages]);

    const onMessagePress = (item: any) => {
        messages.forEach((element: any) => {
            if(item.createdAt === element.createdAt) {
                if(element.selected) {
                    element.selected = false
                    element.copied = false
                }
                else {
                    element.selected = true
                    element.copied = false
                }
            }
            else {
                element.selected = false
                element.copied = false
            }
        })
        forceUpdate()
    }

    const onCopyMessagePress = (item: any) => {
        item.copied = true
        Clipboard.setString(item?.message);
        forceUpdate()
        setTimeout(() => {
            item.copied = false
            item.selected = false
            forceUpdate()
        }, 1500);
    }

    const renderMessages = ({ item }: any) => {
        const isMyMessage = item?.deviceID === deviceID ? true : false
        const isSelected = item?.selected ? true : false

        return (
            <TouchableOpacity
                style={[Styles.itemContainer,
                isMyMessage ? Styles.myMessageCon : Styles.otherMessageCon]}
                onPress={onMessagePress.bind(null, item)}
                activeOpacity={0.8}
            >
                <Text style={Styles.userName}>
                    {isMyMessage ? 'you' : item?.name}
                </Text>
                <Text style={Styles.messageTxt}>
                    {item?.message}
                </Text>
                {
                    item?.image && item?.image?.length !== 0 &&
                    <Image
                        images={[item?.image]}
                        resizeMode='cover'
                        style={Styles.messageImage}
                    />
                }
                <ReactText style={Styles.messageTime}>
                    {moment(item?.createdAt).format('HH:mm')}
                </ReactText>
                {
                    isSelected &&
                    <TouchableOpacity style={[Styles.messageOptionCon, {
                        backgroundColor: item?.copied ? Colors.color21 : Colors.color1RGBA50
                    }]}
                        activeOpacity={0.9}
                        onPress={onCopyMessagePress.bind(null, item)}
                    >
                        <Text style={Styles.messageOptionTxt}>
                            {
                                item.copied ?
                                    'Copied'
                                    :
                                    'Copy message'}
                        </Text>
                    </TouchableOpacity>
                }
            </TouchableOpacity>
        )
    }

    const onChangeText = (text: string) => setMessageInput(text)

    const onSendPress = async () => {
        setMessageInput('')
        let messageObj: any = {
            deviceID,
            message: messageInput,
            createdAt: new Date(),
            name: participantData?.name,
            id: getTimeStamp()
        }
        if(imageToSend.length !== 0) {
            messageObj.image = imageToSend
            setImageToSend('')
        }
        const newMessageArray = [
            messageObj,
            ...messages,
        ]
        setMessages(newMessageArray)
        if(imageToSend.length !== 0) {
            setImageToSend('')
            const chunkSize = imageToSend.length / imageToSendSize;
            const totalChunks = Math.ceil(imageToSend.length / chunkSize);
            let chunksProcessed = 0;

            async function sendChunk(chunk: any, callback: any) {
                await socket?.emit('room.activity', {
                    activityType: 'messages',
                    id: messageObj.id,
                    chunk: chunk
                })
                chunksProcessed++;
                if(chunksProcessed === totalChunks) {
                    if(callback) {
                        callback();
                    }
                }
            }
            for(let i = 0; i < imageToSend.length; i += chunkSize) {
                const chunk = imageToSend.substring(i, i + chunkSize);
                sendChunk(chunk, async () => {
                    delete messageObj.image
                    await socket?.emit('room.activity', {
                        activityType: 'messages',
                        chunkFinished: true,
                        ...messageObj,
                    })
                });
            }
        } else {
            await socket?.emit('room.activity', {
                activityType: 'messages',
                ...messageObj
            })
        }
    }

    const hideSelectedMessageOptions = () => {
        messages.forEach((element: any) => {
            element.selected = false
            element.copied = false
        })
        forceUpdate()
    }

    const onGalleryPress = () => {
        ImagePicker.openPicker({
            cropping: false,
            mediaType: 'photo',
            cropperCancelText: 'Cancel',
            cropperChooseText: 'Choose',
            includeBase64: true,
            compressImageQuality: 0.5
        }).then(async (image: any) => {
            const sizeInMB = parseFloat((image?.size / (1024 * 1024)).toFixed(1));
            setImageToSend(`data:image/jpeg;base64,${image?.data}`)
            setImageToSendSize(sizeInMB * 3)
        })
    }

    const onCloseImagePress = () => {
        setImageToSend('')
    }

    return (
        <Modal
            visible={visible}
            transparent={false}
            onRequestClose={onClose}
            animationType="slide"
        >
            <SafeAreaView style={Styles.safeAreaView} />
            <StatusBar backgroundColor={Colors.color1} barStyle='light-content' />
            <View style={Styles.container}>
                <View style={Styles.header}>
                    <Text style={Styles.headerTitle}>
                        messages
                    </Text>
                    <TouchableOpacity
                        style={Styles.headerLeft}
                        activeOpacity={0.7}
                        onPress={onClose}
                    >
                        <AntDesign name='left' color={Colors.color6} size={22} style={{ marginTop: 1.5 }} />
                        <Text style={Styles.headerLeftTxt}>
                            back
                        </Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    contentContainerStyle={{ flex: 1 }}
                    keyboardShouldPersistTaps='always'
                    automaticallyAdjustKeyboardInsets
                    scrollEnabled={false}
                >
                    <TouchableOpacity style={{ flex: 1 }}
                        activeOpacity={1}
                        onPress={hideSelectedMessageOptions}
                    >
                        <ScrollView horizontal scrollEnabled={false} contentContainerStyle={{ flex: 1 }}>
                            <FlatList
                                data={messages}
                                renderItem={renderMessages}
                                contentContainerStyle={Styles.listContainer}
                                inverted
                            />
                        </ScrollView>
                    </TouchableOpacity>
                    <View style={Styles.inputOuterCon}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={onGalleryPress}
                        >
                            <ReactImage
                                source={Images.gallery}
                                resizeMode='contain'
                                style={Styles.gallery}
                            />
                        </TouchableOpacity>
                        <View style={Styles.inputContainer}>
                            {
                                imageToSend.length !== 0 &&
                                <View style={Styles.inputImageOuter}>
                                    <Image
                                        images={[imageToSend]}
                                        resizeMode='cover'
                                        style={Styles.inputImage}
                                    />
                                    <TouchableOpacity
                                        style={Styles.closeImage}
                                        onPress={onCloseImagePress}
                                    >
                                        <AntDesign
                                            name='closecircle'
                                            size={22}
                                            color={Colors.color2}
                                        />
                                    </TouchableOpacity>

                                </View>
                            }
                            <TextInput
                                value={messageInput}
                                onChangeText={onChangeText}
                                style={[Styles.input, imageToSend.length !== 0 && { paddingLeft: wp(6), paddingBottom: 20 }]}
                                multiline
                                keyboardAppearance="dark"
                            />
                        </View>

                        <Ripple style={Styles.sendBtn}
                            onPress={onSendPress}
                            disabled={
                                messageInput.length === 0 && imageToSend.length === 0
                                    ? true : false
                            }
                        >
                            <Ionicons name='send' color={Colors.color2} size={20} />
                        </Ripple>
                    </View>
                </ScrollView>

            </View>
        </Modal>
    )
}

export default Messages

const { width } = Dimensions.get('window')

const Styles = StyleSheet.create({
    safeAreaView: {
        backgroundColor: Colors.color1
    },
    container: {
        flex: 1,
        backgroundColor: Colors.color1,
    },
    header: {
        backgroundColor: Colors.color1,
        paddingVertical: 10,
        paddingHorizontal: wp(2),
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLeftTxt: {
        color: Colors.color6,
        fontFamily: Fonts.APPFONT_R,
        fontSize: Typography.small1,
        includeFontPadding: false,
        marginBottom: 1.5
    },
    headerTitle: {
        position: 'absolute',
        color: Colors.color2,
        alignSelf: 'center',
        textAlign: 'center',
        width: wp(100),
        includeFontPadding: false,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.small
    },
    listContainer: {
        flexGrow: 1,
        paddingTop: 8,
        paddingHorizontal: wp(2)
    },
    itemContainer: {
        width: wp(80),
        paddingVertical: 8,
        borderRadius: 12,
        marginBottom: 8,
        paddingHorizontal: wp(3),
    },
    myMessageCon: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.color4
    },
    otherMessageCon: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.color13,
    },
    messageTxt: {
        color: Colors.color2,
        fontFamily: Fonts.APPFONT_R,
        includeFontPadding: false,
        fontSize: Typography.tiny1,
    },
    inputOuterCon: {
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 25 : 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(3),
        backgroundColor: Colors.color17,
        borderTopWidth: 1,
        borderTopColor: Colors.color18,
    },
    input: {
        width: wp(72),
        minHeight: 40,
        maxHeight: 500,
        paddingHorizontal: wp(4),
        color: Colors.color2,
        fontSize: Typography.small,
        paddingTop: Platform.OS === 'android' ? 2 : 10,
        paddingBottom: 5,
        overflow: 'hidden',
    },
    inputContainer: {
        backgroundColor: Colors.color19,
        borderRadius: 50,
        minHeight: 40,
        maxHeight: 500,
        overflow: 'hidden',
    },
    sendBtn: {
        width: width * 0.10,
        height: width * 1 * 0.10,
        borderRadius: width * 1 * 0.10 / 2,
        backgroundColor: Colors.color4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    messageTime: {
        fontFamily: Fonts.APPFONT_R,
        includeFontPadding: false,
        fontSize: Typography.tiny,
        textAlign: 'right',
        color: Colors.color11
    },
    userName: {
        color: Colors.color2,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.small,
        includeFontPadding: false
    },
    messageOptionCon: {
        marginHorizontal: -wp(3),
        marginBottom: -8,
        marginTop: 8,
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12,
        paddingHorizontal: wp(3),
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.color1RGBA50
    },
    messageOptionTxt: {
        color: Colors.color2,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.tiny,
        includeFontPadding: false
    },
    gallery: {
        width: 30,
        height: 30,
    },
    messageImage: {
        width: wp(74),
        borderRadius: 8,
        height: 200,
        marginBottom: 5
    },
    inputImageOuter: {
        width: 80,
        height: 80,
        marginTop: 20,
        marginBottom: 5,
        marginHorizontal: wp(5),
    },
    inputImage: {
        width: 80,
        height: 80,
        borderRadius: 8
    },
    closeImage: {
        position: 'absolute',
        right: -wp(2),
        top: -9
    }
})