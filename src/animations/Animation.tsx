import React, { ReactNode } from 'react'
import { ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface animationProps {
    animation?: string,
    duration?: number,
    style?: any,
    children?: ReactNode
}
const Animation = (props: animationProps) => {
    const {
        animation = 'zoomIn',
        duration = 500,
        style = null
    } = props
    return (
        <Animatable.View
            animation={animation}
            useNativeDriver={true}
            duration={duration}
            style={style}
        >
            {props.children}
        </Animatable.View>
    )
}

export default Animation


