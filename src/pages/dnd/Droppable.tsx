import { useTheme } from "@shopify/restyle";
import { FONTS, Theme } from "../../Palette";
import { LayoutChangeEvent, View } from "react-native";
import Item from "./Item";
import { DnDContext, Place as PlaceType } from "../../contexts/DragAndDropContext";
import { useContext, useEffect, useMemo, useRef } from "react";
import Place from "./Place";

type Props = {
    place: PlaceType
}

const Droppable = ({ place }: Props) => {

    const ref = useRef<View>();
    const { registerDroppableArea, unregisterDroppableAreaById } = useContext(DnDContext);

    useEffect(() => {
        return () => {
            unregisterDroppableAreaById(place.label)
        }
    }, [])

    const handleLayout = (e: LayoutChangeEvent) => {
        if (ref.current) {
            ref.current.measure((x, y, width, height, pageX, pageY) => {
                registerDroppableArea(place.label, { width, height, pageX, pageY })
            });
        }
    }

    const droppableContent = useMemo(() => {
        if (place.item != null) {
            return <Item item={place.item} />
        } else {
            return (
                <Place place={place} />
            )
        }
    }, [place.item])

    return (
        <View
            ref={ref}
            onLayout={e => handleLayout(e)}
        >
            {droppableContent}
        </View>
    )
}

export default Droppable