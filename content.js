//initialize variables
let inactiveTimer;
let warningTimer;
let displayTimer;
let inactiveDuration;
let autoCloseEnabled = true; // Default autoCloseEnabled state

// Function to close all tabs
const closeTabs = () => {
    chrome.runtime.sendMessage({ action: "closeTabs" });
};

// Function to notify user
const notifyUser = () => {
    chrome.runtime.sendMessage({ action: "notifyUser" });
};
// Function to update and display remaining time
const updateRemainingTime = (remainingSeconds) => {
    const timeRemainingElement = document.getElementById('time-remaining-text');
    timeRemainingElement.textContent = `Time remaining: ${remainingSeconds/1000} seconds`;
};

// Function to handle activity and notify users
const resetInactiveTimer = () => {
    clearTimeout(warningTimer);
    clearTimeout(inactiveTimer);
    clearInterval(displayTimer);

    if (document.visibilityState === 'visible' && autoCloseEnabled) {
        let remainingTime = inactiveDuration * 60;

        warningTimer = setTimeout(notifyUser, inactiveDuration * 60 - 5000); // Notify 5 seconds before closing
        inactiveTimer = setTimeout(closeTabs, inactiveDuration * 60); // Close tabs after inactiveDuration
        displayTimer = setInterval(()=> {
            remainingTime -=1000;
            if(remainingTime >=0) {
                updateRemainingTime(remainingTime);
            }
        }, 1000);
    }
};

// Event listeners for mousemove, click, and keydown events
window.addEventListener("mousemove", function(){
    resetInactiveTimer();
});
window.addEventListener("click", function(){
    resetInactiveTimer();
});
window.addEventListener("keydown", function(){
    resetInactiveTimer();
});

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        resetInactiveTimer();
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
    resetInactiveTimer();
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
        //refresh page
        chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
            chrome.tabs.reload(arrayOfTabs[0].id);
        });    });
});
