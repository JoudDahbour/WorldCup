const state = requireState();
const player = teamByName(state.player);
const opponent = teamByName(state.opponents[state.level]);

const GROUND = 64;
const BALL_X = 70;
const BALL_SIZE = 34;
const GRAVITY = 0.55;
const JUMP_VELOCITY = 12;
const DEFENDER_WIDTH = 30;
const DEFENDER_GAP = 4;

const groupByLevel = [[1], [1,2], [1,3], [2,3]];


const pitch = document.querySelector("#pitch");
const ball = document.querySelector("#ball");
const scoreLabel = document.querySelector("#score-label");

const target = 8 + state.level * 2;
const speed = 4.5 + state.level * 0.8

let bally = 0;
let velocity = 0;
let canJump = true;
let obstacles = [];
let framesToSpawn = 60;
let score = 0;
let running = true;
let paused = false;
let rafId = null;

pitch.style.setProperty("--kit", opponent.kit);
document.querySelector("#match-label").textContent = `Level ${state.level + 1} - ${player.name} vs ${opponent.name}`;

function updateScoreLabel() {
    scoreLabel.textContent = `Beaten: ${String(score).padStart(2, "0")}/${target}`;
}

function jump() {
    if (!running || paused) return;
    if (canJump) {
        velocity = JUMP_VELOCITY;
        canJump = false;
    }
}

function pickSize(){
    const options = groupByLevel[state.level];
    return options[Math.floor(Math.random() * options.length)];
}

function isTall(size, index){
    if (size === 3) 
        return index === 1;
    if (size === 2)
        return state.level === 3 && Math.random() < 0.5 && index === 0;
    return false;
}

function spawnDefender() {
    const height = 55 + Math.floor(Math.random() * 26);
    const x = pitch.offsetWidth + 20;
    const el = document.createElement("figure");

    el.className = "defender";
    el.style.height = `${height}px`;
    el.style.transform = `translateX(${x}px)`;
    pitch.appendChild(el);
    defenders.push({ el, x, h: height, counted: false });
    framesToSpawn = Math.max(45, 85 - state.level * 8) + Math.floor(Math.random() * 45);
}

function endMatch(won) {
    running = false;
    cancelAnimationFrame(rafId);
    state.lastMatch = { opponent: opponent.name, score, target, won };

    if (won) {
        state.totalBeaten += score;
        state.results[state.level] = true;
        state.level++;
    }
    saveState(state);
    window.location.href = won ? "goal.html" : "fulltime.html";
}

function frame() {
    velocity -= GRAVITY;
    bally += velocity;
    if (bally <= 0) {
        bally = 0;
        velocity = 0;
        canJump = true;
    }
    ball.style.bottom = `${GROUND + bally}px`;

    framesToSpawn--;
    if (framesToSpawn <= 0) spawnDefender();

    for (let i = defenders.length - 1; i >= 0; i--) {
        const defender = defenders[i];
        defender.x -= speed;
        defender.el.style.transform = `translateX(${defender.x}px)`;

        const overlapsX = defender.x < BALL_X + BALL_SIZE - 8 && defender.x + 30 > BALL_X + 8;
        if (overlapsX && bally < defender.h - 6) {
            endMatch(false);
            return;
        }

        if (!defender.counted && defender.x + 30 < BALL_X) {
            defender.counted = true;
            score++;
            updateScoreLabel();
            if (score >= target) {
                endMatch(true);
                return;
            }
        }

        if (defender.x < -60) {
            defender.el.remove();
            defenders.splice(i, 1);
        }
    }

    rafId = requestAnimationFrame(frame);
}

pitch.addEventListener("pointerdown", jump);

document.addEventListener("keydown", (e) => {
    if (e.repeat) 
        return;
    if (e.code === "Space") {
        e.preventDefault();
        jump();
    }
    if (e.code === "KeyP" && running) {
        paused = !paused;
        if (paused) {
            cancelAnimationFrame(rafId);
        } else {
            rafId = requestAnimationFrame(frame);
        }
    }
});

updateScoreLabel();
rafId = requestAnimationFrame(frame);
