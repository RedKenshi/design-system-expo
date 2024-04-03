import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ThemeProvider } from '@shopify/restyle';
import PALETTE from "./src/Palette"

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import Design from './src/pages/Design';
import Drawer from './src/components/Drawer';
import TopBar from './src/components/TopBar';
import { IconSVGCode } from './src/IconSVG';
import TextFormRow from './src/components/formRow/TextFormRow';
import InlineSelectFormRow from './src/components/formRow/InlineSelectFormRow';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ModalNative from './src/components/ModalNative';

import theme from "./src/Palette"
import Box from './src/components/Box';

SplashScreen.preventAutoHideAsync();

export default function App() {

  const [open, setOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState(null);
  const [paletteDark, setPaletteDark] = useState(true);
  const [openModalF, setOpenModalF] = useState(false);
  const [openModalS, setOpenModalS] = useState(false);

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

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ minHeight: "100%", width: "100%" }}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider style={{ backgroundColor: PALETTE.colors.background }}>
          <StatusBar style={paletteDark ? "light" : "dark"} />
          <TopBar setOpenMenu={setOpen} />
          <Drawer setOpenMenu={setOpen} open={open} />
          <ModalNative open={openModalF} setOpen={setOpenModalF} actions={[
            { variant: "danger", onPress: () => setOpenModalF(false), title: "No", icon: IconSVGCode.xmark },
            { variant: "primary", onPress: () => setOpenModalF(false), title: "Yes", icon: IconSVGCode.check }
          ]} >
            <TextFormRow value={"IS PRIMARY"} isActive handleChange={() => { }} title={"UN"} />
            <TextFormRow value={"IS SUCCESS"} isSuccess handleChange={() => { }} title={"DEUX"} />
            <TextFormRow value={"IS WARNING"} isWarning handleChange={() => { }} title={"TROIS"} />
            <TextFormRow value={"IS ERROR"} isError handleChange={() => { }} title={"QUATRE"} />
            <InlineSelectFormRow title="Size" handleChange={(e) => setSelectedSize(e)} selected={selectedSize} options={[
              { label: 'S', value: 1 },
              { label: 'M', value: 2 },
              { label: 'L', value: 3 }
            ]}
            />
            <InlineSelectFormRow title="Toppings" handleChange={(e) => setSelectedToppings(e)} selected={selectedToppings} options={[
              { label: 'Option 1', value: 1 },
              { label: 'Option 2', value: 2 }
            ]}
            />
            <TextFormRow value={"CINQ"} handleChange={() => { }} title={"CINQ"} />
            <TextFormRow value={"SIX"} handleChange={() => { }} title={"SIX"} />
            <TextFormRow value={""} handleChange={() => { }} title={"SEPT"} />
            <TextFormRow value={""} handleChange={() => { }} title={"HUIT"} />
            <TextFormRow value={""} handleChange={() => { }} title={"NEUF"} />
            <TextFormRow value={""} handleChange={() => { }} title={"DIX"} />
            <TextFormRow value={""} handleChange={() => { }} title={"ONZE"} />
            <TextFormRow value={""} handleChange={() => { }} title={"DOUZE"} />
          </ModalNative>
          <ModalNative open={openModalS} setOpen={setOpenModalS} actions={[
            { variant: "danger", onPress: () => setOpenModalS(false), title: "No", icon: IconSVGCode.xmark },
            { variant: "primary", onPress: () => setOpenModalS(false), title: "Yes", icon: IconSVGCode.check }
          ]} >
            <View style={{ flex: 1, paddingVertical: PALETTE.spacing.m, paddingHorizontal: PALETTE.spacing.m }} >
              <TextFormRow value={"IS PRIMARY"} handleChange={() => { }} title={"UN"} />
              <InlineSelectFormRow title="Size" handleChange={(e) => setSelectedSize(e)} selected={selectedSize} options={[
                { label: 'S', value: 1 },
                { label: 'M', value: 2 },
                { label: 'L', value: 3 }
              ]}
              />
            </View>
          </ModalNative>
          <ScrollView horizontal={false} automaticallyAdjustKeyboardInsets style={{ width: "100%" }} >
            <Box style={[styles.container]} onLayout={onLayoutRootView} >
              <Design setOpenModalF={setOpenModalF} setOpenModalS={setOpenModalS} />
            </Box>
          </ScrollView>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
});
