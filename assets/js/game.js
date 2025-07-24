/* Прототип */

// const timer = document.querySelector('.timer-id');
// window.onload = function () {
//     let time = 99;
//     let timerInterval = setInterval(() => {
//         time--;
//         timer.textContent = time;
//         if (time == 0) {
//             clearInterval(timerInterval);
//         };
//     }, 1000);
// };

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;

// Класс анимации
class Animation {
  constructor(spriteSheetSrc, animationDataSrc, character) {
    this.spriteSheetImage = new Image();
    this.animationData = {};
    this.animations = {};
    this.currentAnimation = "idle";
    this.currentFrameIndex = 0;
    this.animationSpeed = 4; // Кадры в секунду по умолчанию
    this.frameCounter = 0;
    this.character = character; // Ссылка на персонажа, которым управляет эта анимация

    this.loadSpriteSheet(spriteSheetSrc, animationDataSrc);
  }

  async loadSpriteSheet(spriteSheetSrc, animationDataSrc) {
    try {
      const response = await fetch(animationDataSrc);
      this.animationData = await response.json();
      this.organizeAnimationData();
      this.spriteSheetImage.onload = () => {
        this.startAnimationLoop();
      };
      this.spriteSheetImage.src = spriteSheetSrc;
    } catch (error) {
      console.error("Ошибка загрузки данных анимации:", error);
    }
  }

  organizeAnimationData() {
    this.animations = {};
    for (const frameName in this.animationData.frames) {
      const frameData = this.animationData.frames[frameName];
      const animationName = frameName.split("_")[0];
      if (!this.animations[animationName]) {
        this.animations[animationName] = [];
      }
      this.animations[animationName].push(frameData.frame);
    }
    // Добавляем специфические скорости для анимаций (можно вынести в данные)
    this.animations["idle_speed"] = 3;
    this.animations["forward_speed"] = 7;
    this.animations["sit_speed"] = 3;
    this.animations["jump_speed"] = 4;
  }

  setAnimation(animationName) {
    if (
      this.animations[animationName] &&
      this.currentAnimation !== animationName
    ) {
      this.currentAnimation = animationName;
      this.currentFrameIndex = 0;
      this.frameCounter = 0;
    }
  }

  update() {
    this.frameCounter++;
    const animationSpeed =
      this.animations[this.currentAnimation + "_speed"] || this.animationSpeed;
    if (this.frameCounter >= Math.round(60 / animationSpeed)) {
      this.currentFrameIndex++;
      this.frameCounter = 0;
    }
  }

  draw(current_enemy) {
    const currentAnimationFrames = this.animations[this.currentAnimation];
    if (currentAnimationFrames) {
      const frameData =
        currentAnimationFrames[
          this.currentFrameIndex % currentAnimationFrames.length
        ];
      const character = this.character;

      ctx.save();

      let drawX = character.position.x - 65;
      let drawY = character.position.y - 25;
      let drawX_translated = character.position.x - 55;
      let drawY_translated = character.position.y - 25;

      if (this.currentAnimation == "sit") {
        drawX += 5;
        drawY -= 77;
        drawX_translated = drawX;
        drawY_translated = drawY;
      }

      // Проверяем, находится ли игрок справа от врага
      if (character.position.x > current_enemy.position.x) {
        ctx.translate(
          drawX_translated + frameData.w / 2,
          drawY_translated + frameData.h / 2
        );
        ctx.scale(-1, 1);
        ctx.drawImage(
          this.spriteSheetImage,
          frameData.x,
          frameData.y,
          frameData.w,
          frameData.h,
          -frameData.w / 2,
          -frameData.h / 2,
          frameData.w,
          frameData.h
        );
      } else {
        ctx.drawImage(
          this.spriteSheetImage,
          frameData.x,
          frameData.y,
          frameData.w,
          frameData.h,
          drawX,
          drawY,
          frameData.w,
          frameData.h
        );
      }

      ctx.restore();
    }
  }

  startAnimationLoop() {
    const animate = () => {
      this.update();
      requestAnimationFrame(animate);
    };
    animate();
  }
}

// Физические константы необходимые для игры
const gravity = 0.25;
const gameBoundaryMargin = 20;
const jumpForce = -12;
const moveSpeed = 2;
const onAir_moveSpeed = 4;

// Класс персонажа
class Character {
  constructor(config) {
    this.position = config.position;
    this.color = config.color;
    this.controls = config.controls;
    this.baseWidth = config.width;
    this.baseHeight = config.height;
    this.width = config.width;
    this.height = config.height;
    this.velocity = { x: 0, y: 0 };
    this.isOnAir = false;
    this.lastKey = null;
    this.keys = { left: false, right: false, up: false, down: false };
    this.shouldResetCrouch = false;

    // Используем экземпляр класса Animation
    this.animation = new Animation(
      "./assets/animations_data/character_sprites.png",
      "./assets/animations_data/character_sprites.json",
      this // Передаем ссылку на текущий экземпляр Character
    );
  }

  draw(current_enemy) {
    // hitbox-ы персонажа
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    // Теперь отрисовку анимации выполняет класс Animation
    this.animation.draw(current_enemy);
  }

  setAnimation(animationName) {
    this.animation.setAnimation(animationName);
  }

  update() {
    // Обновление высоты при прыжке и приседании
    const prevHeight = this.height;
    this.height = this.isOnAir
      ? Math.floor(this.baseHeight * 0.8)
      : this.baseHeight;

    // Изменение высоты персонажа при прыжке
    if (this.isOnAir) {
      this.position.y += prevHeight - this.height;
    }

    // Обновление позиции персонажа с учетом скорости
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Проверка на столкновение с нижней границей канваса
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      this.position.y = canvas.height - this.height;
      this.isOnAir = false;
      if (!this.keys.down && this.height !== this.baseHeight) {
        this.resetCrouch();
      }
    } else {
      this.velocity.y += gravity;
      this.isOnAir = true;
    }

    this.handleBoundaries();
    this.handleJumpAndSit();
    this.handleMovement();

    if (this.shouldResetCrouch && !this.keys.down && !this.isOnAir) {
      this.resetCrouch();
      this.shouldResetCrouch = false;
    }

    // Определяем текущую анимацию
    if (this.isOnAir) {
      this.setAnimation("jump");
    } else if (!this.isOnAir && this.keys.down) {
      this.setAnimation("sit");
    } else if (
      (Math.abs(this.velocity.x) > 0.1 && !this.isOnAir && this.keys.left) ||
      this.keys.right
    ) {
      this.setAnimation("forward");
    } else {
      this.setAnimation("idle");
    }
  } // end of update()

  handleMovement() {
    this.velocity.x = 0;
    if (this.keys.left && this.lastKey === "left") {
      this.velocity.x = this.isOnAir ? -onAir_moveSpeed : -moveSpeed;
    }
    if (this.keys.right && this.lastKey === "right") {
      this.velocity.x = this.isOnAir ? onAir_moveSpeed : moveSpeed;
    }
  }

  handleBoundaries() {
    // Проверка границ канваса
    if (this.position.x <= gameBoundaryMargin) {
      this.position.x = gameBoundaryMargin;
      if (!this.keys.right) this.velocity.x = 0;
    }
    if (this.position.x + this.width >= canvas.width - gameBoundaryMargin) {
      this.position.x = canvas.width - gameBoundaryMargin - this.width;
      if (!this.keys.left) this.velocity.x = 0;
    }
  }

  handleJumpAndSit() {
    // Прыжок
    if (this.keys.up && !this.isOnAir) {
      this.velocity.y = jumpForce;
      this.isOnAir = true;
    }

    // Приседание
    if (this.keys.down && !this.isOnAir && !this.keys.up) {
      const targetHeight = this.baseHeight / 2;
      this.keys.left = false;
      this.keys.right = false;
      if (this.height !== targetHeight) {
        this.position.y += this.height - targetHeight;
        this.height = targetHeight;
      }
    }
  }

  resetCrouch() {
    // Возвращаем персонажа в исходное состояние (в стойку)
    if (!this.isOnAir && this.height !== this.baseHeight) {
      this.position.y -= this.baseHeight - this.height;
      this.height = this.baseHeight;
    }
  }
}

// Обработка столкновений
function checkCollision(rect1, rect2) {
  return (
    rect1.position.x < rect2.position.x + rect2.width &&
    rect1.position.x + rect1.width > rect2.position.x &&
    rect1.position.y < rect2.position.y + rect2.height &&
    rect1.position.y + rect1.height > rect2.position.y
  );
}
function handlePush(attacker, defender) {
  const attackerCenter = attacker.position.x + attacker.width / 2;
  const defenderCenter = defender.position.x + defender.width / 2;
  defender.position.x += attackerCenter < defenderCenter ? 5 : -5;
}

// Создание персонажей
const Player = new Character({
  position: { x: Math.floor(canvas.width / 3 - 50), y: 0 },
  color: "red",
  width: 60,
  height: 155,
  controls: { left: "a", right: "d", up: "w", down: "s" },
});

const Enemy = new Character({
  position: { x: Math.floor(canvas.width / 1.5), y: 0 },
  color: "green",
  width: 60,
  height: 155,
  controls: {
    left: "ArrowLeft",
    right: "ArrowRight",
    up: "ArrowUp",
    down: "ArrowDown",
  },
});

const characters = [Player, Enemy];

var current_player = Player;
var current_enemy = Enemy;

// Обработка ввода
window.addEventListener("keydown", (e) => {
  characters.forEach((character) => {
    switch (e.key) {
      case character.controls.left:
        character.keys.left = true;
        character.lastKey = "left";
        break;
      case character.controls.right:
        character.keys.right = true;
        character.lastKey = "right";
        break;
      case character.controls.up:
        character.keys.up = true;
        break;
      case character.controls.down:
        character.keys.down = true;
        break;
    }
  });
});
window.addEventListener("keyup", (e) => {
  characters.forEach((character) => {
    switch (e.key) {
      case character.controls.left:
        character.keys.left = false;
        break;
      case character.controls.right:
        character.keys.right = false;
        break;
      case character.controls.up:
        character.keys.up = false;
        break;
      case character.controls.down:
        character.keys.down = false;
        character.shouldResetCrouch = true;
        break;
    }
  });
});

// Игровой цикл
function game_start() {
  window.requestAnimationFrame(game_start);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  current_player.draw(Enemy);
  current_player.update();

  current_enemy.draw(Player);
  current_enemy.update();

  if (checkCollision(Player, Enemy)) {
    handlePush(Player, Enemy);
    handlePush(Enemy, Player);
  }
}

// Запуск гемплея
game_start();
