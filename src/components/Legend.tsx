
import React, { useMemo } from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import PALETTE, { FONTS } from "../Palette";

interface Props {
    children: string,
    style?: TextStyle,
    variant?: "primary" | "onPrimary" | "fadded"
}

export const Legend = ({
    children,
    style,
    variant
}: Props) => {

    const computedStyle = useMemo((): TextStyle => {
        let color = PALETTE.textLegend;
        switch (variant) {
            case 'primary':
                color = PALETTE.primary
                break;
            case 'onPrimary':
                color = PALETTE.textOnPrimary
                break;
            default:
                color = PALETTE.textLegend
                break;
        }
        return {
            color: color,
        }
    }, [variant])

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