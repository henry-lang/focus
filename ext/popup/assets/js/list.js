let pages = []

let pageList = document.getElementById('page-list')
let pageAdd = document.getElementById('page-add')
let pageAddBtn = document.getElementById('page-add-btn')
let pageAddText = document.getElementById('page-add-text')

const validatePage = (value) => {}

const addPage = (value) => {
    let node = document.createElement('li')
    node.innerText = value
    pageList.insertBefore(node, pageAdd)

    pages.push(value)
}

const deletePage = () => {}

const addInitialPages = () => {
    // Just initial pages for now
    ;['chungus.xyz', 'poop.china', 'amongus.com', 'sussy.bk'].map((value) => {
        addPage(value)
    })
}

pageAddBtn.addEventListener('click', () => {
    let value = pageAddText.value
    // if (!validatePage(value)) return
    pageAddText.value = ''
    addPage(value)
})

addInitialPages()
