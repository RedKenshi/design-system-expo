
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Box from './Box';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../constants/Palette';

interface Props {
    children: JSX.Element | JSX.Element[],
    style?: ViewStyle
}

export const PageBlock = (props: Props) => {

    const {
        children,
        style
    } = props;

    const theme = useTheme<Theme>()

    return (
        <Box
            maxWidth={{ phone: '100%', tablet: '75%' }}
            style={{ ...styles.pageBlock, marginBottom: theme.spacing.l, ...style }}
        >
            {children}
        </Box>
    );
};

export default PageBlock;

const styles = StyleSheet.create({
    pageBlock: {
        //alignSelf: "center",
    },
})