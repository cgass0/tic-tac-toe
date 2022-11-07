
// Setting up the gameboard module
//let gameBoardModule = (function() { // calls a local anonymos function
   // let gameBoard = []; // calls gameboard as empty array
   // return {}; 
//})();


// Setting up the displayController module
let displayControllerModule = (function() {
    let testF = () => {
        console.log("testing private function call inside of a mudle object...")
    };
    return {testF};
})();


// Setting up the player factory function
let createPlayer = (playerName, playerNumber, assignedXO) => {
    let getPlayerName = () => {
        playerName;
        console.log("This is the name of player " + playerNumber + "...." + playerName);
    }
    return {getPlayerName, playerName, playerNumber, assignedXO};
};



// dummy names
let Justin = createPlayer("Justin", 1, "X");
let Curtis = createPlayer("Curtis", 2, "O");