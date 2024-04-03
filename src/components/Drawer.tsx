import { Pressable, StyleSheet } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from "react";
import { Dimensions } from 'react-native';
import PALETTE from "../Palette";
import Menu from "./Menu";
import { EiwieSVG } from "../IconSVG";
import { BlurView } from "expo-blur";
import Box from "./Box";

type Props = {
    open: boolean,
    setOpenMenu: (value: boolean) => void
}

export const Drawer = ({ open, setOpenMenu }: Props) => {

    const windowWidth = Dimensions.get('window').width;
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
            <Box width={{ phone: 320, tablet: 380, largeTablet: 420 }} style={[styles.drawerContainer, padding, { backgroundColor: PALETTE.colors.surface }]}>
                <Box style={styles.logoWrapper}>
                    <EiwieSVG color={PALETTE.colors.primary} neutral={PALETTE.colors.textOnSurface} />
                </Box>
                <Menu />
            </Box>
            {open &&
                <BlurView intensity={5} style={{ height: "100%", width: "100%" }}>
                    <Pressable onPress={() => setOpenMenu(false)} style={styles.dimmer} />
                </BlurView>
            }
        </Animated.View>
    )
}

export default Drawer;

const styles = StyleSheet.create({
    drawerWrapper: {
        position: "absolute",
        zIndex: 1000,
        height: "100%",
        top: 0,
        bottom: 200,
        left: 0,
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
    drawerContainer: {
        position: "relative",
        top: 0,
        bottom: 0,
        left: 0,
    },
    dimmer: {
        flex: 1,
        backgroundColor: "#0008"
    }
})