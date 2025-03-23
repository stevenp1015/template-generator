import { useState, useCallback, useEffect } from "react";
import {
  ColorGenerator,
  LayoutGenerator,
  TypographyGenerator,
  GraphicsGenerator,
} from "../utils/designUtils";

export const useTemplateGenerator = () => {
  const [template, setTemplate] = useState(null);
  const [styleOptions, setStyleOptions] = useState({
    style: "minimal",
    baseHue: 210,
    colorScheme: "monochromatic",
    typography: "Modern Sans",
    layout: "classic-document",
    seed: Math.random(),
  });

  // Generate a template based on current options
  const generateTemplate = useCallback(() => {
    // Create a new template using our design utils
    const newTemplate = {
      style: styleOptions.style,
      colors: ColorGenerator.generatePalette(
        styleOptions.baseHue,
        styleOptions.colorScheme
      ),
      typography: TypographyGenerator.generateTypographySystem(
        styleOptions.typography
      ),
      layout: (() => {
        const baseLayout =
          LayoutGenerator.gridLayouts.find(
            (l) => l.name === styleOptions.layout
          ) || LayoutGenerator.gridLayouts[0];
        return LayoutGenerator.generateLayoutVariation(baseLayout, 0.1);
      })(),
      decorativeElements: GraphicsGenerator.generateDecorativeElements(
        styleOptions.style,
        ColorGenerator.generatePalette(
          styleOptions.baseHue,
          styleOptions.colorScheme
        ),
        styleOptions.seed
      ),
      seed: styleOptions.seed,
    };

    setTemplate(newTemplate);
  }, [styleOptions]);

  // Randomize all options and generate
  const randomizeAll = useCallback(() => {
    setStyleOptions({
      style: ["corporate", "creative", "minimal", "abstract"][
        Math.floor(Math.random() * 4)
      ],
      baseHue: Math.floor(Math.random() * 360),
      colorScheme: [
        "monochromatic",
        "complementary",
        "analogous",
        "triadic",
        "split-complementary",
      ][Math.floor(Math.random() * 5)],
      typography:
        TypographyGenerator.fontPairings[
          Math.floor(Math.random() * TypographyGenerator.fontPairings.length)
        ].name,
      layout:
        LayoutGenerator.gridLayouts[
          Math.floor(Math.random() * LayoutGenerator.gridLayouts.length)
        ].name,
      seed: Math.random(),
    });
  }, []);

  // Generate template when options change
  useEffect(() => {
    generateTemplate();
  }, [styleOptions, generateTemplate]);

  return {
    template,
    styleOptions,
    setStyleOptions,
    generateTemplate,
    randomizeAll,
  };
};
