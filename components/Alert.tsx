import React, { useMemo } from 'react';
import { Text, StyleSheet, TextStyle, ViewStyle, View } from 'react-native';
import { IconSVG, IconSVGCode } from './IconSVG';
import PALETTE, { FONTS, Theme } from "../constants/Palette"
import chroma from "chroma-js"
import Box from './Box';
import { useTheme } from '@shopify/restyle';

interface Props {
    title: string;
    description?: string;
    icon: IconSVGCode;
    variant: "primary" | "success" | "warning" | "danger" | "info";
    style?: ViewStyle
}

export const Alert: React.FC<Props> = ({
    title,
    description,
    icon,
    variant,
    style
}) => {
    const theme = useTheme<Theme>();

    const baseColors = useMemo(() => {
        let baseColor = ""
        switch (variant) {
            case 'primary':
                baseColor = theme.colors.primary
                break;
            case 'info':
                baseColor = theme.colors.info
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
        }
        return {
            full: baseColor,
            fadded: chroma(baseColor).alpha(.09).hex()
        }
    }, [variant, theme])

    const computedStyle = useMemo(() => {
        let variantStyles: ViewStyle = {}
        variantStyles = {
            borderWidth: 2,
            borderColor: baseColors.full,
            backgroundColor: baseColors.fadded
        }
        return { ...variantStyles, ...style }
    }, [baseColors])

    const computedTextStyle = useMemo(() => {
        let variantStyles: TextStyle = {}
        variantStyles = {
            color: baseColors.full
        }
        return { ...styles.title, ...variantStyles }
    }, [baseColors])


    return (
        <Box

            minHeight={48}
            marginHorizontal='m'
            flexDirection='column'
            gap='xs'
            paddingHorizontal='m'
            paddingVertical='m'
            borderRadius={8}
            style={computedStyle}
        >
            <Box style={styles.headRow}>
                <Box style={{ width: 24 }}>
                    <IconSVG size='small' icon={icon} fill={computedTextStyle.color} />
                </Box>
                <Box>
                    <Text style={[computedTextStyle, styles.title]}>{title}</Text>
                </Box>
            </Box>
            {description &&
                <Box flex={1}>
                    <Text style={[computedTextStyle, styles.description]}>{description}</Text>
                </Box>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    headRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingLeft: PALETTE.spacing.xs,
    },
    title: {
        fontFamily: FONTS.A600,
        fontSize: 22,
        lineHeight: 22,
        marginTop: 2
    },
    description: {
        fontFamily: FONTS.A600,
        textAlign: "justify",
        fontSize: 14,
        lineHeight: 24,
    },
});

export default Alert;