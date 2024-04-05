import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { IconSVG, IconSVGCode } from "../IconSVG";
import { FONTS, Theme } from "../Palette";
import Pill from "./Pill";
import Box from "./Box";
import { useTheme } from "@shopify/restyle";
import { Pages } from "../../App";
import { useEffect } from "react";

interface Props {
    page: Pages
    setPage: (page: Pages) => void
    closeDrawer: Function
}

export const Menu = ({ page, setPage, closeDrawer }: Props) => {

    useEffect(() => closeDrawer(), [page])

    return (
        <Box flex={1} gap="s" padding='l' justifyContent={"flex-start"}>
            {/*<LI title={"Général"} selected={true} icon={IconSVGCode.gear} />
            <LI title={"Dashboard"} selected={false} icon={IconSVGCode.dashboard} />
            <LI title={"Utilisateurs et groupes"} selected={false} icon={IconSVGCode.user} />
            <LI title={"Matériel"} selected={false} icon={IconSVGCode.printer} />
            <Box borderColor="textOnBackground" style={styles.hr} />
            <LI title={"Vente"} selected={false} icon={IconSVGCode.bag} pro />
            <LI title={"Réservation"} selected={false} icon={IconSVGCode.table} pro />
            <LI title={"Publication"} selected={false} icon={IconSVGCode.edit} pro />
            <Box borderColor="textOnBackground" style={styles.hr} />*/}
            <LI setPage={setPage} title={"Buttons"} page={"button"} selected={"button" == page} icon={IconSVGCode.keyboard} pro />
            <LI setPage={setPage} title={"Typos"} page={"typo"} selected={"typo" == page} icon={IconSVGCode.font} pro />
            <LI setPage={setPage} title={"Inputs"} page={"inputs"} selected={"inputs" == page} icon={IconSVGCode.cursori} pro />
            <LI setPage={setPage} title={"Tickets"} page={"ticket"} selected={"ticket" == page} icon={IconSVGCode.tmpTicket} pro />
            <LI setPage={setPage} title={"Dnd"} page={"dnd"} selected={"dnd" == page} icon={IconSVGCode.drag_handle} pro />
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
    title: string,
    selected: boolean,
    icon: IconSVGCode
    pro?: boolean
    page: Pages
    setPage: (page: Pages) => void
}

export const LI = ({ title, icon, selected, pro = false, page, setPage }: LIProps) => {

    const theme = useTheme<Theme>();
    return (
        <TouchableOpacity onPress={(e) => setPage(page)} style={[stylesLI.rowWrapper, { backgroundColor: selected ? theme.colors.fullTheme : null }]}>
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