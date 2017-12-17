define(["assets"], function(assets) {

   function create(x,y, stage) {
      let ee = new createjs.Sprite(assets.images.explode, "run");
      stage.addChild(ee);
      ee.x = x;
      ee.y = y;
      ee.addEventListener("animationend",function() {
         stage.removeChild(ee);
      });

      assets.sounds.explosion.play();
   }

   return {
      create : create
   }

});
