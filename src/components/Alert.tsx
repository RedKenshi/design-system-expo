import React, { useMemo } from 'react';
import { Text, StyleSheet, TextStyle, ViewStyle, View } from 'react-native';
import { IconSVG, IconSVGCode } from '../IconSVG';
import PALETTE, { FONTS } from "../Palette"
import chroma from "chroma-js"

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

    const baseColors = useMemo(() => {
        let baseColor = ""
        switch (variant) {
            case 'primary':
                baseColor = PALETTE.primary
                break;
            case 'info':
                baseColor = PALETTE.info
                break;
            case 'success':
                baseColor = PALETTE.success
                break;
            case 'warning':
                baseColor = PALETTE.warning
                break;
            case 'danger':
                baseColor = PALETTE.danger
                break;
        }
        return {
            full: baseColor,
            fadded: chroma(baseColor).alpha(.09).hex()
        }
    }, [variant])

    const computedStyle = useMemo(() => {
        let variantStyles: ViewStyle = {}
        variantStyles = {
            borderWidth: 2,
            borderColor: baseColors.full,
            backgroundColor: baseColors.fadded
        }
        return { ...styles.container, ...variantStyles, ...style }
    }, [baseColors])

    const computedTextStyle = useMemo(() => {
        let variantStyles: TextStyle = {}
        variantStyles = {
            color: baseColors.full
        }
        return { ...styles.title, ...variantStyles }
    }, [baseColors])


    return (
        <View style={computedStyle}>
            <View style={styles.headRow}>
                <View style={{ width: 32 }}>
                    <IconSVG size='normal' icon={icon} fill={computedTextStyle.color} />
                </View>
                <View>
                    <Text style={[computedTextStyle, styles.title]}>{title}</Text>
                </View>
            </View>
            {description &&
                <View>
                    <Text style={[computedTextStyle, styles.description]}>{description}</Text>
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 48,
        marginHorizontal: PALETTE.spacing.m,
        marginVertical: PALETTE.spacing.s,
        flexDirection: 'column',
        gap: PALETTE.spacing.xs,
        paddingHorizontal: PALETTE.spacing.m,
        paddingVertical: PALETTE.spacing.m,
        borderRadius: 16,
    },
    headRow: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingLeft: PALETTE.spacing.xs,
    },
    title: {
        fontFamily: FONTS.A600,
        fontSize: 18,
        marginTop: 2
    },
    description: {
        fontFamily: FONTS.A600,
        textAlign: "justify",
        fontSize: 16,
        lineHeight: 24,
    },
});

export default Alert;