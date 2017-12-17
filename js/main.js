var FPS = 24;

require(["game", "assets"], function(game,assets) {

   var stage, canvas, queue;

   function initCanvas() {
      canvas = document.getElementById("canvas");
      canvas.style.backgroundColor = "#000";
      stage = new createjs.Stage("canvas");
   }

   function loadImages() {
      queue = new createjs.LoadQueue();
      queue.installPlugin(createjs.Sound);
      queue.on("complete", loadComplete, this);
      // queue.loadFile({id:"sound", src:"http://path/to/sound.mp3"});
      queue.loadManifest(assets.files);
   }

   function loadComplete() {
      assets.init(queue, stage);
      game.startGameLoop(stage);
      game.gameTitleScreen();

      document.getElementById("loading-txt").style.display = "none";
   }

   initCanvas();
   loadImages();

});
