chrome.commands.onCommand.addListener((command) => {
  if (command === "add-image-from-clipboard") {
    const targetUrl = "file:///Users/atsushiyukimoto/Desktop/automatorpy/gallery/index.html";
    chrome.tabs.query({}, (tabs) => {
      // すでにギャラリーページが開かれているかチェック
      let galleryTab = tabs.find(tab => tab.url === targetUrl);
      if (galleryTab) {
        // ギャラリーページが既にあれば、そのタブをフォーカスしてメッセージ送信
        chrome.tabs.update(galleryTab.id, { active: true }, () => {
          chrome.tabs.sendMessage(galleryTab.id, { action: "triggerClipboardButton" });
        });
      } else {
        // ギャラリーページがなければ、新しいタブを開いてからメッセージ送信
        chrome.tabs.create({ url: targetUrl, active: true }, (tab) => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (tabId === tab.id && info.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);
              chrome.tabs.sendMessage(tab.id, { action: "triggerClipboardButton" });
            }
          });
        });
      }
    });
  }
});