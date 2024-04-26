
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
        contentInnerStyle,
        titleIcon,
        titleOnPress,
        title
    } = props;

    const [layout, setLayout] = useState<LayoutRectangle | null>(null)

    const paddingHorizontal = useResponsiveProp({ phone: 'm', tablet: 'l' })
    const theme = useTheme<Theme>()

    return (
        <Box
            flex={1}
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
                paddingHorizontal={paddingHorizontal}
                paddingVertical={{ phone: 'm', tablet: 'l' }}
                style={contentInnerStyle}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Panel;