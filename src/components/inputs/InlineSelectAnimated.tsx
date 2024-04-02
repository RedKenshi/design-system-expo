
import React, { useEffect, useMemo, useState } from 'react';
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

    const [optionsPositions, setOptionsPositions] = useState([])
    const [selectedIndex, setSelectedIndex] = useState<number>(-1)
    const width = useSharedValue(0);
    const left = useSharedValue(0);

    useEffect(() => {
        setSelectedIndex(options.findIndex(x => x.value == selected))
    }, [selected])

    const setLayoutForIndex = (e: LayoutRectangle, index: number) => {
        let tmp = JSON.parse(JSON.stringify(optionsPositions))
        tmp[index] = { left: e.x, width: e.width }
        setOptionsPositions(tmp)
    }

    useEffect(() => {
        let selectedIndex = options.findIndex(x => x.value == selected)
        if (optionsPositions[selectedIndex] != undefined && optionsPositions[selectedIndex].width && optionsPositions[selectedIndex].left) {
            width.value = withTiming(optionsPositions[selectedIndex].width, { duration: 250 })
            left.value = withTiming(optionsPositions[selectedIndex].left, { duration: 250 })
        }
    }, [selectedIndex, optionsPositions])

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
        backgroundColor: PALETTE.primary,
        height: height - (2 * space),
        borderRadius: (height - (2 * space)) / 2,
    },
    selectedText: {
        color: PALETTE.textOnPrimary
    },
    optionText: {
        color: PALETTE.fullThemeInverse,
        fontFamily: FONTS.A600,
        marginTop: 3,
        fontSize: 14,
        lineHeight: 14,
    },
    input: {
        height: height,
        minWidth: height,
        borderRadius: height / 2,
        backgroundColor: PALETTE.item,
        paddingLeft: 2 * space,
        paddingRight: space,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: space
    }
});

export default InlineSelectAnimated;