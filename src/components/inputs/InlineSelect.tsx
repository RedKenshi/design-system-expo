
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PALETTE, { FONTS, Theme } from "../../Palette";
import { useTheme } from '@shopify/restyle';

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

    const theme = useTheme<Theme>();
    return (
        <View style={[styles.input, { backgroundColor: theme.colors.item }]} >
            {options.map((o, i) => {
                return (
                    <TouchableOpacity
                        key={`${i}-${o.label}`}
                        style={[
                            styles.option,
                            { backgroundColor: theme.colors.surface },
                            selected == o.value ? { backgroundColor: theme.colors.primary } : null
                        ]}
                        onPress={() => handleChange(o.value)}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                { color: theme.colors.fullThemeInverse },
                                selected == o.value ? { color: theme.colors.textOnPrimary } : null
                            ]}
                        >
                            {o.label}
                        </Text>
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
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    optionText: {
        fontFamily: FONTS.A600,
        marginTop: 3,
        fontSize: 14,
        lineHeight: 14,
    },
    input: {
        height: height,
        minWidth: height,
        borderRadius: height / 2,
        paddingHorizontal: space,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: space
    }
});

export default InlineSelect;