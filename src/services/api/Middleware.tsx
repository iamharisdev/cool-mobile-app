import axios from 'axios'
import BaseUrl from './BaseUrl';
import { StorageManager } from '../storageManager'

const Api = axios.create({
    baseURL: BaseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

Api.interceptors.request.use(async (config: any) => {
    if(!config?.noToken) {
        config.headers.Authorization = `Bearer ${await StorageManager.getData(StorageManager.storageKeys.ACCESS_TOKEN)}`
    }
    return config;
})

Api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        return Promise.reject(error);
    })

export { Api }