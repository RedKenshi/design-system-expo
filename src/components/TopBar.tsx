import { Image, Pressable, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PALETTE, { Theme } from "../Palette";
import Menu from "./Menu";
import { EiwieSVG, IconSVG, IconSVGCode } from "../IconSVG";
import Box from "./Box";
import { useTheme } from "@shopify/restyle";

type Props = {
    setOpenMenu: (value: boolean) => void
}

export const TopBar = ({ setOpenMenu }: Props) => {

    const theme = useTheme<Theme>();
    const insets = useSafeAreaInsets();
    const padding = {
        paddingTop: insets.top < theme.spacing.m ? theme.spacing.m : insets.top,
        paddingBottom: theme.spacing.m,
    } as ViewStyle

    return (
        <Box backgroundColor='surface' style={[styles.topBarWrapper, theme.shadow]}>
            <Box paddingHorizontal={{ phone: 'xs', tablet: "m", largeTablet: "l" }} style={[styles.topBarContainer, padding]}>
                <Box paddingTop="s" paddingBottom='xs' style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <Box style={{ paddingLeft: theme.spacing.m }}>
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.m }} onPress={() => setOpenMenu(true)}>
                            <IconSVG icon={IconSVGCode.menu_bars} size="big" />
                            <EiwieSVG color={theme.colors.primary} neutral={theme.colors.textOnSurface} />
                        </TouchableOpacity>
                    </Box>
                    <Box flexDirection="row" alignItems="center" paddingRight='m' gap='l'>
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