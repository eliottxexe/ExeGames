const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 15,
    color: 'yellow',
    speed: 5,
    dx: 0
};

let obstacles = [];
let score = 0;
let gameRunning = true;
let restartTimeout = null;

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
        player.dx = -player.speed;
    } else if (e.code === 'ArrowRight') {
        player.dx = player.speed;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        player.dx = 0;
    }
});

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

function updatePlayer() {
    player.x += player.dx;

    if (player.x - player.radius < 0) {
        player.x = player.radius;
    }

    if (player.x + player.radius > canvas.width) {
        player.x = canvas.width - player.radius;
    }
}

class Obstacle {
    constructor() {
        this.x = Math.random() * (canvas.width - 100) + 50;
        this.y = 0;
        this.width = 20;
        this.height = 100;
        this.color = 'red';
        this.speed = 3;
        this.angle = 0;
        this.rotationSpeed = Math.random() * 0.05 + 0.01;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    update() {
        this.y += this.speed;
        this.angle += this.rotationSpeed;

        if (this.y - this.height / 2 > canvas.height) {
            this.y = 0;
            this.x = Math.random() * (canvas.width - 100) + 50;
            this.angle = 0;
            score++;
        }
    }
}

function createObstacles() {
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].y > canvas.height / 4) {
        obstacles.push(new Obstacle());
    }
}

function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.update();

        if (obstacle.y - obstacle.height / 2 > canvas.height) {
            obstacles.splice(index, 1);
        }

        if (detectCollision(player, obstacle)) {
            gameRunning = false;
            if (!restartTimeout) {
                restartTimeout = setTimeout(restartGame, 3000);
            }
        }
    });
}

function drawObstacles() {
    obstacles.forEach(obstacle => obstacle.draw());
}

function detectCollision(player, obstacle) {
    let distX = Math.abs(player.x - obstacle.x);
    let distY = Math.abs(player.y - obstacle.y);
    if (distX > (obstacle.width / 2 + player.radius)) { return false; }
    if (distY > (obstacle.height / 2 + player.radius)) { return false; }

    if (distX <= (obstacle.width / 2)) { return true; }
    if (distY <= (obstacle.height / 2)) { return true; }

    let dx = distX - obstacle.width / 2;
    let dy = distY - obstacle.height / 2;
    return (dx * dx + dy * dy <= (player.radius * player.radius));
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function restartGame() {
    player.x = canvas.width / 2;
    player.y = canvas.height - 30;
    player.dx = 0;
    obstacles = [];
    score = 0;
    gameRunning = true;
    restartTimeout = null;
    gameLoop();
}

function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        updatePlayer();
        createObstacles();
        updateObstacles();
        drawObstacles();
        drawScore();
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = 'red';
        ctx.font = '50px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
        ctx.font = '30px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2 - 50, canvas.height / 2 + 50);
    }
}

gameLoop();
