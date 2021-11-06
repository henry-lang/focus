chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(`Tab ID: ${tabId}\n change info: ${JSON.stringify(changeInfo)}, tab: ${JSON.stringify(tab)}`)
})