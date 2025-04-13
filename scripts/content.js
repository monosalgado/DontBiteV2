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


  if (!emailContent) {
    console.log("⚠️ No email body found");
    return;
  }

  console.log("📤 Sending for analysis:", { sender, currentEmailId });

  chrome.runtime.sendMessage(
    {
      type: "analyze_email",
      content: emailContent,
      subject: subject,
      links: links,
      sender: sender
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Message send failed:", chrome.runtime.lastError);
        return;
      }
      console.log("📩 Background response:", response);
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
