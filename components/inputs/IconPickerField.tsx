import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { BlurView } from 'expo-blur';
import { useResponsiveProp, useTheme } from '@shopify/restyle';

import PALETTE, { FONTS, FieldSizes, Theme } from "../../constants/Palette";
import { IconSVGCode } from '../IconSVG';
import Button from '../Button';
import Box from '../Box';
import { tabColors } from '../../constants/utils';
import { FoodSVG, FoodSVGCode } from '../FoodSVG';

interface Props {
    label?: string,
    value: FoodSVGCode,
    handleChange: (e: string) => void;
    onBackground: boolean;
}

export const IconPickerField = ({
    label,
    value,
    handleChange,
    onBackground
}: Props) => {

    const theme = useTheme<Theme>();

    const [selectedIcon, setSelectedIcon] = useState<FoodSVGCode | null>(null)
    const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false)

    const width = useResponsiveProp(FieldSizes.width)
    const height = useResponsiveProp(FieldSizes.height)
    const labelHeight = useResponsiveProp(FieldSizes.labelHeight)

    const handleOpen = () => {
        setColorPickerOpen(true)
    }

    const handleIconSelection = (icon: FoodSVGCode) => {
        setSelectedIcon(icon)
    }

    return (
        <>
            <TouchableOpacity style={{}} onPress={handleOpen}>
                {label && <Text style={[styles.label, { color: theme.colors.primary }]}>{label}</Text>}

                <Box style={[styles.input, { borderBottomColor: theme.colors.textFadded, backgroundColor: onBackground ? theme.colors.surface : theme.colors.background }]} flexDirection='row' justifyContent="center" alignItems="center" >
                    <FoodSVG icon={value ?? FoodSVGCode.none} fill={theme.colors.textOnBackground} size='normal' />
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
                            data={Object.keys(FoodSVGCode) as FoodSVGCode[]}
                            numColumns={5}
                            contentContainerStyle={{ gap: theme.spacing.s }}
                            columnWrapperStyle={{ gap: theme.spacing.s }}
                            renderItem={({ item }) => {
                                if (item == FoodSVGCode.none) return
                                return (
                                    <TouchableOpacity style={{ height: 32, width: 32, backgroundColor: theme.colors.background, borderRadius: 4, justifyContent: "center", alignItems: "center", padding: theme.spacing.xl }} onPress={() => { handleChange(item); setColorPickerOpen(false) }}>
                                        <FoodSVG icon={item} size='normal' fill={theme.colors.textOnSurface} />
                                    </TouchableOpacity>
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
        paddingHorizontal: PALETTE.spacing.l,
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

export default IconPickerField;