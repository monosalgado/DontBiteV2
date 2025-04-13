let lastEmailId = null;

function getEmailBody() {
  const emailBody = document.querySelector('div.a3s.aiL');
  return emailBody ? emailBody.innerText : null;
}

function getSenderInfo() {
  const senderElement = document.querySelector("span.gD");
  const senderName = senderElement?.innerText || "Unknown";
  const senderEmail = senderElement?.getAttribute("email") || "Unknown";
  return { senderName, senderEmail };
}

function getEmailId() {
  const subject = document.querySelector("h2.hP")?.innerText || "";
  const senderEmail = document.querySelector("span.gD")?.getAttribute("email") || "";
  return subject + senderEmail;
}

function getEmailSubject() {
  return document.querySelector("h2.hP")?.innerText || "No Subject";
}

function extractHyperlinks() {
  const links = Array.from(document.querySelectorAll("div.a3s.aiL a"));
  return links.map(a => a.href).filter(href => href.startsWith("http"));
}

function getAttachmentInfo() {
  const attachmentElements = document.querySelectorAll('div.aQH span.aV3');
  return Array.from(attachmentElements).map(el => el.innerText.trim());
}

function getImageSources() {
  return Array.from(document.querySelectorAll('div.a3s.aiL img')).map(img => img.src);
}

function showFloatingAlert() {
  // Prevent duplicates
  if (document.getElementById("dontbite-alert")) return;

  const alertBox = document.createElement("div");
  alertBox.id = "dontbite-alert";
  alertBox.innerText = "🚨 DONT BITE — Phishing Email Detected!";
  alertBox.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    background-color: #8B0000;
    color: #fff;
    font-size: 16px;
    font-family: 'Courier New', Courier, monospace;
    padding: 12px 16px;
    border: 2px solid #ff4444;
    border-radius: 8px;
    box-shadow: 0 0 10px #ff0000;
    animation: glitch 1s infinite alternate;
  `;

  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.remove();
  }, 10000); // Auto-remove after 10 seconds
}

function checkForNewEmail() {
  const currentEmailId = getEmailId();
  console.log("🔍 Checking email ID:", currentEmailId);

  if (!currentEmailId || currentEmailId === lastEmailId) {
    console.log("⛔ Skipped — duplicate or invalid email");
    return;
  }

  lastEmailId = currentEmailId;

  const emailContent = getEmailBody();
  const sender = getSenderInfo();
  const subject = getEmailSubject();
  const links = extractHyperlinks();
  const attachments = getAttachmentInfo();
  const images = getImageSources();


  if (!emailContent) {
    console.log("⚠️ No email body found");
    return;
  }

  console.log("📤 Sending for analysis:", { sender, currentEmailId });

  chrome.runtime.sendMessage(
    {
      type: "analyze_email",
      content: emailContent,
      sender: sender,
      subject: subject,
      links: links,
      attachments: attachments,
      images: images
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Message send failed:", chrome.runtime.lastError);
        return;
      }
  
      console.log("📩 Background response:", response);
  
      // 👉 Trigger floating alert if phishing is detected
      if (response?.isPhishing) {
        showFloatingAlert();
      }
    }
  );  
}




// 🔁 MutationObserver to detect new emails in Gmail's SPA interface
const observer = new MutationObserver(() => {
  checkForNewEmail();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Run once at start
checkForNewEmail();

console.log("✅ DontBite content script loaded.");

const style = document.createElement("style");
style.textContent = `
@keyframes glitch {
  0%   { transform: translate(0px, 0px) rotate(0deg); }
  25%  { transform: translate(-1px, 1px) rotate(-1deg); }
  50%  { transform: translate(1px, -1px) rotate(1deg); }
  75%  { transform: translate(-1px, 1px) rotate(0deg); }
  100% { transform: translate(1px, -1px) rotate(-1deg); }
}
`;
document.head.appendChild(style);
