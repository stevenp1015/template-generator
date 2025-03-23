// src/App.jsx
import { useEffect, useMemo, useCallback } from "react";
import {
  Download,
  Sliders,
  Palette,
  Layout,
  Type,
  Shapes,
  RefreshCw,
} from "lucide-react";
import { debounce } from "lodash-es";

// Import components and hooks
import { TemplatePreview } from "./components/TemplatePreview";
import { ColorPicker } from "./components/ColorPicker";
import { useQwenAPI } from "./hooks/useQwenAPI";
import { useTemplateGenerator } from "./hooks/useTemplateGenerator";

// Utils - Design generation algorithms
import {
  ColorGenerator,
  LayoutGenerator,
  TypographyGenerator,
  GraphicsGenerator,
} from "./utils/designUtils";

const App = () => {
  // Use custom hook for template generation
  const {
    template,
    styleOptions,
    setStyleOptions,
    generateTemplate,
    randomizeAll,
  } = useTemplateGenerator();

  // AI suggestions hook
  const { prompt, setPrompt, isLoading, aiSuggestions, getAISuggestions } =
    useQwenAPI();

  // Memoize options for better performance
  const colorOptions = useMemo(
    () => [
      "monochromatic",
      "complementary",
      "analogous",
      "triadic",
      "split-complementary",
    ],
    []
  );

  const styleTypes = useMemo(
    () => ["corporate", "creative", "minimal", "abstract"],
    []
  );

  const typographyOptions = useMemo(
    () => TypographyGenerator.fontPairings.map((pairing) => pairing.name),
    []
  );

  const layoutOptions = useMemo(
    () => LayoutGenerator.gridLayouts.map((layout) => layout.name),
    []
  );

  // Debounced handlers

  // Fix useCallback dependencies
  const handleHueChange = useCallback(
    (hue) => { // Define the function directly within useCallback
      debounce(
        (actualHue) => { // Debounced function is now inside
          setStyleOptions((prev) => ({ ...prev, baseHue: parseInt(actualHue) }));
        },
        100
      )(hue); // Immediately invoke the debounced function with hue
    },
    [setStyleOptions] // Now debounce is a dependency
  );

  // Apply AI suggestions
  const applyAISuggestions = useCallback(() => {
    if (!aiSuggestions) return;

    setStyleOptions((prev) => ({
      ...prev,
      style: aiSuggestions.style || prev.style,
      colorScheme: aiSuggestions.colorScheme || prev.colorScheme,
      typography: aiSuggestions.typography || prev.typography,
      layout: aiSuggestions.layout || prev.layout,
    }));
  }, [aiSuggestions, setStyleOptions]);

  // Effect to apply suggestions when they change
  useEffect(() => {
    if (aiSuggestions) {
      applyAISuggestions();
    }
  }, [aiSuggestions, applyAISuggestions]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Algorithmic Template Generator
        </h1>
        <p className="text-gray-600">
          Creates professional document templates using design principles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5" /> Design Controls
          </h2>

          {/* Style Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Style
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={styleOptions.style}
              onChange={(e) =>
                setStyleOptions({ ...styleOptions, style: e.target.value })
              }
            >
              {styleTypes.map((style) => (
                <option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Color Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Color
            </label>
            <ColorPicker
              hue={styleOptions.baseHue}
              onChange={handleHueChange}
            />
          </div>

          {/* Color Scheme */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color Scheme
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={styleOptions.colorScheme}
              onChange={(e) =>
                setStyleOptions({
                  ...styleOptions,
                  colorScheme: e.target.value,
                })
              }
            >
              {colorOptions.map((scheme) => (
                <option key={scheme} value={scheme}>
                  {scheme
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>

          {/* Typography */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Typography
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={styleOptions.typography}
              onChange={(e) =>
                setStyleOptions({ ...styleOptions, typography: e.target.value })
              }
            >
              {typographyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Layout */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layout
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={styleOptions.layout}
              onChange={(e) =>
                setStyleOptions({ ...styleOptions, layout: e.target.value })
              }
            >
              {layoutOptions.map((layout) => (
                <option key={layout} value={layout}>
                  {layout
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              className="flex items-center justify-center gap-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={generateTemplate}
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition-colors"
              onClick={randomizeAll}
            >
              <Shapes className="w-4 h-4" /> Randomize All
            </button>
          </div>

          {/* AI Integration */}
          <div className="border-t pt-6 mt-2">
            <h3 className="text-lg font-medium mb-3">AI Design Suggestions</h3>
            <div className="mb-4">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md h-24"
                placeholder="Describe your design needs, e.g., 'I need a professional template for a marketing proposal with a modern feel'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              ></textarea>
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
              onClick={getAISuggestions}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Get AI Suggestions"}
            </button>

            {/* Display AI Suggestions */}
            {aiSuggestions && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
                <h4 className="font-medium mb-2">Design Notes:</h4>
                <ul className="list-disc list-inside">
                  {aiSuggestions.designNotes &&
                    aiSuggestions.designNotes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-lg shadow-md p-6 h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Layout className="w-5 h-5" /> Template Preview
            </h2>

            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <TemplatePreview template={template} />
              </div>
            </div>

            {/* Color Palette */}
            {template && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Color Palette:</h3>
                <div className="flex gap-2 mb-4">
                  {template.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full shadow-sm border border-gray-200"
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-medium mb-1">Typography:</h3>
                    <p>{template.typography.characterization}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Layout:</h3>
                    <p>
                      {styleOptions.layout
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Export Button */}
            <div className="mt-6">
              <button className="flex items-center justify-center gap-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors w-full">
                <Download className="w-5 h-5" /> Export Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
