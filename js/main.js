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
				 'res/images/cell.jpg', 'res/images/chad_price_grin.png', 'res/images/controls_button.png',
				 'res/images/cyberterrorist.jpg', 'res/images/drought.jpg', 'res/images/earthsatellites.jpg',
				 'res/images/earthsorbit.jpg', 'res/images/game_over.png', 'res/images/globalwarming.jpg',
				 'res/images/gold-ball.png', 'res/images/hp_bar.png', 'res/images/idle.png', 'res/images/logo.png',
				 'res/images/man01.png', 'res/images/mouse.png', 'res/images/portrait_hit.png', 'res/images/portrait_idle.png',
				 'res/images/portrait_nearDeath.png', 'res/images/restart_button.png', 'res/images/space_bg.jpeg',
				 'res/images/space_bg2.jpeg', 'res/images/space_bg3.jpeg', 'res/images/spacebar.png',
				 'res/images/Spaceship-Drakir6.png', 'res/images/start_button.png', 'res/images/wasd.png',
				 'res/images/winning.png', 'res/sounds/blast.wav', 'res/sounds/crunch.wav', 'res/sounds/enemyDie.wav',
				 'res/sounds/failure.wav', 'res/sounds/grunt.wav', 'res/sounds/ufo.mp3', "./res/images/winning.png", "./res/images/game_over.png", 
                                 "./res/images/restart_button.png");

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

	//spaceship player Class
	var Player = Class.create(Sprite, {
		initialize: function(){
			var game;

			// 1 - Call superclass constructor
            Sprite.apply(this,[50, 56]);
			//get an instance of the game
			game = Game.instance;

			//initialize player velocity and acceleration (used for momentum)
			this.vx = 0;
			this.vy = 0;
			this.ax = 0;
			this.ay = 0;
			this.addEventListener('enterframe', function(e){

				//defining friction of the player with the ground
				var friction = 0;
				if(this.vx > 0.3) {
					friction = -0.3;
				} else if(this.vx > 0){
					friction = -this.vx;
				}
				if(this.vx < -0.3){
					friction = 0.3;
				} else if(this.vx < 0 ){
					fricition = -this.vx;
				}
				if(this.vy > 0.3) {
					friction = -0.3;
				} else if(this.vy > 0){
					friction = -this.vx;
				}
				if(this.vy < -0.3){
					friction = 0.3;
				} else if(this.vy < 0 ){
					friction = -this.vx;
				}

				this.ax = 0;
				this.ay = 0;

				//checking the input of the user
				if (game.input.left) this.ax -= 0.5;
            	if (game.input.right) this.ax += 0.5;
            	if (game.input.up) this.ax -= 0.5;
            	if (game.input.down) this.ax += 0.5;

            	this.vx += this.ax + friction;
            	this.vy += this.ay + friction; 
            	this.vx = Math.min(Math.max(this.vx, -10), 10);
            	this.vy = Math.min(Math.max(this.vy, -10), 10);

            	this.x += this.vx;
            	this.y += this.vy;
			});
		}
	});

	/**
	* SpinnerEnemy class
	*/
	var SpinnerEnemy = Class.create(Sprite, {
		  initialize: function(x, y) {
		  	   Sprite.apply(this, [98, 84]);

		  	   var game = Game.instance;
		  	   this.image = game.assets['res/images/Spaceship-Drakir6.png'];
		  	   this.x = x;
		  	   this.y = y;

		  	   this.addEventListener()
		  }
   });

	// Start Screen
	var StartScreen = Class.create(Scene, {

		initialize: function() {
			var gameWidth = 800, gameHeight = 600;

			var game, bg, logo, startButton, controlsButton;

			// Get an instance of the Game object to reference
			game = Game.instance;

			// Call super constructor
			Scene.apply(this);

			// Set background to image, set size to same as game size
			bg = new Sprite(gameWidth, gameHeight);
			bg.image = game.assets['res/images/background.png']

			// Create Start button and controls buttons to go to new screens
			// (needs to be filled in with images and set size)
			startButton = new Sprite(165, 39);
			startButton.image = game.assets['res/images/start_button.png'];
			startButton.x = 200;
			startButton.y = 400;

			// Create logo image
			logo = new Sprite(511, 174);
			logo.image = game.assets['res/images/logo.png'];
			logo.x = 150;
			logo.y = 200;

			// Create controls button
			controlsButton = new Sprite(137, 39);
			controlsButton.image = game.assets['res/images/controls_button.png'];
			controlsButton.x = 480;
			controlsButton.y = 400;


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
		},

		// Loads the Controls screen if Controls button is clicked
		getControls: function(evt) {

			var game = Game.instance;
			game.replaceScene(new ControlsScreen());
		}

	});

	// Controls Screen
	var ControlsScreen = Class.create(Scene, {

		initialize: function() {
			var game, bg, backButton, wasd, mouse, spacebar;

			// Get an instance of the Game object to reference
			game = Game.instance;

			// Call super constructor
			Scene.apply(this);

			// Set background to image, set size to same as game size
			bg = new Sprite(800, 600);
			bg.image = game.assets['res/images/background.png'];

			// Create Back button to go back to start screen
			backButton = new Sprite(96, 40);
			backButton.image = game.assets['res/images/back_button.png'];
			backButton.x = 100;
			backButton.y = 500;

			// Create images for button controls - WASD keys
			wasd = new Sprite(325, 220);
			wasd.image = game.assets['res/images/wasd.png'];
			wasd.x = 100;
			wasd.y = 125;

			// Create image for mouse click to fire
			mouse = new Sprite(130, 400);
			mouse.image = game.assets['res/images/mouse.png'];
			mouse.x = 550;

			// Create image for space bar to fire
			spacebar = new Sprite(225, 55);
			spacebar.image = game.assets['res/images/spacebar.png'];
			spacebar.x = 300;
			spacebar.y = 400;

			this.addChild(bg);
			this.addChild(backButton);
			this.addChild(wasd);
			this.addChild(mouse);
			this.addChild(spacebar)

			backButton.addEventListener(Event.TOUCH_START, this.goBack);
		},

		goBack: function(evt) {

			var game = Game.instance;
			game.replaceScene(new StartScreen());
		}

	});

	/**
	* Level 1 Game Logic
	*/
	var Level1 = Class.create (Scene, {
		initialize: function() {
		    Scene.apply(this);

		    var game, bg, enemies, i;
		    var maxSpinners = 10;

		    this.maxSpinners = maxSpinners;
		    game = Game.instance;

		    bg = new Sprite(800, 600);
		    bg.image = game.assets['res/images/space_bg3.jpeg'];

		    enemies = new Group();
		    this.enemies = enemies;

		    this.addChild(bg);
		    this.addChild(enemies);	

		    this.tl.setTimeBased();
		    this.addEventListener(Event.ENTER_FRAME, this.update);
		},

		update: function() {
			//-- Spawn SpinnerEnemy every 1000 ms
			this.tl.delay(1000).then(function() {
				// Limit enemies on screen to 10
				if (this.enemies.childNodes.length < 10) {
					var enemyX = Math.floor(Math.random() * 800);
					var enemyY = Math.floor(Math.random() * 600);
					this.enemies.addChild(new SpinnerEnemy(enemyX, enemyY));
				}

				// console.log("1000 ms interval tick.")
			});
		}
	});

	// Game Over Screen
   var GameOverScene = Class.create(Scene, {
      initialize: function() {
         Scene.apply(this);
         
         var gameOverImage = new Sprite(537, 174);
         gameOverImage.image = game.assets["./res/images/game_over.png"];
         gameOverImage.x = 125;
         gameOverImage.y = 100;
         
         var restartButton = new Sprite(119, 39);
         restartButton.image = game.assets["./res/images/restart_button.png"];
         restartButton.x = 345;
         restartButton.y = 325;
         this.addEventListener("touchstart", function() {
             game.replaceScene(new Level1());
         });

         this.backgroundColor = "black";
 
         this.addChild(restartButton);
         this.addChild(gameOverImage);
      }
   }); 
	// Winning Screen
   var WinningScene = Class.create(Scene, {
      initialize: function() {
         Scene.apply(this);
         
         var youWinImage = new Sprite(422, 174);
         youWinImage.image = game.assets["./res/images/winning.png"];
         youWinImage.x = 175;
         youWinImage.y = 25;

         var finalScore = new Label("Final Score: " + score);
         finalScore.color = "#0f0";
         finalScore.x = 300;
         finalScore.y = 250;
         finalScore.font = "30px sans-serif";

         var winText1 = new Label("The Harvesters have been defeated...");
         var winText2 = new Label("life on Earth will continue to press on!");
         winText1.color = winText2.color = "#0f0";
         winText1.x = 125;
         winText1.y = 400;
         winText1.font = winText2.font = "16px sans-serif";
         winText2.x = 394;
         winText2.y = 400;


         this.backgroundColor = "black";

         this.addChild(youWinImage);
         this.addChild(finalScore);
         this.addChild(winText1);
         this.addChild(winText2);
      }
   });  
}
