import { useContext, useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { ThemeProvider } from '@shopify/restyle';

import { DnDProvider } from '../contexts/DragAndDropContext';
import { AppContext, AppContextProvider } from '../contexts/AppContext';

import { LIGHT_THEME, DARK_THEME } from '../constants/Palette';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Drawer from '../components/Drawer';
import { CashRegisterContextProvider } from '../contexts/CashRegisterContext';

export {
    ErrorBoundary,
} from 'expo-router';

const RootLayout = () => {

    const [fontsLoaded, fontsError] = useFonts({
        'Axiforma-Thin': require("../assets/fonts/Axiforma Thin.otf"),
        'Axiforma-Thin-Italic': require("../assets/fonts/Axiforma Thin Italic.otf"),

        'Axiforma-Light': require("../assets/fonts/Axiforma Light.otf"),
        'Axiforma-Light-Italic': require("../assets/fonts/Axiforma Light Italic.otf"),

        'Axiforma-Book': require("../assets/fonts/Axiforma Book.otf"),
        'Axiforma-Book-Italic': require("../assets/fonts/Axiforma Book Italic.otf"),

        'Axiforma': require("../assets/fonts/Axiforma Regular.otf"),
        'Axiforma-Italic': require("../assets/fonts/Axiforma Italic.otf"),

        'Axiforma-Medium': require("../assets/fonts/Axiforma Medium.otf"),
        'Axiforma-Medium-Italic': require("../assets/fonts/Axiforma Medium Italic.otf"),

        'Axiforma-SemiBold': require("../assets/fonts/Axiforma SemiBold.otf"),
        'Axiforma-SemiBold-Italic': require("../assets/fonts/Axiforma SemiBold Italic.otf"),

        'Axiforma-Bold': require("../assets/fonts/Axiforma Bold.otf"),
        'Axiforma-Bold-Italic': require("../assets/fonts/Axiforma Bold Italic.otf"),

        'Axiforma-ExtraBold': require("../assets/fonts/Axiforma ExtraBold.otf"),
        'Axiforma-ExtraBold-Italic': require("../assets/fonts/Axiforma ExtraBold Italic.otf"),

        'Axiforma-Black': require("../assets/fonts/Axiforma Black.otf"),
        'Axiforma-Black-Italic': require("../assets/fonts/Axiforma Black Italic.otf"),

        'Axiforma-Heavy': require("../assets/fonts/Axiforma Heavy.otf"),
        'Axiforma-Heavy-Italic': require("../assets/fonts/Axiforma Heavy Italic.otf")
    });

    useEffect(() => {
        if (fontsError) throw fontsError;
    }, [fontsError]);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded || fontsError) {
        return null;
    }


    return (
        <AppContextProvider>
            <DnDProvider>
                <RootLayoutNav />
            </DnDProvider>
        </AppContextProvider>

    );
}

export default RootLayout

const RootLayoutNav = () => {
    const { darkMode } = useContext(AppContext)

    return (
        <CashRegisterContextProvider>
            <ThemeProvider theme={darkMode ? DARK_THEME : LIGHT_THEME}>
                <SafeAreaProvider style={[StyleSheet.absoluteFill, { backgroundColor: darkMode ? DARK_THEME.colors.background : LIGHT_THEME.colors.background }]}>
                    <GestureHandlerRootView style={{ minHeight: "100%", width: "100%" }}>
                        <Slot />
                    </GestureHandlerRootView>
                </SafeAreaProvider>
            </ThemeProvider>
        </CashRegisterContextProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "stretch",
        minHeight: "100%",
        maxWidth: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
});
