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

const currentGameStatusElem = document.querySelector(".current-status")
const scoreContainerElem = document.querySelector(".header-score-container")
const scoreElem = document.querySelector(".score")
const roundContainerElem = document.querySelector(".header-round-container")
const roundElem = document.querySelector(".round")

const winColour = "green"
const loseColour = "red"
const primaryColour = "black"

let roundNum = 0
const maxRounds = 4
let score = 0

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

//Attach an click event listener to a card element. Adding this listener will mean chooseCard(card) is run whenever the card is clickeds
function attachClickEventHandlerToCard(cardElem) {
    cardElem.addEventListener("click", () => chooseCard(cardElem))
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

   attachClickEventHandlerToCard(cardElem)

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

//Animate the shuffling of the cards
function animateShuffle(shuffleCount) {
    const random1 = Math.floor(Math.random() * numCards) + 1
    const random2 = Math.floor(Math.random() * numCards) + 1

    let card1 = document.getElementById(random1)
    let card2 = document.getElementById(random2)

    if(shuffleCount % 9 == 0) {
        card1.classList.toggle("shuffle-left")
        card1.style.zIndex = 100
    }
    if(shuffleCount % 2 == 1) {
        card2.classList.toggle("shuffle-right")
        card2.style.zIndex = 200
    }
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

//Get rid of shuffle animations for cards when done shuffling
function removeShuffleClasses() {
    cards.forEach((card) => {
        card.classList.remove("shuffle-left")
        card.classList.remove("shuffle-right")
    })
}

//Shuffle cards
function shuffleCards() {
    const id = setInterval(shuffle, 12)
    let shuffleCount = 0

    function shuffle() {

        //Swap the order of two cards
        randomiseCardPositions()

        animateShuffle(shuffleCount)

        //After 500 swaps, stop and deal the cards
        if(shuffleCount == 500) {
            clearInterval(id)
            shufflingInProgress = false
            removeShuffleClasses()
            dealCards()
            updateStatusElement(currentGameStatusElem, "block", primaryColour, "Please click the card that you think is the correct one")
        } else {
            shuffleCount++
        }
    }
}

//Initialise a new game
function initialiseNewGame() {

    //Reset game stats
    roundNum = 0
    score = 0

    shufflingInProgress = false

    //Make the score and round container elements visible
    updateStatusElement(scoreContainerElem, "flex")
    updateStatusElement(roundContainerElem, "flex")

    updateStatusElement(scoreElem, "block", primaryColour, `Score: <span class = "badge">${score}</span>`)
    updateStatusElement(roundElem, "block", primaryColour, `Round: <span class = "badge">${roundNum}</span>`)

}

//Initialise a new round
function initialiseNewRound() {
    roundNum++
    //playGameButtonElem.disabled = true
    
    gameInProgress = true
    shufflingInProgress = true
    cardsRevealed = false

    updateStatusElement(currentGameStatusElem, "block", primaryColour, "Shuffling...")
    updateStatusElement(roundElem, "block", primaryColour, `Round: <span class = "badge">${roundNum}</span>`)
}

//Start a new round
function startRound() {
    initialiseNewRound()
    collectCards()
    flipCards(true)
    shuffleCards()
}

function endRound() {
    setTimeout(() => {
        if(roundNum == maxRounds) {
            gameOver()
            return
        } else {
            startRound()
        }
    })
}


//Start the game (when user clicks the playGame button)
function startGame() {
    updateStatusElement(playGameButtonElem, "none")
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

    updateStatusElement(scoreContainerElem, "none")
    updateStatusElement(roundContainerElem, "none")
}

function gameOver() {
    updateStatusElement(scoreContainerElem, "none")
    updateStatusElement(roundContainerElem, "none")

    const gameOverMessage = `Game Over! Final score: <span class = "badge">${score}</span> points.
                             Click "Play Again" if you want another crack at it`

    updateStatusElement(currentGameStatusElem, "block", primaryColour, gameOverMessage)
    updateStatusElement(playGameButtonElem, "flex", "", `<button id = "playGame" class="play-game" role="button">Play Again</button>`)
    playGameButtonElem.disabled = false
}

//Check if the user should be allowed to select a card
function canChooseCard() {
    return gameInProgress == true && !shufflingInProgress && !cardsRevealed
}

//Choose a card. Allow only if can ChooseCard
function chooseCard(cardElem) {
    if(canChooseCard()) {
        evalulateCardChoice(cardElem)

        //Flip over the chosen card
        flipCard(cardElem, false)

        //Flip over all the cards after a 3s delay
        setTimeout(() => {
            flipCards(false)
            updateStatusElement(currentGameStatusElem, "block", primaryColour, "This is where all the cards were")
        }, 3000)

        setTimeout(() => {
            endRound()
        }, 6000)
        
        cardsRevealed = true
    }
}

//Update the HTML element elem to have display type display, colour color, and inner HTML innerHTML
function updateStatusElement(elem, display, color, innerHTML) {

    elem.style.display = display

    //Only change the color/innerHTML if at least one is specified
    if(arguments.length > 2) {
        if(!color == "") {
            elem.style.color = color
        }
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

function calculateScoreToAdd(roundNum) {
    if(roundNum == 1) {
        return 100
    } else if(roundNum == 2) {
        return 50
    } else if(roundNum == 3) {
        return 25
    } else {
        return 10
    }
}

function calculateScore() {
    let scoreToAdd = calculateScoreToAdd(roundNum)
    return scoreToAdd
}

function updateScore() {
    scoreToAdd = calculateScore()
    score += scoreToAdd
    updateStatusElement(scoreElem, "block", primaryColour, `Score: <span class = "badge">${score}</span>`)
}

//Check if the card is the "correct" one and output the appropriate feedback to user
function evalulateCardChoice(card) {
    if(card.id == correctCardId) {
        //Give the user points
        updateScore()
        outputChoiceFeedBack(true)
    } else {
        outputChoiceFeedBack(false)
    }
}

loadGame()