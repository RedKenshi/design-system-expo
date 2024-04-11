
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PALETTE, { FONTS, Theme } from "../../constants/Palette";
import InlineSelect from '../inputs/InlineSelect';
import InlineSelectAnimated from '../inputs/InlineSelectAnimated';
import { useTheme } from '@shopify/restyle';

interface Props {
    title: string,
    selected: any
    animated?: boolean
    options: { label: string, value: any }[];
    handleChange: (e: React.FormEvent<HTMLInputElement>) => void;
}

export const InlineSelectFormRow = ({
    title,
    selected,
    animated = true,
    options,
    handleChange,
}: Props) => {

    const theme = useTheme<Theme>();

    if (animated) {
        return (
            <View style={styles.rowWrapper}>
                <Text style={[styles.title, { color: theme.colors.textOnSurface }]} >{title}</Text>
                <InlineSelectAnimated handleChange={handleChange} selected={selected} options={options} />
            </View>
        );
    } else {
        return (
            <View style={styles.rowWrapper}>
                <Text style={[styles.title, { color: theme.colors.textOnSurface }]} >{title}</Text>
                <InlineSelect handleChange={handleChange} selected={selected} options={options} />
            </View>
        );
    }
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

export default InlineSelectFormRow;