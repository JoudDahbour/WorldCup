const teams = [
    { name: "Argentina", flag: "images/argentina.jpg", kit: "#75aadb" },
    { name: "Spain", flag: "images/spain.jpg", kit: "#c60b1e" },
    { name: "Egypt", flag: "images/egypt.jpg", kit: "#ce1126" },
    { name: "Portugal", flag: "images/portugal.jpg", kit: "#7a0930" },
    { name: "Germany", flag: "images/germany.jpg", kit: "#ffffff" }
];

const STORAGE_KEY = "cupRunnerState";

function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
}

function requireState() {
    const state = loadState();
    if (!state) window.location.href = "index.html";
    return state;
}

function teamByName(name) {
    return teams.find((team) => team.name === name);
}

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
