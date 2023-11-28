import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Colors, Fonts } from '../../res'
import { Typography, hp, wp } from '../../global'
import { Text } from '../../components'
import Ripple from 'react-native-material-ripple'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { flashSuccessMessage } from '../../components/FlashMessage'
import Clipboard from '@react-native-clipboard/clipboard';

interface descriptionProps {
    meetingID: string
}

const DescriptionSection = (props: descriptionProps) => {
    const { meetingID = '' } = props
    const onCopyPress = () => {
        Clipboard.setString(meetingID);
        flashSuccessMessage('coppied')
    }

    return (
        <View style={Styles.container}>
            <Text style={Styles.heading}>
                startMeetingDescriptionHeading
            </Text>
            <Text style={Styles.description}>
                startMeetingDescription
            </Text>
            <View style={Styles.meetingIDCopyBtnOuter}>
                <Ripple style={Styles.meetingIDCopyBtn}
                    onPress={onCopyPress}
                >
                    <Text style={Styles.meetingID}>
                        {meetingID}
                    </Text>
                    <Ionicons name='copy-outline' color={Colors.color2} size={20} />
                </Ripple>
            </View>
        </View>
    )
}

export default DescriptionSection

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: hp(18)
    },
    heading: {
        color: Colors.color2,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.small,
        includeFontPadding: false
    },
    description: {
        color: Colors.color2,
        fontFamily: Fonts.APPFONT_R,
        fontSize: Typography.small,
        includeFontPadding: false,
        marginTop: 15
    },
    meetingIDCopyBtnOuter: {
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 30,
    },
    meetingIDCopyBtn: {
        height: wp(14),
        backgroundColor: Colors.color13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
    },
    meetingID: {
        color: Colors.color2,
        fontFamily: Fonts.APPFONT_R,
        fontSize: Typography.small,
        includeFontPadding: false
    }
})