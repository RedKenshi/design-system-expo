
import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import PALETTE, { FONTS, Theme } from "../Palette";
import { useTheme } from '@shopify/restyle';

interface Props {
    children: JSX.Element | JSX.Element[],
    style?: ViewStyle,
    side?: "left" | "right"
    color?: string
}

export const BorderedBlock = ({
    children,
    style,
    side = "left",
    color
}: Props) => {

    const theme = useTheme<Theme>();

    const computedStyles = useMemo<ViewStyle>(() => {
        let tmp: ViewStyle = {
        }
        switch (side) {
            case 'left':
                tmp = { borderLeftWidth: 4, paddingRight: PALETTE.spacing.xxs }
                break;
            case 'right':
                tmp = { borderRightWidth: 4, paddingLeft: PALETTE.spacing.xxs }
                break;
        }
        return { ...tmp, borderColor: color ?? theme.colors.primary }
    }, [side])

    return (
        <View style={{ ...styles.bordered, ...computedStyles, ...style }} >
            {children}
        </View>
    );
};

export default BorderedBlock;

const styles = StyleSheet.create({
    bordered: {
        marginVertical: PALETTE.spacing.s,
        marginHorizontal: PALETTE.spacing.xs,
        paddingHorizontal: PALETTE.spacing.s
    },
})