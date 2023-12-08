import { View, StyleSheet, Dimensions, TouchableOpacity, TextInput, Platform, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Button, Container, LanguagePickerButton, Text } from '../../components'
import { Colors, Fonts } from '../../res'
import { Typography, wp } from '../../global'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { StorageManager, useGlobalContext } from '../../services'
import { OverlayLoader, SimpleLoader } from '../../components/loaders'
import Feather from 'react-native-vector-icons/Feather'
import { useTranslation } from 'react-i18next'
import { ApiServices } from '../../services/api'
import { flashSuccessMessage } from '../../components/FlashMessage'
import ImagePicker from 'react-native-image-crop-picker';


const { width } = Dimensions.get('window')

const Settings = ({ navigation }: any) => {
    const { t } = useTranslation()
    const { language, currentUser, setCurrentUser, setUserImage, userImage } = useGlobalContext()
    const [loader, setLoader] = useState(false)
    const [imageLoader, setImageLoader] = useState(true)
    const [imageFetchLoader, setImageFetchLoader] = useState(false)
    const [overlayLoader, setOverlayLoader] = useState({
        visible: false,
        message: ''
    })
    const [editDisplayName, setEditDisplayName] = useState(false)
    const [displayName, setDisplayName] = useState(currentUser?.displayName)
    const { deleteAll, setData, storageKeys } = StorageManager
    const headerRight = () => <LanguagePickerButton />

    const onLogoutPress = async () => {
        setLoader(true)
        try {
            await deleteAll()
            setCurrentUser(null)
            setUserImage('')
            await setData(storageKeys.LANGUAGE, language)
            setLoader(false)
            navigation.reset({
                index: 0,
                routes: [{ name: 'JoinMeeting' }]
            })
        } catch(error) {
            setLoader(false)
        }
    }

    const onEditPress = () => setEditDisplayName(true)
    const onChangeText = (text: string) => setDisplayName(text)

    const hideOverlayLoader = () => {
        setOverlayLoader({
            visible: false,
            message: ''
        })
    }

    const onUpdateDisplayName = async () => {
        setOverlayLoader({
            visible: true,
            message: 'updatingDisplayName'
        })
        try {
            await ApiServices.updateMyProfile(currentUser?.id, { displayName: displayName })
            currentUser.displayName = displayName
            setCurrentUser(currentUser)
            await setData(storageKeys.USER, currentUser)
            setEditDisplayName(false)
            flashSuccessMessage('displayNameUpdated')
            hideOverlayLoader()
        } catch(error) {
            hideOverlayLoader()
        }
    }

    const showImagePicker = async () => {
        ImagePicker.openPicker({
            cropping: true,
            showCropFrame: true,
            cropperCircleOverlay: true,
            mediaType: 'photo',
            cropperCancelText: 'Cancel',
            cropperChooseText: 'Choose'
        }).then(async (image: any) => {
            setOverlayLoader({
                visible: true,
                message: 'Uploading'
            })
            const imageData: any = {
                uri: Platform.OS === 'android' ? image?.path : image?.sourceURL,
                type: image?.mime,
                name: `key-${new Date().getTime()}`
            }
            try {
                await ApiServices.updateProfileImage(imageData)
                flashSuccessMessage('Image uploaded')
                setImageLoader(true)
                getProfileImage()
                hideOverlayLoader()
            } catch(error) {
                hideOverlayLoader()
            }
        })
    }

    const getProfileImage = async () => {
        try {
            const response = await ApiServices.getProfileImage()
            if(response?.url) {
                setUserImage(response?.url)
                await setData(storageKeys.USER_IMAGE, response?.url)
                setImageLoader(false)
            }
            else {
                setImageLoader(false)
            }
        } catch(error) {
            setImageLoader(false)
        }

    }

    useEffect(() => {
        getProfileImage()
    }, [])

    const onImageLoadStart = () => setImageFetchLoader(true)
    const onImageLoadEnd = () => setImageFetchLoader(false)

    return (
        <Container
            header={{ title: "settings", headerRight }}
            contentContainerStyle={Styles.container}
        >
            <View style={Styles.innerCon}>
                <TouchableOpacity style={Styles.imageCon}
                    activeOpacity={0.7}
                    onPress={showImagePicker}
                >
                    <View style={Styles.image}>
                        {
                            imageLoader ?
                                <ActivityIndicator size={'small'} color={Colors.color4} />
                                :
                                userImage?.length !== 0 ?
                                    <View style={Styles.imageOuterCon}>
                                        <Image
                                            source={{ uri: userImage }}
                                            resizeMode='cover'
                                            style={Styles.image}
                                            onLoadStart={onImageLoadStart}
                                            onLoadEnd={onImageLoadEnd}
                                        />
                                        {
                                            imageFetchLoader &&
                                            <ActivityIndicator
                                                size={'small'}
                                                color={Colors.color4}
                                                style={{ position: 'absolute' }}
                                            />
                                        }
                                    </View>
                                    :
                                    <FontAwesome6
                                        name='user-large'
                                        size={width * 0.29}
                                        color={Colors.color11}
                                        style={Styles.userIcon}
                                    />
                        }
                    </View>
                    <View style={Styles.cameraIcon}>
                        <Ionicons name='camera-outline' color={Colors.color1} size={25} />
                    </View>
                </TouchableOpacity>
                <Text style={Styles.userName}>
                    {currentUser?.userName}
                </Text>
                <View style={Styles.fieldCon}>
                    <Text style={Styles.fieldLabel}>
                        displayName
                    </Text>
                    {
                        editDisplayName ?
                            <TextInput
                                value={displayName}
                                onChangeText={onChangeText}
                                placeholder={t('enterDisplayName')}
                                style={Styles.displayNameInput}
                                onSubmitEditing={onUpdateDisplayName}
                                returnKeyLabel='Submit'
                                returnKeyType='done'
                            />
                            :
                            <TouchableOpacity style={Styles.displayNameCon}
                                activeOpacity={0.8}
                                onPress={onEditPress}
                            >
                                <Text style={Styles.fieldLabel}>
                                    {currentUser?.displayName}
                                </Text>
                                <Feather
                                    name='edit'
                                    color={Colors.color1}
                                    size={18}
                                    style={Styles.editIcon}
                                />
                            </TouchableOpacity>
                    }
                </View>
            </View>
            <SimpleLoader
                visible={loader}
            />
            <OverlayLoader
                visible={overlayLoader.visible}
                message={overlayLoader.message}
            />
            <Button
                text='logout'
                onPress={onLogoutPress}
            />
        </Container>
    )
}

export default Settings

const Styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
    },
    innerCon: {
        backgroundColor: Colors.color2,
        marginTop: 10,
        paddingTop: 50,
        paddingBottom: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    imageCon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width * 0.35,
        height: width * 0.35 * 1,
        borderRadius: width * 0.35 * 1 / 2,
        backgroundColor: Colors.color9,
        borderWidth: 1,
        borderColor: Colors.color8,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    cameraIcon: {
        width: width * 0.1,
        height: width * 0.1 * 1,
        borderRadius: width * 0.1 * 1 / 2,
        backgroundColor: Colors.color8,
        borderWidth: 1,
        borderColor: Colors.color8,
        position: 'absolute',
        bottom: 0,
        right: wp(2),
        justifyContent: 'center',
        alignItems: 'center'
    },
    userIcon: {
        marginTop: 23
    },
    userName: {
        color: Colors.color1,
        textAlign: 'center',
        maxWidth: wp(80),
        marginTop: 20,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.small2,
        includeFontPadding: false
    },
    fieldCon: {
        flexDirection: 'row',
        marginTop: 50,
        width: wp(85),
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    fieldLabel: {
        color: Colors.color1,
        fontFamily: Fonts.APPFONT_R,
        includeFontPadding: false,
        fontSize: Typography.small
    },
    displayNameCon: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    editIcon: {
        marginLeft: wp(2)
    },
    displayNameInput: {
        borderWidth: 1,
        borderColor: Colors.color1RGBA60,
        width: wp(50),
        paddingHorizontal: wp(2),
        paddingVertical: 10,
        borderRadius: 8,
        color: Colors.color1,
        fontSize: Typography.small,
    },
    imageOuterCon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    }
})