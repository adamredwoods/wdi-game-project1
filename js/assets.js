define([], function() {

   var TERRAIN_SIZE = 10;

   var images = {};
   var sounds = {};

   var bitmapFont;

   var files = [
       {id: "ufo", src:"./img/alien.png"},
       {id: "human", src:"./img/human.png"},
       {id: "bg", src:"./img/star-bg.png"},
       {id: "shadow", src:"./img/shadow.png"},
       {id: "tree", src:"./img/tree.png"},
       {id: "vt323", src:"./img/vt323_32pt.png"},
       {id: "beam", src:"./img/beam.png"},
       {id: "mothership", src:"./img/mothership.png"},
       {id: "tank", src:"./img/tank.png"},
       {id: "tankgun", src:"./img/tank_gun.png"},
       {id: "tankbullet", src:"./img/tank_bullet.png"},
       {id: "titlescreen", src: "./img/title-screen.png"},
       {id: "panelscreen", src: "./img/panel-screen.png"},
       {id: "explode", src:"./img/explode.png"},
       {id: "music", src:"./audio/rolemusi_-_05_-_05_rolemusic_-_the_black_frame.mp3"},
       {id: "explosion-sound", src:"./audio/explosion.mp3"},
       {id: "beam-sound", src:"./audio/beam.mp3"},
       {id: "points-sound", src:"./audio/points.mp3"},
       {id: "tankbullet-sound", src:"./audio/tankbullet.mp3"}
   ]

   var sounds = {};

   var stage;

   function init(queue, _stage) {

      stage = _stage;

      images.bg = queue.getResult("bg");
      images.tree = queue.getResult("tree");
      images.shadow = queue.getResult("shadow");
      images.tank = queue.getResult("tank");
      images.tankGun = queue.getResult("tankgun");
      images.tankBullet = queue.getResult("tankbullet");
      images.titlescreen = queue.getResult("titlescreen");
      images.panelscreen = queue.getResult("panelscreen");

      sounds.music = createjs.Sound.createInstance("music");
      sounds.explosion = createjs.Sound.createInstance("explosion-sound");
      sounds.beam = createjs.Sound.createInstance("beam-sound");
      sounds.points = createjs.Sound.createInstance("points-sound");
      sounds.tankBullet = createjs.Sound.createInstance("tankbullet-sound");

      var data = {
         images: ["./img/alien.png"],
         frames: {width:256, height:194, regX: 128, regY: 97},
         framerate: 12,
         animations: {
             run: [0,2]
         }
      };
      images.ufo =  new createjs.SpriteSheet(data);

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

      var data = {
         images: ["./img/explode.png"],
         frames: {width:64, height:64, regX: 32, regY: 32, next:false},
         framerate: 12,
         animations: {
            run: [0,6]
         }
      };
      images.explode =  new createjs.SpriteSheet(data);

   }


   function groundShape() {
      var g = new createjs.Graphics();
      g.beginFill("#302520");
      g.rect(0, stage.canvas.height*0.7, stage.canvas.width+1.0, stage.canvas.height);
      return new createjs.Shape(g);
   }

   function boxShape() {

   }

   return {
      images: images,
      files: files,
      sounds : sounds,
      init: init,
      groundShape: groundShape,
      TERRAIN_SIZE: TERRAIN_SIZE
   };

});
