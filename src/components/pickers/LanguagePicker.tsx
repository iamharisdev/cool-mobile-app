import { View, Text, Modal, ModalProps, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React, { ReactNode, useEffect, useState } from 'react'
import { Colors, Fonts } from '../../res';
import Ripple from 'react-native-material-ripple';
import { useTranslation } from 'react-i18next';
import { Typography } from '../../global';
import { Animation } from '../../animations';
import { StorageManager, useGlobalContext } from '../../services';
import i18next from 'i18next'
import { ActionSheet } from '..';

interface ContainerProps {
    visible: boolean
    onClose?: () => void
}

const LanguagePicker = (props: ContainerProps) => {
    const { getData, setData, storageKeys } = StorageManager
    const { language, setLanguage } = useGlobalContext()
    const { t } = useTranslation()
    const [languages, setLanguages] = useState([
        { label: 'chinese', value: 'chinese', selected: false, id: '1' },
        { label: 'english', value: 'english', selected: false, id: '2' }
    ])
    const {
        onClose = () => { },
        visible = false
    } = props

    useEffect(() => {
        setLanguages((prevLanguages) =>
            prevLanguages.map((lang) =>
                lang.value === language
                    ? { ...lang, selected: true }
                    : lang
            ))
    }, [])


    const onItemPress = (value: string) => {
        setLanguages((prevLanguages) =>
            prevLanguages.map((lang) =>
                lang.value === value
                    ? { ...lang, selected: true }
                    : { ...lang, selected: false }
            )
        );
        i18next.changeLanguage(value).then(() => {
            setData(storageKeys.LANGUAGE, value)
            setLanguage(value)
        })
            .catch((error) => {
                console.log('error while changing language =>', error)
            })
    }

    const renderLanguages = ({ item, index }: any) => {
        const selected = item?.selected ? true : false
        return (
            <Animation animation='fadeInLeft' duration={index === 0 ? 600 : 800}>
                <TouchableOpacity
                    style={Styles.itemCon}
                    activeOpacity={0.7}
                    onPress={onItemPress.bind(null, item?.value)}
                >
                    <View style={[Styles.radioBtnCon, selected && { borderColor: 'transparent' }]}>
                        {selected && <View style={Styles.radioBtnConInr} />}
                    </View>
                    <Text style={[Styles.itemTxt, selected && { fontFamily: Fonts.APPFONT_SB }]}>
                        {`${t(item?.label)}`}
                    </Text>
                </TouchableOpacity>
            </Animation>
        )
    }

    return (
        <ActionSheet
            visible={visible}
            onClose={onClose}
        >
            <FlatList
                data={languages}
                renderItem={renderLanguages}
                contentContainerStyle={Styles.listCon}
                scrollEnabled={false}
            />
        </ActionSheet>
    )
}

export default LanguagePicker

const Styles = StyleSheet.create({
    listCon: {
        paddingBottom: 10
    },
    itemCon: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemTxt: {
        color: Colors.color1,
        fontFamily: Fonts.APPFONT_R,
        fontSize: Typography.small,
        includeFontPadding: false,
    },
    radioBtnCon: {
        borderWidth: 1,
        borderColor: Colors.color5,
        width: 18,
        height: 18,
        borderRadius: 18 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8
    },
    radioBtnConInr: {
        width: 18,
        height: 18,
        borderRadius: 18 / 2,
        backgroundColor: Colors.color4
    }
})