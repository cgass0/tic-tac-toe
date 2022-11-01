// Dark Theme Toggle //

/*const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
    }    
}
toggleSwitch.addEventListener('change', switchTheme, false);


*/


// Cube Click Max Once
const cubes = document.querySelectorAll('.cube');
const gameBoard = document.getElementById('gameboard');
const selectors = document.querySelectorAll('.selector');

const winningMessageElement = document.getElementById('winningMessageElement');
const winningMessageTextElement = document.getElementById('winningMessageTextElement');
const restartButton = document.getElementById('restartButton');

const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
let circleTurn;


const WINNING_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,7]
];


// Event handler for restart button on winning screen to restart game
restartButton.addEventListener('click', resetGame);



selectors.forEach(selector => {
    selector.addEventListener('click', symbolClick, {once: true});
})

function symbolClick(e) {
    selectedSymbol = e.target.id;
    startGame(selectedSymbol);
}
    


// Upon cube or restart button click, the game restarts and begins
function startGame() {
    circleTurn = false;// based on selection

    selectors.disabled = true;

    cubes.forEach(cell => {
        cell.addEventListener('click', handleClick, {once: true});
    })
} 


// Upon a cube click, the following happens
function handleClick(e) {
    
    // Place mark
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {

        // Check for win
        endGame(false);

    } else if (isDraw()) {

        // Check for Draw
        endGame(true);

    } else {

        // Switch turns
        swapTurns();
    }

    resetGame();

}


// When triggered, endgame searchs for winner or draw and displays winning screen
function endGame(draw) {
    if(draw) {
        winningMessageTextElement.innerText = "Draw!";
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`
    }
    winningMessageElement.classList.add('show');
}


// Function to add the x or circle class to cubes
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}


// Searchs for all cubes to be filled, then triggers a draw
function isDraw() {
    return [...cubes].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    })
}


// If circleTurn is true, then becomes not circleturn
function swapTurns() {
    circleTurn = !circleTurn;
}


// triggered function after every click that searchs for a winner based array of possible outcomes
function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cubes[index].classList.contains(currentClass);
        })
    })
}


// Restart game, reset 
function resetGame() {
    winningMessageElement.classList.remove('show');
    cell.classList.remove('X_CLASS');
    cell.classList.remove('CIRCLE_CLASS');
    cell.removeEventListener('click', handleClick);
    cell.removeEventListener('click', symbolClick);
}