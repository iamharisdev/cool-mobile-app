import { useEffect } from 'react';
import { StorageManager } from '../../services';
import { useGlobalContext } from '../../services';
import ConnectSocket from '../../services/socket/ConncetSocket';
// import DeviceInfo from 'react-native-device-info';

interface SocketListenerProps {
    fromHost: boolean,
    deviceID: string,
    meetingID: string,
    onSocketConnect: (item: any) => void,
    onCreateOfferRequest: (item: any, socket: any) => void,
    onOfferCreated: (item: any, socket: any) => void,
    onAnswerCreated: (item: any, socket: any) => void,
    onMuteAll: (item: any) => void,
    onParticipantIsMute: (item: any) => void,
    onMeetingEnd: (item: any) => void,
    onParticipantActivity: (item: any) => void,
    onMessage: (item: any) => void,
    onScreenShareRequest: () => void,
    onUpdateUsage: (item: any) => void
}

const SocketListener = (props: SocketListenerProps) => {
    const {
        deviceID,
        meetingID,
        onCreateOfferRequest = () => { },
        onOfferCreated = () => { },
        onAnswerCreated = () => { },
        onMuteAll = () => { },
        onParticipantIsMute = () => { },
        onMeetingEnd = () => { },
        onParticipantActivity = () => { },
        onScreenShareRequest = () => { },
        onMessage = () => { },
        onUpdateUsage = () => { },
        fromHost = false
    } = props
    const { getData, storageKeys } = StorageManager
    const { setSocket, socket } = useGlobalContext()

    const handleSocket = async (socket: any) => {
        if(!socket && !socket?.connected) {
            try {
                const token = await getData(storageKeys.ACCESS_TOKEN) || 'null'
                const Socket = await ConnectSocket(fromHost ? token : 'null', deviceID, meetingID)
                Socket.on('connect', () => {
                    setSocket(Socket)
                    props?.onSocketConnect && props?.onSocketConnect(Socket)
                    // console.log(`${DeviceInfo.getModel()} Socket connected`)
                });
                Socket.on('disconnect', () => {
                    // console.log(`${DeviceInfo.getModel()} Socket disconnected`)
                });
                Socket.on('room.activity', (res) => {
                    if(res.activityType === 'createOfferRequest') {
                        // console.log(`${DeviceInfo.getModel()} createOfferRequest`)
                        onCreateOfferRequest(res, Socket)
                    }
                    else if(res.activityType === 'meetingEnded') {
                        // console.log(`${DeviceInfo.getModel()} meetingEnded => ${res}`)
                        onMeetingEnd(res)
                    }
                    else if(res.activityType === 'participantLeave') {
                        // console.log(`${DeviceInfo.getModel()} participantLeave => ${res}`)
                        onMeetingEnd(res)
                    }
                    else if(res.activityType === 'muteAll') {
                        // console.log(`${DeviceInfo.getModel()} muteAll => ${res}`)
                        onMuteAll(res)
                    }
                    else if(res.activityType === 'participantAcitity') {
                        // console.log(`${DeviceInfo.getModel()} participantAcitity => ${res}`)
                        onParticipantActivity(res)
                    }

                    else if(res.activityType === 'messages') {
                        // console.log(`${DeviceInfo.getModel()} messages => ${res}`)
                        onMessage(res)
                    }
                });
                Socket.on('room.private-message', (res) => {
                    if(res.activityType === 'offerCreated') {
                        // console.log(`${DeviceInfo.getModel()} offerCreated`)
                        onOfferCreated(res, Socket)
                    }
                    else if(res.activityType === 'answerCreated') {
                        // console.log(`${DeviceInfo.getModel()} answerCreated`)
                        onAnswerCreated(res, Socket)
                    }
                    else if(res.activityType === 'participantMic') {
                        // console.log(`${DeviceInfo.getModel()} participant is Mute  => ${res}`)
                        onParticipantIsMute(res?.isMute)
                    }
                    else if(res.activityType === 'screenShareRequest') {
                        // console.log(`${DeviceInfo.getModel()} screenShareRequest  => ${res}`)
                        onScreenShareRequest()
                    }
                });
                Socket.on('room.delete', () => {
                    // console.log(`${DeviceInfo.getModel()} roomDeleted`)
                })
                Socket.on('update-usage', (usage: any) => {
                    onUpdateUsage(usage)
                })
                Socket.on('error', (error: any) => {
                    console.error('WebSocket error:', error)
                    if(socket) {
                        setSocket(null)
                        socket?.disconnect()
                    }
                })

            } finally { }
        }
    }

    useEffect(() => {
        handleSocket(socket)
    }, [socket])

    return null
}

export default SocketListener