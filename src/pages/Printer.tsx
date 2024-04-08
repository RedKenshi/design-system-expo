import { FlatList, ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from "../Palette"

import Box from "../components/Box"
import PageBlock from "../components/PageBlock"
import { useTheme } from "@shopify/restyle"
import Panel from "../components/Panel";
import { useState } from "react";
import CustomTextField from "../components/inputs/CustomTextField";
import Button from "../components/Button";
import { IconSVGCode } from "../IconSVG";
import EscPosPrinter, { usePrintersDiscovery, } from "react-native-esc-pos-printer";
import { PrinterSeriesName } from "react-native-esc-pos-printer/lib/typescript/src/types";
import { triggerPrint } from "./printer/Printer";

import productLines from "./printer/fakeData.json"

export type ProductLine = typeof productLines[0]
type Props = {}

export const Printer = ({ }: Props) => {

    const theme = useTheme<Theme>();

    const insets = useSafeAreaInsets();
    const padding = {
        paddingLeft: insets.left + theme.spacing.m,
        paddingRight: insets.right + theme.spacing.m,
    } as ViewStyle

    const [ipPrinter, setIpPrinter] = useState<string>('192.168.1.218')
    const [printing, setPrinting] = useState(false);
    const [init, setInit] = useState(false);

    const printSimpleReceipt = async () => {

        const printerTmp = {
            target: `TCP:${ipPrinter}`,
            seriesName: "EPOS2_TM_M30II" as PrinterSeriesName,
            language: 'EPOS2_LANG_EN',
        }

        if (!init) {
            await EscPosPrinter.init({
                target: printerTmp.target,
                seriesName: printerTmp.seriesName,
                language: 'EPOS2_LANG_EN',
            });
            setInit(true);
        }
        try {
            setPrinting(true);
            await triggerPrint(productLines);
        } catch (e) {
            console.log('Print error', e);
        } finally {
            setPrinting(false);
        }
    };

    return (
        <>
            <PageBlock style={{ display: "flex", alignSelf: "stretch", justifyContent: "flex-start", alignItems: "flex-start", flexDirection: 'row', height: "100%" }} >
                <Box marginHorizontal={{ tablet: 'l' }} alignItems="flex-start" style={[padding, { width: "100%", paddingBottom: "25%" }]} >
                    <Panel style={{ display: 'flex', flexDirection: "column", gap: theme.spacing.m, width: '100%' }}>
                        <CustomTextField value={ipPrinter} handleChange={setIpPrinter} />
                        <Button loading={printing} title="PRINT" icon={IconSVGCode.printer} onPress={printSimpleReceipt} />
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