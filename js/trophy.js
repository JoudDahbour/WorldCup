const state = requireState();

document.querySelector("#trophy-stats").textContent = `${state.player} \u00b7 4 wins \u00b7 ${state.totalBeaten} defenders beaten`;

const confetti = document.querySelector("#confetti");
const CONFETTI_COLORS = ["#f87171", "#60a5fa", "#4ade80", "#f472b6", "#fbbf24"];

for (let i = 0; i < 30; i++) {
    const piece = document.createElement("li");
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.style.animationDuration = `${2.5 + Math.random() * 3}s`;
    piece.style.animationDelay = `${Math.random() * 3}s`;
    confetti.appendChild(piece);
}
