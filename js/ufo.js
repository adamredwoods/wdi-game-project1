define( function() {

   var VELOCITY = 10.0;
   var ACCELERATION = 0.05;
   var DECELERATION = 0.01;
   var BOUNDS = {
      top: 100,
      bottom: 700-200,
      left: 200,
      right: 1200-400
   };
   var entity;
   var stage;
   var moveX =0, moveY=0, angle=0, accelX=0, accelY=0, dirX=0, dirY=0;

   var Key = {
      pressed: [0,0,0],

      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,

      isDown: function(keyCode) {
         return this.pressed[key];
      },

      onKeyDown: function(event) {
         this.pressed[event.keyCode] = true;
         event.preventDefault();
      },

      onKeyUp: function(event) {

         this.pressed[event.keyCode]=0;
         event.preventDefault();
      }
   };

   function init(st, img) {
      stage = st;

      if (!entity) {
         entity = new createjs.Sprite(img, "run");
         stage.addChild(entity);

         keyboardListeners();
      }
      entity.x = 300;
      entity.y = 200;
      entity.rotation = 10;
   }

   function getMoving() {
      return {
         accelX: accelX,
         accelY: accelY,
         dirX: dirX,
         dirY: dirY
      }
   }

   function boundsCheck() {
      entity.y = (entity.y<BOUNDS.top) ? BOUNDS.top : entity.y;
      entity.y = (entity.y>BOUNDS.bottom) ? BOUNDS.bottom : entity.y;
      entity.x = (entity.x<BOUNDS.left) ? BOUNDS.left : entity.x;
      entity.x = (entity.x>BOUNDS.right) ? BOUNDS.right : entity.x;

   }

   function update() {
      //console.log(entity.x);
      let movingX = 0, movingY = 0;

      if (Key.pressed[Key.LEFT]===true) {

         accelX -= ACCELERATION;
         dirX = -1;
         angle -= 1.0;
         movingX = 1;
      }
      if (Key.pressed[Key.RIGHT]===true) {
         // entity.x = entity.x + VELOCITY*accel;
         accelX += ACCELERATION;
         dirX = 1;
         angle += 1.0;
         movingX =1;
      }
      if (Key.pressed[Key.UP]===true) {
         // entity.y = entity.y + -VELOCITY*accel;
         dirY = -1;
         accelY -= ACCELERATION;
         movingY =1;
      }
      if (Key.pressed[Key.DOWN]===true) {
         accelY += ACCELERATION;
         dirY = 1;
         movingY =1;
      }

      angle = (angle>10) ? 10 : angle;
      angle = (angle<-10) ? -10 : angle;

      if (!movingX){
         accelX += (-dirX)*DECELERATION;
         accelX = (accelX<0.05 && accelX>-0.05) ? 0.0 : accelX;

         if (angle>0) {
            angle -=1.0;
         } else if (angle<0) {
            angle += 1.0;
         }
      }
      if (!movingY){
         accelY += (-dirY)*DECELERATION;
         accelY = (accelY<0.05 && accelY>-0.05) ? 0.0 : accelY;
      }

      //if (dirX>0.0) {
         entity.x = entity.x + accelX*VELOCITY;
         entity.y = entity.y + accelY*VELOCITY;
      //}

      accelX = (accelX>1.0) ? 1.0 : accelX;
      accelX = (accelX<-1.0) ? -1.0 : accelX;
      accelY = (accelY>1.0) ? 1.0 : accelY;
      accelY = (accelY<-1.0) ? -1.0 : accelY;

      boundsCheck();

      entity.rotation = angle;
   }

   function keyboardListeners() {
      document.addEventListener("keydown", Key.onKeyDown.bind(Key));
      document.addEventListener('keyup', Key.onKeyUp.bind(Key));
   }

   return {
      init : init,
      update : update,
      getMoving: getMoving
   }
})
