importScripts('popup/assets/js/getFromStorage.js')
let lastTabId = null
let extensionDomain = new URL(chrome.runtime.getURL('popup/blocked.html')).hostname

//noctural denotes the fact of the start and end times being the start and end times of rest, not work. This combats problems due to working through midnight

const parseTime = (time) => {
    // must be formatted in HH:MM
    let splitTime = time.split(':')
    let hours = parseInt(splitTime[0])
    let minutes = parseInt(splitTime[1])
    return hours * 60 + minutes
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    let date = new Date()
    let day = date.getDay()
    let minutesSinceMidnight = date.getHours() * 60 + date.getMinutes()
    let blocked = (await getFromStorage('timings'))[day]
    let start = parseTime(blocked.start)
    let end = parseTime(blocked.end)
    let fullurl = new URL(tab.url)
    let domain = fullurl.hostname

    if (domain == extensionDomain) {
        return
    }

    if (lastTabId != tabId) {
        if (
            (start <= minutesSinceMidnight < end && blocked.nocturnal == false) ||
            (!(start <= minutesSinceMidnight < end) && blocked.nocturnal == true)
        ) {
            if (blocked.blocklisted.includes(domain)) {
                for (let n = 0; n < blocked.allowlisted.length; n++) {
                    if (tab.url.startsWith(blocked.allowlisted[n])) {
                        break
                    }
                    if (n == blocked.allowlisted.length - 1) {
                        console.log(tabId)
                        chrome.tabs.remove(tabId)
                        chrome.tabs.create({url: chrome.runtime.getURL('popup/blocked.html')})
                        lastTabId = tabId
                    }
                }
            }
        }
    }
})

chrome.runtime.onConnect.addListener((connection) => {
    connection.onMessage.addListener(async (msg) => {
        /*
            Sent in one object:
            Type - one of the following cases.
            Day - 0..6
            Page? - String of the page of add/remove
            Time? - Time to change
        */
        let data = await getFromStorage('timings')
        switch (msg.type) {
            case 'add_page': {
                console.log('Add page was fired!')
                data[msg.day].blocklisted.push(msg.page)
                break
            }
            case 'delete_page': {
                data[msg.day].blocklisted = data[msg.day].blocklisted.filter(
                    (page) => page !== msg.page
                ) // Delete the page if it exists, if it doesn't nothing will happen
                break
            }
            case 'change_start': {
                data[msg.day].start = msg.time
                break
            }
            case 'change_end': {
                data[msg.day].end = msg.time
                break
            }
            default: {
                console.log('Unidentified type.')
                break
            }
        }
        chrome.storage.sync.set({timings: data})
    })
})

//fix this
chrome.runtime.onInstalled.addListener((details) => {
    // Ayush said foam.
    let defaultConfig = {
        nocturnal: false,
        start: '09:50',
        end: '20:30',
        blocklisted: ['https://example.com'],
        allowlisted: [
            'https://www.youtube.com/watch?v=LqA35eLEbug',
            'https://www.youtube.com/watch?v=jMtG9SyZfAc',
        ],
    }
    chrome.storage.sync.set({
        timings: {
            0: defaultConfig,
            1: defaultConfig,
            2: defaultConfig,
            3: defaultConfig,
            4: defaultConfig,
            5: defaultConfig,
            6: defaultConfig,
        },
    })
})
