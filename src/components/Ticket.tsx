import { useMemo, useState } from "react"
import TicketView, { Side } from "./TicketView"
import { Text, View, ViewStyle } from "react-native"
import Pill from "./Pill"
import Button from "./Button"
import { FONTS, Theme } from "../Palette"
import { IconSVG, IconSVGCode } from "../IconSVG"
import { useTheme } from "@shopify/restyle"

type Props = {
    side: Side,
}

export const Ticket = ({ side }: Props) => {

    const theme = useTheme<Theme>();
    const [selected, setSelected] = useState<boolean>(false)

    const selectedStyleBySide = useMemo((): ViewStyle => {
        switch (side) {
            case Side.TOP: return { borderBottomWidth: 8 }
            case Side.BOTTOM: return { borderTopWidth: 8 }
            case Side.LEFT: return { borderRightWidth: 8 }
            case Side.RIGHT: return { borderLeftWidth: 8 }
        }
    }, [side])

    return (
        <TicketView onPress={() => { setSelected(!selected) }} side={side}>
            <View style={[{ paddingHorizontal: 6, paddingVertical: 8, display: "flex", flexDirection: "column", gap: 8, borderColor: theme.colors.primary }, selected ? selectedStyleBySide : null]}>
                <View style={{ flex: 3, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flex: 1, display: "flex", flexDirection: "row", gap: 8, justifyContent: "flex-start" }}>
                        <Pill title="INT-132" inverted={!selected} variant={selected ? "primary" : "neutral"} />
                    </View>
                    <View style={{ flex: 1, display: "flex", flexDirection: "row", gap: 8, justifyContent: "flex-end" }}>
                        <Pill title="OUVERT" variant="success" inverted />
                        <Button onPress={() => { }} icon={IconSVGCode.menu_ellipsis_vertical} variant="neutral" />
                    </View>
                </View>
                <View style={{ flex: 2, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 8 }}>
                    <IconSVG size={"normal"} icon={IconSVGCode.tmpUser} fill={theme.colors.yellow} />
                    <Text style={{ fontSize: 18, lineHeight: 18, marginTop: 3, fontFamily: FONTS.A400, color: theme.colors.textOnSurface }}>JEAN JACQUES</Text>
                    <IconSVG size={"normal"} icon={IconSVGCode.tmpStar} fill={theme.colors.yellow} />
                    <Text style={{ fontSize: 18, lineHeight: 18, marginTop: 3, fontFamily: FONTS.A400, color: theme.colors.textOnSurface }}>5</Text>
                    <IconSVG size={"normal"} icon={IconSVGCode.tmpBook} fill={theme.colors.primary} />
                    <IconSVG size={"normal"} icon={IconSVGCode.tmpCB} fill={theme.colors.primary} />
                </View>
                <View style={{ flex: 2, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: 8 }}>
                        <IconSVG size={"normal"} icon={IconSVGCode.tmpFork} fill={theme.colors.primary} />
                        <Text style={{ fontSize: 18, lineHeight: 18, marginTop: 3, fontFamily: FONTS.A400, color: theme.colors.textOnSurface }}>4</Text>
                        <IconSVG size={"normal"} icon={IconSVGCode.tmpTicket} fill={theme.colors.primary} />
                        <Text style={{ fontSize: 18, lineHeight: 18, marginTop: 3, fontFamily: FONTS.A400, color: theme.colors.textOnSurface }}>8.00 €</Text>
                    </View>
                    <View style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
                        <IconSVG size={"normal"} icon={IconSVGCode.tmpEdit} fill={theme.colors.success} />
                        <Text style={{ fontSize: 18, lineHeight: 18, marginTop: 3, fontFamily: FONTS.A600, color: theme.colors.success }}>34 MIN</Text>
                    </View>
                </View>
            </View>
        </TicketView>
    )
}