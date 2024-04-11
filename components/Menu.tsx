import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { IconSVG, IconSVGCode } from "./IconSVG";
import { FONTS, Theme } from "../constants/Palette";
import Pill from "./Pill";
import Box from "./Box";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";

interface Props {
    closeDrawer: Function
}

export const Menu = ({ closeDrawer }: Props) => {

    //useEffect(() => closeDrawer(), [])

    return (
        <Box flex={1} gap="s" padding='l' justifyContent={"flex-start"}>
            <LI title={"Buttons"} page={"buttons"} selected={false} icon={IconSVGCode.keyboard} pro />
            <LI title={"Typos"} page={"typos"} selected={false} icon={IconSVGCode.font} pro />
            <LI title={"Inputs"} page={"inputs"} selected={false} icon={IconSVGCode.cursori} pro />
            <LI title={"Tickets"} page={"tickets"} selected={false} icon={IconSVGCode.ticket} pro />
            <LI title={"Dnd"} page={"dnd"} selected={false} icon={IconSVGCode.drag_handle} pro />
            <LI title={"Printer"} page={"printer"} selected={false} icon={IconSVGCode.printer} pro />
            <LI title={"Settings"} page={"settings"} selected={false} icon={IconSVGCode.settings} pro />
            <Box flex={1} />
        </Box>
    )
}

const styles = StyleSheet.create({
    hr: {
        alignSelf: "center",
        width: "95%",
        margin: "auto",
        borderBottomWidth: 1,
    }
})

type LIProps = {
    page: string,
    title: string,
    selected: boolean,
    icon: IconSVGCode
    pro?: boolean
}

export const LI = ({ page, title, icon, selected, pro = false }: LIProps) => {

    const theme = useTheme<Theme>();

    return (
        <TouchableOpacity onPress={(e) => router.navigate(`/${page}`)} style={[stylesLI.rowWrapper, { backgroundColor: selected ? theme.colors.item : null }]}>
            <IconSVG icon={icon} size="big" fill={theme.colors.primary} />
            <Text numberOfLines={1} style={[stylesLI.rowTitle, { color: theme.colors.textOnSurface }]}>{title}</Text>
            {pro &&
                <>
                    <Box style={{ flex: 1 }} />
                    <Pill variant="neutral" inverted rounded title="PRO" size="xs" style={{ margin: 0, padding: 0 }} />
                </>
            }
        </TouchableOpacity>
    )
}

export default Menu

const stylesLI = StyleSheet.create({
    rowWrapper: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 16,
        padding: 12,
        flexDirection: "row",
        borderRadius: 6
    },
    rowTitle: {
        fontFamily: FONTS.A600,
        fontSize: 16
    }
})