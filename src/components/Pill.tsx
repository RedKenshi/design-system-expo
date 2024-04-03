import React, { useMemo } from 'react';
import { Text, StyleSheet, TextStyle, ViewStyle, ActivityIndicator, View } from 'react-native';
import PALETTE, { FONTS } from "../Palette"
import chroma from "chroma-js"

interface Props {
    title?: string;
    rounded?: boolean;
    size?: "xs" | "s" | "m" | "l";
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    inverted?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Pill: React.FC<Props> = ({
    title,
    rounded = false,
    size = "m",
    variant = "primary",
    inverted = false,
    loading = false,
    style,
    textStyle,
}) => {

    const baseColors = useMemo(() => {
        switch (variant) {
            case 'primary':
                if (inverted) {
                    return {
                        background: chroma(PALETTE.colors.primary).alpha(.2).hex(),
                        text: PALETTE.colors.primary
                    }
                } else {
                    return {
                        background: PALETTE.colors.primary,
                        text: PALETTE.colors.white
                    }
                }
            case 'success':
                if (inverted) {
                    return {
                        background: chroma(PALETTE.colors.success).alpha(.2).hex(),
                        text: PALETTE.colors.success
                    }
                } else {
                    return {
                        background: PALETTE.colors.success,
                        text: PALETTE.colors.white
                    }
                }
            case 'warning':
                if (inverted) {
                    return {
                        background: chroma(PALETTE.colors.warning).alpha(.2).hex(),
                        text: PALETTE.colors.warning
                    }
                } else {
                    return {
                        background: PALETTE.colors.warning,
                        text: PALETTE.colors.white
                    }
                }
            case 'danger':
                if (inverted) {
                    return {
                        background: chroma(PALETTE.colors.danger).alpha(.2).hex(),
                        text: PALETTE.colors.danger
                    }
                } else {
                    return {
                        background: PALETTE.colors.danger,
                        text: PALETTE.colors.white
                    }
                }
            case 'info':
                if (inverted) {
                    return {
                        background: chroma(PALETTE.colors.info).alpha(.2).hex(),
                        text: PALETTE.colors.info
                    }
                } else {
                    return {
                        background: PALETTE.colors.info,
                        text: PALETTE.colors.white
                    }
                }
            case 'neutral':
                if (inverted) {
                    return {
                        background: chroma(PALETTE.colors.offwhite).alpha(.2).hex(),
                        text: PALETTE.colors.textOnSurface
                    }
                } else {
                    return {
                        background: PALETTE.colors.background,
                        text: PALETTE.colors.fullThemeInverse
                    }
                }
        }
    }, [variant, inverted])

    const computedStyle = useMemo(() => {
        let variantStyles: ViewStyle = {
            backgroundColor: baseColors.background
        }
        switch (size) {
            case 'xs': variantStyles = { ...variantStyles, ...styles.sizeXS }; break;
            case 's': variantStyles = { ...variantStyles, ...styles.sizeS }; break;
            case 'm': variantStyles = { ...variantStyles, ...styles.sizeM }; break;
            case 'l': variantStyles = { ...variantStyles, ...styles.sizeL }; break;
        }
        if (rounded) {
            variantStyles = Object.assign(variantStyles, { borderRadius: 999 })
        }
        return { ...styles.container, ...variantStyles }
    }, [baseColors, size])

    const computedTextStyle = useMemo(() => {
        let variantStyles: TextStyle = {
            color: baseColors.text
        }
        switch (size) {
            case 'xs': variantStyles = { ...variantStyles, ...styles.textXS }; break;
            case 's': variantStyles = { ...variantStyles, ...styles.textS }; break;
            case 'm': variantStyles = { ...variantStyles, ...styles.textM }; break;
            case 'l': variantStyles = { ...variantStyles, ...styles.textL }; break;
        }
        return { ...variantStyles, ...textStyle }
    }, [baseColors, size])

    return (
        <View style={[computedStyle, style]} >
            {loading ?
                <ActivityIndicator color={computedTextStyle.color} />
                :
                title ? <Text style={[computedTextStyle, { marginTop: 3 }]}>{title}</Text> : null
            }
        </View>
    );
};

const styles = StyleSheet.create({
    sizeXS: {
        height: 20,
        minWidth: 20,
        gap: PALETTE.spacing.xs,
        paddingHorizontal: PALETTE.spacing.s,
        paddingVertical: PALETTE.spacing.xxs,
        borderRadius: 3,
    },
    sizeS: {
        height: 28,
        minWidth: 28,
        gap: PALETTE.spacing.xs,
        paddingHorizontal: PALETTE.spacing.s,
        paddingVertical: PALETTE.spacing.xs,
        borderRadius: 3,
    },
    sizeM: {
        height: 32,
        minWidth: 32,
        gap: PALETTE.spacing.s,
        paddingHorizontal: PALETTE.spacing.m,
        paddingVertical: PALETTE.spacing.s,
        borderRadius: 4,
    },
    sizeL: {
        height: 42,
        minWidth: 42,
        gap: PALETTE.spacing.m,
        paddingHorizontal: PALETTE.spacing.l,
        paddingVertical: PALETTE.spacing.s,
        borderRadius: 6,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: PALETTE.spacing.xs,
        justifyContent: 'center',
        alignSelf: 'center' // THIS PREVENT AUTO FLEX : 1 IN A DISPLAY FLEX CONTAINER
    },
    textXS: {
        fontFamily: FONTS.A600,
        fontSize: 11,
        lineHeight: 11,
    },
    textS: {
        fontFamily: FONTS.A600,
        fontSize: 14,
        lineHeight: 14,
    },
    textM: {
        fontFamily: FONTS.A600,
        fontSize: 18,
        lineHeight: 18,
    },
    textL: {
        fontFamily: FONTS.A600,
        fontSize: 22,
        lineHeight: 22,
    },
});

export default Pill;