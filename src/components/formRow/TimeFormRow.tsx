
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import PALETTE, { FONTS } from "../../Palette";
import TimePickerField from '../inputs/TimePickerField';

interface Props {
    value: string,
    defaultValue?: string, //format "HH:mm"
    handleChange: (e: string) => void;
    title: string;
    from?: string
    to?: string
}

export const DateFormRow = ({
    value,
    defaultValue,
    handleChange,
    title,
    from,
    to
}: Props) => {

    return (
        <Pressable onLongPress={() => handleChange(null)} delayLongPress={1000} style={styles.rowWrapper}>
            <Text style={styles.title} >{title}</Text>
            <TimePickerField
                defaultValue={defaultValue}
                value={value}
                handleChange={handleChange}
                from={from}
                to={to}
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