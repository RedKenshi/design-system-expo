import { LayoutRectangle, StyleSheet, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from "../constants/Palette";
import Box from "./Box";
import { useTheme } from "@shopify/restyle";
import { Path, Svg } from "react-native-svg";
import { useMemo, useState } from "react";

type Props = {
    children: JSX.Element | JSX.Element[],
}

export const TicketTopBar = ({ children }: Props) => {

    const theme = useTheme<Theme>();
    const [layout, setLayout] = useState<LayoutRectangle | null>(null)
    const insets = useSafeAreaInsets();
    const padding = {
        paddingTop: insets.top < theme.spacing.m ? theme.spacing.m : insets.top,
        paddingBottom: theme.spacing.xs,
    } as ViewStyle

    const patterns = useMemo(() => {
        if (layout == null) return <></>
        const n = Math.floor(layout.width / 12) + 2
        let elements = []
        for (let index = 0; index < n; index++) {
            elements.push(
                <Svg style={{ position: "absolute", right: (index * 12), bottom: 0 }} width="12" height="8" viewBox="0 0 12 8">
                    <Path fill={theme.colors.surface} d="M7.54402 7.31097L10.7598 3.97452C11.1051 3.61629 11.5526 3.43738 12 3.43779L12 0L0 0L0 3.44025C0.416222 3.46282 0.826443 3.64091 1.14799 3.97452L4.36376 7.31097C4.78963 7.75282 5.36006 8 5.95389 8C6.54772 8 7.11815 7.75282 7.54402 7.31097Z" />
                </Svg>
            );
        }
        return (
            <View style={{
                position: 'absolute',
                bottom: -8,
                left: 0,
                right: 0
            }}>
                {elements}
            </View>
        )

    }, [layout, theme])

    return (
        <>
            <Box onLayout={(e) => setLayout(e.nativeEvent.layout)} backgroundColor='surface' style={[styles.topBarWrapper, theme.shadow]}>
                <Box paddingTop={{ phone: 'xs', tablet: "m", largeTablet: "l" }} style={[styles.topBarContainer, padding]}>
                    {children}
                </Box>
                {patterns}
            </Box>
        </>
    )
}

export default TicketTopBar;

const styles = StyleSheet.create({
    topBarWrapper: {
        zIndex: 1000,
        display: "flex",
        flexDirection: "row",
        position: 'relative',
        marginBottom: 8,
    },
    topBarContainer: {
        width: "100%"
    }
})