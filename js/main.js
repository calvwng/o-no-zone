// Start enchant
enchant();
 
// Starts when window is loaded
window.onload = function() {

	// Create game and set size.
	// Feel free to change, just make sure to change background images sizes in each screen to match
	var game = new Game(800, 600);

	// uncomment preload line and file with images and sounds with the following format
	// 'folder/image.png' or 'folder/sound.wav'. Just add commas to load multiples
	game.preload('res/images/back_button.png', 'res/images/background.png', 'res/images/beams_2.png',
				 'res/images/cell.jpg', 'res/images/chad_price.png', 'res/images/controls_button.png',
				 'res/images/cyberterrorist.jpg', 'res/images/drought.jpg', 'res/images/earthsatellites.jpg',
				 'res/images/earthsorbit.jpg', 'res/images/game_over.png', 'res/images/globalwarming.jpg',
				 'res/images/gold-ball.png', 'res/images/hp_bar.png', 'res/images/idle.png', 'res/images/logo.png',
				 'res/images/man01.png', 'res/images/mouse.png', 'res/images/portrait_hit.png', 'res/images/portrait_idle.png',
				 'res/images/portrait_nearDeath.png', 'res/images/restart_button.png', 'res/images/space_bg.jpeg',
				 'res/images/space_bg2.jpeg', 'res/images/space_bg3.jpeg', 'res/images/spacebar.png',
				 'res/images/Spaceship-Drakir6.png', 'res/images/start_button.png', 'res/images/wasd.png',
				 'res/images/winning.png', 'res/sounds/blast.wav', 'res/sounds/crunch.wav', 'res/sounds/enemyDie.wav',
				 'res/sounds/failure.wav', 'res/sounds/grunt.wav', 'res/sounds/ufo.mp3');

	// Basic game settings, feel free to change.
	game.fps = 30;
	game.scale = 1;

	// Starts when game is loaded
	game.onload = function() {

		var scene = new StartScreen();
		game.pushScene(scene);
	}

	// Start the game
	game.start();

	// Start Screen
	var StartScreen = Class.create(Scene, {

		initialize: function() {

			var game, bg, logo, startButton, controlsButton;

			// Get an instance of the Game object to reference
			game = Game.instance;

			// Call super constructor
			Scene.apply(this);

			// Set background to image, set size to same as game size
			bg = new Sprite(800, 600);
			bg.image = game.assets[/* Fill in with bg image */]

			// Create Start button and controls buttons to go to new screens
			// (needs to be filled in with images and set size)
			//startButton = new Sprite();
			//startButton.image = game.assets[];

			// Create logo image
			//logo = new Sprite();
			//logo.image = game.assets[];

			// Add everything to the scene
			this.addChild(bg);
			this.addChild(logo);
			this.addChild(startButton);
			this.addChild(controlsButton);

			// Create event listeners to listen for mouse clicks on buttons
			startButton.addEventListener(Event.TOUCH_START, this.playGame);
			controlsButton.addEventListener(Event.TOUCH_START, this.getControls);
		},

		// Loads the first level if Start button is clicked
		playGame: function(evt) {

			var game = Game.instance;
			game.replaceScene(new Level1());
		}

		// Loads the Controls screen if Controls button is clicked
		getControls: function(evt) {

			var game = Game.instance;
			game.replaceScene(new ControlsScreen());
		}

	});

	// Controls Screen
	var ControlsScreen = Class.create(Scene, {

		initialize: function() {

			var game, bg, backButton;

			// Get an instance of the Game object to reference
			game = Game.instance;

			// Call super constructor
			Scene.apply(this);

			// Set background to image, set size to same as game size
			bg = new Sprite(800, 600);
			bg.image = game.assets[/* Fill in with bg image */]

			// Create Back button to go back to start screen
			// (needs to be filled in with images and set size)
			//backButton = new Sprite();
			//backButton.image = game.assets[];

			// Create images for button controls
			//controls = new Sprite();
			//controls.image = game.assets[];

			this.addChild(bg);
			this.addChild(backButton);
			this.addChild(controls);

			backButton.addEventListener(Event.TOUCH_START, this.goBack);
		},

		goBack: function(evt) {

			var game = Game.instance;
			game.replaceScene(new StartScreen());
		}

	});

	var Level1 = Class.create (Scene, {

		// Fill in game logic here
	})

	// Game Over Screen
	var GameOverScreen = Class.create(Scene, {

		initialize: function() {

			var game, bg, logo, restartButton, backButton;

			// Get an instance of the Game object to reference
			game = Game.instance;

			// Call super constructor
			Scene.apply(this);

			// Set background to image, set size to same as game size
			bg = new Sprite(800, 600);
			bg.image = game.assets[/* Fill in with bg image */]

			// Create Restart button to go back to level 1
			// (needs to be filled in with images and set size)
			//restartButton = new Sprite();
			//restartButton.image = game.assets[];

			// Create Back button to go back to start screen
			// (needs to be filled in with images and set size)
			//backButton = new Sprite();
			//backButton.image = game.assets[];

			// Create image for Game Over logo
			//logo = new Sprite();
			//logo.image = game.assets[];

			this.addChild(bg);
			this.addChild(logo);
			this.addChild(restartButton);
			this.addChild(backButton);

			restartButton.addEventListener(Event.TOUCH_START, this.restartGame);
			backButton.addEventListener(Event.TOUCH_START, this.goBack);
		},

		restartGame: function (evt) {

			var game = Game.instance;
			game.replaceScene(new Level1());
		}

		goBack: function (evt) {

			var game = Game.instance;
			game.replaceScene(new StartScreen());
		}

	});

	// Winning Screen
	var WinningScreen = Class.create(Scene, {

		initialize: function() {

			var game, bg, logo, menuButton;

			// Get an instance of the Game object to reference
			game = Game.instance;

			// Call super constructor
			Scene.apply(this);

			// Set background to image, set size to same as game size
			bg = new Sprite(800, 600);
			bg.image = game.assets[/* Fill in with bg image */]

			// Create Main Menu button to go back to start screen
			// (needs to be filled in with images and set size)
			//menuButton = new Sprite();
			//menuButton.image = game.assets[];


			// Create image for You Win logo
			//logo = new Sprite();
			//logo.image = game.assets[];

			this.addChild(bg);
			this.addChild(logo);
			this.addChild(menuButton);

			menuButton.addEventListener(Event.TOUCH_START, this.goBack);
		},

		goBack: function (evt) {

			var game = Game.instance;
			game.replaceScene(new StartScreen());
		}

	});
}