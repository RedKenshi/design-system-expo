import { Image, ViewStyle, StyleSheet, Pressable } from "react-native"
import { IconSVG, IconSVGCode } from "../../../components/IconSVG"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from "../../../constants/Palette"
import Header from "../../../components/Header"
import Panel from "../../../components/Panel"
import { useCallback, useEffect, useMemo, useState } from "react"

import Box from "../../../components/Box"
import PageBlock from "../../../components/PageBlock"
import { useTheme } from "@shopify/restyle"
import CustomTextField from "../../../components/inputs/CustomTextField";
import CustomText from "../../../components/CustomText";
import { isCloseEnough } from "../../../constants/utils";

type Props = {}

export const Settings = ({ }: Props) => {

    const theme = useTheme<Theme>();
    const [searchFilter, setSearchFilter] = useState<string>("")
    const insets = useSafeAreaInsets();
    const padding = {
        paddingLeft: insets.left + theme.spacing.m,
        paddingRight: insets.right + theme.spacing.m,
    } as ViewStyle

    type SettingsTree = {
        title: string,
        subTree: {
            title: string,
            icon: IconSVGCode
        }[]
    }[]

    const settingsTree = useMemo<SettingsTree>(() => {
        return [
            {
                title: "PARAMÈTRES UTILISATION",
                subTree: [
                    { icon: IconSVGCode.gear, title: "Général" },
                    { icon: IconSVGCode.bank, title: "Établissement" },
                    { icon: IconSVGCode.interface, title: "Interface" },
                    { icon: IconSVGCode.finger_point, title: "Contrôles" },
                    { icon: IconSVGCode.calculator, title: "Options de caisse" },
                    { icon: IconSVGCode.ticket, title: "Prise de commande" },
                    { icon: IconSVGCode.service_bell, title: "Fabrication" },
                    { icon: IconSVGCode.printer, title: "Impressions et justificatifs" },
                ]
            },
            {
                title: "PARAMÈTRES AVANCÉS",
                subTree: [
                    { icon: IconSVGCode.gear, title: "Général" },
                    { icon: IconSVGCode.bank, title: "Établissement" },
                    { icon: IconSVGCode.interface, title: "Interface" },
                    { icon: IconSVGCode.finger_point, title: "Contrôles" },
                    { icon: IconSVGCode.calculator, title: "Options de caisse" },
                    { icon: IconSVGCode.ticket, title: "Prise de commande" },
                    { icon: IconSVGCode.service_bell, title: "Fabrication" },
                    { icon: IconSVGCode.printer, title: "Impressions et justificatifs" },
                ]
            }
        ]
    }, [])

    const filteredSettings = useMemo(() => {
        if (searchFilter == null || searchFilter == "") return null
        let tmp: SettingsTree = JSON.parse(JSON.stringify(settingsTree))
        tmp.forEach(branch => {
            branch.subTree = branch.subTree.filter(subBranch => isCloseEnough(subBranch.title, searchFilter))
        });
        tmp.filter(branch => branch.subTree.length > 0)
        return tmp
    }, [searchFilter, settingsTree])

    const settings = (tree: SettingsTree) => {
        return (
            <>
                {tree.map(branch =>
                    <>
                        <Header style={{ marginHorizontal: theme.spacing.s }} size={4}>{branch.title}</Header>
                        <Panel style={{ display: 'flex', flexDirection: "column", paddingVertical: 0 }}>
                            {branch.subTree.map((subBranch, index) =>
                                <Pressable onPress={() => { }}>
                                    <Box flexDirection={"row"} borderTopWidth={index && .5} borderColor={"background"} alignItems={"center"} gap={'s'} paddingHorizontal={'xs'} paddingVertical={'m'}>
                                        <IconSVG icon={subBranch.icon} fill={'primary'} size="big" />
                                        <CustomText color="textOnSurface" size={18} font="A400" >{subBranch.title}</CustomText>
                                    </Box>
                                </Pressable>
                            )}
                        </Panel>
                    </>
                )}
            </>
        )
    }

    const getBody = useMemo(() => {
        if (filteredSettings == null) {
            return (
                <>
                    <Panel style={{ display: 'flex', flexDirection: "row", gap: theme.spacing.m, alignItems: 'center' }}>
                        <Image height={64} width={64} style={{ borderRadius: 40 }} source={{ uri: "https://envato-shoebox-0.imgix.net/a6df/54ce-c96a-4d11-a97c-46aa68544638/DSC05345.JPG?auto=compress%2Cformat&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark2.png&w=1200&fit=max&markalign=center%2Cmiddle&markalpha=18&s=9aeb6fab795171fce9a424ff00b6c216" }} />
                        <Box flexDirection={"column"} flex={1} justifyContent={'center'} marginTop={'s'}>
                            <CustomText font={"A800"} size={24} color="textOnSurface" variant='onSurface'>Chez Yvonne</CustomText>
                            <CustomText font={"A400"} size={15} color="textFadded" >Informations société</CustomText>
                        </Box>
                        <IconSVG icon={IconSVGCode.chevron_right} size="bigger" fill={'textOnFullThemeInverse'} />
                    </Panel>
                    {settings(settingsTree)}
                </>
            )
        } else {
            return (
                settings(filteredSettings)
            )
        }
    }, [filteredSettings, settingsTree])

    return (
        <PageBlock style={{ display: "flex", flexDirection: 'row', height: "100%", width: "100%" }} >
            <Box marginHorizontal={{ tablet: 'l' }} justifyContent="flex-start" style={[padding, { maxWidth: "100%", width: "100%", height: "100%", paddingBottom: "50%" }]} >
                {/*<Header style={{ marginHorizontal: theme.spacing.s, marginTop: theme.spacing.xl }} size={1}>PARAMÈTRES</Header>*/}
                <Box marginBottom={'xs'} marginTop={"l"}>
                    <CustomTextField onBackground value={""} placeholder="Rechercher un paramètre" handleChange={(string) => setSearchFilter(string)} />
                </Box>
                {getBody}
            </Box>
        </PageBlock>
    )
}

export default Settings;

const styles = StyleSheet.create({
    hr: {
        alignSelf: "center",
        width: "95%",
        margin: "auto",
        borderBottomWidth: 1,
    }
})
