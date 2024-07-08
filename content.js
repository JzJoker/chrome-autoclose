//initialize variables
let inactiveTimer;
let warningTimer;
let inactiveDuration;
let autoCloseEnabled = true; // Default autoCloseEnabled state

// Function to close all tabs
const closeTabs = () => {
    this.autoCloseEnabled = chrome.storage.sync.get({ autoCloseEnabled });
    if(autoCloseEnabled)
        chrome.runtime.sendMessage({ action: "closeTabs" });
};

// Function to notify user
const notifyUser = () => {
    this.autoCloseEnabled = chrome.storage.sync.get({ autoCloseEnabled });
    if(autoCloseEnabled)
        chrome.runtime.sendMessage({ action: "notifyUser" });
};

// Function to handle activity and notify users
const startInactiveTimer = () => {
    if(!document.getElementById('popup')){
        if(warningTimer)
            clearTimeout(warningTimer);
        if(inactiveTimer)
            clearTimeout(inactiveTimer);
        this.autoCloseEnabled = chrome.storage.sync.get({ autoCloseEnabled });
        if (document.visibilityState === 'visible' && autoCloseEnabled) {
            warningTimer = setTimeout(notifyUser, inactiveDuration * 60 - 5000); // Notify 5 seconds before closing
            inactiveTimer = setTimeout(closeTabs, inactiveDuration * 60); // Close tabs after inactiveDuration
        }
    }
    
};

// Event listeners for mousemove, click, and keydown events
window.addEventListener("mousemove", function(){
    startInactiveTimer();
});
window.addEventListener("click", function(){
    startInactiveTimer();
});
window.addEventListener("keydown", function(){
    startInactiveTimer();
});

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        startInactiveTimer();
    } else {
        clearTimeout(warningTimer);
        clearTimeout(inactiveTimer);
    }
});

// Initialize settings from storage
chrome.storage.sync.get({
    inactiveDuration: 600,
    autoCloseEnabled: true
}, function(items) {
    inactiveDuration = items.inactiveDuration * 1000; // Convert seconds to milliseconds
    autoCloseEnabled = items.autoCloseEnabled;

    // Initialize inactive timer
    startInactiveTimer();
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize input and toggle state from storage
    chrome.storage.sync.get({
        inactiveDuration: 10,
        autoCloseEnabled: true
    }, function(items) {
        // Update slider and input value from storage
        document.getElementById('durationInput').value = items.inactiveDuration;
        document.getElementById('durationSlider').value = items.inactiveDuration;
        document.getElementById('autoCloseToggle').checked = items.autoCloseEnabled;
    });

    // Function to update storage only when slider handle is released
    const updateStorageOnSliderRelease = () => {
        let duration = parseFloat(document.getElementById('durationSlider').value);
        document.getElementById('durationInput').value = duration.toFixed(1); // Display one decimal place
        chrome.storage.sync.set({ inactiveDuration: duration });
    };

    // Event listener for input change
    document.getElementById('durationInput').addEventListener('input', function() {
        let duration = parseFloat(this.value);
        document.getElementById('durationSlider').value = duration;
        // Note: Do not update storage here
    });

    // Event listener for slider input change (on input)
    document.getElementById('durationSlider').addEventListener('input', function() {
        let duration = parseFloat(this.value); // Update input value immediately
        document.getElementById('durationInput').value = duration.toFixed(1); // Display one decimal place
    });

    // Event listener for slider change (on change)
    document.getElementById('durationSlider').addEventListener('change', updateStorageOnSliderRelease);

    // Event listener for toggle change
    document.getElementById('autoCloseToggle').addEventListener('change', function() {
        let autoCloseEnabled = this.checked;
        chrome.storage.sync.set({ autoCloseEnabled: autoCloseEnabled });
        //refresh pages
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(tab => {
                chrome.tabs.reload(tab.id);
            });
        });  
    });
});
