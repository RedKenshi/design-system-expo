import { FlatList, LayoutChangeEvent, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Theme } from "../../constants/Palette"
import card from '../../constants/fakeCard.json'

import Box from "../../components/Box"
import { useTheme } from "@shopify/restyle"
import CategoryTile from "../../components/checkout/CategoryTile";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button, { ButtonVariant } from "../../components/Button";
import { IconSVG, IconSVGCode } from "../../components/IconSVG";
import { router } from "expo-router";

import chroma from "chroma-js"
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import CustomText from "../../components/CustomText";
import { Product, RegisterAbsoluteLayout } from "../../constants/types";
import { overlapMarginError, tabColors } from "../../constants/utils";

import _ from 'lodash'
import ModalNative from "../../components/ModalNative"

import uuid from 'react-native-uuid';
import CollapsingFloatingMenu, { FloatingAction } from "../../components/CollapsingFloatingMenu"
import Pill from "../../components/Pill"
import TextFormRow from "../../components/formRow/TextFormRow"
import ColorFormRow from "../../components/formRow/ColorFormRow"
import IconFormRow from "../../components/formRow/IconFormRow"
import { FoodSVGCode } from "../../components/FoodSVG"
import Panel from "../../components/Panel"

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
    overlappedBy?: string | null
}

type TabDeTouche = {
    name: string,
    color: string,
    icon: FoodSVGCode,
    blueprint: Cell[]
}

type PlanDeTouche = TabDeTouche[]

const displayTabName = true;
const baseGridX = 3;
const baseGridY = 4;
const cellHWFactor = .7;
const gridGap = 'xs';
const delayLongPress = 100;
const fingerDodge = 80;
const overlapMinimum = 20;

export const Blueprint = ({ }: Props) => {

    const [gridX, setGridX] = useState(baseGridX);
    const [gridY, setGridY] = useState(baseGridY);

    const theme = useTheme<Theme>();

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const scrollRef = useRef<View>();

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [selectedTab, setSelectedTab] = useState<number>(0)

    const [editTabOpen, setEditTabOpen] = useState<boolean>(null)
    const [newTabOpen, setNewTabOpen] = useState<boolean>(null)
    const [deleteTabOpen, setDeleteTabOpen] = useState<boolean>(null)
    const [emptyTabOpen, setEmptyTabOpen] = useState<boolean>(null)
    const [autoLayoutOpen, setAutoLayoutOpen] = useState<boolean>(null)

    const [tabName, setTabName] = useState<string>('')
    const [tabColor, setTabColor] = useState<string>('')
    const [tabIcon, setTabIcon] = useState<FoodSVGCode | null>(null)

    const [planDeTouche, setPlanDeTouche] = useState<PlanDeTouche>([])

    const floatingActions = useMemo<FloatingAction[]>(() => {
        let tmp = [
            {
                color: "info" as ButtonVariant, icon: IconSVGCode.file, label: "Export console", onPress: () => exportConsole()
            }, {
                color: "danger" as ButtonVariant, icon: IconSVGCode.flame, label: "Purge", onPress: () => purge()
            }, {
                color: "success" as ButtonVariant, icon: IconSVGCode.save, label: "Sauvegarder et quitter", onPress: () => router.navigate(`/`)
            }, {
                color: "primary" as ButtonVariant, icon: IconSVGCode.plus, label: "Ajouter un onglet", onPress: () => {
                    setTabColor(tabColors[planDeTouche.length + 1]);
                    setTabName("Onglet " + (planDeTouche.length + 1));
                    setTabIcon(FoodSVGCode.none);
                    setNewTabOpen(true);
                }
            },
        ]
        if (planDeTouche[selectedTab]) {
            tmp = [...tmp, {
                color: "primary" as ButtonVariant, icon: IconSVGCode.edit, label: `Modifier  "${planDeTouche[selectedTab].name}"`, onPress: () => {
                    setTabColor(planDeTouche[selectedTab].color);
                    setTabName(planDeTouche[selectedTab].name);
                    setTabIcon(planDeTouche[selectedTab].icon as FoodSVGCode);
                    setEditTabOpen(true);
                }
            }, {
                color: "danger" as ButtonVariant, icon: IconSVGCode.xmark, label: `Vider  "${planDeTouche[selectedTab].name}"`, onPress: () => setEmptyTabOpen(true)
            }, {
                color: "danger" as ButtonVariant, icon: IconSVGCode.trash, label: `Supprimer  "${planDeTouche[selectedTab].name}"`, onPress: () => setDeleteTabOpen(true)
            }]
        }

        tmp = [...tmp, {
            color: "info" as ButtonVariant, icon: IconSVGCode.layer_group, label: "Auto layout", onPress: () => setAutoLayoutOpen(true)
        }]

        return (tmp)
    }, [planDeTouche, selectedTab])

    const [products, setProducts] = useState<Cell[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>()
    const [gridWidth, setGridWidth] = useState<number | null>()
    const [scrollViewLayout, setScrollViewLayout] = useState<RegisterAbsoluteLayout | null>(null)
    const [onScrollEndContentOffset, setOnScrollEndContentOffset] = useState<number>(0)
    const [dragged, setDragged] = useState<Product | null>(null)
    const [lastDragged, setLastDragged] = useState<Cell | null>(null)
    const [draggedOrigin, setDraggedOrigin] = useState<null | Cell>(null)

    const scrollHeight = useSharedValue(0)

    const [hovered, setHovered] = useState<{ x: number, y: number }[]>([])

    const cellWidth = useMemo(() => {
        if (gridWidth) {
            return gridWidth / gridX - 3 // - 3 is there to compensate for total border width
        } else {
            return 128
        }
    }, [gridWidth])

    const cellHeight = useMemo(() => {
        if (cellWidth) {
            return cellWidth * cellHWFactor
        } else {
            return 128 * cellHWFactor
        }
    }, [cellWidth])

    const scrollTriggerInterval = useMemo(() => {
        if (scrollViewLayout) {
            let tmp = {
                intervalUp: {
                    from: scrollViewLayout.layout.pageY,
                    to: scrollViewLayout.layout.pageY + (.6 * cellHeight)
                },
                intervalDown: {
                    from: (scrollViewLayout.layout.pageY + scrollViewLayout.layout.height) - (.6 * cellHeight),
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

    const createNewTab = () => {
        setPlanDeTouche([...planDeTouche, { name: tabName, blueprint: [], color: tabColor, icon: tabIcon }])
    }
    const deleteSelectedTab = () => {
        let tmp: PlanDeTouche = JSON.parse(JSON.stringify(planDeTouche))
        tmp.splice(selectedTab, 1)
        setPlanDeTouche(tmp)
    }
    const editTab = () => {
        let tmp: PlanDeTouche = JSON.parse(JSON.stringify(planDeTouche))
        let editedTab: TabDeTouche = tmp.splice(selectedTab, 1)[0]
        tmp.splice(selectedTab, 0, {
            ...editedTab,
            name: tabName,
            color: tabColor,
            icon: tabIcon
        })
        setPlanDeTouche(tmp)
    }
    const emptyTab = () => {
        let tmp: PlanDeTouche = JSON.parse(JSON.stringify(planDeTouche))
        let editedTab: TabDeTouche = tmp.splice(selectedTab, 1)[0]
        tmp.splice(selectedTab, 0, {
            ...editedTab,
            blueprint: []
        })
        setPlanDeTouche(tmp)
    }
    const updateBlueprintOfTab = (blueprint: Cell[]) => {
        let tmp: PlanDeTouche = JSON.parse(JSON.stringify(planDeTouche))
        let editedTab: TabDeTouche = tmp.splice(selectedTab, 1)[0]
        if (editedTab) {
            tmp.splice(selectedTab, 0, {
                ...editedTab,
                blueprint: blueprint
            })
            setPlanDeTouche(tmp)
        }
    }
    const autoLayout = () => {
        let pdt: PlanDeTouche = []
        card.forEach((carCat, index) => {
            let productInCells: Cell[] = []
            let x = 0;
            let y = 0;
            carCat.products.forEach(product => {
                productInCells.push({
                    id: uuid.v4().toString(),
                    content: product,
                    coordinates: {
                        x: x,
                        y: y,
                        w: 1,
                        h: 1
                    },
                    layout: null
                })
                if (x == gridX - 1) {
                    x = 0;
                    y++;
                } else {
                    x++;
                }
            })
            pdt.push({
                blueprint: productInCells,
                color: carCat.color,
                icon: FoodSVGCode[Object.keys(FoodSVGCode)[index]],
                name: carCat.name
            })
        })
        setPlanDeTouche(pdt)
    }

    const purge = () => {
        setPlanDeTouche([])
    }

    const exportConsole = () => {
        let tmp = JSON.parse(JSON.stringify(planDeTouche))
        tmp = tmp.map(tab => {
            return ({
                ...tab,
                blueprint: tab.blueprint.map(cell => {
                    return ({
                        id: cell.content.id,
                        ...cell.coordinates
                    })
                }),
            })
        });
        console.log(JSON.stringify(tmp))

    }

    //blueprint is the list of product to whom has been added coordinates
    const blueprint = useMemo(() => {
        if (planDeTouche[selectedTab]) {
            return planDeTouche[selectedTab].blueprint.map((product, index) => {
                return ({
                    id: product.id,
                    coordinates: product.coordinates,
                    layout: getPositionAndSizesFromXYCoordinates({ ...product.coordinates }),
                    content: product.content,
                })
            })
        } else {
            return []
        }
    }, [selectedTab, planDeTouche, gridWidth])

    //grid is the list of the grid cells : if they are free or overlapped by a product
    const grid = useMemo(() => {
        let res: Cell[] = [];
        Array(gridY).fill('').map((y, indexY) => {
            return (
                Array(gridX).fill('').map((x, indexX) => {
                    let overlappedBy = blueprint.find(pb => {
                        if (indexX >= pb.coordinates.x && indexX < pb.coordinates.x + pb.coordinates.w && indexY >= pb.coordinates.y && indexY < pb.coordinates.y + pb.coordinates.h) {
                            return pb.id;
                        } else {
                            return null
                        }
                    })
                    res.push({
                        id: indexX + "x" + indexY + "#-",
                        coordinates: {
                            h: 1,
                            w: 1,
                            y: indexY,
                            x: indexX
                        },
                        layout: getPositionAndSizesFromXYCoordinates({ h: 1, w: 1, y: indexY, x: indexX }),
                        content: null,
                        overlappedBy: overlappedBy ? overlappedBy.id : null
                    })
                })
            )
        })
        return res
    }, [card, blueprint, gridX, gridY])

    //objects is the list of what is displayed : product, free spaces, etc ... all that merged for a display in a single iteration
    const objects = useMemo(() => [...blueprint, ...grid], [blueprint, grid])

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
    }, 200, { 'trailing': false });

    const highlightTargetUnder = ({ absX, absY }: { absX: number, absY: number }) => {
        if (!scrollViewLayout) return
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
                        ins.push({ x: target.coordinates.x, y: target.coordinates.y })
                    }
                });
            }
            setHovered(ins)
        }
    }
    const addProductToDropIds = ({ product, dropIds, origin }: { product: Product, dropIds: { x: number, y: number }[], origin: Cell | null }) => {
        if (dropIds.some(di => di.y == (gridY - 1))) {
            setGridY(gridY + 1)
        }
        const droppedOverOccupiedCells = grid.filter(c => {
            return c.overlappedBy != null &&
                (!origin || (origin && c.overlappedBy != origin.id)) &&
                dropIds.some(dropId => dropId.x == c.coordinates.x && dropId.y == c.coordinates.y)
        }).map(x => x.overlappedBy)
        const droppedOverProducts: string[] = droppedOverOccupiedCells.reduce((acc, cur) => {
            if (!acc.map(x => x).includes(cur)) {
                return [...acc, cur]
            }
            return acc
        }, [])
        if (droppedOverProducts.length == 0) {
            let xMin = Math.min(...dropIds.map(x => x.x))
            let yMin = Math.min(...dropIds.map(x => x.y))
            let xMax = Math.max(...dropIds.map(x => x.x))
            let yMax = Math.max(...dropIds.map(x => x.y))
            addProductToBlueprint({
                product,
                x: xMin,
                y: yMin,
                h: yMax - yMin + 1,
                w: xMax - xMin + 1,
                origin
            })
        }
        if (droppedOverProducts.length == 1) {
            if (origin) {
                switchTwoProducts({
                    cellOne: planDeTouche[selectedTab].blueprint.find(p => p.id == origin.id),
                    cellTwo: planDeTouche[selectedTab].blueprint.find(p => p.id == droppedOverProducts[0])
                })
            }
        }
        if (droppedOverProducts.length > 1) {
            //console.log("Dropped over multiple products")
        }
    }
    const switchTwoProducts = ({ cellOne, cellTwo }: { cellOne: Cell, cellTwo: Cell }) => {
        let tmp: Cell[] = JSON.parse(JSON.stringify(planDeTouche[selectedTab].blueprint))
        tmp.find(x => x.id == cellOne.id).coordinates = cellTwo.coordinates
        tmp.find(x => x.id == cellTwo.id).coordinates = cellOne.coordinates
        updateBlueprintOfTab(tmp)
    }

    const addProductToBlueprint = ({ product, x, y, w, h, origin }: { product: Product, x: number, y: number, w: number, h: number, origin: Cell | null }) => {
        let tmp: Cell[] = JSON.parse(JSON.stringify(planDeTouche[selectedTab].blueprint))
        if (origin) {
            tmp = tmp.filter(tmpCell => tmpCell.id !== origin.id)
        }
        let tmpCell: Cell = {
            id: origin ? origin.id : uuid.v4().toString(),
            coordinates: { x, y, w, h },
            layout: null,
            content: product
        }
        tmp.push(tmpCell)
        updateBlueprintOfTab(tmp)
    }
    const handleDrop = ({ absX, absY }: { absX: number, absY: number }) => {
        if (dragged) {
            if (hovered.length > 0) {
                //product do not overlap with any other product already placed
                addProductToDropIds({
                    product: dragged,
                    dropIds: hovered,
                    origin: draggedOrigin ?? null
                })
            }
        }
        resetDrag()
    }
    const handleGrab = (product: Product, originCell: Cell | null) => {
        if (product) {
            setDragged(product)
            if (originCell) setLastDragged(originCell)
            setDraggedOrigin(originCell ?? null)
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
        return hovered.some(c => c.x == cell.coordinates.x && c.y == cell.coordinates.y)
    }
    const grabPlacedItem = (cell: Cell) => {
        if (cell.content) {
            handleGrab(cell.content, cell);
        }
    }
    const removeFromBlueprint = (cell: Cell) => {
        let tmp: Cell[] = JSON.parse(JSON.stringify(planDeTouche[selectedTab].blueprint.filter(x => x.id != cell.id)))
        updateBlueprintOfTab(tmp)
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
        if (wantoToGo != null) {
            scrollRef.current?.scrollTo({ y: target, animated: true });
        }
    }, 600, { leading: false, trailing: true });

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
                if (wantoToGo != "down") setWantoToGo("down");
            } else if (scrollTriggerInterval.intervalUp.from < absY && absY < scrollTriggerInterval.intervalUp.to) {
                if (wantoToGo != "up") setWantoToGo("up");
            } else {
                setWantoToGo(null);
            }
        } else {
            setWantoToGo(null);
        }
    }, [scrollTriggerInterval, scroll]);

    const placeSelectedProductHere = (cell: Cell) => {
        if (selectedProduct && cell) {
            addProductToBlueprint({
                product: selectedProduct,
                x: cell.coordinates.x,
                y: cell.coordinates.y,
                h: 1,
                w: 1,
                origin: null
            })
            setSelectedProduct(null)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Box flexDirection={"column"} flex={1} >
                <Panel style={{ flexDirection: "row", borderRadius: 0, gap: theme.spacing.xxs, height: 220, marginTop: 0, marginBottom: theme.spacing.xs }}>
                    {selectedProduct != null ?
                        <Box flexDirection={"column"} justifyContent={"center"} alignItems={"center"} height={220} position={'relative'} gap='m' flex={1}>
                            <CustomText font="A700" size={14} style={{ textAlign: "center", maxWidth: "100%" }}>Séléctioné : </CustomText>
                            <View style={{ height: cellHeight * 1.25, width: cellWidth * 1.65 }}>
                                <Box height={72} justifyContent={'center'} padding={"xxs"} flex={1} borderRadius={4} borderBottomWidth={6} style={{ backgroundColor: chroma(selectedProduct.color).alpha(.08).hex(), borderColor: selectedProduct.color }} >
                                    <CustomText font="A700" size={14} style={{ textAlign: "center", maxWidth: "100%" }}>{selectedProduct.label}</CustomText>
                                </Box>
                            </View>
                            <CustomText font="A700" size={14} style={{ textAlign: "center", maxWidth: "100%" }}>Touchez une case  [+]  pour placer le produit</CustomText>
                            <Button size="s" variant="danger" onPress={() => setSelectedProduct(null)} icon={IconSVGCode.xmark} style={{ position: 'absolute', top: -4, right: -4 }} />
                        </Box>
                        :
                        <>
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
                                            onPress={() => setSelectedProduct(item)}
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
                        </>
                    }
                </Panel>
                <Box padding={'s'} flex={1} flexGrow={1} gap={'m'}>
                    <Box style={{ flex: 0, flexGrow: 0, alignSelf: "stretch", flexDirection: "row" }}>
                        <ScrollView horizontal contentContainerStyle={{ gap: theme.spacing.s, minWidth: "100%" }} style={{ marginRight: theme.spacing.s, width: "100%", marginBottom: -8, paddingBottom: 12 }}>
                            {planDeTouche.map((tab, index) => {
                                return (
                                    <Pressable onPress={() => setSelectedTab(index)}>
                                        <Pill food={tab.icon != FoodSVGCode.none ? tab.icon : null} color={tab.color} size="m" inverted={selectedTab != index} style={{ margin: 0 }} title={displayTabName && tab.name ? tab.name : null} />
                                    </Pressable>
                                )
                            })}
                        </ScrollView>
                    </Box>
                    {planDeTouche[selectedTab] ?
                        <ScrollView
                            scrollEnabled={dragged == null}
                            decelerationRate={0}
                            ref={scrollRef}
                            scrollEventThrottle={0}
                            style={{ alignSelf: "stretch", flex: 1, flexGrow: 1 }}
                            onLayout={e => { handleLayout(e) }}
                            onScroll={(e) => { setOnScrollEndContentOffset(e.nativeEvent.contentOffset.y) }}
                            onScrollEndDrag={(e) => { setOnScrollEndContentOffset(e.nativeEvent.contentOffset.y) }}
                            onMomentumScrollEnd={(e) => { setOnScrollEndContentOffset(e.nativeEvent.contentOffset.y) }}
                            contentContainerStyle={{ height: scrollHeight.value + (cellHeight + theme.spacing[gridGap]) }}
                        >
                            {objects.map((cell) => {
                                if (cell.content) {
                                    return (
                                        <DraggablePlacedProduct
                                            key={"object-" + cell.id}
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
                                            isLastDragged={lastDragged != null && lastDragged.id == cell.id}
                                        />
                                    )
                                } else {
                                    return (
                                        <Box
                                            key={cell.id}
                                            position={"absolute"}
                                            borderRadius={4}
                                            style={{ borderColor: chroma(theme.colors[isHovered(cell) ? 'success' : 'primary']).alpha(.8).hex(), borderStyle: "dashed", borderWidth: 1.5, backgroundColor: chroma(theme.colors[isHovered(cell) ? 'success' : 'primary']).alpha(.08).hex(), ...cell.layout }}
                                            width={cellWidth}
                                            height={cellHeight}
                                            justifyContent={"center"}
                                            alignItems={"center"}
                                        >
                                            <Pressable
                                                onPress={selectedProduct ? () => placeSelectedProductHere(cell) : null}
                                                style={{
                                                    flex: 1,
                                                    width: "100%",
                                                    backgroundColor: "danger",
                                                    justifyContent: "center",
                                                    alignItems: "center",

                                                }}
                                            >
                                                <IconSVG icon={isHovered(cell) ? IconSVGCode.check : IconSVGCode.plus} size="smaller" fill={theme.colors[isHovered(cell) ? 'success' : 'primary']} />
                                            </Pressable>
                                        </Box>
                                    )
                                }
                            })}
                            <Pressable
                                onPress={() => setGridY(gridY + 1)}
                                style={{
                                    position: "absolute",
                                    borderRadius: 4,
                                    backgroundColor: chroma(theme.colors.primary).alpha(.08).hex(),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    ...getPositionAndSizesFromXYCoordinates({ h: 1, w: gridX, x: 0, y: gridY })
                                }}
                            >
                                <Box
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    flexDirection={"row"}
                                    gap="xs"
                                >
                                    <CustomText size={18} color="primary">Add a row</CustomText>
                                    <IconSVG size="small" icon={IconSVGCode.plus} fill={theme.colors.primary} />
                                </Box>
                            </Pressable>
                        </ScrollView>
                        :
                        <>
                            <View style={{ flex: 1, flexGrow: 1 }} />
                            <Panel style={{ justifyContent: "center", alignItems: "center", paddingHorizontal: theme.spacing.xxl, marginHorizontal: theme.spacing.xxl }}>
                                <CustomText font="A500" lineHeight={26} size={20} style={{ textAlign: "center" }} >Vous n'avez aucun onglet dans ce plan de touche ...</CustomText>
                                <CustomText font="A500" lineHeight={26} size={20} style={{ textAlign: "center", marginTop: theme.spacing.s }} >Créer en un pour commencer à ajouter des produits !</CustomText>
                                <Button outline onPress={() => { setTabColor(tabColors[planDeTouche.length + 1]); setTabName("Onglet " + (planDeTouche.length + 1)); setTabIcon(FoodSVGCode.none); setNewTabOpen(true) }} title="Créer un onglet" icon={IconSVGCode.plus} size="m" iconPosition="right" style={{ marginTop: theme.spacing.m }} />
                                <CustomText font="A500" lineHeight={26} size={20} style={{ textAlign: "center", marginTop: theme.spacing.s }} >Ou essayez l'auto layout</CustomText>
                                <Button outline onPress={() => { setAutoLayoutOpen(true) }} title="Auto layout" variant="info" icon={IconSVGCode.layer_group} size="m" iconPosition="right" style={{ marginTop: theme.spacing.m }} />
                            </Panel>
                            <View style={{ flex: 1, flexGrow: 1 }} />
                        </>
                    }
                </Box>
            </Box>
            {scrollTriggerInterval && <>
                <Box pointerEvents="none" backgroundColor="warning" opacity={0} style={{ position: 'absolute', zIndex: 1000000000, top: scrollTriggerInterval.intervalDown.from, left: 10, right: 10, height: scrollTriggerInterval.intervalDown.to - scrollTriggerInterval.intervalDown.from }} />
                <Box pointerEvents="none" backgroundColor="primary" opacity={0} style={{ position: 'absolute', zIndex: 1000000000, top: scrollTriggerInterval.intervalUp.from, left: 10, right: 10, height: scrollTriggerInterval.intervalUp.to - scrollTriggerInterval.intervalUp.from }} />
            </>}
            <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} pointerEvents="none">
                {dragged &&
                    <Animated.View
                        style={[
                            animatedStyle,
                            styles.animatedView,
                            {
                                backgroundColor: chroma.mix(theme.colors.fullTheme, dragged.color, .1).hex(),
                                borderColor: dragged.color,
                                width: cellWidth,
                                height: cellHeight,
                                padding: theme.spacing.xs,
                            }
                        ]}
                    >
                        <CustomText font="A700" size={14} style={{ textAlign: "center" }}>{dragged.label}</CustomText>
                    </Animated.View>
                }
            </View>
            <ModalNative // CREATE TAB MODAL
                open={newTabOpen}
                close={() => setNewTabOpen(false)}
                actions={[
                    { title: "Retour", icon: IconSVGCode.arrow_left, onPress: () => setNewTabOpen(false), variant: "neutral" },
                    { title: "Créer", icon: IconSVGCode.plus, onPress: () => { setNewTabOpen(false); createNewTab() }, variant: "success", disabled: tabName.length < 1 || tabColor.length != 7 }
                ]}
            >
                <TextFormRow handleChange={(e) => setTabName(e)} title="Nom" value={tabName} />
                <ColorFormRow handleChange={(e) => setTabColor(e)} title="Couleur" value={tabColor} />
                <IconFormRow handleChange={(e) => setTabIcon(e as FoodSVGCode)} title="Icone" value={tabIcon} />
            </ModalNative>
            {planDeTouche[selectedTab] && <>
                <ModalNative // DELETE TAB MODAL
                    open={deleteTabOpen}
                    close={() => setDeleteTabOpen(false)}
                    actions={[
                        { title: "Retour", icon: IconSVGCode.arrow_left, onPress: () => setDeleteTabOpen(false), variant: "neutral" },
                        { title: "Supprimer", icon: IconSVGCode.trash, onPress: () => { setDeleteTabOpen(false); deleteSelectedTab() }, variant: "danger" }
                    ]}
                >
                    <Box flexDirection={"column"} alignItems={"center"} width={"100%"} marginTop={"l"}>
                        <CustomText>Supprimer l'onglet {planDeTouche[selectedTab].name} ?</CustomText>
                        <CustomText>Celui ci contient {planDeTouche[selectedTab].blueprint.length.toString()} produit(s)</CustomText>
                        <CustomText color="danger">Attention, cette action est irréversible</CustomText>
                    </Box>
                </ModalNative>
                <ModalNative // EDIT TAB MODAL
                    open={editTabOpen}
                    close={() => setEditTabOpen(false)}
                    actions={[
                        { title: "Retour", icon: IconSVGCode.arrow_left, onPress: () => setEditTabOpen(false), variant: "neutral" },
                        { title: "Sauvegarder", icon: IconSVGCode.save, onPress: () => { setEditTabOpen(false); editTab() }, variant: "success" }
                    ]}
                >
                    <TextFormRow handleChange={(e) => setTabName(e)} title="Nom" value={tabName} />
                    <ColorFormRow handleChange={(e) => setTabColor(e)} title="Couleur" value={tabColor} />
                    <IconFormRow handleChange={(e) => setTabIcon(e as FoodSVGCode)} title="Icone" value={tabIcon} />
                </ModalNative>
                <ModalNative // EMPTY TAB MODAL
                    open={emptyTabOpen}
                    close={() => setEmptyTabOpen(false)}
                    actions={[
                        { title: "Retour", icon: IconSVGCode.arrow_left, onPress: () => setEmptyTabOpen(false), variant: "neutral" },
                        { title: "Vider", icon: IconSVGCode.xmark, onPress: () => { setEmptyTabOpen(false); emptyTab() }, variant: "danger" }
                    ]}
                >
                    <Box justifyContent="center" alignItems="center" style={{ flex: 1, paddingVertical: theme.spacing.m, paddingHorizontal: theme.spacing.m }} >
                        <CustomText style={{ textAlign: "center" }}>Supprimer les {planDeTouche[selectedTab].blueprint.length.toString()} produit(s) de l'onglet {planDeTouche[selectedTab].name} ?</CustomText>
                        <CustomText style={{ textAlign: "center" }} color="danger">Attention, cette action est irréversible</CustomText>
                    </Box>
                </ModalNative>
            </>}
            <ModalNative // AUTO LAYOUT MODAL
                open={autoLayoutOpen}
                close={() => setAutoLayoutOpen(false)}
                actions={[
                    { title: "Retour", icon: IconSVGCode.arrow_left, onPress: () => setAutoLayoutOpen(false), variant: "neutral" },
                    { title: "Let's go !", icon: IconSVGCode.layer_group, onPress: () => { setAutoLayoutOpen(false); autoLayout() }, variant: "info" }
                ]}
            >
                <Box justifyContent="center" alignItems="center" style={{ flex: 1, paddingVertical: theme.spacing.m, paddingHorizontal: theme.spacing.m }} >
                    <CustomText style={{ textAlign: "center" }}>La fonction auto layout permet de créer un carte basée sur le catalogue.</CustomText>
                    <CustomText style={{ textAlign: "center" }}>Un onglet sera créé par categorie du catalogue.</CustomText>
                    <IconSVG icon={IconSVGCode.warning} size="titan" fill={'danger'} />
                    <CustomText style={{ textAlign: "center" }}>Les {planDeTouche.length.toString()} onglet(s) du plan de touche vont être supprimés.</CustomText>
                    <CustomText style={{ textAlign: "center" }} color="danger">Attention, cette action est irréversible.</CustomText>
                </Box>
            </ModalNative>
            <CollapsingFloatingMenu actions={floatingActions} />
        </SafeAreaView >
    )
}

export default Blueprint;

const DraggableProduct = ({
    product,
    onPress,
    onLongPress,
    translateX,
    translateY,
    queueHighlightTargetUnder,
    cellWidth,
    handleDrop,
    checkForScrollViewLimit,
}: {
    product: Product,
    onPress: () => void | null,
    onLongPress: () => void | null,
    translateX: SharedValue<number>,
    translateY: SharedValue<number>,
    queueHighlightTargetUnder: ({ absX, absY }: { absX: number, absY: number }) => void,
    cellWidth: number,
    cellHeight: number,
    handleDrop: ({ absX, absY }: { absX: number, absY: number }) => void,
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
            if (onLongPress) runOnJS(onLongPress)()
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).onUpdate((e) => {
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            runOnJS(checkForScrollViewLimit)(e.absoluteY)
            runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).onEnd((e) => {
            runOnJS(handleDrop)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        })

    if (onLongPress) {
        return (
            <GestureDetector gesture={fromListPan}>
                <Pressable style={{ flex: 1 }} onPress={onPress ?? null} onPressIn={() => setIsPressed(true)} onPressOut={() => setIsPressed(false)} >
                    <Box height={72} justifyContent={'center'} padding={"xxs"} flex={1} borderRadius={4} borderBottomWidth={6} style={{ backgroundColor: isPressed ? chroma(theme.colors.primary).alpha(.1).hex() : chroma(product.color).alpha(.08).hex(), borderColor: product.color }} >
                        <CustomText font="A700" size={14} style={{ textAlign: "center", maxWidth: "100%" }}>{product.label}</CustomText>
                    </Box>
                </Pressable>
            </GestureDetector>
        )
    } else {
        return (
            <View style={{ flex: 1 }}>
                <Box height={72} justifyContent={'center'} padding={"xxs"} flex={1} borderRadius={4} borderBottomWidth={6} style={{ backgroundColor: isPressed ? chroma(theme.colors.primary).alpha(.1).hex() : chroma(product.color).alpha(.08).hex(), borderColor: product.color }} >
                    <CustomText font="A700" size={14} style={{ textAlign: "center", maxWidth: "100%" }}>{product.label}</CustomText>
                </Box>
            </View>
        )
    }
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
    isLastDragged,
}: {
    cell: Cell,
    product: Product,
    onLongPress: () => void,
    translateX: SharedValue<number>,
    translateY: SharedValue<number>,
    queueHighlightTargetUnder: ({ absX, absY }: { absX: number, absY: number }) => void,
    cellWidth: number,
    cellHeight: number,
    handleDrop: ({ absX, absY }: { absX: number, absY: number }) => void,
    resetDrag: () => void,
    removeFromBlueprint: (cell: Cell) => void
    checkForScrollViewLimit: (y: number) => void
    isLastDragged: boolean
}) => {
    const [isPressed, setIsPressed] = useState<boolean>(false)
    const [isDragged, setIsDragged] = useState<boolean>(false)
    const [editionOpen, setEditionOpen] = useState<boolean>(false)
    const theme = useTheme<Theme>()

    const textSize = useMemo(() => {
        if (cell.content.label.length > 40) {
            return cell.coordinates.w == 1 ? 14 : 18
        }
        if (cell.content.label.length > 20) {
            return cell.coordinates.w == 1 ? 17 : 21
        }
        if (cell.content.label.length > 10) {
            return cell.coordinates.w == 1 ? 20 : 24
        }
    }, [cell.content.label, cell.coordinates.w])

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
            runOnJS(handleDrop)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        })

    const animatedTop = useSharedValue(cell.layout.top)
    const animatedLeft = useSharedValue(cell.layout.left)
    const animatedHeight = useSharedValue(cell.layout.height)
    const animatedWidth = useSharedValue(cell.layout.width)

    useEffect(() => {
        if (!isLastDragged) {
            animatedTop.value = withTiming(cell.layout.top, { duration: 250 })
            animatedLeft.value = withTiming(cell.layout.left, { duration: 250 })
            animatedHeight.value = withTiming(cell.layout.height, { duration: 250 })
            animatedWidth.value = withTiming(cell.layout.width, { duration: 250 })
        } else {
            animatedTop.value = cell.layout.top
            animatedLeft.value = cell.layout.left
            animatedHeight.value = cell.layout.height
            animatedWidth.value = cell.layout.width
        }
    }, [cell])

    const animatedStyle = useAnimatedStyle(() => {
        return ({
            top: animatedTop.value,
            left: animatedLeft.value,
            height: animatedHeight.value,
            width: animatedWidth.value,
        })
    })

    return (
        <>
            <GestureDetector gesture={fromPlacedPan}>
                <Animated.View
                    style={[{
                        position: "absolute",
                        borderBottomWidth: 12,
                        padding: theme.spacing.xxs,
                        borderRadius: 4,
                        width: cellWidth,
                        height: cellHeight,
                        justifyContent: "center",
                        alignItems: "center",
                        opacity: isDragged ? .5 : 1,
                        zIndex: isLastDragged ? 10000000 : 9000000,
                        backgroundColor: isPressed ? chroma(product.color).alpha(.1).hex() : theme.colors.surface,
                        borderColor: product.color,
                        ...cell.layout
                    }, animatedStyle]}
                >
                    <Pressable onPressIn={() => setIsPressed(true)} onPressOut={() => setIsPressed(false)} onPress={() => setEditionOpen(true)}>
                        <Box
                            flex={1}
                            justifyContent={"center"}
                            alignItems={"stretch"}
                        >
                            <CustomText font="A700" size={textSize} lineHeight={textSize} style={{ textAlign: "center", width: "100%", textAlignVertical: "center" }}>{product.label}</CustomText>
                        </Box>
                    </Pressable>
                </Animated.View>
            </GestureDetector>
            <ModalNative
                open={editionOpen}
                close={() => setEditionOpen(false)}
                actions={[
                    { title: "Retour", icon: IconSVGCode.arrow_left, onPress: () => setEditionOpen(false), variant: "neutral" },
                    { title: "Remove", icon: IconSVGCode.trash, onPress: () => { setEditionOpen(false); removeFromBlueprint(cell) }, variant: "danger" }
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