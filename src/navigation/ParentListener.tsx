import { useEffect } from 'react'
import { Api, EndPoints } from '../services/api';
import { StorageManager, useGlobalContext } from '../services';
import { useNavigation } from '@react-navigation/native';
import { flashInfoMessage } from '../components/FlashMessage';

const ParentListener = () => {
    const navigation: any = useNavigation()
    const { language, setCurrentUser, setUserImage } = useGlobalContext()
    const { deleteAll, setData, storageKeys } = StorageManager

    const handleLogout = async () => {
        flashInfoMessage('profileActiveOnOtherDeviceMsg')
        try {
            await deleteAll()
            await setData(storageKeys.LANGUAGE, language)
            setCurrentUser(null)
            setUserImage('')
            navigation.reset({
                index: 0,
                routes: [{ name: 'JoinMeeting' }]
            })
        } catch(error) {
            console.log('error while logging out =>', error)
        }
    }

    const handleApiErrors = () => {
        Api.interceptors.response.use(
            (response) => response,
            async (error) => {
                if(error?.response?.status === 401 && error?.response?.config?.url !== EndPoints.login) {
                    handleLogout()
                }
                return Promise.reject(error);
            }
        );
    }

    useEffect(() => {
        handleApiErrors()
    }, [])

    return null
}

export default ParentListener