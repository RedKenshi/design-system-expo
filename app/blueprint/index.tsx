import { FlatList, LayoutChangeEvent, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Theme } from "../../constants/Palette"
import card from '../../constants/fakeCard.json'

import Box from "../../components/Box"
import { useTheme } from "@shopify/restyle"
import CategoryTile from "../../components/checkout/CategoryTile";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "../../components/Button";
import { IconSVG, IconSVGCode } from "../../components/IconSVG";
import { router } from "expo-router";

import chroma from "chroma-js"
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, SharedValue, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import CustomText from "../../components/CustomText";
import { Product, RegisterAbsoluteLayout } from "../../constants/types";
import { overlapMarginError } from "../../constants/utils";

import _ from 'lodash'
import ModalNative from "../../components/ModalNative"

//TODO
/*
- inversion on drop on placed
*/

type Props = {}

type Cell = {
    id: string;
    coordinates: {
        x: number,
        y: number,
        h: number,
        w: number
    } | null,
    layout: {
        top: number;
        left: number;
        height: number;
        width: number;
    } | null;
    content: null | Product;
    occupied?: boolean
}

const gridX = 3;
const gridY = 12;
const cellHWFactor = .7;
const gridGap = 'xs';
const delayLongPress = 100;
const fingerDodge = 80;
const overlapMinimum = 20;

export const Blueprint = ({ }: Props) => {

    const theme = useTheme<Theme>();

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const scrollRef = useRef<View>();

    const [blueprint, setBlueprint] = useState<Cell[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>()
    const [gridWidth, setGridWidth] = useState<number | null>()
    const [scrollViewLayout, setScrollViewLayout] = useState<RegisterAbsoluteLayout | null>(null)
    const [onScrollEndContentOffset, setOnScrollEndContentOffset] = useState<number>(0)
    const [dragged, setDragged] = useState<Product | null>(null)
    const [draggedOrigin, setDraggedOrigin] = useState<null | Cell>(null)

    const scrollHeight = useSharedValue(0)

    const [hovered, setHovered] = useState<string[]>([])

    const cellWidth = useMemo(() => {
        if (gridWidth) {
            return gridWidth / gridX - 3 // - 3 is there to compensate for total border width
        } else {
            return 48
        }
    }, [gridWidth])

    const cellHeight = useMemo(() => {
        if (cellWidth) {
            return cellWidth * cellHWFactor
        } else {
            return 48 * cellHWFactor
        }
    }, [cellWidth])

    const scrollTriggerInterval = useMemo(() => {
        if (scrollViewLayout) {
            let tmp = {
                intervalUp: {
                    from: scrollViewLayout.layout.pageY,
                    to: scrollViewLayout.layout.pageY + (.9 * cellHeight)
                },
                intervalDown: {
                    from: (scrollViewLayout.layout.pageY + scrollViewLayout.layout.height) - (.9 * cellHeight),
                    to: (scrollViewLayout.layout.pageY + scrollViewLayout.layout.height)
                }
            }
            return tmp
        }
    }, [scrollViewLayout, cellHeight])

    const getPositionAndSizesFromXYCoordinates = ({ x, y, h, w }: { x: number, y: number, h: number, w: number }) => {
        const tmp = {
            top: y * cellHeight + ((y) * theme.spacing[gridGap]),
            left: x * cellWidth + ((x) * theme.spacing[gridGap]),
            height: (cellHeight * h + ((h - 1) * theme.spacing[gridGap])),
            width: (cellWidth * w + ((w - 1) * theme.spacing[gridGap]))
        };
        scrollHeight.value = Math.floor(Math.max(scrollHeight.value, (tmp.top + tmp.height)))
        return tmp
    }

    const grid = useMemo(() => {
        let res: Cell[] = [];
        blueprint.map(pb => {
            res.push({
                id: pb.coordinates.x + "x" + pb.coordinates.y + "x" + pb.content.id,
                coordinates: pb.coordinates,
                layout: getPositionAndSizesFromXYCoordinates({ ...pb.coordinates }),
                content: pb.content
            })
        })
        Array(gridY).fill('').map((y, indexI) => {
            return (
                Array(gridX).fill('').map((x, indexJ) => {
                    res.push({
                        id: indexI + "x" + indexJ + "x-",
                        coordinates: {
                            h: 1,
                            w: 1,
                            y: indexI,
                            x: indexJ
                        },
                        layout: getPositionAndSizesFromXYCoordinates({ h: 1, w: 1, y: indexI, x: indexJ }),
                        content: null,
                        occupied: !(blueprint.some(pb => {
                            return indexJ < pb.coordinates.x || indexJ >= pb.coordinates.x + pb.coordinates.w || indexI < pb.coordinates.y || indexI >= pb.coordinates.y + pb.coordinates.h;
                        }))
                    })
                })
            )
        })
        return res
    }, [card, gridWidth, blueprint])

    const potentialDropTargets = useMemo<Cell[]>(() => {
        if (scrollViewLayout) {
            let tmp = [];
            grid.filter(c => c.content == null).forEach(cell => {
                let top = cell.layout.top;
                let bottom = cell.layout.top + cell.layout.height;
                let topLimit = onScrollEndContentOffset
                let bottomLimit = onScrollEndContentOffset + scrollViewLayout.layout.height
                if ((topLimit < top && top < bottomLimit) || (topLimit < bottom && bottom < bottomLimit)) {
                    tmp.push(cell)
                }
            });
            return tmp
        } else {
            return null
        }
    }, [onScrollEndContentOffset, grid, scrollViewLayout])

    const queueHighlightTargetUnder = _.throttle(({ absX, absY }: { absX: number, absY: number }) => {
        highlightTargetUnder({ absX, absY })
    }, 250, { 'trailing': false });

    const highlightTargetUnder = ({ absX, absY }: { absX: number, absY: number }) => {
        if (dragged) {
            let ins = []
            let relY = absY - scrollViewLayout.layout.pageY + onScrollEndContentOffset
            let relX = absX - scrollViewLayout.layout.pageX
            if (overlapMarginError({
                draggableX: absX,
                draggableY: absY,
                draggableH: cellHeight,
                draggableW: cellWidth,
                droppableX: scrollViewLayout.layout.pageX,
                droppableY: scrollViewLayout.layout.pageY,
                droppableH: scrollViewLayout.layout.height,
                droppableW: scrollViewLayout.layout.width,
            }, overlapMinimum)) {
                potentialDropTargets.forEach(target => {
                    if (overlapMarginError({
                        draggableX: relX,
                        draggableY: relY,
                        draggableH: cellHeight,
                        draggableW: cellWidth,
                        droppableX: target.layout.left,
                        droppableY: target.layout.top,
                        droppableH: target.layout.height,
                        droppableW: target.layout.width,

                    }, overlapMinimum)) {
                        ins.push(target.coordinates.x + "x" + target.coordinates.y)
                    }
                });
            }
            setHovered(ins)
        }
    }
    const addProductToDropIds = ({ product, dropIds, removeAfterAdding }: { product: Product, dropIds: string[], removeAfterAdding: Cell | null }) => {
        let xMin = Math.min(...dropIds.map(x => parseInt(x.split('x')[0])))
        let yMin = Math.min(...dropIds.map(x => parseInt(x.split('x')[1])))
        let xMax = Math.max(...dropIds.map(x => parseInt(x.split('x')[0])))
        let yMax = Math.max(...dropIds.map(x => parseInt(x.split('x')[1])))
        addProductToBlueprint({
            product,
            x: xMin,
            y: yMin,
            h: yMax - yMin + 1,
            w: xMax - xMin + 1,
            removeAfterAdding
        })
    }
    const addProductToBlueprint = ({ product, x, y, w, h, removeAfterAdding }: { product: Product, x: number, y: number, w: number, h: number, removeAfterAdding: Cell | null }) => {
        let tmp = JSON.parse(JSON.stringify(blueprint))
        if (removeAfterAdding) {
            tmp = tmp.filter(x => x.id !== removeAfterAdding.id)
        }
        tmp.push({
            id: x + "x" + y + "x" + product.id,
            coordinates: { x, y, w, h },
            layout: null,
            content: product
        } as Cell)
        setBlueprint(tmp)
    }
    const handleDrop = () => {
        if (dragged) {
            if (hovered.length > 0) {
                addProductToDropIds({
                    product: dragged,
                    dropIds: hovered,
                    removeAfterAdding: draggedOrigin ?? null
                })
            }
        }
        resetDrag()
    }
    const handleGrab = (product: Product, originCell: Cell | null) => {
        if (product) {
            setDragged(product)
            setDraggedOrigin(originCell)
        }
    }
    const resetDrag = () => {
        setDragged(null)
        setDraggedOrigin(null)
        setHovered([])
        setWantoToGo(null)
    }
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateY.value },
                { translateX: translateX.value }
            ]
        };
    });
    const handleLayout = (e: LayoutChangeEvent) => {
        setGridWidth(e.nativeEvent.layout.width)
        if (scrollRef.current) {
            scrollRef.current.measure((x, y, width, height, pageX, pageY) => {
                setScrollViewLayout({ id: "scrollView", layout: { width, height, pageX, pageY } })
            });
        }
    }
    const isHovered = (cell: Cell) => {
        return hovered.includes(cell.coordinates.x + "x" + cell.coordinates.y)
    }
    const grabPlacedItem = (cell: Cell) => {
        if (cell.content) {
            handleGrab(cell.content, cell);
        }
    }
    const removeFromBlueprint = (cell: Cell) => {
        setBlueprint(blueprint.filter(x => x.id != cell.id))
    }

    const [wantoToGo, setWantoToGo] = useState<"up" | "down" | null>(null)
    const [autoScrollTarget, setAutoScrollTarget] = useState<number | null>(null)

    const updateScrollTarget = () => {
        if (wantoToGo === "up") {
            setAutoScrollTarget(onScrollEndContentOffset - (2 * cellHeight + theme.spacing[gridGap]));
        } else if (wantoToGo === "down") {
            setAutoScrollTarget(onScrollEndContentOffset + (2 * cellHeight + theme.spacing[gridGap]));
        } else {
            setAutoScrollTarget(null);
        }
    };

    const scroll = _.throttle((target: number) => {
        scrollRef.current?.scrollTo({ y: target, animated: true });
    }, 600, { 'leading': false, 'trailing': true });

    useEffect(() => {
        if (autoScrollTarget !== null) {
            scroll(autoScrollTarget);
        }
    }, [autoScrollTarget]);

    useEffect(() => {
        updateScrollTarget();
    }, [onScrollEndContentOffset, wantoToGo]);

    const checkForScrollViewLimit = useCallback((absY: number) => {
        if (scrollTriggerInterval) {
            if (scrollTriggerInterval.intervalDown.from < absY && absY < scrollTriggerInterval.intervalDown.to) {
                setWantoToGo("down");
            } else if (scrollTriggerInterval.intervalUp.from < absY && absY < scrollTriggerInterval.intervalUp.to) {
                setWantoToGo("up");
            } else {
                if (wantoToGo) setWantoToGo(null);
            }
        }
    }, [scrollTriggerInterval]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Box flexDirection={"column"} padding={'m'} gap={'m'} flex={1} >
                <Box flexDirection={"row"} gap={'xxs'} height={200}>
                    <FlatList
                        keyExtractor={(item) => "cat" + item.id}
                        style={{ flexGrow: 1, paddingRight: theme.spacing.m }}
                        contentContainerStyle={{ gap: theme.spacing.xs }}
                        data={card}
                        renderItem={({ item, index }) => {
                            return <CategoryTile selected={item.id == selectedCategory} category={item} height={36} onPress={() => { setSelectedCategory(item.id) }} />
                        }}
                    />
                    <FlatList
                        numColumns={2}
                        scrollEnabled={dragged == null}
                        keyExtractor={(product) => "prod" + product.id}
                        style={{ width: "65%" }}
                        data={selectedCategory ? card.find(cat => cat.id == selectedCategory).products : []}
                        contentContainerStyle={{ gap: theme.spacing.xs }}
                        columnWrapperStyle={{ gap: theme.spacing.xs }}
                        renderItem={({ item, index }) => {
                            return (
                                <DraggableProduct
                                    product={item}
                                    onLongPress={() => { handleGrab(item, null); }}
                                    cellHeight={cellHeight}
                                    cellWidth={cellWidth}
                                    handleDrop={handleDrop}
                                    queueHighlightTargetUnder={queueHighlightTargetUnder}
                                    resetDrag={resetDrag}
                                    translateX={translateX}
                                    translateY={translateY}
                                    checkForScrollViewLimit={checkForScrollViewLimit}
                                />
                            )
                        }}
                    />
                </Box>
                <ScrollView
                    scrollEnabled={dragged == null}
                    decelerationRate={0}
                    ref={scrollRef}
                    style={{ alignSelf: "stretch" }}
                    onLayout={e => { handleLayout(e) }}
                    onScroll={(e) => setOnScrollEndContentOffset(e.nativeEvent.contentOffset.y)}
                    onMomentumScrollEnd={(e) => setOnScrollEndContentOffset(e.nativeEvent.contentOffset.y)}
                    onScrollEndDrag={(e) => setOnScrollEndContentOffset(e.nativeEvent.contentOffset.y)}
                    contentContainerStyle={{ height: scrollHeight.value }}
                >
                    {grid.map((cell) => {
                        if (cell.content) {
                            return (
                                <DraggablePlacedProduct
                                    cell={cell}
                                    product={cell.content}
                                    onLongPress={() => grabPlacedItem(cell)}
                                    cellHeight={cellHeight}
                                    cellWidth={cellWidth}
                                    handleDrop={handleDrop}
                                    queueHighlightTargetUnder={queueHighlightTargetUnder}
                                    translateX={translateX}
                                    translateY={translateY}
                                    resetDrag={resetDrag}
                                    removeFromBlueprint={removeFromBlueprint}
                                    checkForScrollViewLimit={checkForScrollViewLimit}
                                />
                            )
                        } else {
                            return (
                                <Box
                                    position={"absolute"}
                                    borderRadius={4}
                                    style={{ borderColor: chroma(theme.colors[isHovered(cell) ? 'success' : 'primary']).alpha(.8).hex(), borderStyle: "dashed", borderWidth: 1.5, backgroundColor: chroma(theme.colors[isHovered(cell) ? 'success' : 'primary']).alpha(.06).hex(), ...cell.layout }}
                                    padding={'xxs'}
                                    width={cellWidth}
                                    height={cellHeight}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                >
                                    <Box
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                    >
                                        <IconSVG icon={isHovered(cell) ? IconSVGCode.check : IconSVGCode.plus} size="smaller" fill={theme.colors[isHovered(cell) ? 'success' : 'primary']} />
                                    </Box>
                                </Box>
                            )
                        }
                    })}
                </ScrollView>
            </Box>
            <View style={{ position: 'absolute', bottom: 16, left: 16 }}>
                <Button variant='success' size='m' style={{ borderRadius: 999 }} icon={IconSVGCode.save} onPress={() => router.navigate(`/`)} />
            </View>
            <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} pointerEvents="none">
                {dragged &&
                    <Animated.View
                        style={[
                            animatedStyle,
                            styles.animatedView,
                            {
                                backgroundColor: chroma.mix("#fff", dragged.color, .1).hex(),
                                borderColor: dragged.color,
                                height: cellHeight,
                                width: cellWidth,
                                padding: theme.spacing.xs,
                            }
                        ]}
                    >
                        <CustomText font="A700" size={14} style={{ textAlign: "center" }}>{dragged.label}</CustomText>
                    </Animated.View>
                }
            </View>
        </SafeAreaView >
    )
}

export default Blueprint;

const DraggableProduct = ({
    product,
    onLongPress,
    translateX,
    translateY,
    queueHighlightTargetUnder,
    cellWidth,
    handleDrop,
    checkForScrollViewLimit,
}: {
    product: Product,
    onLongPress: () => void,
    translateX: SharedValue<number>,
    translateY: SharedValue<number>,
    queueHighlightTargetUnder: ({ absX, absY }: { absX: number, absY: number }) => void,
    cellWidth: number,
    cellHeight: number,
    handleDrop: () => void,
    resetDrag: () => void,
    checkForScrollViewLimit: (y: number) => void
}) => {
    const [isPressed, setIsPressed] = useState<boolean>(false)
    const theme = useTheme<Theme>()

    const fromListPan = Gesture.Pan()
        .onBegin((e) => {
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).activateAfterLongPress(delayLongPress).onStart((e) => {
            runOnJS(onLongPress)()
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).onUpdate((e) => {
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            runOnJS(checkForScrollViewLimit)(e.absoluteY)
            runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).onEnd((e) => {
            runOnJS(handleDrop)()
        })

    return (
        <GestureDetector gesture={fromListPan}>
            <Pressable style={{ flex: 1 }} onPressIn={() => setIsPressed(true)} onPressOut={() => setIsPressed(false)} >
                <Box height={72} justifyContent={'center'} padding={"xxs"} flex={1} borderRadius={4} borderBottomWidth={6} style={{ backgroundColor: isPressed ? chroma(theme.colors.primary).alpha(.1).hex() : theme.colors.surface, borderColor: product.color }} >
                    <CustomText font="A700" size={14} style={{ textAlign: "center", maxWidth: "100%" }}>{product.label}</CustomText>
                </Box>
            </Pressable>
        </GestureDetector>
    )
}

const DraggablePlacedProduct = ({
    cell,
    product,
    onLongPress,
    translateX,
    translateY,
    queueHighlightTargetUnder,
    cellWidth,
    cellHeight,
    handleDrop,
    removeFromBlueprint,
    checkForScrollViewLimit,
}: {
    cell: Cell,
    product: Product,
    onLongPress: () => void,
    translateX: SharedValue<number>,
    translateY: SharedValue<number>,
    queueHighlightTargetUnder: ({ absX, absY }: { absX: number, absY: number }) => void,
    cellWidth: number,
    cellHeight: number,
    handleDrop: () => void,
    resetDrag: () => void,
    removeFromBlueprint: (cell: Cell) => void
    checkForScrollViewLimit: (y: number) => void
}) => {
    const [isPressed, setIsPressed] = useState<boolean>(false)
    const [isDragged, setIsDragged] = useState<boolean>(false)
    const [editionOpen, setEditionOpen] = useState<boolean>(false)
    const theme = useTheme<Theme>()

    const fromPlacedPan = Gesture.Pan()
        .onBegin((e) => {
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).activateAfterLongPress(delayLongPress).onStart((e) => {
            runOnJS(onLongPress)()
            runOnJS(setIsDragged)(true)
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).onUpdate((e) => {
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            runOnJS(checkForScrollViewLimit)(e.absoluteY)
            runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).onEnd((e) => {
            runOnJS(setIsDragged)(false)
            runOnJS(handleDrop)()
        })

    return (
        <>
            <GestureDetector gesture={fromPlacedPan}>
                <Box
                    style={{ opacity: isDragged ? .3 : 1, zIndex: 900000, backgroundColor: isPressed ? chroma(product.color).alpha(.1).hex() : theme.colors.surface, borderColor: product.color, ...cell.layout }}
                    position={"absolute"}
                    borderBottomWidth={12}
                    padding={'xxs'}
                    borderRadius={4}
                    width={cellWidth}
                    height={cellHeight}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <Pressable onPressIn={() => setIsPressed(true)} onPressOut={() => setIsPressed(false)} onPress={() => setEditionOpen(true)}>
                        <Box
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <CustomText font="A700" size={14} style={{ textAlign: "center" }}>{product.label}</CustomText>
                        </Box>
                    </Pressable>
                </Box>
            </GestureDetector>
            <ModalNative
                open={editionOpen}
                close={() => setEditionOpen(false)}
                actions={[
                    { title: "Back", icon: IconSVGCode.arrow_left, onPress: () => setEditionOpen(false), variant: "neutral" },
                    { title: "Remove", icon: IconSVGCode.trash, onPress: () => removeFromBlueprint(cell), variant: "danger" }
                ]}
            >
                <Box justifyContent="center" alignItems="center" style={{ flex: 1, paddingVertical: theme.spacing.m, paddingHorizontal: theme.spacing.m }} >
                    <CustomText>Retirer</CustomText>
                    <CustomText>{product.label}</CustomText>
                    <CustomText>du plan de touche ?</CustomText>
                </Box>
            </ModalNative>
        </>
    )
}

const styles = StyleSheet.create({
    animatedView: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000000000,
        top: 0,
        left: 0,
        borderRadius: 4,
        borderBottomWidth: 12,
    }
})