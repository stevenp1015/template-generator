import { useState, useCallback } from "react";

export const useQwenAPI = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const getAISuggestions = useCallback(async () => {
    if (!prompt) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer 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",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "qwen/qwq-32b:free",
            messages: [
              {
                role: "system",
                content:
                  'You are a professional design assistant specializing in document template design. Your task is to provide specific design suggestions based on the user\'s input. Format your response as JSON with these fields: { "style": string, "colorScheme": string, "typography": string, "layout": string, "designNotes": string[] }. For style, choose from: corporate, creative, minimal, abstract. For colorScheme, choose from: monochromatic, complementary, analogous, triadic, split-complementary. For typography, choose from: Classic Serif/Sans, Modern Sans, Corporate Professional, Elegant Contrast, Creative Modern, Technical Clarity, Friendly Professional. For layout, choose from: classic-document, modern-split, asymmetric, presentation, infographic. Provide 3-5 specific design notes that would improve this template.',
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("API Response Data:", data); // Add this line!

      if (data.choices && data.choices[0] && data.choices[0].message) {
        try {
          // Parse the response as JSON
          setAiSuggestions(JSON.parse(data.choices[0].message.content));
        } catch (error) {
          console.error("Error calling Qwen API:", error);
          // Return default suggestions if API call fails
          setAiSuggestions({
            style: "minimal",
            colorScheme: "monochromatic",
            typography: "Modern Sans",
            layout: "classic-document",
            designNotes: [
              "Keep the design clean and minimal for readability",
              "Use white space effectively to create visual hierarchy",
              "Consider using subtle graphical elements for visual interest",
            ],
          });
        }
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error calling Qwen API:", error);
      // Return default suggestions if API call fails
      setAiSuggestions({
        style: "minimal",
        colorScheme: "monochromatic",
        typography: "Modern Sans",
        layout: "classic-document",
        designNotes: [
          "Keep the design clean and minimal for readability",
          "Use white space effectively to create visual hierarchy",
          "Consider using subtle graphical elements for visual interest",
        ],
      });
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return {
    prompt,
    setPrompt,
    isLoading,
    aiSuggestions,
    getAISuggestions,
  };
};
