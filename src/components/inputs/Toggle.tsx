import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import PALETTE, { FONTS } from "../../Palette";
import chroma from "chroma-js"

interface Props {
    value: boolean
    handleChange: (value: boolean) => void
}

export const Toggle: React.FC<Props> = ({
    value,
    handleChange
}) => {

    return (
        <View style={styles.container}>
            <Switch
                trackColor={{ false: PALETTE.fullTheme, true: chroma(PALETTE.primary).darken(1.5).saturate(2).hex() }}
                thumbColor={value ? PALETTE.palettes.primary[400] : chroma(PALETTE.palettes.primary[300]).set("hsl.s", .4).hex()}
                ios_backgroundColor={PALETTE.fullTheme}
                onValueChange={handleChange}
                value={value}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Toggle;