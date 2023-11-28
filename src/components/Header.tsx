import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { Typography, wp } from '../global'
import { Colors, Fonts } from '../res'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import AntDesign from 'react-native-vector-icons/AntDesign'

interface HeaderProps {
    header: any
}

const Header = (props: HeaderProps) => {

    const {
        header = {}
    } = props

    const { t } = useTranslation()
    const navigation = useNavigation()
    const onBackPress = () => navigation.goBack()

    return (
        <View style={Styles.header}>
            {
                header?.title &&
                <View style={Styles.headerCenter}>
                    <Text style={Styles.headerCenterText}>
                        {t(header?.title)}
                    </Text>
                </View>
            }
            {
                header?.headerLeft ?
                    <header.headerLeft />
                    :
                    navigation.canGoBack() && !header?.hideBack ?
                        <TouchableOpacity style={Styles.headerLeft} activeOpacity={0.7}
                            onPress={onBackPress}
                        >
                            <AntDesign name='left' color={Colors.color6} size={22} style={{ marginTop: 1.5 }} />
                            <Text style={Styles.headerLeftTxt}>
                                {t('back')}
                            </Text>
                        </TouchableOpacity>
                        :
                        <View style={Styles.headerLeft} />
            }
            {
                <View style={Styles.headerRight}>
                    {header?.headerRight && <header.headerRight />}
                </View>
            }
        </View>
    )
}

export default Header

const Styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(3),
        paddingBottom: 8,
        backgroundColor: Colors.color7,
        borderBottomWidth: 1,
        borderBottomColor: Colors.color8
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp(20)
    },
    headerLeftTxt: {
        color: Colors.color6,
        fontFamily: Fonts.APPFONT_R,
        fontSize: Typography.small1,
        includeFontPadding: false,
    },
    headerCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        height: 40,
        bottom: 2,
        width: wp(100)
    },
    headerRight: {
        width: wp(20),
        alignItems: 'flex-end'
    },
    headerCenterText: {
        color: Colors.color1,
        fontFamily: Fonts.APPFONT_SB,
        fontSize: Typography.small1,
        includeFontPadding: false,
    }
})