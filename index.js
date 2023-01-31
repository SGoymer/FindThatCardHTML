const cardObjectDefinitions = [
    {id: 1, imagePath:"/images/king_of_clubs2.png"},
    {id: 2, imagePath:"/images/queen_of_clubs2.png"},
    {id: 3, imagePath:"/images/king_of_spades2.png"},
    {id: 4, imagePath:"/images/queen_of_hearts2.png"},
]

const cardBackImgPath = "/images/cardback.png"

//Store the card container HTML element as a constant
const cardContainerElem = document.querySelector('.card-container')

//Create an HTML element (function seems overkill)
function createElement(elemType) {
    return document.createElement(elemType)
}

//Add a class to an HTML element
function addClassToElement(elem, className) {
    elem.classList.add(className)
}

//Assign a (unique) ID to each element
function addIdToElement(elem, id) {
    elem.id = id
}

//Add an image source to img element
function addSrcToImageElem(imgElem, src) {
    imgElem.src = src
}

//Add child element to an HTML element
function addChildElement(parentElem, childElem) {
    parentElem.appendChild(childElem)
}

//We need to create this to make a card
/*
<div class="card">
    <div class="card-inner">
        <div class="card-front">
            <img src="/images/jack_of_clubs.png" alt="" class="card-img">
        </div>
        <div class="card-back">
            <img src="/images/cardback.png" alt="" class="card-img">
        </div>
    </div>
</div>
*/

function createCard(cardItem) {

    //Create each element and assign class (and src to the images)

    const cardElem = createElement("div")
    addClassToElement(cardElem, "card")
    addIdToElement(cardElem, cardItem.id)


    const cardInnerElem = createElement("div")
    addClassToElement(cardInnerElem, "card-inner")

    const cardFrontElem = createElement("div")
    addClassToElement(cardFrontElem, "card-front")

    const cardBackElem = createElement("div")
    addClassToElement(cardBackElem, "card-back")

    const cardFrontImg = createElement("img")
    addClassToElement(cardFrontImg, "card-img")
    addSrcToImageElem(cardFrontImg, cardItem.imagePath)

    const cardBackImg = createElement("img")
    addClassToElement(cardBackImg, "card-img")
    addSrcToImageElem(cardBackImg, cardBackImgPath)


    //Create element hierarchy
    addChildElement(cardElem, cardInnerElem)
        addChildElement(cardInnerElem, cardFrontElem)
            addChildElement(cardFrontElem, cardFrontImg)
        addChildElement(cardInnerElem, cardBackElem)
            addChildElement(cardBackElem, cardBackImg)
}    

