import { useTheme } from "@shopify/restyle";
import { FONTS, Theme } from "../../Palette";
import Box from "../../components/Box";
import { Text, View } from "react-native";
import chroma from 'chroma-js'
import { Place as PlaceType } from "../../contexts/DragAndDropContext";
import Draggable from "./Draggable";
import Item from "./Item";

type Props = {
    place: PlaceType
    handleItemAffectation: (placeId: string, itemId: string | null, droppableId: string) => void
    droppableId?: string
    zIndex: number
}

const Place = ({ place, handleItemAffectation, droppableId, zIndex }: Props) => {

    const theme = useTheme<Theme>();


    return (
        <>
            <Box
                style={[
                    {
                        position: "relative",
                        zIndex: zIndex,
                        height: 80,
                        width: 112,
                        backgroundColor: chroma(theme.colors.primary).alpha(.25).hex(),
                        borderColor: chroma(theme.colors.primary).alpha(.5).hex(),
                        borderStyle: "dashed",
                        borderWidth: 2,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                ]}
            >
                <Box style={{ position: "relative", zIndex: 80 }}>
                    <Text style={{ fontSize: 28, fontFamily: FONTS.A700, color: theme.colors.textOnPrimary }}>{place.label.toUpperCase()}</Text>
                </Box>
                {place.item != null &&
                    <View style={{ position: "absolute", zIndex: 10000 }}>
                        <Draggable item={place.item} droppableId={droppableId} handleItemAffectation={handleItemAffectation} >
                            <Item item={place.item} />
                        </Draggable>
                    </View>
                }
            </Box>
        </>
    )
}

export default Place