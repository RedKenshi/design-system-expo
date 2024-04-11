
import React, { useMemo } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Box from './Box';

interface Props {
    children: JSX.Element | JSX.Element[],
    style?: ViewStyle
}

export const Panel = (props: Props) => {

    const {
        children,
        style
    } = props;

    return (
        <Box
            backgroundColor='surface'
            marginVertical='s'
            paddingHorizontal={{ phone: 'm', tablet: 'xl' }}
            paddingVertical={{ phone: 'm', tablet: 'xl' }}
            borderRadius={{ phone: 8, tablet: 12 }}
            style={style}
        >
            {children}
        </Box>
    );
};

export default Panel;

const styles = StyleSheet.create({
    panel: {

    },
})