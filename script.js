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

// Finds if start screen is showing and toggles on/off
const startScreenToggle = function() {
    const initialFormScreen = document.getElementById('initialForm');
    const state = initialFormScreen.classList.contains('show') ? true : false;
    if (state === true) {
        initialFormScreen.classList.remove('show');
    } else {
        initialFormScreen.classList.add('show'); 
    }
};

// Toggle End screen
const endScreenToggle = function(thisPlayer, symbol) {
    const winScreen = document.getElementById('winningMessageElement');
    const state = winScreen.classList.contains('show') ? true : false;
    if (state === true) {
        winScreen.classList.remove('show');
    } else {
        winScreen.classList.add('show');
    }

    const winnerText = document.getElementById('winningMessageTextElement');
    winnerText.textContent = `The winner is ${thisPlayer}: ${symbol}`;
};


// Array for player information
let players = [];
// Player constructor
function Player(Type, Name, Difficulty) {
    this.Type = Type;
    this.Name = Name;
    this.Difficulty = Difficulty;
}
// Pushing new players to array
function pushPlayers(Type, Name, Difficulty) {
    let player = new Player(Type, Name, Difficulty);
    players.push(player);
}


// Collect player info from forms and call push function
const getPlayerInfo = function() {
    // Store the two form boxes
    const addPlayers = document.querySelectorAll('.formBox');
    // Index for which player 1 || 2
    index = 1;
    // For each loop to push both player forms
    addPlayers.forEach(player => {
        Type = player.querySelector('[name="types"]').value;
        // Added if incase names left blank
        if (player.querySelector('[name="name"]').value === "" && Type === "human") {
            Name = ("Player " + index)
        } else if (player.querySelector('[name="name"]').value === "" && Type === "ai") {
            Name = ("Robot " + index)
        } else {
            Name = player.querySelector('[name="name"]').value
        }
        
        Difficulty = player.querySelector('[name="difficulty"]').value;

        pushPlayers(Type, Name, Difficulty);
        index++;
    });
}

// Get Symbol based on number of filled cubes
const getSymbol = filledCubes => (filledCubes % 2) == 0 ? "X" : "O"; 
// Gets players name based on number of filled cubes
const currentPlayer = filledCubes => players[filledCubes % 2].Name;
// Human or AI
const getPlayerType = filledCubes => players[filledCubes % 2].Type;
// Get difficulty setting
const getAiDifficulty = filledCubes => players[filledCubes % 2].Difficulty;
// What message to display based on players turn
const displayCurrentPlayer = function(currentPlayer, symbol) {
    let turn = document.getElementById('currentPlayerDisplay');
    turn.textContent = `It is currently ${currentPlayer}'s turn: ${symbol}`;
};

let gameBoard = [];
// Game 
const startGame = (() => {
    let filledCubes = 0;
    gameBoard.length = 0;
    startScreenToggle();
    getPlayerInfo();
    displayCurrentPlayer(players[0].Name, "X");
    aiTurn(getPlayerType(filledCubes), getAiDifficulty(filledCubes), filledCubes, false);

    const cubes = document.querySelectorAll('.cube');
    cubes.forEach(cube => { 
        cube.textContent = undefined;
        cube.disabled = false;
        cube.addEventListener('click', e => {
            symbol = getSymbol(filledCubes);
            thisPlayer = currentPlayer(filledCubes);

            // add symbol to cubes inner text
            e.target.textContent = symbol;
            // Disables cube from being re-clicked
            e.target.disabled = true;
            // fill gameBoard with symbol from cubes ID number
            gameBoard[e.target.id] = symbol;
            // add to the filled cube counter
            filledCubes++;
            // Check for winner or draw
            if (checkWin(cubes, symbol)) {
                endScreenToggle(thisPlayer, symbol);
            }  else if (filledCubes === 9) {
                endScreenToggle("undetermined", "Draw!");
                console.log("this was a draw");
            }

            //console.log(gameBoard);
            //console.log(symbol);
            //console.log(thisPlayer);

            // displays next players turn
            displayCurrentPlayer(currentPlayer(filledCubes), getSymbol(filledCubes));
            // check if now AI turn, automate
            aiTurn(getPlayerType(filledCubes), getAiDifficulty(filledCubes), filledCubes, checkWin(cubes, symbol));
        })
    });

});


// Array of arrays for the winning combinations based on gameboard index
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];


// Check for winner
function checkWin(cubes,symbol) {
    return winningConditions.some(combinations => {
        return combinations.every(index => {
            return cubes[index].textContent.includes(symbol);
        })
    })
}

// check if AI turn, auto play
function aiTurn(playerType, aiDifficulty, filledCubes, hasWon) {
    // AI on easy mode, chooses at random
    if (playerType == "ai" && aiDifficulty == "easy" && filledCubes < 9 && hasWon === false) {
        // delay for UX
        let timeout = setTimeout(function(){
            // loop through cubes at random until an unclicked one is found a select it
            do {
                i = Math.floor(Math.random() * 9);
            } while (document.getElementById(i).disabled !== false);

            // click simulation
            document.getElementById(i).click();
        }, 2000);
            
    } else if (playerType == "ai" && aiDifficulty == "hard" && filledCubes < 9 && hasWon === false) {
        // AI on hard mode, looks for win opportunities, then blocks, then random
        let symbol = getSymbol(filledCubes);
        let compSymbol = getSymbol(filledCubes+1);
        let condition;

        let timeout = setTimeout(function(){
            // loops winning combos to see if any have two X or Os
            winningConditions.some(combination => {
                // changes indexs to textContent of Xs or Os
                let arr = [document.getElementById(combination[0]).textContent, document.getElementById(combination[1]).textContent, document.getElementById(combination[2]).textContent]
                // filters if 2 of same AI symbol with a blank
                if (arr.filter(x => x == symbol).length === 2 && arr.includes('')) {
                    // if yes, return index of gameBoard and use ID to click
                    document.getElementById(combination[arr.indexOf('')]).click();
                    // return true to break following code to prevent multiple sim clicks
                    condition = true;
                    return condition;
                } 
                
            });
            // turned into function to prevent return code break
            if (condition === true) {
                return true;
            }
            // same as above but for competitions symbol
            winningConditions.some(combination => {
                let arr = [document.getElementById(combination[0]).textContent, document.getElementById(combination[1]).textContent, document.getElementById(combination[2]).textContent]
                
                if (arr.filter(x => x == compSymbol).length === 2 && arr.includes('')) {
                    document.getElementById(combination[arr.indexOf('')]).click();
                    condition = true;
                    return condition;
                } 
                
            });
        
            if (condition === true) {
                return true;
            }

            // if no threat or opportunity, random
            do {
                i = Math.floor(Math.random() * 9);
            } while (document.getElementById(i).disabled !== false);

            // click simulation
            document.getElementById(i).click();

        }, 2000);
    };
}


// Brings up start screen 
startScreenToggle();

// Start Game after info input
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);

// Restart Game
const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', startScreenToggle);
restartButton.addEventListener('click', endScreenToggle);