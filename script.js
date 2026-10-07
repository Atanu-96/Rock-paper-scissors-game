// ---------- Game data ----------
const EMOJI = { rock: "✊", paper: "✋", scissors: "✌️" };
const BEATS = { rock: "scissors", paper: "rock", scissors: "paper" };
const CHOICES = Object.keys(BEATS);

// ---------- State ----------
const score = { player: 0, draw: 0, computer: 0 };
let busy = false;

// ---------- Elements ----------
const menuScreen = document.getElementById("menu-screen");
const gameScreen = document.getElementById("game-screen");
const playerHand = document.getElementById("player-hand");
const computerHand = document.getElementById("computer-hand");
const resultEl = document.getElementById("result");
const choiceBtns = document.querySelectorAll(".choice");

// ---------- Screens ----------
function showScreen(screen) {
  menuScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  screen.classList.add("active");
}

document.getElementById("mode-computer").addEventListener("click", () => showScreen(gameScreen));
document.getElementById("back-btn").addEventListener("click", () => showScreen(menuScreen));
document.getElementById("reset-btn").addEventListener("click", resetGame);

// ---------- Game logic ----------
function getComputerChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

function getWinner(player, computer) {
  if (player === computer) return "draw";
  return BEATS[player] === computer ? "player" : "computer";
}

function play(playerChoice) {
  if (busy) return;
  busy = true;
  choiceBtns.forEach(b => (b.disabled = true));

  const computerChoice = getComputerChoice();

  // reset visuals and shake both hands
  [playerHand, computerHand].forEach(h => {
    h.textContent = "✊";
    h.className = "hand shake";
  });
  resultEl.className = "result";
  resultEl.textContent = "Rock... paper... scissors...";

  setTimeout(() => {
    playerHand.textContent = EMOJI[playerChoice];
    computerHand.textContent = EMOJI[computerChoice];
    playerHand.classList.remove("shake");
    computerHand.classList.remove("shake");

    const winner = getWinner(playerChoice, computerChoice);
    score[winner]++;
    showResult(winner, playerChoice, computerChoice);
    updateScore();

    busy = false;
    choiceBtns.forEach(b => (b.disabled = false));
  }, 550);
}

function showResult(winner, p, c) {
  if (winner === "draw") {
    resultEl.textContent = "It's a draw!";
    resultEl.classList.add("draw");
  } else if (winner === "player") {
    resultEl.textContent = `You win! ${cap(p)} beats ${c}.`;
    resultEl.classList.add("win");
    playerHand.classList.add("winner");
    computerHand.classList.add("loser");
  } else {
    resultEl.textContent = `You lose! ${cap(c)} beats ${p}.`;
    resultEl.classList.add("lose");
    computerHand.classList.add("winner");
    playerHand.classList.add("loser");
  }
}

function updateScore() {
  document.getElementById("score-player").textContent = score.player;
  document.getElementById("score-draw").textContent = score.draw;
  document.getElementById("score-computer").textContent = score.computer;
}

function resetGame() {
  score.player = score.draw = score.computer = 0;
  updateScore();
  playerHand.textContent = computerHand.textContent = "❔";
  playerHand.className = computerHand.className = "hand";
  resultEl.className = "result";
  resultEl.textContent = "Pick your move";
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ---------- Input ----------
choiceBtns.forEach(btn => btn.addEventListener("click", () => play(btn.dataset.choice)));

document.addEventListener("keydown", e => {
  if (!gameScreen.classList.contains("active")) return;
  const key = e.key.toLowerCase();
  if (key === "r") play("rock");
  if (key === "p") play("paper");
  if (key === "s") play("scissors");
});
