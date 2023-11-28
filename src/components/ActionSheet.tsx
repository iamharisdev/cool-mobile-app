import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import React, { useRef, useEffect, ReactNode } from 'react'
import ActionSheet, { ActionSheetRef, ActionSheetProps } from "react-native-actions-sheet";
import { hp, wp } from '../global';
import { Colors } from '../res';
import AntDesign from 'react-native-vector-icons/AntDesign'

interface ActionSheetPro extends ActionSheetProps {
    visible: boolean
    onClose: () => void
    children?: ReactNode
    style?: ViewStyle
    hideCloseButton?: boolean
    closeButtonStyle?: ViewStyle,
    closeIconColor?: string
}

const GActionSheet = (props: ActionSheetPro) => {
    const {
        visible = false,
        onClose = () => { },
        children = <View />,
        style = {},
        hideCloseButton = false,
        closeButtonStyle = {},
        closeIconColor = Colors.color1,
        ...actonSheetProps
    } = props
    const actionSheetRef = useRef<ActionSheetRef>(null);

    useEffect(() => {
        visible ?
            actionSheetRef.current?.show()
            : actionSheetRef.current?.hide()
    }, [visible])

    return (
        <ActionSheet
            ref={actionSheetRef}
            gestureEnabled={true}
            onClose={onClose}
            indicatorStyle={{ backgroundColor: Colors.color2 }}
            {...actonSheetProps}
        >
            <View style={style}>
                {children}
                {
                    !hideCloseButton &&
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[Styles.close, closeButtonStyle]}
                        onPress={onClose}
                    >
                        <AntDesign name='close' size={20} color={closeIconColor} />
                    </TouchableOpacity>
                }
            </View>
        </ActionSheet>
    )
}

export default GActionSheet

const Styles = StyleSheet.create({
    close: {
        height: 28,
        width: 28,
        backgroundColor: Colors.color8,
        borderRadius: 28 / 2,
        position: 'absolute',
        top: -10,
        right: wp(1.5),
        justifyContent: 'center',
        alignItems: 'center'
    }
})