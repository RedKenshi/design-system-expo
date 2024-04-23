import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Theme } from "../../constants/Palette";
import { useTheme } from '@shopify/restyle';
import { Category } from '../../constants/types';
import CustomText from '../CustomText';
import chroma from "chroma-js"

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
            backgroundColor: selected ? chroma.mix(category.color, "#fff", .1).hex() : chroma(category.color).alpha(.1).hex(),
            borderColor: selected ? chroma(category.color).darken().hex() : category.color,
            borderBottomWidth: selected ? 0 : 3,
            height: height
        }
        if (selected) {
            tmp = {
                ...tmp,
                borderRightWidth: 12,
            }
        }
        return tmp
    }, [theme, selected])

    return (
        <TouchableOpacity style={{ ...styles.categoryWrapper, ...computedStyle, ...style }} onPress={() => onPress(category.id)}>
            <CustomText color={selected ? "white" : undefined} font='A600' size={18}>{category.name}</CustomText>
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