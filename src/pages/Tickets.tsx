import { ViewStyle } from "react-native"
import { Side } from "../components/TicketView"
import { Ticket } from "../components/Ticket"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from "../Palette"
import Header from "../components/Header"

import Box from "../components/Box"
import PageBlock from "../components/PageBlock"
import { useTheme } from "@shopify/restyle"

type Props = {}

export const Tickets = ({ }: Props) => {

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

                    <Header style={{ marginHorizontal: theme.spacing.l }} size={3}> Differents ripped ticket examples</Header>
                    <Ticket side={Side.LEFT} />
                    <Ticket side={Side.RIGHT} />
                    <Ticket side={Side.TOP} />
                    <Ticket side={Side.BOTTOM} />
                </Box>
            </PageBlock>
        </>
    )
}

export default Tickets;