define( ["assets", "collision", "explosion", "keyboard"], function(assets, collision, explosion, keyboard) {

   //var FPS = 24;
   var VELOCITY = 10.0*(60/FPS);
   var ACCELERATION = 0.05*(60/FPS);
   var DECELERATION = 0.01*(60/FPS);
   var ANGLEMOVE = 0.5*(60/FPS);
   var MAPSPEED = 10.0*(60/FPS);
   var GRAVITY = 0.5*(60/FPS);
   var BEAMALPHASPEED = 0.05*(60/FPS);
   var SHADOWOFFSET = 80;

   var BOUNDS = {
      top: 100,
      bottom: 700-200,
      left: 200,
      right: 1200-400
   };

   var entity;
   var entityShadow;
   var beam, beamAlpha=0.0, beamMask;
   var stage;
   var humanSprite, capturedList, mothershipTick=0;
   var moveX =0, moveY=0, angle=0, accelX=0, accelY=0, dirX=0, dirY=0, mapPosition=0;
   var ufoDamage =0;



   function init(st) {
      stage = st;

      ufoDamage =0;
      moveX =0, moveY=0, angle=0, accelX=0, accelY=0, dirX=0, dirY=0, mapPosition =0;
      capturedList = [];

      entityShadow = new createjs.Bitmap(assets.images.shadow);
      entityShadow.alpha = 0.1;
      entityShadow.y = BOUNDS.bottom+50;
      entityShadow.scaleX = entityShadow.scaleY = 3;
      stage.addChild(entityShadow);

      entity = new createjs.Container();
      entity.setBounds(-70,-50,160,120);
      var ufo = new createjs.Sprite(assets.images.ufo, "run");
      entity.addChild(ufo);
      stage.addChild(entity);

      beam = new createjs.Container();
      var b2 = new createjs.Sprite(assets.images.beam, "run");
      //stage.addChild(beam);
      beam.addChild(b2);

      beam.setBounds(0,-100,100,500);
      //console.log(beam);

      var g = new createjs.Graphics().beginFill("#ff0000").drawRect(-100, 0, 200, 200);
      beamMask = new createjs.Shape(g);
      beam.addChild(beamMask);
      b2.mask = beamMask;
      beamMask.visible = false;
      stage.addChild(beam);
      beam.alpha = 0.0;

      humanSprite = new createjs.Sprite(assets.images.human,"run");


      entity.alpha = 1.0;

      entity.x = stage.canvas.width*0.5;
      entity.y = stage.canvas.height*0.3;
      entity.rotation = 10;
   }

   function getMoveData() {
      return {
         accelX: accelX,
         accelY: accelY,
         dirX: dirX,
         dirY: dirY,
         beamAlpha: beamAlpha,
         mapPosition: mapPosition
      }
   }

   function getDamage() {
      return ufoDamage;
   }

   function addDamage(n,maxDamage) {
      ufoDamage += n;
      if (ufoDamage>maxDamage) {
         ufoDamage = maxDamage;
      }
      if (ufoDamage<0) {
         ufoDamage =0;
      }
   }

   function hitGround() {
      //-- ufo hit ground, add damage according to accelX and bounce up
      ufoDamage += Math.floor(Math.abs(accelX)*5)+1;
      dirY = -1;
      accelY = -1;
      explosion.create(entity.x, entity.y+30, stage);
   }

   function boundsCheck() {

      if (entity.y >= BOUNDS.bottom) {
         hitGround();
      }

      entity.y = (entity.y<BOUNDS.top) ? BOUNDS.top : entity.y;
      entity.y = (entity.y>BOUNDS.bottom) ? BOUNDS.bottom : entity.y;
      entity.x = (entity.x<BOUNDS.left) ? BOUNDS.left : entity.x;
      entity.x = (entity.x>BOUNDS.right) ? BOUNDS.right : entity.x;

      if (mapPosition < -stage.canvas.width) {
         //entity.x = BOUNDS.right;
         mapPosition = -stage.canvas.width;
      }

      if (mapPosition > (assets.TERRAIN_SIZE-0.5)*stage.canvas.width) {
         mapPosition = (assets.TERRAIN_SIZE-0.5)*stage.canvas.width;
      }
   }

   function updateBeam() {
      beam.x = entity.x;
      beam.y = entity.y+100;

      if (keyboard.isDown(keyboard.SPACE)===true) {
         beamAlpha = (beamAlpha<1.0) ? beamAlpha+BEAMALPHASPEED : 1.0;
         assets.sounds.beam.play();
      } else {
         beamAlpha = (beamAlpha>0.0) ? beamAlpha-BEAMALPHASPEED : 0.0;
         assets.sounds.beam.stop();
      }
      beam.alpha = beamAlpha;

      //--shrink closer to ground
      beamMask.scaleY = (720-entity.y)/720;
      beam.scaleY = (500-entity.y)/500*3.2;


   }

   //-- adds a sprite into the player ufo
   function addCaptured() {
      let h=humanSprite.clone()
      capturedList.push(h);
      entity.addChild(h);
      entity.setChildIndex( h, 0);
      h.x = Math.random()*50-10;
      h.y = Math.random()*20-50;

      assets.sounds.points.play();
   }

   //-- move these off-screen
   function removeCaptured() {
      if (capturedList.length>0 && mothershipTick<createjs.Ticker.getTime()) {
         let h = capturedList.pop();
         entity.removeChild();
         stage.addChild(h);
         h.x = entity.x+20;
         h.y = entity.y-50;
         createjs.Tween.get(h).to({y:-100, rotation: Math.random()*720},3000);
         mothershipTick = createjs.Ticker.getTime()+1000;

         assets.sounds.points.play();

         return 1;
      }
      return 0;
   }

   function update() {
      //console.log(entity.x);
      let movingX = 0, movingY = 0;
      let curdirX = 0, curdirY =0;

      if (keyboard.isDown(keyboard.LEFT)===true) {
         accelX -= ACCELERATION;
         dirX = -1;
         angle -= ANGLEMOVE;
         movingX = 1;

      }
      if (keyboard.isDown(keyboard.RIGHT)===true) {
         // entity.x = entity.x + VELOCITY*accel;
         accelX += ACCELERATION;
         dirX = 1;
         angle += ANGLEMOVE;
         movingX =1;
      }
      if (keyboard.isDown(keyboard.UP)===true) {
         // entity.y = entity.y + -VELOCITY*accel;
         dirY = -1;
         accelY -= ACCELERATION;
         movingY =1;
      }
      if (keyboard.isDown(keyboard.DOWN)===true) {
         accelY += ACCELERATION;
         dirY = 1;
         movingY =1;
      }

      mapPosition -=MAPSPEED*accelX;

      angle = (angle>10) ? 10 : angle;
      angle = (angle<-10) ? -10 : angle;

      if (!movingX) {
         //-- do this without dirX to prevent keyboard lock
         //accelX += (-dirX)*DECELERATION;
         accelX = (accelX>0) ? accelX-DECELERATION : accelX+DECELERATION;
         accelX = (accelX<0.1 && accelX>-0.1) ? 0.0 : accelX;

         if (angle>0) {
            angle -=ANGLEMOVE;
         } else if (angle<0) {
            angle += ANGLEMOVE;
         }
      }
      if (!movingY){
         // accelY += (-dirY)*DECELERATION;
         accelY = (accelY>0) ? accelY-DECELERATION : accelY+DECELERATION;
         accelY = (accelY<0.1 && accelY>-0.1) ? 0.0 : accelY;
      }

      entity.x = entity.x + accelX*VELOCITY;
      entity.y = entity.y + accelY*VELOCITY + GRAVITY; //slowly fall

      accelX = (accelX>1.0) ? 1.0 : accelX;
      accelX = (accelX<-1.0) ? -1.0 : accelX;
      accelY = (accelY>1.0) ? 1.0 : accelY;
      accelY = (accelY<-1.0) ? -1.0 : accelY;

      boundsCheck();

      entity.rotation = angle;
      entityShadow.x = entity.x - SHADOWOFFSET;

      updateBeam();
   }

   function getBeam() {
      return beam;
   }

   function getUFO() {
      return entity;
   }

   function hideUFO() {
      entity.alpha = 0.0;
   }

   function showUFO() {
      entity.alpha = 1.0;
   }


   //-- return a score if human is delivered to mothership
   function checkMothershipCollision(ms) {
      let s=0;
      if(collision.checkCollision(ms,entity)) {
         s=removeCaptured();
      }
      return s;
   }

   return {
      init : init,
      update : update,
      getMoveData: getMoveData,
      getBeam: getBeam,
      getUFO : getUFO,
      getDamage : getDamage,
      addDamage : addDamage,
      addCaptured : addCaptured,
      checkMothershipCollision : checkMothershipCollision,
      hideUFO : hideUFO,
      showUFO : showUFO
   }
});
