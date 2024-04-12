import { useState } from "react"
import { Gesture, GestureDetector, GestureStateChangeEvent, PanGestureHandlerEventPayload } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"

type Props = {
    children: JSX.Element | JSX.Element[],
    onTap?: Function
    onSwipeUp?: Function
    onSwipeDown?: Function
}

export const SwipeDetector = ({ children, onSwipeUp, onSwipeDown, onTap }: Props) => {

    const triggerUp = () => {
        onSwipeUp()
    }
    const triggerDown = () => {
        onSwipeDown()
    }
    const notASwipe = () => {
        if (onTap) {
            onTap()
        }
    }

    const Ymin = 30;
    const [touchIn, setTouchIn] = useState<GestureStateChangeEvent<PanGestureHandlerEventPayload>>(null)

    const pan = Gesture.Pan().onStart(e => {
        console.log("in")
        runOnJS(setTouchIn)(e)
    }).onEnd(e => {
        if (touchIn) {
            if (Math.abs(touchIn.absoluteY - e.absoluteY) > Ymin) {
                if (touchIn.absoluteY - e.absoluteY > 0) {
                    runOnJS(triggerUp)()
                } else {
                    runOnJS(triggerDown)()
                }
            } else {
                runOnJS(notASwipe)()
            }
        }
    })

    const tap = Gesture.Tap().onEnd(e => {

        runOnJS(notASwipe)()
    })

    return (
        <GestureDetector gesture={tap}>
            <GestureDetector gesture={pan}>
                {children}
            </GestureDetector>
        </GestureDetector>
    )
}
export default SwipeDetector