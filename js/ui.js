define( ["assets", "bitmap-font"], function(assets, bitmapFont) {

   var stage;

   var scoreLayer, introLayer;
   var txt = {
      score: 0,
      humansRemaining: 0
   };
   var humanIcon;
   var damageBar;

   function init(_stage){
      stage = _stage;
      let stageWidth = stage.canvas.width;
      let stageHeight = stage.canvas.height;

      //-- put text sheet here

      //-- add things to layers
      scoreLayer = new createjs.Container();
      //var vt = new createjs.Bitmap(assets.images.vt323);
      console.log(bitmapFont.bitmapFont);

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

   return {
      init : init,
      updateScoreLayer : updateScoreLayer
   }

});
