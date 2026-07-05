const state = requireState();
const player = teamByName(state.player);
const opponent = teamByName(state.opponents[state.level]);

const GROUND = 15;
const BALL_X = 70;
const BALL_SIZE = 60;
const GRAVITY = 0.55;
const JUMP_VELOCITY = 12;
const DEFENDER_WIDTH = 150;
const DEFENDER_GAP = 4;

const groupByLevel = [[1], [1], [1], [1]];
const backgrounds = ["images/stad.png", "images/stad2.png", "images/stad3.png", "images/stad4.png"];


const pitch = document.querySelector("#pitch");
const ball = document.querySelector("#ball");
const scoreLabel = document.querySelector("#score-label");

const target = 10 + state.level * 2;
const speed = 4.5 + state.level * 0.8;

let bally = 0;
let velocity = 0;
let jumpsLeft = 2;
let obstacles = [];
let framesToSpawn = 60;
let score = 0;
let running = true;
let paused = false;
let rafId = null;

pitch.style.setProperty("--kit", opponent.kit);
pitch.style.backgroundImage = `url("${backgrounds[state.level]}")`;
document.querySelector("#match-label").textContent = `Level ${state.level + 1} - ${player.name} vs ${opponent.name}`;

function updateScoreLabel() {
    scoreLabel.textContent = `Passes: ${String(score).padStart(2, "0")}/${target}`;
}

function jump() {
    if (!running || paused) return;
    if (jumpsLeft > 0) {
        velocity = jumpsLeft === 2 ? JUMP_VELOCITY : JUMP_VELOCITY * 0.7;
        jumpsLeft--;
    }
}

function pickSize(){
    const options = groupByLevel[state.level];
    return options[Math.floor(Math.random() * options.length)];
}


function spawnDefender() {
    const size = pickSize();
    const wrapper = document.createElement("figure");
    wrapper.className = "obstacle";
    let tallest = 0;
    
    for (let i = 0; i < size; i++) {
        const person = document.createElement("figure");
        person.className = "defender";
        if (Math.random() < 0.5) {
            person.classList.add("two");
        }
        wrapper.appendChild(person);
    }

    tallest = 190;

    const width = size * DEFENDER_WIDTH + (size - 1) * DEFENDER_GAP;
    const x = pitch.offsetWidth + 20;
    wrapper.style.transform = `translateX(${x}px)`;
    pitch.appendChild(wrapper);
    obstacles.push({ el: wrapper, x, w: width, h: tallest, size, counted: false });
    framesToSpawn = Math.max(55, 92 - state.level * 6) + Math.floor(Math.random() * 40);
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
        jumpsLeft = 2;
    }
    ball.style.bottom = `${GROUND + bally}px`;
    ball.classList.toggle("jumping", bally > 2);
    framesToSpawn--;

    if (framesToSpawn <= 0) spawnDefender();
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.x -= speed;
        obstacle.el.style.transform = `translateX(${obstacle.x}px)`;

        const ballLeft = BALL_X + 55;
        const ballRight = BALL_X + 85;
        const defenderLeft = obstacle.x + 42;
        const defenderRight = obstacle.x + obstacle.w - 42;
        const overlapsX = defenderLeft < ballRight && defenderRight > ballLeft;

        if (overlapsX && bally < obstacle.h - 90) {
            endMatch(false);
            return;
        }

        if (!obstacle.counted && obstacle.x + obstacle.w < BALL_X) {
            obstacle.counted = true;
            score += 1;
            updateScoreLabel();
            if (score >= target) {
                endMatch(true);
                return;
            }
        }

        if (obstacle.x + obstacle.w < -20) {
            obstacle.el.remove();
            obstacles.splice(i, 1);
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