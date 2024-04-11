import { Image, TouchableOpacity } from "react-native"
import { Theme } from "../constants/Palette";
import { EiwieSVG, IconSVG, IconSVGCode } from "./IconSVG";
import Box from "./Box";
import { useTheme } from "@shopify/restyle";
import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

type Props = {
}

export const TopBarMenu = ({ }: Props) => {

    const theme = useTheme<Theme>();
    const { setOpen } = useContext(AppContext)

    return (
        <Box paddingTop="s" paddingBottom='xs' style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <Box style={{ paddingLeft: theme.spacing.m }}>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.m }} onPress={() => setOpen(true)}>
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
                    <Image style={{ height: 40, width: 40, borderRadius: 20 }} source={require('../assets/user.jpg')} />
                </TouchableOpacity>
            </Box>
        </Box>
    )
}

export default TopBarMenu;