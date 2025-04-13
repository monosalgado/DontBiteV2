export async function analyzeEmailWithGemini(content, sender, subject, links, attachments, images) {
  const API_KEY = "AIzaSyAkwGLBRffH2EoRM70g4tapSKJ0VAgNnGA";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const prompt = {
    contents: [
      {
        parts: [
          {
            text: `You are a cybersecurity expert. Analyze the following email and determine if it is a phishing attempt.
  
  Sender Name: ${sender.senderName}
  Sender Email: ${sender.senderEmail}
  Subject: ${subject}
  
  Hyperlinks:
  ${links.length ? links.join('\n') : "None"}
  
  Attachments:
  ${attachments.length ? attachments.join('\n') : "None"}
  
  Images Detected:
  ${images.length ? images.map(src => `- ${src}`).join('\n') : "None"}
  
  Email Content:
  ${content}
  
  Please respond with YES or NO, followed by a short explanation of your reasoning.`
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
    const replyText = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const reply = replyText.toLowerCase();

    await chrome.storage.local.set({
      lastGeminiReason: replyText
    });

    console.log("🔍 Gemini reply parsed:", reply);

    return reply?.includes("yes");
  } catch (err) {
    console.error("❗ Fetch error:", err);
    return false;
  }
}
