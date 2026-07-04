const state = requireState();

document.querySelector("#fulltime-scoreline").textContent = `${state.lastMatch.opponent} 1 - 0 ${state.player}`;
document.querySelector("#fulltime-stats").textContent = `You beat ${state.lastMatch.score} of ${state.lastMatch.target} defenders.`;
