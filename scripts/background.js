// background.js
// scripts/background.js
import {analyzeEmailWithGemini} from "../utils/geminiClient.js";


const API_KEY = "AIzaSyAkwGLBRffH2EoRM70g4tapSKJ0VAgNnGA"; // Replace this with your actual key
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY;

// Track stats
let stats = {
  emailsAnalyzed: 0,
  threatsDetected: 0
};

// On install/init: load stats from storage
chrome.runtime.onStartup.addListener(loadStats);
chrome.runtime.onInstalled.addListener(loadStats);

function loadStats() {
  chrome.storage.local.get(["emailsAnalyzed", "threatsDetected"], (data) => {
    stats.emailsAnalyzed = data.emailsAnalyzed || 0;
    stats.threatsDetected = data.threatsDetected || 0;
  });
}

// Listen for email analysis requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "analyze_email") {
    const emailText = message.content;

    analyzeEmailWithGemini(emailText).then((isPhishing) => {
      stats.emailsAnalyzed++;
      if (isPhishing) stats.threatsDetected++;

      // Save updated stats
      chrome.storage.local.set({
        emailsAnalyzed: stats.emailsAnalyzed,
        threatsDetected: stats.threatsDetected,
        lastEmailThreat: isPhishing
      });

      sendResponse({ status: "done", isPhishing });
    });

    // Return true to indicate async response
    return true;
  }
});


