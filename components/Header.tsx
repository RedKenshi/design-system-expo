
import React, { useMemo } from 'react';
import { Text, TextStyle } from 'react-native';
import PALETTE, { FONTS, Theme } from "../constants/Palette";
import { useTheme } from '@shopify/restyle';

interface Props {
    children: string | string[],
    style?: TextStyle,
    margin?: number,
    size: 1 | 2 | 3 | 4 | 5,
    variant?: "primary" | "onPrimary" | "onBackground" | "onSurface"
}

export const Header = ({
    children,
    style,
    margin,
    size,
    variant = "primary"
}: Props) => {

    const theme = useTheme<Theme>();

    const computedStyle = useMemo((): TextStyle => {
        let fontSize = 16
        let family = FONTS.A400
        let lineHeight = 18
        let ls = 1
        let marginTop = PALETTE.spacing.m
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
        let color = theme.colors.primary;
        switch (variant) {
            case 'primary':
                color = theme.colors.primary
                break;
            case 'onPrimary':
                color = theme.colors.textOnPrimary
                break;
            case 'onBackground':
                color = theme.colors.textOnBackground
                break;
            case 'onSurface':
                color = theme.colors.textOnSurface
                break;
        }
        return {
            fontSize: fontSize,
            lineHeight: fontSize + 8,
            fontFamily: family,
            color: color,
            marginTop: margin ?? marginTop,
            marginBottom: margin ?? marginBottom,
            letterSpacing: ls,

        }
    }, [size, variant, theme, style, margin])

    return (
        <Text style={{ ...computedStyle, ...style }} >
            {children}
        </Text>
    );
};

export default Header;