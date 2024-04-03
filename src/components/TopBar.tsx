import { Image, Pressable, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PALETTE from "../Palette";
import Menu from "./Menu";
import { EiwieSVG, IconSVG, IconSVGCode } from "../IconSVG";
import Box from "./Box";

type Props = {
    setOpenMenu: (value: boolean) => void
}

export const TopBar = ({ setOpenMenu }: Props) => {

    const insets = useSafeAreaInsets();
    const padding = {
        paddingTop: insets.top < PALETTE.spacing.m ? PALETTE.spacing.m : insets.top,
        paddingBottom: PALETTE.spacing.m,
    } as ViewStyle

    return (
        <Box style={[styles.topBarWrapper, PALETTE.shadow]}>
            <Box paddingHorizontal={{ phone: 'xs', tablet: "m", largeTablet: "l" }} style={[styles.topBarContainer, padding]}>
                <Box paddingTop="s" paddingBottom='xs' style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <Box style={{ paddingLeft: PALETTE.spacing.m }}>
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: PALETTE.spacing.m }} onPress={() => setOpenMenu(true)}>
                            <IconSVG icon={IconSVGCode.menu_bars} size="big" />
                            <EiwieSVG color={PALETTE.colors.primary} neutral={PALETTE.colors.textOnSurface} />
                        </TouchableOpacity>
                    </Box>
                    <Box style={{ flexDirection: "row", display: "flex", alignItems: "center", paddingRight: PALETTE.spacing.m, gap: PALETTE.spacing.l }}>
                        <TouchableOpacity onPress={() => { }} >
                            <IconSVG icon={IconSVGCode.tmpGear} size="big" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { }} >
                            <IconSVG icon={IconSVGCode.tmpNotifications} size="big" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { }} >
                            <Image style={{ height: 40, width: 40, borderRadius: 20 }} source={require('../../assets/user.jpg')} />
                        </TouchableOpacity>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default TopBar;

const styles = StyleSheet.create({
    topBarWrapper: {
        zIndex: 1000,
        backgroundColor: PALETTE.colors.surface,
        display: "flex",
        flexDirection: "row",
    },
    topBarContainer: {
        width: "100%"
    },
    dimmer: {
        flex: 1,
        backgroundColor: "#0005"
    }
})