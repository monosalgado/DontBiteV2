// content.js

let lastEmailId = null;

function getEmailBody() {
  // Gmail uses iframes and dynamic divs; we need to locate the actual email content
  const emailBody = document.querySelector('div.a3s.aiL'); // Gmail-specific class
  return emailBody ? emailBody.innerText : null;
}

function checkForNewEmail() {
  const emailContent = getEmailBody();

  // Skip if no email is open or same email as last time
  if (!emailContent || emailContent === lastEmailId) return;

  lastEmailId = emailContent;

  // Send message to background to analyze
  chrome.runtime.sendMessage({
    type: "analyze_email",
    content: emailContent
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Message send failed:", chrome.runtime.lastError);
      return;
    }
    console.log("Background response:", response);
  });
}

// Gmail is a dynamic SPA – observe DOM changes
const observer = new MutationObserver(() => {
  checkForNewEmail();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial run in case something is already open
checkForNewEmail();
