
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PALETTE, { FONTS, Theme } from "../../constants/Palette";
import DateRangePickerField, { DateRange } from '../inputs/DateRangePickerField';
import { useTheme } from '@shopify/restyle';

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
    onBackground?: boolean
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
    onBackground
}: Props) => {

    const theme = useTheme<Theme>();
    return (
        <Pressable onLongPress={() => handleChange({ from: null, to: null })} delayLongPress={1000} style={styles.rowWrapper}>
            <Text style={[styles.title, { color: theme.colors.textOnSurface }]} >{title}</Text>
            <DateRangePickerField
                onBackground={onBackground}
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

export default DateRangeFormRow;