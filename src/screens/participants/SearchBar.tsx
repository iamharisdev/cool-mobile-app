import { View, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Typography, wp } from '../../global'
import { Colors, Fonts } from '../../res'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useTranslation } from 'react-i18next'

interface SearchBarProps {
    onSearch: (item: any) => void,
    loadInitial: () => void
}

const SearchBar = (props: SearchBarProps) => {
    const { onSearch = () => { } } = props
    const [inputText, setInputText] = useState('')
    const { t } = useTranslation()

    const onChangeText = (text: any) => {
        setInputText(text)
        if(text.length === 0) {
            props?.loadInitial && props?.loadInitial()
        }
    }

    return (
        <View style={Styles.container}>
            <TextInput
                style={Styles.searchTxt}
                placeholder={t('searchParticipants')}
                placeholderTextColor={Colors.color8}
                onChangeText={onChangeText}
                value={inputText}
                onSubmitEditing={onSearch.bind(null, inputText)}
            />
            <AntDesign
                name='search1'
                color={Colors.color8}
                size={wp(6)}
                style={{ paddingRight: wp(4), padding: 7 }}
                onPress={onSearch.bind(null, inputText)}
            />
        </View>
    )
}

export default SearchBar

const Styles = StyleSheet.create({
    container: {
        borderWidth: 0.7,
        borderColor: Colors.color19,
        backgroundColor: Colors.color17,
        borderRadius: 50,
        height: wp(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    searchTxt: {
        color: Colors.color8,
        fontFamily: Fonts.APPFONT_R,
        includeFontPadding: false,
        fontSize: Typography.tiny1,
        paddingHorizontal: wp(4),
        width: wp(75),
        height: wp(12),
        marginBottom: 1
    }
})