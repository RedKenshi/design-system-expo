import { Dimensions, ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from "../Palette"
import Panel from "../components/Panel"

import Box from "../components/Box"
import PageBlock from "../components/PageBlock"
import { useTheme } from "@shopify/restyle"
import { useState } from "react";
import Draggable from "./dnd/Draggable";
import Droppable from "./dnd/Droppable";
import { FlatList } from "react-native-gesture-handler";
import Item from "./dnd/Item";
import Place from "./dnd/Place";
import { Item as ItemType } from "../contexts/DragAndDropContext";
import { IconSVGCode } from "../IconSVG";

type Props = {}

export const Dnd = ({ }: Props) => {

    const theme = useTheme<Theme>();

    const insets = useSafeAreaInsets();

    const windowWidth = Dimensions.get('window').width;

    const padding = {
        paddingLeft: insets.left + theme.spacing.xl,
        paddingRight: insets.right + theme.spacing.xl,
    } as ViewStyle

    const [items, setItems] = useState<ItemType[]>([
        { label: 'a', color: theme.colors.primary, icon: IconSVGCode.send },
        { label: 'b', color: theme.colors.success, icon: IconSVGCode.xmark },
        { label: 'c', color: theme.colors.warning, icon: IconSVGCode.flame },
        { label: 'd', color: theme.colors.danger, icon: IconSVGCode.finger_point },
        { label: 'e', color: theme.colors.info, icon: IconSVGCode.cashdrawer },
        { label: 'f', color: theme.colors.yellow, icon: IconSVGCode.cashdrawer }
    ]);
    const [places, setPlaces] = useState([
        { label: '1', item: null },
        { label: '2', item: null },
        { label: '3', item: null },
        { label: '4', item: null },
        { label: '5', item: null },
        { label: '6', item: null },
    ]);

    const handleItemAffectation = (placeId: string | null, itemId: string | null, droppableId: string) => {
        let tmp = JSON.parse(JSON.stringify(places))
        if (droppableId) {
            tmp[tmp.findIndex(x => `bar${x.label - 1}` == droppableId)].item = null
        }
        if (placeId) {
            tmp[tmp.findIndex(x => x.label == placeId)].item = JSON.parse(JSON.stringify(items.find(x => x.label == itemId)))
        }
        setPlaces(tmp)
    }


    return (
        <>
            <PageBlock style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: 'row', height: "100%", width: "100%", alignSelf: "center" }} >
                <Box flexDirection={"column"} paddingVertical='xl' gap="l" marginHorizontal={{ tablet: 'l' }} justifyContent="space-evenly" style={[padding, { width: '100%', alignSelf: "stretch" }]} >
                    <Panel style={{ zIndex: 10000, overflow: "visible", alignSelf: "stretch", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginBottom: 220 }}>
                        <FlatList numColumns={windowWidth > theme.breakpoints.largeTablet ? 3 : 2} data={items} style={{ overflow: "visible" }} contentContainerStyle={{ zIndex: 10000, gap: 16 }} columnWrapperStyle={{ justifyContent: "space-evenly" }} renderItem={({ item, index }) => {
                            return (
                                <Droppable key={`available${index}`} place={item}>
                                    <Draggable item={item} handleItemAffectation={handleItemAffectation} key={`item${index}`} >
                                        <Item item={item} />
                                    </Draggable>
                                </Droppable>
                            )
                        }} />
                    </Panel>
                    <Box style={{ position: "absolute", overflow: "visible", zIndex: 8000, paddingHorizontal: 16, bottom: 0, left: 0, right: 0, height: 220, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }} backgroundColor={'surface'} >
                        <FlatList numColumns={windowWidth > theme.breakpoints.largeTablet ? 6 : 3} data={places} style={{ overflow: "visible" }} contentContainerStyle={{ gap: 16 }} columnWrapperStyle={{ justifyContent: "space-between" }} renderItem={({ item, index }) => {
                            return (
                                <Droppable id={`bar${index}`} key={`bar${index}`} place={item}>
                                    <Place place={item} handleItemAffectation={handleItemAffectation} />
                                </Droppable>
                            )
                        }} />
                    </Box>
                </Box>
            </PageBlock>
        </>
    )
}

export default Dnd;