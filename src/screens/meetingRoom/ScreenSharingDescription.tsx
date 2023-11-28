import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Typography, hp, wp } from '../../global'
import { Colors, Fonts } from '../../res'
import Ripple from 'react-native-material-ripple'
import { Text } from '../../components'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const ScreenSharingDescription = () => {
    return (
        <View style={Styles.container}>
            {/* <Text style={Styles.description}>
                screenSharingDescription
            </Text> */}
            <View style={Styles.stopSharingBtnCon}>
                <Ripple style={Styles.stopSharingBtn}>
                    {/* <MaterialCommunityIcons name='close-box-outline' color={Colors.color8} size={23} /> */}
                    <Text style={Styles.stopSharingTxt}>
                        {/* stopSharing */}
                        Share Screen
                    </Text>
                </Ripple>
            </View>
        </View>
    )
}

export default ScreenSharingDescription

const Styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.color13,
        height: hp(50),
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    description: {
        color: Colors.color8,
        fontFamily: Fonts.APPFONT_R,
        includeFontPadding: false,
        fontSize: Typography.small
    },
    stopSharingBtnCon: {
        overflow: 'hidden',
        borderRadius: 50,
        // marginTop: 20,
    },
    stopSharingBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.color1,
        paddingVertical: 8,
        paddingHorizontal: wp(5),
    },
    stopSharingTxt: {
        color: Colors.color8,
        includeFontPadding: false,
        fontFamily: Fonts.APPFONT_R,
        fontSize: Typography.tiny,
        marginLeft: wp(2),
        marginBottom: 3
    }
})