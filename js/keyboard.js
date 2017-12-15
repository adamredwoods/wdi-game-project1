define([], function() {


   var pressed = [],
      LEFT= 37,
      UP= 38,
      RIGHT= 39,
      DOWN= 40,
      SPACE= 32
      KEY_B = 66;

   function isDown(keycode) {
      return pressed[keycode];
   };

   function onKeyDown(event) {
      if (event.keyCode < 100) {
         pressed[event.keyCode] = true;
         event.preventDefault();
      }
   }

   function onKeyUp(event) {
      if (event.keyCode < 100) {
         pressed[event.keyCode]=0;
         event.preventDefault();
      }
   }

   function init() {
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener('keyup', onKeyUp);
   }

   return {
      isDown : isDown,
      init : init,
      LEFT : LEFT,
      RIGHT : RIGHT,
      UP : UP,
      DOWN : DOWN,
      SPACE : SPACE,
      KEY_B : KEY_B
   }


});
