
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import PALETTE, { FONTS, Theme } from "../../constants/Palette";
import { useTheme } from '@shopify/restyle';
import ColorPickerField from '../inputs/ColorPickerField';

interface Props {
    value: string,
    handleChange: (e: string) => void;
    title: string;
    onBackground?: boolean,
    placeholder?: string
}

export const ColorFormRow = ({
    value,
    handleChange,
    title,
    onBackground,
    placeholder
}: Props) => {

    const theme = useTheme<Theme>();

    return (
        <Pressable onLongPress={() => handleChange(null)} delayLongPress={1000} style={styles.rowWrapper}>
            <Text style={[styles.title, { color: theme.colors.textOnSurface }]}>{title}</Text>
            <ColorPickerField
                placeholder={placeholder}
                onBackground={onBackground}
                value={value}
                handleChange={handleChange}
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

export default ColorFormRow;