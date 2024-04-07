import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemeProvider } from '@shopify/restyle';
import { DARK_THEME, LIGHT_THEME } from "./src/Palette"

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Buttons } from './src/pages/Buttons';
import Drawer from './src/components/Drawer';
import TopBar from './src/components/TopBar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Box from './src/components/Box';
import Typos from './src/pages/Typos';
import Inputs from './src/pages/Inputs';
import Tickets from './src/pages/Tickets';
import Printer from './src/pages/Printer';
import Dnd from './src/pages/Dnd';
import { DnDProvider } from './src/contexts/DragAndDropContext';
export type Pages = 'button' | 'typo' | 'inputs' | 'ticket' | 'dnd' | 'printer';

SplashScreen.preventAutoHideAsync();

export default function App() {

  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [open, setOpen] = useState(false);
  const [paletteDark, setPaletteDark] = useState(true);
  const [page, setPage] = useState<Pages>('dnd')

  useEffect(() => {
    if (open) setPaletteDark(true)
  }, [open])

  const [fontsLoaded, fontError] = useFonts({
    'Axiforma-Thin': require("./assets/fonts/Axiforma Thin.otf"),
    'Axiforma-Thin-Italic': require("./assets/fonts/Axiforma Thin Italic.otf"),

    'Axiforma-Light': require("./assets/fonts/Axiforma Light.otf"),
    'Axiforma-Light-Italic': require("./assets/fonts/Axiforma Light Italic.otf"),

    'Axiforma-Book': require("./assets/fonts/Axiforma Book.otf"),
    'Axiforma-Book-Italic': require("./assets/fonts/Axiforma Book Italic.otf"),

    'Axiforma': require("./assets/fonts/Axiforma Regular.otf"),
    'Axiforma-Italic': require("./assets/fonts/Axiforma Italic.otf"),

    'Axiforma-Medium': require("./assets/fonts/Axiforma Medium.otf"),
    'Axiforma-Medium-Italic': require("./assets/fonts/Axiforma Medium Italic.otf"),

    'Axiforma-SemiBold': require("./assets/fonts/Axiforma SemiBold.otf"),
    'Axiforma-SemiBold-Italic': require("./assets/fonts/Axiforma SemiBold Italic.otf"),

    'Axiforma-Bold': require("./assets/fonts/Axiforma Bold.otf"),
    'Axiforma-Bold-Italic': require("./assets/fonts/Axiforma Bold Italic.otf"),

    'Axiforma-ExtraBold': require("./assets/fonts/Axiforma ExtraBold.otf"),
    'Axiforma-ExtraBold-Italic': require("./assets/fonts/Axiforma ExtraBold Italic.otf"),

    'Axiforma-Black': require("./assets/fonts/Axiforma Black.otf"),
    'Axiforma-Black-Italic': require("./assets/fonts/Axiforma Black Italic.otf"),

    'Axiforma-Heavy': require("./assets/fonts/Axiforma Heavy.otf"),
    'Axiforma-Heavy-Italic': require("./assets/fonts/Axiforma Heavy Italic.otf")
  });

  const getButtonPage = () => {
    return (
      <ScrollView horizontal={false} scrollEnabled={true} automaticallyAdjustKeyboardInsets style={[{ width: "100%", height: '100%' }]} >
        <Box style={[styles.container]} onLayout={onLayoutRootView} backgroundColor='background'>
          <Buttons />
        </Box>
      </ScrollView>
    )
  }
  const getTypoPage = () => {
    return (
      <ScrollView horizontal={false} scrollEnabled={true} automaticallyAdjustKeyboardInsets style={[{ width: "100%", height: '100%' }]} >
        <Box style={[styles.container]} onLayout={onLayoutRootView} backgroundColor='background'>
          <Typos />
        </Box>
      </ScrollView>
    )
  }
  const getInputsPage = () => {
    return (
      <ScrollView horizontal={false} scrollEnabled={true} automaticallyAdjustKeyboardInsets style={[{ width: "100%", height: '100%' }]} >
        <Box style={[styles.container]} onLayout={onLayoutRootView} backgroundColor='background'>
          <Inputs />
        </Box>
      </ScrollView>
    )
  }
  const getTicketPage = () => {
    return (
      <ScrollView horizontal={false} scrollEnabled={true} automaticallyAdjustKeyboardInsets style={[{ width: "100%", height: '100%' }]} >
        <Box style={[styles.container]} onLayout={onLayoutRootView} backgroundColor='background'>
          <Tickets />
        </Box>
      </ScrollView>
    )
  }
  const getDndPage = () => {
    return (
      <ScrollView horizontal={false} scrollEnabled={false} automaticallyAdjustKeyboardInsets style={[{ width: "100%", height: '100%' }]} contentContainerStyle={{ height: '100%' }} >
        <Box style={[styles.container, { height: '100%' }]} onLayout={onLayoutRootView} backgroundColor='background'>
          <Dnd />
        </Box>
      </ScrollView>
    )
  }
  const getPrinterPage = () => {
    return (
      <ScrollView horizontal={false} scrollEnabled={true} automaticallyAdjustKeyboardInsets style={[{ width: "100%", height: '100%' }]} >
        <Box style={[styles.container, { height: '100%' }]} onLayout={onLayoutRootView} backgroundColor='background'>
          <Printer />
        </Box>
      </ScrollView>
    )
  }

  const pageBody = useMemo(() => {
    switch (page) {
      case 'button':
        return getButtonPage()
      case 'typo':
        return getTypoPage()
      case 'inputs':
        return getInputsPage()
      case 'ticket':
        return getTicketPage()
      case 'dnd':
        return getDndPage()
      case 'printer':
        return getPrinterPage()
    }
  }, [page])

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    onLayoutRootView()
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ minHeight: "100%", width: "100%" }}>
      <DnDProvider>
        <ThemeProvider theme={darkMode ? DARK_THEME : LIGHT_THEME}>
          <SafeAreaProvider style={StyleSheet.absoluteFill}>
            <StatusBar style={paletteDark ? "light" : "dark"} />
            <TopBar setOpenMenu={setOpen} />
            <Drawer setPage={setPage} page={page} darkMode={darkMode} setDarkMode={setDarkMode} setOpenMenu={setOpen} open={open} />
            {pageBody}
          </SafeAreaProvider>
        </ThemeProvider>
      </DnDProvider>
    </GestureHandlerRootView>
  );
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
