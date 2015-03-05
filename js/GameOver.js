enchant();

window.onload = function() {
   var game = new Game(800, 600);
   game.preload("./res/images/game_over.png", "./res/images/restart_button.png");
   game.onload = function() {
      var gameOver = new GameOverScene();
      game.pushScene(gameOver);
   };

   game.start();

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
};
