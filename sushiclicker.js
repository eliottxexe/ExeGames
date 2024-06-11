let sushis = 0;
let sushisPerClick = 1;
let autoClickerCost = 50;
let upgradeClickCost = 10;
let rebirthCost = 1000;
let autoClickers = 0;
let rebirthMultiplier = 1;

const sushiElement = document.getElementById('sushi');
const scoreElement = document.getElementById('score');
const perClickElement = document.getElementById('per-click');
const upgradeClickButton = document.getElementById('upgrade-click');
const autoClickerButton = document.getElementById('auto-clicker');
const rebirthButton = document.getElementById('rebirth-button');

function updateDisplay() {
    scoreElement.textContent = `Sushis: ${sushis}`;
    perClickElement.textContent = `Sushis per click: ${sushisPerClick}`;
    upgradeClickButton.textContent = `Increase Click Power (Cost: ${upgradeClickCost} sushis)`;
    autoClickerButton.textContent = `Buy Auto Clicker (Cost: ${autoClickerCost} sushis)`;
    rebirthButton.textContent = `Rebirth (Cost: ${rebirthCost} sushis)`;

    upgradeClickButton.disabled = sushis < upgradeClickCost;
    autoClickerButton.disabled = sushis < autoClickerCost;
    rebirthButton.disabled = sushis < rebirthCost;
}

sushiElement.addEventListener('click', () => {
    sushis += sushisPerClick;
    updateDisplay();
});

upgradeClickButton.addEventListener('click', () => {
    if (sushis >= upgradeClickCost) {
        sushis -= upgradeClickCost;
        sushisPerClick += 1;
        upgradeClickCost = Math.floor(upgradeClickCost * 1.5);
        updateDisplay();
    }
});

autoClickerButton.addEventListener('click', () => {
    if (sushis >= autoClickerCost) {
        sushis -= autoClickerCost;
        autoClickers += 1;
        autoClickerCost = Math.floor(autoClickerCost * 1.5);
        updateDisplay();
    }
});

rebirthButton.addEventListener('click', () => {
    if (sushis >= rebirthCost) {
        sushis = 0;
        sushisPerClick = 1;
        autoClickers = 0;
        rebirthMultiplier += 1;
        upgradeClickCost = 10;
        autoClickerCost = 50;
        rebirthCost = Math.floor(rebirthCost * 1.5);
        updateDisplay();
    }
});

function autoClick() {
    if (autoClickers > 0) {
        sushis += autoClickers * rebirthMultiplier;
        updateDisplay();
    }
}

setInterval(autoClick, 1000);
updateDisplay();
