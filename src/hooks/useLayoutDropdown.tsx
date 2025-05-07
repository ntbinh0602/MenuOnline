import React, {useEffect, useMemo, useState} from 'react';
import {Dimensions, I18nManager} from 'react-native';
import {calculateDropdownHeight} from '../utils/calculateDropdownHeight';

const {height} = Dimensions.get('window');

interface Layout {
  w: number;
  h: number;
  px: number;
  py: number;
}

interface Style {
  [key: string]: any;
  width?: number;
  height?: number;
  left?: number;
  right?: number;
}

export const useLayoutDropdown = (
  data: any[] | undefined,
  dropdownStyle: Style = {},
  rowStyle: Style = {},
) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [buttonLayout, setButtonLayout] = useState<Layout | null>(null);
  const [dropdownPX, setDropdownPX] = useState<number>(0);
  const [dropdownPY, setDropdownPY] = useState<number>(0);
  const [dropdownHEIGHT, setDropdownHEIGHT] = useState<number>(() => {
    return calculateDropdownHeight(dropdownStyle, rowStyle, data?.length || 0);
  });
  const [dropdownWIDTH, setDropdownWIDTH] = useState<number>(0);

  useEffect(() => {
    setDropdownHEIGHT(
      calculateDropdownHeight(dropdownStyle, rowStyle, data?.length || 0),
    );
  }, [dropdownStyle, rowStyle, data]);

  const onDropdownButtonLayout = (
    w: number,
    h: number,
    px: number,
    py: number,
  ) => {
    setButtonLayout({w, h, px, py});

    if (height - 18 < py + h + dropdownHEIGHT) {
      setDropdownPX(px);
      setDropdownPY(py - 2 - dropdownHEIGHT);
    } else {
      setDropdownPX(px);
      setDropdownPY(py + h + 2);
    }

    setDropdownWIDTH(dropdownStyle?.width || w);
  };

  const dropdownWindowStyle = useMemo(() => {
    const top = dropdownPY;
    return {
      borderTopWidth: 0,
      overflow: 'hidden',
      ...dropdownStyle,
      position: 'absolute' as const,
      top: top,
      height: dropdownHEIGHT,
      width: dropdownWIDTH,
      ...(I18nManager.isRTL
        ? {right: dropdownStyle?.right ?? dropdownPX}
        : {left: (dropdownStyle?.left ?? dropdownPX) + 20 - dropdownWIDTH}),
    };
  }, [dropdownStyle, dropdownPX, dropdownPY, dropdownHEIGHT, dropdownWIDTH]);

  const onRequestClose = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    setIsVisible,
    buttonLayout,
    onDropdownButtonLayout,
    dropdownWindowStyle,
    onRequestClose,
  };
};
