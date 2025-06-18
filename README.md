# Don't Bite! 🎣🛡️

A Chrome extension that protects users from phishing emails by alerting them in real-time—inspired by the Colombian saying *"el pez muere por la boca"* (the fish dies by its mouth).

## Features
- Real-time detection of fraudulent emails  
- Visual pop-up alerts to warn users  
- Powered by Google Gemini API for phishing analysis  

## How It Works
1. The extension scans email content in your browser  
2. Gemini API analyzes text for phishing indicators  
3. If risky content is detected, a fish-themed alert appears to remind you: *Don't bite the bait!*  

## Built With
- HTML/CSS  
- JavaScript  
- Google Gemini API  

## Challenges & Learnings
- First-time frontend development  
- API integration hurdles  
- Prioritizing core features under time constraints  

## Future Goals
- Improve detection accuracy  
- Expand to spoofing/MITM attacks  
- Add educational prompts for users  

## Try It Out
1. Clone this repo
2. You need to add your own Gemini API to the file: `utils/geminiClient.js`
3. Load the extension in Chrome via `chrome://extensions` (Developer Mode)  
4. Test with sample phishing emails  

## Team
- [Paula Briceno](https://github.com/awd12p3)  
- [David Salgado](https://github.com/monosalgado)  

*Created during Hackabull 2025*  
