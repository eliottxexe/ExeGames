const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = {
    x: 100,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    color: 'yellow',
    gravity: 1.15,
    lift: -8,
    velocity: 0
};

const pipes = [];
const pipeWidth = 70;
const pipeGap = 150;
let score = 0;
let gameRunning = true;
let restartTimeout = null;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        bird.velocity = bird.lift;
    }
});

function drawBird() {
    ctx.fillStyle = bird.color;
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    }

    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

class Pipe {
    constructor() {
        this.x = canvas.width;
        this.top = Math.floor(Math.random() * (canvas.height / 2)) + 50;
        this.bottom = this.top + pipeGap;
        this.width = pipeWidth;
        this.color = 'green';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, this.bottom, this.width, canvas.height - this.bottom);
    }

    update() {
        this.x -= 5;
    }

    offScreen() {
        return this.x < -this.width;
    }
}

function createPipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width / 2) {
        pipes.push(new Pipe());
    }
}

function updatePipes() {
    pipes.forEach((pipe, index) => {
        pipe.update();

        if (pipe.offScreen()) {
            pipes.splice(index, 1);
            score++;
        }

        if (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x) {
            if (bird.y < pipe.top || bird.y + bird.height > pipe.bottom) {
                gameRunning = false;
                if (!restartTimeout) {
                    restartTimeout = setTimeout(restartGame, 3000);
                }
            }
        }
    });
}

function drawPipes() {
    pipes.forEach(pipe => pipe.draw());
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function restartGame() {
    bird.x = 100;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    gameRunning = true;
    restartTimeout = null;
    gameLoop();
}

function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBird();
        updateBird();
        createPipes();
        updatePipes();
        drawPipes();
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
