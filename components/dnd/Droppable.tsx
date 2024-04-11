import { LayoutChangeEvent, View } from "react-native";
import { DnDContext, Place as PlaceType } from "../../contexts/DragAndDropContext";
import React, { useContext, useEffect, useRef } from "react";

type Props = {
    place: PlaceType
    id: string
    children: React.JSX.Element
}

const Droppable = ({ children, id, place }: Props) => {

    const ref = useRef<View>();
    const { registerDroppableArea, unregisterDroppableAreaById, draggedFromDroppableId } = useContext(DnDContext);

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

    return (
        <View
            style={{ zIndex: draggedFromDroppableId == id ? 10000 : 8000 }}
            ref={ref}
            onLayout={e => handleLayout(e)}
        >
            {React.cloneElement(children, { droppableId: id })}
        </View>
    )
}

export default Droppable