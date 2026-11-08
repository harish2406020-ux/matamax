const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let keys = {};
let mouse = {
    x: 500,
    y: 300,
    down: false
};

// Player
let player = {
    x: 500,
    y: 300,
    radius: 18,
    speed: 4,
    health: 100
};

// Bullets
let bullets = [];

// Enemies
let enemies = [];

for (let i = 0; i < 8; i++) {
    enemies.push({
        x: Math.random() * 900 + 50,
        y: Math.random() * 500 + 50,
        radius: 18,
        health: 50,
        speed: 1
    });
}

// Safe zone
let zone = {
    x: 500,
    y: 300,
    radius: 280
};

document.addEventListener("keydown", function(e) {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function(e) {
    keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener("mousemove", function(e) {
    let rect = canvas.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("mousedown", function() {
    mouse.down = true;
    shoot();
});

canvas.addEventListener("mouseup", function() {
    mouse.down = false;
});

// Player movement
function movePlayer() {

    if (keys["w"]) {
        player.y -= player.speed;
    }

    if (keys["s"]) {
        player.y += player.speed;
    }

    if (keys["a"]) {
        player.x -= player.speed;
    }

    if (keys["d"]) {
        player.x += player.speed;
    }

    player.x = Math.max(20, Math.min(canvas.width - 20, player.x));
    player.y = Math.max(20, Math.min(canvas.height - 20, player.y));
}

// Shooting
function shoot() {

    let angle = Math.atan2(
        mouse.y - player.y,
        mouse.x - player.x
    );

    bullets.push({
        x: player.x,
        y: player.y,
        dx: Math.cos(angle) * 8,
        dy: Math.sin(angle) * 8,
        radius: 5
    });
}

// Update bullets
function updateBullets() {

    bullets.forEach((bullet, index) => {

        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        if (
            bullet.x < 0 ||
            bullet.x > canvas.width ||
            bullet.y < 0 ||
            bullet.y > canvas.height
        ) {
            bullets.splice(index, 1);
        }
    });
}

// Enemy AI
function updateEnemies() {

    enemies.forEach((enemy, enemyIndex) => {

        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;

        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 30) {
            enemy.x += (dx / distance) * enemy.speed;
            enemy.y += (dy / distance) * enemy.speed;
        }

        // Enemy attacks player
        if (distance < 35) {
            player.health -= 0.2;
        }

        // Bullet collision
        bullets.forEach((bullet, bulletIndex) => {

            let bx = bullet.x - enemy.x;
            let by = bullet.y - enemy.y;

            let bulletDistance = Math.sqrt(
                bx * bx + by * by
            );

            if (bulletDistance < enemy.radius) {

                enemy.health -= 25;

                bullets.splice(bulletIndex, 1);

                if (enemy.health <= 0) {
                    enemies.splice(enemyIndex, 1);
                }
            }
        });
    });
}

// Safe zone
function updateZone() {

    if (zone.radius > 100) {
        zone.radius -= 0.02;
    }

    let dx = player.x - zone.x;
    let dy = player.y - zone.y;

    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > zone.radius) {
        player.health -= 0.1;
    }
}

// Draw player
function drawPlayer() {

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y,
        player.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "blue";
    ctx.fill();

    // Gun direction
    let angle = Math.atan2(
        mouse.y - player.y,
        mouse.x - player.x
    );

    ctx.strokeStyle = "black";
    ctx.lineWidth = 6;

    ctx.beginPath();

    ctx.moveTo(player.x, player.y);

    ctx.lineTo(
        player.x + Math.cos(angle) * 30,
        player.y + Math.sin(angle) * 30
    );

    ctx.stroke();
}

// Draw enemies
function drawEnemies() {

    enemies.forEach(enemy => {

        ctx.beginPath();

        ctx.arc(
            enemy.x,
            enemy.y,
            enemy.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "red";
        ctx.fill();

    });
}

// Draw bullets
function drawBullets() {

    bullets.forEach(bullet => {

        ctx.beginPath();

        ctx.arc(
            bullet.x,
            bullet.y,
            bullet.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "yellow";
        ctx.fill();

    });
}

// Draw safe zone
function drawZone() {

    ctx.beginPath();

    ctx.arc(
        zone.x,
        zone.y,
        zone.radius,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.stroke();
}

// Health bar
function drawHealth() {

    ctx.fillStyle = "black";
    ctx.fillRect(20, 20, 200, 25);

    ctx.fillStyle = "lime";
    ctx.fillRect(
        20,
        20,
        Math.max(0, player.health) * 2,
        25
    );

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";

    ctx.fillText(
        "HP: " + Math.floor(player.health),
        25,
        40
    );

    ctx.fillText(
        "Enemies: " + enemies.length,
        800,
        40
    );
}

// Game loop
function gameLoop() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    movePlayer();

    updateBullets();
    updateEnemies();
    updateZone();

    drawZone();
    drawPlayer();
    drawEnemies();
    drawBullets();
    drawHealth();

    if (player.health <= 0) {

        ctx.fillStyle = "red";
        ctx.font = "50px Arial";

        ctx.fillText(
            "GAME OVER",
            350,
            300
        );

        return;
    }

    if (enemies.length === 0) {

        ctx.fillStyle = "yellow";
        ctx.font = "50px Arial";

        ctx.fillText(
            "YOU WIN!",
            380,
            300
        );

        return;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
