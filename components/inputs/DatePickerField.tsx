import React, { useEffect, useMemo, useState } from 'react';
import { LayoutRectangle, Modal, Pressable, StyleProp, StyleSheet, TextInput, TextStyle, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import chroma from "chroma-js";
import { useResponsiveProp, useTheme } from '@shopify/restyle';
import { addDays, addMonths, endOfMonth, endOfWeek, format, startOfMonth, subMonths, startOfWeek, isSameDay, isToday, isPast, isFuture, isBefore, isAfter, startOfDay, endOfDay, isValid } from "date-fns";

import PALETTE, { FONTS, FieldSizes, Theme } from "../../constants/Palette";
import { IconSVG, IconSVGCode } from '../IconSVG';
import Button from '../Button';
import CustomText from '../CustomText';
import Box from '../Box';

interface Props {
    label?: string,
    value: Date,
    handleChange: (e: Date) => void;
    hideDaysInitials?: boolean;
    from?: Date
    to?: Date
    pastForbidden?: boolean,
    todayForbidden?: boolean,
    futureForbidden?: boolean,
    onBackground?: boolean
}

export const DatePickerField = ({
    label,
    value,
    handleChange,
    hideDaysInitials = false,
    from,
    to,
    pastForbidden = false,
    todayForbidden = false,
    futureForbidden = false,
    onBackground
}: Props) => {

    const theme = useTheme<Theme>();

    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
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
                            <Box flexDirection='row' gap='xs'>
                                {week.map((day, j) => {
                                    const isSelected = isSameDay(day.date, selectedDate)
                                    return (
                                        <TouchableOpacity onPress={() => !day.forbidden ? handleDateSelection(day) : null} style={[
                                            cellStyle,
                                            day.isToday ? { backgroundColor: chroma(theme.colors.warning).alpha(.1).hex() } : null,
                                            isSelected ? { backgroundColor: theme.colors.primary } : null,
                                        ]}>
                                            <Text style={[
                                                styles.cellText,
                                                { color: theme.colors.textOnSurface },
                                                day.isSelectedMonth ? null : { color: theme.colors.disabled },
                                                day.isToday ? { color: theme.colors.warning } : null,
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
    }, [weeks, cellSize, cellStyle, selectedDate])

    const labelDependentComputedStyle = useMemo<StyleProp<TextStyle>>(() => {
        if (label == undefined || label == null || label.length == 0) {
            return {
                minWidth: width,
                height: height,
                paddingTop: PALETTE.spacing.l
            }
        } else {
            return {
                minWidth: width,
                height: height + labelHeight,
                paddingTop: PALETTE.spacing.xxl
            }
        }
    }, [label])

    return (
        <>
            <TouchableOpacity style={{}} onPress={handleOpen}>
                {label && <Text style={[styles.label, { color: theme.colors.primary }]}>{label}</Text>}
                <TextInput
                    editable={false}
                    value={value ? isValid(value) ? format(value, "dd/MM/yyyy") : value.toString() : "__/__/____"}
                    style={[
                        styles.input,
                        {
                            borderBottomColor: theme.colors.textOnPanel,
                            backgroundColor: onBackground ? theme.colors.surface : theme.colors.background,
                            color: theme.colors.fullThemeInverse
                        },
                        labelDependentComputedStyle,
                        !value && {
                            ...styles.datePlaceholder,
                            color: chroma(theme.colors.fullThemeInverse).alpha(.4).hex()
                        }]}
                    pointerEvents='none'
                />
                <Box flexDirection='row' justifyContent="center" alignItems="center" style={{ position: "absolute", bottom: 0, left: PALETTE.spacing.m, height: height }}>
                    <IconSVG icon={IconSVGCode.agenda} fill={theme.colors.disabled} size='normal' />
                </Box>
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
                        <Box gap='m'>
                            <Box marginVertical='l' marginHorizontal='m' style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Button icon={IconSVGCode.chevron_left} onPress={previousMonth} outline size="s" />
                                <Box paddingTop='s'>
                                    <CustomText style={{ fontSize: 24, lineHeight: 28 }}>{monthLabel}</CustomText>
                                </Box>
                                <Button icon={IconSVGCode.chevron_right} onPress={nextMonth} outline size="s" />
                            </Box>
                            <Box style={{ borderBottomWidth: 1, borderColor: theme.colors.disabled }} />
                            <Box flexDirection="column" marginHorizontal='s' marginVertical='l' gap='xs' >
                                {monthGrid}
                            </Box>
                        </Box>
                        <Box margin='xs' flexDirection="row" gap="l" alignSelf={"stretch"}>
                            <Button style={{ flex: 1 }} onPress={() => setDatePickerOpen(false)} variant='danger' title="Fermer" />
                            <Button disabled={selectedDate == null} style={{ flex: 1 }} onPress={handleDateValidation} variant='primary' title={selectedDate ? format(selectedDate, "dd/MM/yyyy") : "-"} />
                        </Box>
                    </Box>
                </BlurView >
            </Modal >
        </>
    );
};

const styles = StyleSheet.create({
    label: {
        position: "absolute",
        fontFamily: FONTS.A700,
        zIndex: 1000,
        top: PALETTE.spacing.s + 2,
        left: PALETTE.spacing.s,
    },
    datePlaceholder: {
        letterSpacing: 1,
    },
    blur: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
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
    title: {
        fontFamily: FONTS.A600,
        fontSize: 16
    },
    input: {
        textAlign: "right",
        borderBottomWidth: 2,
        fontFamily: FONTS.A600,
        paddingHorizontal: PALETTE.spacing.m,
        paddingTop: PALETTE.spacing.m,
        paddingBottom: PALETTE.spacing.m,
        borderRadius: 4,
        fontSize: 18,
        lineHeight: 18
    },
    dimmer: {
        position: "absolute",
        backgroundColor: "#000c",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 10,
    }
});

export default DatePickerField;