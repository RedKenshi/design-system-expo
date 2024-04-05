import { Text, ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONTS, Theme } from "../Palette"
import Header from "../components/Header"
import Legend from "../components/Legend"
import Panel from "../components/Panel"
import BorderedBlock from "../components/BorderedBlock"
import CustomText from "../components/CustomText"

import Box from "../components/Box"
import PageBlock from "../components/PageBlock"
import { useTheme } from "@shopify/restyle"

type Props = {}

export const Typos = ({ }: Props) => {

    const theme = useTheme<Theme>();

    const insets = useSafeAreaInsets();
    const padding = {
        paddingLeft: insets.left + theme.spacing.m,
        paddingRight: insets.right + theme.spacing.m,
    } as ViewStyle

    return (
        <>
            <PageBlock style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: 'row' }} >
                <Box marginHorizontal={{ tablet: 'l' }} justifyContent="space-evenly" style={[padding, { maxWidth: "100%", paddingBottom: "50%" }]} >

                    <Header style={{ marginHorizontal: theme.spacing.l }} size={3}>Bordered block examples</Header>
                    <Panel style={{ display: 'flex', flexDirection: "column", gap: theme.spacing.m }}>
                        <CustomText style={{ textAlign: "justify", fontFamily: FONTS.A400 }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam quidem consequuntur molestiae a perspiciatis totam assumenda perferendis unde. Dolor tempora labore tenetur suscipit cupiditate iure voluptate unde sapiente? Iusto, quasi!</CustomText>
                        <BorderedBlock side={'left'}>
                            <CustomText style={{ textAlign: "justify", fontFamily: FONTS.A400 }}>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam quidem consequuntur molestiae a perspiciatis totam assumenda perferendis unde. Dolor tempora labore tenetur suscipit cupiditate iure voluptate unde sapiente? Iusto, quasi!
                                {/*<Tooltip text="HEY HI HEY HO, ON RENTRE DU BOULOT" />*/}
                            </CustomText>
                        </BorderedBlock>
                        <Legend>The previous block is bordered on the left, the next on the right </Legend>
                        <BorderedBlock side={'right'}>
                            <CustomText style={{ textAlign: "justify", fontFamily: FONTS.A400 }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam quidem consequuntur molestiae a perspiciatis totam assumenda perferendis unde. Dolor tempora labore tenetur suscipit cupiditate iure voluptate unde sapiente? Iusto, quasi!</CustomText>
                        </BorderedBlock>
                    </Panel>

                    <Header style={{ marginHorizontal: theme.spacing.l }} size={3}>Primary headers examples</Header>
                    <Panel style={{ alignSelf: "stretch", display: 'flex', flexDirection: "column", gap: theme.spacing.m }}>
                        <Header style={{ marginTop: theme.spacing.xs }} size={1}>A BIG ASS HEADER</Header>
                        <Header style={{ marginTop: theme.spacing.xs }} size={2}>NOT THE BIGGEST BUT STILL</Header>
                        <Header style={{ marginTop: theme.spacing.xs }} size={3}>AVERAGE MY DUDE</Header>
                        <Header style={{ marginTop: theme.spacing.xs }} size={4}>A BIT LITTLE FOR A HEADER</Header>
                        <Header style={{ marginTop: theme.spacing.xs }} size={5}>SIZE DOESN'T MATTER IT'S OK</Header>
                        <Legend>Here are some primary title</Legend>
                    </Panel>

                    <Header style={{ marginHorizontal: theme.spacing.l }} size={3}>Neutral headers examples</Header>
                    <Panel style={{ alignSelf: "stretch", display: 'flex', flexDirection: "column", gap: theme.spacing.m }}>
                        <Header style={{ marginTop: theme.spacing.xs }} size={1} variant="onSurface">A BIG ASS HEADER</Header>
                        <Header style={{ marginTop: theme.spacing.xs }} size={2} variant="onSurface">NOT THE BIGGEST BUT STILL</Header>
                        <Header style={{ marginTop: theme.spacing.xs }} size={3} variant="onSurface">AVERAGE MY DUDE</Header>
                        <Header style={{ marginTop: theme.spacing.xs }} size={4} variant="onSurface">A BIT LITTLE FOR A HEADER</Header>
                        <Header style={{ marginTop: theme.spacing.xs }} size={5} variant="onSurface">SIZE DOESN'T MATTER IT'S OK</Header>
                        <Legend>Here are some neutral color title</Legend>
                    </Panel>

                    <Header style={{ marginHorizontal: theme.spacing.l }} size={3}>Normal fonts</Header>
                    <Panel style={{ alignSelf: "stretch", display: 'flex', flexDirection: "column", gap: theme.spacing.m }}>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Thin' }}>Axiforma Thin</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Light' }}>Axiforma Light</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Book' }}>Axiforma Book</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma' }}>Axiforma</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Medium' }}>Axiforma Medium</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-SemiBold' }}>Axiforma SemiBold</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Bold' }}>Axiforma Bold</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-ExtraBold' }}>Axiforma ExtraBold</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Black' }}>Axiforma Black</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Heavy' }}>Axiforma Heavy</Text>
                        <Legend>Here are the normal font family from 100 to 950</Legend>
                    </Panel>

                    <Header style={{ marginHorizontal: theme.spacing.l }} size={3}>Italic fonts</Header>
                    <Panel style={{ alignSelf: "stretch", display: 'flex', flexDirection: "column", gap: theme.spacing.m }}>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Thin-Italic' }}>Axiforma Thin Italic</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Light-Italic' }}>Axiforma Light Italic</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Book-Italic' }}>Axiforma Book Italic</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Italic' }}>Axiforma Italic</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Medium-Italic' }}>Axiforma Medium Italic</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-SemiBold-Italic' }}>Axiforma SemiBold Italic</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Bold-Italic' }}>Axiforma Bold Italic</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-ExtraBold-Italic' }}>Axiforma ExtraBold Italic</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Black-Italic' }}>Axiforma Black Italic</Text>
                        <Text style={{ color: theme.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Heavy-Italic' }}>Axiforma Heavy Italic</Text>
                        <Legend>Here are the italic version font family from 100 to 950</Legend>
                    </Panel>

                </Box>
            </PageBlock>
        </>
    )
}

export default Typos;