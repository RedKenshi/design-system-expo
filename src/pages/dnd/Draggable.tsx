import { Gesture, GestureDetector, GestureUpdateEvent, PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import Item from "./Item";
import { DnDContext, Item as ItemType } from "../../contexts/DragAndDropContext";
import { useContext, useRef, useState } from "react";
import { LayoutChangeEvent } from "react-native";

type Props = {
    item: ItemType
    handleItemAffectation: (placeId: string, itemId: string | null) => void
}

const Draggable = ({ item, handleItemAffectation }: Props) => {

    const LONG_PRESS_DELAY = 300;

    const ref = useRef<Animated.View>();

    const [absoluteCoordinate, setAbsoluteCoordinate] = useState<{ top: number, left: number, height: number, width: number } | null>(null)

    const { droppableMagnetism, setDraggedAbsoluteCoordinates, } = useContext(DnDContext)

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const cursor = useSharedValue('grab');
    const opacity = useSharedValue(1);

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
            translateY.value = withSpring(magnet.y - (absoluteCoordinate.height / 2), { duration: 600 })
            translateX.value = withSpring(magnet.x - (absoluteCoordinate.width / 2), { duration: 600 })
        } else {
            translateY.value = withSpring(e.translationY, { duration: 300 })
            translateX.value = withSpring(e.translationX, { duration: 300 })
        }
    }

    const magnetizeAndAffect = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
        const magnet = droppableMagnetism(e)
        if (magnet != null) {
            handleItemAffectation(magnet.id, item.label)
        } else {
            translateY.value = withSpring(e.translationY, { duration: 300 })
            translateX.value = withSpring(e.translationX, { duration: 300 })
        }
    }

    const magnetizeAndCancel = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
        const magnet = droppableMagnetism(e)
        if (magnet != null) {
            translateY.value = 0
            translateX.value = 0
        } else {
            translateY.value = withSpring(0, { duration: 700 })
            translateX.value = withSpring(0, { duration: 700 })
        }
    }

    const pan = Gesture.Pan().onBegin((e) => {
        cursor.value = 'grabbing';
        opacity.value = .6;
        runOnJS(setDraggedAbsoluteCoordinates)({ top: absoluteCoordinate.top, left: absoluteCoordinate.left, height: absoluteCoordinate.height, width: absoluteCoordinate.width })
    }).activateAfterLongPress(LONG_PRESS_DELAY).onStart((e) => {
        scale.value = 1.1;
        opacity.value = 1;
    }).onUpdate((e) => {
        runOnJS(magnetize)(e)
    }).onEnd((e) => {
        runOnJS(magnetizeAndAffect)(e)
        scale.value = 1
    }).onFinalize((e) => {
        runOnJS(magnetizeAndCancel)(e)
        cursor.value = 'grab'
        scale.value = 1
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
            opacity: opacity.value
        };
    });

    return (
        <GestureDetector gesture={pan}>
            <Animated.View ref={ref} onLayout={e => handleLayout(e)} style={[{ position: "relative", zIndex: 1000000 }, itemStyle]}>
                <Item item={item} />
            </Animated.View>
        </GestureDetector>
    )
}

export default Draggable