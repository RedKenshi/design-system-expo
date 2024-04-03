import React, { useState } from 'react';
import { LayoutRectangle, Modal as NativeModal, Pressable, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import PALETTE, { FONTS } from "../Palette";

import { IconSVGCode } from '../IconSVG';
import { BlurView } from 'expo-blur';
import Button, { ButtonVariant } from './Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Box from './Box';

type ModalAction = {
    variant: ButtonVariant
    title: string
    icon?: IconSVGCode
    onPress: Function
}

interface Props {
    open: boolean,
    setOpen: (value: boolean) => void,
    actions?: ModalAction[]
    preventCloseOnDimmerPress?: boolean;
    children: JSX.Element | JSX.Element[],
}

export const ModalNative = ({ open, setOpen, actions, preventCloseOnDimmerPress = false, children }: Props) => {

    const insets = useSafeAreaInsets();
    const [modalBodyLayout, setModalBodyLayout] = useState<LayoutRectangle>()

    const modalStyle = {

    } as ViewStyle;

    if (open) {
        return (
            <NativeModal animationType='fade' transparent={true} visible={open} onRequestClose={() => setOpen(false)} >
                <BlurView intensity={10} style={styles.blur} >
                    <Pressable onPress={() => setOpen(false)} style={styles.dimmer} />
                    <Box
                        backgroundColor='surface'
                        gap="m"
                        padding='m'
                        maxHeight="80%"
                        width={{ phone: '90%', tablet: 460 }}
                        zIndex={20}
                        justifyContent='center'
                        alignItems='center'
                        borderRadius={8}
                        flexDirection="column"
                        onLayout={(e) => setModalBodyLayout(e.nativeEvent.layout)}
                    >
                        <ScrollView style={{ width: "100%", alignSelf: "stretch" }} contentContainerStyle={{ paddingBottom: "5%", paddingHorizontal: PALETTE.spacing.s }} automaticallyAdjustKeyboardInsets={true}>
                            {children}
                        </ScrollView>
                        <Box flexDirection="row" padding='s' paddingTop='l' gap='xxs'>
                            {actions.map((action, i) => {
                                return (
                                    <Button key={`actions-${i}-${action.title}`} iconPosition="right" style={{ flex: 1 }} onPress={action.onPress} icon={action.icon} title={action.title} variant={action.variant} />
                                )
                            })}
                        </Box>
                    </Box>
                </BlurView>
            </NativeModal>
        );
    } else {
        return null
    }
};

export default ModalNative;

const styles = StyleSheet.create({
    blur: {
        height: "100%",
        width: "100%",
        backgroundColor: "#000c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        color: PALETTE.colors.textOnSurface,
        fontFamily: FONTS.A600,
        fontSize: 16
    },
    dimmer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 10
    },
    modal: {
        backgroundColor: "#000c",
    },
    modalBody: {
        alignSelf: "stretch",
        backgroundColor: PALETTE.colors.surface,
        borderRadius: 8,
        maxHeight: "80%",
        gap: PALETTE.spacing.l,
        padding: PALETTE.spacing.s,
        zIndex: 10, justifyContent: "center"
    },
});
