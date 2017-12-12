define(["ufo","human"], function(ufo,human) {

   var MAXLAND = 10;

   var stage;
   var s;
   var landscape = [];
   var landscapeStars, landscapeStars2;
   var allImages = {
      ufo:0,
      human:0,
      bg:0
   };


   function stageTick(event) {
      updateLandscape();
      ufo.update();

      stage.update(event); //-- make sure event is passed to update
   }

   function start(st) {
      stage = st;

      createjs.Ticker.addEventListener("tick", stageTick);
      createjs.Ticker.timingMode = createjs.Ticker.RAF;

      initLandscape();
      ufo.init(stage, allImages.ufo);

   }

   function initLandscape() {
      if(!landscape[0]) {

         landscapeStars = new createjs.Container();
         landscapeStars.addChild(new createjs.Bitmap(allImages.bg));
         var stars2 = landscapeStars.addChild(new createjs.Bitmap(allImages.bg));
         stars2.x = 512;
         stars2 = landscapeStars.addChild(new createjs.Bitmap(allImages.bg));
         stars2.x = 1024;
         stage.addChild(landscapeStars);

         landscapeStars2 = new createjs.Container();
         landscapeStars2.addChild(new createjs.Bitmap(allImages.bg));
         var stars2 = landscapeStars2.addChild(new createjs.Bitmap(allImages.bg));
         stars2.x = 512;
         stage.addChild(landscapeStars2);
         landscapeStars2.x = -1024;

         var hill = new createjs.Graphics();
         hill.beginFill("#403530").drawEllipse(0,405,500,360);
         hill = new createjs.Shape(hill);

         let tree = new createjs.Bitmap(allImages.tree);
         tree.regY = 256;

         let canvasWidth = stage.canvas.width;

         for (var i=0; i< MAXLAND; i++) {
            landscape[i] = new createjs.Container();
            var g = new createjs.Graphics();
            g.beginFill("#403530");
            g.rect(0, stage.canvas.height*0.7, canvasWidth+1.0, stage.canvas.height);
            // g.beginFill(createjs.Graphics.getRGB(255,0,0));
            landscape[i].addChild(new createjs.Shape(g));

            let n = (Math.random()*2|0)+5;
            let xflip=1.0;
            for (var j=0; j< n; j++){
               tree = tree.clone();
               landscape[i].addChild(tree);
               tree.x = Math.random()*canvasWidth|0;
               tree.y = 490;
               tree.scaleX = tree.scaleY = 0.25+Math.random()*0.5;
               tree.scaleX *= xflip;
               xflip = -xflip;
            }

            // hill = hill.clone();
            // hill.x = Math.random()*200;
            // landscape[i].addChild(hill);

            landscape[i].x = landscape[i].offset = -canvasWidth*i;

            stage.addChild(landscape[i]);
         }

      }
   }

   function updateLandscape() {
      landscapeStars.x -= ufo.getMoving().accelX;
      landscapeStars2.x -= ufo.getMoving().accelX;
      if (landscapeStars2>0) {
         landscapeStars.x = 0;
         landscapeStars2.x = -1024;
      }
      if (landscapeStars2<-1024) {
         landscapeStars.x = 1024;
         landscapeStars2.x = 0;
      }
// console.log(ufo.getMoving().mapPosition);
      for (var i=0; i< MAXLAND; i++) {
         landscape[i].x = ufo.getMoving().mapPosition + landscape[i].offset;

      }
   }

   function updateAll() {

   }

   return {
      start: start,
      allImages: allImages
   }
});
