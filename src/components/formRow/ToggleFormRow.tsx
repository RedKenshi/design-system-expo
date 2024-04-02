
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PALETTE, { FONTS } from "../../Palette";
import Toggle from '../inputs/Toggle';

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

    return (
        <View style={styles.rowWrapper}>
            <Text style={styles.title} >{title}</Text>
            <Toggle handleChange={handleChange} value={value} />
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        color: PALETTE.textOnSurface,
        fontFamily: FONTS.A600,
        fontSize: 16
    },
    rowWrapper: {
        height: 48,
        marginHorizontal: PALETTE.spacing.xs,
        paddingHorizontal: PALETTE.spacing.xs,
        paddingVertical: PALETTE.spacing.xs,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
});

export default ToggleFormRow;