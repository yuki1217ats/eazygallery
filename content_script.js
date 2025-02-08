chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "triggerClipboardButton") {
    // ページ内にある専用のUIボタン（ID: clipboardButton）を探してクリックする
    const btn = document.getElementById("clipboardButton");
    if (btn) {
      btn.click();
    } else {
      console.log("Clipboard button not found on this page.");
    }
  }
});