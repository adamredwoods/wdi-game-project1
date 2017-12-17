define(["ufo", "human", "tank", "assets", "ui", "collision", "keyboard", "landscape"],
   function(ufo, human, tank, assets, ui, collision, keyboard, landscape) {


   var UFO_MAX_DAMAGE = 20;
   var TANK_BULLET_DAMAGE = 1;
   var MOTHERSHIP_FIX_DAMAGE = 1;
   var TOTAL_START_HUMANS = 20;

   var stage;
   var s;

   var allImages = {
      ufo:0,
      human:0,
      bg:0
   };

   var pause=false,
      score=0,
      restart=0;

   //-- main game loop
   //-- per tick update everything
   function stageTick(event) {
      if (!pause) {
         landscape.update(ufo.getMoveData().mapPosition);
         ufo.update();
         human.update(ufo.getMoveData().mapPosition);
         tank.update(ufo.getMoveData().mapPosition, ufo);
         updateCollisions();
      } else {
         if (keyboard.isTap(keyboard.KEY_B)) {
            gamePlay();
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
      collision.setStageForTest(stage);
      restartGame();

   }

   function restartGame() {
      restart =0;
      score =0;
      ui.setScreen(ui.TITLE);
      gamePause();

      //-- clear stage and re-init
      while(stage.getChildAt(0)) {
         stage.removeChildAt(0);
      }

      landscape.init(stage);
      ufo.init(stage);
      human.init(stage, assets.TERRAIN_SIZE, TOTAL_START_HUMANS);
      tank.init(stage, assets.TERRAIN_SIZE);
      ui.init(stage);

      assets.sounds.music.play("music");
      assets.sounds.music.volume = 0.5;
   }

   function getWorldPosition() {
      return ufo.getMoveData().mapPosition;
   }



   function updateCollisions() {

      if (ufo.getMoveData().beamAlpha> 0.1) {
         human.checkBeamCollision(ufo.getBeam());
         if (human.checkUFOCollision(ufo.getUFO()) >0) {
            ufo.addCaptured();
         }
      }

      let sc = ufo.checkMothershipCollision(landscape.getMothership());
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

   function startScreen() {
      gamePause();
      ui.setScreen(ui.TITLE);
   }

   function gamePlay() {
      gameResume();
      assets.sounds.music.stop();

      if(restart) {
         restartGame();
      }
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
