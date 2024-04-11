import { FlatList, TouchableOpacity, ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from "../../../constants/Palette"

import Box from "../../../components/Box"
import PageBlock from "../../../components/PageBlock"
import { useTheme } from "@shopify/restyle"
import Panel from "../../../components/Panel";
import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { IconSVGCode } from "../../../components/IconSVG";
import EscPosPrinter, { getPrinterSeriesByName, usePrintersDiscovery, } from "react-native-esc-pos-printer";
import { PrinterSeriesName } from "react-native-esc-pos-printer/lib/typescript/src/types";
import { printerTestTicket } from "../../../constants/PrinterTestTicket";

import productLines from "../../../constants/fakeData.json";
import Legend from "../../../components/Legend";
import CustomText from "../../../components/CustomText";

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

    const [printer, setPrinter] = useState<{ ip: string, name: string, target: string } | null>(null)
    const [printing, setPrinting] = useState(false);
    const [printerCharsPerLine, setPrinterCharsPerLine] = useState<number | null>(null);
    const [init, setInit] = useState(false);

    const printSimpleReceipt = async () => {
        try {
            setPrinting(true);
            await printerTestTicket(productLines, printerCharsPerLine);
        } catch (e) {
            console.log(`PRINTER PRINT ERROR : ${e.message}`);
        } finally {
            setPrinting(false);
        }
    };

    const initPrinter = async () => {
        if (!init) {
            try {
                await EscPosPrinter.init({
                    target: printer.target,
                    seriesName: getPrinterSeriesByName(printer.name) as PrinterSeriesName,
                    language: 'EPOS2_LANG_EN',
                });

            } catch (error) {
                console.log(error)
            }
            EscPosPrinter.getPrinterCharsPerLine(getPrinterSeriesByName(printer.name))
                .then((result) => setPrinterCharsPerLine(result.fontA))
                .catch((e) => console.log(`PRINTER INIT ERROR : ${e.message}`));

            setInit(true);
        }
    }

    useEffect(() => {
        if (!init && printer && printer.name && printer.target) {
            initPrinter()
        }
    }, [printer, init])

    return (
        <>
            <PageBlock style={{ display: "flex", alignSelf: "stretch", justifyContent: "flex-start", alignItems: "flex-start", flexDirection: 'column', height: "100%" }} >
                <Box marginHorizontal={{ tablet: 'l' }} alignItems="flex-start" style={[padding, { width: "100%", paddingBottom: "25%" }]} >
                    <Panel style={{ display: 'flex', flexDirection: "column", gap: theme.spacing.m, width: '100%' }}>
                        <CustomText>Selected printer : {printer ? `${printer.name}` : "none"}</CustomText>
                        {printer && <Legend>`address : ${printer.ip}` </Legend>}
                        <Button loading={isDiscovering} title="Search" icon={IconSVGCode.search} onPress={start} />
                        <Button disabled={!printer || !printer.ip || !printer.target} loading={printing} title="PRINT" icon={IconSVGCode.printer} onPress={printSimpleReceipt} />
                    </Panel>
                    <FlatList data={printers.filter(p => p.deviceType == "TYPE_PRINTER")} style={{ flex: 1, width: "100%" }} renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => { setInit(false); setPrinter({ ip: item.ipAddress, name: item.deviceName, target: item.target }) }}>
                                <Panel style={{ flexDirection: "column" }}>
                                    <CustomText>{item.deviceName}</CustomText>
                                    <Legend>{item.ipAddress}</Legend>
                                    <Legend>{item.macAddress}</Legend>
                                </Panel>
                            </TouchableOpacity>
                        )
                    }} />
                </Box>
            </PageBlock>
        </>
    )
}

export default Printer;