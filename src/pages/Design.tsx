import { Text, View, ViewStyle } from "react-native"
import Button, { ButtonVariant } from "../components/Button"
import { IconSVGCode } from "../IconSVG"
import Alert from "../components/Alert"
import Pill from "../components/Pill"
import { Side } from "../components/TicketView"
import { Ticket } from "../components/Ticket"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PALETTE, { FONTS } from "../Palette"
import Header from "../components/Header"
import Legend from "../components/Legend"
import Panel from "../components/Panel"
import TextFormRow from "../components/formRow/TextFormRow"
import InlineSelectFormRow from "../components/formRow/InlineSelectFormRow"
import { useState } from "react"
import BorderedBlock from "../components/BorderedBlock"
import CustomText from "../components/CustomText"
import DateFormRow from "../components/formRow/DateFormRow"
import TimeFormRow from "../components/formRow/TimeFormRow"
import { addMonths, subMonths } from "date-fns"
import Tooltip from "../components/Tooltip"
import ToggleFormRow from "../components/formRow/ToggleFormRow"
import DateRangeFormRow from "../components/formRow/DateRangeFormRow"
import DateRangePickerField, { DateRange } from "../components/inputs/DateRangePickerField"
import CustomTextField from "../components/inputs/CustomTextField"
import DatePickerField from "../components/inputs/DatePickerField"
import TimePickerField from "../components/inputs/TimePickerField"

import Box from "../components/Box"
import PageBlock from "../components/PageBlock"

type Props = {
    setOpenModalF: (value: boolean) => void,
    setOpenModalS: (value: boolean) => void
}

export const Design = ({ setOpenModalF, setOpenModalS }: Props) => {

    const [selectedFormula, setSelectedFormula] = useState(null);
    const [togF, setTogF] = useState(true)
    const [togS, setTogS] = useState(false)
    const [date, setDate] = useState<Date | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null })
    const [time, setTime] = useState<string | null>(null);

    const insets = useSafeAreaInsets();
    const padding = {
        paddingLeft: insets.left + PALETTE.spacing.m,
        paddingRight: insets.right + PALETTE.spacing.m,
    } as ViewStyle

    return (
        <PageBlock style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: 'row' }} >
            <Box marginHorizontal={{ phone: 'm', tablet: 'xxl' }} justifyContent="space-evenly" style={[padding, { maxWidth: "100%", paddingBottom: "50%" }]} >

                <Header style={{ marginHorizontal: PALETTE.spacing.l }} size={3}>Modal examples</Header>
                <Panel style={{ display: 'flex', flexDirection: "column", gap: PALETTE.spacing.m }}>
                    <View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-evenly" }} >
                        <View style={{ gap: PALETTE.spacing.s }}>
                            <Button size={"s"} title={"Primary"} onPress={() => setOpenModalS(true)} variant='primary' />
                            <Button size={"m"} title={"Primary"} onPress={() => setOpenModalS(true)} variant='primary' />
                            <Button size={"l"} title={"Primary"} onPress={() => setOpenModalS(true)} variant='primary' />
                        </View>
                        <View style={{ gap: PALETTE.spacing.s, alignItems: "flex-end" }}>
                            <Button size={"s"} onPress={() => setOpenModalF(true)} variant='primary' icon={IconSVGCode.agenda} />
                            <Button size={"m"} onPress={() => setOpenModalF(true)} variant='primary' icon={IconSVGCode.agenda} />
                            <Button size={"l"} onPress={() => setOpenModalF(true)} variant='primary' icon={IconSVGCode.agenda} />
                        </View>
                    </View>
                    <View style={{ alignSelf: "center" }}>
                        <Legend>Click on any of the buttons above to open a exemple of modal and see exemple of form input, this legends should be long enough to need a second row to display</Legend>
                    </View>
                </Panel>

                <Header style={{ marginHorizontal: PALETTE.spacing.l }} size={3}>Form examples</Header>
                <Panel style={{ display: 'flex', flexDirection: "column", gap: PALETTE.spacing.m }}>
                    <TextFormRow handleChange={() => { }} value={""} title={"HEY"} />
                    <TextFormRow handleChange={() => { }} value={""} title={"HO"} />
                    <TextFormRow handleChange={() => { }} value={""} title={"POUET"} />
                    <InlineSelectFormRow animated selected={selectedFormula} handleChange={(e) => setSelectedFormula(e)} title={"TEST"} options={[
                        { label: 'E+P', value: 1 },
                        { label: 'E+P+D', value: 2 },
                        { label: 'P+D', value: 3 }
                    ]} />
                    <Legend>{`I am animated ! ;)`}</Legend>
                    <InlineSelectFormRow animated={false} selected={selectedFormula} handleChange={(e) => setSelectedFormula(e)} title={"TEST"} options={[
                        { label: 'E+P', value: 1 },
                        { label: 'E+P+D', value: 2 },
                        { label: 'P+D', value: 3 }
                    ]} />
                    <Legend>{`I am not ! ;(`}</Legend>
                </Panel>

                <Header style={{ marginHorizontal: PALETTE.spacing.l }} size={3}>Date form examples</Header>
                <Panel style={{ display: 'flex', flexDirection: "column", gap: PALETTE.spacing.m }}>
                    <DateFormRow handleChange={(d: Date) => setDate(d)} value={date} title={"DATE"} from={subMonths(new Date, 1)} to={addMonths(new Date, 1)} />
                    <DateRangeFormRow handleChange={(dr: DateRange) => setDateRange(dr)} value={dateRange} title="DATE RANGE" minNumberOfDays={3} maxNumberOfDays={6} />
                    <TimeFormRow handleChange={(d: string) => setTime(d)} value={time} title={"TIME"} defaultValue={"04:35"} />
                    <TextFormRow handleChange={(d: string) => { }} value={time} title={"TIME"} />
                </Panel>

                <Header style={{ marginHorizontal: PALETTE.spacing.l }} size={5}>Inputs examples (not FormRow) with label</Header>
                <Panel style={{ display: 'flex', flexDirection: "column", gap: PALETTE.spacing.m }}>
                    <DatePickerField label="Pick a date" handleChange={(d: Date) => setDate(d)} value={date} from={subMonths(new Date, 1)} to={addMonths(new Date, 1)} />
                    <DateRangePickerField label="Pick a date range" handleChange={(dr: DateRange) => setDateRange(dr)} value={dateRange} minNumberOfDays={3} maxNumberOfDays={6} />
                    <TimePickerField label="Pick a time" handleChange={(d: string) => setTime(d)} value={time} />
                    <CustomTextField label="Tell us about you" handleChange={(d: string) => { }} value={time} />
                </Panel>

                <Header style={{ marginHorizontal: PALETTE.spacing.l }} size={5}>Inputs examples (not FormRow) without label</Header>
                <Panel style={{ display: 'flex', flexDirection: "column", gap: PALETTE.spacing.m }}>
                    <DatePickerField handleChange={(d: Date) => setDate(d)} value={date} from={subMonths(new Date, 1)} to={addMonths(new Date, 1)} />
                    <DateRangePickerField handleChange={(dr: DateRange) => setDateRange(dr)} value={dateRange} minNumberOfDays={3} maxNumberOfDays={6} />
                    <TimePickerField handleChange={(d: string) => setTime(d)} value={time} />
                    <CustomTextField handleChange={(d: string) => { }} value={time} />
                </Panel>

                <Header style={{ marginHorizontal: PALETTE.spacing.l }} size={3}>Toggle examples</Header>
                <Panel style={{ display: 'flex', flexDirection: "column", gap: PALETTE.spacing.m }}>
                    <ToggleFormRow title={"First toggle"} value={togF} handleChange={(value) => setTogF(value)} />
                    <ToggleFormRow title={"Second toggle"} value={togS} handleChange={(value) => setTogS(value)} />
                </Panel>

                <Header style={{ marginHorizontal: PALETTE.spacing.l }} size={3}>Bordered block examples</Header>
                <Panel style={{ display: 'flex', flexDirection: "column", gap: PALETTE.spacing.m }}>
                    <CustomText style={{ textAlign: "justify", fontFamily: FONTS.A400 }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam quidem consequuntur molestiae a perspiciatis totam assumenda perferendis unde. Dolor tempora labore tenetur suscipit cupiditate iure voluptate unde sapiente? Iusto, quasi!</CustomText>
                    <BorderedBlock side={'left'}>
                        <CustomText style={{ textAlign: "justify", fontFamily: FONTS.A400 }}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam quidem consequuntur molestiae a perspiciatis totam assumenda perferendis unde. Dolor tempora labore tenetur suscipit cupiditate iure voluptate unde sapiente? Iusto, quasi!
                            {/*<Tooltip text="HEY HI HEY HO, ON RENTRE DU BOULOT" />*/}
                        </CustomText>
                    </BorderedBlock>
                    <Legend>The previous block is bordered on the left, the next on the right </Legend>
                    <BorderedBlock side={'right'}>
                        <CustomText style={{ textAlign: "justify", fontFamily: FONTS.A400 }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam quidem consequuntur molestiae a perspiciatis totam assumenda perferendis unde. Dolor tempora labore tenetur suscipit cupiditate iure voluptate unde sapiente? Iusto, quasi!</CustomText>
                    </BorderedBlock>
                </Panel>

                <Header style={{ marginHorizontal: PALETTE.spacing.l }} size={3}>Primary headers examples</Header>
                <Panel style={{ alignSelf: "stretch", display: 'flex', flexDirection: "column", gap: PALETTE.spacing.m }}>
                    <Header style={{ marginTop: PALETTE.spacing.xs }} size={1}>A BIG ASS HEADER</Header>
                    <Header style={{ marginTop: PALETTE.spacing.xs }} size={2}>NOT THE BIGGEST BUT STILL</Header>
                    <Header style={{ marginTop: PALETTE.spacing.xs }} size={3}>AVERAGE MY DUDE</Header>
                    <Header style={{ marginTop: PALETTE.spacing.xs }} size={4}>A BIT LITTLE FOR A HEADER</Header>
                    <Header style={{ marginTop: PALETTE.spacing.xs }} size={5}>SIZE DOESN'T MATTER IT'S OK</Header>
                    <Legend>Here are some primary title</Legend>
                </Panel>

                <Header style={{ marginHorizontal: PALETTE.spacing.l }} size={3}>Neutral headers examples</Header>
                <Panel style={{ alignSelf: "stretch", display: 'flex', flexDirection: "column", gap: PALETTE.spacing.m }}>
                    <Header style={{ marginTop: PALETTE.spacing.xs }} size={1} variant="onSurface">A BIG ASS HEADER</Header>
                    <Header style={{ marginTop: PALETTE.spacing.xs }} size={2} variant="onSurface">NOT THE BIGGEST BUT STILL</Header>
                    <Header style={{ marginTop: PALETTE.spacing.xs }} size={3} variant="onSurface">AVERAGE MY DUDE</Header>
                    <Header style={{ marginTop: PALETTE.spacing.xs }} size={4} variant="onSurface">A BIT LITTLE FOR A HEADER</Header>
                    <Header style={{ marginTop: PALETTE.spacing.xs }} size={5} variant="onSurface">SIZE DOESN'T MATTER IT'S OK</Header>
                    <Legend>Here are some neutral color title</Legend>
                </Panel>

                <Header style={{ marginHorizontal: PALETTE.spacing.l }} size={3}>Normal fonts</Header>
                <Panel style={{ alignSelf: "stretch", display: 'flex', flexDirection: "column", gap: PALETTE.spacing.m }}>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Thin' }}>Axiforma Thin</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Light' }}>Axiforma Light</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Book' }}>Axiforma Book</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma' }}>Axiforma</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Medium' }}>Axiforma Medium</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-SemiBold' }}>Axiforma SemiBold</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Bold' }}>Axiforma Bold</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-ExtraBold' }}>Axiforma ExtraBold</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Black' }}>Axiforma Black</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Heavy' }}>Axiforma Heavy</Text>
                    <Legend>Here are the normal font family from 100 to 950</Legend>
                </Panel>

                <Header style={{ marginHorizontal: PALETTE.spacing.l }} size={3}>Italic fonts</Header>
                <Panel style={{ alignSelf: "stretch", display: 'flex', flexDirection: "column", gap: PALETTE.spacing.m }}>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Thin-Italic' }}>Axiforma Thin Italic</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Light-Italic' }}>Axiforma Light Italic</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Book-Italic' }}>Axiforma Book Italic</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Italic' }}>Axiforma Italic</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Medium-Italic' }}>Axiforma Medium Italic</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-SemiBold-Italic' }}>Axiforma SemiBold Italic</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Bold-Italic' }}>Axiforma Bold Italic</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-ExtraBold-Italic' }}>Axiforma ExtraBold Italic</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Black-Italic' }}>Axiforma Black Italic</Text>
                    <Text style={{ color: PALETTE.colors.textOnSurface, textAlign: "left", fontSize: 24, fontFamily: 'Axiforma-Heavy-Italic' }}>Axiforma Heavy Italic</Text>
                    <Legend>Here are the italic version font family from 100 to 950</Legend>
                </Panel>

                {["primary", "success", "warning", "danger", "info"].map((c: ButtonVariant) => {
                    return (
                        <>
                            <Header style={{ marginHorizontal: PALETTE.spacing.l }} size={3}>{c.toString().toUpperCase()} Buttons examples</Header>
                            <Panel style={{ display: 'flex', flexDirection: "column", justifyContent: "space-evenly", gap: PALETTE.spacing.m }}>
                                <View style={{ flexDirection: "row", justifyContent: "center", gap: PALETTE.spacing.s }}>
                                    <View style={{ flexDirection: "column", justifyContent: "center", gap: PALETTE.spacing.s, flex: 1 }}>
                                        <Button title={"Primary"} onPress={() => { }} variant={c} />
                                        <Button title={"Primary Outline"} onPress={() => { }} variant={c} outline />
                                        <Button title={"Primary Icon"} onPress={() => { }} variant={c} icon={IconSVGCode.agenda} />
                                        <Button title={"Icon Outline"} onPress={() => { }} variant={c} icon={IconSVGCode.agenda} outline />
                                    </View>
                                    <View style={{ flexDirection: "column", justifyContent: "center", gap: PALETTE.spacing.s, flex: 1 }}>
                                        <Button title={"Disabled"} onPress={() => { }} variant={c} disabled />
                                        <Button title={"Disabled"} onPress={() => { }} variant={c} disabled outline />
                                        <Button title={"Primary"} onPress={() => { }} variant={c} loading />
                                        <Button title={"Primary Outline"} onPress={() => { }} variant={c} loading outline />
                                    </View>
                                </View>
                                <View style={{ flexDirection: "column", justifyContent: "center", gap: PALETTE.spacing.s }}>
                                    <View style={{ flexDirection: "row", justifyContent: "center", gap: PALETTE.spacing.s }}>
                                        <Button onPress={() => { }} variant={c} icon={IconSVGCode.agenda} />
                                        <Button onPress={() => { }} variant={c} icon={IconSVGCode.agenda} disabled />
                                        <Button onPress={() => { }} variant={c} icon={IconSVGCode.agenda} loading />
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "center", gap: PALETTE.spacing.s }}>
                                        <Button onPress={() => { }} variant={c} icon={IconSVGCode.agenda} outline />
                                        <Button onPress={() => { }} variant={c} icon={IconSVGCode.agenda} disabled outline />
                                        <Button onPress={() => { }} variant={c} icon={IconSVGCode.agenda} loading outline />
                                    </View>
                                </View>
                            </Panel>
                        </>
                    )
                })}

                <View style={{ display: 'flex', flexDirection: "column" }}>
                    <Alert variant="primary" icon={IconSVGCode.infos} title="Alerte primary" />
                    <Alert variant="success" icon={IconSVGCode.check} title="Alerte success" />
                    <Alert variant="warning" icon={IconSVGCode.warning} title="Alerte warning" />
                    <Alert variant="danger" icon={IconSVGCode.xmark} title="Alerte danger" />
                    <Alert variant="info" icon={IconSVGCode.infos} title="Alerte info" />

                    <Alert variant="primary" icon={IconSVGCode.infos} title="Alerte primary" description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur eius animi doloremque fugiat fuga? Aliquid enim repellat eveniet numquam voluptates." />
                    <Alert variant="success" icon={IconSVGCode.check} title="Alerte success" description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur eius animi doloremque fugiat fuga? Aliquid enim repellat eveniet numquam voluptates." />
                    <Alert variant="warning" icon={IconSVGCode.warning} title="Alerte warning" description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur eius animi doloremque fugiat fuga? Aliquid enim repellat eveniet numquam voluptates." />
                    <Alert variant="danger" icon={IconSVGCode.xmark} title="Alerte danger" description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur eius animi doloremque fugiat fuga? Aliquid enim repellat eveniet numquam voluptates." />
                    <Alert variant="info" icon={IconSVGCode.infos} title="Alerte info" description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur eius animi doloremque fugiat fuga? Aliquid enim repellat eveniet numquam voluptates." />
                </View>

                {["primary", "success", "warning", "danger", "info", "neutral"].map((color: "primary" | "success" | "warning" | "danger" | "info" | "neutral") => {
                    return (
                        <>
                            <Header style={{ marginHorizontal: PALETTE.spacing.l }} size={3}>{color.toString().toUpperCase()} Pills examples</Header>
                            <Panel style={{ alignSelf: "stretch", display: 'flex', flexDirection: "column", gap: PALETTE.spacing.m }}>
                                <View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-evenly" }}>
                                    <View style={{ display: 'flex', flexDirection: "column" }}>
                                        <Pill variant={color} title={color + " xs"} size="xs" />
                                        <Pill variant={color} title={color + " s"} size="s" />
                                        <Pill variant={color} title={color + " m"} size="m" />
                                        <Pill variant={color} title={color + " l"} size="l" />
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: "column" }}>
                                        <Pill variant={color} title={color + " xs"} size="xs" inverted />
                                        <Pill variant={color} title={color + " s"} size="s" inverted />
                                        <Pill variant={color} title={color + " m"} size="m" inverted />
                                        <Pill variant={color} title={color + " l"} size="l" inverted />
                                    </View>
                                </View>
                            </Panel>
                        </>
                    )
                })}

                <Header style={{ marginHorizontal: PALETTE.spacing.l }} size={3}> Differents ripped ticket examples</Header>
                <Ticket side={Side.LEFT} />
                <Ticket side={Side.RIGHT} />
                <Ticket side={Side.TOP} />
                <Ticket side={Side.BOTTOM} />
            </Box>
        </PageBlock>
    )
}

export default Design;