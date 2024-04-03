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
                activeThumbColor={PALETTE.colors.toggleTrue}
                trackColor={{ true: PALETTE.colors.toggleTrueTrack, false: PALETTE.colors.danger }}
                thumbColor={value ? PALETTE.colors.toggleTrue : PALETTE.colors.toggleFalse}
                ios_backgroundColor={value ? PALETTE.colors.toggleTrueTrack : PALETTE.colors.toggleFalseTrack}
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