import { View, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { StorageManager, useGlobalContext } from '../../services'
import { Colors } from '../../res'

const Initialize = () => {
    const { getData, storageKeys } = StorageManager
    const { setLanguage, setInitialLoader, setInitialRoute, setCurrentUser } = useGlobalContext()

    const handleData = async () => {
        try {
            const language = await getData(storageKeys.LANGUAGE)
            const userData = await getData(storageKeys.USER)
            if(language) { setLanguage(language) } else { setLanguage('chinese') }
            const accessToken = await getData(storageKeys.ACCESS_TOKEN)
            if(accessToken) {
                setInitialRoute('NewMeeting')
            }
            setCurrentUser(userData)
            setInitialLoader(false)
        } catch(error) {
            setInitialLoader(false)
        }
    }

    useEffect(() => {
        handleData()
    }, [])

    return (
        <View style={Styles.container}>
            <ActivityIndicator color={Colors.color1} />
        </View>
    )
}

export default Initialize


const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.color8
    }
})