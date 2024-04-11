import { FlatList, ViewStyle } from "react-native"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from "../../../constants/Palette"

import Box from "../../../components/Box"
import PageBlock from "../../../components/PageBlock"
import { useTheme } from "@shopify/restyle"
import { useContext, useMemo, useState } from "react";

import card from '../../../constants/fakeCard.json'
import CategoryTile from "../../../components/checkout/CategoryTile";
import ProductTile from "../../../components/checkout/ProductTile";
import { CashRegisterContext } from "../../../contexts/CashRegisterContext";
import { Product } from "../../../constants/types";

type Props = {}

export const NewTicket = ({ }: Props) => {

    const theme = useTheme<Theme>();
    const { addToCart, cart } = useContext(CashRegisterContext);
    const [widthAvailable, setWidthAvailable] = useState<number>(0)

    const [selectedCategory, setSelectedCategory] = useState<string | null>(card[0].id)

    const categoryByRow = 2;
    const productByRow = 3;
    const spacingCategory = theme.spacing.m;
    const spacingProduct = theme.spacing.s;

    const categoryWidth = useMemo(() => {
        return (widthAvailable - (spacingCategory * (categoryByRow - 1))) / categoryByRow
    }, [widthAvailable, spacingCategory]);
    const productWidth = useMemo(() => {
        return (widthAvailable - (spacingProduct * (productByRow - 1))) / productByRow
    }, [widthAvailable, spacingProduct]);

    const insets = useSafeAreaInsets();

    const padding = {
        paddingLeft: insets.left + theme.spacing.m,
        paddingRight: insets.right + theme.spacing.m,
    } as ViewStyle

    const handlePress = (product: Product) => {
        addToCart(product, 1)
    }

    const categories = useMemo(() => {
        return (
            <FlatList columnWrapperStyle={{ gap: spacingCategory }} contentContainerStyle={{ gap: spacingCategory }} numColumns={categoryByRow} data={card} renderItem={({ item, index }) => {
                return <CategoryTile onPress={(catId) => setSelectedCategory(catId)} selected={selectedCategory == item.id} key={item.id} style={{ width: categoryWidth }} category={item} />
            }} />
        )
    }, [card, selectedCategory, categoryWidth])

    const productsOfCategory = useMemo(() => {
        if (selectedCategory == null) return <></>
        return (
            <FlatList columnWrapperStyle={{ gap: spacingProduct }} contentContainerStyle={{ gap: spacingProduct }} numColumns={productByRow} data={card.find(c => c.id == selectedCategory).products} renderItem={({ item, index }) => {
                return <ProductTile onPress={(e) => handlePress(item)} key={index} style={{ width: productWidth }} product={item} />
            }} />
        )
    }, [card, selectedCategory, productWidth, cart])

    return (
        <>
            <PageBlock style={{ ...padding, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: 'row', width: "100%" }} >
                <Box onLayout={e => setWidthAvailable(e.nativeEvent.layout.width)} marginHorizontal={{ tablet: 'l' }} justifyContent="space-evenly" style={{ width: "100%", paddingTop: theme.spacing.m, gap: theme.spacing.m, paddingBottom: "50%" }} >
                    {categories}
                    {productsOfCategory}
                </Box>
            </PageBlock>
        </>
    )
}



export default NewTicket;