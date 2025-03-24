// Create a new file: src/hooks/useTemplatePersistence.js
import { useState, useEffect, useCallback } from "react";

export const useTemplatePersistence = () => {
  const [savedTemplates, setSavedTemplates] = useState([]);

  // Load templates from localStorage on initial render
  useEffect(() => {
    try {
      const storedTemplates = localStorage.getItem("savedTemplates");
      if (storedTemplates) {
        setSavedTemplates(JSON.parse(storedTemplates));
      }
    } catch (error) {
      console.error("Failed to load templates from localStorage:", error);
    }
  }, []);

  // Save a template
  const saveTemplate = useCallback(
    (template) => {
      if (!template) return;

      try {
        // Create a template object with metadata
        const templateToSave = {
          ...template,
          id: `template_${Date.now()}`,
          createdAt: new Date().toISOString(),
          name: `Template ${savedTemplates.length + 1}`,
        };

        // Add to state
        const newSavedTemplates = [...savedTemplates, templateToSave];
        setSavedTemplates(newSavedTemplates);

        // Persist to localStorage
        localStorage.setItem(
          "savedTemplates",
          JSON.stringify(newSavedTemplates)
        );

        return templateToSave.id;
      } catch (error) {
        console.error("Failed to save template:", error);
        return null;
      }
    },
    [savedTemplates]
  );

  // Delete a template
  const deleteTemplate = useCallback(
    (templateId) => {
      try {
        const newSavedTemplates = savedTemplates.filter(
          (t) => t.id !== templateId
        );
        setSavedTemplates(newSavedTemplates);
        localStorage.setItem(
          "savedTemplates",
          JSON.stringify(newSavedTemplates)
        );
      } catch (error) {
        console.error("Failed to delete template:", error);
      }
    },
    [savedTemplates]
  );

  // Rename a template
  const renameTemplate = useCallback(
    (templateId, newName) => {
      try {
        const newSavedTemplates = savedTemplates.map((t) =>
          t.id === templateId ? { ...t, name: newName } : t
        );
        setSavedTemplates(newSavedTemplates);
        localStorage.setItem(
          "savedTemplates",
          JSON.stringify(newSavedTemplates)
        );
      } catch (error) {
        console.error("Failed to rename template:", error);
      }
    },
    [savedTemplates]
  );

  return {
    savedTemplates,
    saveTemplate,
    deleteTemplate,
    renameTemplate,
  };
};
