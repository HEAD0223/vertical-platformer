class Player extends Sprite {
	constructor({
		position,
		collisionBlocks,
		platformCollisionBlocks,
		imageSrc,
		frameRate,
		scale = 0.5,
		animations,
	}) {
		super({ imageSrc, frameRate, scale });
		this.position = position;
		this.velocity = { x: 0, y: 1 };
		this.collisionBlocks = collisionBlocks;
		this.platformCollisionBlocks = platformCollisionBlocks;
		this.animations = animations;
		this.lastDirection = 'right';

		this.hitBox = {
			position: { x: 0, y: 0 },
			width: 17,
			height: 28,
		};

		for (let key in this.animations) {
			const image = new Image();
			image.src = this.animations[key].imageSrc;
			this.animations[key].image = image;
		}
	}

	switchSprite(key) {
		if (this.image === this.animations[key].image || !this.loaded) return;

		this.currentFrame = 0;
		this.image = this.animations[key].image;
		this.frameRate = this.animations[key].frameRate;
		this.frameBuffer = this.animations[key].frameBuffer;
	}

	update() {
		this.updateFrames();
		this.updateHitBox();
		this.updateCameraBox();

		// // Draw Hitbox
		// ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
		// ctx.fillRect(
		// 	this.cameraBox.position.x,
		// 	this.cameraBox.position.y,
		// 	this.cameraBox.width,
		// 	this.cameraBox.height,
		// );

		// // Draw Image
		// ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
		// ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

		// // Draw Hitbox
		// ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
		// ctx.fillRect(
		// 	this.hitBox.position.x,
		// 	this.hitBox.position.y,
		// 	this.hitBox.width,
		// 	this.hitBox.height,
		// );

		this.draw();

		this.position.x += this.velocity.x;
		this.updateHitBox();
		this.checkForHorizontalCollisions();
		this.applyGravity();
		this.updateHitBox();
		this.checkForVerticalCollisions();
	}

	updateHitBox() {
		this.hitBox = {
			position: { x: this.position.x + 32, y: this.position.y + 25 },
			width: 17,
			height: 28,
		};
	}

	updateCameraBox() {
		this.cameraBox = {
			position: { x: this.position.x - 55, y: this.position.y },
			width: 200,
			height: 80,
		};
	}

	checkForHorizontalCanvasCollision() {
		// Background Width: 576
		if (
			this.hitBox.position.x + this.hitBox.width + this.velocity.x >= 576 ||
			this.hitBox.position.x + this.velocity.x <= 0
		) {
			this.velocity.x = 0;
		}
	}

	// Background Width: 0 - 576
	// Background Height: 0 - 432
	// Camera Right & Left
	cameraMoveRight({ camera, scaledCanvas }) {
		const cameraBoxRightSide = this.cameraBox.position.x + this.cameraBox.width;
		if (cameraBoxRightSide >= 576) return;
		if (cameraBoxRightSide >= scaledCanvas.width + Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x;
		}
	}
	cameraMoveLeft({ camera, scaledCanvas }) {
		const cameraBoxLeftSide = this.cameraBox.position.x;
		if (cameraBoxLeftSide <= 0) return;
		if (cameraBoxLeftSide <= Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x;
		}
	}

	// Camera Top & Bottom
	cameraMoveTop({ camera, scaledCanvas }) {
		const cameraBoxTopSide = this.cameraBox.position.y;
		if (cameraBoxTopSide + this.velocity.y <= 0) return;
		if (cameraBoxTopSide <= Math.abs(camera.position.y)) {
			camera.position.y -= this.velocity.y;
		}
	}
	cameraMoveBottom({ camera, scaledCanvas }) {
		const cameraBoxBottomSide = this.cameraBox.position.y;
		if (cameraBoxBottomSide + this.cameraBox.height + this.velocity.y >= 432) return;
		if (
			cameraBoxBottomSide + this.cameraBox.height >=
			Math.abs(camera.position.y) + scaledCanvas.height
		) {
			camera.position.y -= this.velocity.y;
		}
	}

	checkForHorizontalCollisions() {
		for (let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i];
			if (collision({ object1: this.hitBox, object2: collisionBlock })) {
				// Right x-axis collision
				if (this.velocity.x > 0) {
					this.velocity.x = 0;
					const offset = this.hitBox.position.x - this.position.x + this.hitBox.width;
					this.position.x = collisionBlock.position.x - offset - 0.1;
					break;
				}
				// Left x-axis collision
				if (this.velocity.x < 0) {
					this.velocity.x = 0;
					const offset = this.hitBox.position.x - this.position.x;
					this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.1;
					break;
				}
			}
		}
	}

	applyGravity() {
		this.velocity.y += gravity;
		this.position.y += this.velocity.y;
	}

	checkForVerticalCollisions() {
		for (let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i];
			if (collision({ object1: this.hitBox, object2: collisionBlock })) {
				// Top y-axis collision
				if (this.velocity.y > 0) {
					this.velocity.y = 0;
					const offset = this.hitBox.position.y - this.position.y + this.hitBox.height;
					this.position.y = collisionBlock.position.y - offset - 0.1;
					break;
				}
				// Bottom y-axis collision
				if (this.velocity.y < 0) {
					this.velocity.y = 0;
					const offset = this.hitBox.position.y - this.position.y;
					this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.1;
					break;
				}
			}
		}

		// Platform collision
		for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
			const platformCollisionBlock = this.platformCollisionBlocks[i];
			if (platformCollision({ object1: this.hitBox, object2: platformCollisionBlock })) {
				// Top y-axis collision
				if (this.velocity.y > 0) {
					this.velocity.y = 0;
					const offset = this.hitBox.position.y - this.position.y + this.hitBox.height;
					this.position.y = platformCollisionBlock.position.y - offset - 0.1;
					break;
				}
			}
		}
	}
}
