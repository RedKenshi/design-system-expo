import { createTheme } from "@shopify/restyle"

export const FONTS = {
    A100: "Axiforma-Thin",
    A100_I: "Axiforma-Thin-Italic",
    A200: "Axiforma-Light",
    A200_I: "Axiforma-Light-Italic",
    A300: "Axiforma-Book",
    A300_I: "Axiforma-Book-Italic",
    A400: "Axiforma",
    A400_I: "Axiforma-Italic",
    A500: "Axiforma-Medium",
    A500_I: "Axiforma-Medium-Italic",
    A600: "Axiforma-SemiBold",
    A600_I: "Axiforma-SemiBold-Italic",
    A700: "Axiforma-Bold",
    A700_I: "Axiforma-Bold-Italic",
    A800: "Axiforma-ExtraBold",
    A800_I: "Axiforma-ExtraBold-Italic",
    A900: "Axiforma-Black",
    A900_I: "Axiforma-Black-Italic",
    A950: "Axiforma-Heavy",
    A950_I: "Axiforma-Heavy-Italic",
}
//COLORS
const primary = {
    '50': '#edf7ff',
    '100': '#d7ebff',
    '200': '#b9deff',
    '300': '#88caff',
    '400': '#50acff',
    '500': '#2888ff',
    '600': '#0e66ff',// ORIGINAL FROM DESIGN SYSTEM
    '700': '#0a51eb',
    '800': '#0f41be',
    '900': '#133c95',
    '950': '#11265a',
}
const info = {
    '50': '#edf3ff',
    '100': '#dee7ff',
    '200': '#c4d2ff',
    '300': '#a1b5ff',
    '400': '#7b8cfe',
    '500': '#5c65f8',
    '600': '#4c49ee',// ORIGINAL FROM DESIGN SYSTEM
    '700': '#3731d1',
    '800': '#2d2aa9',
    '900': '#2a2a85',
    '950': '#1a194d',
}
const success = {
    '50': '#edfcf4',
    '100': '#d3f8e2',
    '200': '#aaf0cb',
    '300': '#59dd9f',// ORIGINAL FROM DESIGN SYSTEM
    '400': '#3acd8c',
    '500': '#17b274',
    '600': '#0b905d',
    '700': '#09734d',
    '800': '#095c3e',
    '900': '#094b35',
    '950': '#042a1e',
}
const warning = {
    '50': '#fff9eb',
    '100': '#ffeec6',
    '200': '#ffda88',
    '300': '#ffc149',// ORIGINAL FROM DESIGN SYSTEM
    '400': '#ffa920',
    '500': '#f98507',
    '600': '#dd6002',
    '700': '#b74006',
    '800': '#94310c',
    '900': '#7a290d',
    '950': '#461302',
}
const danger = {
    '50': '#fdf2f6',
    '100': '#fbe8f0',
    '200': '#f9d1e2',
    '300': '#f6abc9',
    '400': '#ef77a5',
    '500': '#e64d83',// ORIGINAL FROM DESIGN SYSTEM
    '600': '#d52d60',
    '700': '#b81e48',
    '800': '#981c3d',
    '900': '#7f1c36',
    '950': '#4d0a1c',
}
const palettes = {
    primary: primary,
    success: success,
    warning: warning,
    danger: danger,
}
const lightColors = {

    //ELEMENTS COLORS
    background: "#F2F2F7",
    surface: "#FFFFFF",
    item: "#ececec",
    fullTheme: "#FFFFFF",
    fullThemeInverse: "#000000",

    primary: primary["500"],
    disabled: "#474053",

    //TEXTS COLORS
    textOnBackground: "#5D6165",
    textOnSurface: "#00045C",
    textOnPanel: "#5D6165",
    textOnFullTheme: "#333",
    textOnFullThemeInverse: "#ddd",

    textOnPrimary: "#FFFFFF",
    textOnSecondary: "#FFFFFF",
    textOnDisabled: "#A3A3A3",
    textLegend: "#acadb4",

    textBold: "#000000",

    //THEMATICS COLORS
    info: info["500"],
    success: success["400"],
    warning: warning["300"],
    danger: danger["500"],

    //ELEMENTS COLORS
    toggleTrueTrack: primary["200"],
    toggleFalseTrack: danger["200"],
    toggleTrue: primary["500"],
    toggleFalse: danger["500"],

    //STATUS COLORS
    fullblack: "#000000",
    fullwhite: "#ffffff",
    white: "#ecf0f1",
    offwhite: "#d5dbdb",
    olive: "#C4E538",
    orange: "#F79F1F",
    yellow: "#F7C604",
    green: "#30D587",
    emerald: "#1C8E4C",
    sky: "#B8ECFF",
    blue: "#27B5FF",
    sapphire: "#0983F3",
    marine: "#174B82",
    red: "#E74C3C",
    grey: "#BCBCBC",
    fuel: "#464255"
}
const darkColors = {

    //ELEMENTS COLORS
    background: "#0c0c0e",
    surface: "#202022",
    item: "#0c0c0e",
    fullTheme: "#000000",
    fullThemeInverse: "#ffffff",

    primary: primary["500"],
    disabled: "#39393D",

    //TEXTS COLORS
    textOnBackground: "#72777B",
    textOnSurface: "#FFFFFF",
    textOnPanel: "#5D6165",
    textOnFullTheme: "#ddd",
    textOnFullThemeInverse: "#333",
    textLegend: "#83858d",

    textOnPrimary: "#FFFFFF",
    textOnSecondary: "#FFFFFF",
    textOnDisabled: "#1E1E20",

    textBold: "#FFFFFF",

    //THEMATICS COLORS
    info: info["500"],
    success: success["400"],
    warning: warning["300"],
    danger: danger["600"],

    //ELEMENTS COLORS
    toggleTrueTrack: primary["900"],
    toggleFalseTrack: danger["950"],
    toggleTrue: primary["500"],
    toggleFalse: danger["500"],

    //STATUS COLORS
    fullblack: "#000000",
    fullwhite: "#ffffff",
    white: "#ecf0f1",
    offwhite: "#95a5a6",
    olive: "#C4E538",
    orange: "#F79F1F",
    yellow: "#F7C604",
    green: "#30D587",
    emerald: "#1C8E4C",
    sky: "#B8ECFF",
    blue: "#27B5FF",
    sapphire: "#0983F3",
    marine: "#174B82",
    red: "#E74C3C",
    grey: "#BCBCBC",
    fuel: "#464255"
}

//SPACINGS
const spacing = {
    'xxs': 2,
    'xs': 4,
    's': 8,
    'm': 12,
    'l': 16,
    'xl': 24,
    'xxl': 32,
}
const breakpoints = {
    phone: 0,
    longPhone: {
        width: 0,
        height: 812,
    },
    tablet: 768,
    largeTablet: 1024,
}
const shadow = {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
}

// TEXTS
const textVariants = {
    default: {
        fontSize: 16,
        lineHeight: 19,
        fontFamily: FONTS.A400,
        textAlign: "justify",
        margin: spacing.xs
    },
    legend: {
        fontSize: 13,
        lineHeight: 17,
        fontFamily: FONTS.A600_I,
        textAlign: "justify",
        paddingHorizontal: spacing.s
    },
    h1: {
        fontSize: 28,
        letterSpacing: 1.2,
        fontFamily: FONTS.A500,
    },
    h2: {
        fontSize: 24,
        letterSpacing: 1.3,
        fontFamily: FONTS.A500,
    },
    h3: {
        fontSize: 20,
        letterSpacing: 1.4,
        fontFamily: FONTS.A600,
    },
    h4: {
        fontSize: 16,
        lsetterSpacing: 1.6,
        fontFamily: FONTS.A700,
    },
    h5: {
        fontSize: 14,
        letterSpacing: 1.8,
        fontFamily: FONTS.A800,
    },
}

//RESTYLE THEME CREATION AND THEME EXPORT 
const LIGHT_THEME = createTheme({
    spacing,
    palettes,
    shadow,
    textVariants,
    breakpoints,
    colors: lightColors
})
const DARK_THEME = createTheme({
    spacing,
    palettes,
    shadow,
    textVariants,
    breakpoints,
    colors: darkColors
})

export type Theme = typeof LIGHT_THEME;
export default LIGHT_THEME;


export const FieldSizes = {
    width: {
        phone: 168,
        tablet: 192,
        largeTablet: 240
    },
    height: {
        phone: 48,
        tablet: 48,
        largeTablet: 48
    },
    labelHeight: {
        phone: 22,
        tablet: 22,
        largeTablet: 22
    },
}