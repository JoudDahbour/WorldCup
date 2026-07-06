const flagPicker = document.querySelector("#flag-picker");
const startCampaignBtn = document.querySelector("#start-campaign");
let chosenTeam = null;

teams.forEach((team) => {
    const btn = document.createElement("button");
    btn.className = "flag";
    const img = document.createElement("img");
    img.src = team.flag;
    img.alt = `${team.name} flag`;
    btn.append(img, team.name.toUpperCase());
    btn.addEventListener("click", () => {
        chosenTeam = team;
        document.querySelectorAll(".flag").forEach((flag) => flag.classList.remove("selected"));
        btn.classList.add("selected");
        startCampaignBtn.disabled = false;
    });
    
    flagPicker.appendChild(btn);
});

startCampaignBtn.addEventListener("click", () => {
    const opponents = shuffle(teams.filter((team) => team !== chosenTeam)).map((team) => team.name);
    saveState({
        player: chosenTeam.name,
        opponents,
        level: 0,
        results: [null, null, null, null],
        totalBeaten: 0,
        lastMatch: null
    });

    window.location.href = "levels.html";
});
