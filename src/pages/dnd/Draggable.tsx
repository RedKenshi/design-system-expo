import { Gesture, GestureDetector, GestureUpdateEvent, PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import Item from "./Item";
import { DnDContext, Item as ItemType } from "../../contexts/DragAndDropContext";
import React, { useContext, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../Palette";

type Props = {
    item: ItemType
    children: React.JSX.Element
    handleItemAffectation: (placeId: string, itemId: string | null, droppableId: string | null) => void
    droppableId: string
}

const Draggable = ({ children, handleItemAffectation, item, droppableId }: Props) => {

    const theme = useTheme<Theme>()
    const ref = useRef<Animated.View>();

    const [absoluteCoordinate, setAbsoluteCoordinate] = useState<{ top: number, left: number, height: number, width: number } | null>(null)

    const { droppableMagnetism, setDraggedAbsoluteCoordinates, setDraggedFromDroppableId } = useContext(DnDContext)

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const shadowOpacity = useSharedValue(0);
    const scale = useSharedValue(1);
    const cursor = useSharedValue('grab');
    const opacity = useSharedValue(1);

    const MAGNET_SPRING_OPTIONS = { duration: 400, dampingRatio: .8 }
    const FALLBACK_SPRING_OPTIONS = { duration: 800, dampingRatio: .8 }

    const handleLayout = (e: LayoutChangeEvent) => {
        if (ref.current) {
            ref.current.measure((x, y, width, height, pageX, pageY) => {
                setAbsoluteCoordinate({
                    top: pageY,
                    left: pageX,
                    height: height,
                    width: width,
                })
            });
        }
    }

    const magnetize = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
        const magnet = droppableMagnetism(e)
        if (magnet != null) {
            translateY.value = withSpring(magnet.y - (absoluteCoordinate.height / 2), MAGNET_SPRING_OPTIONS)
            translateX.value = withSpring(magnet.x - (absoluteCoordinate.width / 2), MAGNET_SPRING_OPTIONS)
        } else {
            translateY.value = withSpring(e.translationY, MAGNET_SPRING_OPTIONS)
            translateX.value = withSpring(e.translationX, MAGNET_SPRING_OPTIONS)
        }
    }

    const cancelDrag = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
        translateY.value = 0
        translateX.value = 0
    }

    const onDragEnd = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
        const magnet = droppableMagnetism(e)
        if (magnet != null) {
            handleItemAffectation(magnet.id, item.label, droppableId ?? null)
        } else {
            handleItemAffectation(null, item.label, droppableId ?? null)
        }
    }

    const pan = Gesture.Pan().onBegin((e) => {
        cursor.value = 'grabbing';
        opacity.value = .6;
        runOnJS(setDraggedFromDroppableId)(droppableId)
        runOnJS(setDraggedAbsoluteCoordinates)({ top: absoluteCoordinate.top, left: absoluteCoordinate.left, height: absoluteCoordinate.height, width: absoluteCoordinate.width })
    }).onStart((e) => {
        scale.value = 1.1;
        shadowOpacity.value = .25;
        opacity.value = 1;
    }).onUpdate((e) => {
        runOnJS(magnetize)(e)
    }).onEnd((e) => {
        runOnJS(onDragEnd)(e)
        scale.value = 1;
        shadowOpacity.value = 0;
    }).onFinalize((e) => {
        runOnJS(cancelDrag)(e)
        runOnJS(setDraggedFromDroppableId)(null)
        scale.value = 1;
        cursor.value = 'grab'
        shadowOpacity.value = 0;
        opacity.value = 1
    });

    const itemStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateY.value },
                { translateX: translateX.value },
                { scale: scale.value },
            ],
            cursor: cursor.value,
            opacity: opacity.value,
            ...theme.shadow,
            shadowOpacity: shadowOpacity.value,
        };
    });

    return (
        <GestureDetector gesture={pan}>
            <Animated.View ref={ref} onLayout={e => handleLayout(e)} style={[{ position: "relative", zIndex: 10000000 }, itemStyle]}>
                {children}
            </Animated.View>
        </GestureDetector>
    )
}

export default Draggable