import { StyleSheet, ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from "../constants/Palette";
import Box from "./Box";
import { useTheme } from "@shopify/restyle";

type Props = {
    children: JSX.Element | JSX.Element[],
}

export const TopBar = ({ children }: Props) => {

    const theme = useTheme<Theme>();
    const insets = useSafeAreaInsets();
    const padding = {
        paddingTop: insets.top < theme.spacing.m ? theme.spacing.m : insets.top,
        paddingBottom: theme.spacing.m,
    } as ViewStyle

    return (
        <Box backgroundColor='surface' style={[styles.topBarWrapper, theme.shadow]}>
            <Box paddingHorizontal={{ phone: 'xs', tablet: "m", largeTablet: "l" }} style={[styles.topBarContainer, padding]}>
                {children}
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
    }
})