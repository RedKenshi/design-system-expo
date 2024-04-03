import React, { useEffect, useMemo, useState } from 'react';
import { LayoutRectangle, Modal, Pressable, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useResponsiveProp } from '@shopify/restyle';
import chroma from "chroma-js";
import { addDays, addMonths, endOfMonth, endOfWeek, format, startOfMonth, subMonths, startOfWeek, isSameDay, isToday, isPast, isFuture, isBefore, isAfter, startOfDay, endOfDay, isValid, isWithinInterval, formatDistance } from "date-fns";

import PALETTE, { FONTS, FieldSizes } from "../../Palette";
import { IconSVG, IconSVGCode } from '../../IconSVG';
import Button from '../Button';
import CustomText from '../CustomText';
import Box from '../Box';

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

    const [layout, setLayout] = useState<LayoutRectangle>(null)
    const [selectedDate, setSelectedDate] = useState<DateRange>({ from: null, to: null })
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
    const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false)
    const [modalBodyLayout, setModalBodyLayout] = useState<LayoutRectangle>()
    const [weeks, setWeeks] = useState([]);

    const width = useResponsiveProp(FieldSizes.width)
    const height = useResponsiveProp(FieldSizes.height)
    const labelHeight = useResponsiveProp(FieldSizes.labelHeight)

    const cellSize = useMemo(() => {
        if (modalBodyLayout) {
            return (modalBodyLayout.width - 24) / 7 - 4 // - 24 is a padding of 12 on left and right 
        } else {
            return 34
        }
    }, [modalBodyLayout])
    const monthLabel = useMemo(() => {
        return format(selectedMonth ?? new Date(), "MMMM yyyy")
    }, [selectedMonth])
    const previousMonth = () => {
        setSelectedMonth(subMonths(selectedMonth, 1))
    }
    const nextMonth = () => {
        setSelectedMonth(addMonths(selectedMonth, 1))
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
                    <Box style={{ flexDirection: "row" }}>
                        <Box style={cellStyle}><Text style={[styles.cellText, { color: PALETTE.colors.disabled }]}>L</Text></Box>
                        <Box style={cellStyle}><Text style={[styles.cellText, { color: PALETTE.colors.disabled }]}>M</Text></Box>
                        <Box style={cellStyle}><Text style={[styles.cellText, { color: PALETTE.colors.disabled }]}>M</Text></Box>
                        <Box style={cellStyle}><Text style={[styles.cellText, { color: PALETTE.colors.disabled }]}>J</Text></Box>
                        <Box style={cellStyle}><Text style={[styles.cellText, { color: PALETTE.colors.disabled }]}>V</Text></Box>
                        <Box style={cellStyle}><Text style={[styles.cellText, { color: PALETTE.colors.disabled }]}>S</Text></Box>
                        <Box style={cellStyle}><Text style={[styles.cellText, { color: PALETTE.colors.disabled }]}>D</Text></Box>
                    </Box>
                    {weeks.map((week, i) => {
                        return (
                            <Box key={`week${i}`} flexDirection='row' gap='xs'>
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
                            </Box>
                        )
                    })}
                </>
            )
        } else {
            return <></>
        }
    }, [weeks, cellSize, cellStyle, selectedDate])

    const labelDependentComputedStyle = useMemo<StyleProp<TextStyle>>(() => {
        if (label == undefined || label == null || label.length == 0) {
            return {
                minWidth: width,
                height: 2 * height,
                paddingTop: PALETTE.spacing.l
            }
        } else {
            return {
                minWidth: width,
                height: 2 * height + labelHeight,
                paddingTop: PALETTE.spacing.xxl
            }
        }
    }, [label, layout])

    const datesDisplay = useMemo(() => {
        if (!layout) return <></>
        return (
            <>
                {label && <Text style={styles.label}>{label}</Text>}
                <TextInput numberOfLines={2} editable={false} style={[styles.inputTall, labelDependentComputedStyle]} pointerEvents='none' />
                <Box style={{ flexDirection: "row", position: "absolute", right: 0, bottom: height, left: 0, justifyContent: "space-between", alignItems: "center", height: 45, paddingHorizontal: PALETTE.spacing.m, gap: PALETTE.spacing.m }}>
                    <Text style={styles.prefixPlaceholder}>{fromLabel}</Text>
                    <Text style={[styles.inputText, !value.from && styles.datePlaceholder]}> {value.from ? isValid(value.from) && `${format(value.from, "dd/MM/yyyy")}` : "__/__/____"}</Text>
                </Box>
                <Box style={{ flexDirection: "row", position: "absolute", right: 0, bottom: 0, left: 0, justifyContent: "space-between", alignItems: "center", height: 45, paddingHorizontal: PALETTE.spacing.m, gap: PALETTE.spacing.m }}>
                    <Text style={styles.prefixPlaceholder}>{toLabel}</Text>
                    <Text style={[styles.inputText, !value.to && styles.datePlaceholder]}> {value.to ? isValid(value.to) && `${format(value.to, "dd/MM/yyyy")}` : "__/__/____"}</Text>
                </Box>
            </>
        )
    }, [labelDependentComputedStyle, value])

    return (
        <>
            <TouchableOpacity style={{}} onPress={handleOpen} onLayout={(e) => { setLayout(e.nativeEvent.layout) }}>
                {layout && datesDisplay}
            </TouchableOpacity>
            <Modal animationType='fade' transparent={true} visible={datePickerOpen} onRequestClose={() => setDatePickerOpen} >
                <BlurView intensity={10} style={styles.blur} >
                    <Pressable onPress={() => setDatePickerOpen(false)} style={styles.dimmer} />
                    <Box
                        backgroundColor='surface'
                        gap="m"
                        padding='m'
                        width={{ phone: '90%', tablet: 460 }}
                        zIndex={20}
                        justifyContent='center'
                        alignItems='center'
                        borderRadius={8}
                        flexDirection="column"
                        onLayout={(e) => setModalBodyLayout(e.nativeEvent.layout)}
                    >
                        <Box style={styles.modalBody}>
                            <Box style={{ gap: PALETTE.spacing.m }}>
                                <Box marginVertical='l' marginHorizontal='m' style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <Button icon={IconSVGCode.chevron_left} onPress={previousMonth} outline size="s" />
                                    <CustomText style={{ fontSize: 24, lineHeight: 28, marginTop: 8 }}>{monthLabel}</CustomText>
                                    <Button icon={IconSVGCode.chevron_right} onPress={nextMonth} outline size="s" />
                                </Box>
                                <Box style={{ borderBottomWidth: 1, borderColor: PALETTE.colors.disabled }} />
                                <Box flexDirection="column" marginHorizontal='s' marginVertical='l' gap='xs' >
                                    {monthGrid}
                                </Box>
                            </Box>
                            <Box style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Box style={{ flex: 1, alignItems: "center" }}>
                                    <Text style={styles.cellText}>{selectedDate.from ? format(selectedDate.from, "dd/MM/yyyy") : "-"}</Text>
                                </Box>
                                <IconSVG icon={IconSVGCode.chevron_right} size='normal' />
                                <Box style={{ flex: 1, alignItems: "center" }}>
                                    <Text style={styles.cellText}>{selectedDate.to ? format(selectedDate.to, "dd/MM/yyyy") : "-"}</Text>
                                </Box>
                            </Box>
                            <Box flexDirection="row" gap='l' margin='xs' >
                                <Button style={{ flex: 1 }} onPress={() => setDatePickerOpen(false)} variant='danger' title="Fermer" />
                                <Button disabled={selectedDate == null} style={{ flex: 1 }} onPress={handleDateValidation} variant='primary' title={selectedDate.from && selectedDate.to ? `Validate ${formatDistance(selectedDate.from, selectedDate.to)}` : "-"} />
                            </Box>
                        </Box>
                    </Box>
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
        borderBottomColor: PALETTE.colors.textOnPanel,
        backgroundColor: PALETTE.colors.item,
        color: PALETTE.colors.fullThemeInverse,
        fontFamily: FONTS.A600,
        fontSize: 18,
        paddingHorizontal: PALETTE.spacing.m,
        paddingTop: PALETTE.spacing.m,
        paddingBottom: PALETTE.spacing.m - 2,
        borderRadius: 4,
    },
    inputWide: {
        height: 80,
        textAlign: "right",
        borderBottomWidth: 2,
        borderBottomColor: PALETTE.colors.textOnPanel,
        backgroundColor: PALETTE.colors.item,
        color: PALETTE.colors.fullThemeInverse,
        fontFamily: FONTS.A600,
        fontSize: 18,
        paddingHorizontal: PALETTE.spacing.m,
        paddingTop: PALETTE.spacing.m,
        paddingBottom: PALETTE.spacing.m - 2,
        borderRadius: 4,
    },
    label: {
        position: "absolute",
        fontFamily: FONTS.A700,
        color: PALETTE.colors.primary,
        zIndex: 1000,
        top: PALETTE.spacing.s + 2,
        left: PALETTE.spacing.s,
    },
    inputText: {
        fontSize: 18,
        lineHeight: 18,
        color: PALETTE.colors.fullThemeInverse,
        fontFamily: FONTS.A600,
    },
    prefixPlaceholder: {
        fontFamily: FONTS.A600,
        fontSize: 16,
        lineHeight: 16,
        color: chroma(PALETTE.colors.fullThemeInverse).alpha(.4).hex()
    },
    datePlaceholder: {
        letterSpacing: .8,
        fontSize: 18,
        lineHeight: 18,
        color: chroma(PALETTE.colors.fullThemeInverse).alpha(.4).hex()
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
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    cellText: {
        fontFamily: FONTS.A500,
        fontSize: 18,
        color: PALETTE.colors.textOnSurface
    },
    offSelectedMonthText: {
        color: PALETTE.colors.disabled
    },
    selectedDate: {
        backgroundColor: PALETTE.colors.primary
    },
    selectedDateText: {
        color: PALETTE.colors.textOnPrimary
    },
    today: {
        backgroundColor: chroma(PALETTE.colors.warning).alpha(.1).hex()
    },
    todayText: {
        color: PALETTE.colors.warning
    },
    inRangeSelected: {
        backgroundColor: chroma(PALETTE.colors.primary).alpha(.1).hex()
    },
    inRangeSelectedText: {
        color: PALETTE.colors.primary
    },
    forbiddenText: {
        color: chroma(PALETTE.colors.danger).alpha(.45).hex(),
        textDecorationLine: "line-through"
    },
    title: {
        color: PALETTE.colors.textOnSurface,
        fontFamily: FONTS.A600,
        fontSize: 16
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
        backgroundColor: PALETTE.colors.surface,
        padding: PALETTE.spacing.s,
        borderRadius: 8
    },
});

export default DateRangePickerField;