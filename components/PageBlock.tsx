
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Box from './Box';
import { useResponsiveProp, useTheme } from '@shopify/restyle';
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

    const isTablet = useResponsiveProp({ phone: 0, tablet: 1 })

    const tmp = isTablet ? { marginHorizontal: "12.5%" } : null

    return (
        <Box
            maxWidth={{ phone: '100%', tablet: '75%' }}
            style={{ marginBottom: theme.spacing.l, ...style, ...tmp }}
        >
            {children}
        </Box>
    );
};

export default PageBlock;