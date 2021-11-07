importScripts('popup/assets/js/getFromStorage.js')
let lastTabId = null
let extensionURL = chrome.runtime.getURL('popup/home.html')

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

    if (fullurl == extensionURL) {
        return
    }

    if (lastTabId != tabId) {
        if (
            (start <= minutesSinceMidnight < end && blocked.nocturnal == false) ||
            (!(start <= minutesSinceMidnight < end) && blocked.nocturnal == true)
        ) {
            if (blocked.blacklisted.includes(domain)) {
                for (let n = 0; n < blocked.whitelisted.length; n++) {
                    if (tab.url.startsWith(blocked.whitelisted[n])) {
                        break
                    }
                    if (n == blocked.whitelisted.length - 1) {
                        console.log(tabId)
                        chrome.tabs.remove(tabId)
                        chrome.tabs.create({url: chrome.runtime.getURL('popup/home.html')})
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
                data[msg.day].blacklisted.push(msg.page)
                break
            }
            case 'delete_page': {
                data[msg.day].blacklisted = data[msg.day].blacklisted.filter(
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
        // try {
        //     console.log('working!')
        //     let day = new Date().getDay()
        //     data = await get('timings')
        //     data[day].blacklisted.push(msg.page)
        //     chrome.storage.sync.set({timings: data})
        //     connection.postMessage({status: 'ok', data: data})
        // } catch (err) {
        //     connection.postMessage({status: err.toString()})
        // }
    })
})

//fix this
chrome.runtime.onInstalled.addListener((details) => {
    let defaultConfig = {
        nocturnal: false,
        start: '09:50',
        end: '20:30',
        blacklisted: ['www.youtube.com', 'lldamahldhphfhnpcnfnlmcamjnlhjij'],
        whitelisted: [
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
