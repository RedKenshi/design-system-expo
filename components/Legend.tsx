
import React, { useMemo } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import PALETTE, { FONTS, Theme } from "../constants/Palette";
import { useTheme } from '@shopify/restyle';

interface Props {
    children: string | string[],
    style?: TextStyle,
    variant?: "primary" | "onPrimary" | "fadded"
}

export const Legend = ({
    children,
    style,
    variant
}: Props) => {
    const theme = useTheme<Theme>();
    const computedStyle = useMemo((): TextStyle => {
        let color = theme.colors.textLegend;
        switch (variant) {
            case 'primary':
                color = theme.colors.primary
                break;
            case 'onPrimary':
                color = theme.colors.textOnPrimary
                break;
            default:
                color = theme.colors.textLegend
                break;
        }
        return {
            color: color,
        }
    }, [variant, theme])

    return (
        <Text style={{ ...styles.legend, ...computedStyle, ...style }} >
            - {children}
        </Text>
    );
};

export default Legend;

const styles = StyleSheet.create({
    legend: {
        fontSize: 13,
        lineHeight: 17,
        fontFamily: FONTS.A600_I,
        textAlign: "justify",
        paddingHorizontal: PALETTE.spacing.s
    },
})