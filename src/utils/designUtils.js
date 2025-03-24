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

    // Generate more professional gradation
    colors.push(this.hslToHexString(baseHue, saturation, 35)); // Darkest/primary
    colors.push(this.hslToHexString(baseHue, saturation - 10, 45)); // Dark
    colors.push(this.hslToHexString(baseHue, saturation - 20, 65)); // Medium
    colors.push(this.hslToHexString(baseHue, saturation - 30, 92)); // Light background
    colors.push(this.hslToHexString(baseHue, 10, 20)); // Dark text

    return colors;
  }

  // Replace the generateComplementary method
  static generateComplementary(baseHue, count = 5) {
    const colors = [];
    const complementaryHue = (baseHue + 180) % 360;

    // Primary color
    colors.push(this.hslToHexString(baseHue, 70, 40));

    // Secondary/complementary color
    colors.push(this.hslToHexString(complementaryHue, 65, 45));

    // Accent (a muted version of the complementary)
    colors.push(this.hslToHexString(complementaryHue, 50, 60));

    // Light background with a hint of the base color
    colors.push(this.hslToHexString(baseHue, 10, 95));

    // Dark text with a hint of the base color
    colors.push(this.hslToHexString(baseHue, 15, 25));

    return colors;
  }

  // Add a helper method to convert HSL to hex string directly
  static hslToHexString(h, s, l) {
    const [r, g, b] = this.hslToRgb(h, s, l);
    return this.rgbToHex(r, g, b);
  }

  // Update the generateAnalogous method
  static generateAnalogous(baseHue, count = 5) {
    const colors = [];
    const hueStep = 30;

    // Primary color
    colors.push(this.hslToHexString(baseHue, 70, 40));

    // First analogous color (30 degrees away)
    colors.push(this.hslToHexString((baseHue + hueStep) % 360, 65, 45));

    // Second analogous color (30 degrees in other direction)
    colors.push(this.hslToHexString((baseHue - hueStep + 360) % 360, 60, 50));

    // Light background
    colors.push(this.hslToHexString(baseHue, 10, 95));

    // Dark text
    colors.push(this.hslToHexString(baseHue, 15, 20));

    return colors;
  }

  // Update the triadic method
  static generateTriadic(baseHue, count = 5) {
    const colors = [];
    const triad1 = baseHue;
    const triad2 = (baseHue + 120) % 360;
    const triad3 = (baseHue + 240) % 360;

    // Primary color
    colors.push(this.hslToHexString(triad1, 70, 40));

    // Second triadic color
    colors.push(this.hslToHexString(triad2, 70, 45));

    // Third triadic color
    colors.push(this.hslToHexString(triad3, 70, 50));

    // Light background with a hint of the primary
    colors.push(this.hslToHexString(triad1, 5, 97));

    // Dark text
    colors.push(this.hslToHexString(triad1, 15, 15));

    return colors;
  }

  // Update the split-complementary method
  static generateSplitComplementary(baseHue, count = 5) {
    const colors = [];
    const complementaryHue = (baseHue + 180) % 360;
    const split1 = (complementaryHue - 30 + 360) % 360;
    const split2 = (complementaryHue + 30) % 360;

    // Primary color
    colors.push(this.hslToHexString(baseHue, 70, 40));

    // First split color
    colors.push(this.hslToHexString(split1, 65, 45));

    // Second split color
    colors.push(this.hslToHexString(split2, 60, 55));

    // Light background
    colors.push(this.hslToHexString(baseHue, 8, 96));

    // Dark text
    colors.push(this.hslToHexString(baseHue, 10, 15));

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
  // Predefined grid layouts with improved structure
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
    {
      name: "executive-brief",
      sections: [
        { id: "header", type: "header", x: 5, y: 5, width: 90, height: 10 },
        {
          id: "summary",
          type: "highlight",
          x: 5,
          y: 20,
          width: 90,
          height: 15,
        },
        {
          id: "contentLeft",
          type: "content",
          x: 5,
          y: 40,
          width: 43,
          height: 50,
        },
        {
          id: "contentRight",
          type: "content",
          x: 52,
          y: 40,
          width: 43,
          height: 50,
        },
        { id: "footer", type: "footer", x: 5, y: 95, width: 90, height: 5 },
      ],
    },
    {
      name: "magazine",
      sections: [
        { id: "header", type: "header", x: 5, y: 5, width: 90, height: 20 },
        {
          id: "featured",
          type: "highlight",
          x: 5,
          y: 30,
          width: 55,
          height: 30,
        },
        { id: "sidebar", type: "sidebar", x: 65, y: 30, width: 30, height: 60 },
        { id: "content1", type: "content", x: 5, y: 65, width: 55, height: 25 },
        { id: "footer", type: "footer", x: 5, y: 95, width: 90, height: 5 },
      ],
    },
    {
      name: "portfolio",
      sections: [
        { id: "header", type: "header", x: 5, y: 5, width: 90, height: 15 },
        { id: "gallery1", type: "gallery", x: 5, y: 25, width: 28, height: 30 },
        {
          id: "gallery2",
          type: "gallery",
          x: 36,
          y: 25,
          width: 28,
          height: 30,
        },
        {
          id: "gallery3",
          type: "gallery",
          x: 67,
          y: 25,
          width: 28,
          height: 30,
        },
        {
          id: "description",
          type: "content",
          x: 5,
          y: 60,
          width: 90,
          height: 30,
        },
        { id: "footer", type: "footer", x: 5, y: 95, width: 90, height: 5 },
      ],
    },
  ];

  // Generate layout variation by applying controlled randomness
  static generateLayoutVariation(baseLayout, variationFactor = 0.1) {
    const variation = JSON.parse(JSON.stringify(baseLayout));

    // Apply slight variations to each section's position and size
    variation.sections = variation.sections.map((section) => {
      const newSection = {
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
          section.width + 5
        ),
        height: this.applyVariation(
          section.height,
          variationFactor * 0.5,
          5,
          section.height + 5
        ),
      };

      // Ensure the section stays within the document bounds
      newSection.x = Math.min(95 - newSection.width, Math.max(5, newSection.x));
      newSection.y = Math.min(
        95 - newSection.height,
        Math.max(5, newSection.y)
      );

      return newSection;
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

  // Improved algorithm to resolve section overlaps
  static resolveOverlaps(sections) {
    const maxIterations = 10;
    let iterations = 0;
    let hasOverlap = true;

    while (hasOverlap && iterations < maxIterations) {
      hasOverlap = false;
      iterations++;

      // Sort sections by y position for top-down processing
      const sortedSections = [...sections].sort((a, b) => a.y - b.y);

      for (let i = 0; i < sortedSections.length; i++) {
        for (let j = i + 1; j < sortedSections.length; j++) {
          if (this.sectionsOverlap(sortedSections[i], sortedSections[j])) {
            hasOverlap = true;

            // Calculate overlap amount
            const overlapX = Math.min(
              sortedSections[i].x +
                sortedSections[i].width -
                sortedSections[j].x,
              sortedSections[j].x +
                sortedSections[j].width -
                sortedSections[i].x
            );

            const overlapY = Math.min(
              sortedSections[i].y +
                sortedSections[i].height -
                sortedSections[j].y,
              sortedSections[j].y +
                sortedSections[j].height -
                sortedSections[i].y
            );

            // Determine if horizontal or vertical adjustment is smaller
            if (overlapX < overlapY) {
              // Horizontal adjustment
              if (sortedSections[i].x < sortedSections[j].x) {
                sortedSections[j].x = Math.min(
                  95 - sortedSections[j].width,
                  sortedSections[j].x + overlapX + 1
                );
              } else {
                sortedSections[j].x = Math.max(
                  5,
                  sortedSections[j].x - overlapX - 1
                );
              }
            } else {
              // Vertical adjustment - always move the later section down
              sortedSections[j].y = Math.min(
                95 - sortedSections[j].height,
                sortedSections[j].y + overlapY + 1
              );
            }
          }
        }
      }
    }

    // Ensure sections are still within bounds
    sections.forEach((section) => {
      section.x = Math.min(95 - section.width, Math.max(5, section.x));
      section.y = Math.min(95 - section.height, Math.max(5, section.y));
    });
  }

  // Check if two sections overlap
  static sectionsOverlap(sectionA, sectionB) {
    return !(
      sectionA.x + sectionA.width <= sectionB.x ||
      sectionB.x + sectionB.width <= sectionA.x ||
      sectionA.y + sectionA.height <= sectionB.y ||
      sectionB.y + sectionB.height <= sectionA.y
    );
  }

  // Get a layout appropriate for a specific style
// Replace the getStyleLayout method
  static getStyleLayout(style) {
    switch (style) {
      case "corporate":
        // Structured grid layout similar to Image 1
        return {
          name: "corporate-grid",
          sections: [
            { id: "header", type: "header", x: 0, y: 0, width: 100, height: 15 },
            { id: "sidebar", type: "sidebar", x: 0, y: 15, width: 20, height: 85 },
            { id: "content1", type: "content", x: 25, y: 15, width: 75, height: 25 },
            { id: "content2", type: "content", x: 25, y: 45, width: 75, height: 25 },
            { id: "content3", type: "content", x: 25, y: 75, width: 75, height: 20 },
            { id: "footer", type: "footer", x: 0, y: 95, width: 100, height: 5 }
          ]
        };
      case "minimal":
        // Clean modern layout similar to Image 2
        return {
          name: "minimal-modern",
          sections: [
            { id: "header", type: "header", x: 5, y: 5, width: 90, height: 25 },
            { id: "content1", type: "content", x: 5, y: 35, width: 90, height: 30 },
            { id: "content2", type: "content", x: 5, y: 70, width: 90, height: 25 },
            { id: "footer", type: "footer", x: 5, y: 95, width: 90, height: 5 }
          ]
        };
      case "abstract":
        // Dynamic asymmetric layout similar to Image 3
        return {
          name: "abstract-dynamic",
          sections: [
            { id: "header", type: "header", x: 5, y: 5, width: 90, height: 15 },
            { id: "content1", type: "content", x: 5, y: 25, width: 45, height: 35 },
            { id: "content2", type: "content", x: 55, y: 25, width: 40, height: 35 },
            { id: "content3", type: "content", x: 5, y: 65, width: 90, height: 30 }
          ]
        };
      case "creative":
        // Creative layout with overlapping sections
        return {
          name: "creative-overlap",
          sections: [
            { id: "header", type: "header", x: 10, y: 5, width: 80, height: 20 },
            { id: "feature", type: "content", x: 10, y: 30, width: 50, height: 40 },
            { id: "sidebar", type: "sidebar", x: 65, y: 30, width: 25, height: 60 },
            { id: "content", type: "content", x: 10, y: 75, width: 50, height: 20 }
          ]
        };
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
    line: (size, color, rotation = 0) => `
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
    doubleLine: (size, color, rotation = 0) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <line x1="${50 - size / 2}" y1="45" x2="${50 + size / 2}" y2="45" 
              stroke="${color}" stroke-width="${size / 15}" 
              transform="rotate(${rotation}, 50, 50)" />
        <line x1="${50 - size / 2}" y1="55" x2="${50 + size / 2}" y2="55" 
              stroke="${color}" stroke-width="${size / 15}" 
              transform="rotate(${rotation}, 50, 50)" />
      </svg>
    `,
    zigzag: (size, color) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polyline points="${30},${50 - size / 4} ${40},${50 + size / 4} ${50},${
        50 - size / 4
    } ${60},${50 + size / 4} ${70},${50 - size / 4}" 
                  fill="none" stroke="${color}" stroke-width="${size / 15}" />
      </svg>
    `,
    diamond: (size, color) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="50" width="${size / 1.4}" height="${size / 1.4}" 
              fill="${color}" transform="translate(-${size / 2.8}, -${
        size / 2.8
    }) rotate(45, 50, 50)" />
      </svg>
    `,
    arc: (size, color, startAngle = 0, endAngle = 180) => {
      const radius = size / 2;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const startX = 50 + radius * Math.cos(startRad);
      const startY = 50 + radius * Math.sin(startRad);
      const endX = 50 + radius * Math.cos(endRad);
      const endY = 50 + radius * Math.sin(endRad);

      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}" 
                fill="none" stroke="${color}" stroke-width="${size / 15}" />
        </svg>
      `;
    },
    abstractLogo: (size, color1, color2 = color1) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="35" cy="35" r="20" fill="${color1}" />
        <rect x="45" y="45" width="30" height="30" fill="${color2}" />
        <path d="M 30,70 L 50,85 L 70,70" 
              fill="none" stroke="${color1}" stroke-width="3" />
      </svg>
    `,
    leafPattern: (size, color1, color2 = color1) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50,20 Q 20,35 50,80 Q 80,35 50,20" 
              fill="${color1}" stroke="${color2}" stroke-width="1" />
        <path d="M 50,30 Q 35,50 50,70 Q 65,50 50,30" 
              fill="${color2}" stroke="none" />
      </svg>
    `,
    gradient: (width, colors) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colors[0]}" />
            <stop offset="100%" stop-color="${colors[1] || colors[0]}" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#grad)" />
      </svg>
    `,
    cornerAccent: (size, color) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,0 L${size},0 L0,${size} Z" fill="${color}" />
      </svg>
    `,
    grid: (size, color, rows = 3, cols = 3) => {
      const cellSize = size / Math.max(rows, cols);
      const startX = 50 - (cols * cellSize) / 2;
      const startY = 50 - (rows * cellSize) / 2;
      let paths = "";

      // Horizontal lines
      for (let i = 0; i <= rows; i++) {
        const y = startY + i * cellSize;
        paths += `<line x1="${startX}" y1="${y}" x2="${
            startX + cols * cellSize
        }" y2="${y}" stroke="${color}" stroke-width="${size / 30}" />`;
      }

      // Vertical lines
      for (let i = 0; i <= cols; i++) {
        const x = startX + i * cellSize;
        paths += `<line x1="${x}" y1="${startY}" x2="${x}" y2="${
            startY + rows * cellSize
        }" stroke="${color}" stroke-width="${size / 30}" />`;
      }

      return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          ${paths}
        </svg>
      `;
    },
    circlePattern: (size, color) => {
      const circles = [];
      const count = 5;

      for (let i = 0; i < count; i++) {
        const radius = (size / 2) * ((count - i) / count);
        circles.push(
            `<circle cx="50" cy="50" r="${radius}" fill="none" stroke="${color}" stroke-width="${
                size / 40
            }" />`
        );
      }

      return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          ${circles.join("")}
        </svg>
      `;
    },
    cornerGraphic: (size, color) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0,0 L 100,0 L 100,100 C 70,70 30,30 0,0 Z" fill="${color}" />
      </svg>
    `,
    // Adding these new shape types to match function references in the generateDecorativeElements method
    ribbon: (color, seed, width = 20) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M-10,20 L110,15 L110,${15+width} L-10,${20+width} Z" fill="${color}" />
      </svg>
    `,
    polygonMesh: (colors, seed, density = 15) => {
      let polygons = '';
      const seededRandom = () => Math.random(); // Simple random for fallback

      for (let i = 0; i < density; i++) {
        // Generate random polygon
        const points = [];
        const vertexCount = 3 + Math.floor(seededRandom() * 4); // 3 to 6 vertices

        for (let j = 0; j < vertexCount; j++) {
          const x = seededRandom() * 100;
          const y = seededRandom() * 100;
          points.push(`${x},${y}`);
        }

        // Select color with randomized opacity
        const color = colors[Math.floor(seededRandom() * colors.length)];
        const opacity = 0.1 + seededRandom() * 0.5;

        polygons += `<polygon points="${points.join(' ')}" fill="${color}" opacity="${opacity}" />`;
      }

      return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        ${polygons}
      </svg>
    `;
    },
    wavePattern: (color, seed, amplitude = 20) => {
      const frequency = 0.05 + Math.random() * 0.1;
      const phase = Math.random() * Math.PI * 2;

      // Generate wave path
      let path = `M0,50 `;
      for (let x = 0; x <= 100; x += 2) {
        const y = 50 + amplitude * Math.sin(x * frequency * Math.PI + phase);
        path += `L${x},${y} `;
      }
      // Close the path
      path += `L100,100 L0,100 Z`;

      return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="${path}" fill="${color}" opacity="0.8" />
      </svg>
    `;
    },
    corner: (size, color) => `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,0 L${size},0 L0,${size} Z" fill="${color}" />
      </svg>
    `,
  };

  // Generate decorative elements based on style and color palette
  static generateDecorativeElements(style, colorPalette, seed = Math.random()) {
    try {
      // Use seed for consistent randomization
      const seededRandom = this.createSeededRandom(seed);

      // Determine style-specific parameters
      const params = this.getStyleParams(style, seededRandom);

      // Generate consistent set of elements
      const elements = [];

      // Add style-specific elements
      for (let i = 0; i < params.count; i++) {
        const color = colorPalette[Math.floor(seededRandom() * colorPalette.length)] || "#3b82f6";
        const shapeType = params.shapes[Math.floor(seededRandom() * params.shapes.length)];
        const size = params.minSize + seededRandom() * (params.maxSize - params.minSize);

        // Check if shape function exists
        if (this.baseShapes[shapeType] && typeof this.baseShapes[shapeType] === 'function') {
          let element;

          // Handle special cases
          if (shapeType === "line" || shapeType === "doubleLine") {
            const rotation = seededRandom() * 360; // Provide explicit rotation
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
        } else {
          // Fallback to a circle if shape doesn't exist
          elements.push({
            type: "circle",
            svg: this.baseShapes.circle(size, color),
          });
        }
      }

      return elements;
    } catch (error) {
      console.error("Error generating decorative elements:", error);
      // Return minimal fallback elements
      return [
        {
          type: "circle",
          svg: this.baseShapes.circle(40, "#3b82f6"),
        }
      ];
    }
  }
  // Get style-specific parameters for graphic generation
  static getStyleParams(style, seededRandom) {
    switch (style) {
      case "corporate":
        return {
          shapes: [
            "square",
            "line",
            "doubleLine",
            "grid",
            "corner",
            "abstractLogo",
          ],
          count: 4 + Math.floor(seededRandom() * 3),
          minSize: 40,
          maxSize: 70,
        };
      case "creative":
        return {
          shapes: [
            "circle",
            "triangle",
            "wave",
            "dot",
            "zigzag",
            "arc",
            "circlePattern",
            "leafPattern",
          ],
          count: 5 + Math.floor(seededRandom() * 3),
          minSize: 40,
          maxSize: 80,
        };
      case "minimal":
        return {
          shapes: ["circle", "line", "dot", "diamond", "circlePattern"],
          count: 3 + Math.floor(seededRandom() * 2),
          minSize: 30,
          maxSize: 60,
        };
      case "abstract":
        return {
          shapes: [
            "triangle",
            "circle",
            "square",
            "cross",
            "line",
            "zigzag",
            "diamond",
            "cornerGraphic",
            "abstractLogo",
          ],
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

  // Generate methods used in the switch/case blocks
  static generatePolygonMesh(colors, seed, density = 15) {
    try {
      const seededRandom = this.createSeededRandom(seed);

      // Create SVG with overlapping polygon elements
      let polygons = '';
      for (let i = 0; i < density; i++) {
        // Generate random polygon
        const points = [];
        const vertexCount = 3 + Math.floor(seededRandom() * 4); // 3 to 6 vertices

        for (let j = 0; j < vertexCount; j++) {
          const x = seededRandom() * 100;
          const y = seededRandom() * 100;
          points.push(`${x},${y}`);
        }

        // Select color with randomized opacity
        const color = colors[Math.floor(seededRandom() * colors.length)] || "#3b82f6";
        const opacity = 0.1 + seededRandom() * 0.5;

        polygons += `<polygon points="${points.join(' ')}" fill="${color}" opacity="${opacity}" />`;
      }

      return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        ${polygons}
      </svg>
    `;
    } catch (error) {
      console.error("Error generating polygon mesh:", error);
      return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="80" height="80" fill="#3b82f6" opacity="0.2" />
      </svg>
    `;
    }
  }

  static generateWavePattern(color, seed, amplitude = 20) {
    try {
      const seededRandom = this.createSeededRandom(seed);
      const frequency = 0.05 + seededRandom() * 0.1;
      const phase = seededRandom() * Math.PI * 2;

      // Generate wave path
      let path = `M0,50 `;
      for (let x = 0; x <= 100; x += 2) {
        const y = 50 + amplitude * Math.sin(x * frequency * Math.PI + phase);
        path += `L${x},${y} `;
      }
      // Close the path
      path += `L100,100 L0,100 Z`;

      return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="${path}" fill="${color}" opacity="0.8" />
      </svg>
    `;
    } catch (error) {
      console.error("Error generating wave pattern:", error);
      return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="50" width="100" height="50" fill="${color || "#3b82f6"}" opacity="0.8" />
      </svg>
    `;
    }
  }

  static generateRibbon(color, seed, width = 20) {
    try {
      const seededRandom = this.createSeededRandom(seed);
      const angle = seededRandom() * 20 - 10; // -10 to 10 degrees
      const yOffset = seededRandom() * 30; // Vertical position variation

      return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M-10,${yOffset} L110,${yOffset-5} L110,${yOffset+width-5} L-10,${yOffset+width} Z" 
              fill="${color}" transform="rotate(${angle}, 50, 50)" />
      </svg>
    `;
    } catch (error) {
      console.error("Error generating ribbon:", error);
      return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="20" width="100" height="20" fill="${color || "#3b82f6"}" />
      </svg>
    `;
    }
  }
}

