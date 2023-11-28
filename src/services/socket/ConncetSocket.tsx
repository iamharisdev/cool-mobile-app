import { io } from "socket.io-client"
const ConnectSocket = async (token: any, deviceID: string, meetingID: string) => {
    try {
        const options: any = {
            query: {
                deviceID,
                meetingID
            },
            transports: ['websocket']
        }
        if(token !== 'null') {
            options.auth = { token: 'Bearer ' + token }
        }
        // const Socket = await io('https://rtcstreams.com/',
        //     options
        // )
        const Socket = await io('https://api.selfcool.top/',
            options
        )
        return Socket
    } catch(error) {
        console.log('error while connecting socket =>', error)
        throw error
    }
}

export default ConnectSocket