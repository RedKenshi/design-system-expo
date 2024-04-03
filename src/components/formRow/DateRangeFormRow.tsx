
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PALETTE, { FONTS } from "../../Palette";
import DateRangePickerField, { DateRange } from '../inputs/DateRangePickerField';

interface Props {
    value: DateRange,
    handleChange: (e: DateRange) => void;
    title: string;
    minNumberOfDays: number
    maxNumberOfDays: number
    forbiddenBefore?: Date
    forbiddenAfter?: Date
    pastForbidden?: boolean,
    todayForbidden?: boolean,
    futureForbidden?: boolean,
}

export const DateRangeFormRow = ({
    value,
    handleChange,
    title,
    minNumberOfDays,
    maxNumberOfDays,
    forbiddenBefore,
    forbiddenAfter,
    pastForbidden = false,
    todayForbidden = false,
    futureForbidden = false,
}: Props) => {

    return (
        <Pressable onLongPress={() => handleChange({ from: null, to: null })} delayLongPress={1000} style={styles.rowWrapper}>
            <Text style={styles.title} >{title}</Text>
            <DateRangePickerField
                value={value}
                handleChange={handleChange}
                minNumberOfDays={minNumberOfDays}
                maxNumberOfDays={maxNumberOfDays}
                forbiddenBefore={forbiddenBefore}
                forbiddenAfter={forbiddenAfter}
                pastForbidden={pastForbidden}
                todayForbidden={todayForbidden}
                futureForbidden={futureForbidden}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    title: {
        color: PALETTE.colors.textOnSurface,
        fontFamily: FONTS.A600,
        fontSize: 16
    },
    rowWrapper: {
        paddingHorizontal: PALETTE.spacing.xs,
        paddingVertical: PALETTE.spacing.xs,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    input: {
        borderBottomWidth: 3,
        borderBottomColor: PALETTE.colors.textOnPanel,
        backgroundColor: PALETTE.colors.item,
        color: PALETTE.colors.fullThemeInverse,
        fontFamily: FONTS.A600,
        minWidth: 168,
        paddingHorizontal: PALETTE.spacing.m,
        paddingVertical: PALETTE.spacing.l,
        borderRadius: 4,
        fontSize: 16
    }
});

export default DateRangeFormRow;