define( ["assets", "bitmap-font"], function(assets, bitmapFont) {

   var stage;

   var scoreLayer, introLayer;
   var txt_score;
   var humanIcon;

   function init(_stage){
      stage = _stage;
      let stageWidth = stage.canvas.width;
      let stageHeight = stage.canvas.height;

      //-- put text sheet here

      //-- add things to layers
      scoreLayer = new createjs.Container();
      //var vt = new createjs.Bitmap(assets.images.vt323);
      console.log(bitmapFont.bitmapFont);

      txt_score = new createjs.BitmapText("",bitmapFont.bitmapFont);
      scoreLayer.addChild(txt_score);
      stage.addChild(scoreLayer);
      txt_score.x = stageWidth*0.8;
      txt_score.y = stageWidth*0.02;


      txt_score.text="000";

      humanIcon = new createjs.Sprite(assets.images.human, "static");
      scoreLayer.addChild(humanIcon);
      humanIcon.x = txt_score.x - 20;
      humanIcon.y = txt_score.y-10;

      // var g = new createjs.Graphics();
      // g.f("#ff0000").drawRect(0,0,100,100);
      // scoreLayer.addChild(new createjs.Shape(g));
   }

   function updateScoreLayer(sc) {
      stage.setChildIndex( scoreLayer, stage.getNumChildren()-1);
      scoreLayer.visible = true;
      let s = ""+sc;
      while (s.length < 3) {
         s = "0"+s;
      }
      txt_score.text=s;
   }

   return {
      init : init,
      updateScoreLayer : updateScoreLayer
   }

});
