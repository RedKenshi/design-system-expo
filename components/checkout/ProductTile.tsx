import React, { useMemo } from 'react';
import { GestureResponderEvent, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Theme } from "../../constants/Palette";
import Box from '../Box';
import { useTheme } from '@shopify/restyle';
import { Product } from '../../constants/types';
import CustomText from '../CustomText';
import { IconSVG, IconSVGCode } from '../IconSVG';

interface Props {
    style?: ViewStyle;
    product: Product,
    onPress: (event: GestureResponderEvent) => void
}

export const ProductTile: React.FC<Props> = ({
    product,
    style,
    onPress
}) => {
    const theme = useTheme<Theme>();

    const computedStyle = useMemo(() => {
        let tmp: ViewStyle = {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.primary,
            borderBottomWidth: 16,
        }
        return tmp
    }, [theme])

    return (
        <TouchableOpacity onPress={onPress}>
            <Box style={[styles.productWrapper, computedStyle, style]} backgroundColor={'blue'}>
                <TouchableOpacity style={{ position: "absolute", top: 0, right: 0, padding: 6 }}>
                    <IconSVG icon={IconSVGCode.infos} size='smaller' fill={theme.colors.primary} />
                </TouchableOpacity>
                <CustomText size={16} lineHeight={18} font='A600' style={{ textAlign: "center", alignSelf: 'center', top: 4 }}>{product.label}</CustomText>
            </Box>
        </TouchableOpacity>
    );
};

export default ProductTile;

const styles = StyleSheet.create({
    productWrapper: {
        borderRadius: 4,
        height: 88,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    }
});