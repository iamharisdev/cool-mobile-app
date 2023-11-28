import { View, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Button, Container, Text } from '../../components'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Colors, Fonts } from '../../res'
import { Typography, wp } from '../../global'
import { useTranslation } from 'react-i18next'
import NewMeetingPopup from './newMeetingPopup'
import { StorageManager, useGlobalContext } from '../../services'
import JoinMeetingPopup from '../joinMeeting/JoinMeetingPopup'
import { useFocusEffect } from '@react-navigation/native'
import { ApiServices } from '../../services/api'
import { flashErrorMessage } from '../../components/FlashMessage'


const NewMeeting = ({ navigation }: any) => {

    const { t } = useTranslation()
    const { setData, storageKeys } = StorageManager
    const { currentUser, setCurrentUser, setUserImage } = useGlobalContext()
    const group = currentUser?.Group
    const isWeek = group?.timeLimitUnit === 'week' ? true : false
    const isMonth = group?.timeLimitUnit === 'month' ? true : false
    const isDay = group?.timeLimitUnit === 'day' ? true : false
    const isUnlimited = group?.timeLimitUnit === 'unLimited' ? true : false


    const usage = (currentUser?.usage?.totalTimeUsed / 3600)
    const remaining = isUnlimited ? 1 : (group?.timeLimitValue - (currentUser?.usage?.totalTimeUsed / 3600))
    const durationLimit = group?.timeLimitValue

    const [newMeetingPopupVisible, setNewMeetingPopupVisible] = useState(false)
    const [joinMeetingPopupVisible, setJoinMeetingPopupVisible] = useState(false)

    const onSettingPress = () => {
        navigation.navigate('Settings')
    }

    const headerRight = () => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onSettingPress}
        >
            <Ionicons name='settings-sharp' color={Colors.color1} size={25} />
        </TouchableOpacity>
    )

    const renderField = (heading = '', description = '', style = {}) => {
        return (
            <View style={[Styles.fieldsCon, style]}>
                <Text style={Styles.fieldsTxt}>
                    {t(heading)}
                </Text>
                <Text style={Styles.fieldsTxt}>
                    {t(description)}
                </Text>
            </View>
        )
    }

    const onStartNewMeetingPress = () => {
        if(remaining <= 0) {
            flashErrorMessage('meetingStartUsageCompleteDes')
        }
        else {
            setNewMeetingPopupVisible(true)
        }
    }

    const hideNewMeetingPopup = () => {
        setNewMeetingPopupVisible(false)
    }
    const hideJoinMeetingPopup = () => setJoinMeetingPopupVisible(false)
    const onJoinMeetingPress = () => setJoinMeetingPopupVisible(true)

    const getUserData = async () => {
        const user = await ApiServices.getMyProfile()
        setCurrentUser(user)
        await setData(storageKeys.USER, user)

        const response = await ApiServices.getProfileImage()
        if(response?.url) {
            setUserImage(response?.url)
            await setData(storageKeys.USER_IMAGE, response?.url)
        }

    }

    useFocusEffect(
        React.useCallback(() => {
            getUserData()
        }, [])
    )



    return (
        <Container
            header={{ title: "newMeeting", headerRight, hideBack: true }}
            contentContainerStyle={Styles.container}
        >
            <View style={Styles.innerCon}>
                <Text
                    style={Styles.heading}
                    overrideStyle={{ marginBottom: 20 }}
                >
                    meetingGroupDetails
                </Text>
                {renderField('groupType', group?.title)}
                {renderField('concurrentMeetings', group?.concurrentMeeting)}
                {renderField('participantLimit', group?.participantLimit)}
                {renderField('durationLimit', isUnlimited ? t('unlimited') : `${durationLimit} ${durationLimit <= 1 ? t('hour') : t('hours')} / ${isDay ? t('day') :
                    isWeek ? t('week') : t('month')}`
                )}
                {renderField(isDay ? 'todayUsage'
                    : isWeek ? t('usedThisWeek')
                        : isMonth ? 'usedThisMonth'
                            : t('totalUsage')
                    , `${usage.toFixed(2)} ${usage <= 1 ? t('hour') : t('hours')}`
                )}
                {renderField('remaining', isUnlimited ? t('unlimited') : `${remaining < 0 ? 0 : remaining.toFixed(2)} ${remaining <= 1 ? t('hour') : t('hours')}`, { borderBottomWidth: 0 })}
            </View>
            {
                newMeetingPopupVisible &&
                <NewMeetingPopup
                    newMeetingPopupVisible={newMeetingPopupVisible}
                    onClose={hideNewMeetingPopup}
                    navigation={navigation}
                />
            }
            {
                joinMeetingPopupVisible &&
                <JoinMeetingPopup
                    visible={joinMeetingPopupVisible}
                    onClose={hideJoinMeetingPopup}
                />
            }
            <View>
                <Button
                    text='joinMeeting'
                    onPress={onJoinMeetingPress}
                    buttonStyle={Styles.transparentBtn}
                    buttonOuterStyle={Styles.transparentBtnOuter}
                    textStyle={Styles.transparentBtnText}
                />
                <Button
                    text='startNewMeeting'
                    onPress={onStartNewMeetingPress}
                />
            </View>

        </Container>
    )
}

export default NewMeeting

const Styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
    },
    innerCon: {
        backgroundColor: Colors.color2,
        marginTop: 10,
        borderRadius: 8,
        paddingLeft: wp(4),
        paddingTop: 15
    },
    heading: {
        fontFamily: Fonts.APPFONT_SB,
        color: Colors.color1,
        fontSize: Typography.small,
        includeFontPadding: false,
    },
    fieldsCon: {
        paddingVertical: 12,
        paddingRight: wp(4),
        borderBottomWidth: 1,
        borderBottomColor: Colors.color10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    fieldsTxt: {
        color: Colors.color1,
        fontFamily: Fonts.APPFONT_R,
        fontSize: Typography.small,
        includeFontPadding: false,
    },
    transparentBtn: {
        backgroundColor: Colors.color2
    },
    transparentBtnOuter: {
        borderWidth: 0.5,
        marginBottom: 20
    },
    transparentBtnText: {
        color: Colors.color4
    }
})