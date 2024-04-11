import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconSVG, IconSVGCode } from './IconSVG';
import PALETTE, { FONTS } from "../constants/Palette";

interface Props {
    text: string;
}

export const Tooltip: React.FC<Props> = ({
    text
}) => {

    return (
        <TouchableOpacity style={{ height: 16, width: 16, marginLeft: PALETTE.spacing.m }}>
            <IconSVG style={{ height: 16, width: 16 }} icon={IconSVGCode.infos} fill={PALETTE.colors.warning} size="small" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
});

export default Tooltip;