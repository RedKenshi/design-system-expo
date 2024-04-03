
import React, { useMemo, useState } from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TextStyle } from 'react-native';
import PALETTE, { FONTS, FieldSizes } from "../../Palette";
import chroma from "chroma-js"
import Box from '../Box';
import { useResponsiveProp } from '@shopify/restyle';

interface Props {
    label?: string,
    value: string,
    handleChange: (e: string) => void
    placeholder?: string,
    isActive?: boolean
    isSuccess?: boolean
    isError?: boolean
    isWarning?: boolean
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
}: Props) => {

    const [isFocus, setIsFocus] = useState<boolean>(false)

    const computedStyle = useMemo<StyleProp<TextStyle>>(() => {
        let tmp: StyleProp<TextStyle> = {
            borderBottomColor: PALETTE.colors.textOnPanel,
        };
        if (isActive || isFocus) {
            tmp = {
                borderBottomColor: PALETTE.colors.primary,
                backgroundColor: chroma(PALETTE.colors.primary).alpha(.08).hex()
            }
        }
        if (isSuccess) {
            tmp = {
                borderBottomColor: PALETTE.colors.success,
                backgroundColor: chroma(PALETTE.colors.success).alpha(.08).hex()
            }
        }
        if (isWarning) {
            tmp = {
                borderBottomColor: PALETTE.colors.warning,
                backgroundColor: chroma(PALETTE.colors.warning).alpha(.08).hex()
            }
        }
        if (isError) {
            tmp = {
                borderBottomColor: PALETTE.colors.danger,
                backgroundColor: chroma(PALETTE.colors.danger).alpha(.08).hex()
            }
        }
        return tmp
    }, [isActive, isSuccess, isError, isWarning, isFocus])

    const width = useResponsiveProp(FieldSizes.width)
    const height = useResponsiveProp(FieldSizes.height)
    const labelHeight = useResponsiveProp(FieldSizes.labelHeight)

    const labelDependentComputedStyle = useMemo<StyleProp<TextStyle>>(() => {
        if (label == undefined || label == null || label.length == 0) {
            return {
                minWidth: width,
                height: height,
                paddingTop: PALETTE.spacing.m
            }
        } else {
            return {
                minWidth: width,
                height: height + labelHeight,
                paddingTop: PALETTE.spacing.m + PALETTE.spacing.l
            }
        }

    }, [label])


    return (
        <Box position='relative'>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                defaultValue={value}
                onChange={e => handleChange(e.nativeEvent.text)}
                style={[styles.input, computedStyle, labelDependentComputedStyle]}
                placeholder={placeholder}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    label: {
        position: "absolute",
        fontFamily: FONTS.A700,
        color: PALETTE.colors.primary,
        zIndex: 1000,
        top: PALETTE.spacing.s + 2,
        left: PALETTE.spacing.s,
    },
    input: {
        paddingBottom: PALETTE.spacing.m - infoBorderWith,
        paddingTop: PALETTE.spacing.m,
        paddingHorizontal: PALETTE.spacing.m,
        borderBottomWidth: infoBorderWith,
        borderBottomColor: PALETTE.colors.textOnPanel,
        backgroundColor: PALETTE.colors.item,
        color: PALETTE.colors.fullThemeInverse,
        fontFamily: FONTS.A600,
        borderRadius: 4,
        fontSize: 18,
    }
});

export default CustomTextField;