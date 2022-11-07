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

// Toggle winning screen
const winningScreenToggle = function() {
    const winScreen = document.getElementById('winningMessageElement');
    const state = winScreen.classList.contains('show') ? true : false;
    if (state === true) {
        winScreen.classList.remove('show');
    } else {
        winScreen.classList.add('show');
    }
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
// What message to display based on players turn
const displayCurrentPlayer = function(currentPlayer, symbol) {
    let turn = document.getElementById('currentPlayerDisplay');
    turn.textContent = `It is currently ${currentPlayer}'s turn: ${symbol}`;
};


// Game 
const startGame = (() => {
    startScreenToggle();
    getPlayerInfo();
    let filledCubes = 0;
    displayCurrentPlayer(currentPlayer(filledCubes), getSymbol(filledCubes));

    const cubes = document.querySelectorAll('.cube');
    cubes.forEach(cube => { 
        cube.addEventListener('click', e => {
            // add symbol to cubes inner text
            e.target.textContent = getSymbol(filledCubes);
            // Disables cube from being re-clicked
            e.target.disabled = true;
            // fill gameBoard with symbol from cubes ID number
            gameBoard[e.target.id] = getSymbol(filledCubes);
            // Check for winner
            if (checkWin(getSymbol(filledCubes))) {
                console.log("winner");
            }
            // add to the filled cube counter
            filledCubes++;
            // displays next players turn
            displayCurrentPlayer(currentPlayer(filledCubes), getSymbol(filledCubes));
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


// Create gameboard
let gameBoard = [];
const cubes = document.querySelectorAll('.cube');
cubes.forEach(cube => { 
    gameBoard.push(cube.value);
});
    
function checkWin(symbol) {
    return winningConditions.some(combinations => {
        return combinations.every(index => {
            return cubes[index] == symbol;
        })
    })
}

// Brings up start screen 
startScreenToggle();

// Start Game after info input
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);