import React, { createContext, useContext, useReducer } from 'react'
import Reducer from './Reducer'

const AppContext: any = createContext('');

const initialState = {
    initialLoader: true,
    initialRoute: 'JoinMeeting',
    currentUser: null,
    userImage: '',
    language: 'chinese',
    socket: null,
    rtcAllConnections: [],
    localMedia: null,
    messages: []
}

const AppProvider = ({ children }: any) => {
    const [state, dispatch]: any = useReducer(Reducer, initialState)

    const setMessages = (messages: any) => {
        return dispatch({
            type: 'SET_MESSAGES',
            payload: {
                messages: messages
            }
        })
    }


    const setInitialRoute = (initialRoute: any) => {
        return dispatch({
            type: 'SET_INITIAL_ROUTE',
            payload: {
                initialRoute: initialRoute
            }
        })
    }

    const setInitialLoader = (initialLoader: any) => {
        return dispatch({
            type: 'SET_INITIAL_LOADER',
            payload: {
                initialLoader: initialLoader
            }
        })
    }

    const setUserImage = (userImage: any) => {
        return dispatch({
            type: 'SET_USER_IMAGE',
            payload: {
                userImage: userImage
            }
        })
    }

    const setCurrentUser = (currentUser: any) => {
        return dispatch({
            type: 'SET_CURRENT_USER',
            payload: {
                currentUser: currentUser
            }
        })
    }

    const setLanguage = (language: any) => {
        return dispatch({
            type: 'SET_LANGUAGE',
            payload: {
                language: language
            }
        })
    }

    const setSocket = (socket: any) => {
        return dispatch({
            type: 'SET_SOCKET',
            payload: {
                socket: socket
            }
        })
    }

    const setRtcAllConnections = (rtcAllConnections: any) => {
        return dispatch({
            type: 'SET_RTC_ALL_CONNECTIONS',
            payload: {
                rtcAllConnections: rtcAllConnections
            }
        })
    }

    const setLocalMedia = (localMedia: any) => {
        return dispatch({
            type: 'SET_LOCAL_MEDIA',
            payload: {
                localMedia: localMedia
            }
        })
    }


    return <AppContext.Provider value={{
        ...state, setCurrentUser, setLanguage, setInitialLoader, setSocket,
        setInitialRoute, setRtcAllConnections, setLocalMedia, setMessages,
        setUserImage
    }}>
        {children}
    </AppContext.Provider>
}

const useGlobalContext = (): any => {
    return useContext(AppContext)
}

export { AppProvider, useGlobalContext, AppContext }