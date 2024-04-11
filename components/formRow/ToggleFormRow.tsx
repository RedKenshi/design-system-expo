
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PALETTE, { FONTS, Theme } from "../../constants/Palette";
import Toggle from '../inputs/Toggle';
import { useTheme } from '@shopify/restyle';
import Box from '../Box';

interface Props {
    title: string,
    value: boolean
    handleChange: (value: boolean) => void
}

export const ToggleFormRow = ({
    title,
    value,
    handleChange,
}: Props) => {

    const theme = useTheme<Theme>();

    return (
        <Box padding='xs' flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text style={[styles.title, { color: theme.colors.textOnSurface }]} >{title}</Text>
            <Toggle handleChange={handleChange} value={value} />
        </Box>
    );
};

const styles = StyleSheet.create({
    title: {
        fontFamily: FONTS.A600,
        fontSize: 16
    }
});

export default ToggleFormRow;