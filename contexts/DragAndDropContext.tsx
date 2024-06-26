import React, { createContext, useEffect, useRef, useState } from "react"
import { GestureUpdateEvent, PanGestureHandlerEventPayload } from "react-native-gesture-handler"
import { IconSVGCode } from "../components/IconSVG"

type DnDContext = {
    registeredDroppableAreas: RegisteredDroppable[]
    registerDroppableArea: (id: string, lr: { width: number, height: number, pageX: number, pageY: number }) => void
    unregisterDroppableAreaById: (id: string) => void
    droppableMagnetism: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => { id: string, x: number, y: number },
    draggedAbsoluteCoordinates: { top: number, left: number },
    setDraggedAbsoluteCoordinates: (params: { top: number, left: number, height: number, width: number }) => void
    draggedFromDroppableId: string | null
    setDraggedFromDroppableId: (id: string) => void
}
type RegisteredDroppable = {
    id: string
    layout: { width: number, height: number, pageX: number, pageY: number }
}
type Props = {
    children: React.ReactNode
}
export type Place = {
    label: string,
    item: Item | null
}
export type Item = {
    label: string,
    color: string
    icon: IconSVGCode
}

export const DnDContext = createContext<DnDContext>({
    registeredDroppableAreas: [],
    registerDroppableArea: undefined,
    unregisterDroppableAreaById: undefined,
    droppableMagnetism: undefined,
    draggedAbsoluteCoordinates: undefined,
    setDraggedAbsoluteCoordinates: undefined,
    draggedFromDroppableId: null,
    setDraggedFromDroppableId: (id: string) => { }
})

export const DnDProvider = ({ children }: Props) => {

    const registeredDroppableAreas = useRef<RegisteredDroppable[]>([])
    const [draggedFromDroppableId, setDraggedFromDroppableId] = useState<string | null>(null)
    const [draggedAbsoluteCoordinates, setDraggedAbsoluteCoordinates] = useState<{ top: number, left: number, height: number, width: number } | null>(null)

    const registerDroppableArea = (id: string, lr: { width: number, height: number, pageX: number, pageY: number }) => {
        let tmp: RegisteredDroppable[] = JSON.parse(JSON.stringify(registeredDroppableAreas.current)).filter(x => x.id != id)
        tmp.push({ id, layout: lr })
        registeredDroppableAreas.current = tmp
    }
    const unregisterDroppableAreaById = (id: string) => {
        if (registeredDroppableAreas.current.some(x => x.id == id)) {
            let tmp = registeredDroppableAreas.current.filter(x => x.id != id)
            registeredDroppableAreas.current = tmp
        }
    }

    const isInside = ({ draggableX, draggableY, droppableX, droppableY, droppableW, droppableH }) => {
        if (draggableX >= droppableX && draggableX <= (droppableX + droppableW) && draggableY >= droppableY && draggableY <= (droppableY + droppableH)) {
        }
        return draggableX >= droppableX && draggableX <= (droppableX + droppableW) &&
            draggableY >= droppableY && draggableY <= (droppableY + droppableH);
    }

    const droppableMagnetism = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>): { id: string, x: number, y: number } => {
        let res = null;
        registeredDroppableAreas.current.forEach(drop => {
            if (isInside({
                draggableX: e.absoluteX,
                draggableY: e.absoluteY,
                droppableX: drop.layout.pageX,
                droppableY: drop.layout.pageY,
                droppableH: drop.layout.height,
                droppableW: drop.layout.width
            })) {
                res = {
                    id: drop.id,
                    x: drop.layout.pageX - draggedAbsoluteCoordinates.left + (drop.layout.width / 2),
                    y: drop.layout.pageY - draggedAbsoluteCoordinates.top + (drop.layout.height / 2)
                }
            }
        })
        return res
    }

    const values = {
        registeredDroppableAreas: registeredDroppableAreas.current,
        registerDroppableArea,
        unregisterDroppableAreaById,
        droppableMagnetism,
        draggedAbsoluteCoordinates,
        setDraggedAbsoluteCoordinates,
        draggedFromDroppableId,
        setDraggedFromDroppableId
    }

    return (
        <DnDContext.Provider value={values}>
            {children}
        </DnDContext.Provider>
    )
}