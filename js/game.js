define(["ufo","human"], function(ufo,human) {

   var stage;
   var s;
   var landscape;
   var allImages = {
      ufo:0,
      human:0
   };


   function stageTick() {
      updateLandscape();
      ufo.update();

      stage.update();
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
         var g = new createjs.Graphics();
         g.beginFill("#303030");
         g.rect(0,stage.canvas.height*0.7,stage.canvas.width,stage.canvas.height);
         g.beginFill(createjs.Graphics.getRGB(255,0,0));
         landscape = stage.addChild(new createjs.Shape(g));
      }
   }

   function updateLandscape() {

   }

   function updateAll() {

   }

   return {
      start: start,
      allImages: allImages
   }
});
