
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutRectangle, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PALETTE, { FONTS } from "../../Palette";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const height = 40;
const space = PALETTE.spacing.xs + 2;

interface Props {
    handleChange: (e: React.FormEvent<HTMLInputElement>) => void
    options: { label: string, value: any }[];
    selected: any
}

export const InlineSelectAnimated = ({
    handleChange,
    selected,
    options,
}: Props) => {

    const [selectedIndex, setSelectedIndex] = useState<number>(-1)
    const width = useSharedValue(0);
    const left = useSharedValue(0);
    const optionsPositions = useRef([])

    useEffect(() => {
        setSelectedIndex(options.findIndex(x => x.value == selected))
    }, [selected])

    const setLayoutForIndex = (e: LayoutRectangle, index: number) => {
        let tmp = JSON.parse(JSON.stringify(optionsPositions.current))
        optionsPositions.current = [...tmp, { index: index, left: e.x, width: e.width }]
    }

    useEffect(() => {
        let selectedIndex = options.findIndex(x => x.value == selected)
        let positions = optionsPositions.current.find(x => x.index == selectedIndex)
        if (positions != undefined && positions.width && positions.left) {
            width.value = withTiming(optionsPositions.current.find(x => x.index == selectedIndex).width, { duration: 250 })
            left.value = withTiming(optionsPositions.current.find(x => x.index == selectedIndex).left, { duration: 250 })
        }
    }, [selectedIndex])

    const animatedStyles = useAnimatedStyle(() => ({
        width: width.value,
        left: left.value
    }));

    return (
        <View style={styles.input}>
            <Animated.View style={[styles.selectedBack, animatedStyles]} />
            {options.map((o: { label: string, value: any }, i: number) => {
                return (
                    <TouchableOpacity key={`${i}-${o.label}`} onLayout={(e) => setLayoutForIndex(e.nativeEvent.layout, i)} style={[styles.option]} onPress={() => handleChange(o.value)}>
                        <Text style={[styles.optionText, selected == o.value ? styles.selectedText : null]}>{o.label}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    option: {
        height: height - (2 * space),
        minWidth: height - (2 * space),
        paddingHorizontal: space * 2,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    selectedBack: {
        position: "absolute",
        top: space,
        backgroundColor: PALETTE.colors.primary,
        height: height - (2 * space),
        borderRadius: (height - (2 * space)) / 2,
    },
    selectedText: {
        color: PALETTE.colors.textOnPrimary
    },
    optionText: {
        color: PALETTE.colors.fullThemeInverse,
        fontFamily: FONTS.A600,
        marginTop: 3,
        fontSize: 14,
        lineHeight: 14,
    },
    input: {
        height: height,
        minWidth: height,
        borderRadius: height / 2,
        backgroundColor: PALETTE.colors.item,
        paddingLeft: 2 * space,
        paddingRight: space,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: space
    }
});

export default InlineSelectAnimated;