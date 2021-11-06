let pages = []
let selectedDay = 0

let pageList = document.getElementById('page-list')
let pageAdd = document.getElementById('page-add')
let pageAddBtn = document.getElementById('page-add-btn')
let pageAddText = document.getElementById('page-add-text')

let daySelect = document.getElementById('day-select')

let startTime = document.getElementById('start-time')
let endTime = document.getElementById('end-time')

let msgConnection = chrome.runtime.connect({ name: 'list.js' })

const getTimes = async (day) => {
    let data = await getFromStorage('timings')
    let start = data[day].start
    let end = data[day].end
    startTime.value = start
    endTime.value = end
}

const validatePage = (value) => {
    if (pages.includes(value)) return false
    return true
}

const getPageElement = (value) => {
    let baseNode = document.createElement('li')
    baseNode.className = 'page'
    baseNode.innerText = value

    let deleteNode = document.createElement('button')
    deleteNode.addEventListener('click', () => {
        baseNode.remove()
        pages = pages.filter((page) => page !== value)
        msgConnection.postMessage({ type: 'delete_page', day: selectedDay, page: value })
    })
    deleteNode.className = 'page-delete'

    let imageNode = document.createElement('img')
    imageNode.src = 'assets/delete.svg'

    deleteNode.appendChild(imageNode)
    baseNode.appendChild(deleteNode)

    return baseNode
}

const addPage = (value, isInitial) => {
    // Ayush is smart :)
    let pageElement = getPageElement(value)
    pageList.insertBefore(pageElement, pageAdd)
    pages.push(value)

    if (!isInitial) {
        msgConnection.postMessage({ type: 'add_page', day: selectedDay, page: value })
    }
}

const addInitialPages = async (day) => {
    // Clear pages list in the code and the DOM element list.
    pages = []
    let data = await getFromStorage('timings')
    while (pageList.children.length > 1) {
        pageList.firstChild.remove()
    }
    data[day].blacklisted.map((page) => {
        addPage(page, true)
    })
}

pageAddBtn.addEventListener('click', () => {
    let value = pageAddText.value
    if (!validatePage(value)) return
    pageAddText.value = ''
    addPage(value, false)
})

pageAddText.addEventListener('keyup', (event) => {
    if (event.keyCode == 13) {
        addPage(pageAddText.value, false)
        pageAddText.value = ''
    }
})

daySelect.addEventListener('change', () => {
    selectedDay = daySelect.value
    getTimes(selectedDay)
    addInitialPages(selectedDay)
})

startTime.addEventListener('change', () => {
    msgConnection.postMessage({ type: 'change_start', day: selectedDay, time: startTime.value })
})

endTime.addEventListener('change', () => {
    msgConnection.postMessage({ type: 'change_end', day: selectedDay, time: endTime.value })
})

addInitialPages(0) // First, get pages for Sunday which is the default
getTimes(0) // And get times for Sunday as well