import React, { useMemo } from 'react';
import { Text, TouchableOpacity, StyleSheet, TextStyle, ViewStyle, ActivityIndicator } from 'react-native';
import { IconSVG, IconSVGCode } from '../IconSVG';
import PALETTE, { FONTS, Theme } from "../Palette"
import chroma from "chroma-js"
import { useTheme } from '@shopify/restyle';

export type ButtonVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface Props {
    title?: string;
    onPress: Function;
    icon?: IconSVGCode;
    size?: "s" | "m" | "l";
    variant?: ButtonVariant;
    outline?: boolean;
    disabled?: boolean;
    loading?: boolean;
    iconPosition?: 'left' | 'right';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<Props> = ({
    title,
    onPress,
    icon,
    size = "m",
    iconPosition = 'left',
    variant = "primary",
    outline = false,
    disabled = false,
    loading = false,
    style,
    textStyle,
}) => {

    const theme = useTheme<Theme>();

    const baseColors = useMemo(() => {
        let baseColor = ""
        let textColor = null
        switch (variant) {
            case 'primary':
                baseColor = theme.colors.primary
                break;
            case 'success':
                baseColor = theme.colors.success
                break;
            case 'warning':
                baseColor = theme.colors.warning
                break;
            case 'danger':
                baseColor = theme.colors.danger
                break;
            case 'info':
                baseColor = theme.colors.info
                break;
            case 'neutral':
                baseColor = theme.colors.white
                textColor = { textColor: theme.colors.fullblack }
                break;
        }
        return {
            full: baseColor,
            darken: chroma(baseColor).darken(1.5).desaturate(1).hex(),
            brighten: chroma(baseColor).saturate(.5).hex(),
            subtle: chroma(baseColor).alpha(.45).hex(),
            fadded: chroma(baseColor).alpha(.075).hex(),
            ...textColor
        }
    }, [variant, theme])

    const computedStyle = useMemo(() => {
        let variantStyles: ViewStyle = {}

        switch (size) {
            case 's': variantStyles = styles.sizeS; break;
            case 'm': variantStyles = styles.sizeM; break;
            case 'l': variantStyles = styles.sizeL; break;
        }

        if (!title && icon) {
            variantStyles = {
                ...variantStyles,
                aspectRatio: 1
            }
        }

        if (disabled) {
            if (outline) {
                variantStyles = {
                    ...variantStyles,
                    borderWidth: 2,
                    borderColor: baseColors.subtle,
                    backgroundColor: baseColors.fadded
                }
            } else {
                variantStyles = {
                    ...variantStyles,
                    backgroundColor: baseColors.darken
                }
            }
        } else {
            if (outline) {
                variantStyles = {
                    ...variantStyles,
                    borderWidth: 2,
                    borderColor: baseColors.full,
                    backgroundColor: baseColors.fadded
                }
            } else {
                variantStyles = {
                    ...variantStyles,
                    backgroundColor: baseColors.full
                }
            }
        }

        return { ...styles.container, ...variantStyles }
    }, [baseColors, outline, disabled, loading])

    const computedTextStyle = useMemo(() => {

        let variantStyles: TextStyle = {}

        switch (size) {
            case 's': variantStyles = styles.textS; break;
            case 'm': variantStyles = styles.textM; break;
            case 'l': variantStyles = styles.textL; break;
        }

        if (disabled) {
            if (outline) {
                variantStyles = {
                    ...variantStyles,
                    color: baseColors.textColor ?? baseColors.subtle
                }
            } else {
                variantStyles = {
                    ...variantStyles,
                    color: theme.colors.offwhite
                }
            }
        } else {
            if (outline) {
                variantStyles = {
                    ...variantStyles,
                    color: baseColors.textColor ?? baseColors.full
                }
            } else {
                variantStyles = {
                    ...variantStyles,
                }
            }
        }

        return { ...styles.text, ...variantStyles, ...textStyle }
    }, [baseColors, outline, disabled, loading, textStyle])

    const iconSize = useMemo(() => {
        switch (size) {
            case 's': return "small"; break;
            case 'm': return "normal"; break;
            case 'l': return "bigger"; break;
        }
    }, [size])

    return (
        <TouchableOpacity disabled={disabled || loading} style={[computedStyle, style]} onPress={onPress}>
            {!loading && icon && iconPosition === 'left' && <IconSVG size={iconSize} icon={icon} fill={baseColors.textColor ?? computedTextStyle.color} />}
            {loading ?
                <ActivityIndicator color={baseColors.textColor ?? computedTextStyle.color} />
                :
                title ? <Text style={computedTextStyle}>{title}</Text> : null
            }
            {!loading && icon && iconPosition === 'right' && <IconSVG size={iconSize} icon={icon} fill={baseColors.textColor ?? computedTextStyle.color} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    sizeS: { // M * 0.75
        height: 32,
        gap: PALETTE.spacing.xs,
        paddingHorizontal: PALETTE.spacing.xs,
        paddingVertical: PALETTE.spacing.xxs,
        borderRadius: 3,
    },
    sizeM: {
        height: 48,
        gap: PALETTE.spacing.s,
        paddingHorizontal: PALETTE.spacing.l,
        paddingVertical: PALETTE.spacing.m,

        borderRadius: 4,
    },
    sizeL: { // M * 1.25
        height: 56,
        gap: PALETTE.spacing.m,
        paddingHorizontal: PALETTE.spacing.xl,
        paddingVertical: PALETTE.spacing.l,
        borderRadius: 6,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: PALETTE.spacing.xs,
        justifyContent: 'center',
    },
    text: {
        marginTop: 3
    },
    textS: {
        fontFamily: FONTS.A600,
        fontSize: 12,
        lineHeight: 12,
        color: '#FFFFFF',
    },
    textM: {
        fontFamily: FONTS.A600,
        fontSize: 16,
        lineHeight: 16,
        color: '#FFFFFF',
    },
    textL: {
        fontFamily: FONTS.A600,
        fontSize: 24,
        lineHeight: 24,
        color: '#FFFFFF',
    },
});

export default Button;