import { View, StyleSheet, Modal, StatusBar, ActivityIndicator } from 'react-native'
import React from 'react'
import { Colors } from '../../res'

interface OverlayLoaderProps {
    visible: boolean
}
const SimpleLoader = (props: OverlayLoaderProps) => {
    const {
        visible = false,
    } = props

    return (
        <Modal
            visible={visible}
            transparent={true}
            supportedOrientations={['portrait', 'landscape']}
        >
            <StatusBar barStyle={'dark-content'} backgroundColor={Colors.color2} />
            <View style={styles.container}>
                <ActivityIndicator color={Colors.color1} size={'small'} />
            </View>
        </Modal>
    )
}

export default SimpleLoader

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.color2
    }
})