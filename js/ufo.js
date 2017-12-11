define( function() {

   var entity;
   var stage;

   function init(st, img) {
      stage = st;

      if (!entity) {
         entity = new createjs.Bitmap(img);
         stage.addChild(entity);

         keyboardListeners();
      }
   }

   function update() {
      entity.x = 300;
      entity.y = 200;

   }

   function keyboardListeners() {
      document.addEventListener('keydown', function(e){
          if (e.keycode===38) {
             //right
          }
      });
   }

   return {
      init : init,
      update : update
   }
})
