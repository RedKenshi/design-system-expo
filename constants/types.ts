interface Price {
    isEnabled: boolean;

    amount: number;

    tax: {
        name: string;
        taxRate: number;
    };
}

interface PriceAmount {
    isEnabled: boolean;

    amount: number;
}

interface MenuPrice {
    menuStepIds: string[];
    basePrice: PriceAmount;
}

interface CashRegisterItemsConfiguration {
    name: string;
    isEnabled: boolean;
    merchantId: string;
    visibility: {
        isEnabled: boolean;
        startTime: string;
        endTime: string;
        recurring: {
            days: number;
        };
        nonRecurring: {
            startDate: string;
            endDate: string;
        };
    };
    items: {
        menus: {
            menuId: string;
            menuName: string;
            description: string;
            image: string;
            prices: MenuPrice[];
        }[];
        categories: {
            categoryId: string;
            categoryName: string;
            description: string;
            image: string;
            products: {
                productId: string;
                productName: string;
                description: string;
                image: string;
                price: Price;
            }[];
        }[];
        products: {
            productId: string;
            productName: string;
            description: string;
            image: string;
            price: Price;
        }[];
        productGroups: {
            productGroupId: string;
            productGroupName: string;
            description: string;
            image: string;
        }[];
    };
} //CARTE

interface CashRegisterLayoutItem {
    type: "MENU" | "CATEGORY" | "PRODUCT" | "PRODUCT_GROUP";
    name: string;
    resourceId: string;
    icon: string;
    color: string;
    isLinkedToResource: boolean;
    resource: any;
}

interface ActionButton {
    type: "NEXT_TICKET_STEP" | "SEND_TICKET_STEP";
    name: string;
    icon: string;
    color: string;
    isEditable: boolean;
    actions: ActionButton[];
} // ACTION CONFIGURABLE DND

/**
 * S 1 x 2
 * M 2 x 2
 * L 2 *x 4 or 4 x 2
 */
interface CashRegisterLayout {
    name: string;
    isEnabled: boolean;
    merchantId: string;
    deviceTypes: ("DESKTOP" | "TABLET" | "MOBILE")[];
    visibility: {
        isEnabled: boolean;
        startTime: string;
        endTime: string;
        recurring: {
            days: number;
        };
        nonRecurring: {
            startDate: string;
            endDate: string;
        };
    };
    layout: {
        type: "MENU" | "CATEGORY" | "PRODUCT" | "PRODUCT_GROUP" | "EMPTY";
        size: "S" | "M" | "L";
        orientation: "HORIZONTAL" | "VERTICAL"; // only  available for L
        x: number;
        y: number;
        item: CashRegisterLayoutItem;
    }[]; // TODO unbound array
    shortCutButtons: {
        name: string;
        icon: string;
        color: string;
        type:
        | "FAVORITE_PRODUCTS"
        | "LIQUID_PRODUCTS"
        | "SOLID_PRODUCTS"
        | "LIQUID_SOLID_PRODUCTS";
    }[];
    actionButtons: {
        orde: ActionButton[];
        payment: ActionButton[];
    };
}// PLAN DE TOUCHE

export type Category = {
    id: string;
    name: string;
    products: Product[];
}
export interface CartItem {
    quantity: number
    product: Product
    totalPriceInclTax: number
}
export type Product = {
    id: string
    label: string;
    priceExclTaxUnit: number;
    VAT: number;
}