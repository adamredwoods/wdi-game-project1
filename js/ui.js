define( ["assets", "bitmap-font"], function(assets, bitmapFont) {

   var stage;

   var scoreLayer, introLayer;
   var txt = {
      score: 0,
      humansRemaining: 0
   };
   var humanIcon;
   var damageBar;

   var screen,
      currentScreen =0,
      nextScr =0;

   var TITLE=1,
      LOSE=2,
      WIN=3;

   var screenAsset = {
      titlescreen : 0,
      losescreen : 0
   }

   function init(_stage){
      stage = _stage;
      let stageWidth = stage.canvas.width;
      let stageHeight = stage.canvas.height;

      //-- reset
      currenScreen =0;


      //-- add things to layers
      scoreLayer = new createjs.Container();

      txt.score = new createjs.BitmapText("",bitmapFont.bitmapFont);
      scoreLayer.addChild(txt.score);
      stage.addChild(scoreLayer);
      txt.score.x = stageWidth*0.82;
      txt.score.y = stageHeight*0.01;

      txt.humansRemaining = new createjs.BitmapText("",bitmapFont.bitmapFont);
      scoreLayer.addChild(txt.humansRemaining);
      stage.addChild(scoreLayer);
      txt.humansRemaining.x = stageWidth*0.1;
      txt.humansRemaining.y = stageHeight*0.02;


      txt.score.text="000";

      humanIcon = new createjs.Sprite(assets.images.human, "static");
      scoreLayer.addChild(humanIcon);
      humanIcon.x = txt.humansRemaining.x - 20;
      humanIcon.y = txt.humansRemaining.y -10;

      var g =new createjs.Graphics();
      g.f("#800000").drawRect(0,0,100,20);
      damageBar = new createjs.Shape(g);
      damageBar.x = stageWidth*0.8;
      damageBar.y = stageHeight*0.08;
      scoreLayer.addChild(damageBar);

      initScreen();
      // var g = new createjs.Graphics();
      // g.f("#ff0000").drawRect(0,0,100,100);
      // scoreLayer.addChild(new createjs.Shape(g));
   }

   function addZeros(sc, num) {
      let s = ""+sc;
      while (s.length < num) {
         s = "0"+s;
      }
      return s;
   }

   function updateScoreLayer(score,humansLeft, damagePercent) {
      //-- keep these layers over all other things on the stage
      stage.setChildIndex( scoreLayer, stage.getNumChildren()-1);
      scoreLayer.visible = true;

      txt.score.text=addZeros(score,3);
      txt.humansRemaining.text = addZeros(humansLeft,3);

      damageBar.scaleX = damagePercent;
   }

   function showWin() {

   }

   function showLose() {

   }

   function setScreen(n) {
      currentScreen = n;
   }

   function setNextScreen(n) {
      nextScr = n;
   }

   function clearScreen() {
      currentScreen = 0;
   }

   function updateScreen() {

      if (currentScreen===0) {
         screen.alpha=0.0;
         return 0;
      }

      let i=1;
      for (var ss in screenAsset) {
         if (i===currentScreen && ss) {
            stage.removeChild(screen);
            screen = screenAsset[ss];
            stage.addChild(screen);
         }
         i++;
      }

      screen.x = stage.canvas.width*0.5-screen.width*0.5;
      screen.y = stage.canvas.height*0.5-screen.height*0.5;
   }

   function initScreen() {
      screen = new createjs.Container();
      stage.addChild(screen);

      var g, txt;

      screenAsset.titlescreen = new createjs.Container();
      g = new createjs.Bitmap(assets.images.titlescreen);
      screenAsset.titlescreen.addChild(g);
      //screenAsset.titlescreen = new createjs.Bitmap(assets.images.tank);
      screenAsset.titlescreen.name = "titlescreen";
      txt = new createjs.BitmapText("Based on real events. Hollywood movie pending.",bitmapFont.bitmapFont);
      txt.x = 110;
      txt.y = 400;
      screenAsset.titlescreen.addChild(txt);
      txt = new createjs.BitmapText("Press 'B' to start",bitmapFont.bitmapFont);
      txt.x = 350;
      txt.y = 450;
      screenAsset.titlescreen.addChild(txt);

      screenAsset.losescreen = new createjs.Container();
      g = new createjs.Bitmap(assets.images.panelscreen);
      screenAsset.losescreen.addChild(g);
      txt = new createjs.BitmapText("You lose. try again.",bitmapFont.bitmapFont);
      txt.x = 200;
      txt.y = 200;
      screenAsset.losescreen.addChild(txt);
      txt = new createjs.BitmapText("Press 'B' to start",bitmapFont.bitmapFont);
      txt.x = 200;
      txt.y = 300;
      screenAsset.losescreen.addChild(txt);


   }

   return {
      init : init,
      updateScoreLayer : updateScoreLayer,
      updateScreen : updateScreen,
      setScreen : setScreen,
      setNextScreen : setNextScreen,
      clearScreen : clearScreen,
      TITLE : TITLE,
      LOSE : LOSE,
      WIN : WIN
   }

});
