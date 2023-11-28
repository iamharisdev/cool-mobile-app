import { Text, TextProps, TextStyle } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface TxtProps extends TextProps {
    children?: any;
    overrideStyle?: TextStyle
}

const TextFun = (props: TxtProps) => {
    const { t } = useTranslation()
    const {
        children,
        style,
        overrideStyle,
        ...textProps
    } = props;

    return (
        <Text {...textProps} style={[style, { marginBottom: 3 }, overrideStyle]}>
            {t(children)}
        </Text>
    )
}

export default TextFun;
