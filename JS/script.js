const board = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves"); 
const timerDisplay = document.getElementById("timer"); 
const resultDisplay = document.getElementById("result"); 
const restartBtn = document.getElementById("restart-btn"); 

let seconds = 0;
let timerInterval = null;

let firstCard = null; 
let secondCard = null; 
let lockBoard = false; 
let moves = 0; 
let matchedCount = 0; 

let dimension = 150; 
let imgStart = Math.floor(Math.random() * 100) + 1; 
let cards = [];
const images = []; 

for (let i = imgStart; i <= imgStart + 7; i++) {
    images.push(`https://picsum.photos/seed/${i}/${dimension}/${dimension}`);
}

cards = [...images, ...images]; 

function shuffle(array) {
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
    }
}

function initGame(){
    seconds = 0;
    moves = 0; 
    matchedCount = 0; 

    timerDisplay.textContent = "Temps: 00:00";
    movesDisplay.textContent = "Coups: 0";
    resultDisplay.textContent = "";

    board.innerHTML = "";  
    shuffle(cards); 

    cards.forEach((imgUrl, index) => {
        const card = document.createElement("button"); 
        card.classList.add("card"); 
        card.dataset.value = imgUrl; 
        
        card.setAttribute("aria-label", `Carte ${index + 1}, face cachée`);
        
        card.addEventListener("click", () => handleCardClick(card));
        board.appendChild(card); 
    }); 

    startTimer();
}

function handleCardClick(card){
    if (lockBoard || firstCard === card || card.classList.contains("matched") || card.firstChild){
        return; 
    }

    revealCard(card);
    card.setAttribute("aria-label", "Carte révélée");
    
    card.disabled = true;

    if (!firstCard) {
        firstCard = card;
        return;
    }
    
    secondCard = card;
    lockBoard = true; 
    moves++; 
    movesDisplay.textContent = `Coups: ${moves}`;
    
    checkMatch();
}

function revealCard(card) {
    const img = document.createElement("img");
    img.src = card.dataset.value;
    img.alt = "Illustration de la carte";
    img.width = dimension;
    img.height = dimension;
    card.appendChild(img);
}

function checkMatch(){
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if(isMatch === true){
        firstCard.classList.add("matched");  
        secondCard.classList.add("matched"); 
        
        firstCard.setAttribute("aria-label", "Carte trouvée");
        secondCard.setAttribute("aria-label", "Carte trouvée");

        matchedCount += 2; 
        resetTurn(); 
        checkVictory();
    } else {
        setTimeout(() => {
            firstCard.innerHTML = "";
            secondCard.innerHTML = "";
            
            firstCard.setAttribute("aria-label", "Carte face cachée");
            secondCard.setAttribute("aria-label", "Carte face cachée");
            
            firstCard.disabled = false;
            secondCard.disabled = false;
            
            resetTurn(); 
        }, 800);
    }
}

function resetTurn(){
    firstCard = null; 
    secondCard = null; 
    lockBoard = false;
}

function formatTime(sec) {
    const min = String(Math.floor(sec / 60)).padStart(2, "0"); 
    const s = String(sec % 60).padStart(2, "0"); 
    return `${min}:${s}`; 
}

function startTimer(){
    clearInterval(timerInterval); 
    timerInterval = setInterval(()=>{
        seconds++; 
        timerDisplay.textContent = `Temps: ${formatTime(seconds)}`;
    }, 1000); 
}

function checkVictory(){
    if(matchedCount === cards.length){
        clearInterval(timerInterval); 
        resultDisplay.textContent = `Victoire ! Coups : ${moves}, Temps : ${formatTime(seconds)}`;
    }
}

restartBtn.addEventListener("click", initGame); 
initGame();