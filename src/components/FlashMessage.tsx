import { showMessage, FlashMessageProps } from "react-native-flash-message";
import { Typography } from '../global';
import { Colors, Fonts } from '../res';
import { t } from "i18next";

const FlashMessage = (props: FlashMessageProps) => {
    return (
        showMessage({
            message: "",
            type: "info",
            duration: 3000,
            titleStyle: { fontSize: Typography.tiny1, color: Colors.color2, fontFamily: Fonts.APPFONT_SB, includeFontPadding: false },
            hideStatusBar: false,
            ...props
        })
    )
}

const flashErrorMessage = (message = "commonError") => {
    return FlashMessage({
        type: 'danger',
        message: t(message)
    })
}

const flashSuccessMessage = (message = "") => {
    return FlashMessage({
        type: 'success',
        message: t(message)
    })
}

const flashInfoMessage = (message = "") => {
    return FlashMessage({
        type: 'info',
        message: t(message)
    })
}



export { flashErrorMessage, flashSuccessMessage, flashInfoMessage }