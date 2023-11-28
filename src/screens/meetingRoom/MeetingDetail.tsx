import { View, StyleSheet, Text as ReactText } from 'react-native'
import React from 'react'
import { ActionSheet, Text } from '../../components'
import { Colors, Fonts } from '../../res'
import { Typography, wp } from '../../global'
import Ripple from 'react-native-material-ripple'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import { flashSuccessMessage } from '../../components/FlashMessage'
import Clipboard from '@react-native-clipboard/clipboard';
import { useGlobalContext } from '../../services'

interface MeetingDetailProps {
    visible: boolean,
    onClose: () => void,
    meetingID: string,
    hostName: string
}
const MeetingDetail = (props: MeetingDetailProps) => {
    const { currentUser } = useGlobalContext()
    const { t } = useTranslation()
    const {
        visible = false,
        onClose = () => { },
        meetingID = '',
        hostName = ''
    } = props

    const onCopyPress = () => {
        Clipboard.setString(meetingID);
        flashSuccessMessage('coppied')
    }

    return (
        <ActionSheet
            visible={visible}
            onClose={onClose}
            indicatorStyle={{ backgroundColor: Colors.color1 }}
            containerStyle={Styles.actionSheetContainer}
            hideCloseButton
            style={Styles.actionSheet}
        >
            <Text style={Styles.heading} overrideStyle={{ marginBottom: 30 }}>
                meetingEncryptionDes
            </Text>
            <View style={Styles.fieldCon}>
                <Text style={Styles.fieldText}>
                    meetingHost
                </Text>
                <ReactText style={[Styles.fieldText, { fontFamily: Fonts.APPFONT_SB }]}>
                    {hostName.length !== 0 ? hostName : currentUser?.displayName}
                </ReactText>
            </View>
            <View style={Styles.fieldCon}>
                <Text style={Styles.fieldText}>
                    meetingDuration
                </Text>
                <ReactText style={[Styles.fieldText, { fontFamily: Fonts.APPFONT_SB }]}>
                    1 {t('hour')}
                </ReactText>
            </View>
            <View style={Styles.meetingIDCopyBtnOuter}>
                <Ripple style={Styles.meetingIDCopyBtn}
                    onPress={onCopyPress}
                >
                    <Text style={Styles.meetingID}>
                        {meetingID?.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}
                    </Text>
                    <Ionicons name='copy-outline' color={Colors.color2} size={20} />
                </Ripple>
            </View>
        </ActionSheet>
    )
}

export default MeetingDetail


const Styles = StyleSheet.create({
    actionSheetContainer: {
        backgroundColor: Colors.color13,
    },
    closeButtonStyle: {
        backgroundColor: Colors.color1
    },
    actionSheet: {
        paddingHorizontal: wp(5),
    },
    heading: {
        color: Colors.color8,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.small,
        includeFontPadding: false,
        marginTop: 10,
    },
    fieldCon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    fieldText: {
        color: Colors.color8,
        fontFamily: Fonts.APPFONT_R,
        includeFontPadding: false,
        fontSize: Typography.small
    },
    meetingIDCopyBtnOuter: {
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 20,
    },
    meetingIDCopyBtn: {
        height: wp(14),
        backgroundColor: Colors.color1,
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
    },
})