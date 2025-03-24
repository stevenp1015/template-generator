import { useState, useEffect, useMemo, useCallback } from "react";
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
import { useTemplatePersistence } from "./hooks/useTemplatePersistence";


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

  const { savedTemplates, saveTemplate, deleteTemplate, renameTemplate } =
    useTemplatePersistence();
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  // Add a new state for the save dialog
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");

  // Add a function to handle saving templates
  const handleSaveTemplate = useCallback(() => {
    if (!template) return;

    // If the user hasn't specified a name, show the dialog
    if (!templateName) {
      setTemplateName(`Template ${savedTemplates.length + 1}`);
      setShowSaveDialog(true);
      return;
    }

    // Otherwise, save the template with the specified name
    const templateToSave = {
      ...template,
      name: templateName,
    };

    const templateId = saveTemplate(templateToSave);
    if (templateId) {
      // Clear the name and hide the dialog
      setTemplateName("");
      setShowSaveDialog(false);
    }
  }, [template, templateName, savedTemplates.length, saveTemplate]);

  // Add a function to load a saved template
  const loadTemplate = useCallback(
    (templateToLoad) => {
      if (!templateToLoad) return;

      // Extract the style options from the saved template
      const extractedStyleOptions = {
        style: templateToLoad.style,
        baseHue: templateToLoad.baseHue || styleOptions.baseHue,
        colorScheme: templateToLoad.colorScheme || styleOptions.colorScheme,
        typography: templateToLoad.typography?.fontFamily?.heading
          ? TypographyGenerator.fontPairings.find(
              (p) =>
                p.fontFamily?.heading ===
                templateToLoad.typography.fontFamily.heading
            )?.name || styleOptions.typography
          : styleOptions.typography,
        layout: templateToLoad.layout?.name || styleOptions.layout,
        seed: templateToLoad.seed || Math.random(),
      };

      // Update the style options to match the saved template
      setStyleOptions(extractedStyleOptions);

      // Force a regeneration
      setTimeout(generateTemplate, 0);
    },
    [styleOptions, setStyleOptions, generateTemplate]
  );

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
  const handleHueChange = useCallback(
    debounce((hue) => {
      setStyleOptions((prev) => ({ ...prev, baseHue: parseInt(hue) }));
    }, 100),
    []
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

  // Export function
  const handleExport = useCallback(() => {
    if (!template) return;

    // Export function
    if (!template) return;

    // Import html2canvas and jsPDF dynamically
    import("html2canvas").then((html2canvasModule) => {
      const html2canvas = html2canvasModule.default;
      import("jspdf").then((jsPDFModule) => {
        const { jsPDF } = jsPDFModule;

        // Show loading indicator
        const templateElement = document.querySelector(".template-preview");
        if (!templateElement) return;

        html2canvas(templateElement, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: false,
          backgroundColor: null,
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");

          // Create PDF with A4 dimensions
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          // Calculate aspect ratio to fit the template in the PDF
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const ratio = Math.min(
            pdfWidth / canvasWidth,
            pdfHeight / canvasHeight
          );

          const scaledWidth = canvasWidth * ratio;
          const scaledHeight = canvasHeight * ratio;

          // Center the image on the page
          const offsetX = (pdfWidth - scaledWidth) / 2;
          const offsetY = (pdfHeight - scaledHeight) / 2;

          pdf.addImage(
            imgData,
            "PNG",
            offsetX,
            offsetY,
            scaledWidth,
            scaledHeight
          );

          // Generate a filename based on template style and timestamp
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          pdf.save(`template-${styleOptions.style}-${timestamp}.pdf`);
        });
      });
    });
  }, [template, styleOptions?.style]);

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

        {/* Saved Templates Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl font-semibold mb-4">Save Template</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setShowSaveDialog(false);
                    setTemplateName("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={handleSaveTemplate}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Template Manager Dialog */}
        {showTemplateManager && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-4/5 h-4/5 overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Saved Templates</h2>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => setShowTemplateManager(false)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {savedTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No saved templates yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedTemplates.map((savedTemplate) => (
                    <div
                      key={savedTemplate.id}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="h-40 bg-gray-100 relative">
                        {/* Simplified preview of the template */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-32 border border-gray-300 bg-white flex flex-col">
                            <div
                              className="h-4 w-full"
                              style={{
                                backgroundColor:
                                  savedTemplate.colors?.[0] || "#ccc",
                              }}
                            />
                            <div className="flex-1 p-1">
                              <div className="h-2 w-3/4 bg-gray-200 mb-1" />
                              <div className="h-2 w-1/2 bg-gray-200" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium truncate">
                            {savedTemplate.name}
                          </h3>
                          <div className="flex gap-1">
                            <button
                              className="p-1 hover:bg-gray-100 rounded"
                              onClick={() => {
                                const newName = prompt(
                                  "Enter new name:",
                                  savedTemplate.name
                                );
                                if (newName && newName.trim()) {
                                  renameTemplate(
                                    savedTemplate.id,
                                    newName.trim()
                                  );
                                }
                              }}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </button>
                            <button
                              className="p-1 hover:bg-gray-100 rounded text-red-500"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this template?"
                                  )
                                ) {
                                  deleteTemplate(savedTemplate.id);
                                }
                              }}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {savedTemplate.colors?.map((color, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full border border-gray-200"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>

                        <div className="text-xs text-gray-500 mb-2">
                          {savedTemplate.style?.charAt(0).toUpperCase() +
                            savedTemplate.style?.slice(1) || "Unknown"}{" "}
                          ·
                          {savedTemplate.typography?.characterization ||
                            "Unknown typography"}
                        </div>

                        <div className="flex justify-between">
                          <button
                            className="text-sm py-1 px-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => {
                              loadTemplate(savedTemplate);
                              setShowTemplateManager(false);
                            }}
                          >
                            Load
                          </button>
                          <span className="text-xs text-gray-400">
                            {new Date(
                              savedTemplate.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Preview Area */}
        {/* Replace the Preview Area div block */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-lg shadow-md p-6 h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Layout className="w-5 h-5" /> Template Preview
            </h2>

            <div className="flex justify-center">
              <div className="w-full max-w-4xl mx-auto">
                {/* Enhanced shadow and styling */}
                <div className="shadow-lg transition-all duration-300 hover:shadow-xl rounded-lg overflow-hidden">
                  <TemplatePreview template={template} />
                </div>
              </div>
            </div>

            {/* Enhanced Color Palette display */}
            {template && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Color Palette:</h3>
                  <div className="flex gap-2 mb-4">
                    {template.colors.map((color, i) => (
                        <div
                            key={i}
                            className="w-8 h-8 rounded-full shadow-sm transform hover:scale-110 transition-transform"
                            style={{
                              backgroundColor: color,
                              border: color === '#ffffff' ? '1px solid #e0e0e0' : 'none'
                            }}
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
              <button
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors w-full"
                  onClick={handleExport}
              >
                <Download className="w-5 h-5" /> Export Template
              </button>
            </div>
          </div>
            <div className="mt-4 flex gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
                onClick={() => setShowSaveDialog(true)}
              >
                Save Template
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700 transition-colors"
                onClick={() => setShowTemplateManager(true)}
              >
                Manage Templates
              </button>
              {savedTemplates.length > 0 && (
                <div className="relative flex-1">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                    onChange={(e) => {
                      const templateId = e.target.value;
                      if (templateId) {
                        const templateToLoad = savedTemplates.find(
                          (t) => t.id === templateId
                        );
                        if (templateToLoad) {
                          loadTemplate(templateToLoad);
                        }
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Load Template
                    </option>
                    {savedTemplates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>)
};

export default App;
