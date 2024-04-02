import { useMemo, useState } from "react"
import TicketView, { Side } from "./TicketView"
import { Text, View, ViewStyle } from "react-native"
import Pill from "./Pill"
import Button from "./Button"
import PALETTE, { FONTS } from "../Palette"
import { IconSVG, IconSVGCode } from "../IconSVG"

type Props = {
    side: Side,
}

export const Ticket = ({ side }: Props) => {

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
            <View style={[{ paddingHorizontal: 6, paddingVertical: 8, display: "flex", flexDirection: "column", gap: 8, borderColor: PALETTE.primary }, selected ? selectedStyleBySide : null]}>
                <View style={{ flex: 3, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flex: 1, display: "flex", flexDirection: "row", gap: 8, justifyContent: "flex-start" }}>
                        <Pill title="INT-132" variant={selected ? "primary" : "neutral"} />
                    </View>
                    <View style={{ flex: 1, display: "flex", flexDirection: "row", gap: 8, justifyContent: "flex-end" }}>
                        <Pill title="OUVERT" variant="success" inverted />
                        <Button onPress={() => { }} icon={IconSVGCode.menu_ellipsis_vertical} variant="neutral" />
                    </View>
                </View>
                <View style={{ flex: 2, display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 8 }}>
                    <IconSVG size={"normal"} icon={IconSVGCode.tmpUser} fill={PALETTE.yellow} />
                    <Text style={{ fontSize: 18, lineHeight: 18, marginTop: 3, fontFamily: FONTS.A400, color: PALETTE.textOnSurface }}>JEAN JACQUES</Text>
                    <IconSVG size={"normal"} icon={IconSVGCode.tmpStar} fill={PALETTE.yellow} />
                    <Text style={{ fontSize: 18, lineHeight: 18, marginTop: 3, fontFamily: FONTS.A400, color: PALETTE.textOnSurface }}>5</Text>
                    <IconSVG size={"normal"} icon={IconSVGCode.tmpBook} fill={PALETTE.primary} />
                    <IconSVG size={"normal"} icon={IconSVGCode.tmpCB} fill={PALETTE.primary} />
                </View>
                <View style={{ flex: 2, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: 8 }}>
                        <IconSVG size={"normal"} icon={IconSVGCode.tmpFork} fill={PALETTE.primary} />
                        <Text style={{ fontSize: 18, lineHeight: 18, marginTop: 3, fontFamily: FONTS.A400, color: PALETTE.textOnSurface }}>4</Text>
                        <IconSVG size={"normal"} icon={IconSVGCode.tmpTicket} fill={PALETTE.primary} />
                        <Text style={{ fontSize: 18, lineHeight: 18, marginTop: 3, fontFamily: FONTS.A400, color: PALETTE.textOnSurface }}>8.00 €</Text>
                    </View>
                    <View style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
                        <IconSVG size={"normal"} icon={IconSVGCode.tmpEdit} fill={PALETTE.success} />
                        <Text style={{ fontSize: 18, lineHeight: 18, marginTop: 3, fontFamily: FONTS.A600, color: PALETTE.success }}>34 MIN</Text>
                    </View>
                </View>
            </View>
        </TicketView>
    )
}