// src/utils/designUtils.js
// This contains all the utility functions for generating design elements

// Color generation utility
export const ColorGenerator = {
  // Convert HSL to RGB
  hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  },

  // Convert RGB to Hex
  rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  },

  // Generate a palette based on color theory
  generatePalette(baseHue, scheme) {
    const palette = [];

    // Base color at 50% saturation, 50% lightness
    const [r, g, b] = this.hslToRgb(baseHue, 70, 50);
    const baseColor = this.rgbToHex(r, g, b);
    palette.push(baseColor);

    // Generate additional colors based on color theory
    switch (scheme) {
      case "monochromatic":
        // Add lighter and darker versions of the base color
        palette.push(this.rgbToHex(...this.hslToRgb(baseHue, 60, 70))); // Lighter
        palette.push(this.rgbToHex(...this.hslToRgb(baseHue, 80, 30))); // Darker
        palette.push("#ffffff"); // White for background
        palette.push("#333333"); // Dark gray for text
        break;

      case "complementary":
        // Add the complementary color (opposite on the color wheel)
        const complementaryHue = (baseHue + 180) % 360;
        palette.push(this.rgbToHex(...this.hslToRgb(complementaryHue, 70, 50)));
        palette.push(this.rgbToHex(...this.hslToRgb(baseHue, 50, 80))); // Light version of base
        palette.push("#ffffff");
        palette.push("#333333");
        break;

      case "analogous":
        // Add colors adjacent to the base color on the color wheel
        palette.push(
          this.rgbToHex(...this.hslToRgb((baseHue + 30) % 360, 70, 50))
        );
        palette.push(
          this.rgbToHex(...this.hslToRgb((baseHue - 30) % 360, 70, 50))
        );
        palette.push("#ffffff");
        palette.push("#333333");
        break;

      case "triadic":
        // Add colors at 120° intervals around the color wheel
        palette.push(
          this.rgbToHex(...this.hslToRgb((baseHue + 120) % 360, 70, 50))
        );
        palette.push(
          this.rgbToHex(...this.hslToRgb((baseHue + 240) % 360, 70, 50))
        );
        palette.push("#ffffff");
        palette.push("#333333");
        break;

      case "split-complementary":
        // Add colors adjacent to the complementary color
        const complement = (baseHue + 180) % 360;
        palette.push(
          this.rgbToHex(...this.hslToRgb((complement + 30) % 360, 70, 50))
        );
        palette.push(
          this.rgbToHex(...this.hslToRgb((complement - 30) % 360, 70, 50))
        );
        palette.push("#ffffff");
        palette.push("#333333");
        break;

      default:
        // Default to monochromatic if scheme is not recognized
        palette.push(this.rgbToHex(...this.hslToRgb(baseHue, 60, 70)));
        palette.push(this.rgbToHex(...this.hslToRgb(baseHue, 80, 30)));
        palette.push("#ffffff");
        palette.push("#333333");
    }

    return palette;
  },
};

// Typography generation utility
export const TypographyGenerator = {
  fontPairings: [
    {
      name: "Classic Serif/Sans",
      fontFamily: {
        heading: "'Georgia', serif",
        body: "'Arial', sans-serif",
      },
      characterization: "Traditional and balanced",
    },
    {
      name: "Modern Sans",
      fontFamily: {
        heading: "'Montserrat', sans-serif",
        body: "'Open Sans', sans-serif",
      },
      characterization: "Clean and contemporary",
    },
    {
      name: "Corporate Professional",
      fontFamily: {
        heading: "'Roboto', sans-serif",
        body: "'Roboto', sans-serif",
      },
      characterization: "Consistent and professional",
    },
    {
      name: "Elegant Contrast",
      fontFamily: {
        heading: "'Playfair Display', serif",
        body: "'Raleway', sans-serif",
      },
      characterization: "Sophisticated and refined",
    },
    {
      name: "Creative Modern",
      fontFamily: {
        heading: "'Poppins', sans-serif",
        body: "'Work Sans', sans-serif",
      },
      characterization: "Fresh and creative",
    },
    {
      name: "Technical Clarity",
      fontFamily: {
        heading: "'Source Sans Pro', sans-serif",
        body: "'Source Sans Pro', sans-serif",
      },
      characterization: "Clear and technical",
    },
    {
      name: "Friendly Professional",
      fontFamily: {
        heading: "'Nunito', sans-serif",
        body: "'Lato', sans-serif",
      },
      characterization: "Approachable and professional",
    },
  ],

  // Generate a complete typography system
  generateTypographySystem(pairingName) {
    const pairing =
      this.fontPairings.find((p) => p.name === pairingName) ||
      this.fontPairings[0];

    return {
      fontFamily: pairing.fontFamily,
      characterization: pairing.characterization,
      fontSizes: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        "2xl": 24,
        "3xl": 30,
        "4xl": 36,
        "5xl": 48,
      },
      fontWeights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeights: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
      },
    };
  },
};

// Layout generation utility
export const LayoutGenerator = {
  gridLayouts: [
    {
      name: "classic-document",
      sections: [
        { id: "header", type: "header", x: 0, y: 0, width: 100, height: 15 },
        {
          id: "main-content",
          type: "content",
          x: 0,
          y: 15,
          width: 100,
          height: 75,
        },
        { id: "footer", type: "footer", x: 0, y: 90, width: 100, height: 10 },
      ],
    },
    {
      name: "modern-split",
      sections: [
        { id: "header", type: "header", x: 0, y: 0, width: 100, height: 10 },
        { id: "sidebar", type: "sidebar", x: 0, y: 10, width: 25, height: 80 },
        {
          id: "main-content",
          type: "content",
          x: 25,
          y: 10,
          width: 75,
          height: 80,
        },
        { id: "footer", type: "footer", x: 0, y: 90, width: 100, height: 10 },
      ],
    },
    {
      name: "asymmetric",
      sections: [
        { id: "header", type: "header", x: 0, y: 0, width: 100, height: 15 },
        { id: "sidebar", type: "sidebar", x: 70, y: 15, width: 30, height: 75 },
        {
          id: "main-content",
          type: "content",
          x: 0,
          y: 15,
          width: 70,
          height: 75,
        },
        { id: "footer", type: "footer", x: 0, y: 90, width: 100, height: 10 },
      ],
    },
    {
      name: "presentation",
      sections: [
        { id: "header", type: "header", x: 0, y: 0, width: 100, height: 20 },
        {
          id: "main-content",
          type: "content",
          x: 10,
          y: 25,
          width: 80,
          height: 60,
        },
        { id: "footer", type: "footer", x: 0, y: 90, width: 100, height: 10 },
      ],
    },
    {
      name: "infographic",
      sections: [
        { id: "header", type: "header", x: 0, y: 0, width: 100, height: 15 },
        {
          id: "section-1",
          type: "content",
          x: 0,
          y: 15,
          width: 100,
          height: 25,
        },
        {
          id: "section-2",
          type: "content",
          x: 0,
          y: 40,
          width: 50,
          height: 25,
        },
        {
          id: "section-3",
          type: "content",
          x: 50,
          y: 40,
          width: 50,
          height: 25,
        },
        { id: "footer", type: "footer", x: 0, y: 65, width: 100, height: 35 },
      ],
    },
  ],

  // Generate subtle variations in the layout
  generateLayoutVariation(baseLayout, variationFactor = 0.1) {
    // Clone the base layout to avoid modifying the original
    const layout = JSON.parse(JSON.stringify(baseLayout));

    // Apply small random variations to section positions and sizes
    layout.sections = layout.sections.map((section) => {
      // Don't vary too much - just add a little randomness
      const variation = (max) =>
        (Math.random() * max * 2 - max) * variationFactor;

      // Make sure dimensions stay within reasonable bounds
      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

      // Apply variations
      const varied = {
        ...section,
        x: clamp(section.x + variation(5), 0, 100 - section.width),
        y: clamp(section.y + variation(5), 0, 100 - section.height),
        width: clamp(
          section.width + variation(5),
          section.width * 0.9,
          section.width * 1.1
        ),
        height: clamp(
          section.height + variation(5),
          section.height * 0.9,
          section.height * 1.1
        ),
      };

      return varied;
    });

    return layout;
  },
};

// Graphics generation utility
export const GraphicsGenerator = {
  // Generate decorative SVG elements based on style
  generateDecorativeElements(style, colors, seed = Math.random()) {
    // Use the seed for consistent randomness
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const elements = [];

    switch (style) {
      case "corporate":
        // Generate corporate-style elements: lines, squares, etc.
        elements.push({
          name: "corporate-lines",
          svg: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="50" x2="100" y2="50" stroke="${
                    colors[0]
                  }" stroke-width="2" />
                  <line x1="0" y1="60" x2="80" y2="60" stroke="${
                    colors[1] || colors[0]
                  }" stroke-width="2" />
                  <line x1="0" y1="70" x2="60" y2="70" stroke="${
                    colors[2] || colors[0]
                  }" stroke-width="2" />
                </svg>`,
        });
        elements.push({
          name: "corporate-square",
          svg: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="10" width="80" height="80" fill="none" stroke="${
                    colors[0]
                  }" stroke-width="2" />
                  <rect x="25" y="25" width="50" height="50" fill="none" stroke="${
                    colors[1] || colors[0]
                  }" stroke-width="1" />
                </svg>`,
        });
        break;

      case "creative":
        // Generate creative-style elements: curves, circles, etc.
        elements.push({
          name: "creative-circles",
          svg: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="${
                    colors[0]
                  }" stroke-width="2" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="${
                    colors[1] || colors[0]
                  }" stroke-width="1.5" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="${
                    colors[2] || colors[0]
                  }" stroke-width="1" />
                </svg>`,
        });
        elements.push({
          name: "creative-wave",
          svg: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="${
                    colors[0]
                  }" stroke-width="2" />
                  <path d="M0,60 Q25,40 50,60 T100,60" fill="none" stroke="${
                    colors[1] || colors[0]
                  }" stroke-width="1.5" />
                </svg>`,
        });
        break;

      case "minimal":
        // Generate minimal-style elements: single lines, dots, etc.
        elements.push({
          name: "minimal-line",
          svg: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <line x1="20" y1="50" x2="80" y2="50" stroke="${colors[0]}" stroke-width="1" />
                </svg>`,
        });
        elements.push({
          name: "minimal-dot",
          svg: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="5" fill="${colors[0]}" />
                </svg>`,
        });
        break;

      case "abstract":
        // Generate abstract-style elements: irregular shapes, etc.
        elements.push({
          name: "abstract-shape",
          svg: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="10,10 90,30 50,90 10,50" fill="none" stroke="${colors[0]}" stroke-width="2" />
                </svg>`,
        });
        elements.push({
          name: "abstract-lines",
          svg: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <line x1="20" y1="20" x2="80" y2="80" stroke="${
                    colors[0]
                  }" stroke-width="2" />
                  <line x1="20" y1="80" x2="80" y2="20" stroke="${
                    colors[1] || colors[0]
                  }" stroke-width="2" />
                </svg>`,
        });
        break;

      default:
        // Default to minimal style
        elements.push({
          name: "default-element",
          svg: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="30" fill="none" stroke="${colors[0]}" stroke-width="1" />
                </svg>`,
        });
    }

    return elements;
  },
};
