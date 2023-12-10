import { StyleSheet, StatusBar, Alert, findNodeHandle, NativeModules, Platform, AppState } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Container, OpenSettingsPopup } from '../../components'
import { Colors } from '../../res'
import Header from './Header'
import DescriptionSection from './DescriptionSection'
import ControlsSection from './ControlsSection'
import { getDisplayMedia, getLocalMedia, rtcServer, screenShareNotification } from '../../services/common/CommonServices'
import { Socket } from '../../services/socket'
import { useGlobalContext } from '../../services'
import ScreenSharingDescription from './ScreenSharingDescription'
import { RTCIceCandidate, RTCPeerConnection, RTCSessionDescription, ScreenCapturePickerView } from 'react-native-webrtc';
import { Loader } from '../../components/loaders'
import { flashInfoMessage, flashSuccessMessage } from '../../components/FlashMessage'
import { View } from 'react-native-animatable'
import { hp } from '../../global'
import { TileView } from './tileView'
import notifee from '@notifee/react-native';
import InCallManager from 'react-native-incall-manager';
import { useTranslation } from 'react-i18next'
import { useNetInfo } from "@react-native-community/netinfo";


const MeetingRoom = ({ navigation, route }: any) => {
    const { isConnected } = useNetInfo();
    const { t } = useTranslation()
    const params = route?.params
    const {
        socket, rtcAllConnections, setRtcAllConnections, localMedia, messages,
        setMessages, setSocket, setLocalMedia, currentUser
    } = useGlobalContext()

    const group = currentUser?.Group
    const isUnlimited = group?.timeLimitUnit === 'unLimited' ? true : false

    let isCaptured: any = null

    if(Platform.OS === 'ios') {
        const useIsCaptured = require("react-native-is-captured").useIsCaptured;
        isCaptured = useIsCaptured();
    }

    const appStateRef: any = useRef(null)
    const socketRef = useRef(socket)
    const messagesRef = useRef([])
    const nativeComponentRef = useRef(null);
    const rtcAllConnectionRef: any = useRef([])
    const rtcCreateOfferRequestsRef: any = useRef([])
    const joinedMessageShownRef: any = useRef(false)
    const displayMediaRef: any = useRef(null)
    const participantDataRef = useRef(params?.participantData)
    const screenShareRef = useRef(false)
    const localMediaRef = useRef(localMedia)
    const microphoneRef: any = useRef(params?.microphone)
    const videoRef: any = useRef(params?.video)

    const fromHost = params?.from === 'host' ? true : false
    const [hostName, setHostName] = useState('')
    const meetingStartTime = params?.meetingStartTime || new Date()
    const meetingID = params?.meetingID
    const deviceID = params?.deviceID
    const [createOfferRequestExicuted, setCreateOfferRequestExecuted] = useState(false)
    const [microphone, setMicrophone] = useState(params?.microphone)
    const [screenShare, setScreenShare] = useState(false)
    const [video, setVideo] = useState(params?.video)
    const [isMeetingEnd, setIsMeetingEnd] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [meetingEnderDeviceID, setMeetingEnderDeviceID] = useState('')
    const [overlayLoader, setOverlayLoader] = useState({
        visible: true,
        message: 'loading'
    })
    const [openSettingsPopup, setOpenSettingsPopup] = useState(false)

    const hideOverlayLoader = () => {
        setOverlayLoader({
            visible: false,
            message: 'loading'
        })
    }


    const hideSettingsPopup = () => setOpenSettingsPopup(false)

    const onScreenShareDisablePress = async () => {
        if(Platform.OS === 'ios' && isCaptured) {
            const handle = await findNodeHandle(nativeComponentRef.current);
            await NativeModules.ScreenCapturePickerViewManager.show(handle)
            return
        }

        screenShareRef.current = false
        setScreenShare(false)
        participantDataRef.current = {
            ...participantDataRef.current,
            screenShare: false
        }

        await notifee.stopForegroundService()

        localMediaRef.current?.getTracks().forEach((track: any) => {
            if(track?.kind === 'video') {
                localMediaRef.current?.removeTrack(track);
            }
        })

        for(const element of rtcAllConnectionRef.current) {
            const sender = await element?.getSenders()
                .find((s: any) => s?.track?.kind === 'video')
            if(sender) {
                sender.enabled = false
            }
        }
        setRtcAllConnections(rtcAllConnectionRef.current)

        await socket?.emit('room.activity', {
            activityType: 'participantAcitity',
            deviceID,
            isMute: !microphoneRef.current,
            video: videoRef.current,
            screenShare: false
        })
    }

    useEffect(() => {
        let timer: any = null;

        if(!isConnected) {
            timer = setTimeout(() => {
                onMeetingEnd()
                clearTimeout(timer);
            }, 30000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [isConnected]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if(Platform.OS === 'ios') {
                appStateRef.current = nextAppState
            }
        });
        return () => {
            subscription.remove();
        };
    }, []);


    useEffect(() => {
        screenShareRef.current = screenShare
    }, [screenShare])

    useEffect(() => {
        setLocalMedia(localMediaRef.current)
    }, [localMediaRef.current])

    useEffect(() => {
        microphoneRef.current = microphone
    }, [microphone])

    useEffect(() => {
        videoRef.current = video
    }, [video])

    useEffect(() => {
        messagesRef.current = messages
    }, [messages])


    useEffect(() => {
        if(Platform.OS === 'ios') {
            if(isCaptured) {
                onScreenShareEnablePress()
            }
            else if(!isCaptured && screenShareRef.current === true) {
                onScreenShareDisablePress()
            }
        }
    }, [isCaptured])


    // @saad
    useEffect(() => {
        if(rtcAllConnectionRef.current && rtcAllConnectionRef?.current.length === 0) {
            InCallManager.setKeepScreenOn(true)

            let rtcConnection: any = new RTCPeerConnection(rtcServer)
            const audioTrack = localMediaRef.current?.getAudioTracks()[0]
            if(audioTrack) {
                rtcConnection.addTrack(audioTrack, localMediaRef.current);
            }
            rtcConnection.participantData = participantDataRef.current
            rtcConnection.you = true
            rtcAllConnectionRef.current = [rtcConnection]
            setRtcAllConnections([rtcConnection])
            fromHost && hideOverlayLoader()
        }
    }, [socket])

    // @saad
    useEffect(() => {
        return () => {
            if(socket) {
                socket?.disconnect()
                setSocket(null)
            }
        };
    }, [socket])

    //@saad
    useEffect(() => {
        return () => {
            onMeetingEnd()
        }
    }, [])

    useEffect(() => {
        setRtcAllConnections(rtcAllConnectionRef.current)
    }, [rtcAllConnectionRef.current])



    const onScreenShareEnablePress = async () => {
        try {
            if(Platform.OS === 'ios') {
                if(!isCaptured) {
                    const handle = await findNodeHandle(nativeComponentRef.current);
                    await NativeModules.ScreenCapturePickerViewManager.show(handle);
                    return
                }
            }

            if(Platform.OS === 'android') {
                await screenShareNotification()
            }

            const displayMedia = await getDisplayMedia()
            if(!displayMedia) {
                await notifee.stopForegroundService()
                return
            }

            displayMediaRef.current = displayMedia

            const screenShareTrack = displayMedia?.getVideoTracks()[0]
            localMediaRef.current?.getTracks().forEach((track: any) => {
                if(track.kind === 'audio') { }
                if(track.kind === 'video') {
                    localMediaRef.current?.removeTrack(track);
                    localMediaRef.current?.addTrack(screenShareTrack, displayMedia);
                }
                else {
                    localMediaRef.current?.addTrack(screenShareTrack, displayMedia);
                }
            })
            setVideo(false)
            localMediaRef.current = localMediaRef.current
            screenShareRef.current = true
            participantDataRef.current = {
                ...participantDataRef.current,
                screenShare: true
            }
            setScreenShare(true)

            if(screenShareTrack) {
                for(const element of rtcAllConnectionRef.current) {
                    const sender = await element?.getSenders()
                        .find((s: any) => s?.track?.kind === 'video') || null
                    if(sender) {
                        sender.replaceTrack(screenShareTrack, displayMedia);
                    }
                }
            }
            await socketRef.current?.emit('room.activity', {
                activityType: 'participantAcitity',
                deviceID,
                isMute: !microphoneRef.current,
                video: videoRef.current,
                screenShare: true
            })
        } catch(err) {
            console.log(err)
        };
    }



    let chunkMap = new Map<string, string>(); // Map<deviceID, accumulatedChunks>

    const onMessage = (res: any) => {
        const { chunk, id, chunkFinished } = res;

        if(chunk) {
            // Accumulate chunks in the map
            const accumulatedChunks = chunkMap.get(id) || '';
            chunkMap.set(id, accumulatedChunks + chunk);
        } else if(chunkFinished) {
            // Retrieve accumulated chunks, delete from the map, and set in the response
            const completeChunk = chunkMap.get(id) || '';
            chunkMap.delete(id);
            res.image = completeChunk;

            // Update the messages array
            const newMessageArray = [res, ...messagesRef.current];
            setMessages(newMessageArray);
        } else {
            // Handle other types of messages
            const newMessageArray = [res, ...messagesRef.current];
            setMessages(newMessageArray);
        }
    };

    const onVideoEnablePressCommon = async (videoTrack: any) => {
        participantDataRef.current = {
            ...participantDataRef.current,
            video: true
        }
        if(rtcAllConnectionRef.current && rtcAllConnectionRef.current.length !== 0) {
            for(const element of rtcAllConnectionRef.current) {
                const sender = element?.getSenders()
                    .find((s: any) => s?.track?.kind === 'video') || null
                if(sender) {
                    sender.replaceTrack(videoTrack);
                }
            }
            setRtcAllConnections(rtcAllConnectionRef.current)
        }
        await socket?.emit('room.activity', {
            activityType: 'participantAcitity',
            deviceID,
            isMute: !microphoneRef.current,
            video: true,
            screenShare: screenShareRef.current
        })
    }

    const onVideoEnablePress = async () => {
        if(screenShareRef.current) {
            Alert.alert('You cannot use camera while screen sharing is on')
        }
        else {
            const videoTrack = await localMediaRef.current?.getVideoTracks()[0]
            if(videoTrack) {
                localMediaRef.current?.getVideoTracks().forEach((track: any) => {
                    track.enabled = true;
                })
                localMediaRef.current = localMediaRef.current
                setVideo(true)
                onVideoEnablePressCommon(videoTrack)
            }
            else {
                let localMediaNew = await getLocalMedia()
                const videoTrack = await localMediaNew?.getVideoTracks()[0]
                if(videoTrack) {
                    localMediaRef.current = localMediaNew
                    setVideo(true)
                    onVideoEnablePressCommon(videoTrack)
                }
                else {
                    setOpenSettingsPopup(true)
                }
            }
        }
    }

    const onVideoDisablePress = async () => {
        localMediaRef.current?.getVideoTracks().forEach((track: any) => {
            track.enabled = false;
        })
        localMediaRef.current = localMediaRef.current
        setVideo(false)
        participantDataRef.current = {
            ...participantDataRef.current,
            video: false
        }
        await socket?.emit('room.activity', {
            activityType: 'participantAcitity',
            deviceID,
            isMute: !microphoneRef.current,
            video: false,
            screenShare: screenShareRef.current
        })

    }

    const onMicEnablePressCommon = async (localMediaParam: any) => {
        localMediaParam?.getAudioTracks().forEach((track: any) => {
            track.enabled = true;
        })
        localMediaRef.current = localMediaParam
        participantDataRef.current = {
            ...participantDataRef.current,
            isMute: false
        }
        await socketRef.current?.emit('room.activity', {
            activityType: 'participantAcitity',
            deviceID,
            isMute: false,
            video: videoRef.current,
            screenShare: screenShareRef.current
        })
    }

    const onMicEnablePress = async () => {
        const audioTrack = await localMediaRef.current?.getAudioTracks()[0]
        if(audioTrack) {
            setMicrophone(true)
            onMicEnablePressCommon(localMediaRef.current)
        }
        else {
            let localMediaNew = await getLocalMedia()
            const audioTrack = await localMediaNew?.getAudioTracks()[0]
            if(audioTrack) {
                setMicrophone(true)
                onMicEnablePressCommon(localMediaNew)
            }
            else {
                setOpenSettingsPopup(true)
            }
        }
    }

    const onMicDisablePress = async () => {
        localMediaRef.current?.getAudioTracks().forEach((track: any) => {
            track.enabled = false;
        })
        localMediaRef.current = localMediaRef.current
        await socketRef.current?.emit('room.activity', {
            activityType: 'participantAcitity',
            deviceID,
            isMute: true,
            video: videoRef.current,
            screenShare: screenShareRef.current
        })
        setMicrophone(false)
        participantDataRef.current = {
            ...participantDataRef.current,
            isMute: true
        }
    }

    const onMeetingEnd = async () => {
        InCallManager.setKeepScreenOn(false)
        InCallManager.stop()
        if(screenShareRef.current
            && Platform.OS === 'ios'
            && appStateRef.current !== 'background'
            && appStateRef.current !== 'inactive') {
            onScreenShareDisablePress()
            return
        }
        setOverlayLoader({
            visible: true,
            message: 'endingCall'
        })

        setIsMeetingEnd(true)
        if(Platform.OS === 'android') {
            await notifee.stopForegroundService();
        }
        await Promise.all(
            rtcAllConnectionRef.current?.map(async (element: any) => {
                if(element) {
                    if(element.getSenders) {
                        await Promise.all(
                            element.getSenders().map(async (sender: any) => {
                                const track = sender?.track;
                                if(track) {
                                    await track.stop();
                                }
                            })
                        );
                    }
                    if(element.close) {
                        await element.close()
                    }
                }
            })
        );

        await Promise.all(
            localMediaRef.current?.getTracks()?.map(async (track: any) => {
                if(track) {
                    await track.stop()
                    localMediaRef.current.removeTrack(track)
                }
            })
        )

        if(displayMediaRef.current) {
            await Promise.all(
                displayMediaRef.current?.getTracks()?.map(async (track: any) => {
                    if(track) {
                        await track.stop()
                        displayMediaRef.current.removeTrack(track)
                    }
                })
            )
        }

        setRtcAllConnections([])
        setMessages([])
        rtcCreateOfferRequestsRef.current = []
        joinedMessageShownRef.current = false
        setCreateOfferRequestExecuted(false)

        await socketRef.current?.emit('room.activity', { activityType: 'meetingEnded', fromHost, deviceID })
        if(fromHost) {
            await socketRef.current?.emit('room.delete')
        }
        hideOverlayLoader()
        flashSuccessMessage('meetingEnded')
        navigation.goBack()
    }


    const onMeetingEndEvent = (meetingEnded: any) => {
        if(meetingEnded && meetingEnded?.fromHost) {
            onMeetingEnd()
        }
        else
            if(meetingEnded?.deviceID) {
                setMeetingEnderDeviceID(meetingEnded?.deviceID)
                setIsMeetingEnd(true)
                const updatedConnections = rtcAllConnectionRef?.current?.filter((element: any) => {
                    return element?.senderDeviceID !== meetingEnded?.deviceID || meetingEnded?.deviceID === deviceID;
                })
                const updatedRequestConnections = rtcCreateOfferRequestsRef?.current?.filter((element: any) => {
                    return element?.senderDeviceID !== meetingEnded?.deviceID || meetingEnded?.deviceID === deviceID;
                })
                rtcAllConnectionRef.current = updatedConnections
                rtcCreateOfferRequestsRef.current = updatedRequestConnections
                setRtcAllConnections(updatedConnections);
            }
    }

    const onMuteAll = (muteAll: any) => {
        if(muteAll?.senderDeviceID && muteAll?.senderDeviceID !== deviceID) {
            muteAll?.muteAll ? (
                onMicDisablePress(),
                flashInfoMessage('muteAllDescription')
            )
                : (
                    onMicEnablePress(),
                    flashInfoMessage('unMuteAllDescription')
                )

        }
    }

    const onParticipantIsMute = async (participantIsMute: any) => {
        if(participantIsMute === true) {
            onMicDisablePress()
            setMicrophone(false)
            flashInfoMessage('muteAllDescription')
            await socket?.emit('room.activity', {
                activityType: 'participantAcitity',
                deviceID,
                isMute: true,
                video: videoRef.current,
                screenShare: screenShareRef.current
            })
        }
        else if(participantIsMute === false) {
            onMicEnablePress()
            setMicrophone(true)
            flashInfoMessage('unMuteAllDescription')
            await socket?.emit('room.activity', {
                activityType: 'participantAcitity',
                deviceID,
                isMute: false,
                video: videoRef.current,
                screenShare: screenShareRef.current
            })
        }
    }


    const onParticipantActivity = async (participantAcitity: any) => {
        if(rtcAllConnectionRef.current?.length !== 0) {
            const foundElement = rtcAllConnectionRef.current.find(
                (element: any) => element.senderDeviceID === participantAcitity.deviceID
            )

            if(foundElement) {
                foundElement.participantData.isMute = participantAcitity?.isMute
                foundElement.participantData.video = participantAcitity?.video
                foundElement.participantData.screenShare = participantAcitity?.screenShare
            }
            setRtcAllConnections([...rtcAllConnectionRef.current])
        }
    }

    const createInitialOfferRequest = async (socket: any) => {
        const data = {
            meetingID,
            deviceID,
            senderDeviceID: deviceID,
            activityType: 'createOfferRequest',
            participantData: participantDataRef.current
        }
        if(!createOfferRequestExicuted) {
            await socket?.emit('room.activity', data)
            setCreateOfferRequestExecuted(true)
        }

    }

    const onSocketConnect = (socket: any) => {
        socketRef.current = socket
        if(!fromHost && socket?.connected) {
            createInitialOfferRequest(socket)
        }
    }


    const onCreateOfferRequest = async (createOfferRequest: any, Socket: any) => {
        let rtcConnection = new RTCPeerConnection(rtcServer)
        const audioTrack = localMediaRef.current?.getAudioTracks()[0]
        let videoTrack = screenShareRef.current === true ?
            await displayMediaRef.current?.getVideoTracks()[0]
            : await localMediaRef.current?.getVideoTracks()[0]

        if(audioTrack) {
            rtcConnection.addTrack(audioTrack, localMediaRef.current)
        }
        if(videoTrack) {
            rtcConnection.addTrack(videoTrack, screenShareRef.current === true ? displayMediaRef.current : localMediaRef.current)
        }
        const offerDescription = await rtcConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        })
        await rtcConnection.setLocalDescription(offerDescription)
        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        }

        const data: any = {
            participantData: participantDataRef.current,
            meetingID,
            deviceID: createOfferRequest?.senderDeviceID,
            senderDeviceID: deviceID,
            activityType: 'offerCreated',
            offer
        }

        const iceCandidatesPromise = new Promise((resolve: any) => {
            const collectedCandidates: any = [];
            const iceCandidateHandler = (event: any) => {
                if(event.candidate) {
                    const candidateData = event.candidate.toJSON();
                    collectedCandidates.push(candidateData);
                } else {
                    data.offerIceCandidates = collectedCandidates;
                    resolve();
                }
            };
            rtcConnection.addEventListener('icecandidate', iceCandidateHandler);
        });

        await iceCandidatesPromise;

        await Socket?.emit('room.private-message', data)
        //@ts-ignore
        rtcConnection.senderDeviceID = createOfferRequest?.senderDeviceID
        const rtcAllNew: any = [
            ...rtcCreateOfferRequestsRef?.current,
            rtcConnection
        ]
        rtcCreateOfferRequestsRef.current = rtcAllNew
    }


    const onOfferCreated = async (createdOffer: any, Socket: any) => {
        if(!fromHost) {
            let rtcConnection = new RTCPeerConnection(rtcServer)
            let audioTrack = await localMediaRef.current?.getAudioTracks()[0]
            let videoTrack = screenShareRef.current === true ? await displayMediaRef.current?.getVideoTracks()[0]
                : await localMediaRef.current?.getVideoTracks()[0]

            if(audioTrack) {
                rtcConnection.addTrack(audioTrack, localMediaRef.current)
            }
            if(videoTrack) {
                rtcConnection.addTrack(videoTrack, screenShareRef.current === true ? displayMediaRef.current : localMediaRef.current)
            }

            await rtcConnection.setRemoteDescription(
                new RTCSessionDescription(createdOffer?.offer)
            )
            const answerDescription = await rtcConnection.createAnswer();
            await rtcConnection.setLocalDescription(answerDescription);
            const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
            }
            let data: any = {
                participantData: participantDataRef.current,
                meetingID,
                deviceID: createdOffer?.senderDeviceID,
                senderDeviceID: deviceID,
                activityType: 'answerCreated',
                answer
            }

            const iceCandidatesPromise = new Promise((resolve: any) => {
                const collectedCandidates: any = [];
                const iceCandidateHandler = (event: any) => {
                    if(event.candidate) {
                        const candidateData = event.candidate.toJSON();
                        collectedCandidates.push(candidateData);
                    } else {
                        data.answerIceCandidates = collectedCandidates;
                        resolve();
                    }
                };
                rtcConnection.addEventListener('icecandidate', iceCandidateHandler);
            });

            await iceCandidatesPromise;

            await Socket?.emit('room.private-message', data)
            //@ts-ignore
            rtcConnection.participantData = createdOffer?.participantData
            //@ts-ignore
            rtcConnection.senderDeviceID = createdOffer?.senderDeviceID

            if(createdOffer?.offerIceCandidates?.length !== 0) {
                for(const iceCandidateData of createdOffer?.offerIceCandidates) {
                    const iceCandidate = new RTCIceCandidate(iceCandidateData);
                    if(iceCandidate) {
                        try {
                            await rtcConnection.addIceCandidate(iceCandidate);
                        } catch(error) {
                            console.error("Error adding ICE candidate:", error);
                        }
                    }
                }
            }

            if(createdOffer?.participantData?.fromHost) {
                setHostName(createdOffer?.participantData?.name)
            }

            const rtcAllNew: any = [
                ...rtcAllConnectionRef?.current,
                rtcConnection
            ]

            rtcAllConnectionRef.current = rtcAllNew
            setRtcAllConnections(rtcAllNew)

            hideOverlayLoader()
            onScreenShareEnablePress()

            if(joinedMessageShownRef.current === false) {
                joinedMessageShownRef.current = true
                flashSuccessMessage('meetingJoined')
            }
        }
    }

    const onAnswerCreated = async (createdAnswer: any) => {
        if(rtcCreateOfferRequestsRef.current?.length !== 0) {
            const foundElement = await rtcCreateOfferRequestsRef.current.find(
                (element: any) => element?.senderDeviceID === createdAnswer?.senderDeviceID
            )
            if(foundElement) {
                const answerDescription = new RTCSessionDescription(createdAnswer?.answer);
                await foundElement.setRemoteDescription(answerDescription);

                if(createdAnswer?.answerIceCandidates?.length !== 0) {
                    for(const iceCandidateData of createdAnswer.answerIceCandidates) {
                        const iceCandidate = new RTCIceCandidate(iceCandidateData)
                        if(iceCandidate) {
                            try {
                                await foundElement.addIceCandidate(iceCandidate);
                            } catch(error) {
                                console.error("Error adding ICE candidate:", error);
                            }
                        }
                    }
                }

                foundElement.participantData = createdAnswer?.participantData;
                const rtcAllNew: any = [
                    ...rtcAllConnectionRef?.current,
                    foundElement
                ]
                rtcAllConnectionRef.current = rtcAllNew
                setRtcAllConnections(rtcAllNew)
            }
        }
    }

    const onUpdateUsage = async (usage: any) => {
        if(!isUnlimited && fromHost) {
            const seconds = t('seconds')
            const meetingLimitReachedDes = t('meetingLimitReachedDes')
            if((usage?.remainingUsage <= 60 && usage?.remainingUsage >= 45) ||
                (usage?.remainingUsage <= 30 && usage?.remainingUsage >= 15)
            ) {
                flashInfoMessage(`${meetingLimitReachedDes} ${usage?.remainingUsage} ${seconds}`)
            }
            else if(usage?.remainingUsage <= 0) {
                await flashInfoMessage('meetingTimeLimitReached')
                onMeetingEnd()
            }
        }
    }

    const handleFullScreen = () => setIsFullScreen(!isFullScreen)
    const emptyMeetingEnderDeviceID = () => setMeetingEnderDeviceID('')

    return (
        <Container
            style={Styles.container}
            safeAreaViewStyle={Styles.safeAreaView}
            scrollEnabled={false}
        >
            <StatusBar backgroundColor={Colors.color1} barStyle={'light-content'} />
            {
                <Header
                    meetingID={meetingID}
                    isMeetingEnd={isMeetingEnd}
                    meetingStartTime={meetingStartTime}
                    hostName={hostName}
                    fromHost={fromHost}
                    isFullScreen={isFullScreen}
                />
            }
            {
                Platform.OS === 'ios' &&
                <ScreenCapturePickerView
                    ref={nativeComponentRef}
                />
            }
            {
                overlayLoader.visible ?
                    <View style={Styles.loaderContainer}>
                        <Loader
                            visible={true}
                            message={overlayLoader.message}
                            messageStyle={{ color: Colors.color2 }}
                        />
                    </View>
                    :
                    rtcAllConnections?.length !== 0 ?
                        <TileView
                            rtcAllConnections={rtcAllConnections}
                            video={video}
                            microphone={microphone}
                            screenShare={screenShare}
                            localMedia={localMedia}
                            onStopScreenSharingPress={onScreenShareDisablePress}
                            handleFullScreen={handleFullScreen}
                            meetingEnderDeviceID={meetingEnderDeviceID}
                            emptyMeetingEnderDeviceID={emptyMeetingEnderDeviceID}
                        />
                        :
                        fromHost ?
                            <DescriptionSection
                                meetingID={meetingID}
                            />
                            :
                            <ScreenSharingDescription />
            }
            {
                !isFullScreen &&
                <ControlsSection
                    microphone={microphone}
                    video={video}
                    screenShare={screenShare}
                    onMicEnablePress={onMicEnablePress}
                    onMicDisablePress={onMicDisablePress}
                    onVideoEnablePress={onVideoEnablePress}
                    onVideoDisablePress={onVideoDisablePress}
                    onScreenShareEnablePress={onScreenShareEnablePress}
                    onScreenShareDisablePress={onScreenShareDisablePress}
                    fromHost={fromHost}
                    onEndCall={onMeetingEnd}
                    participantData={participantDataRef.current}
                    meetingID={meetingID}
                />
            }
            <OpenSettingsPopup
                visible={openSettingsPopup}
                onClose={hideSettingsPopup}
            />
            <Socket
                fromHost={fromHost}
                meetingID={meetingID}
                deviceID={deviceID}
                onSocketConnect={onSocketConnect}
                onCreateOfferRequest={onCreateOfferRequest}
                onOfferCreated={onOfferCreated}
                onAnswerCreated={onAnswerCreated}
                onMuteAll={onMuteAll}
                onParticipantIsMute={onParticipantIsMute}
                onMeetingEnd={onMeetingEndEvent}
                onParticipantActivity={onParticipantActivity}
                onScreenShareRequest={onScreenShareEnablePress}
                onMessage={onMessage}
                onUpdateUsage={onUpdateUsage}
            />
        </Container>
    )
}

export default MeetingRoom

const Styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.color1,
        paddingTop: 10,
        justifyContent: 'space-between'
    },
    safeAreaView: {
        backgroundColor: Colors.color1
    },
    loaderContainer: {
        backgroundColor: Colors.color13,
        height: hp(50),
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    }
})