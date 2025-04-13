// utils/geminiClient.js

export async function analyzeEmailWithGemini(content) {
    const API_KEY = "AIzaSyD30dhXhuLViQpjEx6_biewIy9o2lrRpJo";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
  
    const body = {
      contents: [
        {
          parts: [
            { text: `Is this phishing? Just say YES or NO:\n\n${content}` }
          ]
        }
      ]
    };
  
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
  
      const json = await res.json();
      const reply = json?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase();
  
      return reply?.includes("yes");
    } catch (err) {
      console.error("Gemini error:", err);
      return false;
    }
  }
  