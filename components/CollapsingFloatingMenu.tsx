import { useEffect, useState } from "react"
import Button, { ButtonVariant } from "./Button"
import { IconSVGCode } from "./IconSVG"
import { Pressable, StyleSheet, View } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import Box from "./Box"
import { useTheme } from "@shopify/restyle"
import { Theme, shadow } from "../constants/Palette"
import CustomText from "./CustomText"
import { BlurView } from "expo-blur"

export type FloatingAction = {
    icon: IconSVGCode,
    label: string,
    onPress: Function,
    color: ButtonVariant
}

type Props = {
    position?: "top-left" | "bottom-left" | "top-right" | "bottom-right"
    collapsedIcon?: IconSVGCode
    actions: FloatingAction[]
}

export const CollapsingFloatingMenu = ({ position = "bottom-right", collapsedIcon = IconSVGCode.menu_burger, actions }: Props) => {

    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <View style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1000000, ...shadow }}>
                <Button
                    style={{ position: 'absolute', bottom: 0, right: 0, borderRadius: 999, zIndex: 1000000 }}
                    variant={open ? 'danger' : 'primary'}
                    size='m'
                    icon={open ? IconSVGCode.xmark : collapsedIcon}
                    onPress={() => setOpen(open ? false : true)}
                />
            </View>
            {actions.map((action: FloatingAction, index: number) => {
                return (
                    <View style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 100000 - index }}>
                        <FloatingMenuButton menuOpen={open} action={action} index={index} />
                    </View>
                )
            })}
            {open && <BlurView intensity={5} style={StyleSheet.absoluteFill}>
                <Pressable onPress={() => setOpen(false)} style={styles.dimmer} />
            </BlurView>
            }
        </>
    )
}

type FloatingMenuButtonProps = {
    action: FloatingAction,
    index: number,
    menuOpen: boolean
}

const FloatingMenuButton = ({ action, index, menuOpen }: FloatingMenuButtonProps) => {

    const trans = (index + 1) * (48 + 8)

    const theme = useTheme<Theme>()

    const transY = useSharedValue(0)
    const opacity = useSharedValue(0)

    useEffect(() => {
        if (menuOpen) {
            transY.value = withTiming(-trans)
            opacity.value = withTiming(1)
        } else {
            transY.value = withTiming(0)
            opacity.value = withTiming(0)
        }
    }, [menuOpen])

    const style = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateY: transY.value }]
        }
    })

    return (
        <Animated.View
            style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                zIndex: 100000 - index,
                ...style
            }}
        >
            <Pressable style={[shadow, {
                height: 48,
                backgroundColor: theme.colors.surface,
                borderRadius: 99,
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: theme.spacing.s,
                marginRight: theme.spacing.xs,
            }]}
                onPress={() => action.onPress()}>
                <CustomText font="A700" size={18} lineHeight={20} style={{ marginTop: 4, marginLeft: theme.spacing.m }}>{action.label}</CustomText>
                <Button
                    style={{ borderRadius: 999, alignSelf: 'center', margin: 0 }}
                    variant={action.color}
                    size='m'
                    icon={action.icon}
                    onPress={null}
                    pointerEvents="none"
                />
            </Pressable>
        </Animated.View >
    )
}

export default CollapsingFloatingMenu

const styles = StyleSheet.create({
    dimmer: {
        flex: 1,
        backgroundColor: "#0003"
    }
})