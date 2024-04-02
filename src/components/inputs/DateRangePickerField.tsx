import React, { useEffect, useMemo, useState } from 'react';
import { LayoutRectangle, Modal, Pressable, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View } from 'react-native';
import PALETTE, { FONTS } from "../../Palette";

import { IconSVG, IconSVGCode } from '../../IconSVG';
import { BlurView } from 'expo-blur';
import Button from '../Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomText from '../CustomText';
import chroma from "chroma-js";
import { addDays, addMonths, endOfMonth, endOfWeek, format, startOfMonth, subMonths, startOfWeek, isSameDay, isToday, isPast, isFuture, isBefore, isAfter, startOfDay, endOfDay, isValid, isWithinInterval, formatDistance } from "date-fns";

const fieldHeight = 45;

export type DateRange = {
    from: Date | null,
    to: Date | null
}

interface Props {
    label?: string,
    value: DateRange,
    handleChange: (e: DateRange) => void;
    minNumberOfDays: number
    maxNumberOfDays: number
    forbiddenBefore?: Date
    forbiddenAfter?: Date
    pastForbidden?: boolean,
    todayForbidden?: boolean,
    futureForbidden?: boolean,
}

export const DateRangePickerField = ({
    label,
    value,
    handleChange,
    forbiddenBefore,
    forbiddenAfter,
    pastForbidden = false,
    todayForbidden = false,
    futureForbidden = false,
}: Props) => {

    const fromLabel = "du"
    const toLabel = "au"
    const breakPoint = 180

    const insets = useSafeAreaInsets();
    const [layout, setLayout] = useState<LayoutRectangle>(null)
    const [selectedDate, setSelectedDate] = useState<DateRange>({ from: null, to: null })
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
    const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false)
    const [cellSize, setCellSize] = useState<number>(0)
    const [weeks, setWeeks] = useState([]);

    const monthLabel = useMemo(() => {
        return format(selectedMonth ?? new Date(), "MMMM yyyy")
    }, [selectedMonth])

    const previousMonth = () => {
        setSelectedMonth(subMonths(selectedMonth, 1))
    }
    const nextMonth = () => {
        setSelectedMonth(addMonths(selectedMonth, 1))
    }

    const margins = {
        marginLeft: insets.left + PALETTE.spacing.l,
        marginRight: insets.right + PALETTE.spacing.l
    }
    const handleOpen = () => {
        setDatePickerOpen(true)
    }

    useEffect(() => { // CALENDAR GENERATION
        const month = selectedMonth.getMonth()
        const year = selectedMonth.getFullYear()
        const startDate = startOfWeek(startOfMonth(new Date(year, month)), { weekStartsOn: 1 });
        const endDate = endOfWeek(endOfMonth(new Date(year, month)), { weekStartsOn: 1 });
        const weeksArray = [];
        let week = [];
        let currentDate = startDate;
        while (currentDate <= endDate) {
            week.push({
                date: currentDate,
                isSelectedMonth: currentDate.getMonth() == selectedMonth.getMonth(),
                isToday: isToday(currentDate),
                isInSelectedRange: selectedDate.from != null && selectedDate.to != null && isWithinInterval(currentDate, { start: selectedDate.from, end: selectedDate.to }),
                forbidden: (isPast(currentDate) && !isToday(currentDate) && pastForbidden) ||
                    (isToday(currentDate) && todayForbidden) ||
                    (isFuture(currentDate) && !isToday(currentDate) && futureForbidden) ||
                    (forbiddenBefore && isBefore(currentDate, startOfDay(forbiddenBefore)) && !isToday(currentDate)) ||
                    (forbiddenAfter && isAfter(currentDate, endOfDay(forbiddenAfter)) && !isToday(currentDate))
            });
            if (currentDate.getDay() === 0) {
                weeksArray.push(week);
                week = [];
            }
            currentDate = addDays(currentDate, 1);
        }
        setWeeks(weeksArray);
    }, [selectedMonth, pastForbidden, todayForbidden, futureForbidden, forbiddenBefore, forbiddenAfter, selectedDate]);

    const cellStyle = useMemo(() => {
        if (cellSize) {
            return {
                ...styles.cell,
                width: cellSize,
                height: cellSize
            }
        } else return null
    }, [cellSize, styles.cell])

    const handleDateSelection = (day: { date: Date, isSelectedMonth: boolean }) => {
        if (
            selectedDate.from == null || // SI LA DATE DE DEPART EST NULL
            (selectedDate.from != null && isValid(selectedDate.from) && selectedDate.to != null && isValid(selectedDate.to)) || // SI TOUTES LES DATES EST DEJA OK (RESET DU PICKER)
            (selectedDate.from != null && isValid(selectedDate.from) && isBefore(day.date, selectedDate.from)) // SI LA DATE SELECTIONNEE EST AVANT LA DATE DE DEPART (REPLACEMENT)
        ) {
            setSelectedDate({ from: startOfDay(day.date), to: null })
        } else {
            setSelectedDate(Object.assign({ from: selectedDate.from, to: endOfDay(day.date) }))
        }
    }

    const handleDateValidation = () => {
        handleChange(selectedDate)
        setDatePickerOpen(false)
    }

    const monthGrid = useMemo(() => {
        if (cellSize) {
            return (
                <>
                    <View style={{ flexDirection: "row" }}>
                        <View style={cellStyle}><Text style={[styles.cellText, { color: PALETTE.disabled }]}>L</Text></View>
                        <View style={cellStyle}><Text style={[styles.cellText, { color: PALETTE.disabled }]}>M</Text></View>
                        <View style={cellStyle}><Text style={[styles.cellText, { color: PALETTE.disabled }]}>M</Text></View>
                        <View style={cellStyle}><Text style={[styles.cellText, { color: PALETTE.disabled }]}>J</Text></View>
                        <View style={cellStyle}><Text style={[styles.cellText, { color: PALETTE.disabled }]}>V</Text></View>
                        <View style={cellStyle}><Text style={[styles.cellText, { color: PALETTE.disabled }]}>S</Text></View>
                        <View style={cellStyle}><Text style={[styles.cellText, { color: PALETTE.disabled }]}>D</Text></View>
                    </View>
                    {weeks.map((week, i) => {
                        return (
                            <View key={`week${i}`} style={{ flexDirection: "row" }}>
                                {week.map((day, j) => {
                                    const isSelected = isSameDay(day.date, selectedDate.from) || isSameDay(day.date, selectedDate.to)
                                    return (
                                        <TouchableOpacity key={`week${i}-day${j}`} onPress={() => !day.forbidden ? handleDateSelection(day) : null} style={[
                                            cellStyle,
                                            day.isToday ? styles.today : null,
                                            day.isInSelectedRange ? styles.inRangeSelected : null,
                                            isSelected ? styles.selectedDate : null,
                                        ]}>
                                            <Text style={[
                                                styles.cellText,
                                                day.isSelectedMonth ? null : styles.offSelectedMonthText,
                                                day.isToday ? styles.todayText : null,
                                                day.isInSelectedRange ? styles.inRangeSelectedText : null,
                                                isSelected ? styles.selectedDateText : null,
                                                day.forbidden ? styles.forbiddenText : null
                                            ]}>
                                                {format(day.date, 'dd')}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        )
                    })}
                </>
            )
        } else {
            return <></>
        }
    }, [weeks, cellStyle, selectedDate])

    const labelDependentComputedStyle = useMemo<StyleProp<TextStyle>>(() => {
        let row = 1;
        if (layout && layout.width < breakPoint) {
            row = 2
        } else {
            row = 1
        }
        if (label == undefined || label == null || label.length == 0) {
            return {
                height: row * fieldHeight,
                paddingTop: PALETTE.spacing.m
            }
        } else {
            return {
                height: row * fieldHeight + PALETTE.spacing.xl,
                paddingTop: PALETTE.spacing.m + PALETTE.spacing.l
            }
        }

    }, [label, layout])

    const datesDisplay = useMemo(() => {
        if (!layout) return <></>
        if (layout.width < breakPoint) {
            return (
                <>
                    {label && <Text style={styles.label}>{label}</Text>}
                    <TextInput numberOfLines={2} editable={false} style={[styles.inputTall, labelDependentComputedStyle]} pointerEvents='none' />
                    <View style={{ flexDirection: "row", position: "absolute", right: 0, bottom: 45, left: 0, justifyContent: "space-between", alignItems: "center", height: 45, paddingHorizontal: PALETTE.spacing.m, gap: PALETTE.spacing.m }}>
                        <Text style={styles.prefixPlaceholder}>{fromLabel}</Text>
                        <Text style={[styles.inputText, !value.from && styles.datePlaceholder]}> {value.from ? isValid(value.from) && `${format(value.from, "dd/MM/yyyy")}` : "__/__/____"}</Text>
                    </View>
                    <View style={{ flexDirection: "row", position: "absolute", right: 0, bottom: 0, left: 0, justifyContent: "space-between", alignItems: "center", height: 45, paddingHorizontal: PALETTE.spacing.m, gap: PALETTE.spacing.m }}>
                        <Text style={styles.prefixPlaceholder}>{toLabel}</Text>
                        <Text style={[styles.inputText, !value.to && styles.datePlaceholder]}> {value.to ? isValid(value.to) && `${format(value.to, "dd/MM/yyyy")}` : "__/__/____"}</Text>
                    </View>
                </>
            )
        } else {
            return (
                <>
                    {label && <Text style={styles.label}>{label}</Text>}
                    <TextInput numberOfLines={2} editable={false} style={[styles.inputWide, labelDependentComputedStyle]} pointerEvents='none' />
                    <View style={{ flexDirection: "row", position: "absolute", right: 0, bottom: 0, left: 0, justifyContent: "space-between", alignItems: "center", height: 45, paddingHorizontal: PALETTE.spacing.m, gap: PALETTE.spacing.m }}>
                        <Text style={styles.prefixPlaceholder}>{fromLabel}</Text>
                        <Text style={[styles.inputText, !value.from && styles.datePlaceholder]}> {value.from ? isValid(value.from) && `${format(value.from, "dd/MM/yyyy")}` : "__/__/____"}</Text>
                        <Text style={styles.prefixPlaceholder}>{toLabel}</Text>
                        <Text style={[styles.inputText, !value.to && styles.datePlaceholder]}> {value.to ? isValid(value.to) && `${format(value.to, "dd/MM/yyyy")}` : "__/__/____"}</Text>
                    </View>
                </>
            )
        }
    }, [labelDependentComputedStyle, value])

    return (
        <>
            <TouchableOpacity style={{}} onPress={handleOpen} onLayout={(e) => { setLayout(e.nativeEvent.layout) }}>
                {layout && datesDisplay}
            </TouchableOpacity>
            <Modal animationType='fade' transparent={true} visible={datePickerOpen} onRequestClose={() => setDatePickerOpen} >
                <BlurView intensity={10} style={styles.blur} >
                    <Pressable onPress={() => setDatePickerOpen(false)} style={styles.dimmer} />
                    <View style={[{ zIndex: 10, ...margins, justifyContent: "center", alignSelf: "stretch" }]}>
                        <View style={styles.modalBody}>
                            <View style={{ gap: PALETTE.spacing.m }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: PALETTE.spacing.l, marginHorizontal: PALETTE.spacing.m }}>
                                    <Button icon={IconSVGCode.chevron_left} onPress={previousMonth} outline size="s" />
                                    <CustomText style={{ fontSize: 24, lineHeight: 28, marginTop: 8 }}>{monthLabel}</CustomText>
                                    <Button icon={IconSVGCode.chevron_right} onPress={nextMonth} outline size="s" />
                                </View>
                                <View style={{ borderBottomWidth: 1, borderColor: PALETTE.disabled }} />
                                <View onLayout={(e) => setCellSize((e.nativeEvent.layout.width / 7) - 4)} style={{ flexDirection: "column", marginHorizontal: PALETTE.spacing.s, marginVertical: PALETTE.spacing.l }}>
                                    {monthGrid}
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <View style={{ flex: 1, alignItems: "center" }}>
                                    <Text style={styles.cellText}>{selectedDate.from ? format(selectedDate.from, "dd/MM/yyyy") : "-"}</Text>
                                </View>
                                <IconSVG icon={IconSVGCode.chevron_right} size='normal' />
                                <View style={{ flex: 1, alignItems: "center" }}>
                                    <Text style={styles.cellText}>{selectedDate.to ? format(selectedDate.to, "dd/MM/yyyy") : "-"}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", gap: PALETTE.spacing.l, margin: PALETTE.spacing.xs }}>
                                <Button style={{ flex: 1 }} onPress={() => setDatePickerOpen(false)} variant='danger' title="Fermer" />
                                <Button disabled={selectedDate == null} style={{ flex: 1 }} onPress={handleDateValidation} variant='primary' title={selectedDate.from && selectedDate.to ? `Validate ${formatDistance(selectedDate.from, selectedDate.to)}` : "-"} />
                            </View>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    inputTall: {
        height: 80,
        textAlign: "right",
        borderBottomWidth: 2,
        borderBottomColor: PALETTE.textOnPanel,
        backgroundColor: PALETTE.item,
        color: PALETTE.fullThemeInverse,
        fontFamily: FONTS.A600,
        fontSize: 18,
        minWidth: 168,
        paddingHorizontal: PALETTE.spacing.m,
        paddingTop: PALETTE.spacing.m,
        paddingBottom: PALETTE.spacing.m - 2,
        borderRadius: 4,
    },
    inputWide: {
        height: 80,
        textAlign: "right",
        borderBottomWidth: 2,
        borderBottomColor: PALETTE.textOnPanel,
        backgroundColor: PALETTE.item,
        color: PALETTE.fullThemeInverse,
        fontFamily: FONTS.A600,
        fontSize: 18,
        minWidth: 168,
        paddingHorizontal: PALETTE.spacing.m,
        paddingTop: PALETTE.spacing.m,
        paddingBottom: PALETTE.spacing.m - 2,
        borderRadius: 4,
    },
    label: {
        position: "absolute",
        fontFamily: FONTS.A700,
        color: PALETTE.primary,
        zIndex: 1000,
        top: PALETTE.spacing.s + 2,
        left: PALETTE.spacing.s,
    },
    inputText: {
        fontSize: 18,
        lineHeight: 18,
        color: PALETTE.fullThemeInverse,
        fontFamily: FONTS.A600,
    },
    prefixPlaceholder: {
        fontFamily: FONTS.A600,
        fontSize: 16,
        lineHeight: 16,
        color: chroma(PALETTE.fullThemeInverse).alpha(.4).hex()
    },
    datePlaceholder: {
        letterSpacing: .8,
        fontSize: 18,
        lineHeight: 18,
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
    cellText: {
        fontFamily: FONTS.A500,
        fontSize: 18,
        color: PALETTE.textOnSurface
    },
    offSelectedMonthText: {
        color: PALETTE.disabled
    },
    selectedDate: {
        backgroundColor: PALETTE.primary
    },
    selectedDateText: {
        color: PALETTE.textOnPrimary
    },
    today: {
        backgroundColor: chroma(PALETTE.warning).alpha(.1).hex()
    },
    todayText: {
        color: PALETTE.warning
    },
    inRangeSelected: {
        backgroundColor: chroma(PALETTE.primary).alpha(.1).hex()
    },
    inRangeSelectedText: {
        color: PALETTE.primary
    },
    forbiddenText: {
        color: chroma(PALETTE.danger).alpha(.45).hex(),
        textDecorationLine: "line-through"
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

export default DateRangePickerField;