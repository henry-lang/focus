import get from './getFromStorage.js'
let pages = []

let pageList = document.getElementById('page-list')
let pageAdd = document.getElementById('page-add')
let pageAddBtn = document.getElementById('page-add-btn')
let pageAddText = document.getElementById('page-add-text')
let daySelect = document.getElementById('day-select')

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
        console.log(pages)
    })
    deleteNode.className = 'page-delete'

    let imageNode = document.createElement('img')
    imageNode.src = 'assets/delete.svg'

    deleteNode.appendChild(imageNode)
    baseNode.appendChild(deleteNode)

    return baseNode
}

const addPage = (value) => {
    let pageElement = getPageElement(value)
    pageList.insertBefore(pageElement, pageAdd)

    pages.push(value)
}

const deletePage = (value) => {
    pageList.children.map((page) => {
        if (page.innerText == value) page.remove()
    })
}

const addInitialPages = async (day) => {
    pages = []
    let data = await get('timings')
    while (pageList.children.length > 1) {
        pageList.firstChild.remove()
    }
    data[day].blacklisted.map(page => {
        addPage(page)
    })
}

pageAddBtn.addEventListener('click', () => {
    let value = pageAddText.value
    if (!validatePage(value)) return
    pageAddText.value = ''
    addPage(value)
})

daySelect.addEventListener('change', () => {
    let day = daySelect.value
    console.log(day)
    addInitialPages(day)
})

pageAddText.addEventListener("keyup", (event) => {
    if (event.keyCode == 13) {
        addPage(pageAddText.value)
        pageAddText.value = ''
    }
})

addInitialPages(0) // First, get pages for Sunday which is the default
