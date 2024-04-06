import { useTheme } from "@shopify/restyle";
import { FONTS, Theme } from "../../Palette";
import Box from "../../components/Box";
import { Text } from "react-native";
import { Item as ItemType } from "../../contexts/DragAndDropContext";
import { IconSVG } from "../../IconSVG";

type Props = {
    item: ItemType
}

const Item = ({ item }: Props) => {

    const theme = useTheme<Theme>();

    return (
        <Box
            backgroundColor={'background'}
            style={[
                {
                    height: 80,
                    width: 112,
                    gap: 8,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: "column"
                },
            ]}
        >
            <IconSVG icon={item.icon} fill={item.color} size="huge" />
            <Text style={{ fontSize: 22, lineHeight: 22, fontFamily: FONTS.A700, color: theme.colors.fullThemeInverse }}>{item.label.toUpperCase()}</Text>
        </Box>
    )
}

export default Item