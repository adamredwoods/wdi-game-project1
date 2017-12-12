
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
          {id: "human", src:"./img/human.png"},
          {id: "bg", src:"./img/star-bg.png"},
          {id: "tree", src:"./img/tree.png"}
      ]);


   }

   function loadComplete() {
      //  createjs.Sound.play("sound");
      game.allImages.human = queue.getResult("human");
      game.allImages.bg = queue.getResult("bg");
      game.allImages.tree = queue.getResult("tree");


      var data = {
         images: ["./img/alien.png"],
         frames: {width:256, height:194, regX: 128, regY: 97},
         framerate: 12,
         animations: {
             run: [0,2]
         }
      };
      game.allImages.ufo =  new createjs.SpriteSheet(data);
      // new createjs.Sprite(spriteSheet, "run");

      game.start(stage);

   }



   initCanvas();
   loadImages();


});
