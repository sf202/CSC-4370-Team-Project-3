/* ------EXTRA FEATURES------------
End-of-game notification: Provide some sort of visual notification when the game has been won;
that is, when the tiles have been rearranged into their original order

Multiple backgrounds: Provide several background images (at least 4) to choose from.


Please Grade This Option: 
Different puzzle sizes: Place a control on the board to allow the game to be broken apart in other
sizes besides 4x4, such as 3x3, 6x6, 8x8, 10x10 etc. 

Cheat button: This will solve and show the shuffle that was created not a static page to display
the titles in order
*/

var moves = 0;
var table;
var rows;
var columns;
var textMoves;
var arrayForBoard;
var arrayForBoardDisplay;
var originalBoard;
var selectedBackground = "background1.jpg"; // Default background

function start() {
  var button = document.getElementById("newGame");
  button.addEventListener("click", startNewGame, false);
  textMoves = document.getElementById("moves");
  table = document.getElementById("table");
  rows = 4;
  columns = 4;
  startNewGame();
  setTileBackground();
}
function changeBackground() {
  var backgroundSelect = document.getElementById("backgroundSelect");
  selectedBackground = backgroundSelect.value;
  setTileBackground();
}

function startNewGame() {
  moves = 0;
  rows = parseInt(document.getElementById("rows").value);
  columns = parseInt(document.getElementById("columns").value);
  textMoves.innerHTML = moves;

  originalBoard = createFixedBoard(rows, columns);
  arrayForBoard = shuffleBoard(originalBoard);
  arrayForBoardDisplay = convertDataToDisplay(arrayForBoard);

  showTable();
  setTileBackground();
  document.body.style.background = 'none';
}

function createFixedBoard(rows, columns) {
  var arrayForBoard = new Array(rows);
  var count = 0;

  for (var i = 0; i < rows; i++) {
    arrayForBoard[i] = new Array(columns);
    for (var j = 0; j < columns; j++) {
      arrayForBoard[i][j] = count++;
    }
  }

  return arrayForBoard;
}

function shuffleBoard(board) {
  const shuffledBoard = board.slice().flat(); // Flatten and copy the original board & works 
  
  for (var i = shuffledBoard.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledBoard[i], shuffledBoard[j]] = [shuffledBoard[j], shuffledBoard[i]]; // Swap elements
  }
  return chunkArray(shuffledBoard, columns);
}

function chunkArray(array, size) {
  var result = [];
  for (var i = 0; i < array.length; i += size) { //making the rows
     //push adds entire rows to array
    result.push(array.slice(i, i + size)); //adding elements to the each row; making the columns from 1D array;
  }
  return result; // 2D array
}

function showTable() {
  var outputString = ""; //initaizaling the string
  for (var i = 0; i < rows; i++) {
    outputString += "<tr>";
    for (var j = 0; j < columns; j++) {
      if (arrayForBoardDisplay[i][j] === 0) {
        outputString += "<td class=\"blank\"> </td>";
      } else {
        outputString += "<td class=\"tile\" onclick=\"moveThisTile(" + i + ", " + j + ")\">" + arrayForBoard[i][j] + "</td>";
      }
    }
    outputString += "</tr>";
  }
  table.innerHTML = outputString;
}

function moveThisTile(tableRow, tableColumn) {
  var directions = ["up", "down", "left", "right"];
  for (var i = 0; i < directions.length; i++) {
    if (checkIfMoveable(tableRow, tableColumn, directions[i])) {
      incrementMoves();
      break; // Exit loop if a valid move is found
    }
  }

  if (checkIfWinner()) {
    alert("Congratulations! You solved the puzzle in " + moves + " moves.");
  }
}

//returns boolean
function checkIfMoveable(rowCoordinate, columnCoordinate, direction) {
  var rowOffset = 0;
  var columnOffset = 0;
  //initializing the row/column offset values
  if (direction === "up") {
    rowOffset = -1;
  } else if (direction === "down") {
    rowOffset = 1;
  } else if (direction === "left") {
    columnOffset = -1;
  } else if (direction === "right") {
    columnOffset = 1;
  }

  var newRow = rowCoordinate + rowOffset;
  var newColumn = columnCoordinate + columnOffset;

  //returns true and 
  if (newRow >= 0 && newColumn >= 0 && newRow < rows && newColumn < columns) {
    if (arrayForBoard[newRow][newColumn] === 0) { //check if the tile is blank (new location); actual check in this line bc 0 = empty space
      arrayForBoard[newRow][newColumn] = arrayForBoard[rowCoordinate][columnCoordinate];
      arrayForBoard[rowCoordinate][columnCoordinate] = 0;
      updateDisplayFromData();
      return true;
    }
  }

  return false;
}


// Update the checkIfWinner function to show the win image when the game is won
// Update the checkIfWinner function to change the background when the game is won
function checkIfWinner() {
  var isWinner = true;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      if (arrayForBoard[i][j] !== originalBoard[i][j]) {
        isWinner = false;
        break;
      }
    }
    if (!isWinner) {
      break;
    }
  }

  if (isWinner) {
    document.body.style.background = 'url(winner.jpg) no-repeat center bottom fixed';
    document.body.style.backgroundSize = '500px';
  }

  return isWinner;
}


function incrementMoves() {
  moves++;
  textMoves.innerHTML = moves;
}

function setTileBackground() {
  var tiles = document.querySelectorAll('.tile');
  var image = new Image();
  var selectedImage = selectedBackground; // Replace with your image URL

  image.onload = function() {
    var imageWidth = image.width;
    var imageHeight = image.height;
    var tileWidth = imageWidth / columns;
    var tileHeight = imageHeight / rows;

    tiles.forEach(function(tile, index) {
      var row = Math.floor(index / columns);
      var col = index % columns;

      var tileNumber = arrayForBoard[row][col];
      if (tileNumber === 0) {
        tile.style.backgroundImage = 'none'; // Empty space tile
        tile.innerHTML = ''; // Clear innerHTML for empty space
      } else {
        var backgroundPositionX = (0-(tileNumber % columns)) * tileWidth;
        var backgroundPositionY = Math.floor(tileNumber / columns) * tileHeight * -1;

        tile.style.backgroundImage = 'url(' + selectedImage + ')';
        tile.style.backgroundSize = imageWidth + 'px ' + imageHeight + 'px';
        tile.style.backgroundPosition = backgroundPositionX + 'px ' + backgroundPositionY + 'px';
        tile.style.width = tileWidth + 'px';
        tile.style.height = tileHeight + 'px';
        tile.innerHTML = tileNumber; // Display the tile number as innerHTML
      }
    });
  };

  image.src = selectedImage;
}

function convertDataToDisplay(dataBoard) {
  var displayBoard = [];
  for (var i = 0; i < rows; i++) {
    displayBoard[i] = [];
    for (var j = 0; j < columns; j++) {
      displayBoard[i][j] = dataBoard[i][j] !== 0 ? dataBoard[i][j] : "";
    }
  }
  return displayBoard;
}

function updateDisplayFromData() {
  arrayForBoardDisplay = convertDataToDisplay(arrayForBoard);
  showTable();
  setTileBackground();
}

// Add this function to your JavaScript
// Modify the shuffleTiles function
// Modify the shuffleTiles function
function shuffleTiles() {
  originalBoard = createFixedBoard(rows, columns);
  arrayForBoard = shuffleBoard(originalBoard);
  arrayForBoardDisplay = convertDataToDisplay(arrayForBoard);
  moves = 0;
  textMoves.innerHTML = moves;
  showTable();
  setTileBackground();
}

// Add this function to your existing JavaScript code
function cheat() {
  // Display the solution
  arrayForBoard = originalBoard;
  updateDisplayFromData();
  moves = 0;
  textMoves.innerHTML = moves;
}

function showWinNotification() {
  var winNotification = document.getElementById("win-notification");
  winNotification.style.display = "block";
}

window.addEventListener("load", start, false);