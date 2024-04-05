import { useTheme } from "@shopify/restyle";
import { FONTS, Theme } from "../../Palette";
import Box from "../../components/Box";
import { Text } from "react-native";
import { Item as ItemType } from "../../contexts/DragAndDropContext";

type Props = {
    item: ItemType
}

const Item = ({ item }: Props) => {

    const theme = useTheme<Theme>();

    return (
        <Box
            style={[
                {
                    height: 64,
                    width: 64,
                    backgroundColor: item.color,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
            ]}
        >
            <Text style={{ fontSize: 28, lineHeight: 28, fontFamily: FONTS.A700, color: theme.colors.textOnPrimary }}>{item.label.toUpperCase()}</Text>
        </Box>
    )
}

export default Item