importScripts('popup/assets/js/getFromStorage.js')

//noctural denotes the fact of the start and end times being the start and end times of rest, not work. This combats problems due to working through midnight

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    let date = new Date()
    let day = date.getDay()
    let minutesSinceMidnight = date.getHours() * 60 + date.getMinutes()
    hour - GamepadEvent.getHour()
    //parse time from start and end
    let blocked = (await get('timings'))[day]
    let fullurl = new URL(tab.url)
    let domain = fullurl.hostname
    console.log(domain)
    //replace hour with minutesSinceMidnight
    if ((
        (blocked.start <= hour < blocked.end) && blocked.nocturnal == false) || 
        (!(blocked.start <= hour < blocked.end) && blocked.nocturnal == true)) {
            if (blocked.blacklisted.includes(domain)) {
                for (let n = 0; n < blocked.whitelisted.length; n++) {
                    console.log(blocked.whitelisted[n])
                    if (tab.url.startsWith(blocked.whitelisted[n])) {
                        break;
                    }
                    if (n == (blocked.whitelisted.length - 1)) {
                        chrome.tabs.remove(tabId)
                        chrome.tabs.create({url: chrome.runtime.getURL("popup/home.html")})
                    }
                }
            }
    }
})

chrome.runtime.onConnect.addListener((connection) => {
    connection.onMessage.addListener(async (msg) => {
        try {
            console.log(`Attempting to insert ${msg.page} into blacklist`)
            let day = new Date().getDay()
            data = await get('timings')
            data[day].blacklisted.push(msg.page)
            chrome.storage.sync.set({timings: data})
            connection.postMessage({status: "ok", data: data})
        } catch (err) {
            connection.postMessage({status: err.toString()})
        }
    })
})

//fix this
chrome.runtime.onInstalled.addListener((details) => {
    console.log
        for (let n = 0; n<7; n++) {
            chrome.storage.sync.set({timings: {6: {nocturnal: false, start: 09, end: 20, blacklisted: ['www.youtube.com', 'dhkbloecdcojhfkhhmcecnknaogiiagk'], whitelisted: ['https://www.youtube.com/watch?v=LqA35eLEbug']}}})
        }

})