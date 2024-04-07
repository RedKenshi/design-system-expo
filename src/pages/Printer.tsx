import { Alert, FlatList, View, ViewStyle } from "react-native"
import { Side } from "../components/TicketView"
import { Ticket } from "../components/Ticket"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from "../Palette"
import Header from "../components/Header"

import Box from "../components/Box"
import PageBlock from "../components/PageBlock"
import { useTheme } from "@shopify/restyle"
import Panel from "../components/Panel";
import { useState } from "react";
import CustomTextField from "../components/inputs/CustomTextField";
import Button from "../components/Button";
import { IconSVGCode } from "../IconSVG";
import axios from "axios";

type Props = {}

export const Printer = ({ }: Props) => {

    const theme = useTheme<Theme>();

    const insets = useSafeAreaInsets();
    const padding = {
        paddingLeft: insets.left + theme.spacing.m,
        paddingRight: insets.right + theme.spacing.m,
    } as ViewStyle

    const [ipPrinter, setIpPrinter] = useState<string>('192.168.1.69')

    const [discovering, setDiscovering] = useState(false);


    const triggerPrint = () => {

    }

    return (
        <>
            <PageBlock style={{ display: "flex", alignSelf: "stretch", justifyContent: "flex-start", alignItems: "flex-start", flexDirection: 'row', height: "100%" }} >
                <Box marginHorizontal={{ tablet: 'l' }} alignItems="flex-start" style={[padding, { width: "100%", paddingBottom: "50%" }]} >
                    <Panel style={{ display: 'flex', flexDirection: "column", gap: theme.spacing.m, width: '100%' }}>
                        <CustomTextField value={ipPrinter} handleChange={setIpPrinter} />
                        <Button title="PRINT" icon={IconSVGCode.printer} onPress={triggerPrint} />
                    </Panel>
                </Box>
                <FlatList data={[]} renderItem={({ item, index }) => {
                    console.log(item)
                    return (<></>)
                }}></FlatList>
            </PageBlock>
        </>
    )
}

export default Printer;