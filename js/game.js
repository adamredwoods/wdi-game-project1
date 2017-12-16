define(["ufo", "human", "tank", "assets", "ui", "collision", "keyboard"], function(ufo, human, tank, assets, ui, collision, keyboard) {

   var STARS_OFFSET = -512;
   var MOTHERSHIP_SPEED = 3.0;
   var UFO_MAX_DAMAGE = 20;
   var TANK_BULLET_DAMAGE = 1;
   var MOTHERSHIP_FIX_DAMAGE = 1;
   var TOTAL_START_HUMANS = 20;

   var stage;
   var s;
   var landscape = [];
   var landscapeStars, landscapeStars2;
   var allImages = {
      ufo:0,
      human:0,
      bg:0
   };
   var pause=false,
      mothership,
      score=0,
      restart=0;

   //
   //-- per tick update everything
   function stageTick(event) {
      if (!pause) {
         updateLandscape();

         ufo.update();
         human.update(ufo.getMoveData().mapPosition);
         tank.update(ufo.getMoveData().mapPosition, ufo);
         updateMothership();

         updateCollisions();
      } else {
         if (keyboard.isDown(keyboard.KEY_B)) {
            gameResume();

            if(restart) {
               restartGame();
            }
         }
      }

      updateUI();
      stage.update(event); //-- make sure event is passed to update
   }

   //--
   //-- start and init everything
   //
   function start(_stage) {
      stage = _stage;

      createjs.Ticker.addEventListener("tick", stageTick);
      //createjs.Ticker.timingMode = createjs.Ticker.RAF;
      createjs.Ticker.framerate = FPS;

      keyboard.init();
      restartGame();

      updateUI();
   }

   function restartGame() {
      restart =0;
      score =0;
      ui.clearScreen();

      while(stage.getChildAt(0)) {
         stage.removeChildAt(0);
      }
console.log("RESTART");
      initLandscape();
      ufo.init(stage);
      human.init(stage, assets.TERRAIN_SIZE, TOTAL_START_HUMANS);
      tank.init(stage, assets.TERRAIN_SIZE);
      ui.init(stage);

   }

   function getWorldPosition() {
      return ufo.getMoveData().mapPosition;
   }

   function startScreen() {
      gamePause();
      ui.setScreen(ui.TITLE);
   }


   //
   //-- start setting up the landscape and terrain
   //
   function initLandscape() {


      var terrainWidth = stage.canvas.width;

      //--make stars
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

      //-- terrain images
      let hill = new createjs.Graphics();
      hill.beginFill("#403530").drawEllipse(0,405,500,360);
      hill = new createjs.Shape(hill);

      let tree = new createjs.Bitmap(assets.images.tree);
      tree.regY = 256;

      //--make all tiles, random
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

      landscape[n+1] = new createjs.Container();
      landscape[n+1].addChild(assets.groundShape());
      landscape[n+1].offset = -terrainWidth*(assets.TERRAIN_SIZE);
      stage.addChild(landscape[n+1]);

      //--make mothership
      mothership = new createjs.Sprite(assets.images.mothership, "run");
      landscape[n].addChild(mothership);
      mothership.x = terrainWidth * 0.5;
      mothership.dirX = -1;
      mothership.offset = 0;
      mothership.setBounds(70,98,120,80);

      collision.setStageForTest(stage);

   }

   function updateMothership() {
      var terrainWidth = stage.canvas.width;
      mothership.x += mothership.dirX*MOTHERSHIP_SPEED;
      if (mothership.x > terrainWidth*0.6) {
         mothership.dirX = -1;
      }
      if (mothership.x < 0) {
         mothership.dirX = 1;
      }
      //mothership.x = mothership.offset + ufo.getMoveData().mapPosition;
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
         if (human.checkUFOCollision(ufo.getUFO()) >0) {
            ufo.addCaptured();
         }
      }

      let sc = ufo.checkMothershipCollision(mothership);
      score += sc;
      if (sc) {
         ufo.addDamage(-MOTHERSHIP_FIX_DAMAGE,UFO_MAX_DAMAGE);
      }
      if (score >= TOTAL_START_HUMANS) {
         //-- Win Game
         gameWin();
      }

      if (tank.checkTankBulletUFOCollision(ufo.getUFO())){
         ufo.addDamage(TANK_BULLET_DAMAGE, UFO_MAX_DAMAGE);
      }

      ufo.addDamage(0,UFO_MAX_DAMAGE); //update bounce damage
      if (ufo.getDamage()>=UFO_MAX_DAMAGE) {
         //-- GAME over
         gameOver();
      }
   }

   function updateUI() {
      ui.updateScoreLayer(score, human.getTotalHumans()-score, 1.0-(ufo.getDamage()/UFO_MAX_DAMAGE));
      ui.updateScreen();
   }

   function gameOver() {
      gamePause();
      restart = 1;
      ufo.hideUFO();
      ui.setScreen(ui.LOSE);
   }

   function gameWin() {
      gamePause();
      restart = 1;
      ui.setScreen(ui.WIN);
   }

   function gamePause() {
      pause = true;
   }

   function gameResume() {
      pause = false;
      ui.setScreen(0);
   }

   return {
      start: start,
      getWorldPosition: getWorldPosition,
      startScreen : startScreen
   }
});
