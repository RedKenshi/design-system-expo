
import React, { useMemo } from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import PALETTE, { FONTS } from "../Palette";
import Box from './Box';


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

    const computedStyle = useMemo((): TextStyle => {

        let color = PALETTE.colors.textOnSurface;
        switch (variant) {
            case 'primary':
                color = PALETTE.colors.primary
                break;
            case 'onPrimary':
                color = PALETTE.colors.textOnPrimary
                break;
            case 'onBackground':
                color = PALETTE.colors.textOnBackground
                break;
            case 'onSurface':
                color = PALETTE.colors.textOnSurface
                break;
        }
        return {
            color: color,
        }
    }, [variant])

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