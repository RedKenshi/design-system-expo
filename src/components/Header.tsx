
import React, { useMemo } from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { CustomTextField } from './inputs/CustomTextField';
import PALETTE, { FONTS } from "../Palette";

interface Props {
    children: string | string[],
    style?: TextStyle,
    size: 1 | 2 | 3 | 4 | 5,
    variant?: "primary" | "onPrimary" | "onBackground" | "onSurface"
}

export const Header = ({
    children,
    style,
    size,
    variant = "primary"
}: Props) => {

    const computedStyle = useMemo((): TextStyle => {
        let fontSize = 16
        let family = FONTS.A400
        let lineHeight = 18
        let ls = 1
        let marginTop = PALETTE.spacing.l
        let marginBottom = PALETTE.spacing.xs
        switch (size) {
            case 1:
                fontSize = 28;
                ls = 1.2
                family = FONTS.A500;
                break;
            case 2:
                fontSize = 24;
                ls = 1.3
                family = FONTS.A500;
                break;
            case 3:
                fontSize = 20;
                ls = 1.4
                family = FONTS.A600;
                break;
            case 4:
                fontSize = 16;
                ls = 1.65
                family = FONTS.A700;
                break;
            case 5:
                fontSize = 14;
                ls = 1.8
                family = FONTS.A800;
                break;
        }
        let color = PALETTE.primary;
        switch (variant) {
            case 'primary':
                color = PALETTE.primary
                break;
            case 'onPrimary':
                color = PALETTE.textOnPrimary
                break;
            case 'onBackground':
                color = PALETTE.textOnBackground
                break;
            case 'onSurface':
                color = PALETTE.textOnSurface
                break;
        }
        return {
            fontSize: fontSize,
            lineHeight: fontSize + 8,
            fontFamily: family,
            color: color,
            marginTop: marginTop,
            marginBottom: marginBottom,
            letterSpacing: ls,

        }
    }, [size, variant])

    return (
        <Text style={{ ...computedStyle, ...style }} >
            {children}
        </Text>
    );
};

export default Header;