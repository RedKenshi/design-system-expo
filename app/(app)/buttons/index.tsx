import { View, ViewStyle } from "react-native"
import Button, { ButtonVariant } from "../../../components/Button"
import { IconSVGCode } from "../../../components/IconSVG"
import Pill from "../../../components/Pill"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from "../../../constants/Palette"
import Header from "../../../components/Header"
import Legend from "../../../components/Legend"
import Panel from "../../../components/Panel"
import TextFormRow from "../../../components/formRow/TextFormRow"
import InlineSelectFormRow from "../../../components/formRow/InlineSelectFormRow"
import { useState } from "react"

import Box from "../../../components/Box"
import PageBlock from "../../../components/PageBlock"
import { useTheme } from "@shopify/restyle"
import ModalNative from "../../../components/ModalNative"

type Props = {}

export const Buttons = ({ }: Props) => {

    const theme = useTheme<Theme>();

    const [openModalS, setOpenModalS] = useState(false);
    const [selectedSize, setSelectedSize] = useState<'s' | 'm' | 'l'>()
    const insets = useSafeAreaInsets();

    const padding = {
        paddingLeft: insets.left + theme.spacing.m,
        paddingRight: insets.right + theme.spacing.m,
    } as ViewStyle
    return (
        <>
            <ModalNative open={openModalS} setOpen={setOpenModalS} actions={[
                { variant: "danger", onPress: () => setOpenModalS(false), title: "No", icon: IconSVGCode.xmark },
                { variant: "primary", onPress: () => setOpenModalS(false), title: "Yes", icon: IconSVGCode.check }
            ]} >
                <View style={{ flex: 1, paddingVertical: theme.spacing.m, paddingHorizontal: theme.spacing.m }} >
                    <TextFormRow value={"IS PRIMARY"} handleChange={() => { }} title={"UN"} />
                    <InlineSelectFormRow title="Size" handleChange={(e) => setSelectedSize(e)} selected={selectedSize} options={[
                        { label: 'S', value: 1 },
                        { label: 'M', value: 2 },
                        { label: 'L', value: 3 }
                    ]} />
                </View>
            </ModalNative>
            <PageBlock style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: 'row' }} >
                <Box marginHorizontal={{ tablet: 'l' }} justifyContent="space-evenly" style={[padding, { maxWidth: "100%", paddingBottom: "50%" }]} >
                    <Header style={{ marginHorizontal: theme.spacing.l }} size={3}>Modal examples</Header>
                    <Panel style={{ display: 'flex', flexDirection: "column", gap: theme.spacing.m }}>
                        <View style={{ display: 'flex', flexDirection: "row", justifyContent: "space-evenly" }} >
                            <View style={{ gap: theme.spacing.s }}>
                                <Button size={"s"} title={"Primary"} onPress={() => setOpenModalS(true)} variant='primary' />
                                <Button size={"m"} title={"Primary"} onPress={() => setOpenModalS(true)} variant='primary' />
                                <Button size={"l"} title={"Primary"} onPress={() => setOpenModalS(true)} variant='primary' />
                            </View>
                            <View style={{ gap: theme.spacing.s, alignItems: "flex-end" }}>
                                <Button size={"s"} onPress={() => setOpenModalS(true)} variant='primary' icon={IconSVGCode.agenda} />
                                <Button size={"m"} onPress={() => setOpenModalS(true)} variant='primary' icon={IconSVGCode.agenda} />
                                <Button size={"l"} onPress={() => setOpenModalS(true)} variant='primary' icon={IconSVGCode.agenda} />
                            </View>
                        </View>
                        <View style={{ alignSelf: "center" }}>
                            <Legend>Click on any of the buttons above to open a exemple of modal and see exemple of form input, this legends should be long enough to need a second row to display</Legend>
                        </View>
                    </Panel>
                    {["primary", "success", "warning", "danger", "info"].map((c: ButtonVariant) => {
                        return (
                            <>
                                <Header style={{ marginHorizontal: theme.spacing.l }} size={3}>{c.toString().toUpperCase()} Buttons examples</Header>
                                <Panel style={{ display: 'flex', flexDirection: "column", justifyContent: "space-evenly", gap: theme.spacing.m }}>
                                    <View style={{ flexDirection: "row", justifyContent: "center", gap: theme.spacing.s }}>
                                        <View style={{ flexDirection: "column", justifyContent: "center", gap: theme.spacing.s, flex: 1 }}>
                                            <Button title={"Primary"} onPress={() => { }} variant={c} />
                                            <Button title={"Primary Outline"} onPress={() => { }} variant={c} outline />
                                            <Button title={"Primary Icon"} onPress={() => { }} variant={c} icon={IconSVGCode.agenda} />
                                            <Button title={"Icon Outline"} onPress={() => { }} variant={c} icon={IconSVGCode.agenda} outline />
                                        </View>
                                        <View style={{ flexDirection: "column", justifyContent: "center", gap: theme.spacing.s, flex: 1 }}>
                                            <Button title={"Disabled"} onPress={() => { }} variant={c} disabled />
                                            <Button title={"Disabled"} onPress={() => { }} variant={c} disabled outline />
                                            <Button title={"Primary"} onPress={() => { }} variant={c} loading />
                                            <Button title={"Primary Outline"} onPress={() => { }} variant={c} loading outline />
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "column", justifyContent: "center", gap: theme.spacing.s }}>
                                        <View style={{ flexDirection: "row", justifyContent: "center", gap: theme.spacing.s }}>
                                            <Button onPress={() => { }} variant={c} icon={IconSVGCode.agenda} />
                                            <Button onPress={() => { }} variant={c} icon={IconSVGCode.agenda} disabled />
                                            <Button onPress={() => { }} variant={c} icon={IconSVGCode.agenda} loading />
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "center", gap: theme.spacing.s }}>
                                            <Button onPress={() => { }} variant={c} icon={IconSVGCode.agenda} outline />
                                            <Button onPress={() => { }} variant={c} icon={IconSVGCode.agenda} disabled outline />
                                            <Button onPress={() => { }} variant={c} icon={IconSVGCode.agenda} loading outline />
                                        </View>
                                    </View>
                                </Panel>
                            </>
                        )
                    })}
                    {["primary", "success", "warning", "danger", "info", "neutral"].map((color: "primary" | "success" | "warning" | "danger" | "info" | "neutral") => {
                        return (
                            <>
                                <Header style={{ marginHorizontal: theme.spacing.l }} size={3}>{color.toString().toUpperCase()} Pills examples</Header>
                                <Panel style={{ alignSelf: "stretch", display: 'flex', flexDirection: "column", gap: theme.spacing.m }}>
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
                </Box>
            </PageBlock>
        </>
    )
}

export default Buttons;