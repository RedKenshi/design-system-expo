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
    const overlapLeft = Math.max(draggableX, droppableX);
    const overlapRight = Math.min(draggableX + draggableW, droppableX + droppableW);
    const overlapTop = Math.max(draggableY, droppableY);
    const overlapBottom = Math.min(draggableY + draggableH, droppableY + droppableH);
    const overlapWidth = overlapRight - overlapLeft;
    const overlapHeight = overlapBottom - overlapTop;
    return overlapWidth >= minimumOverlap && overlapHeight >= minimumOverlap;
}