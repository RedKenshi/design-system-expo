import { StyleSheet, Text, View } from "react-native";
import { IconSVG, IconSVGCode } from "../IconSVG";
import PALETTE, { FONTS } from "../Palette";
import Pill from "./Pill";
import Box from "./Box";

export const Menu = () => {

    return (
        <Box flex={1} gap="s" padding='l' justifyContent={"flex-start"}>
            <LI title={"Général"} selected={true} icon={IconSVGCode.gear} />
            <LI title={"Dashboard"} selected={false} icon={IconSVGCode.dashboard} />
            <LI title={"Utilisateurs et groupes"} selected={false} icon={IconSVGCode.user} />
            <LI title={"Matériel"} selected={false} icon={IconSVGCode.printer} />
            <Box style={styles.hr} />
            <LI title={"Vente"} selected={false} icon={IconSVGCode.bag} pro />
            <LI title={"Réservation"} selected={false} icon={IconSVGCode.table} pro />
            <LI title={"Publication"} selected={false} icon={IconSVGCode.edit} pro />
            <Box style={styles.hr} />
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
        borderColor: PALETTE.colors.textOnBackground
    }
})

type LIProps = {
    title: string,
    selected: boolean,
    icon: IconSVGCode
    pro?: boolean
}

export const LI = ({ title, icon, selected, pro = false }: LIProps) => {

    return (
        <View style={[stylesLI.rowWrapper, selected ? stylesLI.rowWrapperSelected : null]}>
            <IconSVG icon={icon} size="big" fill={PALETTE.colors.primary} />
            <Text numberOfLines={1} style={[stylesLI.rowTitle, selected ? stylesLI.rowTextSelected : null]}>{title}</Text>
            {pro &&
                <>
                    <View style={{ flex: 1 }} />
                    <Pill variant="neutral" inverted rounded title="PRO" size="xs" style={{ margin: 0, padding: 0 }} />
                </>
            }
        </View>
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
    rowWrapperSelected: {
        backgroundColor: PALETTE.colors.fullTheme,
    },
    rowTitle: {
        color: PALETTE.colors.textOnSurface,
        fontFamily: FONTS.A600,
        fontSize: 16
    }
})