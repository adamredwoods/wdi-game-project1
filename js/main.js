

require(["game"], function(game,ufo,human) {

   var stage, canvas, queue;


   function initCanvas() {
      canvas = document.getElementById("canvas");
      canvas.style.backgroundColor = "#000";
      stage = new createjs.Stage("canvas");

   }

   function loadImages() {
      queue = new createjs.LoadQueue();
      // queue.installPlugin(createjs.Sound);
      queue.on("complete", loadComplete, this);
      // queue.loadFile({id:"sound", src:"http://path/to/sound.mp3"});
      queue.loadManifest([
          {id: "ufo", src:"./img/alien.png"},
          {id: "human", src:"./img/human.png"}
      ]);
   }

   function loadComplete() {
      //  createjs.Sound.play("sound");
       game.allImages.human = queue.getResult("human");
       game.allImages.ufo = queue.getResult("ufo");

       game.start(stage);
   }



   initCanvas();
   loadImages();


});
