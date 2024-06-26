import { FlatList, LayoutChangeEvent, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Theme } from "../../constants/Palette"
import card from '../../constants/fakeCard.json'

import Box from "../../components/Box"
import { useTheme, useResponsiveProp } from "@shopify/restyle"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button, { ButtonVariant } from "../../components/Button";
import { IconSVG, IconSVGCode } from "../../components/IconSVG";
import { router } from "expo-router";

import chroma from "chroma-js"
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Easing, runOnJS, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import CustomText from "../../components/CustomText";
import { Product, RegisterAbsoluteLayout } from "../../constants/types";
import { overlapMarginError, tabColors } from "../../constants/utils";

import _ from 'lodash'
import ModalNative from "../../components/ModalNative"

import uuid from 'react-native-uuid';
import CollapsingFloatingMenu, { FloatingAction } from "../../components/CollapsingFloatingMenu"
import TextFormRow from "../../components/formRow/TextFormRow"
import ColorFormRow from "../../components/formRow/ColorFormRow"
import IconFormRow from "../../components/formRow/IconFormRow"
import { FoodSVG, FoodSVGCode } from "../../components/FoodSVG"
import Panel from "../../components/Panel"

import { useThrottledCallback } from 'use-debounce';

import Header from "../../components/Header"
import Pill from "../../components/Pill"
import { FolderDeToucheView } from "../../components/FolderDeToucheView"

/*
- Highlight on over : 4 square to 1 big square
- Pass needToScrollCheck in UIThread

- Create product group on drop of a product on another one (open modal onDrop to ask : create group or swap))

- Find new way to trigger a move with animated:true/flase for placed item ?
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
    content: null | Product | FolderDeTouche;
    overlappedBy?: string | null
}

type TabDeTouche = {
    name: string,
    color: string,
    icon: FoodSVGCode,
    blueprint: Cell[]
}

export type FolderDeTouche = {
    typeDeTouche: "FOLDER",
    name: string,
    color: string,
    icon?: FoodSVGCode,
    content: Cell[]
}

type PlanDeTouche = TabDeTouche[]

const displayTabName = true;
const cellHWFactor = .8;
const gridGap = 's';
const delayLongPress = 100;
const fingerDodge = 80;
const overlapMinimum = 15;

let computeTargetUnder = ({ absX, absY, dragged, scrollViewLayout, onScrollEndContentOffset, cellHeight, cellWidth, potentialDropTargets }: { absX: number, absY: number, dragged: Product | FolderDeTouche, scrollViewLayout: RegisterAbsoluteLayout | null, onScrollEndContentOffset: number, cellHeight: number, cellWidth: number, potentialDropTargets: Cell[] }) => {
    //return [] // TEST
    if (!scrollViewLayout) return []
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
        return ins
    }
    return []
}

let computeTargetUnderThrottled = _.throttle(computeTargetUnder, 200, { 'leading': true, 'trailing': false });

export const Blueprint = ({ }: Props) => {

    const theme = useTheme<Theme>();

    const isTablet = useResponsiveProp({ phone: 0, tablet: 1 })
    const numColumnsAvailable = useResponsiveProp({ phone: 3, tablet: 3, largeTablet: 4 })
    const headerHeight = useResponsiveProp({ phone: 250, longPhone: 320 })

    const baseGridX = useResponsiveProp({ phone: 3, tablet: 5 }); // WILL BE FIXED BY SELECTED PLAN DE TOUCHE
    const baseGridY = 5;

    const scrollViewHorizontalPadding = useResponsiveProp({ phone: null, tablet: theme.spacing.l, largeTablet: theme.spacing.xxxl });

    const [gridX, setGridX] = useState(baseGridX);
    const [gridY, setGridY] = useState(baseGridY);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const scrollRef = useRef<View>();

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)
    const [selectedTab, setSelectedTab] = useState<TabDeTouche | null>(null)
    const [selectedFolder, setSelectedFolder] = useState<FolderDeTouche | null>(null)
    const [selectedFolderCell, setSelectedFolderCell] = useState<Cell | null>(null)

    const [editTabOpen, setEditTabOpen] = useState<boolean>(null)
    const [newTabOpen, setNewTabOpen] = useState<boolean>(null)
    const [deleteTabOpen, setDeleteTabOpen] = useState<boolean>(null)
    const [emptyTabOpen, setEmptyTabOpen] = useState<boolean>(null)
    const [autoLayoutOpen, setAutoLayoutOpen] = useState<boolean>(null)

    const [editFolderOpen, setEditFolderOpen] = useState<boolean>(null)
    const [newFolderOpen, setNewFolderOpen] = useState<boolean>(null)
    const [deleteFolderOpen, setDeleteFolderOpen] = useState<boolean>(null)
    const [emptyFolderOpen, setEmptyFolderOpen] = useState<boolean>(null)

    const [tabName, setTabName] = useState<string>('')
    const [tabColor, setTabColor] = useState<string>('')
    const [tabIcon, setTabIcon] = useState<FoodSVGCode | null>(null)

    const [folderName, setFolderName] = useState<string>('')
    const [folderColor, setFolderColor] = useState<string>('')
    const [folderIcon, setFolderIcon] = useState<FoodSVGCode | null>(null)

    const [emptyPlaceCoordinates, setEmptyPlaceCoordinates] = useState<{ x: number, y: number } | null>(null)

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
        if (planDeTouche[selectedTabIndex]) {
            tmp = [...tmp, {
                color: "primary" as ButtonVariant, icon: IconSVGCode.edit, label: `Modifier  "${planDeTouche[selectedTabIndex].name}"`, onPress: () => {
                    setTabColor(planDeTouche[selectedTabIndex].color);
                    setTabName(planDeTouche[selectedTabIndex].name);
                    setTabIcon(planDeTouche[selectedTabIndex].icon as FoodSVGCode);
                    setEditTabOpen(true);
                }
            }, {
                color: "danger" as ButtonVariant, icon: IconSVGCode.xmark, label: `Vider  "${planDeTouche[selectedTabIndex].name}"`, onPress: () => setEmptyTabOpen(true)
            }, {
                color: "danger" as ButtonVariant, icon: IconSVGCode.trash, label: `Supprimer  "${planDeTouche[selectedTabIndex].name}"`, onPress: () => setDeleteTabOpen(true)
            }]
        }

        tmp = [...tmp, {
            color: "info" as ButtonVariant, icon: IconSVGCode.layer_group, label: "Auto layout", onPress: () => setAutoLayoutOpen(true)
        }]

        return (tmp)
    }, [planDeTouche, selectedTabIndex])

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [gridWidth, setGridWidth] = useState<number | null>()
    const [availableProductGridWidth, setAvailableProductGridWidth] = useState<number | null>(null)
    const [scrollViewLayout, setScrollViewLayout] = useState<RegisterAbsoluteLayout | null>(null)
    const [onScrollEndContentOffset, setOnScrollEndContentOffset] = useState<number>(0)
    const [dragged, setDragged] = useState<Product | FolderDeTouche | null>(null)
    const [lastDragged, setLastDragged] = useState<Cell | null>(null)
    const [draggedOrigin, setDraggedOrigin] = useState<null | Cell>(null)

    const scrollHeight = useSharedValue(0)

    const [hovered, setHovered] = useState<{ x: number, y: number }[]>([])

    const cellWidth = useMemo(() => {
        theme.spacing[gridGap]
        if (gridWidth) {
            return ((gridWidth - (theme.spacing[gridGap] * (gridX - 1))) / gridX) - 1
        } else {
            return 128
        }
    }, [gridWidth])

    const cellWidthAvailable = useMemo(() => {
        if (availableProductGridWidth && numColumnsAvailable) {
            return (availableProductGridWidth - (theme.spacing[gridGap] * (numColumnsAvailable - 1))) / numColumnsAvailable
        } else {
            return 140
        }
    }, [availableProductGridWidth, numColumnsAvailable])

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
        tmp.splice(selectedTabIndex, 1)
        setPlanDeTouche(tmp)
    }
    const editTab = () => {
        let tmp: PlanDeTouche = JSON.parse(JSON.stringify(planDeTouche))
        let editedTab: TabDeTouche = tmp.splice(selectedTabIndex, 1)[0]
        tmp.splice(selectedTabIndex, 0, {
            ...editedTab,
            name: tabName,
            color: tabColor,
            icon: tabIcon
        })
        setPlanDeTouche(tmp)
    }
    const emptyTab = () => {
        let tmp: PlanDeTouche = JSON.parse(JSON.stringify(planDeTouche))
        let editedTab: TabDeTouche = tmp.splice(selectedTabIndex, 1)[0]
        tmp.splice(selectedTabIndex, 0, {
            ...editedTab,
            blueprint: []
        })
        setPlanDeTouche(tmp)
    }

    const createNewFolder = () => {
        let tmp: Cell[] = JSON.parse(JSON.stringify(planDeTouche[selectedTabIndex].blueprint))
        let tmpCell: Cell = {
            id: uuid.v4().toString(),
            coordinates: { x: emptyPlaceCoordinates.x, y: emptyPlaceCoordinates.y, w: 1, h: 1 },
            layout: null,
            content: {
                typeDeTouche: "FOLDER",
                color: folderColor,
                content: [],
                name: folderName,
                icon: folderIcon
            } as FolderDeTouche,
        }
        tmp.push(tmpCell)
        updateBlueprintOfTab(tmp)
    }
    const deleteSelectedFolder = () => {
        removeFromBlueprint(selectedFolderCell)
    }
    const editFolder = () => {
        let tmp: Cell[] = JSON.parse(JSON.stringify(planDeTouche[selectedTabIndex].blueprint))
        if (selectedFolderCell.id) {
            tmp = tmp.filter(tmpCell => tmpCell.id !== selectedFolderCell.id)
            let tmpCell: Cell = {
                ...selectedFolderCell,
                content: {
                    ...selectedFolderCell.content,
                    name: folderName,
                    color: folderColor,
                    icon: folderIcon
                } as FolderDeTouche
            }
            tmp.push(tmpCell)
            updateBlueprintOfTab(tmp)
        }
    }
    const emptyFolder = () => {
        let tmp: PlanDeTouche = JSON.parse(JSON.stringify(planDeTouche))
        let editedTab: TabDeTouche = tmp.splice(selectedTabIndex, 1)[0]
        tmp.splice(selectedTabIndex, 0, {
            ...editedTab,
            blueprint: []
        })
        setPlanDeTouche(tmp)
    }

    const updateBlueprintOfTab = (blueprint: Cell[]) => {
        let tmp: PlanDeTouche = JSON.parse(JSON.stringify(planDeTouche))
        let editedTab: TabDeTouche = tmp.splice(selectedTabIndex, 1)[0]
        if (editedTab) {
            tmp.splice(selectedTabIndex, 0, {
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
                    content: { ...product, typeDeTouche: "PRODUCT" },
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
                icon: carCat.icon as FoodSVGCode,
                name: carCat.name
            })
        })
        setPlanDeTouche(pdt)
    }
    const autoLayoutCategory = useCallback(() => {
        const category = card.find(x => x.id == selectedCategory)
        let autoLayoutName = category.name
        let n = 1;
        while (planDeTouche.some(tab => tab.name == autoLayoutName)) {
            autoLayoutName = `${category.name} (${n})`
            n++;
        }
        let productInCells: Cell[] = []
        let x = 0;
        let y = 0;
        category.products.forEach(product => {
            productInCells.push({
                id: uuid.v4().toString(),
                content: { ...product, typeDeTouche: "PRODUCT" },
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
        const newTabPdt = {
            blueprint: productInCells,
            color: category.color,
            icon: category.icon as FoodSVGCode,
            name: autoLayoutName
        }
        setPlanDeTouche([...planDeTouche, newTabPdt])
    }, [card, selectedCategory, planDeTouche])

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
    const blueprint = useMemo<Cell[]>(() => {
        if (planDeTouche[selectedTabIndex]) {
            return planDeTouche[selectedTabIndex].blueprint.map((cell, index) => {
                return ({
                    id: cell.id,
                    coordinates: cell.coordinates,
                    layout: getPositionAndSizesFromXYCoordinates({ ...cell.coordinates }),
                    content: cell.content
                })
            })
        } else {
            return []
        }
    }, [selectedTabIndex, planDeTouche, gridWidth])

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
            return []
        }
    }, [onScrollEndContentOffset, grid, scrollViewLayout])

    const addProductToDropIds = ({ product, dropIds, origin }: { product: Product | FolderDeTouche, dropIds: { x: number, y: number }[], origin: Cell | null }) => {
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
                    cellOne: planDeTouche[selectedTabIndex].blueprint.find(p => p.id == origin.id),
                    cellTwo: planDeTouche[selectedTabIndex].blueprint.find(p => p.id == droppedOverProducts[0])
                })
            }
        }
        if (droppedOverProducts.length > 1) {
            //console.log("Dropped over multiple products")
        }
    }
    const switchTwoProducts = ({ cellOne, cellTwo }: { cellOne: Cell, cellTwo: Cell }) => {
        let tmp: Cell[] = JSON.parse(JSON.stringify(planDeTouche[selectedTabIndex].blueprint))
        tmp.find(x => x.id == cellOne.id).coordinates = cellTwo.coordinates
        tmp.find(x => x.id == cellTwo.id).coordinates = cellOne.coordinates
        updateBlueprintOfTab(tmp)
    }

    const highlightTargetUnder = ({ absX, absY }: { absX: number, absY: number }) => {
        let tmpUnder = computeTargetUnderThrottled({
            absX,
            absY,
            dragged,
            scrollViewLayout,
            onScrollEndContentOffset,
            cellHeight,
            cellWidth,
            potentialDropTargets
        })
        console.log("EXECUTED")
        setHovered(tmpUnder)
    } // PREVIOUSLY THROTTLED

    const addProductToBlueprint = ({ product, x, y, w, h, origin }: { product: Product | FolderDeTouche, x: number, y: number, w: number, h: number, origin: Cell | null }) => {
        let tmp: Cell[] = JSON.parse(JSON.stringify(planDeTouche[selectedTabIndex].blueprint))
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
            let targets = computeTargetUnder({
                absX, absY, cellHeight, cellWidth, dragged, onScrollEndContentOffset, potentialDropTargets, scrollViewLayout
            })
            if (targets.length > 0) {
                //product do not overlap with any other product already placed
                addProductToDropIds({
                    product: dragged,
                    dropIds: targets,
                    origin: draggedOrigin ?? null
                })
            }
        }
        resetDrag()
    }

    const handleGrab = (product: Product | FolderDeTouche, originCell: Cell | null) => {
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
        let tmp: Cell[] = JSON.parse(JSON.stringify(planDeTouche[selectedTabIndex].blueprint.filter(x => x.id != cell.id)))
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

    const scroll = useThrottledCallback((target: number) => {
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

    const availableProductList = useMemo(() => {
        return (
            <Panel
                style={{ flex: 1 }}
                header={
                    <Box flexDirection={"row"} justifyContent={"space-between"}>
                        <Pressable style={{ flexDirection: "row", alignItems: "center", paddingRight: theme.spacing.xxxl, paddingHorizontal: theme.spacing.m, padding: theme.spacing.s }} onPress={() => setSelectedCategory(null)}>
                            <IconSVG icon={IconSVGCode.chevron_left} fill={'primary'} size='normal' />
                            <Header margin={0} style={{ marginTop: 4, marginLeft: theme.spacing.m }} size={4} variant="primary">{selectedCategory ? card.find(x => x.id == selectedCategory).name : ""}</Header>
                        </Pressable>
                        <Pressable style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: theme.spacing.m, padding: theme.spacing.s }} onPress={() => autoLayoutCategory()}>
                            <Pill icon={IconSVGCode.layer_group} size="s" style={{ margin: 0, paddingHorizontal: theme.spacing.m }} variant="info" title="Auto layout" />
                        </Pressable>
                    </Box>
                }
            >
                <FlatList
                    key={selectedCategory + numColumnsAvailable.toString()}
                    numColumns={numColumnsAvailable}
                    scrollEnabled={dragged == null}
                    keyExtractor={(product) => "prod" + product.id}
                    onLayout={(e) => setAvailableProductGridWidth(e.nativeEvent.layout.width)}
                    data={selectedCategory ? card.find(cat => cat.id == selectedCategory).products : []}
                    contentContainerStyle={{ gap: theme.spacing[gridGap] }}
                    columnWrapperStyle={{ gap: theme.spacing[gridGap] }}
                    renderItem={({ item, index }) => {
                        return (
                            <DraggableProduct
                                product={{ ...item, typeDeTouche: "PRODUCT" }}
                                onPress={() => setSelectedProduct({ ...item, typeDeTouche: "PRODUCT" })}
                                onLongPress={() => { handleGrab({ ...item, typeDeTouche: "PRODUCT" }, null); }}
                                cellHeight={cellWidthAvailable * cellHWFactor}
                                cellWidth={cellWidthAvailable}
                                handleDrop={handleDrop}
                                queueHighlightTargetUnder={highlightTargetUnder}
                                resetDrag={resetDrag}
                                translateX={translateX}
                                translateY={translateY}
                                checkForScrollViewLimit={checkForScrollViewLimit}
                            />
                        )
                    }}
                />
            </Panel>
        )
    }, [numColumnsAvailable, dragged, setAvailableProductGridWidth, selectedCategory, gridGap, cellWidthAvailable, cellHWFactor, autoLayoutCategory])

    const selectedProductPanel = useMemo(() => {
        if (!selectedProduct) return
        return (
            <Box flexDirection={"column"} justifyContent={"center"} alignItems={"center"} position={'relative'} gap='m' flex={1}>
                <CustomText font="A700" size={14} style={{ textAlign: "center", maxWidth: "100%" }}>Séléctioné : </CustomText>
                <View style={{ height: cellHeight * 1.25, width: cellWidth * 1.65 }}>
                    <Box height={72} justifyContent={'center'} padding={"xxs"} flex={1} borderRadius={4} borderBottomWidth={6} style={{ backgroundColor: theme.colors.surface, borderColor: selectedProduct.color }} >
                        <CustomText font="A700" size={14} style={{ textAlign: "center", maxWidth: "100%" }}>{selectedProduct.label}</CustomText>
                    </Box>
                </View>
                <CustomText font="A700" size={14} style={{ textAlign: "center", maxWidth: "100%" }}>Touchez une case  [+]  pour placer le produit</CustomText>
                <Button size="s" variant="danger" onPress={() => setSelectedProduct(null)} icon={IconSVGCode.xmark} style={{ position: 'absolute', top: -4, right: -4 }} />
            </Box>
        )
    }, [selectedProduct, cellHeight, setSelectedProduct, cellWidth])

    const availableCategoriesList = useMemo(() => {
        return (
            <Panel unpadded style={{ flex: 1 }}
                header={
                    <Box style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: theme.spacing.m, padding: theme.spacing.s }}>
                        <Header margin={0} style={{ marginTop: 4 }} size={4} variant="primary">{"CARTE : Carte été"}</Header>
                    </Box>
                }
                title={"CARTE : Carte été"}
            >
                <FlatList
                    keyExtractor={(item) => "cat" + item.id}
                    style={{ flex: 0, flexGrow: 0 }}
                    data={card}
                    renderItem={({ item, index }) => {
                        return (
                            <Pressable style={{ flex: 1, paddingVertical: theme.spacing.s, paddingHorizontal: theme.spacing.l, borderRadius: 4, flexDirection: "row", alignItems: 'center', borderBottomWidth: 1, borderColor: theme.colors.border }} onPress={() => setSelectedCategory(item.id)}>
                                <FoodSVG icon={item.icon as FoodSVGCode} fill={item.color} size="normal" />
                                <CustomText style={{ marginLeft: theme.spacing.s, marginTop: 2 }} color={item.id == selectedCategory ? "white" : undefined} font='A600' size={18}>{item.name}</CustomText>
                                <Box flex={1} />
                                <CustomText font={"A500_I"} size={12} color={item.id == selectedCategory ? "white" : 'textFadded'} style={{ marginRight: theme.spacing.s, marginTop: 3 }}>{`${item.products.length} produits`}</CustomText>
                                <IconSVG icon={IconSVGCode.folder} fill={theme.colors.textFadded} />
                            </Pressable>
                        )
                    }}
                />
            </Panel>
        )
    }, [numColumnsAvailable, dragged, setAvailableProductGridWidth, selectedCategory, gridGap, cellWidthAvailable, cellHWFactor])

    const tabList = useMemo(() => {
        if (isTablet) {
            return (
                <Box flex={{ phone: 1, tablet: 4 }} flexGrow={{ phone: 1, tablet: 4 }} >
                    <Header style={{ marginTop: 0, marginBottom: 4 }} size={5}>MES ONGLETS</Header>
                    <FlatList
                        data={planDeTouche.length > 0 ? [...planDeTouche, null] : []}
                        key={"productOfCategory:" + selectedCategory}
                        numColumns={2}
                        contentContainerStyle={{ gap: theme.spacing.m, minHeight: "100%" }}
                        columnWrapperStyle={{ gap: theme.spacing.m, justifyContent: "space-between" }}
                        style={{
                            width: "100%",
                            marginBottom: -8,
                            paddingRight: theme.spacing.s
                        }}
                        renderItem={({ item, index }) => {
                            if (!item) {
                                return (
                                    <Pressable
                                        style={[styles.addTab, {
                                            flex: 1,
                                            justifyContent: "center",
                                            paddingHorizontal: theme.spacing.m,
                                            height: 48,
                                            borderColor: theme.colors.primary,
                                            backgroundColor: theme.colors.surface,
                                        }]}
                                        onPress={() => {
                                            setTabColor(tabColors[planDeTouche.length + 1]);
                                            setTabName("Onglet " + (planDeTouche.length + 1));
                                            setTabIcon(FoodSVGCode.none);
                                            setNewTabOpen(true)
                                        }}
                                    >
                                        <CustomText font="A500" color="primary">Créer un onglet</CustomText>
                                        <IconSVG icon={IconSVGCode.plus} fill={theme.colors.primary} size="small" />
                                    </Pressable>
                                )
                            }
                            return (
                                <Pressable
                                    onPress={() => setSelectedTabIndex(index)}
                                    onLongPress={() => {
                                        setSelectedTabIndex(index)
                                        setSelectedTab(item)
                                        setTabColor(item.color);
                                        setTabName(item.name);
                                        setTabIcon(item.icon as FoodSVGCode);
                                        setEditTabOpen(true);
                                    }}
                                    style={[
                                        styles.tab,
                                        {
                                            height: 48,
                                            borderColor: selectedTabIndex == index ? chroma(item.color).darken().hex() : item.color,
                                            backgroundColor: selectedTabIndex == index ? chroma(item.color).alpha(.8).hex() : theme.colors.surface,
                                            width: "48.5%",
                                            paddingHorizontal: theme.spacing.s
                                        }
                                    ]}
                                >
                                    {item.icon &&
                                        <FoodSVG icon={item.icon} fill={selectedTabIndex == index ? theme.colors.fullwhite : item.color} size="normal" />
                                    }
                                    {displayTabName &&
                                        <CustomText color={selectedTabIndex == index ? 'fullwhite' : null} >{item.name}</CustomText>
                                    }
                                </Pressable>
                            )
                        }}
                        ListEmptyComponent={() => {
                            return (
                                <Box flex={1} height={"100%"} alignItems={"center"} justifyContent={"center"} >
                                    <CustomText color={"textFadded"} font="A400_I" size={18} textAlign="center" >Aucun onglet</CustomText>
                                </Box>
                            )
                        }}
                    />
                </Box>
            )
        } else {
            return (
                <Box height={50} style={{ marginBottom: -10 }}>
                    <FlatList
                        data={planDeTouche.length > 0 ? [...planDeTouche, null] : []}
                        horizontal
                        scrollEnabled={planDeTouche.length > 0}
                        contentContainerStyle={{ gap: theme.spacing.s, minWidth: "100%", paddingHorizontal: 4 }}
                        style={{
                            marginRight: theme.spacing.s,
                            width: "100%",
                        }}
                        renderItem={({ item, index }) => {
                            if (!item) {
                                return (
                                    <Pressable
                                        style={[styles.addTab, {
                                            paddingHorizontal: theme.spacing.m,
                                            height: 40,
                                            borderColor: theme.colors.primary,
                                            backgroundColor: theme.colors.surface,
                                        }]}
                                        onPress={() => {
                                            setTabColor(tabColors[planDeTouche.length + 1]);
                                            setTabName("Onglet " + (planDeTouche.length + 1));
                                            setTabIcon(FoodSVGCode.none);
                                            setNewTabOpen(true)
                                        }}
                                    >
                                        <CustomText font="A500" color="primary">Créer un onglet</CustomText>
                                        <IconSVG icon={IconSVGCode.plus} fill={theme.colors.primary} size="small" />
                                    </Pressable>
                                )
                            }
                            return (
                                <Pressable
                                    style={[
                                        styles.tab,
                                        {
                                            paddingLeft: 8,
                                            height: 40,
                                            borderColor: selectedTabIndex == index ? chroma(item.color).darken().hex() : item.color,
                                            backgroundColor: selectedTabIndex == index ? chroma(item.color).alpha(.8).hex() : theme.colors.surface,
                                            paddingHorizontal: theme.spacing.s
                                        }
                                    ]}
                                    onPress={() => setSelectedTabIndex(index)}
                                    onLongPress={() => {
                                        setSelectedTabIndex(index)
                                        setSelectedTab(item)
                                        setTabColor(item.color);
                                        setTabName(item.name);
                                        setTabIcon(item.icon as FoodSVGCode);
                                        setEditTabOpen(true);
                                    }}
                                >
                                    {item.icon &&
                                        <FoodSVG icon={item.icon} fill={selectedTabIndex == index ? theme.colors.fullwhite : item.color} size="normal" />
                                    }
                                    {displayTabName &&
                                        <CustomText color={selectedTabIndex == index ? 'fullwhite' : null} >{item.name}</CustomText>
                                    }
                                </Pressable>
                            )
                        }}
                        ListEmptyComponent={() => {
                            return (
                                <Box flex={1} height={"100%"} alignItems={"center"} justifyContent={"center"}>
                                    <CustomText color={"textFadded"} size={20} lineHeight={22} font="A400_I" textAlign="center" >Aucun onglet</CustomText>
                                </Box>
                            )
                        }}
                    />
                </Box>
            )
        }
    }, [isTablet, planDeTouche, selectedTabIndex, selectedTab, setSelectedTabIndex, setSelectedTab, setTabColor, setTabName, setTabIcon, setEditTabOpen, editTabOpen, tabIcon, tabColor, tabName])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Box flex={1} paddingVertical={{ phone: 's', tablet: "l" }}>
                <Box flexDirection={{ phone: "column", tablet: "row" }} gap={"m"} marginBottom={'m'} height={headerHeight} marginHorizontal={'m'} >
                    <Box flex={{ phone: 1, tablet: 5 }} flexGrow={{ phone: 1, tablet: 5 }} flexDirection="row">
                        {selectedProduct != null ?
                            selectedProductPanel
                            :
                            selectedCategory != null ?
                                availableProductList
                                :
                                availableCategoriesList
                        }
                    </Box>
                    {tabList}
                </Box>
                <Box flex={1} flexGrow={1} gap={'m'} marginHorizontal={'l'}>
                    <Box flex={1} flexGrow={1} >
                        {planDeTouche[selectedTabIndex] ?
                            <ScrollView
                                scrollEnabled={dragged == null}
                                decelerationRate={0}
                                ref={scrollRef}
                                scrollEventThrottle={0}
                                style={{ alignSelf: "stretch", flex: 1, flexGrow: 1, marginHorizontal: scrollViewHorizontalPadding }}
                                onLayout={e => { handleLayout(e) }}
                                onScroll={(e) => { setOnScrollEndContentOffset(e.nativeEvent.contentOffset.y) }}
                                onScrollEndDrag={(e) => { setOnScrollEndContentOffset(e.nativeEvent.contentOffset.y) }}
                                onMomentumScrollEnd={(e) => { setOnScrollEndContentOffset(e.nativeEvent.contentOffset.y) }}
                                contentContainerStyle={{ height: scrollHeight.value + (cellHeight + theme.spacing[gridGap]) }}
                            >
                                {objects.map((cell) => {
                                    if (cell.content) {
                                        if (cell.content.typeDeTouche == "PRODUCT") {
                                            return (
                                                <DraggablePlacedProduct
                                                    key={"object-" + cell.id}
                                                    cell={cell}
                                                    product={cell.content as Product}
                                                    onLongPress={() => grabPlacedItem(cell)}
                                                    cellHeight={cellHeight}
                                                    cellWidth={cellWidth}
                                                    handleDrop={handleDrop}
                                                    queueHighlightTargetUnder={highlightTargetUnder}
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
                                                <DraggablePlacedFolder
                                                    setSelectedFolder={setSelectedFolder}
                                                    setSelectedFolderCell={setSelectedFolderCell}
                                                    setEditFolderOpen={setEditFolderOpen}
                                                    key={"folder-" + cell.id}
                                                    cell={cell}
                                                    folder={cell.content as FolderDeTouche}
                                                    onLongPress={() => grabPlacedItem(cell)}
                                                    cellHeight={cellHeight}
                                                    cellWidth={cellWidth}
                                                    handleDrop={handleDrop}
                                                    queueHighlightTargetUnder={highlightTargetUnder}
                                                    translateX={translateX}
                                                    translateY={translateY}
                                                    checkForScrollViewLimit={checkForScrollViewLimit}
                                                    isLastDragged={lastDragged != null && lastDragged.id == cell.id}
                                                    setFolderIcon={setFolderIcon}
                                                    setFolderName={setFolderName}
                                                    setFolderColor={setFolderColor}
                                                />
                                            )
                                        }
                                    } else {
                                        return (
                                            <Box
                                                key={cell.id}
                                                position={"absolute"}
                                                borderRadius={4}
                                                opacity={cell.overlappedBy ? 0 : 1}
                                                style={{ borderColor: chroma(theme.colors[isHovered(cell) ? 'success' : 'primary']).alpha(.8).hex(), borderStyle: "dashed", borderWidth: 1.5, backgroundColor: chroma(theme.colors[isHovered(cell) ? 'success' : 'primary']).alpha(.08).hex(), ...cell.layout }}
                                                width={cellWidth}
                                                height={cellHeight}
                                                justifyContent={"center"}
                                                alignItems={"center"}
                                            >
                                                <Pressable
                                                    onPress={selectedProduct ?
                                                        () => placeSelectedProductHere(cell) :
                                                        () => {
                                                            setEmptyPlaceCoordinates({ x: cell.coordinates.x, y: cell.coordinates.y })
                                                            setNewFolderOpen(true)
                                                            setFolderName("Nouveau dossier")
                                                            setFolderIcon(FoodSVGCode.none)
                                                            setFolderColor(selectedTabIndex ? planDeTouche[selectedTabIndex].color : tabColors[0])
                                                        }}
                                                    style={{
                                                        flex: 1,
                                                        width: "100%",
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
                            <Box flex={1} flexGrow={1} justifyContent={"center"} alignItems={"center"} >
                                <Panel style={{ flex: 1, alignSelf: "stretch" }} contentInnerStyle={{ justifyContent: "center", alignItems: "center" }}>
                                    <CustomText font="A500" lineHeight={18} size={16} style={{ textAlign: "center" }} >Vous n'avez aucun onglet dans ce plan de touche ...</CustomText>
                                    <CustomText font="A500" lineHeight={18} size={16} style={{ textAlign: "center", marginTop: theme.spacing.s }} >Créer en un pour commencer à ajouter des produits !</CustomText>
                                    <Button outline onPress={() => { setTabColor(tabColors[planDeTouche.length]); setTabName("Onglet " + (planDeTouche.length + 1)); setTabIcon(FoodSVGCode.none); setNewTabOpen(true) }} title="Créer un onglet" icon={IconSVGCode.plus} size="m" iconPosition="right" style={{ marginTop: theme.spacing.m }} />
                                    <CustomText font="A500" lineHeight={18} size={16} style={{ textAlign: "center", marginTop: theme.spacing.s }} >Ou essayez l'auto layout</CustomText>
                                    <Button outline onPress={() => { setAutoLayoutOpen(true) }} title="Auto layout" variant="info" icon={IconSVGCode.layer_group} size="m" iconPosition="right" style={{ marginTop: theme.spacing.m }} />
                                </Panel>
                            </Box>
                        }
                    </Box>
                </Box>
            </Box>
            {
                scrollTriggerInterval && <>
                    <Box pointerEvents="none" backgroundColor="warning" opacity={0} style={{ position: 'absolute', zIndex: 1000000000, top: scrollTriggerInterval.intervalDown.from, left: 10, right: 10, height: scrollTriggerInterval.intervalDown.to - scrollTriggerInterval.intervalDown.from }} />
                    <Box pointerEvents="none" backgroundColor="primary" opacity={0} style={{ position: 'absolute', zIndex: 1000000000, top: scrollTriggerInterval.intervalUp.from, left: 10, right: 10, height: scrollTriggerInterval.intervalUp.to - scrollTriggerInterval.intervalUp.from }} />
                </>
            }
            <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} pointerEvents="none">
                {dragged && dragged.typeDeTouche == "PRODUCT" &&
                    <Animated.View
                        style={[
                            animatedStyle,
                            styles.animatedView,
                            {
                                borderBottomWidth: 12,
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
                {dragged && dragged.typeDeTouche == "FOLDER" &&
                    <Animated.View
                        style={[
                            animatedStyle,
                            styles.animatedView,
                            {
                                width: cellWidth,
                                height: cellHeight,
                            }
                        ]}
                    >
                        <FolderDeToucheView
                            folder={dragged}
                            width={1}
                            backgroundColor={theme.colors.surface}
                        />
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
            {
                selectedTab && <>
                    <ModalNative // DELETE TAB MODAL
                        open={deleteTabOpen}
                        close={() => setDeleteTabOpen(false)}
                        actions={[
                            { title: "Retour", icon: IconSVGCode.arrow_left, onPress: () => setDeleteTabOpen(false), variant: "neutral" },
                            { title: "Supprimer", icon: IconSVGCode.trash, onPress: () => { setDeleteTabOpen(false); deleteSelectedTab() }, variant: "danger" }
                        ]}
                    >
                        <Box flexDirection={"column"} alignItems={"center"} width={"100%"} marginTop={"l"}>
                            <CustomText>Supprimer l'onglet {selectedTab.name} ?</CustomText>
                            <CustomText>Celui ci contient {selectedTab.blueprint.length.toString()} produit(s)</CustomText>
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
                        <Box height={48} flex={1} />
                        <Button
                            outline
                            icon={IconSVGCode.trash}
                            variant="danger"
                            onPress={() => {
                                setEditTabOpen(false)
                                setDeleteTabOpen(true)
                            }}
                            title={"Supprimer l'onglet"}
                        />
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
                            <CustomText style={{ textAlign: "center" }}>Supprimer les {selectedTab.blueprint.length.toString()} produit(s) de l'onglet {selectedTab.name} ?</CustomText>
                            <CustomText style={{ textAlign: "center" }} color="danger">Attention, cette action est irréversible</CustomText>
                        </Box>
                    </ModalNative>
                </>
            }
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
            <ModalNative // CREATE FOLDER MODAL
                title="CRÉER UN DOSSIER"
                open={newFolderOpen}
                close={() => setNewFolderOpen(false)}
                actions={[
                    { title: "Retour", icon: IconSVGCode.arrow_left, onPress: () => setNewFolderOpen(false), variant: "neutral" },
                    { title: "Créer", icon: IconSVGCode.plus, onPress: () => { setNewFolderOpen(false); createNewFolder() }, variant: "success", disabled: folderName.length < 1 || folderColor.length != 7 }
                ]}
            >
                <TextFormRow handleChange={(e) => setFolderName(e)} title="Nom" value={folderName} />
                <ColorFormRow handleChange={(e) => setFolderColor(e)} title="Couleur" value={folderColor} />
                <IconFormRow handleChange={(e) => setFolderIcon(e as FoodSVGCode)} title="Icone" value={folderIcon} />
            </ModalNative>
            {
                selectedFolder && <>
                    <ModalNative // DELETE FOLDER MODAL
                        open={deleteFolderOpen}
                        close={() => setDeleteFolderOpen(false)}
                        actions={[
                            { title: "Retour", icon: IconSVGCode.arrow_left, onPress: () => setDeleteFolderOpen(false), variant: "neutral" },
                            { title: "Supprimer", icon: IconSVGCode.trash, onPress: () => { setDeleteFolderOpen(false); deleteSelectedFolder() }, variant: "danger" }
                        ]}
                    >
                        <Box flexDirection={"column"} alignItems={"center"} width={"100%"} marginTop={"l"}>
                            <CustomText>Supprimer le dossier {selectedFolder.name} ?</CustomText>
                            <CustomText>Celui ci contient {selectedFolder.content.length.toString()} produit(s)</CustomText>
                            <CustomText color="danger">Attention, cette action est irréversible</CustomText>
                        </Box>
                    </ModalNative>
                    <ModalNative // EDIT FOLDER MODAL
                        open={editFolderOpen}
                        close={() => setEditFolderOpen(false)}
                        actions={[
                            { title: "Retour", icon: IconSVGCode.arrow_left, onPress: () => setEditFolderOpen(false), variant: "neutral" },
                            { title: "Sauvegarder", icon: IconSVGCode.save, onPress: () => { setEditFolderOpen(false); editFolder() }, variant: "success" }
                        ]}
                    >
                        <TextFormRow handleChange={(e) => setFolderName(e)} title="Nom" value={folderName} />
                        <ColorFormRow handleChange={(e) => setFolderColor(e)} title="Couleur" value={folderColor} />
                        <IconFormRow handleChange={(e) => setFolderIcon(e as FoodSVGCode)} title="Icone" value={folderIcon} />
                        <Box height={48} flex={1} />
                        <Button
                            outline
                            icon={IconSVGCode.trash}
                            variant="danger"
                            onPress={() => {
                                setEditFolderOpen(false)
                                setDeleteFolderOpen(true)
                            }}
                            title={"Supprimer le dossier"}
                        />
                    </ModalNative>
                    <ModalNative // EMPTY FOLDER MODAL
                        open={emptyFolderOpen}
                        close={() => setEmptyFolderOpen(false)}
                        actions={[
                            { title: "Retour", icon: IconSVGCode.arrow_left, onPress: () => setEmptyFolderOpen(false), variant: "neutral" },
                            { title: "Vider", icon: IconSVGCode.xmark, onPress: () => { setEmptyFolderOpen(false); emptyFolder() }, variant: "danger" }
                        ]}
                    >
                        <Box justifyContent="center" alignItems="center" style={{ flex: 1, paddingVertical: theme.spacing.m, paddingHorizontal: theme.spacing.m }} >
                            <CustomText style={{ textAlign: "center" }}>Supprimer les {selectedFolder.content.length.toString()} produit(s) de l'onglet {selectedFolder.name} ?</CustomText>
                            <CustomText style={{ textAlign: "center" }} color="danger">Attention, cette action est irréversible</CustomText>
                        </Box>
                    </ModalNative>
                </>
            }
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
    queueHighlightTargetUnder: ({ absX, absY }: { absX: number, absY: number }) => any,
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
            //runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).activateAfterLongPress(delayLongPress).onStart((e) => {
            if (onLongPress) runOnJS(onLongPress)()
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            //runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).onUpdate((e) => {
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            //runOnJS(checkForScrollViewLimit)(e.absoluteY)
            //runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).onEnd((e) => {
            runOnJS(handleDrop)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        })

    if (onLongPress) {
        return (
            <GestureDetector gesture={fromListPan}>
                <Pressable style={{ width: cellWidth }} onPress={onPress ?? null} onPressIn={() => setIsPressed(true)} onPressOut={() => setIsPressed(false)} >
                    <Box height={72} justifyContent={'center'} padding={"xxs"} flex={1} borderRadius={4} borderBottomWidth={6} style={{ backgroundColor: isPressed ? chroma(theme.colors.primary).alpha(.1).hex() : chroma(product.color).alpha(.08).hex(), borderColor: product.color }} >
                        <CustomText font="A700" size={14} style={{ textAlign: "center", maxWidth: "100%" }}>{product.label}</CustomText>
                    </Box>
                </Pressable>
            </GestureDetector>
        )
    } else {
        return (
            <View style={{ width: cellWidth }}>
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
    queueHighlightTargetUnder: ({ absX, absY }: { absX: number, absY: number }) => any,
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
            //runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).activateAfterLongPress(delayLongPress).onStart((e) => {
            runOnJS(onLongPress)()
            runOnJS(setIsDragged)(true)
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            //runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).onUpdate((e) => {
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            runOnJS(checkForScrollViewLimit)(e.absoluteY)
            //runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
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
            animatedTop.value = withTiming(cell.layout.top, { easing: Easing.out(Easing.ease), })
            animatedLeft.value = withTiming(cell.layout.left, { easing: Easing.out(Easing.ease), })
            animatedHeight.value = cell.layout.height
            animatedWidth.value = cell.layout.width
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

const DraggablePlacedFolder = ({
    cell,
    folder,
    onLongPress,
    translateX,
    translateY,
    cellWidth,
    cellHeight,
    handleDrop,
    checkForScrollViewLimit,
    isLastDragged,
    setEditFolderOpen,
    setSelectedFolder,
    setSelectedFolderCell,
    setFolderIcon,
    setFolderName,
    setFolderColor
}: {
    cell: Cell,
    folder: FolderDeTouche,
    onLongPress: () => void,
    translateX: SharedValue<number>,
    translateY: SharedValue<number>,
    queueHighlightTargetUnder: ({ absX, absY }: { absX: number, absY: number }) => any,
    cellWidth: number,
    cellHeight: number,
    handleDrop: ({ absX, absY }: { absX: number, absY: number }) => void,
    checkForScrollViewLimit: (y: number) => void
    isLastDragged: boolean
    setEditFolderOpen: (value: boolean) => void
    setSelectedFolder: (folder: FolderDeTouche) => void
    setSelectedFolderCell: (cell: Cell) => void,
    setFolderIcon: (value: FoodSVGCode) => void,
    setFolderName: (value: string) => void,
    setFolderColor: (value: string) => void
}) => {
    const [isPressed, setIsPressed] = useState<boolean>(false)
    const [isDragged, setIsDragged] = useState<boolean>(false)
    const theme = useTheme<Theme>()

    const fromPlacedPan = Gesture.Pan()
        .onBegin((e) => {
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            //runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).activateAfterLongPress(delayLongPress).onStart((e) => {
            runOnJS(onLongPress)()
            runOnJS(setIsDragged)(true)
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            //runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
        }).onUpdate((e) => {
            translateY.value = e.absoluteY - fingerDodge
            translateX.value = e.absoluteX - .5 * cellWidth
            runOnJS(checkForScrollViewLimit)(e.absoluteY)
            //runOnJS(queueHighlightTargetUnder)({ absX: e.absoluteX - .5 * cellWidth, absY: e.absoluteY - fingerDodge })
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
            animatedTop.value = withTiming(cell.layout.top, { easing: Easing.out(Easing.ease), })
            animatedLeft.value = withTiming(cell.layout.left, { easing: Easing.out(Easing.ease), })
            animatedHeight.value = cell.layout.height
            animatedWidth.value = cell.layout.width
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
                        padding: theme.spacing.xxs,
                        borderRadius: 4,
                        width: cellWidth,
                        height: cellHeight,
                        justifyContent: "center",
                        alignItems: "center",
                        opacity: isDragged ? .5 : 1,
                        zIndex: isLastDragged ? 10000000 : 9000000,
                        ...cell.layout
                    }, animatedStyle]}
                >
                    <FolderDeToucheView
                        folder={folder}
                        backgroundColor={isPressed ? chroma(folder.color).alpha(.1).hex() : theme.colors.surface}
                        width={cell.coordinates.w}
                        onPressIn={() => setIsPressed(true)}
                        onPressOut={() => setIsPressed(false)}
                        onPress={() => {
                            setEditFolderOpen(true)
                            setSelectedFolder(folder)
                            setSelectedFolderCell(cell)
                            setFolderIcon(folder.icon)
                            setFolderName(folder.name)
                            setFolderColor(folder.color)
                        }}
                    />
                </Animated.View>
            </GestureDetector>
        </>
    )
}

const styles = StyleSheet.create({
    tab: {
        borderRadius: 4,
        flexDirection: "row",
        gap: 6,
        justifyContent: "flex-start",
        alignItems: "center",
        borderRightWidth: 8
    },
    addTab: {
        borderRadius: 4,
        flexDirection: "row",
        gap: 6,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    hr: {
        alignSelf: "center",
        width: "100%",
        margin: "auto",
        borderBottomWidth: 1,
    },
    animatedView: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000000000,
        top: 0,
        left: 0,
        borderRadius: 4
    }
})