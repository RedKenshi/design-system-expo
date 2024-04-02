
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CustomTextField } from '../inputs/CustomTextField';
import PALETTE, { FONTS } from "../../Palette";

interface Props {
    value: string,
    title?: string;
    handleChange: (e: string) => void;
    isActive?: boolean
    isSuccess?: boolean
    isError?: boolean
    isWarning?: boolean
}

export const TextFormRow = ({
    value,
    title,
    handleChange,
    isActive,
    isSuccess,
    isError,
    isWarning,
}: Props) => {

    return (
        <View style={styles.rowWrapper}>
            <Text style={styles.title} >{title}</Text>
            <CustomTextField value={value} isActive={isActive} isSuccess={isSuccess} isError={isError} isWarning={isWarning} handleChange={handleChange} />
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
        height: 64,
        marginHorizontal: PALETTE.spacing.xs,
        paddingHorizontal: PALETTE.spacing.xs,
        paddingVertical: PALETTE.spacing.xs,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
});

export default TextFormRow;