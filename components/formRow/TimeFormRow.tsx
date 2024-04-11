
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import PALETTE, { FONTS, Theme } from "../../constants/Palette";
import TimePickerField from '../inputs/TimePickerField';
import { useTheme } from '@shopify/restyle';

interface Props {
    value: string,
    defaultValue?: string, //format "HH:mm"
    handleChange: (e: string) => void;
    title: string;
    from?: string
    to?: string,
    onBackground?: boolean
}

export const DateFormRow = ({
    value,
    defaultValue,
    handleChange,
    title,
    from,
    to,
    onBackground
}: Props) => {

    const theme = useTheme<Theme>();

    return (
        <Pressable onLongPress={() => handleChange(null)} delayLongPress={1000} style={styles.rowWrapper}>
            <Text style={[styles.title, { color: theme.colors.textOnSurface }]} >{title}</Text>
            <TimePickerField
                onBackground={onBackground}
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
});

export default DateFormRow;