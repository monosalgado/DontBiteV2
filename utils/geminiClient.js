export async function analyzeEmailWithGemini(content) {
  const API_KEY = "AIzaSyAkwGLBRffH2EoRM70g4tapSKJ0VAgNnGA";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: `Analyze the following email. Is this a phishing attempt? Reply only with YES or NO:\n\n${content}`
          }
        ]
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Gemini API error:", errorText);
      return false;
    }

    const json = await res.json();
    const reply = json?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase();
    return reply?.includes("yes");
  } catch (err) {
    console.error("Fetch error:", err);
    return false;
  }
}
