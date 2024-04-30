import { ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from "../constants/Palette"

import Box from "../components/Box"
import PageBlock from "../components/PageBlock"
import { useTheme } from "@shopify/restyle"
import { router } from "expo-router";
import Button from "../components/Button";

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
            <PageBlock style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: 'row' }} >
                <Box marginHorizontal={{ tablet: 'l' }} justifyContent="space-evenly" style={[padding, { maxWidth: "100%", paddingBottom: "50%", marginTop: 250 }]} >
                    <Button onPress={() => router.navigate('/_sitemap')} title={"MAP"} variant='info' />
                    <Button onPress={() => router.navigate('/blueprint')} title={"BLUEPRINT"} variant='info' />
                </Box>
            </PageBlock>
        </>
    )
}

export default Buttons;