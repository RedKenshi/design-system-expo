import { FlatList, Text, ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from "../Palette"

import Box from "../components/Box"
import PageBlock from "../components/PageBlock"
import { useTheme } from "@shopify/restyle"
import Panel from "../components/Panel";
import { useEffect, useState } from "react";
import CustomTextField from "../components/inputs/CustomTextField";
import Button from "../components/Button";
import { IconSVGCode } from "../IconSVG";
import EscPosPrinter, { DiscoveryFilterOption, getPrinterSeriesByName, PrintersDiscovery, usePrintersDiscovery } from "react-native-esc-pos-printer";
import { PrinterSeriesName } from "react-native-esc-pos-printer/lib/typescript/src/types";
import { triggerPrint } from "./printer/Printer";

import productLines from "./printer/fakeData.json"
import Legend from "../components/Legend";
import CustomText from "../components/CustomText";

export type ProductLine = typeof productLines[0]
type Props = {}

export const Printer = ({ }: Props) => {

    const theme = useTheme<Theme>();

    const { start, printerError, isDiscovering, printers } = usePrintersDiscovery();

    const insets = useSafeAreaInsets();
    const padding = {
        paddingLeft: insets.left + theme.spacing.m,
        paddingRight: insets.right + theme.spacing.m,
    } as ViewStyle

    const [ipPrinter, setIpPrinter] = useState<string>('192.168.1.218')
    const [printing, setPrinting] = useState(false);
    const [printerCharsPerLine, setPrinterCharsPerLine] = useState<number | null>(null);
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
            await triggerPrint(productLines, printerCharsPerLine);
        } catch (e) {
            console.log('Print error', e);
        } finally {
            setPrinting(false);
        }
    };

    const startPrint = async () => {
        const printerTmp = {
            target: `TCP:${ipPrinter}`,
            seriesName: "EPOS2_TM_M30II" as PrinterSeriesName,
            language: 'EPOS2_LANG_EN',
        }
        await EscPosPrinter.init({
            target: printerTmp.target,
            seriesName: printerTmp.seriesName,
            language: 'EPOS2_LANG_EN',
        });
        setInit(true);
    }

    useEffect(() => {
        startPrint()
    }, [])

    useEffect(() => {
        if (init) {
            EscPosPrinter.getPrinterCharsPerLine(getPrinterSeriesByName("EPOS2_TM_M30"))
                .then((result) => setPrinterCharsPerLine(result.fontA))
                .catch((e) => console.log('error:', e.message));
        }
    }, [init])

    return (
        <>
            <PageBlock style={{ display: "flex", alignSelf: "stretch", justifyContent: "flex-start", alignItems: "flex-start", flexDirection: 'column', height: "100%" }} >
                <Box marginHorizontal={{ tablet: 'l' }} alignItems="flex-start" style={[padding, { width: "100%", paddingBottom: "25%" }]} >
                    <Panel style={{ display: 'flex', flexDirection: "column", gap: theme.spacing.m, width: '100%' }}>
                        <CustomTextField value={ipPrinter} handleChange={setIpPrinter} />
                        <Button loading={printing} title="PRINT" icon={IconSVGCode.printer} onPress={printSimpleReceipt} />
                        <Button loading={isDiscovering} title="Search" icon={IconSVGCode.search} onPress={start} />
                    </Panel>
                    <FlatList data={printers.filter(p => p.deviceType == "TYPE_PRINTER")} style={{ flex: 1, width: "100%" }} renderItem={({ item, index }) => {
                        console.log(index)
                        console.log({ item })
                        return (
                            <Panel style={{ flexDirection: "column" }}>
                                <CustomText>{item.deviceName}</CustomText>
                                <Legend>{item.ipAddress}</Legend>
                                <Legend>{item.macAddress}</Legend>
                            </Panel>
                        )
                    }} />
                </Box>
            </PageBlock>
        </>
    )
}

export default Printer;