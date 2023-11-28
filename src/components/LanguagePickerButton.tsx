import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts } from '../res'
import { Typography, hp } from '../global'
import Ripple from 'react-native-material-ripple'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { useTranslation } from 'react-i18next'
import { useGlobalContext } from '../services'
import LanguagePicker from './pickers/LanguagePicker'


const LanguagePickerButton = () => {
    const { language } = useGlobalContext()
    const { t } = useTranslation()

    const [languagePickerVisible, setLanguagePickerVisible] = useState(false)
    const showLanguagePicker = () => {
        setLanguagePickerVisible(true)
    }
    const hideLanguagePicker = () => {
        setLanguagePickerVisible(false)
    }

    return (
        <>
            <View style={Styles.lngBtnCon}>
                <Ripple style={Styles.lngBtn}
                    onPress={showLanguagePicker}
                >
                    <SimpleLineIcons name='globe' color={Colors.color1} size={17} />
                    <Text style={Styles.lngTxt}>
                        {t(language === 'english' ? 'en' : 'ch')}
                    </Text>
                </Ripple>
            </View>
            <LanguagePicker
                visible={languagePickerVisible}
                onClose={hideLanguagePicker}
            />
        </>
    )
}

export default LanguagePickerButton

const Styles = StyleSheet.create({
    lngBtnCon: {
        borderRadius: 50,
        overflow: 'hidden',
    },
    lngBtn: {
        borderWidth: 1,
        borderColor: Colors.color5,
        paddingHorizontal: 10,
        paddingVertical: hp(0.5),
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    lngTxt: {
        color: Colors.color1,
        fontFamily: Fonts.APPFONT_SB,
        marginLeft: 6,
        fontSize: Typography.tiny,
        includeFontPadding: false
    },
})