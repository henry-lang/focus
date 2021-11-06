importScripts('popup/assets/js/getFromStorage.js')

chrome.storage.sync.set({timings: {
    //noctural denotes the fact of the start and end times being the start and end times of rest, not work. This combats problems due to working through midnight
    6: {nocturnal: false, start: 09, end: 14, blacklisted: ['www.reddit.com'], whitelisted: ['https://www.reddit.com/u']}, 7: {nocturnal: false, start: 10, end: 14, blacklisted: ['www.reddit.com'], whitelisted: ['www.reddit.com/u']}
}})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    let date = new Date()
    let day = date.getDay()
    let hour = date.getHours()
    let blocked = (await get('timings'))[day]
    let fullurl = new URL(tab.url)
    let domain = fullurl.hostname
    console.log(domain)
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