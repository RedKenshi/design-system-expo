import { useTheme } from "@shopify/restyle";
import { FONTS, Theme } from "../../Palette";
import Box from "../../components/Box";
import { Text } from "react-native";
import chroma from 'chroma-js'
import { Place as PlaceType } from "../../contexts/DragAndDropContext";

type Props = {
    place: PlaceType
}

const Place = ({ place }: Props) => {

    const theme = useTheme<Theme>();

    return (
        <Box
            style={[
                {
                    height: 80,
                    width: 96,
                    backgroundColor: chroma(theme.colors.primary).alpha(.25).hex(),
                    borderColor: theme.colors.primary,
                    borderStyle: "dashed",
                    borderWidth: 2,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            ]}
        >
            <Box style={{}}>
                <Text style={{ fontSize: 28, fontFamily: FONTS.A700, color: theme.colors.textOnPrimary }}>{place.label.toUpperCase()}</Text>
            </Box>
        </Box>
    )
}

export default Place