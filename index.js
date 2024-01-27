const DisplayController = (() => {
    const displayMessage = (message) => {
        const messageDisplay = document.querySelector("#message");
        messageDisplay.textContent = message;
    }
    return {
        displayMessage
    }
})();

const Gameboard = (() => {
    const gameBoard = ["","","","","","","","",""];

    const render = () => {
        const gameBoardElement = document.getElementById('gameBoard');
        gameBoardElement.innerHTML = '';
    
        gameBoard.forEach((element, index) => {
            const cell = document.createElement('div');
            cell.setAttribute('class','cell');
            cell.setAttribute('id',`${index}`);
            gameBoardElement.appendChild(cell);
            cell.addEventListener('click', Game.handleClick.bind(Game));
        })
    }

    const getGameBoard = () => gameBoard;

    return{
        render,
        getGameBoard
    } 
})();


function createPlayer(name, marker){
    return {
        name,
        marker
    }
}

const Game = (() => {
    let currentPlayer;
    let players = [];
    const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
    ];

    const start = (event) => {
        event.preventDefault()
        if (document.getElementById("player1").value != "" && document.getElementById("player2").value != ""){
        const container = document.querySelector(".container");
        const gameBoard = document.querySelector(".gameBoard");
        const info = document.querySelector(".info");

        container.style.gridTemplateColumns =  "59% 2% 39%";
        gameBoard.style.display = "grid";
        info.style.justifySelf = "inherit";
        info.style.gridColumn = "3/4";

        players = [
        createPlayer(document.getElementById("player1").value, 'X'),
        createPlayer(document.getElementById("player2").value, 'O')
        ];
        currentPlayer = players[0];
        Gameboard.render();
    }
    else {
        return;
    }
    }
    
    const handleClick = (event) => {
        const index = Array.from(event.target.parentNode.children).indexOf(event.target);

        if (Gameboard.getGameBoard()[index] !== "") {
            return false; 
        }
        event.target.textContent = currentPlayer.marker;
        Gameboard.getGameBoard()[index] = currentPlayer.marker;

        let winner = checkWinner();
        if (checkWinner()) {
            if (winner === players[0].marker){
                DisplayController.displayMessage(`${players[0].name} has won!`)
            }
            else if (winner === players[1].marker){
                DisplayController.displayMessage(`${players[1].name} has won!`)
            }
            return;
        } else if (checkDraw()) {
            DisplayController.displayMessage("It's a DRAW!")
            return;
        }
        switchPlayer();
        if (currentPlayer.marker === 'X'){
        DisplayController.displayMessage(`${players[0].name} it's your turn!`)
        }
        else {
            DisplayController.displayMessage(`${players[1].name} it's your turn!`)
        }
    };
    
    const switchPlayer = () => {
        currentPlayer = (currentPlayer === players[0]?players[1]:players[0])
        
    }
    
    const checkWinner = () => {
        for(const combination of winningCombinations){
            const [a, b, c] = combination;
            if (Gameboard.getGameBoard()[a] && Gameboard.getGameBoard()[a] === Gameboard.getGameBoard()[b] && Gameboard.getGameBoard()[a] === Gameboard.getGameBoard()[c]){
                return Gameboard.getGameBoard()[a]
            }
        }
        return null;
    }
    const checkDraw = () => {
        if (Gameboard.getGameBoard().every(cell => cell !== "") && !checkWinner()){
            return true;
        }
        return false; 
    }
    
    const restart = () => {
        
        const gameBoard = Gameboard.getGameBoard();
        gameBoard.fill("");
    
        const gameBoardElement = document.getElementById('gameBoard');
        gameBoardElement.innerHTML = '';
    
        Gameboard.render(); 
    
        DisplayController.displayMessage("");

    }
    
    return {
        start,
        handleClick,
        restart
    }
})();

const restartBtn = document.querySelector("#restartBtn");
restartBtn.addEventListener('click', () => {
    Game.restart();
});

const playersForm = document.getElementById("players-input");
playersForm.addEventListener('submit', function(event) {
    Game.start(event);
});