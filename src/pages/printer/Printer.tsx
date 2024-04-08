import EscPosPrinter from "react-native-esc-pos-printer";

import { ProductLine } from "../Printer"
import { DisplayOptions, PrintDocument, PrintDocumentLineContent, ProductPrintLine } from "./PrintType";
import { format } from "date-fns";

const MONEY_SYMBOL = "EUR"
const TICKET_WIDTH = 48;

const numberToMoney = (value: number) => {
    return `${value.toFixed(2)} ${MONEY_SYMBOL}`
}

const convertProductToPrintDocument = (productLines: ProductLine[]): PrintDocument => {
    let tmp: PrintDocument = {
        meta: {
            height: 80,
            width: 80,
        },
        header: {
            displayOptions: {
                fontSize: 16,
                bold: true,
                underline: true,
                italic: false,
            },
            alignment: "center",
            content: {
                type: "TEXT",
                value: "HEADER TEXT" // url for image,barcode,qrcode  text for text}
            },
        },
        footer: {
            displayOptions: {
                fontSize: 14,
                italic: true
            },
            alignment: "center",
            content: {
                type: "TEXT",
                value: "footer text" // url for image,barcode,qrcode  text for text}
            },
        },
        lines: []
    }
    let tmpLines: ProductPrintLine[] = [];
    productLines.forEach(productLine => {
        tmpLines.push({
            displayOptions: {},
            type: "SINGLE_ELEMENT_LINE",
            content: {
                value: productLine.label,
                type: "TEXT"
            },
            alignment: "left",
        })
        tmpLines.push({
            type: "SEPERATED_ELEMENT_LINE",
            left: {
                displayOptions: {},
                content: {
                    value: `${numberToMoney(productLine.priceInclTaxUnit).padStart(16, ' ')} ${"x " + productLine.quantity.toString().padStart(8, ' ')}`,
                    type: "TEXT"
                },
            },
            right: {
                displayOptions: {},
                content: {
                    value: `= ${numberToMoney(productLine.totalPriceInclTax).padEnd(8, ' ')}`,
                    type: "TEXT"
                },
            }
        })
        tmpLines.push({ type: "BREAK_LINE" })
    });
    tmp.lines = tmpLines;
    return tmp;
}

export const triggerPrint = async (productLines: ProductLine[]) => {

    let printData = convertProductToPrintDocument(productLines)

    //console.log(JSON.stringify(printData))

    const printing = new EscPosPrinter.printing();

    await printing.initialize().align("center").text(format(new Date(), "HH:mm")).newline()

    await printing.size(2, 2).align(printData.header.alignment).line(printData.header.content.value).newline(2).size(1, 1)

    await printing.textLine(48, { left: "", right: "", gapSymbol: '=' }).newline()
    await printing.align("left")

    for (let index = 0; index < printData.lines.length; index++) {
        const line = printData.lines[index];

        switch (line.type) {
            case "BREAK_LINE":
                printing.newline()
                break;
            case "SEPERATED_ELEMENT_LINE":
                if (line.left && line.left.content.value && line.right == undefined) {
                    await printing.align("left").line(line.left.content.value)
                }
                if (line.right && line.right.content.value && line.left == undefined) {
                    await printing.align("right").line(line.right.content.value)
                }
                if (line.right && line.right.content.value && line.left && line.left.content.value) {
                    await printing.textLine(48, {
                        right: line.right.content.value,
                        left: line.left.content.value,
                        gapSymbol: line.separator ? line.separator.content : " ",
                    }).newline()
                }
                break;
            case "SINGLE_ELEMENT_LINE":
                if (line.content && line.content.value) {
                    await printing.align(line.alignment).text(line.content.value).newline()
                }
                break;
            case "REPEATING_ELEMENT_LINE":
                break;
        }
    }

    await printing.newline().textLine(48, { left: "", right: "", gapSymbol: '=' }).newline().barcode({
        value: 'Test123',
        type: 'EPOS2_BARCODE_CODE93',
        hri: 'EPOS2_HRI_BELOW',
        width: 2,
        height: 50,
    }).newline().qrcode({
        value: 'Test123',
        width: 5,
        type: 'EPOS2_SYMBOL_QRCODE_MODEL_2',
        level: 'EPOS2_LEVEL_M',
    }).newline();
    await printing.size(1, 1).align(printData.header.alignment).line(printData.footer.content.value).newline().size(1, 1)

    await printing.cut().send();
}