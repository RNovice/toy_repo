const getJson = async() => { 
    const res = await fetch('words.json') 
    return await res.json() 
} 
 
const includes = document.getElementById('includes') 
const includesContainer = document.getElementById('includes-container') 
 
const excludes = document.getElementById('excludes') 
const excludesContainer = document.getElementById('excludes-container') 
 
const composeds = document.getElementById('composed') 
const composedContainer = document.getElementById('composed-container') 
const composedSwitch = document.getElementById('composed-mode') 
 
const addIndex = document.getElementById('add-index') 
const minusIndex = document.getElementById('minus-index') 
const positionIndex = document.getElementById('position-index') 
const indexLetter = document.getElementById('index-letter') 
const inpositionContainer = document.getElementById('inposition-container') 
 
const addNotdex = document.getElementById('add-notdex') 
const minusNotdex = document.getElementById('minus-notdex') 
const positionNotdex = document.getElementById('position-notdex') 
const notdexLetter = document.getElementById('notdex-letter') 
const notpositionContainer = document.getElementById('notposition-container') 
 
const wordContainer = document.getElementById('words') 
const findBtn = document.getElementById('find-btn') 
const renMore = document.querySelector('.more') 
const removeSwitch = document.getElementById('remove') 
 
let words = [] 
async function makeWordList() { 
    const wordsJson = await getJson() 
    for(let i in wordsJson){ words.push(i) } 
} 
makeWordList() 
 
 
let lens = 0 
let locaKnows = {} 
let locaList = [] 
let notLoca = {} 
let knows = [] 
let notExist = [] 
let composed = [] 
let filtered = [] 
let renderSet = [] 
let renderCount = 1 
let removeMode = false 
 
function WordFilter() { 
    filtered = words 
 
    if(lens){ 
        filtered = filtered.filter(word => word.length === lens) 
    } 
     
    if(locaKnows){ 
        for(let i in locaKnows){ 
            locaKnows[i].forEach(e => { 
                filtered = filtered.filter(word => word[e-1] === i) 
            }) 
        } 
    } 
 
    if(notLoca){ 
        for(let i in notLoca){ 
            notLoca[i].forEach(e => { 
                filtered = filtered.filter(word => word[e-1] !== i) 
            }) 
        } 
    } 
     
    if(knows.length){ 
        knows.forEach(e => { 
            filtered = filtered.filter(word => word.includes(e)) 
        }) 
    } 
     
    if(notExist.length){ 
        notExist.forEach(e => { 
            filtered = filtered.filter(word => !word.includes(e)) 
        }) 
    } 
 
    if(composed.length){ 
        let alp = 'abcdefghijklmnopqrstuvwxyz'.split('') 
        let allComposed = composed.concat(knows).concat(Object.keys(locaKnows)) 
        allComposed.forEach(e => { 
            alp = alp.filter(letter => letter !== e) 
        }) 
        alp.forEach(e => { 
            filtered = filtered.filter(word => !word.includes(e)) 
        }) 
    } 
 
    if(filtered.length === 0){ 
        alert("sorry we don't have the word you need") 
    } 
 
    return filtered 
} 
 
function WordRender(data) { 
 
    renderSet = [] 
    renderCount = 1 
    for(let i = 0; i <= data.length; i += 50){ 
        renderSet.push(data.slice(i, i+50)) 
    } 
    document.getElementById('words').innerHTML = '' 
    renderSet[0].forEach(e => { 
        document.getElementById('words').innerHTML += `<span class="found-word">${e}</span>`
    }) 
    if(renderSet.length>2){ 
        renMore.innerHTML = '<button id="more">more</button>' 
        document.getElementById("more").scrollIntoView() 
    } 
    removeSwitch.style.visibility = 'visible' 
     
} 
 
includes.addEventListener('keyup', e => { 
    const target = e.target 
    if(e.key === 'Backspace' && includesContainer.innerHTML) { 
        knows = knows.filter(e => e !== includesContainer.lastElementChild.textContent.toLowerCase()) 
    } else if(target.value && !knows.includes(target.value.toLowerCase())) { 
        !notExist.includes(target.value.toLowerCase()) ? knows.push(target.value.toLowerCase()) : alert(target.value.toUpperCase() + ' is excluded letter') 
    } 
    includesContainer.innerHTML = '' 
    knows.forEach(e => { 
        includesContainer.innerHTML += `<span class="include-letter item">${e}</span>` 
    }) 
    target.value ='' 
}) 
 
excludes.addEventListener('keyup', e => { 
    const target = e.target 
    if(e.key === 'Backspace' && excludesContainer.innerHTML) { 
        notExist = notExist.filter(e => e !== excludesContainer.lastElementChild.textContent.toLowerCase()) 
    } else if(target.value && !notExist.includes(target.value.toLowerCase())) { 
        !knows.includes(target.value.toLowerCase()) && !locaKnows.hasOwnProperty(target.value.toLowerCase()) ? notExist.push(target.value.toLowerCase()) : alert(target.value.toUpperCase() + ' is included letter') 
    } 
    excludesContainer.innerHTML = '' 
    notExist.forEach(e => { 
        excludesContainer.innerHTML += `<span class="exclude-letter item">${e}</span>` 
    }) 
    target.value ='' 
}) 
 
composeds.addEventListener('keyup', e => { 
    const target = e.target 
    if(e.key === 'Backspace' && composedContainer.innerHTML) { 
        composed = composed.filter(e => e !== composedContainer.lastElementChild.textContent.toLowerCase()) 
    } else if(target.value && !composed.includes(target.value.toLowerCase())) { 
        !notExist.includes(target.value.toLowerCase()) ? composed.push(target.value.toLowerCase()) : alert(target.value.toUpperCase() + ' is excluded letter') 
    } 
    composedContainer.innerHTML = '' 
    composed.forEach(e => { 
        composedContainer.innerHTML += `<span class="composed-letter item">${e}</span>` 
    }) 
    target.value ='' 
}) 
 
addIndex.addEventListener('click', e => { 
    if(positionIndex.value && indexLetter.value){ 
        if(!locaList.includes(positionIndex.value)){ 
            locaList.push(positionIndex.value) 
            locaKnows[indexLetter.value.toLowerCase()] ? locaKnows[indexLetter.value.toLowerCase()].push(+positionIndex.value) : locaKnows[indexLetter.value.toLowerCase()] = [+positionIndex.value] 
            inpositionContainer.innerHTML = '' 
            for(let i in locaKnows){ 
                locaKnows[i].forEach(e => { 
                    inpositionContainer.innerHTML += `<span class="inposition item">${e}:${i}</span>` 
                }) 
            positionIndex.value = '' 
            indexLetter.value = '' 
            }             
        } else { 
            alert('position ' + positionIndex.value + ' already exists') 
        } 
    } 
}) 
 
minusIndex.addEventListener('click', e => { 
    if(inpositionContainer.innerHTML){ 
        const target = inpositionContainer.lastElementChild.textContent.toLowerCase().split(':') 
        locaKnows[target[1]] = locaKnows[target[1]].filter(e => e !== +target[0]) 
        locaList = locaList.filter(e => e !== target[0]) 
        inpositionContainer.lastElementChild.remove() 
    } 
}) 
 
addNotdex.addEventListener('click', e => { 
    if(positionNotdex.value && notdexLetter.value){ 
        notLoca[notdexLetter.value.toLowerCase()] ? notLoca[notdexLetter.value.toLowerCase()].push(+positionNotdex.value) : notLoca[notdexLetter.value.toLowerCase()] = [+positionNotdex.value] 
        notpositionContainer.innerHTML = '' 
        for(let i in notLoca){ 
            notLoca[i].forEach(e => { 
                notpositionContainer.innerHTML += `<span class="notposition item">${e}:${i}</span>` 
            }) 
        positionNotdex.value = '' 
        notdexLetter.value = '' 
        } 
    } 
}) 
 
minusNotdex.addEventListener('click', e => { 
    if(notpositionContainer.innerHTML){ 
        const target = notpositionContainer.lastElementChild.textContent.toLowerCase().split(':') 
        notLoca[target[1]] = notLoca[target[1]].filter(e => e !== +target[0]) 
        notpositionContainer.lastElementChild.remove() 
    } 
}) 
 
findBtn.addEventListener('click', e => { 
    lens = +(document.getElementById('length').value) 
    WordRender(WordFilter()) 
}) 
 
renMore.addEventListener('click', e => { 
    const target = e.target 
    let sw = true 
    if(target.id === 'more' && renderSet.length > renderCount){ 
        renderCount % 2 ? sw = 'found-word fw2' : sw = 'found-word' 
        renderSet[renderCount].forEach(e => { 
            document.getElementById('words').innerHTML += `<span class="${sw}">${e}</span>` 
        }) 
        renderCount++ 
        document.getElementById("more").scrollIntoView() 
        if(renderSet.length === renderCount){target.remove()} 
    } 
}) 
 
removeSwitch.addEventListener('click', e => { 
    removeMode ? removeMode = false : removeMode = true 
    if(removeMode){ 
        wordContainer.style.cursor = 'not-allowed' 
        removeSwitch.style.backgroundColor = '#f22' 
        removeSwitch.style.color = '#fff' 
    } else { 
        wordContainer.style.cursor = 'auto' 
        removeSwitch.style.backgroundColor = '#fff' 
        removeSwitch.style.color = '#000' 
    } 
}) 
 
composedSwitch.addEventListener('click', e => { 
    if(composedContainer.classList.contains('composed-div')){ 
        composedContainer.classList.remove('composed-div') 
        document.getElementById('composed-option').classList.remove('composed-div') 
    } else { 
        composedContainer.classList.add('composed-div') 
        document.getElementById('composed-option').classList.add('composed-div') 
        composedContainer.innerHTML = '' 
        composed = [] 
    } 
}) 
 
wordContainer.addEventListener('click', e => { 
    const target = e.target 
    if(target.classList.contains('found-word') && removeMode){ 
        target.remove() 
    } 
})