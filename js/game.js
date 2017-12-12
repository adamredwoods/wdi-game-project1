define(["ufo","human", "assets", "ui"], function(ufo, human, assets, ui) {

   var STARS_OFFSET = -512;

   var stage;
   var s;
   var landscape = [];
   var landscapeStars, landscapeStars2;
   var allImages = {
      ufo:0,
      human:0,
      bg:0
   };

   var score=0;


   function stageTick(event) {
      updateLandscape();
      ufo.update();
      human.update(ufo.getMoveData().mapPosition);
      updateCollisions();

      stage.update(event); //-- make sure event is passed to update
   }

   //--
   //-- start and init everything
   //
   function start(st) {
      stage = st;

      createjs.Ticker.addEventListener("tick", stageTick);
      //createjs.Ticker.timingMode = createjs.Ticker.RAF;
      createjs.Ticker.framerate = FPS;

      ui.init(stage);
      initLandscape();
      ufo.init(stage);
      human.init(stage, assets.TERRAIN_SIZE);

      updateUI();

   }

   function getWorldPosition() {
      return ufo.getMoveData().mapPosition;
   }



   //
   //-- start setting up the landscape and terrain
   //
   function initLandscape() {
      if(!landscape[0]) {

         var terrainWidth = stage.canvas.width;

         landscapeStars = new createjs.Container();
         landscapeStars.addChild(new createjs.Bitmap(assets.images.bg));

         let stars2 = landscapeStars.addChild(new createjs.Bitmap(assets.images.bg));
         stars2.x = 512;
         stars2 = landscapeStars.addChild(new createjs.Bitmap(assets.images.bg));
         stars2.x = 1024;
         stage.addChild(landscapeStars);

         landscapeStars2 = new createjs.Container();
         landscapeStars2.addChild(new createjs.Bitmap(assets.images.bg));

         stars2 = landscapeStars2.addChild(new createjs.Bitmap(assets.images.bg));
         stars2.x = 512;
         stage.addChild(landscapeStars2);
         landscapeStars2.x = -1024;

         let hill = new createjs.Graphics();
         hill.beginFill("#403530").drawEllipse(0,405,500,360);
         hill = new createjs.Shape(hill);

         let tree = new createjs.Bitmap(assets.images.tree);
         tree.regY = 256;

         for (var i=0; i< assets.TERRAIN_SIZE; i++) {
            landscape[i] = new createjs.Container();

            // g.beginFill(createjs.Graphics.getRGB(255,0,0));
            landscape[i].addChild(assets.groundShape());

            let n = (Math.random()*2|0)+5;
            let xflip=1.0;
            for (var j=0; j< n; j++){
               tree = tree.clone();
               landscape[i].addChild(tree);
               tree.x = Math.random()*terrainWidth|0;
               tree.y = 490;
               tree.scaleX = tree.scaleY = 0.25+Math.random()*0.5;
               tree.scaleX *= xflip;
               xflip = -xflip;
            }

            // hill = hill.clone();
            // hill.x = Math.random()*200;
            // landscape[i].addChild(hill);

            landscape[i].offset = -terrainWidth*i;

            stage.addChild(landscape[i]);
         }

         //-- make border terrain tiles
         let n = assets.TERRAIN_SIZE;
         landscape[n] = new createjs.Container();
         landscape[n].addChild(assets.groundShape());
         landscape[n].offset = terrainWidth;
         stage.addChild(landscape[n]);

      }
   }

   function updateLandscape() {
      landscapeStars.x = ufo.getMoveData().mapPosition*0.1+STARS_OFFSET;
      landscapeStars2.x = ufo.getMoveData().mapPosition*0.1+STARS_OFFSET;
      if (landscapeStars2>0) {
         landscapeStars.x = 0;
         landscapeStars2.x = -1024;
      }
      if (landscapeStars2<-1024) {
         landscapeStars.x = 1024;
         landscapeStars2.x = 0;
      }

      for (var i=0; i< landscape.length; i++) {
         landscape[i].x = ufo.getMoveData().mapPosition + landscape[i].offset;
      }
   }

   function updateCollisions() {
      if (ufo.getMoveData().beamAlpha> 0.1) {
         human.checkBeamCollision(ufo.getBeam());
      }
   }

   function updateUI() {
      ui.updateScoreLayer(score);
   }


   return {
      start: start,
      getWorldPosition: getWorldPosition
   }
});
