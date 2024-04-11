import { Children, useCallback, useMemo, useState } from "react"
import { LayoutRectangle, Pressable, StyleSheet, View, ViewStyle } from "react-native"
import { Path, Svg } from "react-native-svg"
import PALETTE, { Theme } from "../constants/Palette"
import { useTheme } from "@shopify/restyle"

export enum Side {
    TOP = "TOP",
    BOTTOM = "BOTTOM",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

type Props = {
    onPress: () => void;
    side: Side,
    children: JSX.Element | JSX.Element[],
    style?: ViewStyle,
}

export const TicketView = ({ side, children, style, onPress }: Props) => {

    const theme = useTheme<Theme>();
    const [layout, setLayout] = useState<LayoutRectangle | null>(null)

    const wrapperStyleBySide = useMemo((): ViewStyle => {
        switch (side) {
            case Side.TOP: return { borderBottomRightRadius: 8, borderBottomLeftRadius: 8 }
            case Side.BOTTOM: return { borderTopRightRadius: 8, borderTopLeftRadius: 8 }
            case Side.LEFT: return { borderTopRightRadius: 8, borderBottomRightRadius: 8 }
            case Side.RIGHT: return { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }
        }
    }, [side])

    const containerStyleBySide = useMemo((): ViewStyle => {
        switch (side) {
            case Side.TOP: return { borderBottomRightRadius: 8, borderBottomLeftRadius: 8, top: 8, marginBottom: 8 }
            case Side.BOTTOM: return { borderTopRightRadius: 8, borderTopLeftRadius: 8, bottom: 8, marginTop: 8 }
            case Side.LEFT: return { borderTopRightRadius: 8, borderBottomRightRadius: 8, left: 8, marginRight: 8 }
            case Side.RIGHT: return { borderTopLeftRadius: 8, borderBottomLeftRadius: 8, right: 8, marginLeft: 8 }
        }
    }, [side])

    const patternPathBySide = useCallback((index: number) => {
        switch (side) {
            case Side.TOP:
                return (
                    <Svg style={{ position: "absolute", right: (index * 12), top: 0 }} width="12" height="8" viewBox="0 0 12 8">
                        <Path fill={theme.colors.surface} d="M4.45598 0.689027L1.2402 4.02548C0.894922 4.38371 0.447402 4.56262 0 4.56221V8L12 8V4.55975C11.5838 4.53718 11.1736 4.35909 10.852 4.02548L7.63624 0.68903C7.21037 0.247177 6.63994 0 6.04611 0C5.45228 0 4.88185 0.247177 4.45598 0.689027Z" />
                    </Svg>
                )
            case Side.BOTTOM:
                return (
                    <Svg style={{ position: "absolute", right: (index * 12), bottom: 0 }} width="12" height="8" viewBox="0 0 12 8">
                        <Path fill={theme.colors.surface} d="M7.54402 7.31097L10.7598 3.97452C11.1051 3.61629 11.5526 3.43738 12 3.43779L12 0L0 0L0 3.44025C0.416222 3.46282 0.826443 3.64091 1.14799 3.97452L4.36376 7.31097C4.78963 7.75282 5.36006 8 5.95389 8C6.54772 8 7.11815 7.75282 7.54402 7.31097Z" />
                    </Svg>
                )
            case Side.LEFT:
                return (
                    <Svg style={{ position: "absolute", top: (index * 12), left: 0 }} width="8" height="12" viewBox="0 0 8 12">
                        <Path fill={theme.colors.surface} d="M0.689027 7.54402L4.02548 10.7598C4.38371 11.1051 4.56262 11.5526 4.56221 12H8V0H4.55975C4.53718 0.416222 4.35909 0.826443 4.02548 1.14799L0.68903 4.36376C0.247177 4.78963 0 5.36006 0 5.95389C0 6.54772 0.247177 7.11815 0.689027 7.54402Z" />
                    </Svg>
                )
            case Side.RIGHT:
                return (
                    <Svg style={{ position: "absolute", top: (index * 12), right: 0 }} width="8" height="12" viewBox="0 0 8 12">
                        <Path fill={theme.colors.surface} d="M7.31097 4.45598L3.97452 1.2402C3.61629 0.894922 3.43738 0.447402 3.43779 0L0 0L0 12L3.44025 12C3.46282 11.5838 3.64091 11.1736 3.97452 10.852L7.31097 7.63624C7.75282 7.21037 8 6.63994 8 6.04611C8 5.45228 7.75282 4.88185 7.31097 4.45598Z" />
                    </Svg>
                )
        }
    }, [side, theme])

    const patterns = useMemo(() => {
        if (layout == null) return <></>
        let patternRack: ViewStyle = {
            position: 'absolute',
            overflow: "hidden"
        }
        switch (side) {
            case Side.TOP:
                patternRack = Object.assign(patternRack, {
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 8,
                    width: layout.width
                })
                break;
            case Side.BOTTOM:
                patternRack = Object.assign(patternRack, {
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 8,
                    width: layout.width
                })
                break;
            case Side.LEFT:
                patternRack = Object.assign(patternRack, {
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 8,
                    height: layout.height
                })
                break;
            case Side.RIGHT:
                patternRack = Object.assign(patternRack, {
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: 8,
                    height: layout.height
                })
                break;
        }
        const n = (side == Side.LEFT || side == Side.RIGHT) ? Math.floor(layout.height / 12) + 2 : Math.floor(layout.width / 12) + 2
        let elements = []
        for (let index = 0; index < n; index++) {
            elements.push(
                patternPathBySide(index)
            );
        }
        return (
            <View style={patternRack}>
                {elements}
            </View>
        )

    }, [layout, side, patternPathBySide])

    return (
        <Pressable onPress={onPress} style={[styles.wrapper, wrapperStyleBySide, theme.shadow, style]} onLayout={(e) => { setLayout(e.nativeEvent.layout) }}>
            {layout ? patterns : <></>}
            <View style={[styles.container, containerStyleBySide, { backgroundColor: theme.colors.surface }]}>
                {children}
            </View>
        </Pressable>
    )
}

export default TicketView

const styles = StyleSheet.create({
    wrapper: {
        margin: 8,
    },
    container: {
        flex: 1,
        overflow: "hidden"
    }
})