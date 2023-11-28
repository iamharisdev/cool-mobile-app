import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Button, Container, Textinput } from '../../components'
import { hp, wp } from '../../global'
import { ApiServices, emptyFieldError } from '../../services/api'
import { SimpleLoader } from '../../components/loaders'
import { StorageManager, useGlobalContext } from '../../services'

const Login = ({ navigation }: any) => {
    const { setData, storageKeys } = StorageManager
    const { setCurrentUser } = useGlobalContext()
    const [loader, setLoader] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [userNameError, setUserNameError] = useState<any>(null)
    const [passwordError, setPasswordError] = useState<any>(null)

    const onChangeUserName = (value: string) => setUsername(value)
    const onChangePassword = (value: string) => setPassword(value)
    const onUserNameFocus = () => userNameError && setUserNameError('')
    const onPasswordFocus = () => passwordError && setPasswordError('')

    const onLoginPress = async () => {
        const usernameModified = username.trim().toLocaleLowerCase()
        const passwordModified = password.trim()
        if(usernameModified.length === 0) {
            setUserNameError(emptyFieldError)
        }
        if(passwordModified.length === 0) {
            setPasswordError(emptyFieldError)
        }
        else if(usernameModified.length !== 0 && passwordModified.length !== 0) {
            setLoader(true)
            try {
                await ApiServices.login(usernameModified, passwordModified)
                const response = await ApiServices.getMyProfile()
                await setData(storageKeys.USER, response)
                setCurrentUser(response)
                setLoader(false)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'NewMeeting' }]
                })
            } catch { setLoader(false) }
        }
    }

    return (
        <Container
            header={{ title: 'login' }}
            contentContainerStyle={Styles.container}
        >
            <Textinput
                label='account'
                placeholderText='enterUsername'
                value={username}
                onChangeText={onChangeUserName}
                onFocus={onUserNameFocus}
                error={userNameError}
            />
            <Textinput
                label='password'
                placeholderText='enterPassword'
                secureTextEntry
                value={password}
                onChangeText={onChangePassword}
                onFocus={onPasswordFocus}
                error={passwordError}
            />
            <Button
                text='login'
                onPress={onLoginPress}
                buttonOuterStyle={Styles.button}
            />
            <SimpleLoader
                visible={loader}
            />
        </Container>
    )
}

export default Login

const Styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: hp(8)
    },
    button: {
        width: wp(88),
        marginTop: 20,
    }
})