import { QRCodeLevel, QRCodeType } from "react-native-esc-pos-printer/lib/typescript/src/types";

/*export type QRCodeLevel =
| 'EPOS2_LEVEL_L'
| 'EPOS2_LEVEL_M'
| 'EPOS2_LEVEL_Q'
| 'EPOS2_LEVEL_H';

export type QRCodeType =
| 'EPOS2_SYMBOL_QRCODE_MODEL_1'
| 'EPOS2_SYMBOL_QRCODE_MODEL_2'
| 'EPOS2_SYMBOL_QRCODE_MICRO';
*/

export interface LineDisplayOptions {
    alignment: "center" | "left" | "right";
    marginTop?: number;
    marginBottom?: number;
}
export interface TextDisplayOptions {
    fontSize?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    bold?: boolean;
    underline?: boolean;
    italic?: boolean;
    color?: string;
    backgroundColor?: string;
}
export interface ImageDisplayOptions {
    imgWidth: number
}
export interface QrCodeDisplayOptions {
    imgWidth: number
    type: QRCodeType,
    level: QRCodeLevel,
}

export type BreakLine = {
    type: "BREAK_LINE"
}
export type SeparatedElementLinePrintInfos = {
    width?: number,
    padding?: {
        side: "left" | "right"
        size: number
    }
    type: "SEPERATED_ELEMENT_LINE";
    displayOptions?: LineDisplayOptions & TextDisplayOptions;
    left?: {
        content: string;
    };
    separator?: {
        content: string;
    };
    right?: {
        content: string;
    };
}
export type QrCodeLinePrintInfos = {
    type: "QR_CODE"
    displayOptions?: LineDisplayOptions & QrCodeDisplayOptions;
    value: string
}
export type SingleElementLinePrintInfos = {
    type: "SINGLE_ELEMENT_LINE";
    displayOptions?: LineDisplayOptions & TextDisplayOptions;
    content: string;
}
export type RepeatingElementLinePrintInfos = {
    type: "REPEATING_ELEMENT_LINE"
    content: string;
    displayOptions?: LineDisplayOptions & TextDisplayOptions;
}

export type ImageLinePrintInfos = {
    type: "IMAGE"
    content: string;
    displayOptions: LineDisplayOptions & ImageDisplayOptions;
}

export type PrintLinePrintInfos = SeparatedElementLinePrintInfos | SingleElementLinePrintInfos | RepeatingElementLinePrintInfos | BreakLine | QrCodeLinePrintInfos | ImageLinePrintInfos

export interface PrintDocument {
    lines: PrintLinePrintInfos[];
}