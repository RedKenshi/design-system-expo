import React from 'react';
import { Modal as NativeModal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Theme } from "../constants/Palette";

import { IconSVGCode } from './IconSVG';
import { BlurView } from 'expo-blur';
import Button, { ButtonVariant } from './Button';
import Box from './Box';
import { useTheme } from '@shopify/restyle';

type ModalAction = {
    variant: ButtonVariant
    title: string
    icon?: IconSVGCode
    onPress: Function
}

interface Props {
    open: boolean,
    close: () => void,
    actions?: ModalAction[]
    preventCloseOnDimmerPress?: boolean;
    children: JSX.Element | JSX.Element[],
}

export const ModalNative = ({ open, close, actions, preventCloseOnDimmerPress = false, children }: Props) => {

    const theme = useTheme<Theme>();

    if (open) {
        return (
            <NativeModal animationType='fade' transparent={true} visible={open} onRequestClose={() => close()} >
                <BlurView intensity={10} style={styles.blur} >
                    <Pressable onPress={() => !preventCloseOnDimmerPress && close()} style={styles.dimmer} />
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
                    >
                        <ScrollView style={{ width: "100%", alignSelf: "stretch" }} contentContainerStyle={{ paddingBottom: "5%", paddingHorizontal: theme.spacing.s }} automaticallyAdjustKeyboardInsets={true}>
                            {children}
                        </ScrollView>
                        <Box flexDirection="row" padding='s' paddingTop='l' gap='xxs' alignSelf={"stretch"}>
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    dimmer: {
        backgroundColor: "#000c",
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 10
    }
});
