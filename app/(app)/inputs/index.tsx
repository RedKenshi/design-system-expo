import { Text, View, ViewStyle } from "react-native"
import Button, { ButtonVariant } from "../../../components/Button"
import { IconSVGCode } from "../../../components/IconSVG"
import Alert from "../../../components/Alert"
import Pill from "../../../components/Pill"
import { Side } from "../../../components/TicketView"
import { Ticket } from "../../../components/Ticket"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONTS, Theme } from "../../../constants/Palette"
import Header from "../../../components/Header"
import Legend from "../../../components/Legend"
import Panel from "../../../components/Panel"
import TextFormRow from "../../../components/formRow/TextFormRow"
import InlineSelectFormRow from "../../../components/formRow/InlineSelectFormRow"
import { useState } from "react"
import BorderedBlock from "../../../components/BorderedBlock"
import CustomText from "../../../components/CustomText"
import DateFormRow from "../../../components/formRow/DateFormRow"
import TimeFormRow from "../../../components/formRow/TimeFormRow"
import { addMonths, subMonths } from "date-fns"
import Tooltip from "../../../components/Tooltip"
import ToggleFormRow from "../../../components/formRow/ToggleFormRow"
import DateRangeFormRow from "../../../components/formRow/DateRangeFormRow"
import DateRangePickerField, { DateRange } from "../../../components/inputs/DateRangePickerField"
import CustomTextField from "../../../components/inputs/CustomTextField"
import DatePickerField from "../../../components/inputs/DatePickerField"
import TimePickerField from "../../../components/inputs/TimePickerField"

import Box from "../../../components/Box"
import PageBlock from "../../../components/PageBlock"
import { useTheme } from "@shopify/restyle"
import ModalNative from "../../../components/ModalNative"

type Props = {}

export const Inputs = ({ }: Props) => {

    const theme = useTheme<Theme>();

    const [togF, setTogF] = useState(true)
    const [togS, setTogS] = useState(false)
    const [date, setDate] = useState<Date | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null })
    const [time, setTime] = useState<string | null>(null);

    const insets = useSafeAreaInsets();
    const padding = {
        paddingLeft: insets.left + theme.spacing.m,
        paddingRight: insets.right + theme.spacing.m,
    } as ViewStyle

    return (
        <>
            <PageBlock style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: 'row' }} >
                <Box marginHorizontal={{ tablet: 'l' }} justifyContent="space-evenly" style={[padding, { maxWidth: "100%", paddingBottom: "50%" }]} >

                    <Header style={{ marginHorizontal: theme.spacing.l }} size={3}>Date form examples</Header>
                    <Panel style={{ display: 'flex', flexDirection: "column", gap: theme.spacing.m }}>
                        <DateFormRow handleChange={(d: Date) => setDate(d)} value={date} title={"DATE"} from={subMonths(new Date, 1)} to={addMonths(new Date, 1)} />
                        <DateRangeFormRow handleChange={(dr: DateRange) => setDateRange(dr)} value={dateRange} title="DATE RANGE" minNumberOfDays={3} maxNumberOfDays={9} />
                        <TimeFormRow handleChange={(d: string) => setTime(d)} value={time} title={"TIME"} />
                        <TextFormRow handleChange={(d: string) => { }} value={time} title={"TIME"} />
                    </Panel>

                    <Header style={{ marginHorizontal: theme.spacing.l }} size={5}>Inputs examples (not FormRow) with label</Header>
                    <Panel style={{ display: 'flex', flexDirection: "column", gap: theme.spacing.m }}>
                        <DatePickerField label="Pick a date" handleChange={(d: Date) => setDate(d)} value={date} from={subMonths(new Date, 1)} to={addMonths(new Date, 1)} />
                        <DateRangePickerField label="Pick a date range" handleChange={(dr: DateRange) => setDateRange(dr)} value={dateRange} minNumberOfDays={3} maxNumberOfDays={9} />
                        <TimePickerField label="Pick a time" handleChange={(d: string) => setTime(d)} value={time} />
                        <CustomTextField label="Tell us about you" handleChange={(d: string) => { }} value={time} />
                    </Panel>

                    <Header style={{ marginHorizontal: theme.spacing.l }} size={5}>Inputs examples (not FormRow) without label</Header>
                    <Panel style={{ display: 'flex', flexDirection: "column", gap: theme.spacing.m }}>
                        <DatePickerField handleChange={(d: Date) => setDate(d)} value={date} from={subMonths(new Date, 1)} to={addMonths(new Date, 1)} />
                        <DateRangePickerField handleChange={(dr: DateRange) => setDateRange(dr)} value={dateRange} minNumberOfDays={3} maxNumberOfDays={9} hideDaysInitials />
                        <TimePickerField handleChange={(d: string) => setTime(d)} value={time} />
                        <CustomTextField handleChange={(d: string) => { }} value={time} />
                    </Panel>

                    <Header style={{ marginHorizontal: theme.spacing.l }} size={3}>Toggle examples</Header>
                    <Panel style={{ display: 'flex', flexDirection: "column", gap: theme.spacing.m }}>
                        <ToggleFormRow title={"First toggle"} value={togF} handleChange={(value) => setTogF(value)} />
                        <ToggleFormRow title={"Second toggle"} value={togS} handleChange={(value) => setTogS(value)} />
                    </Panel>

                </Box>
            </PageBlock>
        </>
    )
}

export default Inputs;