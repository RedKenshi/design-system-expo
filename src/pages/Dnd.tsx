import { ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from "../Palette"
import Panel from "../components/Panel"

import Box from "../components/Box"
import PageBlock from "../components/PageBlock"
import { useTheme } from "@shopify/restyle"
import { useState } from "react";
import Draggable from "./dnd/Draggable";
import Droppable from "./dnd/Droppable";

type Props = {}

export const Dnd = ({ }: Props) => {

    const theme = useTheme<Theme>();

    const insets = useSafeAreaInsets();

    const padding = {
        paddingLeft: insets.left + theme.spacing.xl,
        paddingRight: insets.right + theme.spacing.xl,
    } as ViewStyle

    const [items, setItems] = useState([
        { label: 'a', color: theme.colors.primary },
        { label: 'b', color: theme.colors.success },
        { label: 'c', color: theme.colors.warning },
        { label: 'd', color: theme.colors.danger }
    ]);
    const [places, setPlaces] = useState([
        { label: '1', item: null },
        { label: '2', item: null },
        { label: '3', item: null }
    ]);

    const handleItemAffectation = (placeId: string, itemId: string | null) => {
        let tmp = JSON.parse(JSON.stringify(places))
        tmp[tmp.findIndex(x => x.label == placeId)].item = JSON.parse(JSON.stringify(items.find(x => x.label == itemId)))
        setPlaces(tmp)
    }

    return (
        <>
            <PageBlock style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: 'row', height: "100%", width: "100%", alignSelf: "center" }} >
                <Box flexDirection={"column"} paddingVertical='xl' gap="l" marginHorizontal={{ tablet: 'l' }} justifyContent="space-evenly" style={[padding, { maxWidth: "100%", flex: 1, alignSelf: "stretch" }]} >
                    <Panel style={{ flex: 1, zIndex: 800, alignSelf: "stretch", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                        {items.map((item, index) => (
                            <Draggable handleItemAffectation={handleItemAffectation} key={`item${index}`} item={item} />
                        ))}
                    </Panel>
                    <Panel style={{ flex: 1, alignSelf: "stretch", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                        {places.map((place, index) => (
                            <Droppable key={`place${index}`} place={place} />
                        ))}
                    </Panel>
                </Box>
            </PageBlock>
        </>
    )
}

export default Dnd;