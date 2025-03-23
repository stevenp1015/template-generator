import { useMemo } from "react";

export const TemplatePreview = ({ template }) => {
  // Move useMemo outside the conditional
  const colorMapping = useMemo(() => {
    if (!template || !template.colors)
      return {
        primary: "#000000",
        secondary: "#000000",
        accent: "#000000",
        background: "#ffffff",
        text: "#333333",
      };

    return {
      primary: template.colors[0],
      secondary: template.colors[1] || template.colors[0],
      accent: template.colors[2] || template.colors[0],
      background: template.colors[3] || "#ffffff",
      text: template.colors[4] || "#333333",
    };
  }, [template]);

  if (!template)
    return (
      <div className="border p-8 text-center">No template generated yet</div>
    );

  const { typography, layout, decorativeElements } = template;

  // Function to map percentage-based coordinates to pixel values
  const scaleCoords = (value, dimension, unit = "px") => {
    return `calc(${value}% ${unit})`;
  };

  // Render a specific section of the template
  const renderSection = (section) => {
    const sectionStyle = {
      position: "absolute",
      left: scaleCoords(section.x, "width"),
      top: scaleCoords(section.y, "height"),
      width: scaleCoords(section.width, "width"),
      height: scaleCoords(section.height, "height"),
      backgroundColor:
        section.type === "header"
          ? colorMapping.primary
          : section.type === "footer"
          ? colorMapping.secondary
          : section.type === "sidebar"
          ? colorMapping.accent
          : colorMapping.background,
      color: colorMapping.text,
      padding: "1rem",
      overflow: "hidden",
      fontFamily:
        section.type === "header"
          ? typography.fontFamily.heading
          : typography.fontFamily.body,
      fontSize:
        section.type === "header"
          ? typography.fontSizes.xl
          : typography.fontSizes.base,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    };

    // Determine if this section should have a decorative element
    const hasDecorativeElement = Math.random() > 0.7;
    const decorativeElement = hasDecorativeElement
      ? decorativeElements[
          Math.floor(Math.random() * decorativeElements.length)
        ]
      : null;

    return (
      <div key={section.id} style={sectionStyle}>
        {section.type === "header" && (
          <>
            <h1
              style={{
                fontSize: `${typography.fontSizes["2xl"]}px`,
                marginBottom: "0.5rem",
                color: colorMapping.text,
                fontWeight: "bold",
              }}
            >
              {section.id.charAt(0).toUpperCase() + section.id.slice(1)} Title
            </h1>
            <div
              style={{
                height: "4px",
                width: "50px",
                backgroundColor: colorMapping.accent,
                marginBottom: "1rem",
              }}
            ></div>
          </>
        )}

        {section.type === "content" && (
          <>
            <h2
              style={{
                fontSize: `${typography.fontSizes.xl}px`,
                marginBottom: "0.5rem",
                color: colorMapping.primary,
                fontWeight: "bold",
              }}
            >
              Content Section
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: "1rem",
                    width: `${90 - i * 10}%`,
                    backgroundColor: "#e0e0e0",
                    borderRadius: "2px",
                  }}
                ></div>
              ))}
            </div>
          </>
        )}

        {decorativeElement && (
          <div
            style={{
              position: "absolute",
              right: "10px",
              bottom: "10px",
              width: "60px",
              height: "60px",
              opacity: 0.3,
              pointerEvents: "none",
            }}
            dangerouslySetInnerHTML={{ __html: decorativeElement.svg }}
          ></div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full aspect-[8.5/11] bg-white border shadow-md">
      {layout.sections.map((section) => renderSection(section))}
    </div>
  );
};
