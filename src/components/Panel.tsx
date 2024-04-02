
import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import PALETTE, { FONTS } from "../Palette";

interface Props {
    children: JSX.Element | JSX.Element[],
    style: ViewStyle
}

export const Panel = ({
    children,
    style
}: Props) => {


    return (
        <View style={{ ...styles.panel, ...style }} >
            {children}
        </View>
    );
};

export default Panel;

const styles = StyleSheet.create({
    panel: {
        backgroundColor: PALETTE.surface,
        marginHorizontal: PALETTE.spacing.m,
        marginVertical: PALETTE.spacing.s,
        paddingHorizontal: PALETTE.spacing.s,
        paddingVertical: PALETTE.spacing.l,
        borderRadius: 8
    },
})