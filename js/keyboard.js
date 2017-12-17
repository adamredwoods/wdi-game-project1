define([], function() {

   var lastKey = 0;
   var tapKey =0;
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

   function isTap(keycode) {
      let j=(tapKey === keycode);
      tapKey =0;
      return j;
   }

   function onKeyDown(event) {
      if (event.keyCode < 100) {
         lastKey = event.keyCode;
         pressed[event.keyCode] = true;
         event.preventDefault();
      }
   }

   function onKeyUp(event) {
      if (event.keyCode < 100) {
         tapKey = (lastKey===event.keyCode) ? lastKey : 0;
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
      KEY_B : KEY_B,
      isTap : isTap
   }


});
