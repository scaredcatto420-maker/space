const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===============================
// TELA RESPONSIVA
// ===============================
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ===============================
// NAVE DO JOGADOR
// ===============================
let shipWidth = 50;
let shipHeight = 20;

let shipX = canvas.width / 2 - shipWidth / 2;
let shipY = canvas.height - 60;
let shipSpeed = 6;

// ===============================
// TIRO
// ===============================
let bullets = [];
let bulletSpeed = 8;

// ===============================
// CONTROLE POR TOQUE + MOUSE
// ===============================
function moverNave(x) {
  shipX = x - shipWidth / 2;

  if (shipX < 0) shipX = 0;
  if (shipX + shipWidth > canvas.width)
    shipX = canvas.width - shipWidth;
}

canvas.addEventListener("touchmove", e => {
  moverNave(e.touches[0].clientX);
});

canvas.addEventListener("mousemove", e => {
  moverNave(e.clientX);
});

canvas.addEventListener("touchstart", () => {
  atirar();
});

document.addEventListener("keydown", e => {
  if (e.code === "Space") atirar();
});

function atirar() {
  bullets.push({
    x: shipX + shipWidth / 2 - 3,
    y: shipY,
    width: 6,
    height: 12
  });
}

// ===============================
// INIMIGOS
// ===============================
let enemies = [];
let enemyRows = 4;
let enemyCols = 6;
let enemyWidth = 40;
let enemyHeight = 20;
let enemyPadding = 15;
let enemyOffsetTop = 60;
let enemyOffsetLeft = 30;
let enemySpeed = 1;

function criarInimigos() {
  enemies = [];
  for (let c = 0; c < enemyCols; c++) {
    for (let r = 0; r < enemyRows; r++) {
      enemies.push({
        x:
          c * (enemyWidth + enemyPadding) +
          enemyOffsetLeft,
        y:
          r * (enemyHeight + enemyPadding) +
          enemyOffsetTop,
        width: enemyWidth,
        height: enemyHeight,
        alive: true
      });
    }
  }
}
criarInimigos();

// ===============================
// GAME LOOP
// ===============================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // NAVE
  ctx.fillStyle = "white";
  ctx.fillRect(shipX, shipY, shipWidth, shipHeight);

  // TIROS
  bullets.forEach((b, i) => {
    b.y -= bulletSpeed;
    ctx.fillRect(b.x, b.y, b.width, b.height);

    if (b.y < 0) bullets.splice(i, 1);
  });

  // INIMIGOS
  let baterNaBorda = false;

  enemies.forEach(enemy => {
    if (!enemy.alive) return;

    enemy.x += enemySpeed;
    if (
      enemy.x + enemy.width > canvas.width ||
      enemy.x < 0
    ) {
      baterNaBorda = true;
    }

    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // COLISÃO TIRO vs INIMIGO
    bullets.forEach((b, bi) => {
      if (
        b.x < enemy.x + enemy.width &&
        b.x + b.width > enemy.x &&
        b.y < enemy.y + enemy.height &&
        b.y + b.height > enemy.y
      ) {
        enemy.alive = false;
        bullets.splice(bi, 1);
      }
    });
  });

  // SE CHEGAR NA BORDA, DESCE
  if (baterNaBorda) {
    enemySpeed *= -1;
    enemies.forEach(e => {
      e.y += 25;
    });
  }

  requestAnimationFrame(draw);
}

draw();
