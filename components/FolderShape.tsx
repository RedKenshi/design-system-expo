
import { Circle, Path, Svg } from "react-native-svg";
import PALETTE, { Theme } from "../constants/Palette";
import { ColorValue, Text, View, ViewStyle } from "react-native";
import { useTheme } from "@shopify/restyle";
import { useMemo } from "react";
import { FolderDeTouche } from "../app/blueprint";
import chroma from "chroma-js"

type Props = {
    folder: FolderDeTouche,
    backgroundColor?: string,
    children: JSX.Element | JSX.Element[],
    style?: ViewStyle
};


export const FolderShape = ({ folder, backgroundColor, children, style }: Props) => {

    const theme = useTheme<Theme>();

    const folderTopColor = useMemo(() => chroma.mix("#fff", folder.color).hex(), [folder.color])

    const folderLeftSide = useMemo(() => {
        return (
            <Svg width="10" height="16" viewBox="0 0 10 16">
                <Path fillRule="evenodd" clipRule="evenodd" d="M8.00525 0H10V16H0V11.8364C0 3.06152 2.07056 0 8.00525 0Z" fill={folderTopColor} />
            </Svg>
        )
    }, [folder.color])

    const folderRightSide = useMemo(() => {
        return (
            <Svg width="24" height="17" viewBox="0 0 24 17">
                <Path fill-rule="evenodd" clip-rule="evenodd" d="M24 16.0335H0V0.0335693C2.99112 0.273251 5.16793 1.79251 7.05689 4.59135L10.1557 10.2031C11.1644 12.2209 13.5988 15.8149 16.3533 15.9424H24V16.0335Z" fill={folderTopColor} />
            </Svg>
        )
    }, [folder.color])

    return (
        <View style={{ flexDirection: "column", width: "100%", height: "100%" }}>
            <View style={{ height: 16, flexDirection: "row" }}>
                {folderLeftSide}
                <View style={{ width: "40%", backgroundColor: folderTopColor }}></View>
                {folderRightSide}
            </View>
            <View style={{
                backgroundColor,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 8,
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
                borderBottomWidth: 12,
                borderColor: folder.color,
                flex: 1
            }}>
                {children}
            </View>
        </View>
    )

}