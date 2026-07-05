const state = requireState();
const nextBtn = document.querySelector("#next-btn");

document.querySelector("#goal-scoreline").textContent = `${state.player} 1 - 0 ${state.lastMatch.opponent}`;
nextBtn.textContent = state.level >= 4 ? "Lift The Trophy" : "Next Match";

nextBtn.addEventListener("click", () => {
    window.location.href = state.level >= 4 ? "trophy.html" : "levels.html";
});
