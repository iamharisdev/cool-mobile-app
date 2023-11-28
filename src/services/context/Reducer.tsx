const Reducer = (state: any, action: any) => {
    switch(action.type) {
        case 'SET_INITIAL_ROUTE':
            return {
                ...state,
                initialRoute: action.payload.initialRoute,
            }
        case 'SET_MESSAGES':
            return {
                ...state,
                messages: action.payload.messages,
            }
        case 'SET_INITIAL_LOADER':
            return {
                ...state,
                initialLoader: action.payload.initialLoader,
            }
        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload.currentUser,
            }
        case 'SET_USER_IMAGE':
            return {
                ...state,
                userImage: action.payload.userImage,
            }
        case 'SET_LANGUAGE':
            return {
                ...state,
                language: action.payload.language,
            }
        case 'SET_SOCKET':
            return {
                ...state,
                socket: action.payload.socket,
            }
        case 'SET_RTC_ALL_CONNECTIONS':
            return {
                ...state,
                rtcAllConnections: action.payload.rtcAllConnections,
            }
        case 'SET_LOCAL_MEDIA':
            return {
                ...state,
                localMedia: action.payload.localMedia,
            }
        default:
            return state
    }
}

export default Reducer