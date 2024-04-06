import { useTheme } from "@shopify/restyle";
import { FONTS, Theme } from "../../Palette";
import Box from "../../components/Box";
import { Text } from "react-native";
import chroma from 'chroma-js'
import { Place as PlaceType } from "../../contexts/DragAndDropContext";
import Draggable from "./Draggable";
import Item from "./Item";

type Props = {
    place: PlaceType
    handleItemAffectation: (placeId: string, itemId: string | null) => void
    droppableId?: string
}

const Place = ({ place, handleItemAffectation, droppableId }: Props) => {

    const theme = useTheme<Theme>();

    if (place.item != null) {
        return (
            <Draggable item={place.item} collection={''} droppableId={droppableId} handleItemAffectation={handleItemAffectation} >
                <Item item={place.item} />
            </Draggable>
        )
    } else {
        return (
            <Box
                style={[
                    {
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
                <Box style={{}}>
                    <Text style={{ fontSize: 28, fontFamily: FONTS.A700, color: theme.colors.textOnPrimary }}>{place.label.toUpperCase()}</Text>
                </Box>
            </Box>
        )
    }
}

export default Place