export interface DisplayOptions {
    fontSize?: number;
    bold?: boolean;
    underline?: boolean;
    italic?: boolean;
    color?: string;
    backgroundColor?: string;
    padding?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
    margin?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
}

export interface PrintDocumentLineContent {
    type: "TEXT" | "IMAGE" | "BARCODE" | "QR_CODE";
    value: string; // url for image,barcode,qrcode  text for text
}

export type SeparatedElementLine = {
    type: "SEPERATED_ELEMENT_LINE";
    left?: {
        displayOptions: DisplayOptions;
        content: PrintDocumentLineContent;
    };
    separator?: {
        displayOptions: DisplayOptions;
        content: string;
    };
    right?: {
        displayOptions: DisplayOptions;
        content: PrintDocumentLineContent;
    };
}
export type BreakLine = {
    type: "BREAK_LINE"
}
export type SingleElementLine = {
    type: "SINGLE_ELEMENT_LINE";
    displayOptions: DisplayOptions;
    content: PrintDocumentLineContent;
    alignment: "center" | "left" | "right";
}
export type RepeatingElementLine = {
    type: "REPEATING_ELEMENT_LINE"
    content: PrintDocumentLineContent;
    displayOptions: DisplayOptions;
}

export type ProductPrintLine = SeparatedElementLine | SingleElementLine | RepeatingElementLine | BreakLine

export interface PrintDocument {
    meta: {
        height: number;
        width: number;
    };
    header: {
        displayOptions: DisplayOptions;
        alignment: "center" | "left" | "right";
        content: PrintDocumentLineContent;
    };
    footer: {
        displayOptions: DisplayOptions;
        alignment: "center" | "left" | "right";
        content: PrintDocumentLineContent;
    };
    lines: ProductPrintLine[];
}