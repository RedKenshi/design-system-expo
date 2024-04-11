import { useContext } from 'react';
import { FlatList, ScrollView, StyleSheet, Text } from 'react-native';

import { Slot } from 'expo-router';

import { StatusBar } from 'expo-status-bar';

import TopBarMenu from '../../components/TopBarMenu';
import { AppContext } from '../../contexts/AppContext';
import TicketTopBar from '../../components/TicketTopBar';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../constants/Palette';
import { CashRegisterContext, CashRegisterContextProvider } from '../../contexts/CashRegisterContext';
import CustomText from '../../components/CustomText';
import Box from '../../components/Box';
import { numberToMoney } from '../../constants/utils';

export {
    ErrorBoundary,
} from 'expo-router';

const AppLayout = () => {

    const theme = useTheme<Theme>()
    const { darkMode } = useContext(AppContext)

    return (
        <CashRegisterContextProvider>
            <TicketTopBar>
                <TopBarMenu />
                <Box style={[styles.hr, { borderColor: theme.colors.offwhite }]} marginBottom={'m'} />
                <CartItemList />
            </TicketTopBar>
            <StatusBar style={darkMode ? "light" : "dark"} />
            <ScrollView >
                <Slot />
            </ScrollView>
        </CashRegisterContextProvider>

    );
}

export default AppLayout

const CartItemList = () => {

    const theme = useTheme<Theme>()
    const { cart, totalCartInclTax } = useContext(CashRegisterContext)

    return (
        <Box flexDirection={"column"} justifyContent={"space-between"} paddingHorizontal={"l"}>
            <FlatList data={cart} style={{ marginBottom: theme.spacing.l, maxHeight: 96 }} renderItem={({ item, index }) => {
                return (
                    <Box flexDirection={"row"} height={24} justifyContent={"space-between"}>
                        <CustomText font='A600' color='textFadded'>{`${item.quantity} x ${item.product.label}`}</CustomText>
                        <CustomText font='A600' color='textFadded'>{`${numberToMoney(item.totalPriceInclTax)}`}</CustomText>
                    </Box>
                )
            }} ListEmptyComponent={() =>
                <Box flex={1} justifyContent={"center"} alignItems={'center'}>
                    <CustomText>Panier Vide</CustomText>
                </Box>
            } />
            <CustomText textAlign='right' font='A600' color='textFadded'>{numberToMoney(totalCartInclTax)}</CustomText>
        </Box>
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
