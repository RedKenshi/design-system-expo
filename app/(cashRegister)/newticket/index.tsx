import { FlatList, ViewStyle, ScrollView } from "react-native"
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
import { Category, Product } from "../../../constants/types";

type Props = {}

export const NewTicket = ({ }: Props) => {

    const theme = useTheme<Theme>();
    const { addToCart, cart } = useContext(CashRegisterContext);
    const [widthAvailable, setWidthAvailable] = useState<number>(0)

    const [selectedCategory, setSelectedCategory] = useState<string | null>(card[0].id)

    const categoryOnScreen = 2.3;
    const categoryByColumn = 3;
    const productByRow = 3;
    const spacingCategory = theme.spacing.s;
    const spacingProduct = theme.spacing.s;
    const categoryHeight = 48;

    const categoryWidth = useMemo(() => {
        return (widthAvailable - (spacingCategory * ((categoryOnScreen) - 1))) / (categoryOnScreen)
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

    const groupedCategories = useMemo<Category[][]>(() => {
        const result = [];
        for (let i = 0; i < card.length; i += categoryByColumn) {
            result.push(card.slice(i, i + categoryByColumn));
        }
        return result;
    }, [card])

    const categories = useMemo(() => {
        return (
            <FlatList horizontal style={{ overflow: "visible", flex: 0 }} contentContainerStyle={{ gap: theme.spacing.s }} data={groupedCategories} renderItem={({ item, index }) => {
                return (
                    <Box flexDirection={"column"} gap={"s"} marginBottom={'l'}>
                        {item.map((cat, i) =>
                            <CategoryTile height={categoryHeight} onPress={(catId) => setSelectedCategory(cat.id)} selected={selectedCategory == cat.id} key={cat.id} style={{ width: categoryWidth }} category={cat} />
                        )}
                    </Box>
                )
            }} />
        )
    }, [groupedCategories, selectedCategory, categoryWidth])

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
            <PageBlock style={{ ...padding, alignItems: "center", width: "100%", flex: 1, justifyContent: "flex-start" }} >
                <Box onLayout={e => setWidthAvailable(e.nativeEvent.layout.width)} marginHorizontal={{ tablet: 'l' }} style={{ width: "100%", marginTop: theme.spacing.m, justifyContent: "flex-start" }} >
                    {categories}
                    {productsOfCategory}
                </Box>
            </PageBlock>
        </>
    )
}



export default NewTicket;