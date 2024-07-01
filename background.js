// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "closeTabs") {
        // Close all tabs
        chrome.tabs.query({}, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.remove(tabs[i].id);
            }
        });
    } else if (message.action === "changeIcon") {
        // Change the extension icon to closing image
        chrome.action.setIcon({path: "images/close.png"});
    } else if (message.action === "resetIcon") {
        // Change the extension icon to default iamge
        chrome.action.setIcon({path: "images/icon12.png"})
    }
  });