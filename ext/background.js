async function get(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(key, (value) => {resolve(value[key])})
        } catch (err) {reject(err)}
    })
}

chrome.storage.sync.set({timings: {
    //noctural denotes the fact of the start and end times being the start and end times of rest, not work. This combats problems due to working through midnight
    6: {nocturnal: false, start: 09, end: 14, blacklisted: ['https://www.reddit.com/']}
}})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    let date = new Date()
    let day = date.getDay()
    let hour = date.getHours()
    let blocked = (await get('timings'))[day]

    if ((
        (blocked.start < hour < blocked.end) && blocked.nocturnal == false) || 
        (!(blocked.start < hour < blocked.end) && blocked.nocturnal == true)) {
            if (blocked.blacklisted.includes(tab.url)) {
                chrome.tabs.remove(tabId)
                chrome.tabs.create({url: chrome.runtime.getURL("popup/home.html")})
            }
    }
})