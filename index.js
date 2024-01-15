const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
	width: canvas.width / 4,
	height: canvas.height / 4,
};

const floorCollsions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
	floorCollsions2D.push(floorCollisions.slice(i, i + 36));
}

const collisionBlocks = [];
floorCollsions2D.forEach((row, rowY) => {
	row.forEach((symbol, symbolX) => {
		if (symbol === 202) {
			collisionBlocks.push(new CollisionBlock({ position: { x: symbolX * 16, y: rowY * 16 } }));
		}
	});
});

const platformCollsions2D = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
	platformCollsions2D.push(platformCollisions.slice(i, i + 36));
}

const platformCollisionBlocks = [];
platformCollsions2D.forEach((row, rowY) => {
	row.forEach((symbol, symbolX) => {
		if (symbol === 202) {
			platformCollisionBlocks.push(
				new CollisionBlock({ position: { x: symbolX * 16, y: rowY * 16 }, height: 4 }),
			);
		}
	});
});

const gravity = 0.1;

const player = new Player({
	position: { x: 100, y: 300 },
	imageSrc: '/img/warrior/Idle.png',
	frameRate: 8,
	collisionBlocks,
	platformCollisionBlocks,
	animations: {
		idleRight: {
			imageSrc: '/img/warrior/Idle.png',
			frameRate: 8,
			frameBuffer: 8,
		},
		idleLeft: {
			imageSrc: '/img/warrior/IdleLeft.png',
			frameRate: 8,
			frameBuffer: 8,
		},
		runRight: {
			imageSrc: '/img/warrior/Run.png',
			frameRate: 8,
			frameBuffer: 12,
		},
		runLeft: {
			imageSrc: '/img/warrior/RunLeft.png',
			frameRate: 8,
			frameBuffer: 12,
		},
		jumpRight: {
			imageSrc: '/img/warrior/Jump.png',
			frameRate: 2,
			frameBuffer: 4,
		},
		jumpLeft: {
			imageSrc: '/img/warrior/JumpLeft.png',
			frameRate: 2,
			frameBuffer: 4,
		},
		fallRight: {
			imageSrc: '/img/warrior/Fall.png',
			frameRate: 2,
			frameBuffer: 4,
		},
		fallLeft: {
			imageSrc: '/img/warrior/FallLeft.png',
			frameRate: 2,
			frameBuffer: 4,
		},
	},
});

const keys = {
	ArrowRight: { pressed: false },
	ArrowLeft: { pressed: false },
	ArrowUp: { pressed: false },
};

const background = new Sprite({
	position: { x: 0, y: 0 },
	imageSrc: './img/background.png',
});

const backgroundImageHeight = 432;
const camera = {
	position: { x: 0, y: -backgroundImageHeight + scaledCanvas.height },
};

function animate() {
	requestAnimationFrame(animate);

	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.save();

	ctx.scale(4, 4);
	ctx.translate(camera.position.x, camera.position.y);
	background.update();

	// collisionBlocks.forEach((block) => block.update());
	// platformCollisionBlocks.forEach((block) => block.update());

	player.checkForHorizontalCanvasCollision();
	player.update();

	player.velocity.x = 0;
	if (keys.ArrowRight.pressed) {
		player.switchSprite('runRight');
		player.velocity.x = 2;
		player.lastDirection = 'right';
		player.cameraMoveRight({ camera, scaledCanvas });
	} else if (keys.ArrowLeft.pressed) {
		player.switchSprite('runLeft');
		player.velocity.x = -2;
		player.lastDirection = 'left';
		player.cameraMoveLeft({ camera, scaledCanvas });
	} else if (player.velocity.x === 0) {
		if (player.lastDirection === 'right') player.switchSprite('idleRight');
		else player.switchSprite('idleLeft');
	}

	if (player.velocity.y < 0) {
		player.cameraMoveTop({ camera, scaledCanvas });
		if (player.lastDirection === 'right') player.switchSprite('jumpRight');
		else player.switchSprite('jumpLeft');
	} else if (player.velocity.y > 0) {
		player.cameraMoveBottom({ camera, scaledCanvas });
		if (player.lastDirection === 'right') player.switchSprite('fallRight');
		else player.switchSprite('fallLeft');
	}

	ctx.restore();
}

animate();
