import { ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from "../constants/Palette"

import Box from "../components/Box"
import PageBlock from "../components/PageBlock"
import { useTheme } from "@shopify/restyle"
import { Link } from "expo-router";
import Pill from "../components/Pill";

type Props = {}

export const Buttons = ({ }: Props) => {

    const theme = useTheme<Theme>();
    const insets = useSafeAreaInsets();

    const padding = {
        paddingLeft: insets.left + theme.spacing.m,
        paddingRight: insets.right + theme.spacing.m,
    } as ViewStyle

    return (
        <>
            <PageBlock style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: 'row', marginTop: 400 }} >
                <Box marginHorizontal={{ tablet: 'l' }} justifyContent="space-evenly" style={[padding, { maxWidth: "100%", paddingBottom: "50%" }]} >
                    <Link push href="/_sitemap">
                        <Pill title={"MAP"} variant='info' />
                    </Link>
                </Box>
            </PageBlock>
        </>
    )
}

export default Buttons;