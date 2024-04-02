import { Pressable, ScrollView, StyleSheet, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import PALETTE from "../Palette";
import { BlurView } from 'expo-blur';
import Button, { ButtonVariant } from "./Button";
import { IconSVGCode } from "../IconSVG";

type ModalAction = {
    variant: ButtonVariant
    title: string
    icon?: IconSVGCode
    onPress: Function
}

type Props = {
    open: boolean,
    setOpen: (value: boolean) => void
    actions?: ModalAction[]
    preventCloseOnDimmerPress?: boolean;
    children: JSX.Element | JSX.Element[],
}

export const Modal = ({ open, setOpen, actions, preventCloseOnDimmerPress = false, children }: Props) => {

    const insets = useSafeAreaInsets();
    const modalMarginY = 48;
    const modalMarginX = 24;

    const modalWrapperStyle = {
        zIndex: 9000,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#000c",
    } as ViewStyle

    const modalStyle = {
        flex: 1,
        alignSelf: "stretch",
        top: insets.top + modalMarginY,
        bottom: insets.bottom + modalMarginY,
        left: insets.left + modalMarginX,
        right: insets.right + modalMarginX,
        backgroundColor: PALETTE.surface,
        borderRadius: 8,
    } as ViewStyle

    if (open) {
        return (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={[modalWrapperStyle]}>
                <BlurView intensity={5} style={{ height: "100%", width: "100%" }}>
                    <Pressable onPress={() => preventCloseOnDimmerPress ? null : setOpen(false)} style={styles.dimmer} />
                    <View style={[{ position: "absolute", zIndex: 10 }, modalStyle]}>
                        <ScrollView contentContainerStyle={{ paddingBottom: "25%" }} automaticallyAdjustKeyboardInsets={true}>
                            {children}
                        </ScrollView>
                        <View style={styles.actionsRow}>
                            {actions.map((action, i) => {
                                return (
                                    <Button key={`actions-${i}-${action.title}`} iconPosition="right" style={{ flex: 1 }} onPress={action.onPress} icon={action.icon} title={action.title} variant={action.variant} />
                                )
                            })}
                        </View>
                    </View>
                </BlurView>
            </Animated.View>
        )
    } else {
        return null
    }
}

export default Modal;

const styles = StyleSheet.create({
    actionsRow: {
        flexDirection: "row",
        padding: PALETTE.spacing.s,
        paddingTop: PALETTE.spacing.l,
        gap: PALETTE.spacing.xxs
    },
    dimmer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 10
    }
})