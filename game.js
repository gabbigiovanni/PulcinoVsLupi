const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let chick = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    speed: 5,
    bullets: []
};

let wolves = [];
let gameOver = false;
let score = 0;

function spawnWolf() {
    const wolf = {
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: 2 + Math.random() * 3
    };
    wolves.push(wolf);
}

function drawChick() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(chick.x, chick.y, chick.width, chick.height);
}

function drawWolves() {
    ctx.fillStyle = 'gray';
    wolves.forEach(wolf => {
        ctx.fillRect(wolf.x, wolf.y, wolf.width, wolf.height);
    });
}

function drawBullets() {
    ctx.fillStyle = 'white';
    chick.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function moveChick() {
    if (keys['ArrowLeft'] && chick.x > 0) {
        chick.x -= chick.speed;
    }
    if (keys['ArrowRight'] && chick.x < canvas.width - chick.width) {
        chick.x += chick.speed;
    }
}

function moveBullets() {
    chick.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            chick.bullets.splice(index, 1);
        }
    });
}

function moveWolves() {
    wolves.forEach((wolf, index) => {
        wolf.y += wolf.speed;
        if (wolf.y > canvas.height) {
            wolves.splice(index, 1);
            gameOver = true;
        }
    });
}

function checkCollisions() {
    wolves.forEach((wolf, wolfIndex) => {
        chick.bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < wolf.x + wolf.width &&
                bullet.x + bullet.width > wolf.x &&
                bullet.y < wolf.y + wolf.height &&
                bullet.y + bullet.height > wolf.y
            ) {
                wolves.splice(wolfIndex, 1);
                chick.bullets.splice(bulletIndex, 1);
                score += 10;
            }
        });

        if (
            wolf.x < chick.x + chick.width &&
            wolf.x + wolf.width > chick.x &&
            wolf.y < chick.y + chick.height &&
            wolf.y + wolf.height > chick.y
        ) {
            gameOver = true;
        }
    });
}

function shoot() {
    const bullet = {
        x: chick.x + chick.width / 2 - 5,
        y: chick.y,
        width: 10,
        height: 20,
        speed: 7
    };
    chick.bullets.push(bullet);
}

function update() {
    if (gameOver) {
        alert(`Game Over! Punteggio: ${score}`);
        document.location.reload();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveChick();
    moveBullets();
    moveWolves();
    checkCollisions();

    drawChick();
    drawBullets();
    drawWolves();

    requestAnimationFrame(update);
}

let keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
        shoot();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

setInterval(spawnWolf, 1000);
update();
