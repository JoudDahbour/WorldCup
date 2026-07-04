const state = requireState();
const levelCards = document.querySelector("#level-cards");

document.querySelector("#campaign-title").textContent = `${state.player}'s Road To The Cup`;

state.opponents.forEach((opponentName, index) => {
    const opponent = teamByName(opponentName);
    const card = document.createElement("article");
    card.className = "level";
    const img = document.createElement("img");
    img.src = opponent.flag;
    img.alt = `${opponent.name} flag`;
    const title = document.createElement("p");
    title.className = "match-name";
    title.textContent = `Level ${index + 1} \u00b7 ${opponent.name}`;
    const status = document.createElement("p");
    status.className = "status";
    if (state.results[index]) {
        card.classList.add("won");
        status.textContent = "Won 1 - 0 \u2713";
    } else if (index === state.level) {
        card.classList.add("current");
        status.textContent = "Play Now";
        card.addEventListener("click", () => {
            window.location.href = "game.html";
        });
    } else {
        card.classList.add("locked");
        status.textContent = "Locked";
    }
    card.append(img, title, status);
    levelCards.appendChild(card);
});
