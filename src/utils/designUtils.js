// src/utils/designUtils.js
// A comprehensive set of utilities for generating design elements

// =================================================================
// COLOR GENERATOR
// =================================================================

export class ColorGenerator {
  // Convert HSL to RGB
  static hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r, g, b;

    if (0 <= h && h < 60) {
      [r, g, b] = [c, x, 0];
    } else if (60 <= h && h < 120) {
      [r, g, b] = [x, c, 0];
    } else if (120 <= h && h < 180) {
      [r, g, b] = [0, c, x];
    } else if (180 <= h && h < 240) {
      [r, g, b] = [0, x, c];
    } else if (240 <= h && h < 300) {
      [r, g, b] = [x, 0, c];
    } else if (300 <= h && h < 360) {
      [r, g, b] = [c, 0, x];
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
  }

  // Convert RGB to HEX
  static rgbToHex(r, g, b) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  }

  // Generate a color palette based on a base hue and color scheme
  static generatePalette(baseHue, scheme, count = 5) {
    // Normalize hue to 0-359
    baseHue = ((baseHue % 360) + 360) % 360;

    switch (scheme) {
      case "monochromatic":
        return this.generateMonochromatic(baseHue, count);
      case "complementary":
        return this.generateComplementary(baseHue, count);
      case "analogous":
        return this.generateAnalogous(baseHue, count);
      case "triadic":
        return this.generateTriadic(baseHue, count);
      case "split-complementary":
        return this.generateSplitComplementary(baseHue, count);
      default:
        return this.generateMonochromatic(baseHue, count);
    }
  }

  // Generate a monochromatic color scheme
  static generateMonochromatic(baseHue, count = 5) {
    const colors = [];
    const saturation = 70; // Base saturation

    // Generate colors with varying lightness
    for (let i = 0; i < count; i++) {
      // Distribute lightness values from light to dark (85% to 25%)
      const lightness = 85 - i * (60 / (count - 1));
      const [r, g, b] = this.hslToRgb(baseHue, saturation, lightness);
      colors.push(this.rgbToHex(r, g, b));
    }

    return colors;
  }

  // Generate complementary colors (opposite on the color wheel)
  static generateComplementary(baseHue, count = 5) {
    const colors = [];
    const complementaryHue = (baseHue + 180) % 360;

    // Add the base color
    const [r1, g1, b1] = this.hslToRgb(baseHue, 70, 60);
    colors.push(this.rgbToHex(r1, g1, b1));

    // Add a lighter version of the base color
    const [r2, g2, b2] = this.hslToRgb(baseHue, 60, 75);
    colors.push(this.rgbToHex(r2, g2, b2));

    // Add the complementary color
    const [r3, g3, b3] = this.hslToRgb(complementaryHue, 70, 60);
    colors.push(this.rgbToHex(r3, g3, b3));

    // Add a lighter version of the complementary color
    const [r4, g4, b4] = this.hslToRgb(complementaryHue, 60, 75);
    colors.push(this.rgbToHex(r4, g4, b4));

    // Add a neutral color
    const [r5, g5, b5] = this.hslToRgb(baseHue, 15, 90);
    colors.push(this.rgbToHex(r5, g5, b5));

    return colors;
  }

  // Generate analogous colors (adjacent on the color wheel)
  static generateAnalogous(baseHue, count = 5) {
    const colors = [];
    const hueStep = 30;

    for (let i = 0; i < count; i++) {
      // Distribute hues around the base hue (-2*hueStep to +2*hueStep)
      const hue = (baseHue + hueStep * (i - Math.floor(count / 2))) % 360;
      const saturation = 70 - Math.abs(i - Math.floor(count / 2)) * 10;
      const lightness = 60 - Math.abs(i - Math.floor(count / 2)) * 5;

      const [r, g, b] = this.hslToRgb(hue, saturation, lightness);
      colors.push(this.rgbToHex(r, g, b));
    }

    return colors;
  }

  // Generate triadic colors (three equally spaced colors on the wheel)
  static generateTriadic(baseHue, count = 5) {
    const colors = [];
    const triad1 = baseHue;
    const triad2 = (baseHue + 120) % 360;
    const triad3 = (baseHue + 240) % 360;

    // Base color
    const [r1, g1, b1] = this.hslToRgb(triad1, 70, 60);
    colors.push(this.rgbToHex(r1, g1, b1));

    // Second triadic color
    const [r2, g2, b2] = this.hslToRgb(triad2, 70, 60);
    colors.push(this.rgbToHex(r2, g2, b2));

    // Third triadic color
    const [r3, g3, b3] = this.hslToRgb(triad3, 70, 60);
    colors.push(this.rgbToHex(r3, g3, b3));

    // Add lighter and darker versions to fill out the palette
    const [r4, g4, b4] = this.hslToRgb(triad1, 50, 80);
    colors.push(this.rgbToHex(r4, g4, b4));

    const [r5, g5, b5] = this.hslToRgb(triad1, 30, 95);
    colors.push(this.rgbToHex(r5, g5, b5));

    return colors;
  }

  // Generate split-complementary scheme
  static generateSplitComplementary(baseHue, count = 5) {
    const colors = [];
    const complementaryHue = (baseHue + 180) % 360;
    const split1 = (complementaryHue - 30 + 360) % 360;
    const split2 = (complementaryHue + 30) % 360;

    // Base color
    const [r1, g1, b1] = this.hslToRgb(baseHue, 70, 60);
    colors.push(this.rgbToHex(r1, g1, b1));

    // First split color
    const [r2, g2, b2] = this.hslToRgb(split1, 70, 60);
    colors.push(this.rgbToHex(r2, g2, b2));

    // Second split color
    const [r3, g3, b3] = this.hslToRgb(split2, 70, 60);
    colors.push(this.rgbToHex(r3, g3, b3));

    // Lighter version of base color
    const [r4, g4, b4] = this.hslToRgb(baseHue, 50, 80);
    colors.push(this.rgbToHex(r4, g4, b4));

    // Neutral color
    const [r5, g5, b5] = this.hslToRgb(baseHue, 20, 95);
    colors.push(this.rgbToHex(r5, g5, b5));

    return colors;
  }

  // Generate a random color palette based on style
  static generateStyleBasedPalette(style) {
    const baseHue = Math.floor(Math.random() * 360);

    switch (style) {
      case "corporate":
        // Corporate palettes often use blues, grays, with muted colors
        return this.generatePalette((baseHue + 210) % 360, "monochromatic");
      case "creative":
        // Creative styles often use vibrant complementary or triadic schemes
        return this.generatePalette(baseHue, "triadic");
      case "minimal":
        // Minimal styles often have subtle analogous colors
        return this.generatePalette(baseHue, "analogous");
      case "abstract":
        // Abstract styles can use bold split-complementary
        return this.generatePalette(baseHue, "split-complementary");
      default:
        return this.generatePalette(baseHue, "monochromatic");
    }
  }
}

// =================================================================
// TYPOGRAPHY GENERATOR
// =================================================================

export class TypographyGenerator {
  // Font pairings (heading/body combinations)
  static fontPairings = [
    {
      name: "Classic Serif/Sans",
      heading: "'Georgia', serif",
      body: "'Arial', sans-serif",
      characterization: "Traditional, balanced contrast",
    },
    {
      name: "Modern Sans",
      heading: "'Montserrat', sans-serif",
      body: "'Open Sans', sans-serif",
      characterization: "Clean, contemporary",
    },
    {
      name: "Corporate Professional",
      heading: "'Helvetica Neue', sans-serif",
      body: "'Roboto', sans-serif",
      characterization: "Sleek, professional, reliable",
    },
    {
      name: "Elegant Contrast",
      heading: "'Playfair Display', serif",
      body: "'Source Sans Pro', sans-serif",
      characterization: "Sophisticated, dramatic contrast",
    },
    {
      name: "Creative Modern",
      heading: "'Poppins', sans-serif",
      body: "'Work Sans', sans-serif",
      characterization: "Fresh, contemporary, innovative",
    },
    {
      name: "Technical Clarity",
      heading: "'IBM Plex Sans', sans-serif",
      body: "'IBM Plex Serif', serif",
      characterization: "Precise, logical, technical",
    },
    {
      name: "Friendly Professional",
      heading: "'Nunito', sans-serif",
      body: "'Lato', sans-serif",
      characterization: "Approachable, warm, trustworthy",
    },
  ];

  // Font scale presets (modular scales for consistent sizing)
  static fontScales = {
    default: {
      base: 16,
      ratio: 1.25, // Major third
    },
    compact: {
      base: 14,
      ratio: 1.2, // Minor third
    },
    dramatic: {
      base: 16,
      ratio: 1.5, // Perfect fifth
    },
  };

  // Generate typography system based on pairing name
  static generateTypographySystem(pairingName) {
    // Find the requested font pairing
    const pairing =
      this.fontPairings.find((p) => p.name === pairingName) ||
      this.fontPairings[0];

    // Determine scale based on pairing style
    let scaleType = "default";
    if (pairingName.includes("Compact") || pairingName.includes("Technical")) {
      scaleType = "compact";
    } else if (
      pairingName.includes("Elegant") ||
      pairingName.includes("Creative")
    ) {
      scaleType = "dramatic";
    }

    const scale = this.fontScales[scaleType];

    // Generate modular typographic scale
    const fontSize = {
      xs: Math.round(scale.base / scale.ratio),
      sm: Math.round(scale.base / Math.sqrt(scale.ratio)),
      base: scale.base,
      lg: Math.round(scale.base * Math.sqrt(scale.ratio)),
      xl: Math.round(scale.base * scale.ratio),
      "2xl": Math.round(scale.base * scale.ratio * scale.ratio),
      "3xl": Math.round(scale.base * scale.ratio * scale.ratio * scale.ratio),
    };

    // Generate line heights
    const lineHeight = {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    };

    // Generate font weights
    const fontWeight = {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    };

    return {
      fontFamily: {
        heading: pairing.heading,
        body: pairing.body,
      },
      fontSizes: fontSize,
      lineHeight,
      fontWeight,
      characterization: pairing.characterization,
    };
  }

  // Get typography system appropriate for a specific style
  static getStyleTypography(style) {
    switch (style) {
      case "corporate":
        return this.generateTypographySystem("Corporate Professional");
      case "creative":
        return this.generateTypographySystem("Creative Modern");
      case "minimal":
        return this.generateTypographySystem("Modern Sans");
      case "abstract":
        return this.generateTypographySystem("Elegant Contrast");
      default:
        return this.generateTypographySystem("Modern Sans");
    }
  }
}

// =================================================================
// LAYOUT GENERATOR
// =================================================================

export class LayoutGenerator {
  // Predefined grid layouts
  static gridLayouts = [
    {
      name: "classic-document",
      sections: [
        { id: "header", type: "header", x: 5, y: 5, width: 90, height: 15 },
        { id: "content", type: "content", x: 5, y: 25, width: 90, height: 60 },
        { id: "footer", type: "footer", x: 5, y: 90, width: 90, height: 5 },
      ],
    },
    {
      name: "modern-split",
      sections: [
        { id: "header", type: "header", x: 5, y: 5, width: 90, height: 10 },
        { id: "sidebar", type: "sidebar", x: 5, y: 20, width: 25, height: 70 },
        { id: "content", type: "content", x: 35, y: 20, width: 60, height: 70 },
        { id: "footer", type: "footer", x: 5, y: 95, width: 90, height: 5 },
      ],
    },
    {
      name: "asymmetric",
      sections: [
        { id: "header", type: "header", x: 15, y: 5, width: 70, height: 15 },
        { id: "sidebar", type: "sidebar", x: 5, y: 25, width: 30, height: 60 },
        { id: "content", type: "content", x: 40, y: 25, width: 55, height: 50 },
        {
          id: "contentBottom",
          type: "content",
          x: 40,
          y: 80,
          width: 55,
          height: 10,
        },
      ],
    },
    {
      name: "presentation",
      sections: [
        { id: "header", type: "header", x: 10, y: 5, width: 80, height: 20 },
        {
          id: "contentLeft",
          type: "content",
          x: 10,
          y: 30,
          width: 35,
          height: 60,
        },
        {
          id: "contentRight",
          type: "content",
          x: 55,
          y: 30,
          width: 35,
          height: 60,
        },
        { id: "footer", type: "footer", x: 10, y: 95, width: 80, height: 5 },
      ],
    },
    {
      name: "infographic",
      sections: [
        { id: "header", type: "header", x: 5, y: 5, width: 90, height: 10 },
        { id: "section1", type: "content", x: 5, y: 20, width: 90, height: 20 },
        { id: "section2", type: "content", x: 5, y: 45, width: 40, height: 20 },
        {
          id: "section3",
          type: "content",
          x: 50,
          y: 45,
          width: 45,
          height: 20,
        },
        { id: "section4", type: "content", x: 5, y: 70, width: 90, height: 20 },
        { id: "footer", type: "footer", x: 5, y: 95, width: 90, height: 5 },
      ],
    },
  ];

  // Generate layout variation by applying controlled randomness
  static generateLayoutVariation(baseLayout, variationFactor = 0.1) {
    const variation = JSON.parse(JSON.stringify(baseLayout));

    // Apply slight variations to each section's position and size
    variation.sections = variation.sections.map((section) => {
      return {
        ...section,
        x: this.applyVariation(
          section.x,
          variationFactor,
          1,
          98 - section.width
        ),
        y: this.applyVariation(
          section.y,
          variationFactor,
          1,
          98 - section.height
        ),
        width: this.applyVariation(
          section.width,
          variationFactor * 0.5,
          10,
          98
        ),
        height: this.applyVariation(
          section.height,
          variationFactor * 0.5,
          5,
          80
        ),
      };
    });

    // Ensure sections don't overlap substantially
    this.resolveOverlaps(variation.sections);

    return variation;
  }

  // Apply controlled random variation to a value
  static applyVariation(value, factor, min, max) {
    const variation = value * factor;
    const randomVariation = (Math.random() * 2 - 1) * variation;
    return Math.max(min, Math.min(max, value + randomVariation));
  }

  // Simple algorithm to resolve section overlaps
  static resolveOverlaps(sections) {
    for (let i = 0; i < sections.length; i++) {
      for (let j = i + 1; j < sections.length; j++) {
        if (this.sectionsOverlap(sections[i], sections[j])) {
          // Move the second section down slightly
          sections[j].y = Math.min(95 - sections[j].height, sections[j].y + 5);
        }
      }
    }
  }

  // Check if two sections overlap
  static sectionsOverlap(sectionA, sectionB) {
    return !(
      sectionA.x + sectionA.width < sectionB.x ||
      sectionB.x + sectionB.width < sectionA.x ||
      sectionA.y + sectionA.height < sectionB.y ||
      sectionB.y + sectionB.height < sectionA.y
    );
  }

  // Get a layout appropriate for a specific style
  static getStyleLayout(style) {
    switch (style) {
      case "corporate":
        return (
          this.gridLayouts.find((l) => l.name === "classic-document") ||
          this.gridLayouts[0]
        );
      case "creative":
        return (
          this.gridLayouts.find((l) => l.name === "asymmetric") ||
          this.gridLayouts[2]
        );
      case "minimal":
        return (
          this.gridLayouts.find((l) => l.name === "modern-split") ||
          this.gridLayouts[1]
        );
      case "abstract":
        return (
          this.gridLayouts.find((l) => l.name === "infographic") ||
          this.gridLayouts[4]
        );
      default:
        return this.gridLayouts[0];
    }
  }
}

// =================================================================
// GRAPHICS GENERATOR
// =================================================================

export class GraphicsGenerator {
  // Base shapes for decorative elements
  static baseShapes = {
    circle: (size, color) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="${size / 2}" fill="${color}" />
      </svg>
    `,
    square: (size, color) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="${(100 - size) / 2}" y="${
      (100 - size) / 2
    }" width="${size}" height="${size}" fill="${color}" />
      </svg>
    `,
    triangle: (size, color) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,${50 - size / 2} ${50 + size / 2},${
      50 + size / 2
    } ${50 - size / 2},${50 + size / 2}" fill="${color}" />
      </svg>
    `,
    line: (size, color, rotation) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <line x1="${50 - size / 2}" y1="50" x2="${50 + size / 2}" y2="50" 
              stroke="${color}" stroke-width="${size / 10}" 
              transform="rotate(${rotation}, 50, 50)" />
      </svg>
    `,
    wave: (size, color) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M 10,50 C 20,${50 - size / 4} 30,${50 + size / 4} 40,50 C 50,${
      50 - size / 4
    } 60,${50 + size / 4} 70,50 C 80,${50 - size / 4} 90,${
      50 + size / 4
    } 100,50" 
              stroke="${color}" stroke-width="${size / 15}" fill="none" />
      </svg>
    `,
    dot: (size, color, count = 5, gap = 15) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        ${Array(count)
          .fill(0)
          .map(
            (_, i) =>
              `<circle cx="${20 + i * gap}" cy="50" r="${
                size / 10
              }" fill="${color}" />`
          )
          .join("")}
      </svg>
    `,
    cross: (size, color) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <line x1="${50 - size / 2}" y1="50" x2="${50 + size / 2}" y2="50" 
              stroke="${color}" stroke-width="${size / 10}" />
        <line x1="50" y1="${50 - size / 2}" x2="50" y2="${50 + size / 2}" 
              stroke="${color}" stroke-width="${size / 10}" />
      </svg>
    `,
  };

  // Generate decorative elements based on style and color palette
  static generateDecorativeElements(style, colorPalette, seed = Math.random()) {
    // Use seed for consistent randomization
    const seededRandom = this.createSeededRandom(seed);

    // Determine style-specific parameters
    const params = this.getStyleParams(style, seededRandom);

    // Generate consistent set of elements
    const elements = [];

    for (let i = 0; i < params.count; i++) {
      const color =
        colorPalette[Math.floor(seededRandom() * colorPalette.length)];
      const shapeType =
        params.shapes[Math.floor(seededRandom() * params.shapes.length)];
      const size =
        params.minSize + seededRandom() * (params.maxSize - params.minSize);

      let element;
      if (shapeType === "line") {
        const rotation = seededRandom() * 360;
        element = {
          type: shapeType,
          svg: this.baseShapes[shapeType](size, color, rotation),
        };
      } else if (shapeType === "dot") {
        const count = 3 + Math.floor(seededRandom() * 5);
        const gap = 10 + seededRandom() * 10;
        element = {
          type: shapeType,
          svg: this.baseShapes[shapeType](size, color, count, gap),
        };
      } else {
        element = {
          type: shapeType,
          svg: this.baseShapes[shapeType](size, color),
        };
      }

      elements.push(element);
    }

    return elements;
  }

  // Get style-specific parameters for graphic generation
  static getStyleParams(style, seededRandom) {
    switch (style) {
      case "corporate":
        return {
          shapes: ["square", "line"],
          count: 3 + Math.floor(seededRandom() * 2),
          minSize: 30,
          maxSize: 60,
        };
      case "creative":
        return {
          shapes: ["circle", "triangle", "wave", "dot"],
          count: 5 + Math.floor(seededRandom() * 3),
          minSize: 40,
          maxSize: 80,
        };
      case "minimal":
        return {
          shapes: ["circle", "line", "dot"],
          count: 2 + Math.floor(seededRandom() * 2),
          minSize: 20,
          maxSize: 50,
        };
      case "abstract":
        return {
          shapes: ["triangle", "circle", "square", "cross", "line"],
          count: 4 + Math.floor(seededRandom() * 4),
          minSize: 50,
          maxSize: 90,
        };
      default:
        return {
          shapes: ["circle", "square"],
          count: 3,
          minSize: 30,
          maxSize: 60,
        };
    }
  }

  // Create a seeded random number generator for consistent results
  static createSeededRandom(seed) {
    return function () {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
  }
}
