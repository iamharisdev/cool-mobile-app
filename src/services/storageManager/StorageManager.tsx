import AsyncStorage from '@react-native-async-storage/async-storage';

class GStorageManager {
    storageKeys = {
        USER: 'USER',
        USER_IMAGE: 'USER_IMAGE',
        ACCESS_TOKEN: 'ACCESS_TOKEN',
        REFRESH_TOKEN: 'REFRESH_TOKEN',
        LANGUAGE: 'LANGUAGE',
    }

    deleteAll = () => {
        return new Promise(async (resolve, reject) => {
            await AsyncStorage.clear().then(() => resolve(''))
                .catch((error) => {
                    console.log('error while deleting all data from AsyncStorage =>', error)
                    reject(error)
                })
        })
    }

    deleteData = (key: any) => {
        return new Promise(async (resolve, reject) => {
            await AsyncStorage.removeItem(key).then(() => resolve(''))
                .catch((error) => {
                    console.log('error while deleting data from AsyncStorage =>', error)
                    reject(error)
                })
        })
    };

    getData = (key: any) => {
        return new Promise(async (resolve, reject) => {
            await AsyncStorage.getItem(key).then((data) => {
                data != null ? resolve(JSON.parse(data))
                    : resolve(null);
            })
                .catch((error) => {
                    console.log('error while reading data from AsyncStorage =>', error)
                    reject(error)
                })
        })
    };

    setData = async (key: any, value: any) => {
        return new Promise(async (resolve, reject) => {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue).then(() => resolve(''))
                .catch((error) => {
                    console.log('Error while saving data in AsyncStorage =>', error)
                    reject(error)
                })
        })
    };

}

const StorageManager = new GStorageManager()
export default StorageManager