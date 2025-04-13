export async function analyzeEmailWithGemini(content) {
  const API_KEY = "AIzaSyAkwGLBRffH2EoRM70g4tapSKJ0VAgNnGA";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const prompt = {
    contents: [
      {
        parts: [
          {
            text: `You are a cybersecurity expert. Carefully analyze the following email and determine if it is a phishing attack. Reply with just "YES" or "NO".\n\n${content}`
          }
        ]
      }
    ]
  };

  console.log("📤 Sending to Gemini API:", JSON.stringify(prompt, null, 2));

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(prompt)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Gemini API error response:", errorText);
      return false;
    }

    const json = await res.json();
    console.log("📥 Gemini API response:", JSON.stringify(json, null, 2));

    const reply = json?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase();
    console.log("🔍 Gemini reply parsed:", reply);

    return reply?.includes("yes");
  } catch (err) {
    console.error("❗ Fetch error:", err);
    return false;
  }
}
