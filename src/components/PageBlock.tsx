
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Box from './Box';

interface Props {
    children: JSX.Element | JSX.Element[],
    style?: ViewStyle
}

export const PageBlock = (props: Props) => {

    const {
        children,
        style
    } = props;

    return (
        <Box
            maxWidth={{ phone: '100%', tablet: '75%' }}
            style={{ ...styles.pageBlock, ...style }}
        >
            {children}
        </Box>
    );
};

export default PageBlock;

const styles = StyleSheet.create({
    pageBlock: {
        alignSelf: "center"
    },
})