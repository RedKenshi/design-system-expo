import React, { useMemo } from 'react';
import { Text, StyleSheet, TextStyle, ViewStyle, ActivityIndicator, View } from 'react-native';
import PALETTE, { FONTS, Theme } from "../constants/Palette"
import chroma from "chroma-js"
import { useTheme } from '@shopify/restyle';

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

    const theme = useTheme<Theme>();

    const baseColors = useMemo(() => {
        switch (variant) {
            case 'primary':
                if (inverted) {
                    return {
                        background: chroma(theme.colors.primary).alpha(.2).hex(),
                        text: theme.colors.primary
                    }
                } else {
                    return {
                        background: theme.colors.primary,
                        text: theme.colors.white
                    }
                }
            case 'success':
                if (inverted) {
                    return {
                        background: chroma(theme.colors.success).alpha(.2).hex(),
                        text: theme.colors.success
                    }
                } else {
                    return {
                        background: theme.colors.success,
                        text: theme.colors.white
                    }
                }
            case 'warning':
                if (inverted) {
                    return {
                        background: chroma(theme.colors.warning).alpha(.2).hex(),
                        text: theme.colors.warning
                    }
                } else {
                    return {
                        background: theme.colors.warning,
                        text: theme.colors.white
                    }
                }
            case 'danger':
                if (inverted) {
                    return {
                        background: chroma(theme.colors.danger).alpha(.2).hex(),
                        text: theme.colors.danger
                    }
                } else {
                    return {
                        background: theme.colors.danger,
                        text: theme.colors.white
                    }
                }
            case 'info':
                if (inverted) {
                    return {
                        background: chroma(theme.colors.info).alpha(.2).hex(),
                        text: theme.colors.info
                    }
                } else {
                    return {
                        background: theme.colors.info,
                        text: theme.colors.white
                    }
                }
            case 'neutral':
                if (inverted) {
                    return {
                        background: theme.colors.background,
                        text: theme.colors.fullThemeInverse
                    }
                } else {
                    return {
                        background: theme.colors.fullThemeInverse,
                        text: theme.colors.fullTheme
                    }
                }
        }
    }, [variant, inverted, theme])

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