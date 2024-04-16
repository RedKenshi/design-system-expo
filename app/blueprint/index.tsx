import { FlatList, GestureResponderEvent, LayoutChangeEvent, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"
import { Theme } from "../../constants/Palette"
import card from '../../constants/fakeCard.json'

import Box from "../../components/Box"
import { useTheme } from "@shopify/restyle"
import CategoryTile from "../../components/checkout/CategoryTile";
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../../components/Button";
import { IconSVG, IconSVGCode } from "../../components/IconSVG";
import { router } from "expo-router";

import chroma from "chroma-js"
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import CustomText from "../../components/CustomText";
import { Product, RegisterAbsoluteLayout } from "../../constants/types";
import { overlapMarginError } from "../../constants/utils";

import _ from 'lodash'
import ModalNative from "../../components/ModalNative"

//TODO
/*
- scroll on maintain bot
- inversion on drop on placed
- keep memomry of item origin
- open modal on simple press (delete)
- prevent scroll elastic scroll (solved by bounces={false} ?)
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
}

const gridX = 3
const gridY = 12
const cellHWFactor = .7
const gridGap = 'xs'
const delayLongPress = 100
const fingerDodge = 80;

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
    const [draggedOrigin, setDraggedOrigin] = useState<null | { x: number, y: number, h: number, w: number }>(null)

    const scrollHeight = useSharedValue(0)

    const [selectedForModal, setSelectedForModal] = useState<Cell | null>(null)

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
                id: pb.coordinates.x + "x" + pb.coordinates.y,
                coordinates: pb.coordinates,
                layout: getPositionAndSizesFromXYCoordinates({ ...pb.coordinates }),
                content: pb.content
            })
        })
        Array(gridY).fill('').map((y, indexI) => {
            return (
                Array(gridX).fill('').map((x, indexJ) => {
                    if (blueprint.every(pb => {
                        return indexJ < pb.coordinates.x || indexJ >= pb.coordinates.x + pb.coordinates.w || indexI < pb.coordinates.y || indexI >= pb.coordinates.y + pb.coordinates.h;
                    })) {
                        res.push({
                            id: indexI + "x" + indexJ,
                            coordinates: {
                                h: 1,
                                w: 1,
                                y: indexI,
                                x: indexJ
                            },
                            layout: getPositionAndSizesFromXYCoordinates({ h: 1, w: 1, y: indexI, x: indexJ }),
                            content: null
                        })
                    }
                })
            )
        })
        return res
    }, [card, gridWidth, blueprint])

    const potentialDropTargets = useMemo(() => {
        if (scrollViewLayout) {
            let tmp = [];
            grid.forEach(cell => {
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
    }, 200, { 'trailing': false });

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
            }, 20)) {
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

                    }, 20)) {
                        ins.push(target.id)
                    }
                });
            }
            setHovered(ins)
        }
    }

    const addProductToDropIds = ({ product, dropIds }: { product: Product, dropIds: string[] }) => {
        let xMin = Math.min(...dropIds.map(x => parseInt(x.split('x')[1])))
        let yMin = Math.min(...dropIds.map(x => parseInt(x.split('x')[0])))
        let xMax = Math.max(...dropIds.map(x => parseInt(x.split('x')[1])))
        let yMax = Math.max(...dropIds.map(x => parseInt(x.split('x')[0])))
        addProductToBlueprint({
            id: xMin + "x" + yMin,
            product,
            x: xMin,
            y: yMin,
            h: yMax - yMin + 1,
            w: xMax - xMin + 1
        })
    }

    const addProductToBlueprint = ({ product, x, y, w, h }: { product: Product, x: number, y: number, w: number, h: number }) => {
        let tmp = JSON.parse(JSON.stringify(blueprint))
        tmp.push({
            id: x + "x" + y,
            coordinates: { x, y, h, w },
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
                    dropIds: hovered
                })
            } else {
                if (draggedOrigin) {
                    addProductToBlueprint({
                        product: dragged,
                        ...draggedOrigin
                    })
                }
            }
        }
        resetDrag()
    }
    const handleGrab = (product: Product, coordinates: { x: number, y: number, h: number, w: number } | null) => {
        if (product) {
            setDragged(product)
            setDraggedOrigin(coordinates)
        }
    }

    const resetDrag = () => {
        if (dragged) {
            setDragged(null)
        }
        setHovered([])
    }

    const pan = Gesture.Pan()
        .onBegin((e) => {
            console.log("onBegin")
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).onStart((e) => {
            console.log("onStart")
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).onUpdate((e) => {
            //console.log("onUpdate")
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).onChange((e) => {
            //console.log("onChange")
        }).onEnd((e) => {
            console.log("onEnd")
            runOnJS(handleDrop)()
        }).onFinalize((e) => {
            console.log("onFinalize")
            //runOnJS(resetDrag)()
        })

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

    const isHovered = (id: string) => {
        return hovered.includes(id)
    }

    const grabPlacedItem = (cell: Cell) => {
        if (cell.content) {
            handleGrab(cell.content, cell.coordinates);
            setBlueprint(blueprint.filter(x => x.id != cell.id))
            removeFromBlueprint(cell)
        }
    }

    const removeFromBlueprint = (cell: Cell) => {
        setBlueprint(blueprint.filter(x => x.id != cell.id))
        setSelectedForModal(null)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GestureDetector gesture={pan}>
                <Box flexDirection={"column"} padding={'m'} gap={'m'} flex={1} >
                    <Box flexDirection={"row"} gap={'xxs'} height={200}>
                        <FlatList
                            bounces={false}
                            keyExtractor={(item) => "cat" + item.id}
                            style={{ flexGrow: 1, paddingRight: theme.spacing.m }}
                            contentContainerStyle={{ gap: theme.spacing.xs }}
                            data={card}
                            renderItem={({ item, index }) => {
                                return <CategoryTile selected={item.id == selectedCategory} category={item} height={36} onPress={() => { setSelectedCategory(item.id) }} />
                            }}
                        />
                        <FlatList
                            bounces={false}
                            numColumns={2}
                            scrollEnabled={dragged == null}
                            keyExtractor={(product) => "prod" + product.id}
                            style={{ width: "65%" }}
                            data={selectedCategory ? card.find(cat => cat.id == selectedCategory).products : []}
                            contentContainerStyle={{ gap: theme.spacing.xs }}
                            columnWrapperStyle={{ gap: theme.spacing.xs }}
                            renderItem={({ item, index }) => {
                                return (
                                    <DraggableProduct product={item} onLongPress={() => { handleGrab(item, null); }} />
                                )
                            }}
                        />
                    </Box>
                    <ScrollView
                        bounces={false}
                        scrollEnabled={dragged == null}
                        decelerationRate={0}
                        ref={scrollRef}
                        style={{ alignSelf: "stretch" }}
                        onLayout={e => { handleLayout(e) }}
                        onMomentumScrollEnd={(e) => setOnScrollEndContentOffset(e.nativeEvent.contentOffset.y)}
                        onScrollEndDrag={(e) => setOnScrollEndContentOffset(e.nativeEvent.contentOffset.y)}
                        contentContainerStyle={{ height: scrollHeight.value }}
                    >
                        {grid.map((cell) => {
                            if (cell.content == null) {
                                return (
                                    <Box
                                        position={"absolute"}
                                        style={{ borderColor: chroma(theme.colors[isHovered(cell.id) ? 'success' : 'primary']).alpha(.8).hex(), borderStyle: "dashed", borderWidth: 1, backgroundColor: chroma(theme.colors[isHovered(cell.id) ? 'success' : 'primary']).alpha(.06).hex(), ...cell.layout }}
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
                                            {cell.content == null ?
                                                <IconSVG icon={isHovered(cell.id) ? IconSVGCode.check : IconSVGCode.plus} size="smaller" fill={theme.colors[isHovered(cell.id) ? 'success' : 'primary']} />
                                                :
                                                <CustomText font="A700" size={14} style={{ textAlign: "center" }}>{cell.content.label}</CustomText>
                                            }
                                        </Box>
                                    </Box>
                                )
                            } else {
                                return (
                                    <Pressable
                                        onPress={() => { setSelectedForModal(cell) }}
                                        delayLongPress={delayLongPress}
                                        onLongPress={() => {
                                            grabPlacedItem(cell)
                                        }}
                                    >
                                        <Box
                                            position={"absolute"}
                                            style={{ backgroundColor: chroma.mix("#fff", cell.content.color, .1).hex(), borderColor: cell.content.color, ...cell.layout }}
                                            borderBottomWidth={12}
                                            padding={'xxs'}
                                            borderRadius={6}
                                            width={cellWidth}
                                            height={cellHeight}
                                            justifyContent={"center"}
                                            alignItems={"center"}
                                        >
                                            <Box
                                                justifyContent={"center"}
                                                alignItems={"center"}
                                            >
                                                {cell.content == null ?
                                                    <IconSVG icon={isHovered(cell.id) ? IconSVGCode.check : IconSVGCode.plus} size="smaller" fill={theme.colors[isHovered(cell.id) ? 'success' : 'primary']} />
                                                    :
                                                    <CustomText font="A700" size={14} style={{ textAlign: "center" }}>{cell.content.label}</CustomText>
                                                }
                                            </Box>
                                        </Box>
                                    </Pressable>
                                )
                            }
                        })}
                    </ScrollView>
                </Box>
            </GestureDetector>
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
            <ModalNative
                open={selectedForModal != null}
                close={() => setSelectedForModal(null)}
                actions={[
                    { title: "Back", icon: IconSVGCode.arrow_left, onPress: () => setSelectedForModal(null), variant: "neutral" },
                    { title: "Remove", icon: IconSVGCode.trash, onPress: () => removeFromBlueprint(selectedForModal), variant: "danger" }
                ]}
            >
                {selectedForModal &&
                    <Box justifyContent="center" alignItems="center" style={{ flex: 1, paddingVertical: theme.spacing.m, paddingHorizontal: theme.spacing.m }} >
                        <CustomText>Retirer</CustomText>
                        <CustomText>{selectedForModal.content.label}</CustomText>
                        <CustomText>du plan de touche ?</CustomText>
                    </Box>
                }
            </ModalNative>
        </SafeAreaView >
    )
}

export default Blueprint;

const DraggableProduct = ({ product, onLongPress }: { product: Product, onLongPress: (event: GestureResponderEvent) => void }) => {
    const [isPressed, setIsPressed] = useState<boolean>(false)
    const theme = useTheme<Theme>()
    return (
        <Pressable style={{ flex: 1 }} onPressIn={() => setIsPressed(true)} onPressOut={() => setIsPressed(false)} delayLongPress={delayLongPress} onLongPress={onLongPress} >
            <Box height={72} justifyContent={'center'} padding={"xxs"} flex={1} borderRadius={4} borderBottomWidth={6} style={{ backgroundColor: isPressed ? chroma(theme.colors.primary).alpha(.1).hex() : theme.colors.surface, borderColor: product.color }} >
                <CustomText font="A700" size={14} style={{ textAlign: "center", maxWidth: "100%" }}>{product.label}</CustomText>
            </Box>
        </Pressable>
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
        borderRadius: 8,
        borderBottomWidth: 12,
    }
})