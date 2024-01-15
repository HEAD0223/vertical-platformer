window.addEventListener('keydown', (e) => {
	switch (e.key) {
		case 'ArrowRight':
			keys.ArrowRight.pressed = true;
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true;
			break;
		case 'ArrowUp':
			player.velocity.y = -4;
			break;
	}
});

window.addEventListener('keyup', (e) => {
	switch (e.key) {
		case 'ArrowRight':
			keys.ArrowRight.pressed = false;
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false;
			break;
	}
});
