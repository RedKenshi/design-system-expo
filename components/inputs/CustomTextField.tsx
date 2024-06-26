
import React, { useMemo, useState } from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TextStyle } from 'react-native';
import PALETTE, { FONTS, FieldSizes, Theme } from "../../constants/Palette";
import chroma from "chroma-js"
import Box from '../Box';
import { useResponsiveProp, useTheme } from '@shopify/restyle';

interface Props {
    label?: string,
    value: string,
    handleChange: (e: string) => void
    placeholder?: string,
    isActive?: boolean
    isSuccess?: boolean
    isError?: boolean
    isWarning?: boolean
    onBackground?: boolean,
    defaultValue?: string
}
const infoBorderWith = 2;

export const CustomTextField = ({
    label,
    value,
    handleChange,
    placeholder,
    isActive,
    isSuccess,
    isError,
    isWarning,
    onBackground,
    defaultValue
}: Props) => {

    const theme = useTheme<Theme>();
    const [isFocus, setIsFocus] = useState<boolean>(false)

    const computedStyle = useMemo<StyleProp<TextStyle>>(() => {

        let tmp: StyleProp<TextStyle>;
        tmp = {
            borderBottomColor: theme.colors.textFadded,
            backgroundColor: onBackground ? theme.colors.surface : theme.colors.background,
        };
        if (isActive || isFocus) {
            tmp = {
                borderBottomColor: theme.colors.primary,
                backgroundColor: chroma(theme.colors.primary).alpha(.14).hex()
            }
        }
        if (isSuccess) {
            tmp = {
                borderBottomColor: theme.colors.success,
                backgroundColor: chroma(theme.colors.success).alpha(.14).hex()
            }
        }
        if (isWarning) {
            tmp = {
                borderBottomColor: theme.colors.warning,
                backgroundColor: chroma(theme.colors.warning).alpha(.14).hex()
            }
        }
        if (isError) {
            tmp = {
                borderBottomColor: theme.colors.danger,
                backgroundColor: chroma(theme.colors.danger).alpha(.14).hex()
            }
        }
        return tmp
    }, [isActive, isSuccess, isError, isWarning, isFocus, theme, onBackground])

    const width = useResponsiveProp(FieldSizes.width)
    const height = useResponsiveProp(FieldSizes.height)
    const labelHeight = useResponsiveProp(FieldSizes.labelHeight)

    const labelDependentComputedStyle = useMemo<StyleProp<TextStyle>>(() => {
        if (label == undefined || label == null || label.length == 0) {
            return {
                minWidth: width,
                height: height,
                paddingTop: theme.spacing.m
            }
        } else {
            return {
                minWidth: width,
                height: height + labelHeight,
                paddingTop: theme.spacing.m + theme.spacing.l
            }
        }

    }, [label])

    return (
        <Box position='relative'>
            {label && <Text style={[styles.label, { color: theme.colors.primary }]}>{label}</Text>}
            <TextInput
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                defaultValue={value}
                onChange={e => handleChange(e.nativeEvent.text)}
                style={[styles.input, computedStyle, labelDependentComputedStyle, { color: theme.colors.fullThemeInverse, }]}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textFadded}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    label: {
        position: "absolute",
        fontFamily: FONTS.A700,
        zIndex: 1000,
        top: PALETTE.spacing.s + 2,
        left: PALETTE.spacing.s,
    },
    input: {
        paddingBottom: PALETTE.spacing.m - infoBorderWith,
        paddingTop: PALETTE.spacing.m,
        paddingHorizontal: PALETTE.spacing.m,
        borderBottomWidth: infoBorderWith,
        fontFamily: FONTS.A400,
        borderRadius: 4,
        fontSize: 15,
    }
});

export default CustomTextField;