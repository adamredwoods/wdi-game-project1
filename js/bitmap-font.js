define([] , function() {

   var bitmapFont;

   var data = {
      images: ["./img/vt323_32pt.png"],
      frames: {width:17, height:55, regX: 0, regY: 0,  spacing: 1.05},
      animations: {
      }
   };

   for (var i=32; i<123; i++) {
      var str = String.fromCharCode(i);
      data.animations[str] = i-32;
   }

   bitmapFont =  new createjs.SpriteSheet(data);

   return {
      bitmapFont : bitmapFont
   }
});
