let focusHeader = document.getElementById("focusH1")
let focus = document.getElementById("focusP")
let date = new Date()

const parseTime = (time) => {
    // must be formatted in HH:MM
    let splitTime = time.split(':')
    let hours = parseInt(splitTime[0])
    let minutes = parseInt(splitTime[1])
    return hours * 60 + minutes
}

function updateText() {
    getFromStorage('timings').then((data) => {
        data = data[date.getDay()]
        let start = parseTime(data.start)
        let end = parseTime(data.end)
        let minutesSinceMidnight = date.getHours() * 60 + date.getMinutes()
    
        if (
            (((start <= minutesSinceMidnight) & (minutesSinceMidnight < end)) && (data.nocturnal == false)) ||
            ((!((start <= minutesSinceMidnight) & (minutesSinceMidnight < end))) && (data.nocturnal == true))
        ) {
            let timeDiff = end - minutesSinceMidnight
            focus.innerHTML = `Blocklisted websites will remain blocked for ${Math.floor(timeDiff / 60)} hours and ${timeDiff % 60} minutes.`
        } else {
            focusHeader.innerHTML = "You're out of focus mode."
            focus.innerHTML = "Blocklisted websites can be freely accessed for ${"
        }
    })}

updateText()
setTimeout(updateText, 60000)