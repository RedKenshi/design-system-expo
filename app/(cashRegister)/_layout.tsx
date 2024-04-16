import { useContext, useEffect, useRef } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { Slot } from 'expo-router';

import { StatusBar } from 'expo-status-bar';

import TopBarMenu from '../../components/TopBarMenu';
import { AppContext } from '../../contexts/AppContext';
import TicketTopBar from '../../components/TicketTopBar';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../constants/Palette';
import { CashRegisterContext } from '../../contexts/CashRegisterContext';
import CustomText from '../../components/CustomText';
import Box from '../../components/Box';
import { numberToMoney } from '../../constants/utils';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector, PanGesture } from 'react-native-gesture-handler';
import Drawer from '../../components/Drawer';

const dishHeight = 24
const originalContainerHeight = 234;

export {
    ErrorBoundary,
} from 'expo-router';

const AppLayout = () => {

    const theme = useTheme<Theme>()
    const { darkMode } = useContext(AppContext)

    const expandedHeight = Math.floor(Dimensions.get('screen').height);

    const containerHeight = useSharedValue(originalContainerHeight)
    const ticketHeight = useSharedValue(originalContainerHeight)
    const dimmerColor = useSharedValue("#0000")
    const expanded = useSharedValue(false)

    const tap = Gesture.Pan().onTouchesUp(() => {
        expanded.value = true
        containerHeight.value = withTiming(expandedHeight, { duration: 200 })
        dimmerColor.value = withTiming("#0009", { duration: 300 })
        ticketHeight.value = withTiming(expandedHeight * .8, { duration: 200 })
    })
    const pan = Gesture.Pan().onStart(() => {
        containerHeight.value = withTiming(expandedHeight, { duration: 200 })
        dimmerColor.value = withTiming("#000b", { duration: 300 })
    }).onUpdate((e) => {
        ticketHeight.value = e.absoluteY > originalContainerHeight ? e.absoluteY : originalContainerHeight
    }).onEnd((e) => {
        if (expanded.value) {
            if (e.absoluteY < expandedHeight * .8 - 50) {
                expanded.value = false
                dimmerColor.value = withTiming("#0000", { duration: 200 })
                containerHeight.value = withTiming(originalContainerHeight, { duration: 200 })
                ticketHeight.value = withTiming(originalContainerHeight, { duration: 200 })
            } else {
                expanded.value = true
                containerHeight.value = withTiming(expandedHeight, { duration: 200 })
                dimmerColor.value = withTiming("#0009", { duration: 300 })
                ticketHeight.value = withTiming(expandedHeight * .8, { duration: 200 })
            }
        } else {
            if (e.absoluteY > originalContainerHeight + 50) {
                expanded.value = true
                containerHeight.value = withTiming(expandedHeight, { duration: 200 })
                dimmerColor.value = withTiming("#0009", { duration: 300 })
                ticketHeight.value = withTiming(expandedHeight * .8, { duration: 200 })
            } else {
                expanded.value = false
                dimmerColor.value = withTiming("#0000", { duration: 200 })
                containerHeight.value = withTiming(originalContainerHeight, { duration: 200 })
                ticketHeight.value = withTiming(originalContainerHeight, { duration: 200 })
            }
        }
    })

    const expandTicket = () => {
        containerHeight.value = withTiming(expandedHeight, { duration: 200 })
        dimmerColor.value = withTiming("#000b", { duration: 300 })
        ticketHeight.value = withTiming(expandedHeight * .8, { duration: 200 })
    }
    const collapseTicket = () => {
        dimmerColor.value = withTiming("#0000", { duration: 200 })
        containerHeight.value = withTiming(originalContainerHeight, { duration: 200 })
        ticketHeight.value = withTiming(originalContainerHeight, { duration: 200 })
    }

    const containerAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: containerHeight.value,
            position: "absolute",
            zIndex: 10000,
            top: 0,
            right: 0,
            left: 0
        };
    });
    const ticketAnimatedStyle = useAnimatedStyle(() => {
        return {
            minHeight: originalContainerHeight,
            height: ticketHeight.value,
            position: 'relative',
            zIndex: 100000
        };
    });
    const dimmerAnimatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: dimmerColor.value,
        };
    });

    return (
        <>
            <Animated.View style={containerAnimatedStyle}>
                <Animated.View style={ticketAnimatedStyle}>
                    <TicketTopBar style={{ flex: 1 }}>
                        <TopBarMenu />
                        <Box style={[styles.hr, { borderColor: theme.colors.offwhite }]} marginBottom={'m'} />
                        <GestureDetector gesture={tap}>
                            <CartItemList expanded={expanded} pan={pan} collapse={collapseTicket} expand={expandTicket} />
                        </GestureDetector>
                    </TicketTopBar>
                </Animated.View>
                <Animated.View style={[dimmerAnimatedStyle, { flex: 1, zIndex: 1000, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }]}>
                    <Pressable style={{ height: "100%", width: "100%" }} onPress={() => { collapseTicket() }}>
                    </Pressable>
                </Animated.View>
            </Animated.View>
            <StatusBar style={darkMode ? "light" : "dark"} />
            <Box style={{ marginTop: originalContainerHeight, flex: 1 }}>
                <Slot />
            </Box>
        </>
    );
}

export default AppLayout

const CartItemList = ({ collapse, expand, expanded, pan }: { collapse: Function, expand: Function, expanded: SharedValue<boolean>, pan: PanGesture }) => {

    const theme = useTheme<Theme>()
    const { cart, totalCartInclTax, removeFromCart } = useContext(CashRegisterContext)

    const list = useRef<FlatList>(null)

    useEffect(() => {
        if (!expanded) {
            list.current.scrollToEnd({ animated: true })
        }
    }, [expanded])

    const handlePress = (id) => {
        if (expanded.value) {
            removeFromCart(id, 1)
        } else {
            expand()
        }
    }

    return (
        <>
            <Drawer />
            <Box flex={1}>
                <Box flex={1} flexDirection={"column"} justifyContent={"space-between"} paddingHorizontal={"s"} >
                    <FlatList scrollEnabled={true} style={{ flex: 1 }}
                        getItemLayout={(data, index) => (
                            { length: 24, offset: 24 * index, index }
                        )}
                        ref={list}
                        data={cart}
                        onContentSizeChange={() => list.current.scrollToEnd({ animated: true })}
                        renderItem={({ item, index }) => {
                            return (
                                <Pressable onPress={() => handlePress(item.product.id)}>
                                    <Box flexDirection={"row"} height={24} justifyContent={"space-between"}>
                                        <CustomText font='A600' color='textFadded'>{`${item.quantity} x`}</CustomText>
                                        <CustomText font='A600' color='textOnSurface'>{`${item.product.label}`}</CustomText>
                                        <Box flex={1} />
                                        <CustomText font='A600' color='textFadded'>{`${numberToMoney(item.totalPriceInclTax)}`}</CustomText>
                                    </Box>
                                </Pressable>
                            )
                        }} ListEmptyComponent={() =>
                            <Box flex={1} justifyContent={"center"} alignItems={'center'}>
                                <CustomText>Panier Vide</CustomText>
                            </Box>
                        } />
                </Box>
                <GestureDetector gesture={pan}>
                    <Box marginTop={expanded ? "l" : null}>
                        <Box style={[styles.hr, { borderColor: theme.colors.offwhite }]} marginBottom={'m'} />
                        <View style={{ flexDirection: "row", height: 24, justifyContent: "space-between" }}>
                            <CustomText textAlign='right' font='A600' style={{ paddingHorizontal: theme.spacing.s }} color='textFadded'>{cart.length + " items"}</CustomText>
                            <CustomText textAlign='right' font='A600' style={{ paddingHorizontal: theme.spacing.s }} color='textFadded'>{numberToMoney(totalCartInclTax)}</CustomText>
                        </View>
                    </Box>
                </GestureDetector>
            </Box>
        </>
    )
}

const styles = StyleSheet.create({
    hr: {
        alignSelf: "center",
        width: "95%",
        margin: "auto",
        borderBottomWidth: 1,
    },
    container: {
        alignSelf: "stretch",
        minHeight: "100%",
        maxWidth: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
});
