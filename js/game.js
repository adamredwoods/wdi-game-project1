define(["ufo","human"], function(ufo,human) {

   var stage;
   var s;
   var landscape, landscapeStars, landscapeStars2;
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
      if(!landscape) {

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

         var g = new createjs.Graphics();
         g.beginFill("#403530");
         g.rect(0,stage.canvas.height*0.7,stage.canvas.width,stage.canvas.height);
         g.beginFill(createjs.Graphics.getRGB(255,0,0));
         landscape = stage.addChild(new createjs.Shape(g));

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
   }

   function updateAll() {

   }

   return {
      start: start,
      allImages: allImages
   }
});
