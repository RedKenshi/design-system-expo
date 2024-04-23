import { Pressable, StyleSheet } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useContext, useEffect } from "react";
import { Dimensions } from 'react-native';
import PALETTE, { Theme } from "../constants/Palette";
import Menu from "./Menu";
import { EiwieSVG, IconSVGCode } from "./IconSVG";
import { BlurView } from "expo-blur";
import Box from "./Box";
import { useTheme } from "@shopify/restyle";
import { AppContext } from "../contexts/AppContext";
import Button from "./Button";

type Props = {
}

export const Drawer = ({ }: Props) => {

    const theme = useTheme<Theme>();
    const { darkMode, setDarkMode, open, setOpen } = useContext(AppContext);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const insets = useSafeAreaInsets();
    const padding = {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
    }

    const width = useSharedValue(0);
    const translateX = useSharedValue(0);

    useEffect(() => {
        open ? openDrawer() : closeDrawer()
    }, [open])

    const openDrawer = () => {
        width.value = withTiming(windowWidth, { duration: 200 })
        translateX.value = withTiming(0, { duration: 200 })
    }
    const closeDrawer = () => {
        width.value = withTiming(0, { duration: 200 })
        translateX.value = withTiming(-20, { duration: 200 })
    }
    const animatedStyles = useAnimatedStyle(() => ({
        width: width.value,
        transform: [{ translateX: translateX.value }]
    }));

    return (
        <Animated.View style={[styles.drawerWrapper, animatedStyles]}>
            <Box width={{ phone: 320, tablet: 380, largeTablet: 420 }} style={[padding, { backgroundColor: theme.colors.background, height: windowHeight }]}>
                <Box style={styles.logoWrapper}>
                    <EiwieSVG color={theme.colors.primary} neutral={theme.colors.textOnSurface} />
                </Box>
                <Menu closeDrawer={() => setOpen(false)} />
                <Button
                    style={{
                        marginBottom: theme.spacing.l,
                        borderRadius: 48,
                        alignSelf: "center",
                        backgroundColor: theme.colors.themeSwitchBackground
                    }}
                    textStyle={{
                        color: theme.colors.themeSwitchText
                    }}
                    icon={darkMode ? IconSVGCode.sun : IconSVGCode.moon}
                    onPress={() => { setDarkMode(!darkMode) }}
                    iconPosition="right"
                />
            </Box>
            {open &&
                <BlurView intensity={5} style={{ height: "100%", width: "100%" }}>
                    <Pressable onPress={() => setOpen(false)} style={styles.dimmer} />
                </BlurView>
            }
        </Animated.View>
    )
}

export default Drawer;

const styles = StyleSheet.create({
    drawerWrapper: {
        position: "absolute",
        zIndex: 100000,
        height: "100%",
        top: 0,
        left: 0,
        bottom: 200,
        display: "flex",
        flexDirection: "row",
        overflow: "hidden"
    },
    logoWrapper: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginHorizontal: PALETTE.spacing.s,
        paddingTop: PALETTE.spacing.xl,
        paddingBottom: PALETTE.spacing.l,
        paddingLeft: PALETTE.spacing.l
    },
    dimmer: {
        flex: 1,
        backgroundColor: "#0008"
    }
})