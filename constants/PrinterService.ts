import Printing from "react-native-esc-pos-printer/lib/typescript/src/printing"
import { ImageLinePrintInfos, RepeatingElementLinePrintInfos, SeparatedElementLinePrintInfos, SingleElementLinePrintInfos, QrCodeLinePrintInfos } from "./PrintType"

const ALINEA_SIZE = 2

export const printBreakLine = ({ printing, number }: { printing: Printing, number?: number }) => {
    if (number) {
        printing.newline(number)
    }
}
export const printSeparatedElementLine = ({ printing, line, printerCharsPerLine }: { printing: Printing, line: SeparatedElementLinePrintInfos, printerCharsPerLine: number }) => {
    printBreakLine({ printing, number: line.displayOptions?.marginTop })
    let computedWidth = line.width ?? printerCharsPerLine
    if (line.left && line.left.content && line.right == undefined) {
        printing.bold(line.displayOptions?.bold ? true : false).size(line.displayOptions?.fontSize ?? 1, line.displayOptions?.fontSize ?? 1).align("left").line(line.left.content)
    }
    if (line.right && line.right.content && line.left == undefined) {
        printing.bold(line.displayOptions?.bold ? true : false).size(line.displayOptions?.fontSize ?? 1, line.displayOptions?.fontSize ?? 1).align("right").line(line.right.content)
    }
    if (line.right && line.right.content && line.left && line.left.content) {
        if (line.displayOptions && line.displayOptions.bold) {
            printing.bold(true)
        }
        if (line.padding && line.padding.size > 0) {
            computedWidth = computedWidth - line.padding.size * ALINEA_SIZE
            if (line.padding.side == "left") {
                printing.align("right")
            } else {
                printing.align("left")
            }
        }
        printing.size(line.displayOptions?.fontSize ?? 1).textLine(computedWidth, {
            right: line.right.content,
            left: line.left.content,
            gapSymbol: line.separator ? line.separator.content : " ",
        }).newline()
    }
    printBreakLine({ printing, number: line.displayOptions?.marginBottom })
}
export const printSignleElementLine = ({ printing, line, printerCharsPerLine }: { printing: Printing, line: SingleElementLinePrintInfos, printerCharsPerLine: number }) => {
    printBreakLine({ printing, number: line.displayOptions?.marginTop })
    if (line.content && line.content) {
        printing.bold(line.displayOptions?.bold ? true : false).size(line.displayOptions?.fontSize ?? 1).align(line.displayOptions.alignment).text(line.content).newline()
    }
    printBreakLine({ printing, number: line.displayOptions?.marginBottom })
}
export const printRepeatingElementLine = ({ printing, line, printerCharsPerLine }: { printing: Printing, line: RepeatingElementLinePrintInfos, printerCharsPerLine: number }) => {
    printBreakLine({ printing, number: line.displayOptions?.marginTop })
    printing.bold(line.displayOptions?.bold ? true : false).size(line.displayOptions?.fontSize ?? 1).textLine(48, {
        right: "",
        left: "",
        gapSymbol: line.content,
    }).newline()
    printBreakLine({ printing, number: line.displayOptions?.marginBottom })
}
export const printQrCodeElementLine = ({ printing, line, printerCharsPerLine }: { printing: Printing, line: QrCodeLinePrintInfos, printerCharsPerLine: number }) => {
    printBreakLine({ printing, number: line.displayOptions?.marginTop })
    printing.align(line.displayOptions.alignment).qrcode({
        value: line.value,
        width: 8,
        type: line.displayOptions.type ?? 'EPOS2_SYMBOL_QRCODE_MODEL_2',
        level: line.displayOptions.level ?? 'EPOS2_LEVEL_H',
    })
    printBreakLine({ printing, number: line.displayOptions?.marginBottom })
}
export const printImageElementLine = ({ printing, line, printerCharsPerLine }: { printing: Printing, line: ImageLinePrintInfos, printerCharsPerLine: number }) => {
    printBreakLine({ printing, number: line.displayOptions?.marginTop })
    printing.align(line.displayOptions.alignment ?? 'center').image(
        {
            uri: line.content
        },
        { width: 300 }
    )
    printBreakLine({ printing, number: line.displayOptions?.marginBottom })
}