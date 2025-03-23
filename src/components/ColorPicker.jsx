import { useMemo } from "react";
import { ColorGenerator } from "../utils/designUtils";

export const ColorPicker = ({ hue, onChange }) => {
  const hexColor = useMemo(() => {
    const [r, g, b] = ColorGenerator.hslToRgb(hue, 70, 50);
    return `#${ColorGenerator.rgbToHex(r, g, b).slice(1)}`;
  }, [hue]);

  const handleColorInput = (e) => {
    // Convert hex to HSL
    const hex = e.target.value.slice(1);
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;

    if (max !== min) {
      if (max === r) {
        h = (g - b) / (max - min);
      } else if (max === g) {
        h = 2 + (b - r) / (max - min);
      } else {
        h = 4 + (r - g) / (max - min);
      }
    }

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    onChange(h);
  };

  return (
    <div className="flex items-center">
      <input
        type="color"
        value={hexColor}
        onChange={handleColorInput}
        className="w-10 h-10 border-0"
      />
      <div className="ml-4 flex-1">
        <input
          type="range"
          min="0"
          max="359"
          value={hue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};
