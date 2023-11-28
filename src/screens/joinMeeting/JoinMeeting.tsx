import { View, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Button, Container, LanguagePickerButton, Text } from '../../components'
import { Colors, Fonts } from '../../res'
import { Typography } from '../../global'
import JoinMeetingPopup from './JoinMeetingPopup'
import DeviceInfo from 'react-native-device-info'

const JoinMeeting = ({ navigation }: any) => {
    const [joinMeetingVisible, setJoinMeetingVisible] = useState(false)
    const onSettingPress = () => {
        navigation.navigate('Login')
    }

    const headerRight = () => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onSettingPress}
        >
            <Text style={Styles.loginTxt}>
                login
            </Text>
        </TouchableOpacity>
    )

    const headerLeft = () => <LanguagePickerButton />
    const hideJoinMeetingPopup = () => setJoinMeetingVisible(false)
    const showJoinMeetingPopup = () => setJoinMeetingVisible(true)

    return (
        <Container
            header={{
                headerLeft,
                headerRight
            }}
        >
            <View style={Styles.innerContentCon}>
                <Button
                    text='joinMeeting'
                    onPress={showJoinMeetingPopup}
                />
                {
                    joinMeetingVisible &&
                    <JoinMeetingPopup
                        visible={joinMeetingVisible}
                        onClose={hideJoinMeetingPopup}
                    />
                }
            </View>
        </Container>
    )
}

export default JoinMeeting

const Styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },

    downIcon: {
        marginTop: 2.5
    },
    innerContentCon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    loginTxt: {
        color: Colors.color6,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.small1,
        includeFontPadding: false,
    }
})