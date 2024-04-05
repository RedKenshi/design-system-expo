
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import PALETTE, { FONTS, Theme } from "../../Palette";
import DatePickerField from '../inputs/DatePickerField';
import { useTheme } from '@shopify/restyle';

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

    const theme = useTheme<Theme>();

    return (
        <Pressable onLongPress={() => handleChange(null)} delayLongPress={1000} style={styles.rowWrapper}>
            <Text style={[styles.title, { color: theme.colors.textOnSurface }]}>{title}</Text>
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
        fontFamily: FONTS.A600,
        fontSize: 16
    },
    rowWrapper: {
        paddingHorizontal: PALETTE.spacing.xs,
        paddingVertical: PALETTE.spacing.xs,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
});

export default DateFormRow;