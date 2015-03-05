//this file will not compile, stand-alone
//it is intended to be combined with other code in order to work

//random constants
var MAX_HEALTH = 100;
var MAX_X = 500;
var MAX_Y = 500;

//player class
var Player = enchant.Class.create(enchant.Sprite, {
   initialize: function() {
      enchant.Sprite.call(this, 343, 383); //current size of the player, can be changed, will almost certainly need to be
      this.image = game.assets["redfighter0005.png"]; //current sprite for the player
      this.health = MAX_HEALTH; //initialize the health to MAX_HEALTH
      game.rootScene.addChild(this); //add the player to the rootscene when the constructor is called, can be changed to a different scene if necessary
   }
});

//enemy class
var Enemy = enchant.Class.create(enchant.Sprite, {
   initialize: function() {
      enchant.Sprite.call(this, 98, 84); //current size of the enemy, can be changed
      this.image = game.assets["Spaceship-Drakir6.png"]; //current sprite for the enemy
      this.moveTo(Math.floor(Math.random() * 500),
       Math.floor(Math.random() * 500)); //spawn the enemy at a random location
      game.rootScene.addChild(this); //add the player to the rootscene when the constructor is called
   }
});

var Bullet = enchant.Class.create(enchant.Sprite, {
   initialize: function() {
      enchant.Sprite.call(this, 46, 96);
      this.image = game.assets["beams_2.png"];
   }
}
