import React, { useEffect, useMemo, useState } from 'react';
import { LayoutRectangle, Modal, Pressable, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useResponsiveProp, useTheme } from '@shopify/restyle';
import chroma from "chroma-js";
import { addDays, addMonths, endOfMonth, endOfWeek, format, startOfMonth, subMonths, startOfWeek, isSameDay, isToday, isPast, isFuture, isBefore, isAfter, startOfDay, endOfDay, isValid, isWithinInterval, formatDistance, formatDistanceStrict, intervalToDuration, interval, differenceInDays } from "date-fns";

import PALETTE, { FONTS, FieldSizes, Theme } from "../../Palette";
import { IconSVG, IconSVGCode } from '../../IconSVG';
import Button from '../Button';
import CustomText from '../CustomText';
import Box from '../Box';
import Alert from '../Alert';

export type DateRange = {
    from: Date | null,
    to: Date | null
}

interface Props {
    label?: string,
    value: DateRange,
    handleChange: (e: DateRange) => void;
    hideDaysInitials?: boolean;
    minNumberOfDays: number;
    maxNumberOfDays: number;
    forbiddenBefore?: Date;
    forbiddenAfter?: Date;
    pastForbidden?: boolean;
    todayForbidden?: boolean;
    futureForbidden?: boolean;
}

export const DateRangePickerField = ({
    label,
    value,
    handleChange,
    hideDaysInitials = false,
    forbiddenBefore,
    forbiddenAfter,
    minNumberOfDays,
    maxNumberOfDays,
    pastForbidden = false,
    todayForbidden = false,
    futureForbidden = false,
}: Props) => {

    const theme = useTheme<Theme>();

    if (minNumberOfDays != null && maxNumberOfDays != null && minNumberOfDays > maxNumberOfDays) {
        throw new Error(`Minimun number of days can't be higher than maximum of days (min:${minNumberOfDays} max:${maxNumberOfDays})`)
    }

    const fromLabel = "du";
    const toLabel = "au";

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
                    {!hideDaysInitials &&
                        <Box flexDirection='row' gap='xs'>
                            <Box style={cellStyle}><Text style={[styles.cellText, { color: theme.colors.textFadded }]}>L</Text></Box>
                            <Box style={cellStyle}><Text style={[styles.cellText, { color: theme.colors.textFadded }]}>M</Text></Box>
                            <Box style={cellStyle}><Text style={[styles.cellText, { color: theme.colors.textFadded }]}>M</Text></Box>
                            <Box style={cellStyle}><Text style={[styles.cellText, { color: theme.colors.textFadded }]}>J</Text></Box>
                            <Box style={cellStyle}><Text style={[styles.cellText, { color: theme.colors.textFadded }]}>V</Text></Box>
                            <Box style={cellStyle}><Text style={[styles.cellText, { color: theme.colors.textFadded }]}>S</Text></Box>
                            <Box style={cellStyle}><Text style={[styles.cellText, { color: theme.colors.textFadded }]}>D</Text></Box>
                        </Box>
                    }
                    {weeks.map((week, i) => {
                        return (
                            <Box key={`week${i}`} flexDirection='row' gap='xs'>
                                {week.map((day, j) => {
                                    const isSelected = isSameDay(day.date, selectedDate.from) || isSameDay(day.date, selectedDate.to)
                                    return (
                                        <TouchableOpacity key={`week${i}-day${j}`} onPress={() => !day.forbidden ? handleDateSelection(day) : null} style={[
                                            cellStyle,
                                            day.isToday ? { backgroundColor: chroma(theme.colors.warning).alpha(.1).hex() } : null,
                                            day.isInSelectedRange ? { backgroundColor: chroma(theme.colors.primary).alpha(.1).hex() } : null,
                                            isSelected ? { backgroundColor: theme.colors.primary } : null,
                                        ]}>
                                            <Text style={[
                                                styles.cellText,
                                                { color: theme.colors.textOnSurface },
                                                day.isSelectedMonth ? null : { color: theme.colors.disabled },
                                                day.isToday ? { color: theme.colors.warning } : null,
                                                day.isInSelectedRange ? { color: theme.colors.primary } : null,
                                                isSelected ? { color: theme.colors.textOnPrimary } : null,
                                                day.forbidden ? { ...styles.forbiddenText, color: chroma(theme.colors.danger).alpha(.45).hex() } : null

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
    }, [weeks, cellSize, cellStyle, selectedDate, theme])

    const labelDependentComputedStyle = useMemo<StyleProp<TextStyle>>(() => {
        if (label == undefined || label == null || label.length == 0) {
            return {
                minWidth: width,
                height: 2 * height,
                paddingTop: theme.spacing.l
            }
        } else {
            return {
                minWidth: width,
                height: 2 * height + labelHeight,
                paddingTop: theme.spacing.xxl
            }
        }
    }, [label, layout, theme])

    const datesDisplay = useMemo(() => {
        if (!layout) return <></>
        return (
            <>
                {label && <Text style={[styles.label, { color: theme.colors.primary }]}>{label}</Text>}
                <TextInput
                    numberOfLines={2}
                    editable={false}
                    style={[
                        styles.input,
                        {
                            borderBottomColor: theme.colors.textOnPanel,
                            backgroundColor: theme.colors.item,
                            color: theme.colors.fullThemeInverse,
                        },
                        labelDependentComputedStyle
                    ]}
                    pointerEvents='none'
                />
                <Box style={{ flexDirection: "row", position: "absolute", right: 0, bottom: height, left: 0, justifyContent: "space-between", alignItems: "center", height: 45, paddingHorizontal: theme.spacing.m, gap: theme.spacing.m }}>
                    <Text style={[styles.prefixPlaceholder, { color: chroma(theme.colors.fullThemeInverse).alpha(.4).hex() }]}>{fromLabel}</Text>
                    <Text
                        style={[
                            styles.inputText,
                            { color: theme.colors.fullThemeInverse },
                            !value.from && { ...styles.datePlaceholder, color: chroma(theme.colors.fullThemeInverse).alpha(.4).hex() }
                        ]}
                    >
                        {value.from ? isValid(value.from) && `${format(value.from, "dd/MM/yyyy")}` : "__/__/____"}
                    </Text>
                </Box>
                <Box style={{ flexDirection: "row", position: "absolute", right: 0, bottom: 0, left: 0, justifyContent: "space-between", alignItems: "center", height: 45, paddingHorizontal: theme.spacing.m, gap: theme.spacing.m }}>
                    <Text style={[styles.prefixPlaceholder, { color: chroma(theme.colors.fullThemeInverse).alpha(.4).hex() }]}>{toLabel}</Text>
                    <Text
                        style={[
                            styles.inputText,
                            { color: theme.colors.fullThemeInverse },
                            !value.to && { ...styles.datePlaceholder, color: chroma(theme.colors.fullThemeInverse).alpha(.4).hex() }
                        ]}
                    >
                        {value.to ? isValid(value.to) && `${format(value.to, "dd/MM/yyyy")}` : "__/__/____"}
                    </Text>
                </Box>
            </>
        )
    }, [labelDependentComputedStyle, value, theme])

    const outOfBoundAlert = useMemo(() => {
        if (selectedDate == null || selectedDate.from == null || selectedDate.to == null) return null
        const diff = differenceInDays(selectedDate.to, selectedDate.from)
        if (Math.abs(diff) + 1 < minNumberOfDays) {
            return <Alert variant='warning' icon={IconSVGCode.warning} title={`Selectionnez ${minNumberOfDays} jours au minimum`} />
        }
        if (Math.abs(diff) + 1 > maxNumberOfDays) {
            return <Alert variant='warning' icon={IconSVGCode.warning} title={`Selectionnez ${maxNumberOfDays} jours au maximum`} />
        }
        return null
    }, [selectedDate])

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
                        paddingHorizontal='m'
                        width={{ phone: '90%', tablet: 460 }}
                        zIndex={20}
                        justifyContent='center'
                        alignItems='center'
                        borderRadius={8}
                        flexDirection="column"
                        onLayout={(e) => setModalBodyLayout(e.nativeEvent.layout)}
                    >
                        <Box flexDirection='column' gap='m' padding="s">
                            <Box marginVertical='l' marginHorizontal='m' style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Button icon={IconSVGCode.chevron_left} onPress={previousMonth} outline size="s" />
                                <CustomText style={{ fontSize: 24, lineHeight: 28, marginTop: 8 }}>{monthLabel}</CustomText>
                                <Button icon={IconSVGCode.chevron_right} onPress={nextMonth} outline size="s" />
                            </Box>
                            <Box style={{ borderBottomWidth: 1, borderColor: theme.colors.textFadded }} />
                            <Box flexDirection="column" marginHorizontal='s' gap='xs' >
                                {monthGrid}
                            </Box>
                            {outOfBoundAlert}
                            <Box marginTop='m' style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Box style={{ flex: 1, alignItems: "center" }}>
                                    <Text style={styles.cellText}>{selectedDate.from ? format(selectedDate.from, "dd/MM/yyyy") : "-"}</Text>
                                </Box>
                                <IconSVG icon={IconSVGCode.arrow_right} size='normal' />
                                <Box style={{ flex: 1, alignItems: "center" }}>
                                    <Text style={styles.cellText}>{selectedDate.to ? format(selectedDate.to, "dd/MM/yyyy") : "-"}</Text>
                                </Box>
                            </Box>
                            <Box flexDirection="row" gap='l' margin='xs' >
                                <Button style={{ flex: 1 }} onPress={() => setDatePickerOpen(false)} variant='danger' title="Fermer" />
                                <Button style={{ flex: 2 }} disabled={selectedDate == null || outOfBoundAlert != null} onPress={handleDateValidation} variant='primary' title={selectedDate.from && selectedDate.to ? `Validate ${formatDistanceStrict(selectedDate.from, selectedDate.to, { unit: 'day' })}` : "-"} />
                            </Box>
                        </Box>
                    </Box>
                </BlurView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 80,
        textAlign: "right",
        borderBottomWidth: 2,
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
        zIndex: 1000,
        top: PALETTE.spacing.s + 2,
        left: PALETTE.spacing.s,
    },
    inputText: {
        fontSize: 18,
        lineHeight: 18,
        fontFamily: FONTS.A600,
    },
    prefixPlaceholder: {
        fontFamily: FONTS.A600,
        fontSize: 16,
        lineHeight: 16,
    },
    datePlaceholder: {
        letterSpacing: .8,
        fontSize: 18,
        lineHeight: 18,
    },
    blur: {
        height: "100%",
        width: "100%",
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
    },
    forbiddenText: {
        textDecorationLine: "line-through"
    },
    dimmer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "#000c",
        zIndex: 10
    }
});

export default DateRangePickerField;