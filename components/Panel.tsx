
import React, { useState } from 'react';
import { LayoutRectangle, Pressable, View, ViewStyle } from 'react-native';
import Box from './Box';
import { useResponsiveProp, useTheme } from '@shopify/restyle';
import { Theme } from '../constants/Palette';
import Header from './Header';
import { IconSVG, IconSVGCode } from './IconSVG';

interface Props {
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
            {title && layout &&
                <View style={{}}>
                    <Pressable style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: theme.spacing.m, padding: theme.spacing.s }} disabled={!titleOnPress} onPress={() => titleOnPress && titleOnPress()}>
                        {titleIcon &&
                            <IconSVG icon={titleIcon} fill={'primary'} size='normal' />
                        }
                        <Header margin={0} style={{ marginTop: 4, marginLeft: titleIcon ? 8 : 0 }} size={4} variant="primary">{title}</Header>
                    </Pressable>
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