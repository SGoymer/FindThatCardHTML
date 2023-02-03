const cardObjectDefinitions = [
    {id: 1, imagePath:"/images/king_of_clubs2.png"},
    {id: 2, imagePath:"/images/queen_of_clubs2.png"},
    {id: 3, imagePath:"/images/king_of_spades2.png"},
    {id: 4, imagePath:"/images/queen_of_hearts2.png"},
]

const numCards = cardObjectDefinitions.length
let cardPositions = []

let gameInProgress = false
let shufflingInProgress = false
let cardsRevealed = false

const currentGameStatusElem = document.querySelector("current-status")
const winColour = "green"
const loseColor = "red"

//id of the "correct" card
const correctCardId = 4


const cardBackImgPath = "/images/cardback.png"


//Store the card container HTML element as a constant
const cardContainerElem = document.querySelector(".card-container")

//Store the playGame button HTML element as a constant
const playGameButtonElem = document.getElementById("playGame")

const collapsedGridAreaTemplate = '"a a" "a a"'
const cardCollectionCellClass = ".card-pos-a"

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


//Map each card to its inital position
//by mapping the id of that card to the appropriate grid cell
function mapCardIdToGridCell(card) {
    if(card.id == 1) {
        return ".card-pos-a"
    } else if (card.id == 2) {
        return ".card-pos-b"
    } else if (card.id == 3) {
        return ".card-pos-c"
    } else {
        return ".card-pos-d"
    }
}

//Map the card then add it as a child element to the grid cell
function addCardToGridCell(cardElem) {
    const cardPositionClassName = mapCardIdToGridCell(cardElem)

    const cardPosElem = document.querySelector(cardPositionClassName)

    addChildElement(cardPosElem, cardElem)
}

function initialiseCardPositions(cardElem) {
    //Add card id to cardPositions
    cardPositions.push(cardElem.id)
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

   //Map the card then add it as a child element to the grid cell
   addCardToGridCell(cardElem)

   initialiseCardPositions(cardElem)

}    

//Now create a card for each item in the cardObjectDefinitions array
function createCards() {
    cardObjectDefinitions.forEach((cardItem)=>{
        createCard(cardItem)
    })
}



//Collapse the grid to a 1x1 area
function transformGridArea(areas) {
    cardContainerElem.style.gridTemplateAreas = areas
}

function addCardsToGridAreaCell(cellPositionClassName) {

    //Get the HTML element for this grid cell (card-pos-a, card-pos-b etc.)
    const cellPositionElem = document.querySelector(cellPositionClassName)

    //Add all the cards to that element
    cards.forEach((card, index) => {
        addChildElement(cellPositionElem, card)
    })
}

//Collect the cards together and stack them up, collapsing the grid to a 1x1 area as we do so
function collectCards() {
    transformGridArea(collapsedGridAreaTemplate)
    addCardsToGridAreaCell(cardCollectionCellClass)
}

//Flip a card over. If flipToBack is true, card is flipped onto the back side.
//Otherwise card is flipped onto the front side
function flipCard(card, flipToBack) {
    const innerCardElem = card.firstChild

    if(flipToBack && !innerCardElem.classList.contains("flip-it")) {
        innerCardElem.classList.add("flip-it")
    } else if (!flipToBack && innerCardElem.classList.contains("flip-it")) {
        innerCardElem.classList.remove("flip-it")
    }
}

//Flip cards over. If flipToBack is true, all cards are flipped onto the back side.
//Otherwise all flipped onto the front side
function flipCards(flipToBack) {
    cards.forEach((card, index) => {

        //Animation to spread out flips by 100ms
        setTimeout(() => {
            flipCard(card, flipToBack)
        }, index * 100)
    })
}



function randomiseCardPositions() {
    //generate two random numbers in [1, 2, ..., numCards]
    const random1 = Math.floor(Math.random() * numCards) + 1
    const random2 = Math.floor(Math.random() * numCards) + 1

    //Swap the positions of the two cards with the randomly selected indices
    const temp = cardPositions[random1 - 1]
    cardPositions[random1 - 1] = cardPositions[random2 - 1]
    cardPositions[random2 - 1] = temp
}

function addCardsToAppropriateCell() {
    cards.forEach((card)=> {
        addCardToGridCell(card)
    })
}

//Generate grid area template that contains a new order for the cells in the grid based on cardPositions
function returnGridAreasMappedToCardPos() {
    let firstPart = ""
    let secondPart = ""
    let areas = ""

    //Convert the cardPositions array e.g. [1 3 2 4] to a string expected by the transformGridArea function
    //e.g. '"a c" "b d"'
    cards.forEach((card, index)=> {
        if(cardPositions[index] == 1) {
            areas = areas + "a "
        } else if (cardPositions[index] == 2) {
            areas = areas + "b "
        } else if (cardPositions[index] == 3) {
            areas = areas + "c "
        } else {
            areas = areas + "d "
        }
        //snip off the trailing space from each part
        if (index == 1) {
            firstPart = areas.substring(0, areas.length - 1)
            areas = ""
        } else if (index == 3) {
            secondPart = areas.substring(0, areas.length - 1)
        }
    })
    return `"${firstPart}" "${secondPart}"`
}

//Deal cards. Restore the grid cells and add each card to the grid in the default order,
//then move the grid areas around based on cardPositions
function dealCards() {
    addCardsToAppropriateCell()
    const areasTemplate = returnGridAreasMappedToCardPos()
    transformGridArea(areasTemplate)
}

//Shuffle cards
function shuffleCards() {
    const id = setInterval(shuffle, 12)
    let shuffleCount = 0

    function shuffle() {

        //Swap the order of two cards
        randomiseCardPositions()

        //After 500 swaps, stop and deal the cards
        if(shuffleCount == 500) {
            clearInterval(id)
            dealCards()
        } else {
            shuffleCount++
        }
    }
}

//Initialise a new game
function initialiseNewGame() {

}

//Initialise a new round
function initialiseNewRound() {

}

//Start a new round
function startRound() {
    initialiseNewRound()
    collectCards()
    flipCards(true)
    shuffleCards()
}


//Start the game (when user clicks the playGame button)
function startGame() {
    initialiseNewGame()
    startRound()
}

//Load the game
function loadGame() {

    //Make the cards and put them on the grid
    createCards()

    //Get all card elements
    cards = document.querySelectorAll(".card")

    //Wire up a click event to the playGame button
    //Note: ()=> is shorthand for a lambda function that takes no arguments
    playGameButtonElem.addEventListener("click", ()=>startGame())
}


//Check if the user should be allowed to select a card
function canChooseCard() {
    return gameInProgress == true && !shufflingInProgress && !cardsRevealed
}

//Choose a card. Allow only if can ChooseCard
function chooseCard() {
    if(canChooseCard()) {

    }
}

//Update the HTML element elem to have display type display, colour color, and inner HTML innerHTML
function updateStatusElement(elem, display, color, innerHTML) {

    elem.style.display = display

    //Only change the color/innerHTML if at least one is specified
    if(arguments.length > 2) {
        elem.style.color = color
        elem.innerHTML = innerHTML
    }
}

//Output the appropriate feedback to user
function outputChoiceFeedBack(hit) {
    if(hit) {
        updateStatusElement(currentGameStatusElem, "block", winColour, "Bang on my friend")
    } else {
        updateStatusElement(currentGameStatusElem, "block", loseColour, "Absolute shambles mate")
    }
}


//Check if the card is the "correct" one and output the appropriate feedback to user
function evalulateCardChoice(card) {
    if(card.id = correctCardId) {
        //Give the user points
        updateScore()
        outputChoiceFeedBack(true)
    } else {
        outputChoiceFeedBack(false)
    }
}

loadGame()