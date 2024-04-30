
import React, { useState } from 'react';
import { LayoutRectangle, View, ViewStyle } from 'react-native';
import Box from './Box';
import { useResponsiveProp, useTheme } from '@shopify/restyle';
import { Theme } from '../constants/Palette';
import { IconSVG, IconSVGCode } from './IconSVG';

interface Props {
    header?: JSX.Element,
    children: JSX.Element | JSX.Element[],
    style?: ViewStyle,
    unpadded?: boolean,
    contentInnerStyle?: ViewStyle,
    title?: string,
    titleOnPress?: () => void,
    titleIcon?: IconSVGCode
}

export const Panel = (props: Props) => {

    const {
        children,
        header,
        style,
        unpadded = false,
        contentInnerStyle,
        titleIcon,
        titleOnPress,
        title
    } = props;

    const [layout, setLayout] = useState<LayoutRectangle | null>(null)

    const theme = useTheme<Theme>()

    const innerPadding = useResponsiveProp({ phone: 's', tablet: 'l' })

    return (
        <Box
            overflow={"hidden"}
            onLayout={e => setLayout(e.nativeEvent.layout)}
            backgroundColor='surface'
            borderRadius={{ phone: 8, tablet: 12 }}
            style={style}
        >
            {header &&
                <View style={{}}>
                    {header}
                    <View style={{
                        borderColor: theme.colors.textFadded,
                        borderBottomWidth: 1
                    }} />
                </View>
            }
            <Box
                flex={1}
                padding={!unpadded && innerPadding}
                style={contentInnerStyle}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Panel;