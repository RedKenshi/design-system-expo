import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { Theme } from "../../Palette";
import { useTheme } from '@shopify/restyle';

interface Props {
    value: boolean
    handleChange: (value: boolean) => void
}

export const Toggle: React.FC<Props> = ({
    value,
    handleChange
}) => {

    const theme = useTheme<Theme>();

    return (
        <View style={styles.container}>
            <Switch
                activeThumbColor={theme.colors.toggleTrue}
                trackColor={{ true: theme.colors.toggleTrueTrack, false: theme.colors.toggleFalseTrack }}
                thumbColor={value ? theme.colors.toggleTrue : theme.colors.toggleFalse}
                ios_backgroundColor={value ? theme.colors.toggleTrueTrack : theme.colors.toggleFalseTrack}
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