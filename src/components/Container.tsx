import { SafeAreaView, StyleSheet, ScrollView, ViewStyle, StatusBar, Platform, View } from 'react-native'
import React, { ReactNode } from 'react'
import { wp } from '../global'
import { Colors } from '../res'
import Header from './Header'
import { OverlayLoader, SimpleLoader } from './loaders'

interface ContainerProps {
    style?: ViewStyle,
    safeAreaViewStyle?: ViewStyle
    contentContainerStyle?: ViewStyle
    children?: ReactNode,
    header?: any,
    scrollEnabled?: boolean,
    loader?: { visible: boolean, message?: string }
}

const Container = (props: ContainerProps) => {
    const {
        children,
        style = {},
        safeAreaViewStyle = {},
        contentContainerStyle = {},
        header = {},
        scrollEnabled = true,
    } = props

    return (
        <>
            <StatusBar backgroundColor={Colors.color7} barStyle={'dark-content'} />
            <SafeAreaView style={[Styles.safeAreaView, safeAreaViewStyle]} />
            <OverlayLoader
                visible={props?.loader?.visible || false}
                message={props?.loader?.message || undefined}
            />
            {
                Object.keys(header).length !== 0 &&
                <Header header={header} />
            }
            {
                scrollEnabled ?
                    <ScrollView
                        style={[Styles.container, style]}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[Styles.contentContainerStyle, contentContainerStyle]}
                        scrollEnabled={scrollEnabled}
                    >
                        {children}
                    </ScrollView>
                    :
                    <View
                        style={[Styles.container, style]}
                    >
                        {children}
                    </View>
            }

        </>
    )
}

export default Container

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
        backgroundColor: Colors.color9,
        paddingBottom: Platform.OS === 'ios' ? 28 : 18
    },
    contentContainerStyle: {
        flex: 1
    },
    safeAreaView: {
        backgroundColor: Colors.color7,
        paddingTop: 10
    }

})