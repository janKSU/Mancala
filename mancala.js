const players = ["red", "blue"];
const pebbleSize = 15;

var turn = 0;
var playAgain = 0;
var board = [[], []];
var pits = new Array(2);
var pitWidth = document.getElementById("canvas_0_0").offsetWidth*1.5;
var pitHeight = document.getElementById("canvas_0_0").offsetHeight;

initialize();

//Generate random pixel number from limits
function getCoord(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function addPebble(player, pit){
    var x = getCoord(pebbleSize, pitWidth-pebbleSize);
    var y = getCoord(pebbleSize, pitHeight-pebbleSize);
    pits[player][pit].push({x: x, y:y});
}

//begin game initialization
function initialize(){
    turn = 0;
    playAgain = 0;
    board = [[], []];
    pits = new Array(2);

    for (let i = 0; i < pits.length; i++) {
        pits[i] = new Array(6);
        for (let j = 0; j < pits[i].length; j++){
            pits[i][j] = [];
            for (let k = 0; k < 4; k++) {
                addPebble(i, j);
            }
        }
    }
// Attach click listeners to all pits
    for(let row = 0; row < pits.length; row++) {
        for (let column = 0; column < pits[row].length; column++){
            document.getElementById('pit_' + row + '_' + column)
                .addEventListener('click', function(event) {
                    event.preventDefault();
                    playPit(row,column);
                });
        }
    }
    document.getElementById("playerTurn").style.fontSize = "medium";
    document.getElementById("playerTurn").innerHTML = "It is "+(turn+1)+" player turn";
    document.getElementById("button")
        .addEventListener('click', function(event) {
            event.preventDefault();
            initialize()
        });
    drawPebbles();
    addColorHover(turn);
}

//play the click
function playPit(clickedPlayer, clickedPit){
    let gameover = 0;
    if (turn === clickedPlayer) {
        var clickedPebbles = pits[clickedPlayer][clickedPit].length;
        if (clickedPebbles > 0) {
            pits[clickedPlayer][clickedPit].length = 0;
            var placePit = clickedPit + 1;
            var placePlayer = clickedPlayer;
            var lastPlacedPit = clickedPit;
            var lastPlayer = placePlayer;
            for (let i = 0; i < clickedPebbles; i++) {
                if (placePit >= 6 ) {
                    if (placePlayer === clickedPlayer){
                        let x = getCoord(pebbleSize, pitWidth - pebbleSize);
                        let y = getCoord(pebbleSize, pitHeight - pebbleSize);
                        board[placePlayer].push({x: x, y: y});
                        placePlayer = (placePlayer + 1) % 2;
                        placePit = 0;
                    } else{
                        i--;
                        placePlayer = (placePlayer + 1) % 2;
                        placePit = 0;
                    }

                } else {
                    addPebble(placePlayer, placePit);
                    lastPlacedPit = placePit;
                    lastPlayer = placePlayer;
                    placePit++;
                }
            }
            //the same player play again
            if (placePit === 0) {
                playAgain = 1;
            }
            //check for collactable opposite pits
            if (pits[placePlayer][lastPlacedPit].length === 1 && clickedPlayer === placePlayer) {
                let oppositePit = 0;
                let oppositePlayer = (placePlayer + 1) % 2;
                switch (lastPlacedPit) {
                    case 0:
                        oppositePit = 5;
                        break;
                    case 1:
                        oppositePit = 4;
                        break;
                    case 2:
                        oppositePit = 3;
                        break;
                    case 3:
                        oppositePit = 2;
                        break;
                    case 4:
                        oppositePit = 1;
                        break;
                    case 5:
                        oppositePit = 0;
                        break;
                }
                if (pits[oppositePlayer][oppositePit].length > 0) {
                    let oppositePitAmount = pits[oppositePlayer][oppositePit].length;
                    pits[oppositePlayer][oppositePit].length = 0;
                    pits[placePlayer][lastPlacedPit].length = 0;
                    for (let i = 0; i < oppositePitAmount + 1; i++) {
                        let x = getCoord(pebbleSize, pitWidth - pebbleSize);
                        let y = getCoord(pebbleSize, pitHeight - pebbleSize);
                        board[placePlayer].push({x: x, y: y});
                    }
                }
            }

            if (playAgain === 1) {
                playAgain = 0;
            } else {
                turn = (turn + 1) % 2;
            }

            //checking if game ends
            for (let i = 0; i < pits.length; i++) {
                let calc = 0;
                for (let j = 0; j < pits[i].length; j++) {
                    if (pits[i][j].length === 0) {
                        calc++;
                    }
                }
                if (calc === 6) {
                    gameover = 1;
                    break;
                }
            }
            if (gameover === 1) {
                //collapsing all pebbles to the bases
                for (let i = 0; i < pits.length; i++) {
                    for (let j = 0; j < pits[i].length; j++) {
                        let pebblesAmount = pits[i][j].length;
                        pits[i][j].length = 0;
                        for (let k = 0; k < pebblesAmount; k++) {
                            let x = getCoord(pebbleSize, pitWidth - pebbleSize);
                            let y = getCoord(pebbleSize, pitHeight - pebbleSize);
                            board[i].push({x: x, y: y});
                        }
                    }
                }
            }
            document.getElementById("playerTurn").innerHTML = "It is " + (turn + 1) + " player turn";
            drawPebbles();
            addColorHover(turn);

            if (gameover === 1){
                blockButtons();
                document.getElementById("playerTurn").style.fontSize = "xx-large";
                if (board[0].length > board[1].length) {
                    document.getElementById("playerTurn").innerHTML = "Player 1 won the game!";
                } else {
                    document.getElementById("playerTurn").innerHTML = "Player 2 won the game!";
                }
            }
        }
    }
}

//redraw whole board with amounts of pebbles
function drawPebbles(){
    //draw pits
    for (let i = 0; i < pits.length; i++) {
        for (let j = 0; j < pits[i].length; j++) {
            let c = document.getElementById("canvas_" + i + "_" + j);
            let ctx = c.getContext("2d");
            ctx.clearRect(0, 0, c.width, c.height);
            document.getElementById("amount_" + i + "_" + j).innerText = pits[i][j].length;
            for (let k = 0; k < pits[i][j].length; k++) {
                ctx.fillStyle = "#3370d4"; //blue
                ctx.beginPath();
                ctx.arc(pits[i][j][k].x, pits[i][j][k].y, pebbleSize, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }
    }
    //draw bases
    for (let i = 0; i < 2; i++) {
        let c = document.getElementById("base_" + i + "_canvas");
        let ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);
        document.getElementById("base_" + i + "_amount").innerText = board[i].length;
        for (let j = 0; j < board[i].length; j++) {
            ctx.fillStyle = "#3370d4"; //blue
            ctx.beginPath();
            ctx.arc(board[i][j].x, board[i][j].y, pebbleSize, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
}

function addColorHover(player){
    let otherPlayer = (player + 1) % 2;
    for (let i = 0; i < pits[player].length; i++) {
        if (pits[player][i].length > 0){
            document.getElementById('pit_' + player + '_' + i).onmouseover = function () {
                this.style.backgroundColor = "#797ECE";
            };
        }
        else{
            document.getElementById('pit_' + player + '_' + i).onmouseover = function () {
                this.style.backgroundColor = "white";
            };
        }
        document.getElementById('pit_' + player + '_' + i).onmouseout = function () {
            this.style.backgroundColor = "white";
        };
        document.getElementById('pit_' + otherPlayer + '_' + i).onmouseover = function () {
            this.style.backgroundColor = "#white";
        };
    }
}

function blockButtons(){
    for(let row = 0; row < pits.length; row++) {
        for (let column = 0; column < pits[row].length; column++){
            document.getElementById('pit_' + row + '_' + column)
                .removeEventListener('click', function(event) {
                    event.preventDefault();
                    playPit(row,column);
                });
        }
    }

    for (let i = 0; i < pits.length; i++) {
        for (let j = 0; j < pits[i].length; j++) {
            document.getElementById('pit_' + i + '_' + j).onmouseout = function () {
                this.style.backgroundColor = "white";
            };
            document.getElementById('pit_' + i + '_' + j).onmouseover = function () {
                this.style.backgroundColor = "#white";
            };
        }
    }
}
