import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleProp, StyleSheet, TextInput, TextStyle, TouchableOpacity, Text, FlatList } from 'react-native';
import { BlurView } from 'expo-blur';
import chroma from "chroma-js";
import { useResponsiveProp, useTheme } from '@shopify/restyle';

import PALETTE, { FONTS, FieldSizes, Theme } from "../../constants/Palette";
import { IconSVG, IconSVGCode } from '../IconSVG';
import Button from '../Button';
import Box from '../Box';
import { tabColors } from '../../constants/utils';

interface Props {
    label?: string,
    value: string,
    handleChange: (e: string) => void;
    onBackground?: boolean,
    placeholder?: string
}

export const ColorPickerField = ({
    label,
    value,
    handleChange,
    onBackground,
    placeholder
}: Props) => {

    const theme = useTheme<Theme>();

    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false)

    const width = useResponsiveProp(FieldSizes.width)
    const height = useResponsiveProp(FieldSizes.height)
    const labelHeight = useResponsiveProp(FieldSizes.labelHeight)

    const handleOpen = () => {
        setColorPickerOpen(true)
    }

    const handleColorSelection = (color: string) => {
        setSelectedColor(color)
    }

    const labelDependentComputedStyle = useMemo<StyleProp<TextStyle>>(() => {
        if (label == undefined || label == null || label.length == 0) {
            return {
                minWidth: width,
                height: height,
                paddingTop: PALETTE.spacing.l
            }
        } else {
            return {
                minWidth: width,
                height: height + labelHeight,
                paddingTop: PALETTE.spacing.xxl
            }
        }
    }, [label])

    return (
        <>
            <TouchableOpacity style={{}} onPress={handleOpen}>
                {label && <Text style={[styles.label, { color: theme.colors.primary }]}>{label}</Text>}
                <TextInput
                    editable={false}
                    value={value ? value : null}
                    placeholder={placeholder ?? ""}
                    style={[
                        styles.input,
                        {
                            borderBottomColor: theme.colors.textOnPanel,
                            backgroundColor: value ? value : onBackground ? theme.colors.surface : theme.colors.background,
                            color: value ? chroma.contrast(value, theme.colors.fullThemeInverse) - 4 > chroma.contrast(value, theme.colors.fullTheme) ? theme.colors.fullThemeInverse : theme.colors.fullTheme : theme.colors.fullThemeInverse
                        },
                        labelDependentComputedStyle,
                        !value && {
                            ...styles.datePlaceholder,
                            color: chroma(theme.colors.fullThemeInverse).alpha(.4).hex()
                        }]}
                    pointerEvents='none'
                />
                <Box flexDirection='row' justifyContent="center" alignItems="center" style={{ position: "absolute", bottom: 0, left: PALETTE.spacing.m, height: height }}>
                    <IconSVG icon={IconSVGCode.palette} fill={value ? chroma.contrast(value, theme.colors.fullThemeInverse) - 4 > chroma.contrast(value, theme.colors.fullTheme) ? theme.colors.fullThemeInverse : theme.colors.fullTheme : theme.colors.fullThemeInverse} size='normal' />
                </Box>
            </TouchableOpacity>
            <Modal animationType='fade' transparent={true} visible={colorPickerOpen} onRequestClose={() => setColorPickerOpen} >
                <BlurView intensity={10} style={styles.blur} >
                    <Pressable onPress={() => setColorPickerOpen(false)} style={styles.dimmer} />
                    <Box
                        backgroundColor='surface'
                        gap="m"
                        padding='m'
                        width={{ phone: '90%', tablet: 460 }}
                        zIndex={20}
                        justifyContent='center'
                        alignItems='center'
                        paddingTop={"xl"}
                        borderRadius={8}
                        flexDirection="column"
                    >
                        <FlatList
                            data={tabColors}
                            numColumns={5}
                            contentContainerStyle={{ gap: theme.spacing.m }}
                            columnWrapperStyle={{ gap: theme.spacing.m }}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity style={{ backgroundColor: item, height: 48, width: 48, borderRadius: 4 }} onPress={() => { handleChange(item); setColorPickerOpen(false) }}></TouchableOpacity>
                                )
                            }}
                        />
                        <Box margin='xs' flexDirection="row" gap="l" alignSelf={"stretch"}>
                            <Button style={{ flex: 1 }} onPress={() => setColorPickerOpen(false)} variant='neutral' icon={IconSVGCode.arrow_left} iconPosition='left' title="Annuler" />
                        </Box>
                    </Box>
                </BlurView >
            </Modal >
        </>
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
    datePlaceholder: {
        letterSpacing: 1,
    },
    blur: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
    },
    cell: {
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    cellText: {
        fontFamily: FONTS.A500,
        fontSize: 18,
    },
    forbiddenText: {
        textDecorationLine: "line-through"
    },
    title: {
        fontFamily: FONTS.A600,
        fontSize: 16
    },
    input: {
        textAlign: "right",
        borderBottomWidth: 2,
        fontFamily: FONTS.A600,
        paddingHorizontal: PALETTE.spacing.m,
        paddingTop: PALETTE.spacing.m,
        paddingBottom: PALETTE.spacing.m,
        borderRadius: 4,
        fontSize: 18,
        lineHeight: 18
    },
    dimmer: {
        position: "absolute",
        backgroundColor: "#000c",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 10,
    }
});

export default ColorPickerField;