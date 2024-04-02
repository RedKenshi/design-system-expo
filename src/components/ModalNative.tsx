import React from 'react';
import { Modal as NativeModal, Pressable, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import PALETTE, { FONTS } from "../Palette";

import { IconSVGCode } from '../IconSVG';
import { BlurView } from 'expo-blur';
import Button, { ButtonVariant } from './Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

    const margins = {
        marginLeft: insets.left + PALETTE.spacing.l,
        marginRight: insets.right + PALETTE.spacing.l
    }

    const modalStyle = {

    } as ViewStyle;

    if (open) {
        return (
            <NativeModal animationType='fade' transparent={true} visible={open} onRequestClose={() => setOpen(false)} >
                <BlurView intensity={10} style={styles.blur} >
                    <Pressable onPress={() => setOpen(false)} style={styles.dimmer} />
                    <View style={[{ ...margins }, styles.modalBody]}>
                        <ScrollView contentContainerStyle={{ paddingBottom: "15%" }} automaticallyAdjustKeyboardInsets={true}>
                            {children}
                        </ScrollView>
                        <View style={styles.actionsRow}>
                            {actions.map((action, i) => {
                                return (
                                    <Button key={`actions-${i}-${action.title}`} iconPosition="right" style={{ flex: 1 }} onPress={action.onPress} icon={action.icon} title={action.title} variant={action.variant} />
                                )
                            })}
                        </View>
                    </View>
                </BlurView>
            </NativeModal>
        );
    } else {
        return null
    }
};

export default ModalNative;

const styles = StyleSheet.create({
    actionsRow: {
        flexDirection: "row",
        padding: PALETTE.spacing.s,
        paddingTop: PALETTE.spacing.l,
        gap: PALETTE.spacing.xxs
    },
    blur: {
        height: "100%",
        width: "100%",
        backgroundColor: "#000c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        color: PALETTE.textOnSurface,
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
        backgroundColor: PALETTE.surface,
        borderRadius: 8,
        maxHeight: "80%",
        gap: PALETTE.spacing.l,
        padding: PALETTE.spacing.s,
        zIndex: 10, justifyContent: "center"
    },
});
