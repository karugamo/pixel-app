import React from "react";
import styled from "styled-components";
import { useCurrentColor } from "./state";

// https://lospec.com/palette-list/pastel-qt
const colors = [
  "#cb8175",
  "#e2a97e",
  "#f0cf8e",
  "#f6edcd",
  "#a8c8a6",
  "#6d8d8a",
  "#655057",
  "#000000",
];

export default function ColorPalette() {
  const [currentColor, setCurrentColor] = useCurrentColor();
  return (
    <Colors>
      {colors.map((color) => (
        <Color
          key={color}
          color={color}
          selected={color === currentColor}
          onClick={() => setCurrentColor(color)}
        />
      ))}
    </Colors>
  );
}

const Colors = styled.div`
  display: flex;
  flex-direction: row;
`;

const Color = styled.div<{ selected: boolean }>`
  width: 25px;
  height: 25px;
  border: 2px solid ${(b) => (b.selected ? "black" : b.color)};
  background-color: ${(b) => b.color};
`;
