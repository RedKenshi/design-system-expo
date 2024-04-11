
import React, { useMemo } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { FONTS, Theme, COLORS } from "../constants/Palette";
import Box from './Box';
import { useTheme } from '@shopify/restyle';


interface Props {
    children: string | string[],
    style?: TextStyle,
    variant?: "primary" | "onPrimary" | "onBackground" | "onSurface"
    color?: keyof COLORS;
    font?: keyof typeof FONTS;
    size?: number;
    lineHeight?: number;
    textAlign?: TextStyle["textAlign"];
}

export const CustomText = ({
    children,
    style,
    color,
    font = "A400",
    size = 16,
    lineHeight = 18,
    variant = "onSurface",
    textAlign
}: Props) => {

    const theme = useTheme<Theme>();

    const computedStyle = useMemo((): TextStyle => {
        let computedColor = theme.colors.textOnSurface;
        let computedSize = size;
        let computedHeight = lineHeight ?? size;
        let computedTextAlign = textAlign;
        if (color) {
            computedColor = theme.colors[color]
        } else {
            switch (variant) {
                case 'primary':
                    computedColor = theme.colors.primary
                    break;
                case 'onPrimary':
                    computedColor = theme.colors.textOnPrimary
                    break;
                case 'onBackground':
                    computedColor = theme.colors.textOnBackground
                    break;
                case 'onSurface':
                    computedColor = theme.colors.textOnSurface
                    break;
            }
        }
        return {
            fontFamily: FONTS[font],
            color: computedColor,
            fontSize: computedSize,
            lineHeight: computedHeight,
            textAlign: computedTextAlign
        }
    }, [variant, theme, color, font, size, lineHeight])

    return (
        <Box margin={{ phone: 'xs' }}>
            <Text style={{ ...computedStyle, ...style }} >
                {children}
            </Text>
        </Box>
    );
};

export default CustomText;

const styles = StyleSheet.create({
    text: {
        fontFamily: FONTS.A400,
    }
})