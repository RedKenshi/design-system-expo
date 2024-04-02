import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View } from 'react-native';
import PALETTE, { FONTS } from "../../Palette";

import { IconSVG, IconSVGCode } from '../../IconSVG';
import { BlurView } from 'expo-blur';
import Button from '../Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomText from '../CustomText';
import chroma from "chroma-js";
import { addDays, addMonths, endOfMonth, endOfWeek, format, startOfMonth, subMonths, startOfWeek, isSameDay, isToday, isPast, isFuture, isBefore, isAfter, startOfDay, endOfDay, isValid } from "date-fns";

const fieldHeight = 45;

interface Props {
    label?: string,
    value: Date,
    handleChange: (e: Date) => void;
    from?: Date
    to?: Date
    pastForbidden?: boolean,
    todayForbidden?: boolean,
    futureForbidden?: boolean,
}

export const DatePickerField = ({
    label,
    value,
    handleChange,
    from,
    to,
    pastForbidden = false,
    todayForbidden = false,
    futureForbidden = false,
}: Props) => {

    const insets = useSafeAreaInsets();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
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
                forbidden: (isPast(currentDate) && !isToday(currentDate) && pastForbidden) ||
                    (isToday(currentDate) && todayForbidden) ||
                    (isFuture(currentDate) && !isToday(currentDate) && futureForbidden) ||
                    (from && isBefore(currentDate, startOfDay(from)) && !isToday(currentDate)) ||
                    (to && isAfter(currentDate, endOfDay(to)) && !isToday(currentDate))
            });
            if (currentDate.getDay() === 0) {
                weeksArray.push(week);
                week = [];
            }
            currentDate = addDays(currentDate, 1);
        }
        setWeeks(weeksArray);
    }, [selectedMonth, pastForbidden, todayForbidden, futureForbidden, from, to]);

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
        setSelectedDate(day.date)
        if (!day.isSelectedMonth) {
            if (day.date.getMonth() > selectedDate.getMonth()) {
                setSelectedMonth(addMonths(selectedMonth, 1))
            } else {
                setSelectedMonth(subMonths(selectedMonth, 1))
            }
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
                            <View style={{ flexDirection: "row" }}>
                                {week.map((day, j) => {
                                    const isSelected = isSameDay(day.date, selectedDate)
                                    return (
                                        <TouchableOpacity onPress={() => !day.forbidden ? handleDateSelection(day) : null} style={[
                                            cellStyle,
                                            day.isToday ? styles.today : null,
                                            isSelected ? styles.selectedDate : null,
                                        ]}>
                                            <Text style={[
                                                styles.cellText,
                                                day.isSelectedMonth ? null : styles.offSelectedMonthText,
                                                day.isToday ? styles.todayText : null,
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
        if (label == undefined || label == null || label.length == 0) {
            return {
                height: 46,
                paddingTop: PALETTE.spacing.l
            }
        } else {
            return {
                height: 68,
                paddingTop: PALETTE.spacing.m + PALETTE.spacing.xl
            }
        }

    }, [label])

    return (
        <>
            <TouchableOpacity style={{}} onPress={handleOpen}>
                {label && <Text style={styles.label}>{label}</Text>}
                <TextInput editable={false} value={value ? isValid(value) ? format(value, "dd/MM/yyyy") : value.toString() : "__/__/____"} style={[styles.input, labelDependentComputedStyle, !value && styles.datePlaceholder]} pointerEvents='none' />
                <View style={{ position: "absolute", bottom: 0, left: PALETTE.spacing.m, height: fieldHeight, flexDirection: 'row', justifyContent: "center", alignItems: "center" }}>
                    <IconSVG icon={IconSVGCode.agenda} fill={PALETTE.disabled} style={{}} size='normal' />
                </View>
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
                            <View style={{ flexDirection: "row", gap: PALETTE.spacing.l, margin: PALETTE.spacing.xs }}>
                                <Button style={{ flex: 1 }} onPress={() => setDatePickerOpen(false)} variant='danger' title="Fermer" />
                                <Button disabled={selectedDate == null} style={{ flex: 1 }} onPress={handleDateValidation} variant='primary' title={selectedDate ? format(selectedDate, "dd/MM/yyyy") : "-"} />
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
        letterSpacing: 1,
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

export default DatePickerField;