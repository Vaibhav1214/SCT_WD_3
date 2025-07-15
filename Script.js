const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
let board = Array(9).fill("");
let isGameOver = false;

const winCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = val;
    cell.addEventListener("click", () => playerMove(i));
    boardEl.appendChild(cell);
  });
}

function playerMove(index) {
  if (board[index] || isGameOver) return;
  board[index] = "X";
  renderBoard();
  if (checkGame("X")) return;
  setTimeout(() => {
    const move = bestMove();
    if (move !== null) {
      board[move] = "O";
      renderBoard();
      checkGame("O");
    }
  }, 300);
}

function checkGame(player) {
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a] === player && board[b] === player && board[c] === player) {
      document.querySelectorAll(".cell")[a].classList.add("win");
      document.querySelectorAll(".cell")[b].classList.add("win");
      document.querySelectorAll(".cell")[c].classList.add("win");
      statusEl.textContent = `${player === "X" ? "You" : "Computer"} win! 🎉`;
      isGameOver = true;
      return true;
    }
  }
  if (!board.includes("")) {
    statusEl.textContent = "It's a draw! 🤝";
    isGameOver = true;
    return true;
  }
  statusEl.textContent = `${player === "X" ? "Computer" : "Your"} turn`;
  return false;
}

function bestMove() {
  let bestScore = -Infinity;
  let move = null;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

const scores = { X: -1, O: 1, tie: 0 };

function minimax(newBoard, depth, isMaximizing) {
  const result = checkWinnerMinimax(newBoard);
  if (result !== null) return scores[result];

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        best = Math.max(score, best);
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        best = Math.min(score, best);
      }
    }
    return best;
  }
}

function checkWinnerMinimax(bd) {
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (bd[a] && bd[a] === bd[b] && bd[b] === bd[c]) {
      return bd[a];
    }
  }
  if (!bd.includes("")) return "tie";
  return null;
}

function resetGame() {
  board = Array(9).fill("");
  isGameOver = false;
  renderBoard();
  statusEl.textContent = "Your turn (X)";
}

renderBoard();
