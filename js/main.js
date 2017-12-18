var FPS = 24;

require(["game", "assets"], function(game,assets) {

   var stage, canvas, queue, error, errorMessage;

   function initCanvas() {
      canvas = document.getElementById("canvas");
      canvas.style.backgroundColor = "#000";
      stage = new createjs.Stage("canvas");
      error = false;
   }

   function loadImages() {
      queue = new createjs.LoadQueue();
      queue.installPlugin(createjs.Sound);
      queue.on("complete", loadComplete, this);
      queue.on("error", handleError, this);
      // queue.loadFile({id:"sound", src:"http://path/to/sound.mp3"});
      queue.loadManifest(assets.files);
   }

   function loadComplete() {
      assets.init(queue, stage);
      if (!error) {
         document.getElementById("loading-txt").style.display = "none";
         game.startGameLoop(stage);
      } else {
         document.getElementById("loading-txt").textContent = "Error:"+errorMessage;
      }


   }

   function handleError(e) {
      console.log(e.data);
      errorMessage = e.message;
      error = true;
   }

   initCanvas();
   loadImages();

});
