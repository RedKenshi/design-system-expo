import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { router, Slot } from 'expo-router';

import TopBar from '../../components/TopBar';
import TopBarMenu from '../../components/TopBarMenu';
import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import Button from '../../components/Button';
import { IconSVGCode } from '../../components/IconSVG';
import Drawer from '../../components/Drawer';

export {
    ErrorBoundary,
} from 'expo-router';

const AppLayout = () => {

    const { darkMode } = useContext(AppContext)

    return (
        <>
            <Drawer />
            <TopBar>
                <TopBarMenu />
            </TopBar>
            <StatusBar style={darkMode ? "light" : "dark"} />
            <SafeAreaView >
                <ScrollView contentContainerStyle={{ height: "80%" }} >
                    <Slot />
                    <View style={{ position: 'absolute', bottom: 24, right: 24 }}>
                        <Button variant='info' size='l' style={{ borderRadius: 999 }} icon={IconSVGCode.ticket} onPress={() => router.navigate(`/newticket`)} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>

    );
}

export default AppLayout

const styles = StyleSheet.create({
    container: {
        alignSelf: "stretch",
        minHeight: "100%",
        maxWidth: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
});
