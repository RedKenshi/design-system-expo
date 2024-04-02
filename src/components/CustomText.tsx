
import React, { useMemo } from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import PALETTE, { FONTS } from "../Palette";

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

        let color = PALETTE.textOnSurface;
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
            color: color,
        }
    }, [variant])

    return (
        <View>
            <Text style={{ ...styles.text, ...computedStyle, ...style }} >
                {children}
            </Text>
        </View>
    );
};

export default CustomText;

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        lineHeight: 19,
        fontFamily: FONTS.A400,
        margin: PALETTE.spacing.xs
    }
})