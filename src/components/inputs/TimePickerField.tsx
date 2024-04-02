import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View } from 'react-native';
import PALETTE, { FONTS } from "../../Palette";

import { IconSVG, IconSVGCode } from '../../IconSVG';
import { BlurView } from 'expo-blur';
import Button from '../Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import chroma from "chroma-js";
import { format, isValid, parse } from "date-fns";

import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

const fieldHeight = 45;

interface Props {
    label?: string,
    value: string,
    handleChange: (e: string) => void;
    defaultValue?: string //format "HH:mm"
    from?: string
    to?: string
    minutesStep?: 1 | 5 | 10 | 15 | 20 | 30 | 60
}

export const TimePickerField = ({
    label,
    value,
    defaultValue,
    handleChange,
    from,
    to,
    minutesStep = 15
}: Props) => {

    const insets = useSafeAreaInsets();
    const [selectedHour, setSelectedHour] = useState<number | null>(null)
    const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null)
    const [datePickerOpen, setTimePickerOpen] = useState<boolean>(false)
    const [cellSize, setCellSize] = useState<number>(48)
    const [loading, setLoading] = useState<boolean>(true)

    const handleOpen = () => {
        setTimePickerOpen(true)
    }

    const scrollViewH = useRef(null)
    const scrollViewM = useRef(null)

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>, HM: "H" | "M") => {
        if (HM == "H") {
            setSelectedHour(hours[Math.round((event.nativeEvent.contentOffset.y - cellSize) / cellSize) + 1])
        } else {
            setSelectedMinutes(minutes[Math.round((event.nativeEvent.contentOffset.y - cellSize) / cellSize) + 1])
        }
    }

    useEffect(() => {
        let tmpH = null
        let tmpM = null
        let initialDate = null
        let defaultValueIsAValidDate = defaultValue != undefined && defaultValue != null && isValid(parse(defaultValue, "HH:mm", new Date()))
        let valueIsAValidDate = value != undefined && value != null && isValid(parse(value, "HH:mm", new Date()))
        if (valueIsAValidDate) {
            initialDate = value
        } else {
            if (defaultValueIsAValidDate) {
                initialDate = defaultValue
            }
        }
        if (initialDate != null) {
            const defaultTime = parse(initialDate, "HH:mm", new Date())
            const minute = defaultTime.getMinutes();
            const remainder = minute % minutesStep;
            if (remainder !== 0) {
                const minutesToAdd = minutesStep - remainder;
                defaultTime.setMinutes(minute + minutesToAdd);
            }
            tmpH = defaultTime.getHours();
            tmpM = defaultTime.getMinutes();
        } else {
            const roundedDate = new Date();
            const minute = roundedDate.getMinutes();
            const remainder = minute % minutesStep;
            if (remainder !== 0) {
                const minutesToAdd = minutesStep - remainder;
                roundedDate.setMinutes(minute + minutesToAdd);
            }
            tmpH = roundedDate.getHours();
            tmpM = roundedDate.getMinutes();
        }
        setSelectedHour(tmpH)
        setSelectedMinutes(tmpM)
        setLoading(false)
    }, [value, defaultValue])

    const handleOnLayoutScroll = (HM: "H" | "M") => {
        if (HM == "H") {
            scrollViewH.current.scrollTo({ y: hours.findIndex(x => x == selectedHour) * cellSize, x: 0, animated: true })
        } else {
            scrollViewM.current.scrollTo({ y: minutes.findIndex(x => x == selectedMinutes) * cellSize, x: 0, animated: true })
        }
    }

    const computedTime = useMemo(() => {
        if (selectedHour != undefined && selectedMinutes != undefined) {
            return `${selectedHour.toString().padStart(2, '0')}:${selectedMinutes.toString().padStart(2, '0')}`
        }
    }, [selectedHour, selectedMinutes])

    const hours = useMemo(() => {
        let tmp = []
        for (let h = 0; h < 24; h++) {
            tmp.push(h)
        }
        return tmp
    }, [])
    const minutes = useMemo(() => {
        let tmp = [];
        for (let m = 0; m < 60; m = m + minutesStep) {
            tmp.push(m)
        }
        return tmp
    }, [minutesStep])

    const clock = useMemo(() => {
        if (cellSize && !loading) {
            return (
                <View style={{ flexDirection: 'row', alignSelf: 'center', width: cellSize * 4, gap: cellSize / 3, marginTop: PALETTE.spacing.m, justifyContent: "center", alignItems: "center", position: "relative" }}>
                    <ScrollView
                        onLayout={(e) => handleOnLayoutScroll("H")}
                        onScroll={(e) => handleScroll(e, "H")}
                        ref={scrollViewH}
                        snapToInterval={cellSize}
                        snapToAlignment={"center"}
                        decelerationRate={"normal"}
                        showsVerticalScrollIndicator={false}
                        style={{ width: cellSize * 2, height: cellSize * 3 }}
                        contentContainerStyle={{
                            paddingVertical: cellSize,
                        }}
                    >
                        {hours.map((h, i) => {
                            return (
                                <TouchableOpacity onPress={() => scrollViewH.current.scrollTo({ y: i * cellSize, x: 0, animated: true })} style={{ height: cellSize, flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: PALETTE.textOnSurface, fontFamily: FONTS.A600, fontSize: 32, lineHeight: 32, letterSpacing: 1.5, marginTop: 6, alignSelf: "stretch", textAlign: "center" }}>{h.toString().padStart(2, "0")}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                    <Text style={{ fontSize: cellSize - 4, lineHeight: cellSize, fontFamily: FONTS.A700, color: PALETTE.textOnSurface }}>:</Text>
                    <ScrollView
                        onLayout={(e) => handleOnLayoutScroll("M")}
                        onScroll={(e) => handleScroll(e, "M")}
                        ref={scrollViewM}
                        snapToInterval={cellSize}
                        snapToAlignment={"center"}
                        decelerationRate={"normal"}
                        showsVerticalScrollIndicator={false}
                        style={{ width: cellSize * 2, height: cellSize * 3 }}
                        contentContainerStyle={{
                            paddingVertical: cellSize,
                        }}
                    >
                        {minutes.map((m, i) => {
                            return (
                                <TouchableOpacity onPress={() => scrollViewM.current.scrollTo({ y: i * cellSize, x: 0, animated: true })} style={{ height: cellSize, flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: PALETTE.textOnSurface, fontFamily: FONTS.A600, fontSize: 32, lineHeight: 32, letterSpacing: 1.5, marginTop: 6, alignSelf: "stretch", textAlign: "center" }}>{m.toString().padStart(2, "0")}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                    <View pointerEvents='none' style={{ position: "absolute", top: 0, left: 0, right: 0, height: cellSize * 1.6, zIndex: 1000 }}>
                        <LinearGradient
                            locations={[0, 0.7]}
                            colors={[PALETTE.surface, chroma(PALETTE.surface).alpha(.0).hex()]}
                            style={{ alignSelf: "stretch", flex: 1 }}
                        />
                    </View>
                    <View pointerEvents='none' style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: cellSize * 1.6, zIndex: 1000 }}>
                        <LinearGradient
                            locations={[0.3, 1]}
                            colors={[chroma(PALETTE.surface).alpha(.0).hex(), PALETTE.surface]}
                            style={{ alignSelf: "stretch", flex: 1 }}
                        />
                    </View>
                </View>
            )
        } else {
            return <></>
        }
    }, [cellSize, loading])

    const margins = {
        marginLeft: insets.left + PALETTE.spacing.l,
        marginRight: insets.right + PALETTE.spacing.l
    }

    const labelDependentComputedStyle = useMemo<StyleProp<TextStyle>>(() => {
        if (label == undefined || label == null || label.length == 0) {
            return {
                height: 46,
                paddingTop: PALETTE.spacing.m
            }
        } else {
            return {
                height: 68,
                paddingTop: PALETTE.spacing.m + PALETTE.spacing.l
            }
        }

    }, [label])

    return (
        <>
            <TouchableOpacity style={{ position: 'relative' }} onPress={handleOpen}>
                {label && <Text style={styles.label}>{label}</Text>}
                <TextInput editable={false} value={value ? isValid(value) ? format(value, "dd/MM/yyyy") : value.toString() : "__:__"} style={[styles.input, labelDependentComputedStyle, !value && styles.datePlaceholder]} pointerEvents='none' />
                <IconSVG icon={IconSVGCode.clock} fill={PALETTE.disabled} style={{ position: "absolute", bottom: PALETTE.spacing.l, left: PALETTE.spacing.m }} size='normal' />
            </TouchableOpacity>
            <Modal animationType='fade' transparent={true} visible={datePickerOpen} onRequestClose={() => setTimePickerOpen} >
                <BlurView intensity={10} style={styles.blur} >
                    <Pressable onPress={() => setTimePickerOpen(false)} style={styles.dimmer} />
                    <View style={[{ zIndex: 10, ...margins, justifyContent: "center", alignSelf: "stretch" }]}>
                        <View style={styles.modalBody}>
                            <View style={{ gap: PALETTE.spacing.m }}>
                                <View style={{ flexDirection: "column", marginHorizontal: PALETTE.spacing.s, marginVertical: PALETTE.spacing.l }}>
                                    {clock}
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", gap: PALETTE.spacing.l, margin: PALETTE.spacing.xs }}>
                                <Button style={{ flex: 1 }} onPress={() => setTimePickerOpen(false)} variant='danger' title="Fermer" />
                                <Button disabled={computedTime == null} style={{ flex: 1 }} onPress={() => { handleChange(computedTime); setLoading(true); setTimePickerOpen(false); }} variant='primary' title={computedTime ? computedTime : "--:--"} />
                            </View>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    label: {
        position: "absolute",
        fontFamily: FONTS.A700,
        color: PALETTE.primary,
        zIndex: 1000,
        top: PALETTE.spacing.s + 2,
        left: PALETTE.spacing.s,
    },
    datePlaceholder: {
        letterSpacing: 2,
        color: chroma(PALETTE.fullThemeInverse).alpha(.4).hex()
    },
    blur: {
        height: "100%",
        width: "100%",
        backgroundColor: "#000c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    cell: {
        margin: 2,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: PALETTE.textOnSurface,
        fontFamily: FONTS.A600,
        fontSize: 16
    },
    rowWrapper: {
        height: 64,
        marginHorizontal: PALETTE.spacing.xs,
        paddingHorizontal: PALETTE.spacing.xs,
        paddingVertical: PALETTE.spacing.xs,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    input: {
        textAlign: "right",
        borderBottomWidth: 2,
        borderBottomColor: PALETTE.textOnPanel,
        backgroundColor: PALETTE.item,
        color: PALETTE.fullThemeInverse,
        fontFamily: FONTS.A600,
        minWidth: 168,
        paddingHorizontal: PALETTE.spacing.m,
        paddingTop: PALETTE.spacing.m,
        paddingBottom: PALETTE.spacing.m - 2,
        borderRadius: 4,
        fontSize: 18,
        lineHeight: 18
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
        flexDirection: "column",
        gap: PALETTE.spacing.l,
        backgroundColor: PALETTE.surface,
        padding: PALETTE.spacing.s,
        borderRadius: 8
    },
});

export default TimePickerField;