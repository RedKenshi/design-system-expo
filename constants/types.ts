import { ButtonVariant } from "../components/Button";
import { FoodSVGCode } from "../components/FoodSVG";
import { IconSVGCode } from "../components/IconSVG";

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
 * L 2 x 4 or 4 x 2
 */
interface CashRegisterLayout {
    name: string;
    description: string;
    isDeleted: boolean;
    isEnabled: boolean;
    merchantId: string;
    deviceType: "DESKTOP" | "TABLET" | "MOBILE";
    cashRegisterItemsConfiguration: CashRegisterItemsConfiguration;
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
    // If no layout defined for selected resource, then display in order of appearance
    layouts: {
        menus: CashRegisterItemLayout[]; // TODO unbound array
        categories: CashRegisterItemLayout[]; // TODO unbound array
        productGroups: CashRegisterItemLayout[]; // TODO unbound array
    };
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
        order: ActionButton[];
        payment: ActionButton[];
    };
}

interface CashRegisterItemLayout {
    resourceId: string;
    name: string;
    color: string;
    layout: {
        size: "S" | "M" | "L";
        orientation: "HORIZONTAL" | "VERTICAL"; // only  available for L
        x: number;
        y: number;
        item: CashRegisterLayoutItem;
    }[]; // TODO unbound array
}

export type Category = {
    id: string;
    name: string;
    products: Product[];
    icon: FoodSVGCode,
    color: string;
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
    color: string;
}
export type RegisterAbsoluteLayout = {
    id: string
    layout: { width: number, height: number, pageX: number, pageY: number }
}

export type ModalAction = {
    variant: ButtonVariant
    title: string
    icon?: IconSVGCode
    onPress: Function,
    disabled?: boolean
}