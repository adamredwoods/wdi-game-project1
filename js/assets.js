define([], function() {

   var TERRAIN_SIZE = 10;

   var images = {};

   var bitmapFont;

   var files = [
       {id: "ufo", src:"./img/alien.png"},
       {id: "human", src:"./img/human.png"},
       {id: "bg", src:"./img/star-bg.png"},
       {id: "shadow", src:"./img/shadow.png"},
       {id: "tree", src:"./img/tree.png"},
       {id: "vt323", src:"./img/vt323_32pt.png"},
       {id: "beam", src:"./img/beam.png"},
       {id: "mothership", src:".img/mothership.png"}
   ]

   var stage;

   function init(queue, _stage) {

      stage = _stage;

      //  createjs.Sound.play("sound");
      //images.human = queue.getResult("human");
      images.bg = queue.getResult("bg");
      images.tree = queue.getResult("tree");
      images.shadow = queue.getResult("shadow");



      var data = {
         images: ["./img/alien.png"],
         frames: {width:256, height:194, regX: 128, regY: 97},
         framerate: 12,
         animations: {
             run: [0,2]
         }
      };
      images.ufo =  new createjs.SpriteSheet(data);
      // new createjs.Sprite(spriteSheet, "run");

      data = {
         images: ["./img/beam.png"],
         frames: {width:128, height:128, regX: 60, regY: 0},
         framerate: 12,
         animations: {
             run: [0,2]
         }
      };
      images.beam =  new createjs.SpriteSheet(data);

      data = {
         images: ["./img/human.png"],
         frames: {width:64, height:64, regX: 32, regY: 0},
         framerate: 8,
         animations: {
             run: [0,1],
             static: [0]
         }
      };
      images.human =  new createjs.SpriteSheet(data);

      var data = {
         images: ["./img/mothership.png"],
         frames: {width:512, height:256, regX: 128, regY: 0},
         framerate: 3,
         animations: {
            run: [0,1]
         }
      };
      images.mothership =  new createjs.SpriteSheet(data);

   }


   function groundShape() {
      var g = new createjs.Graphics();
      g.beginFill("#403530");
      g.rect(0, stage.canvas.height*0.7, stage.canvas.width+1.0, stage.canvas.height);
      return new createjs.Shape(g);
   }

   function boxShape() {

   }

   return {
      images: images,
      files: files,
      init: init,
      groundShape: groundShape,
      TERRAIN_SIZE: TERRAIN_SIZE
   };

});
