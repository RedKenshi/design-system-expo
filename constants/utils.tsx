import chroma from "chroma-js"

export const tabColors = ["#e74c33", "#3498db", "#9b59b6", "#1abc9c", "#e67e22", "#74b9ff", "#9980FA", "#f39c12", "#273c75", "#05c46b"]

export const isCloseEnough = (string: string, filter: string) => {

    const accentMap = {
        'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
        'Ç': 'C', 'ç': 'c',
        'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
        'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
        'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
        'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
        'Ý': 'Y', 'ý': 'y', 'ÿ': 'y'
    };

    return string.toLowerCase().replaceAll(" ", "").replace(/[ÀÁÂÃÄÅàáâãäåÇçÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖòóôõöÙÚÛÜùúûüÝýÿ]/g, (match) => {
        return accentMap[match];
    }).includes(filter.toLowerCase().replaceAll(" ", "").replace(/[ÀÁÂÃÄÅàáâãäåÇçÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖòóôõöÙÚÛÜùúûüÝýÿ]/g, (match) => {
        return accentMap[match];
    }))
};
const MONEY_SYMBOL = "€"
export const numberToMoney = (value: number) => {
    return `${value.toFixed(2)} ${MONEY_SYMBOL}`
}
export const numberToPercent = (value: number) => {
    return `${(value * 100).toFixed(2)} %`
}

export const isInside = ({ draggableX, draggableY, droppableX, droppableY, droppableW, droppableH }) => {
    if (draggableX >= droppableX && draggableX <= (droppableX + droppableW) && draggableY >= droppableY && draggableY <= (droppableY + droppableH)) {
    }
    return draggableX >= droppableX && draggableX <= (droppableX + droppableW) &&
        draggableY >= droppableY && draggableY <= (droppableY + droppableH);
}

export const overlapMarginError = ({ draggableX, draggableY, draggableH, draggableW, droppableX, droppableY, droppableW, droppableH }, minimumOverlap = 0) => {
    if (draggableX + draggableW < droppableX) return false // draggable is on the left
    if (draggableX > droppableX + droppableW) return false // draggable is on the right
    if (draggableY + draggableH < droppableY) return false // draggable is on the top
    if (draggableY > droppableY + droppableH) return false // draggable is on the bottom
    const overlapLeft = Math.max(draggableX, droppableX);
    const overlapRight = Math.min(draggableX + draggableW, droppableX + droppableW);
    const overlapTop = Math.max(draggableY, droppableY);
    const overlapBottom = Math.min(draggableY + draggableH, droppableY + droppableH);
    const overlapWidth = overlapRight - overlapLeft;
    const overlapHeight = overlapBottom - overlapTop;
    return overlapWidth >= minimumOverlap && overlapHeight >= minimumOverlap;
}

export const getBestContrast = (value: string, cadidate1: string, cadidate2: string) => {
    return chroma.contrast(value, cadidate1) > chroma.contrast(value, cadidate2) ? cadidate1 : cadidate2
}