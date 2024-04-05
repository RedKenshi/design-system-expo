
import React, { useMemo } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import PALETTE, { FONTS, Theme } from "../Palette";
import Box from './Box';
import { useTheme } from '@shopify/restyle';


interface Props {
    children: string | string[],
    style?: TextStyle,
    variant?: "primary" | "onPrimary" | "onBackground" | "onSurface"
}

export const CustomText = ({
    children,
    style,
    variant = "onSurface"
}: Props) => {
    const theme = useTheme<Theme>();
    const computedStyle = useMemo((): TextStyle => {
        let color = theme.colors.textOnSurface;
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
            color: color,
        }
    }, [variant, theme])

    return (
        <Box margin={{ phone: 'xs' }}>
            <Text style={{ ...styles.text, ...computedStyle, ...style }} >
                {children}
            </Text>
        </Box>
    );
};

export default CustomText;

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        lineHeight: 19,
        fontFamily: FONTS.A400,
    }
})