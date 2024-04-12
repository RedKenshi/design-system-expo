import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Theme } from "../../constants/Palette";
import { useTheme } from '@shopify/restyle';
import { Category } from '../../constants/types';
import CustomText from '../CustomText';

interface Props {
    style?: ViewStyle;
    category: Category,
    height: number
    selected: boolean,
    onPress: (categoryId: string) => void
}

export const CategoryTile: React.FC<Props> = ({
    category,
    style,
    height,
    selected,
    onPress,
}) => {

    const theme = useTheme<Theme>();

    const computedStyle = useMemo(() => {
        let tmp: ViewStyle = {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.primary,
            borderBottomWidth: 2,
            height: height
        }
        if (selected) {
            tmp = {
                ...tmp,
                borderWidth: 2,
                borderRightWidth: 16,
            }
        }
        return tmp
    }, [theme, selected])

    return (
        <TouchableOpacity style={{ ...styles.categoryWrapper, ...computedStyle, ...style }} onPress={() => onPress(category.id)}>
            <CustomText font='A600' size={18}>{category.name}</CustomText>
        </TouchableOpacity>
    );
};

export default CategoryTile;

const styles = StyleSheet.create({
    categoryWrapper: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6
    },
});