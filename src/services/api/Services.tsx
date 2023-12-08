import EndPoints from './EndPoints';
import { StorageManager } from '../storageManager'
import { Api } from './Middleware';
import { flashErrorMessage, flashInfoMessage } from '../../components/FlashMessage';
import RNFetchBlob from 'rn-fetch-blob'
import BaseUrl from './BaseUrl';


const { storageKeys, setData, getData } = StorageManager;

class GApiServices {
    commonError = (error: any) => {
        if(error?.response?.data?.msg) {
            flashErrorMessage(error?.response?.data?.msg)
        }
        else {
            flashErrorMessage()
        }
    }

    login = async (data: { name: string, password: string, deviceID: string, deviceName: string }) => {
        try {
            const { name, password, deviceID, deviceName } = data
            const response = await Api.post(EndPoints.login, {
                userName: name,
                password: password,
                deviceID: deviceID,
                deviceName: deviceName
            })
            await setData(storageKeys.ACCESS_TOKEN, response?.data?.data?.token)
            return
        } catch(error: any) {
            if(error?.response?.data?.msg) {
                flashErrorMessage(error?.response?.data?.msg)
            }
            else {
                this.commonError(error)
            }
            console.log('error while login  ->', error?.response?.data)
            throw error
        }
    }
    createMeeting = async (meetingID: string) => {
        try {
            await Api.post(EndPoints.meetings, { meetingID })
            return
        } catch(error: any) {
            console.log('error while creating meeting', error?.response?.data)
            this.commonError(error)
            throw error
        }
    }
    joinMeeting = async (meetingID: string, deviceID: string, deviceName: string) => {
        try {
            const response = await Api.post(`${EndPoints.meetings}/${meetingID}/join`, {
                deviceID,
                deviceName
            }, {
                //@ts-ignore 
                noToken: true
            })
            return response?.data
        } catch(error: any) {
            console.log('error while joining meeting', error?.response?.data)
            this.commonError(error)
            throw error
        }
    }
    getMyProfile = async () => {
        try {
            const response = await Api.get(EndPoints.myProfile)
            return response?.data?.data
        } catch(error: any) {
            console.log('error while getting my profile', error?.response?.data)
            throw error
        }
    }

    updateMyProfile = async (userID: string, data: {}) => {
        try {
            await Api.put(`${EndPoints.updateMyProfile}/${userID}`, data)
            return
        } catch(error: any) {
            console.log('error while updating my profile', error?.response?.data)
            throw error
        }
    }

    updateMeetingLock = async (meetingID: string, isLocked: boolean) => {
        try {
            await Api.put(`${EndPoints.meetings}/${meetingID}`, { isLocked })
            return
        } catch(error: any) {
            console.log('error while updating meeting lock', error?.response?.data)
            throw error
        }
    }

    updateProfileImage = async (imageData: any) => {
        try {
            const token = await getData(storageKeys.ACCESS_TOKEN)
            const formData = new FormData();

            formData.append('image', {
                uri: imageData?.uri,
                type: 'image/png',
                name: 'image.png',
            });

            const response = await fetch(`${BaseUrl}${EndPoints.profileImage}`, {
                method: 'POST',
                headers: {
                    Accept: '*/*',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if(response.status >= 200 && response.status <= 300) {
                return 'DONE'
            }
            else {
                if(response.status === 413) {
                    flashErrorMessage('Image size should not be greater than 1MB')
                }
                else {
                    flashErrorMessage()
                }
                throw 'error'
            }

        } catch(error: any) {
            console.log('error while updating profile picture', error)
            throw error
        }
    }

    getProfileImage = async () => {
        try {
            const response = await Api.get(EndPoints.profileImage)
            return response?.data
        } catch(error: any) {
            console.log('error while getting profile image', error?.response?.data)
            throw error
        }
    }

}

const ApiServices = new GApiServices();
export default ApiServices;
