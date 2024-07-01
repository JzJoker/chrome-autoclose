chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    if (message.action === "closeTabs") {
        // Close all tabs
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(tab => {
                chrome.tabs.remove(tab.id);
            });
        });
    } else if (message.action === "notifyUser") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "images/icon12.png",
            title: "Your Extension Name",
            message: "Chrome will be closing in 5 seconds due to inactivity",
            buttons: [{ title: "Dismiss" }]
        }, notificationId => {
            console.log("Notification created:", notificationId);
        });
    }
});
