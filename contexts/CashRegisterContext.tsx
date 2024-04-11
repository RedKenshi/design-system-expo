
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { CartItem, Product } from "../constants/types"

type CashRegisterContext = {
    cart: CartItem[],
    addToCart: (product: Product, quantity: number) => void,
    totalCartInclTax: number
}
type Props = {
    children: React.ReactNode
}

export const CashRegisterContext = createContext<CashRegisterContext>({
    cart: [],
    addToCart: (product: Product, quantity: number) => undefined,
    totalCartInclTax: undefined,
})

export const CashRegisterContextProvider = ({ children }: Props) => {

    const [cart, setCart] = useState<CartItem[]>([]);

    const totalCartInclTax = useMemo(() => {
        return cart.reduce((a, b) => a + b.totalPriceInclTax, 0)
    }, [cart])

    const addToCart = useCallback((newProduct: Product, quantity: number) => {
        let tmpCart: CartItem[] = JSON.parse(JSON.stringify(cart))
        //console.log({ tmpCart })
        const existingItemIndex = tmpCart.findIndex(item => item.product.id === newProduct.id);

        if (existingItemIndex !== -1) {
            // If the item already exists, increase its quantity
            tmpCart[existingItemIndex].quantity += quantity;
            tmpCart[existingItemIndex].totalPriceInclTax = tmpCart[existingItemIndex].quantity * tmpCart[existingItemIndex].product.priceExclTaxUnit
        } else {
            // If the item doesn't exist, add it to the cart
            tmpCart = [...tmpCart, { product: newProduct, quantity: quantity, totalPriceInclTax: newProduct.priceExclTaxUnit * quantity }];
        }
        setCart(tmpCart)
    }, [cart]);

    const values = {
        cart,
        addToCart,
        totalCartInclTax
    }

    return (
        <CashRegisterContext.Provider value={values}>
            {children}
        </CashRegisterContext.Provider>
    )
}