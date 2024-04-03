
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PALETTE, { FONTS } from "../../Palette";
import DatePickerField from '../inputs/DatePickerField';

interface Props {
    value: Date,
    handleChange: (e: Date) => void;
    title: string;
    from?: Date
    to?: Date
    pastForbidden?: boolean,
    todayForbidden?: boolean,
    futureForbidden?: boolean,
}

export const DateFormRow = ({
    value,
    handleChange,
    title,
    from,
    to,
    pastForbidden = false,
    todayForbidden = false,
    futureForbidden = false,
}: Props) => {

    return (
        <Pressable onLongPress={() => handleChange(null)} delayLongPress={1000} style={styles.rowWrapper}>
            <Text style={styles.title}>{title}</Text>
            <DatePickerField
                value={value}
                handleChange={handleChange}
                from={from}
                to={to}
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

export default DateFormRow;