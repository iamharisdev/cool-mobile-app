import { getUniqueId } from 'react-native-device-info';
import { mediaDevices } from 'react-native-webrtc';
import notifee, { AndroidImportance } from '@notifee/react-native';
import ImageResizer from '@bam.tech/react-native-image-resizer'

const getLocalMedia = async (audio = true, video = true) => {
    try {
        const constraints: any = {
            video: video ? {
                width: { min: 1280, ideal: 1920 },
                height: { min: 720, ideal: 1080 },
                frameRate: { min: 30 },
                // facingMode: 'environment',
                facingMode: 'user',
                resizeMode: 'none',
            } : false,
        };

        if(audio) {
            constraints.audio = {
                sampleRate: { ideal: 44100 },
                sampleSize: { ideal: 16 },
                echoCancellation: true,
                autoGainControl: true,
                noiseSuppression: true,
                latency: { ideal: 0.02 },
                channelCount: { ideal: 2 },
            };
        } else {
            constraints.audio = false
        }

        const response = await mediaDevices.getUserMedia(constraints);
        // const response = await mediaDevices.getUserMedia({ audio: true, video: true });
        return response;
    } catch(error) {
        return null;
    }
}

const getDisplayMedia = async () => {
    try {
        const response = await mediaDevices.getDisplayMedia()
        return response
    } catch(error) {
        return null;
    }
}

const getDeviceID = async () => {
    try {
        const id = await getUniqueId()
        return id
    } catch(error) {
        console.log('error while geting device ID =>', error)
        throw error
    }
}

const screenShareNotification = async () => {
    try {
        const channelId = await notifee.createChannel({
            id: 'screen_capture',
            name: 'Screen Capture',
            lights: false,
            vibration: false,
            importance: AndroidImportance.DEFAULT
        });
        await notifee.displayNotification({
            title: 'Screen Capture',
            body: 'Cool is capturing your screen',
            android: {
                channelId,
                asForegroundService: true,
                pressAction: {
                    id: 'notification_pressed',
                    launchActivity: 'default',
                },
            }
        })
    } catch(error) {
        throw error
    }

}

const rtcServer = {
    "iceServers": [
        {
            urls: ["stun:turn.selfcool.top:3478"]
        },
        {
            username: "coturn_user",
            credential: "Hajdasss8sLL",
            urls: [
                "turn:turn.selfcool.top:3478?transport=udp",
                "turn:turn.selfcool.top:3478?transport=tcp",
                "turns:turn.selfcool.top:5349?transport=tcp"
            ]
        }
    ],
    iceCandidatePoolSize: 10,
};

const LOG = (data: any) => {
    console.log(JSON.stringify(data, null, 2));
}


const imageResizer = (params: any) => {
    return new Promise(async (resolve, reject) => {
        const { uri, width, height, fileSize, fileName } = params
        let newWidth, newHeight;
        if(width > height) {
            newWidth = 1080;
            newHeight = Math.round((height / width) * newWidth);
        } else {
            newHeight = 1080;
            newWidth = Math.round((width / height) * newHeight);
        }
        ImageResizer.createResizedImage(uri, newWidth, newHeight, 'JPEG', 80, 0)
            .then((resizedImage) => {
                if(resizedImage.size < fileSize) {
                    resolve(resizedImage)
                }
                else {
                    const resizedImage = {
                        height: height,
                        width: width,
                        uri: uri,
                        name: fileName,
                        size: fileSize
                    }
                    resolve(resizedImage)
                }
            })
            .catch((error) => {
                console.error('error while reducing image size =>', error);
                reject('')
            });
    })
}

const getTimeStamp = () => {
    let date = new Date();
    return date.getTime();
}


export { LOG, getLocalMedia, getDeviceID, getDisplayMedia, rtcServer, screenShareNotification, imageResizer, getTimeStamp }