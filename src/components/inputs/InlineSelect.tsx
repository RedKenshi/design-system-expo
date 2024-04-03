
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PALETTE, { FONTS } from "../../Palette";

const height = 40;
const space = PALETTE.spacing.xs + 2;

interface Props {
    handleChange: (e: any) => void
    options: { label: string, value: any }[];
    selected: any
}

export const InlineSelect = ({
    handleChange,
    selected,
    options,
}: Props) => {

    return (
        <View style={styles.input}>
            {options.map((o, i) => {
                return (
                    <TouchableOpacity key={`${i}-${o.label}`} style={[styles.option, selected == o.value ? styles.selected : null]} onPress={() => handleChange(o.value)}>
                        <Text style={[styles.optionText, selected == o.value ? styles.selectedText : null]}>{o.label}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    option: {
        height: height - (2 * space),
        minWidth: height - (2 * space),
        borderRadius: (height - (2 * space)) / 2,
        paddingHorizontal: space * 2,
        backgroundColor: PALETTE.colors.surface,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    selected: {
        backgroundColor: PALETTE.colors.primary
    },
    selectedText: {
        color: PALETTE.colors.textOnPrimary
    },
    optionText: {
        color: PALETTE.colors.fullThemeInverse,
        fontFamily: FONTS.A600,
        marginTop: 3,
        fontSize: 14,
        lineHeight: 14,
    },
    input: {
        height: height,
        minWidth: height,
        borderRadius: height / 2,
        backgroundColor: PALETTE.colors.item,
        paddingHorizontal: space,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: space
    }
});

export default InlineSelect;