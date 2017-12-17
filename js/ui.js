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
      lastScreen =0,
      nextScr =0;

   //-- each screen in numerated in order to the order in screenAsset
   //-- 0 screen allows play to continue
   var CONTINUE=0,
      TITLE=1,
      LOSE=2,
      WIN=3;

   var screenAsset = {
      titlescreen : 0,
      losescreen : 0,
      winscreen : 0
   }

   function init(_stage){
      stage = _stage;
      let stageWidth = stage.canvas.width;
      let stageHeight = stage.canvas.height;

      //-- reset
      currenScreen =0;
      lastScreen = -1;

      //-- add things to layers
      scoreLayer = new createjs.Container();

      txt.score = new createjs.BitmapText("",bitmapFont.bitmapFont);
      scoreLayer.addChild(txt.score);
      stage.addChild(scoreLayer);
      txt.score.x = stageWidth*0.90;
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
      damageBar.x = stageWidth*0.88;
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

   function setScreen(n) {
      lastScreen = currentScreen;
      currentScreen = n;
   }

   function clearScreen() {
      currentScreen = 0;
   }

   function updateScreen() {

      if (currentScreen===0) {
         screen.alpha=0.0;
         return 0;
      }

      //--each screen in the number in
      let i=1;
      for (var ss in screenAsset) {
         if (i===currentScreen && ss) {
            stage.removeChild(screen);
            screen = screenAsset[ss];
            stage.addChild(screen);
         }
         i++;
      }

      if (lastScreen !== currentScreen) {
         console.log("slide");
         lastScreen = currentScreen;
      }

      screen.x = stage.canvas.width*0.5-screen.getBounds().width*0.5;
      screen.y = stage.canvas.height*0.5-screen.getBounds().height*0.5;
   }

   function initScreen() {
      screen = new createjs.Container();
      stage.addChild(screen);

      var g, txt;

      //--make the different screens
      screenAsset.titlescreen = new createjs.Container();
      g = new createjs.Bitmap(assets.images.titlescreen);
      screenAsset.titlescreen.addChild(g);
      //screenAsset.titlescreen = new createjs.Bitmap(assets.images.tank);
      screenAsset.titlescreen.name = "titlescreen";

      txt = new createjs.BitmapText("To play: use 'SPACE' to grab humans. Arrow keys to fly.",bitmapFont.bitmapFont);
      txt.x = 180;
      txt.y = 380;
      txt.scaleX = txt.scaleY = 0.7;
      screenAsset.titlescreen.addChild(txt);
      txt = new createjs.BitmapText("Bring to mothership. Don't crash.",bitmapFont.bitmapFont);
      txt.x = 290;
      txt.y = 420;
      txt.scaleX = txt.scaleY = 0.7;
      screenAsset.titlescreen.addChild(txt);
      txt = new createjs.BitmapText("Press 'B' to start",bitmapFont.bitmapFont);
      txt.x = 350;
      txt.y = 510;
      screenAsset.titlescreen.addChild(txt);
      txt = new createjs.BitmapText("Based on real events. Hollywood movie pending.",bitmapFont.bitmapFont);
      txt.x = 310;
      txt.y = 565;
      txt.scaleX = txt.scaleY = 0.5;
      screenAsset.titlescreen.addChild(txt);
      txt = new createjs.BitmapText("Music by: rolemusic.sawsquarenoise.com   Graphics by: Adam Redwoods",bitmapFont.bitmapFont);
      txt.x = 210;
      txt.y = 580;
      txt.scaleX = txt.scaleY = 0.5;
      screenAsset.titlescreen.addChild(txt);

      //http://rolemusic.sawsquarenoise.com/

      screenAsset.losescreen = new createjs.Container();
      g = new createjs.Bitmap(assets.images.panelscreen);
      screenAsset.losescreen.addChild(g);
      txt = new createjs.BitmapText("You lose. try again.",bitmapFont.bitmapFont);
      txt.x = 270;
      txt.y = 190;
      screenAsset.losescreen.addChild(txt);
      txt = new createjs.BitmapText("Press 'B' to restart",bitmapFont.bitmapFont);
      txt.x = 280;
      txt.y = 290;
      screenAsset.losescreen.addChild(txt);


      screenAsset.winscreen = new createjs.Container();
      g = new createjs.Bitmap(assets.images.panelscreen);
      screenAsset.winscreen.addChild(g);
      txt = new createjs.BitmapText("I don't know how, but you did it!",bitmapFont.bitmapFont);
      txt.x = 190;
      txt.y = 200;
      screenAsset.winscreen.addChild(txt);
      txt = new createjs.BitmapText("We have enough food to get home...",bitmapFont.bitmapFont);
      txt.x = 190;
      txt.y = 250;
      screenAsset.winscreen.addChild(txt);
      txt = new createjs.BitmapText("Press 'B' to restart",bitmapFont.bitmapFont);
      txt.x = 270;
      txt.y = 350;
      screenAsset.winscreen.addChild(txt);

   }

   return {
      init : init,
      updateScoreLayer : updateScoreLayer,
      updateScreen : updateScreen,
      setScreen : setScreen,
      clearScreen : clearScreen,
      TITLE : TITLE,
      LOSE : LOSE,
      WIN : WIN,
      CONTINUE : CONTINUE
   }

});
