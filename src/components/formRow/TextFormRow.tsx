
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CustomTextField } from '../inputs/CustomTextField';
import PALETTE, { FONTS, Theme } from "../../Palette";
import { useTheme } from '@shopify/restyle';

interface Props {
    value: string,
    title?: string;
    handleChange: (e: string) => void;
    defaultValue?: string
    isActive?: boolean
    isSuccess?: boolean
    isError?: boolean
    isWarning?: boolean
}

export const TextFormRow = ({
    value,
    title,
    handleChange,
    defaultValue,
    isActive,
    isSuccess,
    isError,
    isWarning,
}: Props) => {

    const theme = useTheme<Theme>();
    return (
        <View style={styles.rowWrapper}>
            <Text style={[styles.title, { color: theme.colors.textOnSurface }]} >{title}</Text>
            <CustomTextField defaultValue={defaultValue} value={value} isActive={isActive} isSuccess={isSuccess} isError={isError} isWarning={isWarning} handleChange={handleChange} />
        </View>
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

export default TextFormRow;