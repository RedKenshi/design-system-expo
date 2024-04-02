import { Image, Pressable, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PALETTE, { shadow } from "../Palette";
import Menu from "./Menu";
import { EiwieSVG, IconSVG, IconSVGCode } from "../IconSVG";

type Props = {
    setOpenMenu: (value: boolean) => void
}

export const TopBar = ({ setOpenMenu }: Props) => {

    const insets = useSafeAreaInsets();
    const padding = {
        paddingTop: insets.top,
        paddingBottom: PALETTE.spacing.m,
        paddingLeft: insets.left,
        paddingRight: insets.right,
    } as ViewStyle

    return (
        <View style={[styles.topBarWrapper, shadow]}>
            <View style={[styles.topBarContainer, padding]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingTop: PALETTE.spacing.s, paddingBottom: PALETTE.spacing.xs }}>
                    <View style={{ paddingLeft: PALETTE.spacing.m }}>
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: PALETTE.spacing.m }} onPress={() => setOpenMenu(true)}>
                            <IconSVG icon={IconSVGCode.menu_bars} size="big" />
                            <EiwieSVG color={PALETTE.primary} neutral={PALETTE.textOnSurface} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: "row", display: "flex", alignItems: "center", paddingRight: PALETTE.spacing.m, gap: PALETTE.spacing.l }}>
                        <TouchableOpacity onPress={() => { }} >
                            <IconSVG icon={IconSVGCode.tmpGear} size="big" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { }} >
                            <IconSVG icon={IconSVGCode.tmpNotifications} size="big" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { }} >
                            <Image style={{ height: 40, width: 40, borderRadius: 20 }} source={require('../../assets/user.jpg')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default TopBar;

const styles = StyleSheet.create({
    topBarWrapper: {
        zIndex: 1000,
        backgroundColor: PALETTE.surface,
        display: "flex",
        flexDirection: "row",
    },
    topBarContainer: {
    },
    dimmer: {
        flex: 1,
        backgroundColor: "#0005"
    }
})