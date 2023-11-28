import { View, StyleSheet, TouchableOpacity, Text as ReactText } from 'react-native'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Colors, Fonts } from '../../res'
import { Typography, wp } from '../../global'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MeetingDetail from './MeetingDetail'
import { Text } from '../../components'
import InCallManager from 'react-native-incall-manager';
import DeviceInfo from 'react-native-device-info'
import moment from 'moment-timezone'
import { getTimeZone } from "react-native-localize";


interface headerProps {
    meetingID: string,
    meetingStartTime?: string,
    isMeetingEnd?: boolean,
    hostName?: string,
    fromHost?: boolean,
    isFullScreen: boolean
}

const Header = (props: headerProps) => {
    const {
        meetingID,
        meetingStartTime = new Date(),
        isMeetingEnd,
        hostName = '',
        fromHost = false,
        isFullScreen = false
    } = props

    const [meetingDetailVisible, setMeetingDetailVisible] = useState(false)
    const [speaker, setSpeaker] = useState(true)



    const [formattedMeetingTimer, setFormattedMeetingTimer] = useState('00:00:00')
    const [timerInterval, setTimerInterval] = useState<any>(null);


    const onSpeakerPress = () => {
        if(!speaker) {
            InCallManager.setForceSpeakerphoneOn(true);
            InCallManager.setSpeakerphoneOn(true)
            setSpeaker(true)
        } else {
            InCallManager.setForceSpeakerphoneOn(false);
            InCallManager.setSpeakerphoneOn(false)
            setSpeaker(false)
        }
    }
    const hideMeetingDetail = () => {
        setMeetingDetailVisible(false)
    }
    const showMeetingDetail = () => {
        setMeetingDetailVisible(true)
    }


    const meetingTimerRef: any = useRef(null)
    useEffect(() => {
        const timeZone = getTimeZone()
        const currentTime = moment().tz(timeZone);
        const startTime = moment(meetingStartTime).tz(timeZone)

        let timeDifference = moment.duration(currentTime.diff(startTime))
        if(timeDifference.asSeconds() < 0) {
            timeDifference = moment.duration(0);
        }
        if(!fromHost) {
            timeDifference.add(1, 'second')
        }
        meetingTimerRef.current = timeDifference

        const timerInterval = setInterval(() => {
            meetingTimerRef.current = meetingTimerRef.current.add(1, 'second')
            setFormattedMeetingTimer(moment.utc(meetingTimerRef.current.as('milliseconds')).format('HH:mm:ss'))
        }, 1000)

        setTimerInterval(timerInterval)
    }, [])

    useEffect(() => {
        return () => {
            clearInterval(timerInterval)
        };
    }, [])

    useEffect(() => {
        if(isMeetingEnd && timerInterval && !fromHost) {
            clearInterval(timerInterval)
        }
    }, [isMeetingEnd])


    const renderMemoizedFunction = useMemo(() => {
        return (
            <MeetingDetail
                visible={meetingDetailVisible}
                onClose={hideMeetingDetail}
                meetingID={meetingID}
                hostName={hostName}
            />
        );
    }, [meetingDetailVisible]);

    const renderMeetingID = useMemo(() => {
        return (
            <View style={Styles.meetingIDCon} >
                <Text style={Styles.meetingID}>
                    {meetingID.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}
                </Text>
                <AntDesign name='down' color={Colors.color2} size={15} style={Styles.meetindIDDownIcon} />
            </View>
        );
    }, [])

    const renderSpeaker = useMemo(() => {
        return (
            <View style={Styles.headerControlsCon}>
                {
                    speaker ?
                        <TouchableOpacity activeOpacity={0.7}
                            onPress={onSpeakerPress}
                        >
                            <Ionicons name="volume-medium-outline" size={28} color={Colors.color2} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity activeOpacity={0.7}
                            onPress={onSpeakerPress}
                        >
                            <Ionicons name="volume-mute-outline" size={28} color={Colors.color2} />
                        </TouchableOpacity>
                }
            </View>
        );
    }, [speaker])

    return (
        !isFullScreen &&
        <View style={Styles.header}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={showMeetingDetail}
            >
                {renderMeetingID}
                <ReactText style={Styles.timer}>
                    {formattedMeetingTimer}
                </ReactText>
            </TouchableOpacity>
            {renderSpeaker}
            {renderMemoizedFunction}
        </View>
    )
}

export default Header

const Styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    meetingID: {
        color: Colors.color2,
        includeFontPadding: false,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.tiny1
    },
    meetingIDCon: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    meetindIDDownIcon: {
        marginHorizontal: wp(1.5),
        marginTop: 4
    },
    timer: {
        color: Colors.color2,
        includeFontPadding: false,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.tiny1
    },
    headerControlsCon: {
        borderColor: 'red',
        flexDirection: 'row'
    },
    cameraIcon: {
        marginRight: wp(6)
    }
})