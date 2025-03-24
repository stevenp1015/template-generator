import { useMemo } from "react";

export const TemplatePreview = ({ template }) => {
  if (!template)
    return (
      <div className="border p-8 text-center">No template generated yet</div>
    );

  const { colors, typography, layout, decorativeElements, style } = template;

  // Function to map percentage-based coordinates to pixel values
  const scaleCoords = (value, dimension, unit = "%") => {
    return `${value}${unit}`;
  };

  // Map color palette to specific UI elements
  const colorMapping = useMemo(
    () => ({
      primary: colors[0] || "#3b82f6",
      secondary: colors[1] || colors[0] || "#3b82f6",
      accent: colors[2] || colors[0] || "#3b82f6",
      background: colors[3] || "#ffffff",
      text: colors[4] || "#333333",
      lightBg: colors[3] ? `${colors[3]}22` : "#f8f8f8",
    }),
    [colors]
  );

  // Generate placeholder content based on section type
  const getPlaceholderContent = (sectionType, sectionId) => {
    switch (sectionType) {
      case "header":
        return {
          title: "Professional Document Template",
          subtitle: "Created with Algorithmic Template Generator",
        };
      case "highlight":
        return {
          title: "Executive Summary",
          content:
            "This section highlights the key points of your document. It should be brief but comprehensive.",
        };
      case "gallery":
        return {
          title: "Project Showcase",
          content: "Visual representation of your work",
        };
      case "sidebar":
        return {
          title: "Quick Reference",
          items: ["Key Point 1", "Key Point 2", "Key Point 3", "Key Point 4"],
        };
      case "footer":
        return {
          content: "© 2025 Your Organization • Contact: info@example.com",
        };
      case "content":
      default:
        return {
          title:
            sectionId.charAt(0).toUpperCase() +
            sectionId.slice(1).replace(/([A-Z])/g, " $1"),
          paragraphs: [
            "This section contains the main content of your document. Replace this with your actual content.",
            "You can add multiple paragraphs, lists, images, and other elements here.",
          ],
        };
    }
  };

  // Create a style for a decorative element
  const getDecorativeElementStyle = (section) => {
    // Only add decorative elements to certain sections
    if (!["header", "highlight", "sidebar"].includes(section.type)) {
      return null;
    }

    // Get a random decorative element
    const element =
      decorativeElements && decorativeElements.length > 0
        ? decorativeElements[Math.floor(Math.random() * decorativeElements.length)]
        : null;
    
    if (!element) return null;

    // Calculate position based on section type
    let position = {};

    switch (section.type) {
      case "header":
        position = {
          right: "10px",
          top: "10px",
          width: "60px",
          height: "60px",
          opacity: 0.2,
        };
        break;
      case "highlight":
        position = {
          left: "10px",
          bottom: "10px",
          width: "80px",
          height: "80px",
          opacity: 0.1,
        };
        break;
      case "sidebar":
        position = {
          right: "5px",
          bottom: "10px",
          width: "40px",
          height: "40px",
          opacity: 0.15,
        };
        break;
      default:
        position = {
          right: "10px",
          bottom: "10px",
          width: "60px",
          height: "60px",
          opacity: 0.1,
        };
    }

    return {
      ...position,
      position: "absolute",
      pointerEvents: "none",
      zIndex: 1,
    };
  };

  // Render a specific section of the template with fixed styling
  const renderSection = (section) => {
    // Base style with enhanced styling for reference image look
    // Avoid mixing shorthand and non-shorthand CSS properties
    const sectionStyle = {
      position: "absolute",
      left: scaleCoords(section.x, "width"),
      top: scaleCoords(section.y, "height"),
      width: scaleCoords(section.width, "width"),
      height: scaleCoords(section.height, "height"),
      backgroundColor: section.type === 'content' ? '#ffffff' : colorMapping.background,
      color: section.type === 'header' ? '#ffffff' : colorMapping.text,
      paddingTop: section.type === 'header' || section.type === 'footer' ? '0.5rem' : '1rem',
      paddingRight: section.type === 'header' || section.type === 'footer' ? '1rem' : '1rem',
      paddingBottom: section.type === 'header' || section.type === 'footer' ? '0.5rem' : '1rem',
      paddingLeft: section.type === 'header' || section.type === 'footer' ? '1rem' : '1rem',
      overflow: "hidden",
      fontFamily:
          section.type === "header"
              ? typography.fontFamily.heading
              : typography.fontFamily.body,
      fontSize:
          section.type === "header"
              ? `${typography.fontSizes.xl}px`
              : `${typography.fontSizes.base}px`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      // Add drop shadow for depth
      boxShadow: section.type === 'content' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
      // Add border styling like reference images
      borderWidth: section.type === 'content' ? '1px' : '0',
      borderStyle: section.type === 'content' ? 'solid' : 'none',
      borderColor: section.type === 'content' ? '#f0f0f0' : 'transparent',
      borderRadius: section.type === 'content' ? '4px' : '0',
    };

    // Additional style modifications based on template style
    let additionalStyles = {};

    if (template.style === 'corporate') {
      if (section.type === 'header') {
        // Corporate header styling
        additionalStyles = {
          backgroundColor: colorMapping.primary,
          borderBottomWidth: '4px',
          borderBottomStyle: 'solid',
          borderBottomColor: colorMapping.accent
        };
      } else if (section.type === 'sidebar') {
        // Sidebar styling
        additionalStyles = {
          backgroundColor: '#f8f8f8',
          borderRightWidth: '1px',
          borderRightStyle: 'solid',
          borderRightColor: '#e0e0e0'
        };
      }
    } else if (template.style === 'minimal') {
      // Minimal style
      if (section.type === 'header') {
        additionalStyles = {
          backgroundColor: 'transparent',
          color: colorMapping.primary,
          borderLeftWidth: '4px',
          borderLeftStyle: 'solid',
          borderLeftColor: colorMapping.primary,
          paddingLeft: '1.5rem'
        };
      } else if (section.type === 'content') {
        additionalStyles = {
          borderWidth: '0',
          boxShadow: 'none',
          backgroundColor: section.id === 'content1' ? `${colorMapping.secondary}20` : 'white',
          borderRadius: '8px'
        };
      }
    } else if (template.style === 'abstract') {
      // Abstract style
      additionalStyles = {
        overflow: 'visible'
      };
      
      if (section.type === 'header') {
        additionalStyles = {
          ...additionalStyles,
          backgroundColor: 'transparent',
          color: '#333'
        };
      } else if (section.type === 'content') {
        additionalStyles = {
          ...additionalStyles,
          backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(5px)',
          borderRadius: '0'
        };
      }
    }

    // Combine base styles with additional style modifications
    const finalStyle = { ...sectionStyle, ...additionalStyles };

    // Determine if this section should have a decorative element
    const decorativeElementChance = template.style === 'abstract' ? 0.9 : 0.5;
    const hasDecorativeElement = Math.random() < decorativeElementChance;
    const decorativeElement = hasDecorativeElement && decorativeElements && decorativeElements.length > 0
        ? decorativeElements[Math.floor(Math.random() * decorativeElements.length)]
        : null;

    // Generate content based on section type and style
    const renderContent = () => {
        if (section.type === "header") {
            return (
                <>
                    <h1
                        style={{
                            fontSize: `${typography.fontSizes["2xl"]}px`,
                            marginBottom: '0.5rem',
                            color: template.style === 'minimal' ? colorMapping.primary : colorMapping.text,
                            fontWeight: typography.fontWeight.bold,
                            letterSpacing: template.style === 'abstract' ? '1px' : 'normal',
                        }}
                    >
                        {template.style === 'corporate' ? 'COMPANY NAME' : 'HEADER TITLE'}
                    </h1>
                    {template.style !== 'abstract' && (
                        <div
                            style={{
                                height: "4px",
                                width: "50px",
                                backgroundColor: template.style === 'minimal' ? 'transparent' : colorMapping.accent,
                                marginBottom: "1rem",
                            }}
                        ></div>
                    )}
                </>
            );
        } else if (section.type === "content") {
            // Different content styling based on template style
            if (template.style === 'corporate') {
                // Corporate content
                return (
                    <>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                        }}>
                            <div style={{
                                backgroundColor: colorMapping.primary,
                                color: 'white',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '8px',
                                fontWeight: 'bold'
                            }}>
                                {section.id.includes('1') ? '1' : section.id.includes('2') ? '2' : '3'}
                            </div>
                            <h2
                                style={{
                                    fontSize: `${typography.fontSizes.lg}px`,
                                    color: colorMapping.primary,
                                    fontWeight: typography.fontWeight.semibold,
                                    margin: 0
                                }}
                            >
                                {section.id.toUpperCase()}
                            </h2>
                        </div>
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
                                        height: "0.8rem",
                                        width: `${95 - i * 15}%`,
                                        backgroundColor: "#e0e0e0",
                                        borderRadius: "2px",
                                    }}
                                ></div>
                            ))}
                        </div>
                    </>
                );
            } else if (template.style === 'minimal') {
                // Minimal content
                return (
                    <>
                        <h2
                            style={{
                                fontSize: `${typography.fontSizes.lg}px`,
                                color: colorMapping.primary,
                                fontWeight: typography.fontWeight.semibold,
                                marginBottom: '1rem'
                            }}
                        >
                            {section.id === 'content1' ? 'Objectives' : 'Timeline'}
                        </h2>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.8rem",
                            }}
                        >
                            {[...Array(section.id === 'content1' ? 3 : 2)].map((_, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start' }}>
                                    {section.id === 'content1' && (
                                        <div style={{
                                            marginRight: '8px',
                                            marginTop: '5px',
                                            height: '8px',
                                            width: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: colorMapping.primary
                                        }}></div>
                                    )}
                                    {section.id === 'content2' && (
                                        <div style={{
                                            backgroundColor: colorMapping.primary,
                                            padding: '5px 10px',
                                            marginRight: '10px',
                                            color: 'white',
                                            fontSize: '12px',
                                            borderRadius: '4px'
                                        }}>01. Task</div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                height: "0.8rem",
                                                width: "90%",
                                                backgroundColor: "#e0e0e0",
                                                borderRadius: "2px",
                                                marginBottom: '5px'
                                            }}
                                        ></div>
                                        <div
                                            style={{
                                                height: "0.8rem",
                                                width: "60%",
                                                backgroundColor: "#e0e0e0",
                                                borderRadius: "2px",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            } else if (template.style === 'abstract') {
                // Abstract content
                return (
                    <>
                        <h2
                            style={{
                                fontSize: `${typography.fontSizes.lg}px`,
                                color: '#333',
                                fontWeight: typography.fontWeight.semibold,
                                marginBottom: '0.5rem',
                                textTransform: 'uppercase'
                            }}
                        >
                            {section.id === 'content1' ? 'ABSTRACT' : section.id === 'content2' ? 'TRIANGLE' : 'HEADLINE'}
                        </h2>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                            }}
                        >
                            {[...Array(2)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        height: "0.8rem",
                                        width: `${80 - i * 20}%`,
                                        backgroundColor: "#e0e0e0",
                                        borderRadius: "2px",
                                    }}
                                ></div>
                            ))}
                        </div>
                    </>
                );
            } else {
                // Default content
                return (
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
                );
            }
        }

        return null; // For any other section type
    };

    // Safely create SVG content with fixed rotation values
    const renderSafePolygonMesh = () => {
      if (!decorativeElements || !Array.isArray(decorativeElements)) {
        return '';
      }
      
      const polygonMeshElements = decorativeElements.filter(el => 
        el && typeof el === 'object' && el.type === 'polygonMesh' && el.svg
      );
      
      if (polygonMeshElements.length === 0) {
        return '';
      }
      
      return polygonMeshElements.map(el => el.svg).join('');
    };

    const renderSafeWave = () => {
      if (!decorativeElements || !Array.isArray(decorativeElements)) {
        return '';
      }
      
      const waveElements = decorativeElements.filter(el => 
        el && typeof el === 'object' && el.type === 'wave' && el.svg
      );
      
      if (waveElements.length === 0) {
        return '';
      }
      
      return waveElements.map(el => el.svg).join('');
    };

    const renderSafeRibbon = () => {
      if (!decorativeElements || !Array.isArray(decorativeElements)) {
        return '';
      }
      
      const ribbonElements = decorativeElements.filter(el => 
        el && typeof el === 'object' && el.type === 'ribbon' && el.svg
      );
      
      if (ribbonElements.length === 0) {
        return '';
      }
      
      return ribbonElements.map(el => el.svg).join('');
    };

    return (
        <div key={section.id} style={finalStyle}>
            {/* Background style element for abstract design */}
            {template.style === 'abstract' && section.type === 'header' && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: -1,
                        overflow: 'hidden'
                    }}
                    dangerouslySetInnerHTML={{
                        __html: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          ${renderSafePolygonMesh()}
                        </svg>`
                    }}
                ></div>
            )}

            {/* Ribbon for corporate style */}
            {template.style === 'corporate' && section.type === 'header' && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '30%',
                        height: '100%'
                    }}
                    dangerouslySetInnerHTML={{
                        __html: renderSafeRibbon()
                    }}
                ></div>
            )}

            {/* Wave for minimal style */}
            {template.style === 'minimal' && section.type === 'header' && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '50%',
                        height: '100%',
                        opacity: 0.2,
                        zIndex: -1
                    }}
                    dangerouslySetInnerHTML={{
                        __html: renderSafeWave()
                    }}
                ></div>
            )}

            {/* Section content */}
            {renderContent()}

            {/* Regular decorative element */}
            {decorativeElement && section.type === 'content' && (
                <div
                    style={{
                        position: "absolute",
                        right: "10px",
                        bottom: "10px",
                        width: "40px",
                        height: "40px",
                        opacity: 0.2,
                        pointerEvents: "none",
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: decorativeElement.svg || ''
                    }}
                ></div>
            )}
        </div>
    );
  };

  // Get appropriate background color for a section
  const getSectionColor = (sectionType) => {
    switch (sectionType) {
      case "header":
        return colorMapping.primary;
      case "footer":
        return colorMapping.lightBg;
      case "sidebar":
        return colorMapping.lightBg;
      case "highlight":
        return colorMapping.secondary + "22"; // Semi-transparent secondary
      case "gallery":
        return "#ffffff";
      default:
        return "#ffffff";
    }
  };

  // Get appropriate font size for a section
  const getFontSize = (sectionType) => {
    switch (sectionType) {
      case "header":
        return `${typography.fontSizes.xl}px`;
      case "footer":
        return `${typography.fontSizes.xs}px`;
      case "highlight":
        return `${typography.fontSizes.lg}px`;
      default:
        return `${typography.fontSizes.base}px`;
    }
  };

  return (
    <div className="relative w-full aspect-[8.5/11] bg-white border shadow-md template-preview">
      {/* Background pattern or texture based on style */}
      {style === "creative" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(${colorMapping.primary}05 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Render all sections */}
      {layout && layout.sections && Array.isArray(layout.sections) ? 
        layout.sections.map((section) => renderSection(section)) :
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          Invalid layout structure
        </div>
      }
    </div>
  );
};
