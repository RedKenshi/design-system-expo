
import { Circle, Path, Svg } from "react-native-svg";
import PALETTE, { Theme } from "../constants/Palette";
import { ColorValue, Pressable, Text, View, ViewStyle } from "react-native";
import { useResponsiveProp, useTheme } from "@shopify/restyle";
import { useMemo } from "react";
import { FolderDeTouche as FolderDeToucheType } from "../app/blueprint";
import chroma from "chroma-js"
import Box from "./Box";
import { FolderShape } from "./FolderShape";
import CustomText from "./CustomText";
import { FoodSVG, FoodSVGCode } from "./FoodSVG";


type Props = {
    width: number,
    onPressIn?: () => void,
    onPressOut?: () => void,
    onPress?: () => void,
    folder: FolderDeToucheType,
    backgroundColor?: string,
    style?: ViewStyle,
};


export const FolderDeToucheView = ({ width, folder, backgroundColor, style, onPress, onPressIn, onPressOut }: Props) => {

    const theme = useTheme<Theme>();
    const isTablet = useResponsiveProp({ phone: 0, tablet: 1 })

    const textSize = useMemo(() => {
        const iconFactor = folder.icon && isTablet ? 2 : 0
        if (folder.name.length > 40) {
            return width == 1 ? 14 - iconFactor : 18 - iconFactor
        }
        if (folder.name.length > 20) {
            return width == 1 ? 17 - iconFactor : 21 - iconFactor
        }
        if (folder.name.length > 10) {
            return width == 1 ? 20 - iconFactor : 24 - iconFactor
        }
    }, [folder.name, folder.icon, width])

    return (
        <FolderShape folder={folder} backgroundColor={backgroundColor} style={style}>
            <Pressable style={{ height: "100%", width: "100%", padding: theme.spacing.xs }} onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
                {folder.icon && folder.icon != FoodSVGCode.none ?
                    isTablet ?
                        <Box
                            flex={1}
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <FoodSVG icon={folder.icon} size="bigger" fill={folder.color} />
                            <CustomText font="A800" size={textSize} lineHeight={textSize} style={{ textAlign: "center", width: "100%", textAlignVertical: "center" }}>{folder.name}</CustomText>
                        </Box>
                        :
                        <Box
                            flex={1}
                            justifyContent={"center"}
                            alignItems={"stretch"}
                        >
                            <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, opacity: .3, justifyContent: "center", alignItems: "center" }}>
                                <FoodSVG icon={folder.icon} size="huge" fill={folder.color} />
                            </View>
                            <CustomText font="A800" size={textSize} lineHeight={textSize} style={{ textAlign: "center", width: "100%", textAlignVertical: "center" }}>{folder.name}</CustomText>
                        </Box>
                    :
                    <Box
                        flex={1}
                        justifyContent={"center"}
                        alignItems={"stretch"}
                    >
                        <CustomText font="A700" size={textSize} lineHeight={textSize} style={{ textAlign: "center", width: "100%", textAlignVertical: "center" }}>{folder.name}</CustomText>
                    </Box>
                }
            </Pressable>
        </FolderShape>
    )

}