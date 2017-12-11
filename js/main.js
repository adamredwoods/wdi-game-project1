

require(["game","ufo","human"], function(game,ufo,human) {

   var stage, canvas;

   function stageTick() {
      stage.update();
   }

   function init() {
      canvas = document.getElementById("canvas");
      canvas.style.backgroundColor = "#000";
      stage = new createjs.Stage("canvas");
      createjs.Ticker.addEventListener("tick", stageTick);
   }




   init();
   game.GAME.run(stage);

});
