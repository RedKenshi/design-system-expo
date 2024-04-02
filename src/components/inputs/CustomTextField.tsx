
import React, { useEffect, useMemo, useState } from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TextStyle, View } from 'react-native';
import PALETTE, { FONTS } from "../../Palette";
import chroma from "chroma-js"

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
            borderBottomColor: PALETTE.textOnPanel,
        };
        if (isActive || isFocus) {
            tmp = {
                borderBottomColor: PALETTE.primary,
                backgroundColor: chroma(PALETTE.primary).alpha(.08).hex()
            }
        }
        if (isSuccess) {
            tmp = {
                borderBottomColor: PALETTE.success,
                backgroundColor: chroma(PALETTE.success).alpha(.08).hex()
            }
        }
        if (isWarning) {
            tmp = {
                borderBottomColor: PALETTE.warning,
                backgroundColor: chroma(PALETTE.warning).alpha(.08).hex()
            }
        }
        if (isError) {
            tmp = {
                borderBottomColor: PALETTE.danger,
                backgroundColor: chroma(PALETTE.danger).alpha(.08).hex()
            }
        }
        return tmp
    }, [isActive, isSuccess, isError, isWarning, isFocus])

    const labelDependentComputedStyle = useMemo<StyleProp<TextStyle>>(() => {
        if (label == undefined || label == null || label.length == 0) {
            return {
                height: 46,
                paddingTop: PALETTE.spacing.m
            }
        } else {
            return {
                height: 68,
                paddingTop: PALETTE.spacing.m + PALETTE.spacing.l
            }
        }

    }, [label])

    return (
        <View style={{ position: 'relative' }}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput onFocus={() => setIsFocus(true)} onBlur={() => setIsFocus(false)} defaultValue={value} onChange={e => handleChange(e.nativeEvent.text)} style={[styles.input, computedStyle, labelDependentComputedStyle]} placeholder={placeholder} />
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        position: "absolute",
        fontFamily: FONTS.A700,
        color: PALETTE.primary,
        zIndex: 1000,
        top: PALETTE.spacing.s + 2,
        left: PALETTE.spacing.s,
    },
    input: {
        paddingBottom: PALETTE.spacing.m - infoBorderWith,
        paddingTop: PALETTE.spacing.m,
        paddingHorizontal: PALETTE.spacing.m,
        borderBottomWidth: infoBorderWith,
        borderBottomColor: PALETTE.textOnPanel,
        backgroundColor: PALETTE.item,
        color: PALETTE.fullThemeInverse,
        fontFamily: FONTS.A600,
        minWidth: 168,
        borderRadius: 4,
        fontSize: 18,
    }
});

export default CustomTextField;