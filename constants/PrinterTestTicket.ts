import EscPosPrinter from "react-native-esc-pos-printer";

import { ProductLine } from "../app/(app)/printer"
import { PrintDocument, PrintLinePrintInfos } from "./PrintType";
import { format } from "date-fns";
import { printBreakLine, printImageElementLine, printQrCodeElementLine, printRepeatingElementLine, printSeparatedElementLine, printSignleElementLine } from "./PrinterService";

const MONEY_SYMBOL = "€"
const name = 'Chez molly'
const place = 'Complexe de Loisirs Toulouse-Montaudran'
const address = '8 Imp. Louise Labé'
const address2 = '31400 Toulouse'
const tel = '05 61 20 20 70'
const web = "https://chezmolly.fr/";
const chezmolly = 'https://i.postimg.cc/3JcmF5NC/chezmolly.png'

const numberToMoney = (value: number) => {
    return `${value.toFixed(2)} ${MONEY_SYMBOL}`
}
const numberToPercent = (value: number) => {
    return `${(value * 100).toFixed(2)} %`
}

const payments = [
    {
        mean: "ESPECES",
        amount: 50
    }, {
        mean: "CB",
        amount: 1102
    }
]

const VATsCode = [{ value: .055, code: "A" }, { value: .1, code: "B" }, { value: .2, code: "C" }]

const convertProductsToPrintDocument = (productLines: ProductLine[]): PrintDocument => {
    let tmp: PrintDocument = {
        meta: {
            height: 80,
            width: 80,
        },
        header: {
            displayOptions: {
                fontSize: 1,
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
                fontSize: 1,
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
    let tmpLines: PrintLinePrintInfos[] = [];

    //HEADER
    tmpLines.push({
        type: "IMAGE",
        content: chezmolly,
        displayOptions: {
            alignment: "center",
            imgWidth: 300,
            marginTop: 1,
            marginBottom: 1
        },
    })
    tmpLines.push({
        type: "SINGLE_ELEMENT_LINE",
        content: place,
        displayOptions: { alignment: "center" }
    })
    tmpLines.push({
        type: "SINGLE_ELEMENT_LINE",
        content: address,
        displayOptions: { alignment: "center" }
    })
    tmpLines.push({
        type: "SINGLE_ELEMENT_LINE",
        content: address2,
        displayOptions: { alignment: "center" }
    })
    tmpLines.push({
        type: "SINGLE_ELEMENT_LINE",
        content: tel,
        displayOptions: { alignment: "center", marginBottom: 1 }
    })

    //LINES
    tmpLines.push({ type: "REPEATING_ELEMENT_LINE", content: "=" })
    productLines.forEach(productLine => {
        tmpLines.push({
            type: "SINGLE_ELEMENT_LINE",
            content: productLine.label,
            displayOptions: { alignment: "left" },
        })
        tmpLines.push({
            padding: { side: "left", size: 2 },
            type: "SEPERATED_ELEMENT_LINE",
            displayOptions: { alignment: "right" },
            left: {
                content: `${VATsCode.find(x => x.value == productLine.VAT).code}) ${numberToMoney(productLine.priceInclTaxUnit)} ${("x " + productLine.quantity.toString()).padStart(6, ' ')}`
            },
            right: {
                content: `${numberToMoney(productLine.totalPriceInclTax)}`
            },
        })
    });

    //VAT
    tmpLines.push({ type: "REPEATING_ELEMENT_LINE", content: "=" })
    const totalByVAT = Object.entries(
        productLines.reduce((acc, sellLine) => {
            const { VAT, totalTaxAmount, totalPriceExclTax } = sellLine;
            acc[VAT] = acc[VAT] || { rate: VAT, total: 0, totalTaxAmount: 0, totalPriceExclTax: 0 };
            acc[VAT].totalTaxAmount += totalTaxAmount;
            acc[VAT].totalPriceExclTax += totalPriceExclTax;
            return acc;
        }, {} as { [key: number]: { rate: number; total: number; totalTaxAmount: number; totalPriceExclTax: number } })
    ).map(([VAT, { rate, totalTaxAmount, totalPriceExclTax }]) => ({ rate, totalTaxAmount, totalPriceExclTax })).sort((a, b) => a.rate - b.rate);
    tmpLines.push({
        type: "SEPERATED_ELEMENT_LINE", displayOptions: { alignment: "right" },
        left: {
            content: `-${"VAT RATE".padStart(12, ' ')}`
        },
        right: {
            content: `${"MONTANT HT".padStart(13, ' ')}${"MONTANT TVA".padStart(13, ' ')}`,
        }
    })
    totalByVAT.map(vatLine => {
        tmpLines.push({
            type: "SEPERATED_ELEMENT_LINE", displayOptions: { alignment: "right" },
            left: { content: `${VATsCode.find(x => x.value == vatLine.rate).code}) ${numberToPercent(vatLine.rate).padStart(10, ' ')}` },
            right: { content: `${numberToMoney(vatLine.totalPriceExclTax).padStart(13, ' ')}${numberToMoney(vatLine.totalTaxAmount).padStart(13, ' ')}` },
        })
    })
    tmpLines.push({
        type: "SEPERATED_ELEMENT_LINE",
        left: { content: `${"ABC)".padEnd(16, ' ')}` },
        right: { content: `${numberToMoney(totalByVAT.reduce(((acc, c) => acc + c.totalPriceExclTax), 0)).padStart(13, ' ')}${numberToMoney(totalByVAT.reduce(((acc, c) => acc + c.totalTaxAmount), 0)).padStart(13, ' ')}` },
        displayOptions: {
            bold: true,
            alignment: "right",
        }
    })
    tmpLines.push({ type: "REPEATING_ELEMENT_LINE", content: "-" })

    //TOTAL
    tmpLines.push({
        type: "SEPERATED_ELEMENT_LINE",
        left: {
            content: `TOTAL TTC :`,
        },
        right: {
            content: `${numberToMoney(productLines.reduce(((acc, c) => acc + c.totalPriceInclTax), 0))}`,

        },
        displayOptions: { fontSize: 1, bold: true, alignment: "center" },
        separator: { content: " " }
    })
    tmpLines.push({ type: "REPEATING_ELEMENT_LINE", content: "-" })
    //PAYMENTS
    payments.map(payment => {
        tmpLines.push({
            type: "SEPERATED_ELEMENT_LINE",
            left: {
                content: `${payment.mean} :`,
            },
            right: {
                content: `${numberToMoney(payment.amount)}`,
            },
            separator: { content: " " }
        })
    })
    tmpLines.push({ type: "REPEATING_ELEMENT_LINE", content: "=" })
    tmpLines.push({ type: "QR_CODE", value: web, displayOptions: { marginTop: 1, marginBottom: 1, alignment: "center", imgWidth: 8, type: 'EPOS2_SYMBOL_QRCODE_MODEL_2', level: 'EPOS2_LEVEL_H' } })
    tmpLines.push({
        type: "SINGLE_ELEMENT_LINE",
        content: web,
        displayOptions: { alignment: "center" }
    })
    tmpLines.push({
        type: "SINGLE_ELEMENT_LINE",
        content: format(new Date(), "dd/MM/yyyy HH:mm"),
        displayOptions: { alignment: "center" }
    })
    tmpLines.push({
        type: "SINGLE_ELEMENT_LINE",
        content: "ticket #13643, impression #1",
        displayOptions: { alignment: "center", marginBottom: 1 }
    })

    tmp.lines = tmpLines;
    return tmp;
}

export const printerTestTicket = async (productLines: ProductLine[], printerCharsPerLine) => {

    let printData = convertProductsToPrintDocument(productLines)

    const printing = new EscPosPrinter.printing();
    printing.initialize()

    for (let index = 0; index < printData.lines.length; index++) {
        const line = printData.lines[index];

        switch (line.type) {
            case "BREAK_LINE":
                printBreakLine({ printing: printing })
                break;
            case "SEPERATED_ELEMENT_LINE":
                printSeparatedElementLine({ printing: printing, line, printerCharsPerLine })
                break;
            case "SINGLE_ELEMENT_LINE":
                printSignleElementLine({ printing: printing, line, printerCharsPerLine })
                break;
            case "REPEATING_ELEMENT_LINE":
                printRepeatingElementLine({ printing: printing, line, printerCharsPerLine })
                break;
            case "QR_CODE":
                printQrCodeElementLine({ printing: printing, line, printerCharsPerLine })
                break;
            case "IMAGE":
                printImageElementLine({ printing: printing, line, printerCharsPerLine })
        }
    }

    printBreakLine({ printing })
    printing.cut().send();
}