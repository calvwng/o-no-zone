// Start enchant
enchant();
 
// Starts when window is loaded
window.onload = function() {
   var mouseX, mouseY;

	// Create game and set size.
	// Feel free to change, just make sure to change background images sizes in each screen to match
	var game = new Game(800, 600);

	// uncomment preload line and file with images and sounds with the following format
	// 'folder/image.png' or 'folder/sound.wav'. Just add commas to load multiples
	game.preload('res/images/back_button.png', 'res/images/background.png', 'res/images/beams_2.png', 'res/images/button-blue.png',
				 'res/images/cell.jpg', 'res/images/chad_price_grin.png', 'res/images/controls_button.png',
				 'res/images/cyberterrorist.jpg', 'res/images/drought.jpg', 'res/images/earthsatellites.png',
				 'res/images/earthsorbit.jpg', 'res/images/game_over.png', 'res/images/globalwarming.jpg',
				 'res/images/gold-ball.png', 'res/images/hp_bar.png', 'res/images/idle.png', 'res/images/logo.png',
				 'res/images/man01.png', 'res/images/mouse.png', 'res/images/portrait_hit.png', 'res/images/portrait_idle.png',
				 'res/images/portrait_nearDeath.png', 'res/images/restart_button.png', 'res/images/space_bg.jpeg',
				 'res/images/space_bg2.jpeg', 'res/images/space_bg3.jpeg', 'res/images/spacebar.png',
				 'res/images/Spaceship-Drakir6.png', 'res/images/start_button.png', 'res/images/wasd.png',
				 'res/images/winning.png', "res/images/winning.png", 
             "res/images/game_over.png", "res/images/restart_button.png", "res/images/Smoke30Frames_0.png",
             "res/images/asteroid_sheet30.png", "res/images/asteroid-pieces.png", "res/images/explosion_sheet16.png",
             "res/images/Com Relay.png", "res/images/Station Center.png", "res/images/Station Ring.png",
             "res/images/boomerang_bullet.png", "res/images/beams.png", "res/images/powers.png", "res/images/PU_speed.png",
             "res/images/PU_health.png", "res/images/turret_shooting.png", "res/images/turret_grid.png", "res/images/finish_build_button.png",
             "res/images/skip.png", "res/images/controlScreen.png", "res/images/ship_left4.png", "res/images/ship_right4.png");

   // Setup Soundmanager2.js
   soundManager.setup({
     // where to find flash audio SWFs, if any
     url: '',
     debugMode: false,
     onready: function() {
       // Preload sounds
       Game.instance.soundBlast = soundManager.createSound({
         url: 'res/sounds/blast.wav'
       });
       Game.instance.soundCrunch = soundManager.createSound({
         url: 'res/sounds/crunch.wav'
       });
       Game.instance.soundEnemyDie = soundManager.createSound({
         url: 'res/sounds/enemyDie.wav'
       });
       Game.instance.soundFailure = soundManager.createSound({
         url: 'res/sounds/failure.wav'
       });
       Game.instance.soundGrunt = soundManager.createSound({
         url: 'res/sounds/grunt.wav'
       });
       Game.instance.soundUfo = soundManager.createSound({
         url: 'res/sounds/ufo.mp3'
       });
       Game.instance.soundChaChing = soundManager.createSound({
         url: 'res/sounds/cha-ching.wav'
       });
       Game.instance.soundError = soundManager.createSound({
         url: 'res/sounds/error.mp3'
       });
       Game.instance.soundPowerUp = soundManager.createSound({
         url: 'res/sounds/power-up.mp3'
       });
       console.log("Sounds preloaded!");                    
     }
   });

	// Basic game settings, feel free to change.
	game.fps = 30;
	game.scale = 1;
	
   // JavaScript keycode bindings
   game.keybind(87, 'up');    // W
   game.keybind(65, 'left');  // A
   game.keybind(83, 'down');  // S
   game.keybind(68, 'right'); // D
    game.keybind(17, 'a');     // CTRL
   game.keybind(16, 'b');     // SHIFT IN	

	// Starts when game is loaded
	game.onload = function() {

		var scene = new StartScreen();
		game.pushScene(scene);
	}

	// Start the game
	game.start();

	var loopSound = function(sound) {
      sound.play({
         onfinish: function() {
            loopSound(sound);
         }
      });
   }

	//turret class that players can move, have all other turrets inherit this class
	var Turret = Class.create(Sprite, {
		initialize: function(type) {
			var game, turret, touching, moveable, active, cost, mouseX, mouseY, paid;

			this.touching = false;
			this.moveable = false;
			this.active = false;
			this.cost = 200;
			this.paid = false;


			Sprite.apply(this,[70,70]);

			game= Game.instance;

			turret = this;

			//event listener for when selected
			this.addEventListener('touchstart', function(e){
				this.touching = true;
				if(!this.moveable){
					Game.instance.soundError.play();
				}
			});
			this.addEventListener('touchend', function(e){
				this.touching = false;
				if((!this.paid) && this.active && this.moveable){
					Game.instance.currentScene.player.score -= this.cost;
					this.paid = true;
					Game.instance.soundChaChing.play();
				}
			});
			this.addEventListener('enterframe', function(e){


				if(this.active){
					if(type == "dumb"){
						
						var angle = Math.atan2(turret.mouseY - this.y, turret.mouseX - this.x);
           				angle = angle * (180/Math.PI);

         				turret.rotation = 90 + angle;
					}	
				}

				if(this.touching && this.moveable && Game.instance.currentScene.build){
					
					this.x = this.mouseX - this.width/2;
					this.y = this.mouseY - this.width/2; 
				}

				

			});

			document.addEventListener("mousemove", function(e){
				turret.mouseX = e.clientX;
				turret.mouseY = e.clientY;
				
				
					
			});

		}
	});

	//spaceship player Class
	var Player = Class.create(Sprite, {
		initialize: function(){

			var game, player, health, maxHealth, score, speed, mouseX, mouseY;

			// 1 - Call superclass constructor
         Sprite.apply(this,[50, 56]);
			//get an instance of the game
			game = Game.instance;
			//refference to current player
			player = this;
			health = maxHealth = 100;
      	this.vulnerable = true;
      	this.vulnerableTimer = 1000; // 1 sec before becoming vulnerable again
			this.score = 0;
			speed = 1;
			this.speed = speed;


			//initialize player velocity and acceleration (used for momentum)
			this.vx = 0;
			this.vy = 0;
			this.ax = 0;
			this.ay = 0;

			this.image = game.assets['res/images/idle.png'];

			document.addEventListener("mousemove", function(e){
				player.mouseX = e.clientX;
				player.mouseY = e.clientY;

			});

			this.addEventListener('enterframe', this.update);
		}, 

		update: function() {
			//check if player is dead
			if(this.health <= 0){
				Game.instance.soundUfo.stop();
				Game.instance.replaceScene(new GameOverScene());
			}
         //-- Check player collision with enemy
         var enemies = Game.instance.currentScene.enemies;
         for (var i = 0; this.vulnerable == true && i < enemies.childNodes.length; i++) {
            if (this.within(enemies.childNodes[i], 32)) {
               this.getHurt();
               break;
            }
         }

			//console.log("x : " + this.mouseX + "y : " + this.mouseY);
			var angle = Math.atan2(this.mouseY - this.y, this.mouseX - this.x);
           	angle = angle * (180/Math.PI);

         	this.rotation = 90 + angle;

			//defining friction of the player with the ground
			var friction_x = 0;
			var friction_y = 0;
			if(this.vx > 0.2) {
				friction_x = -0.2;
			} else if(this.vx > 0){
				friction_x = -this.vx;
			}
			if(this.vx < -0.2){
				friction_x = 0.2;
			} else if(this.vx < 0 ){
				friction_x = -this.vx;
			}
			if(this.vy > 0.2) {
				friction_y = -0.2;
			} else if(this.vy > 0){
				friction_y = -this.vy;
			}
			if(this.vy < -0.2){
				friction_y = 0.2;
			} else if(this.vy < 0 ){
				friction_y = -this.vy;
			}

			this.ax = 0;
			this.ay = 0;

			//checking the input of the user
			if (game.input.left) {
            this.ax -= 0.5 * this.speed;
            this.image = game.assets["res/images/ship_left4.png"];
         }
      	if (game.input.right) {
           this.ax += 0.5 * this.speed;
           this.image = game.assets["res/images/ship_right4.png"];
        }
        if (!game.input.right && !game.input.left) {
           this.image = game.assets["res/images/idle.png"];
        }
      	if (game.input.up) this.ay -= 0.5 * this.speed;
      	if (game.input.down) this.ay += 0.5 * this.speed;
      	this.vx += this.ax + friction_x;
      	this.vy += this.ay + friction_y; 
      	this.vx = Math.min(Math.max(this.vx, -10), 10);
      	this.vy = Math.min(Math.max(this.vy, -10), 10);

         // Keep Player within screen boundaries
         var newX = this.x + this.vx;
         var newY = this.y + this.vy;
         if (newX >= 0 && newX < 750) {
            this.x = newX;
         }
         if (newY >= 0 && newY < 550) {
            this.y = newY;
         }
	   },

      getHurt: function() {
         this.vulnerable = false;
         this.health -= 10;
         // Fade out and in to denote damage and temporary invlunerability
         for (var f = 0; f < 3; f++) { 
           this.tl.fadeOut(5);
           this.tl.fadeIn(5);                  
         }               
         this.tl.delay(15).then(function() {
            this.vulnerable = !this.vulnerable;
         });
         console.log("Player health reduced to :" + this.health);         
      }
	}); // END Player

	/**
	* SpinnerEnemy class
	*/
	var SpinnerEnemy = Class.create(Sprite, {
		  initialize: function(x, y) {
		  	   Sprite.apply(this, [98, 84]);

            this.targetX;
            this.targetY;

		  	   var game = Game.instance;
		  	   this.image = game.assets['res/images/Spaceship-Drakir6.png'];
		  	   this.x = x;
		  	   this.y = y;

		  	   this.addEventListener(Event.ENTER_FRAME, this.update);
		  },

        update: function() {
            this.targetX = Math.floor(Math.random() * 800);
            this.targetY = Math.floor(Math.random() * 600);
            this.tl.moveTo(this.targetX, this.targetY, 200);
        }
   });

   /**
   * ShootingEnemy class
   */
   var ShootingEnemy = Class.create(Sprite, {
        initialize: function(x, y) {
            Sprite.apply(this, [150, 108]);

            this.targetX;
            this.targetY;

            var game = Game.instance;
            this.image = game.assets['res/images/Station Center.png'];
            this.x = x;
            this.y = y;

            this.speed = 1;
            this.shootTimer = 1500;

            this.addEventListener(Event.ENTER_FRAME, this.update);
        },

        update: function(evt) {

            // Slowly move the ShootingEnemy towards the player
            var level = Game.instance.currentScene;
            var player = level.player;
            var startVec = new Victor(this.x, this.y);
            var targetVec = new Victor(
               player.x,
               player.y
            );
            var movementVec = targetVec.subtract(startVec);
            // Normalize vector to length 1 if movement is not [0, 0]
            if (movementVec.x != 0 && movementVec.y != 0) {
               movementVec.normalize();
            }            
            this.x += movementVec.x * this.speed;
            this.y += movementVec.y * this.speed;

            // Shoot at player
            if (this.within(level.bg, 600)) {
               this.shootTimer -= evt.elapsed;
               if (this.shootTimer <= 0) {
                  var enemyCenterX = this.x + 75;
                  var enemyCenterY = this.y + 54;
                  level.bullets.addChild(new EnemyBullet(enemyCenterX, enemyCenterY, player.x, player.y));
                  this.shootTimer = 1500;
               }
            }
        },
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
			startButton.addEventListener(Event.TOUCH_START, function() {
                           game.popScene(this);
                           game.pushScene(new StoryScene());
                        });
			controlsButton.addEventListener(Event.TOUCH_START, this.getControls);
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
/*
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
*/
			controlScreen = new Sprite(800, 600);
			controlScreen.image = game.assets['res/images/controlScreen.png'];
			controlScreen.x = 100;
			controlScreen.y = 17;

			this.addChild(bg);
			this.addChild(controlScreen);
			this.addChild(backButton);
			//this.addChild(wasd);
			//this.addChild(mouse);
			//this.addChild(spacebar)

			backButton.addEventListener(Event.TOUCH_START, this.goBack);
		},

		goBack: function(evt) {

			var game = Game.instance;
			game.replaceScene(new StartScreen());
		}

	});

	/**
	* Level Game Logic
	*/
	var Level = Class.create (Scene, {
		initialize: function(playerArg, maxEnemiesArg, powerupsArg, turretsArg) {
		    Scene.apply(this);

		    var game, bg, enemies, bullets, ozoneGroup, scenery, player, i, scoreDisplay;
		    var enemySpawnSec = 2000; // ms
		    var spinnerEnemyCount = 15;
		    var maxEnemies = maxEnemiesArg;
		    var healthbar, hudbar;

          	var pauseLabel;
          	this.paused = false;

		    this.spinnerEnemyCount = spinnerEnemyCount;
		    player = playerArg;
		    this.player = playerArg;
		    this.powerups = powerupsArg;

		    this.sendTurrets = turretsArg;
		    this.turrets = turretsArg;

		    this.store = false;
		    this.build = false;
		    game = Game.instance;

		    bg = new Sprite(800, 600);
		    bg.image = game.assets['res/images/space_bg3.jpeg'];
          this.bg = bg;

		    enemies = new Group();
		    this.enemies = enemies;
		    this.maxEnemies = maxEnemies;
		    this.enemiesKilled = 0;

          	bullets = new Group();
          	this.bullets = bullets;

		    hudbar = new Sprite(300, 100);
		    hudbar.image = game.assets['res/images/portrait_idle.png'];
		    hudbar.x = 0;
		    hudbar.y = 450;

		    scoreDisplay = new Label("Ozone Recovered: " + this.player.score);
		    scoreDisplay.x = 300;
		    scoreDisplay.y = 10;
		    scoreDisplay.color = 'white';
		    scoreDisplay.font = 'bold 14px sans-serif';
		    scoreDisplay.textAlign = 'center';
		    this.scoreDisplay = scoreDisplay;

          this.player = player;
          

          // Create the pause label
          pauseLabel = new Label('PAUSED');
          pauseLabel.x = 250;
          pauseLabel.y = 250;
          pauseLabel.color = 'red';
          pauseLabel.font = 'bold 32px sans-serif';
          pauseLabel.textAlign = 'center';
          this.pauseLabel = pauseLabel;

          // Experimental Ozone cloud sprite for future gameplay mechanics
          ozoneGroup = new Group();
          this.ozoneGroup = ozoneGroup;
          var ozoneCloud = new Ozone(300, 300);
          ozoneGroup.addChild(ozoneCloud);

          // Group for scenery sprites and effects
          scenery = new Group();
          this.scenery = scenery;

		    this.addChild(bg);
          this.addChild(scenery);
          this.addChild(ozoneGroup);

		    //adds a turret only if it is active
		    for(var i=0; i <  this.turrets.childNodes.length; i++){
		    	if(!this.turrets.childNodes[i].active){
		    		this.turrets.childNodes[i].visible = false;
		    	}
		    }

		    this.addChild(this.turrets);
		    this.addChild(bullets);
		    this.addChild(enemies);	
		    this.addChild(hudbar);
		    this.addChild(scoreDisplay);
		    this.addChild(player);

		    // draw healthbar
		     healthbar = document.getElementById("canvas");
		     var context = canvas.getContext('2d');
             this.context = context;
		     context.fillStyle = "Green";
		     context.fillRect(0, 0, 120, 28);


          this.shootingEnemyTimer = 3000;
          this.asteroidTimer = 5000 + Math.floor(Math.random() * 5000);

		    this.tl.setTimeBased();
		    this.addEventListener(Event.ENTER_FRAME, this.update);
          this.addEventListener(Event.B_BUTTON_DOWN, this.bHandler);
          this.addEventListener(Event.TOUCH_START, this.touchHandler);
		},

		update: function(evt) {
         //-- Spawn SpinnerEnemy every 1000 ms
         this.tl.delay(500).then(function() {
            // Limit enemies on screen
            if (this.enemies.childNodes.length < this.spinnerEnemyCount) {
               var enemyX = Math.floor(Math.random() * 2) ? -50 : 850;
               var enemyY = Math.floor(Math.random() * 600);
               this.enemies.addChild(new SpinnerEnemy(enemyX, enemyY));
            }
         });

         //-- Spawn ShootingEnemy every 3000 ms
         this.shootingEnemyTimer -= evt.elapsed;
         // Limit enemies on screen
         if (this.shootingEnemyTimer <= 0) {
            var enemyX = Math.floor(Math.random() * 2) ? -50 : 850;
            var enemyY = Math.floor(Math.random() * 2) ? -50 : 600;
            // console.log("Spawning ShootingEnemy at " + enemyX + ", " + enemyY);
            this.enemies.addChild(new ShootingEnemy(enemyX, enemyY));
            this.shootingEnemyTimer = 3000;
         }

         //-- Spawn a new asteroid after 5 + (0 to 5) seconds
         this.asteroidTimer -= evt.elapsed;
         // console.log("asteroidTimer: " + this.asteroidTimer);
         if (this.asteroidTimer <= 0) {
            var asteroidX = Math.floor(Math.random() * 2) ? -50 : 850;
            var asteroidY = Math.floor(Math.random() * 600);
            new Asteroid(asteroidX, asteroidY, 0.5);
            this.asteroidTimer = 5000 + Math.floor(Math.random() * 5000);
         };            

			this.scoreDisplay.text = "Ozone Recovered: " + this.player.score;;

         //-- Update health bar
         if (!this.paused) {
             // player.health -= 10;

             // Clear the canvas
             canvas.width = canvas.width;
             // Calculate health
             var percent = this.player.health/this.player.maxHealth;
             var context = this.context;
             context.fillStyle = "black";
             context.fillRect(0, 0, 120, 28);
             if (percent > 0.5) {
                context.fillStyle = "Green";
             }
             else if (percent > 0.3) {
                context.fillStyle = "Yellow";
             }
             else {
                context.fillStyle = "Red";
             }
             //Fill in bar position - x, y, width, height
             if (percent > 0) {
                context.fillRect(0, 0, 120 * percent, 28);
             }
             else {
                context.fillRect(0, 0, 0, 28);
             }
         }

			if (this.enemiesKilled >= this.maxEnemies) {
				Game.instance.replaceScene(new Store(this.player, this.maxEnemies, this.powerups, this.turrets));
			}
		},

      // Currently bound to 'SHIFT' key, for pausing
      bHandler: function(evt) {
          var game = Game.instance;

          if (this.paused == true) {
             playBgMusic();
             game.resume();
             this.removeChild(this.pauseLabel);        
          }
          else {
             Game.instance.soundUfo.pause(); 
             game.pause();
             this.addChild(this.pauseLabel);
          }
          this.paused = !this.paused;
      },      

      touchHandler: function(evt) {
         // If not paused && mouse is within game bounds
         if (!this.paused && evt.x < 800 && evt.y < 600 ) {
            // Spawn a bullet moving in line towards mouse
            var bullet = new Bullet(this.player.x, this.player.y, evt.x, evt.y);
            var radians = Math.atan2(evt.y - bullet.y, evt.x - bullet.x);
            var degrees = (radians/Math.PI) * 180;
            bullet.rotation = degrees + 90; 

            for(var i=0; i <  this.turrets.childNodes.length; i++){
		    	if(this.turrets.childNodes[i].active){
		    		var bullet2 = new Bullet(this.turrets.childNodes[i].x, this.turrets.childNodes[i].y, evt.x, evt.y);
           			var radians2 = Math.atan2(evt.y - bullet2.y, evt.x - bullet2.x);
            		var degrees2 = (radians2/Math.PI) * 180;
            		bullet2.rotation = degrees2 + 90; 
            		this.bullets.addChild(bullet2);
		    	}
		    }    
            this.bullets.addChild(bullet);
         }
      }
   });

	/**
	* Store level for upgrades
	*/
	var Store = Class.create (Scene, {
		initialize: function(playerArg, maxEnemiesArg, powerupsArg, turretsArg) {
		    Scene.apply(this);

		    var game, bg, bullets, player, enemies, i, scoreDisplay;
		    var maxEnemies = maxEnemiesArg;

          	var pauseLabel;
          	this.paused = false;

          	this.turrets = turretsArg;

		    player = playerArg;
		    this.player = playerArg;
		    var powerups = powerupsArg;
		    game = Game.instance;
		    this.store = true;
		    this.build = false;

		    bg = new Sprite(800, 600);
		    bg.image = game.assets['res/images/space_bg3.jpeg'];

		    enemies = new Group();
		    this.enemies = enemies;
		    this.maxEnemies = maxEnemies;
		    this.enemiesKilled = 0;

          	bullets = new Group();
          	this.bullets = bullets;

		    var hudbar = new Sprite(300, 100);
		    hudbar.image = game.assets['res/images/portrait_idle.png'];
		    hudbar.x = 0;
		    hudbar.y = 450;

		    scoreDisplay = new Label("Ozone Recovered: " + this.player.score);
		    scoreDisplay.x = 300;
		    scoreDisplay.y = 10;
		    scoreDisplay.color = 'white';
		    scoreDisplay.font = 'bold 14px sans-serif';
		    scoreDisplay.textAlign = 'center';
		    this.scoreDisplay = scoreDisplay;

          this.player = player;

          for (i = 0; i < powerups.childNodes.length; i++) {

          	if (this.player.score >= powerups.childNodes[i].cost) {
          		powerups.childNodes[i].unlocked = true;
          	}

          }

          this.powerups = powerups;

          // Create the pause label
          pauseLabel = new Label('PAUSED');
          pauseLabel.x = 250;
          pauseLabel.y = 250;
          pauseLabel.color = 'red';
          pauseLabel.font = 'bold 32px sans-serif';
          pauseLabel.textAlign = 'center';
          this.pauseLabel = pauseLabel;

          // Create labels for powerups and turrets costs
          powerLabel = new Label("POWER UPS cost " + powerups.childNodes[0].cost + " ozone");
          powerLabel.x = 10;
          powerLabel.y = 25;
          powerLabel.color = 'white';
          powerLabel.font = 'bold 16px sans-serif';
          powerLabel.textAlign = 'left';
          this.powerLabel = powerLabel;

          turretLabel = new Label("TURRETS cost " + turretsArg.childNodes[0].cost + " ozone");
          turretLabel.x = 10;
          turretLabel.y = 50;
          turretLabel.color = 'white';
          turretLabel.font = 'bold 16px sans-serif';
          turretLabel.textAlign = 'left';
          this.turretLabel = turretLabel;

          // Experimental Ozone cloud sprite for future gameplay mechanics
          ozoneGroup = new Group();
          this.ozoneGroup = ozoneGroup;
          var ozoneCloud = new Ozone(300, 300);
          ozoneGroup.addChild(ozoneCloud);

          // Group for scenery sprites and effects
          scenery = new Group();
          this.scenery = scenery;

		    this.addChild(bg);
		    this.addChild(powerups);
          this.addChild(bullets);
		    this.addChild(enemies);
		    this.addChild(powerLabel);
		    this.addChild(turretLabel);

		    this.addChild(player);
          this.addChild(scenery);
          this.addChild(ozoneGroup);
		    this.addChild(hudbar);
		    this.addChild(scoreDisplay);

		    // draw healthbar
		     healthbar = document.getElementById("canvas");
		     var context = canvas.getContext('2d');
		     context.fillStyle = "Green";
		     context.fillRect(0, 0, 120, 28);

		    this.tl.setTimeBased();
		  this.addEventListener(Event.ENTER_FRAME, this.update);
          this.addEventListener(Event.B_BUTTON_DOWN, this.bHandler);
          this.addEventListener(Event.TOUCH_START, this.touchHandler);
 
		},

		update: function() {

		},

      // Currently bound to 'SHIFT' key, for pausing
      bHandler: function(evt) {
          var game = Game.instance;

          if (this.paused == true) {
             playBgMusic();
             game.resume();
             this.removeChild(this.pauseLabel);        
          }
          else {
             Game.instance.soundUfo.pause();
             game.pause();
             this.addChild(this.pauseLabel);
          }
          this.paused = !this.paused;
      },      

      touchHandler: function(evt) {
         // If not paused && mouse is within game bounds
         if (!this.paused && evt.x < 800 && evt.y < 600) {
            // Spawn a bullet moving in line towards mouse
            var bullet = new Bullet(this.player.x, this.player.y, evt.x, evt.y);
            var radians = Math.atan2(evt.y - bullet.y, evt.x - bullet.x);
            var degrees = (radians/Math.PI) * 180;
            bullet.rotation = degrees + 90;     
            this.bullets.addChild(bullet);
         }
      }
   });

     // build scene used to place turrets
	var Build = Class.create (Scene, {
		initialize: function(playerArg, maxEnemiesArg, powerupsArg, turretsArg) {
		    Scene.apply(this);

		    var game, bg, bullets, player, enemies, i, scoreDisplay;
		    var maxEnemies = maxEnemiesArg;

          	var pauseLabel;
          	this.paused = false;

          	this.turrets = turretsArg;
          	this.store = false;
          	this.build = true;
          	

          	game = Game.instance;

          	this.player = playerArg;
          	var powerups = powerupsArg;


		    bg = new Sprite(800, 600);
		    bg.image = game.assets['res/images/space_bg3.jpeg'];

		    enemies = new Group();
		    this.enemies = enemies;
		    this.maxEnemies = maxEnemies;
		    this.enemiesKilled = 0;

          	bullets = new Group();
          	this.bullets = bullets;

          	buildLabel = new Label("BUILD LEVEL");
		    buildLabel.x = 300;
		    buildLabel.y = 10;
		    buildLabel.color = 'white';
		    buildLabel.font = 'bold 14px sans-serif';
		    buildLabel.textAlign = 'center';
		    this.scoreDisplay = scoreDisplay;


		    var finishBuildButton = new Sprite (149, 39);
		    finishBuildButton.image = game.assets['res/images/finish_build_button.png'];
		    finishBuildButton.x = 20;
		    finishBuildButton.y = 20;


		    scoreDisplay = new Label("Ozone Recovered: " + this.player.score);
		    scoreDisplay.x = 300;
		    scoreDisplay.y = 30;
		    scoreDisplay.color = 'white';
		    scoreDisplay.font = 'bold 14px sans-serif';
		    scoreDisplay.textAlign = 'center';
		    this.scoreDisplay = scoreDisplay;

		    var turret_grid = new Sprite(90, 600);
		    turret_grid.image = game.assets['res/images/turret_grid.png'];
		    turret_grid.x = game.width - 90;
		    turret_grid.y += 5;

		    this.turret_grid = turret_grid;

		    var hudbar = new Sprite(300, 100);
		    hudbar.image = game.assets['res/images/portrait_idle.png'];
		    hudbar.x = 0;
		    hudbar.y = 450;
  
  			//console.log("touching : " + this.turrets.childNodes[0].touching);

		    

          // Create the pause label
          pauseLabel = new Label('PAUSED');
          pauseLabel.x = 250;
          pauseLabel.y = 250;
          pauseLabel.color = 'red';
          pauseLabel.font = 'bold 32px sans-serif';
          pauseLabel.textAlign = 'center';
          this.pauseLabel = pauseLabel;

          // Create labels for powerups and turrets costs
          powerLabel = new Label("POWER UPS cost " + powerups.childNodes[0].cost + " ozone");
          powerLabel.x = 10;
          powerLabel.y = 75;
          powerLabel.color = 'white';
          powerLabel.font = 'bold 16px sans-serif';
          powerLabel.textAlign = 'left';
          this.powerLabel = powerLabel;

          turretLabel = new Label("TURRETS cost " + turretsArg.childNodes[0].cost + " ozone");
          turretLabel.x = 10;
          turretLabel.y = 100;
          turretLabel.color = 'white';
          turretLabel.font = 'bold 16px sans-serif';
          turretLabel.textAlign = 'left';
          this.turretLabel = turretLabel;

          // Experimental Ozone cloud sprite for future gameplay mechanics
          ozoneGroup = new Group();
          this.ozoneGroup = ozoneGroup;
          var ozoneCloud = new Ozone(300, 300);
          ozoneGroup.addChild(ozoneCloud);

          // Group for scenery sprites and effects
          scenery = new Group();
          this.scenery = scenery;

		  this.addChild(bg);
          
          this.addChild(ozoneGroup);
		    this.addChild(buildLabel);
		    this.addChild(scoreDisplay);
		    this.addChild(turret_grid);
		    this.addChild(hudbar);
		    this.addChild(this.turrets);
		    this.addChild(finishBuildButton);
		    this.addChild(powerLabel);
		    this.addChild(turretLabel);

		    this.tl.setTimeBased();
		    this.addEventListener(Event.ENTER_FRAME, this.update);
          this.addEventListener(Event.B_BUTTON_DOWN, this.bHandler);
          this.addEventListener(Event.TOUCH_START, this.touchHandler);

          finishBuildButton.addEventListener(Event.TOUCH_END, function () {
          	game.replaceScene(new Level(Game.instance.currentScene.player, maxEnemies, powerupsArg, Game.instance.currentScene.turrets));
          })
 
		},

		update: function() {
			this.scoreDisplay.text = "Ozone Recovered: " + this.player.score;
			for(var i=0; i<this.turrets.childNodes.length; i++){
          		if(this.turrets.childNodes[i].cost < this.player.score){
          			this.turrets.childNodes[i].moveable = true;
          			
          		}else{
          			if(!this.turrets.childNodes[i].active){
          				this.turrets.childNodes[i].moveable = false;
          			}
          		}

          		if((this.turrets.childNodes[i].x + this.turrets.childNodes[i].width) < this.turret_grid.x){
          			this.turrets.childNodes[i].active = true;

          		}else{
          			this.turrets.childNodes[i].active = false;
          		}

          		this.turrets.childNodes[i].visible = true;
          	}


		},

      // Currently bound to 'SHIFT' key, for pausing
      bHandler: function(evt) {
          var game = Game.instance;

          if (this.paused == true) {
             playBgMusic();
             game.resume();
             this.removeChild(this.pauseLabel);        
          }
          else {
             Game.instance.soundUfo.pause();
             game.pause();
             this.addChild(this.pauseLabel);
          }
          this.paused = !this.paused;
      },      
   });

	// Game Over Screen
   var GameOverScene = Class.create(Scene, {
      initialize: function() {
         Scene.apply(this);
         
         var gameOverImage = new Sprite(537, 174);
         gameOverImage.image = game.assets['res/images/game_over.png'];
         gameOverImage.x = 125;
         gameOverImage.y = 100;
         
         var restartButton = new Sprite(119, 39);
         restartButton.image = game.assets['res/images/restart_button.png'];
         restartButton.x = 345;
         restartButton.y = 325;
         this.addEventListener("touchstart", function() {
             playGame();
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

   var playBgMusic = function() {
      Game.instance.soundUfo.play({
                onfinish: function() {
                   loopSound(Game.instance.soundUfo);
                }
         });
   }

	// Loads the first level if Start button is clicked
		var playGame = function(evt) {
			var game = Game.instance;

            playBgMusic();
			//create a new player to be passed to level
		    var player = new Player();
		    player.x = 40;
		    player.y = 40;
		    player.health = player.maxHealth = 100;
		    player.score = 0;

		    var speedPU = new PowerUp();
		    speedPU.powerType = "speed";
		    speedPU.image = game.assets['res/images/PU_speed.png'];

		    var healthPU = new PowerUp();
		    healthPU.powerType = "health";
		    healthPU.image = game.assets['res/images/PU_health.png'];
		    healthPU.x = 550;

		    var skipPU = new PowerUp();
		    skipPU.powerType = "skip";
		    skipPU.image = game.assets['res/images/skip.png'];
		    skipPU.x = 350;
		    skipPU.y = 100;
		    skipPU.cost = 0;

		    AllPowerUps = new Group();
		    AllPowerUps.addChild(speedPU);
		    AllPowerUps.addChild(healthPU);
		    AllPowerUps.addChild(skipPU);

		    var turret = new Turret("dumb");
            turret.image = game.assets['res/images/turret_shooting.png'];
            turret.x = 725;
          	turret.y = 20;

          	var turret2 = new Turret("dumb");
            turret2.image = game.assets['res/images/turret_shooting.png'];
            turret2.x = 725;
          	turret2.y = 120;

          	var turret3 = new Turret("dumb");
            turret3.image = game.assets['res/images/turret_shooting.png'];
            turret3.x = 725;
          	turret3.y = 220;



		    AllTurrets = new Group();
		    AllTurrets.addChild(turret);
		    AllTurrets.addChild(turret2);
		    AllTurrets.addChild(turret3);

		    

			game.replaceScene(new Level(player, 3, AllPowerUps, AllTurrets));
		};

//Story Scene class
   var StoryScene = Class.create(Scene, {
      initialize: function() {
         Scene.apply(this);

         this.scene = 0;

         var storyImage = new Sprite(500, 350);
         storyImage.image = game.assets['res/images/drought.jpg'];
         storyImage.x = 150;
         storyImage.y = 50;

         var storyText1 = new Label("In the year 2077, a 3-year");
         var storyText2 = new Label ("drought threw Earth's water");
         var storyText3 = new Label("supply and ecosystems into");
         var storyText4 = new Label("disarray, and global warming");
         var storyText5 = new Label("could no longer be ignored.");
         var storyText6, storyText7;
         storyText1.color = storyText2.color = storyText3.color = storyText4.color = storyText5.color = "#0f0";
         storyText1.font = storyText2.font = storyText3.font = storyText4.font = storyText5.font =  "20px sans-serif";
         storyText1.x = 282;
         storyText1.y = 425;
         storyText2.x = 282;
         storyText2.y = 450;
         storyText3.x = 282;
         storyText3.y = 475;
         storyText4.x = 282;
         storyText4.y = 500;
         storyText5.x = 282;
         storyText5.y = 525;

         this.backgroundColor = "black";

         this.addChild(storyImage);
         this.addChild(storyText1);
         this.addChild(storyText2);
         this.addChild(storyText3);
         this.addChild(storyText4);
         this.addChild(storyText5);

         this.on("touchstart", function(evt) {
            if (++this.scene == 6) {
               playGame();
            }

            else if (this.scene == 5) {
               this.removeChild(storyText1);
               this.removeChild(storyText2);
               this.removeChild(storyText3);
               this.removeChild(storyText4);
               this.removeChild(storyText5);
               this.removeChild(storyText6);

               storyText1 = new Label("The Harvesters have been");
               storyText2 = new Label ("consuming the Ozone for the past");
               storyText3 = new Label("5 months; during this time, Chad");
               storyText4 = new Label("Price has been training with Earth's");
               storyText5 = new Label("resistance force for a chance at"); 
               storyText6 = new Label("redeption. Today is that chance,");
               storyText7 = new Label("and no Harvester will be left intact.");
               storyText1.color = storyText2.color = storyText3.color = storyText4.color = storyText5.color = storyText6.color = storyText7.color = "#0f0";
               storyText1.font = storyText2.font = storyText3.font = storyText4.font = storyText5.font = storyText6.font = storyText7.font = "19px sans-serif";

               storyText1.x = 265;
               storyText1.y = 400;
               storyText2.x = 265;
               storyText2.y = 425;
               storyText3.x = 265;
               storyText3.y = 450;
               storyText4.x = 265;
               storyText4.y = 475;
               storyText5.x = 265;
               storyText5.y = 500;
               storyText6.x = 265;
               storyText6.y = 525;
               storyText7.x = 265;
               storyText7.y = 550;

               this.addChild(storyText1);
               this.addChild(storyText2);
               this.addChild(storyText3);
               this.addChild(storyText4);
               this.addChild(storyText5);
               this.addChild(storyText6);
               this.addChild(storyText7);

               this.removeChild(storyImage);
               storyImage = new Sprite(272, 288);
               storyImage.image = game.assets['res/images/chad_price_grin.png'];
               storyImage.x = 275;
               storyImage.y = 50;
               this.addChild(storyImage);
            }

            else if (this.scene == 4) {
               this.removeChild(storyText1);
               this.removeChild(storyText2);
               this.removeChild(storyText3);
               this.removeChild(storyText4);
               this.removeChild(storyText5);
               this.removeChild(storyText6);

               storyText1 = new Label("The New Suns refitted the robots,");
               storyText2 = new Label ("which they refer to as \"harvesters\",");
               storyText3 = new Label("for an attack against the Earth.");
               storyText4 = new Label("The terrorists were able to use");
               storyText5 = new Label("NASA spies and computer"); 
               storyText6 = new Label("viruses to disable Earth's defenses.");
               storyText1.color = storyText2.color = storyText3.color = storyText4.color = storyText5.color = storyText6.color = "#0f0";
               storyText1.font = storyText2.font = storyText3.font = storyText4.font = storyText5.font = storyText6.font = "20px sans-serif";

               storyText1.x = 265;
               storyText1.y = 400;
               storyText2.x = 265;
               storyText2.y = 425;
               storyText3.x = 265;
               storyText3.y = 450;
               storyText4.x = 265;
               storyText4.y = 475;
               storyText5.x = 265;
               storyText5.y = 500;
               storyText6.x = 265;
               storyText6.y = 525;

               this.addChild(storyText1);
               this.addChild(storyText2);
               this.addChild(storyText3);
               this.addChild(storyText4);
               this.addChild(storyText5);
               this.addChild(storyText6);

               this.removeChild(storyImage);
               storyImage = new Sprite(500, 364);
               storyImage.image = game.assets['res/images/earthsatellites.png'];
               storyImage.x = 150;
               storyImage.y = 0;
               this.addChild(storyImage);
            }

            else if (this.scene == 3) {
               this.removeChild(storyText1);
               this.removeChild(storyText2);
               this.removeChild(storyText3);
               this.removeChild(storyText4);
               this.removeChild(storyText5);

               storyText1 = new Label("The New Suns, a group of");
               storyText2 = new Label ("cyber-terrorists, took control");
               storyText3 = new Label("of the robots due to their");
               storyText4 = new Label("security vulnerabilities, and");
               storyText5 = new Label("sought to cleanse Earth of the"); 
               storyText6 = new Label("lifeforms that had failed it.");
               storyText1.color = storyText2.color = storyText3.color = storyText4.color = storyText5.color = storyText6.color = "#0f0";
               storyText1.font = storyText2.font = storyText3.font = storyText4.font = storyText5.font = storyText6.font = "20px sans-serif";

               storyText1.x = 275;
               storyText1.y = 400;
               storyText2.x = 275;
               storyText2.y = 425;
               storyText3.x = 275;
               storyText3.y = 450;
               storyText4.x = 275;
               storyText4.y = 475;
               storyText5.x = 275;
               storyText5.y = 500;
               storyText6.x = 275;
               storyText6.y = 525;

               this.addChild(storyText1);
               this.addChild(storyText2);
               this.addChild(storyText3);
               this.addChild(storyText4);
               this.addChild(storyText5);
               this.addChild(storyText6);

               this.removeChild(storyImage);
               storyImage = new Sprite(595, 300);
               storyImage.image = game.assets['res/images/cyberterrorist.jpg'];
               storyImage.x = 105;
               storyImage.y = 50;
               this.addChild(storyImage);
            }

            else if (this.scene == 2) {
               this.removeChild(storyText1);
               this.removeChild(storyText2);
               this.removeChild(storyText3);
               this.removeChild(storyText4);
               this.removeChild(storyText5);

               storyText1 = new Label("The program's leader, Chad");
               storyText2 = new Label ("Price, rushed deployment of");
               storyText3 = new Label("robots tasked to repair the");
               storyText4 = new Label("Earth's Ozone layer to save");
               storyText5 = new Label("the environment.");
               storyText1.color = storyText2.color = storyText3.color = storyText4.color = storyText5.color = "#0f0";
               storyText1.font = storyText2.font = storyText3.font = storyText4.font = storyText5.font =  "20px sans-serif";

               storyText1.x = 275;
               storyText1.y = 425;
               storyText2.x = 275;
               storyText2.y = 450;
               storyText3.x = 275;
               storyText3.y = 475;
               storyText4.x = 275;
               storyText4.y = 500;
               storyText5.x = 275;
               storyText5.y = 525;

               this.addChild(storyText1);
               this.addChild(storyText2);
               this.addChild(storyText3);
               this.addChild(storyText4);
               this.addChild(storyText5);

               this.removeChild(storyImage);
               storyImage = new Sprite(272, 288);
               storyImage.image = game.assets['res/images/chad_price_grin.png'];
               storyImage.x = 275;
               storyImage.y = 50;
               this.addChild(storyImage);
            }

            else if (this.scene == 1) {
               this.removeChild(storyText1);
               this.removeChild(storyText2);
               this.removeChild(storyText3);
               this.removeChild(storyText4);
               this.removeChild(storyText5);

               storyText1 = new Label("NASA quickly began a program");
               storyText2 = new Label ("dedicated to rebuilding Earth's");
               storyText3 = new Label("Ozone Layer to protect the");
               storyText4 = new Label("environment against global");
               storyText5 = new Label("warming.");
               storyText1.color = storyText2.color = storyText3.color = storyText4.color = storyText5.color = "#0f0";
               storyText1.font = storyText2.font = storyText3.font = storyText4.font = storyText5.font =  "20px sans-serif";

               storyText1.x = 275;
               storyText1.y = 425;
               storyText2.x = 275;
               storyText2.y = 450;
               storyText3.x = 275;
               storyText3.y = 475;
               storyText4.x = 275;
               storyText4.y = 500;
               storyText5.x = 275;
               storyText5.y = 525;

               this.addChild(storyText1);
               this.addChild(storyText2);
               this.addChild(storyText3);
               this.addChild(storyText4);
               this.addChild(storyText5);

               this.removeChild(storyImage);
               storyImage = new Sprite(500, 354);
               storyImage.image = game.assets['res/images/earthsorbit.jpg'];
               storyImage.x = 150;
               storyImage.y = 50;
               this.addChild(storyImage);
            }
            
         });
      }
   });
         
   //bullet class
   var Bullet = enchant.Class.create(enchant.Sprite, {
      initialize: function(x, y, targetX, targetY) {
         enchant.Sprite.call(this, 46, 69);
         this.image = game.assets["res/images/beams_2.png"];
         Game.instance.soundBlast.play();

         this.speed = 20; // horizontal speed
         this.x = x;
         this.y = y;

         // Find the movement between the bullet and target
         var targetVec = new Victor(targetX, targetY);
         var bulletStartVec = new Victor(x, y);
         var movementVec = targetVec.subtract(bulletStartVec);
         // Normalize vector to length 1 if movement is not [0, 0]
         if (movementVec.x != 0 && movementVec.y != 0) {
            movementVec.normalize();
         }
         this.movementVec = movementVec;

         this.addEventListener(Event.ENTER_FRAME, this.update);
      },

      update: function() {
         // Remove from "bullets" group when out of bounds + buffer
         if (this.x < 0 || this.x > 820 || this.y < 0 || this.y > 620) {
            this.parentNode.removeChild(this);
         }

         // Collision logic with enemies 
         var scene = Game.instance.currentScene;
         var enemies = scene.enemies;
         for (var i = 0; i < enemies.childNodes.length; i++) {
            var enemy = enemies.childNodes[i];
            if (this.within(enemy, 32)) {
               new Explosion(enemy.x, enemy.y, 0.10);
               Game.instance.soundEnemyDie.play();
               // enemy.tl.fadeOut(5);       // TODO: Fade & scale aren't working here
               // enemy.tl.scaleTo(0.25, 5);
               enemies.tl.delay(5).then(function() {
                  enemies.removeChild(enemy);
               });
               if (this.parentNode != null) {
                  this.parentNode.removeChild(this);
               }
               scene.player.score += 10;
               scene.enemiesKilled += 1;
               break;
            }
         }

         // Collision logic with powerups
         if (scene.store == true) {

         	var powerups = scene.powerups;


         	for (i = 0; i < powerups.childNodes.length; i++) {
         		var pUp = powerups.childNodes[i];

         		if (this.within (pUp, 50)) {
         			if (pUp.unlocked) {
         				Game.instance.soundPowerUp.play();
         				scene.player.score -= pUp.cost;
         				//pUp.unpurchased = false;
         				pUp.takeEffect(pUp.powerType);
         				this.parentNode.removeChild(this);

         				//console.log ("CONTACT");
         				game.replaceScene(new Build(scene.player, scene.maxEnemies * 2, powerups, scene.turrets));

         			}
         		}
         	}
     	}

         // Move bullet according to normalized movement vector & speedw
         this.x += this.movementVec.x * this.speed;
         this.y += this.movementVec.y * this.speed;
      }
   });

   //bullet class
   var EnemyBullet = enchant.Class.create(enchant.Sprite, {
      initialize: function(x, y, targetX, targetY) {
         enchant.Sprite.call(this, 32, 25);
         this.image = game.assets["res/images/beams.png"];
         Game.instance.soundBlast.play();

         this.speed = 3;
         this.x = x;
         this.y = y;

         // Find the movement between the bullet and target
         var targetVec = new Victor(targetX, targetY);
         var bulletStartVec = new Victor(x, y);
         var movementVec = targetVec.subtract(bulletStartVec);
         // Normalize vector to length 1 if movement is not [0, 0]
         if (movementVec.x != 0 && movementVec.y != 0) {
            movementVec.normalize();
         }
         this.movementVec = movementVec;

         this.addEventListener(Event.ENTER_FRAME, this.update);
      },

      update: function() {
         // Remove from "bullets" group when out of bounds + buffer
         if (this.x < 0 || this.x > 820 || this.y < 0 || this.y > 620) {
            this.parentNode.removeChild(this);
         }

         // Check EnemyBullet collision with player
         var player = Game.instance.currentScene.player;
         if (this.within(player, 20)) {
            player.getHurt();
            this.parentNode.removeChild(this);
         }

         // Move bullet according to normalized movement vector & speedw
         this.x += this.movementVec.x * this.speed;
         this.y += this.movementVec.y * this.speed;
      }
   });

   var Ozone = enchant.Class.create(Sprite, {
      initialize: function(x, y) {
         Sprite.apply(this, [256, 256]);
         this.image = Game.instance.assets["res/images/Smoke30Frames_0.png"];
         this.x = x;
         this.y = y;

         this.animationDuration = 0;       // Animation timer
         this.addEventListener('enterframe', this.update);
      },

      update: function(evt) {
          this.animationDuration += evt.elapsed * 0.001;    // ms to sec   
          if (this.animationDuration >= 0.05) {
             if (this.frame < 30) {
                this.frame++;
             }
             else {
                this.frame = 0;     // Reset to frame 0
             }
             this.animationDuration -= 0.05;
          }
      }
   });

   var Explosion = enchant.Class.create(Sprite, {
      initialize: function(x, y, maxTime) {
         Sprite.apply(this, [64, 64]);

         this.image = Game.instance.assets["res/images/explosion_sheet16.png"];
         this.x = x;
         this.y = y;
         this.maxTime = maxTime;

         var scenery = Game.instance.currentScene.scenery;
         scenery.addChild(this);

         this.animationDuration = 0;       // Animation timer
         this.addEventListener('enterframe', this.update);
      },

      update: function(evt) {
          this.animationDuration += evt.elapsed * 0.001;    // ms to sec   
          if (this.animationDuration >= this.maxTime) {
             if (this.frame < 8) {
                this.frame++;
             }
             else {
                this.parentNode.removeChild(this);   // Remove explosion after animation
             }
             this.animationDuration -= 0.05;
          }
      }
   });

   var Asteroid = enchant.Class.create(Sprite, {
      initialize: function(x, y, maxTime) {
         Sprite.apply(this, [109, 91]);
         this.image = Game.instance.assets["res/images/asteroid_sheet30.png"];
         this.x = x;
         this.y = y;
         this.maxTime = maxTime;

         var scenery = Game.instance.currentScene.scenery;
         scenery.addChild(this);

         // Find the movement between the bullet and target
         this.speed = 2;
         var targetVec = new Victor(Math.floor(Math.random() * 800), Math.floor(Math.random() * 600));
         var startVec = new Victor(x, y);
         var movementVec = targetVec.subtract(startVec);
         // Normalize vector to length 1 if movement is not [0, 0]
         if (movementVec.x != 0 && movementVec.y != 0) {
            movementVec.normalize();
         }
         this.movementVec = movementVec;         

         this.animationDuration = 0;       // Animation timer
         this.addEventListener('enterframe', this.update);
      },

      update: function(evt) {
          this.animationDuration += evt.elapsed * 0.001;    // ms to sec   
          if (this.animationDuration >= this.maxTime) {
             if (this.frame < 30) {
                this.frame++;
             }
             else {
                this.frame = 0;
             }
             this.animationDuration -= 0.05;
          }

         // Move asteroid according to normalized movement vector & speedw
         this.x += this.movementVec.x * this.speed;
         this.y += this.movementVec.y * this.speed;          
      }
   });

   var PowerUp = enchant.Class.create(Sprite, {

      initialize: function() {

         Sprite.apply(this, [100, 100]);
         //this.image = Game.instance.assets["beams.png"];
         this.x = 150;
         this.y = 300;

         this.cost = 200;
         this.unpurchased = true;
         this.unlocked = false;
      },

      takeEffect: function(powerType) {

      	var scene = Game.instance.currentScene;

      	if (powerType == "health") {
      		scene.player.maxHealth *= 2;
      		scene.player.health = scene.player.maxHealth;
      	}

      	if (powerType == "speed") {

      		scene.player.speed *= 2;
      	}

      	if (powerType = "skip") {
      		//does nothing, scene will be replaced
      	}
      }
   });   
}
