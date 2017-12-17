define(["assets", "collision", "explosion"], function(assets, collision, explosion) {
   var NUM_TANKS = 10;
   var TANK_RANDOM_MOVE = 80;
   var TANK_SPEED = 6;
   var AIM_XDIST = 600;
   var AIM_YDIST = 600*0.65;
   var TANKGUN_LENGTH = 64;
   var TANK_SHOOT_TIME = 600; //ms

   var stage, stageHeight;
   var tank, tankGun, bullet, bulletLayer;
   var tankList;
   var bulletList;
   var _worldPosition;
   var terrainWidth;

   function init(_stage, maxland) {
      stage = _stage;
      stageHeight = stage.canvas.height;
      tankList = [];
      bulletList = [];

      tank = new createjs.Container();
      tankGun = new createjs.Bitmap(assets.images.tankGun);
      tankGun.regX = 8;
      tankGun.regY = 64;
      let body = new createjs.Bitmap(assets.images.tank);
      tank.addChild(tankGun);
      tank.addChild(body);
      tankGun.y = 40;
      tankGun.x = 65;

      bullet = new createjs.Bitmap(assets.images.tankBullet);

      //-- bulletLayer is NOT stationary. moves with worldPosition to control all bullets.
      bulletLayer = new createjs.Container();
      stage.addChild(bulletLayer);


      //--place some tanks randomly
      //-- don't place tanks on the first terrain where the mothership is
      terrainWidth = (maxland-1)*stage.canvas.width;

      for (var i=0; i<NUM_TANKS; i++) {
         let tt = tank.clone(true);
         tt.offsetX = -Math.random()*terrainWidth-stage.canvas.width;

         stage.addChild(tt);
         tankList.push(tt);
         tt.x = -1000;
         tt.y = 400;
         tt.dirX=0;
         tt.getChildAt(0).rotation = Math.random()*100-50;
         tt.gunDir =1;
         tt.tankAim = false;
         tt.shootTimer = 0;
      }
   }

   //-- needs: sourceX in screen, sourceY, destX in screen, destY

   function createBullet( sourceX, sourceY, destX, destY ) {
      var bb = bullet.clone();
      bulletLayer.addChild(bb);

      bb.x = sourceX;
      bb.y = sourceY;
      bb.name = "tb";

      // let len2 = sourceX - destX;    //-- need: distanceX (lengthX) between src and dest

      //separate tweens to mimic gravity and arcing
      let dx = Math.abs(sourceX-destX);
      let dy = Math.abs(sourceY-destY);
      let t = (dx>dy) ? dx/1000*5000 : dy/1000*5000;
      createjs.Tween.get(bb).to({x:(destX-(sourceX-destX))},t)
      createjs.Tween.get(bb).to({y:destY}, t*0.5, createjs.Ease.quadOut).call(function () {
         createjs.Tween.get(bb).to({y:sourceY}, t*0.5, createjs.Ease.quadIn).call(function() {
            bulletLayer.removeChild(bb);
         });
      });
   }

   function updateBulletLayer(worldPosition) {
      bulletLayer.x = worldPosition;
   }

   function checkBounds(tt) {
      if (tt.offsetX > -stage.canvas.width) {
         tt.dirX = -1;
         tt.offsetX = -stage.canvas.width;
      }
      if (tt.offsetX < -(terrainWidth)) {
         tt.dirX = 1;
         tt.offsetX = -terrainWidth;
      }


   }

   function update(_worldPosition, ufo) {
      worldPosition = _worldPosition;

      for(var i=0; i<tankList.length; i++) {

         //-- move around and randomly change direction every so often
         if (tankList[i].dirX ===0) {
            tankList[i].dirX = Math.floor(Math.random() *1.99);
            tankList[i].dirX = (tankList[i].dirX ===0) ? -1 : 1;
         }
         if (!tankList[i].dirX || Math.random()*TANK_RANDOM_MOVE < 1.0) {
            tankList[i].dirX =0;
         }

         tankList[i].offsetX += tankList[i].dirX*TANK_SPEED;
         tankList[i].x = worldPosition + tankList[i].offsetX;
         tankList[i].y = stageHeight*0.8;

         let rot = tankList[i].getChildAt(0).rotation

         let xx = tankList[i].x - ufo.getUFO().x;
         let yy = tankList[i].y - ufo.getUFO().y;
         let tankAim = false;
         let rotRadians =0.0;

         // two conditions: be within X distance and have beam on, or be able to escape if the beam is off.
         if ((xx < AIM_XDIST && xx >-AIM_XDIST && yy<AIM_YDIST) || (xx < AIM_XDIST && xx >-AIM_XDIST && ufo.getBeam().alpha>0.1)) {
            tankAim = true;
         }

         if (!tankAim) {
            rot += tankList[i].gunDir*1.0;
         } else {

            //-- aim tankgun at ufo
            let c = Math.sqrt(xx*xx + yy*yy);
            rotRadians = Math.atan(xx/yy);//-Math.PI/2;
            rot = -rotRadians*180/Math.PI; //rotRadians*180/Math.PI-90;
            //if (xx <0 ) rot = -rot;
         }

         if (rot > 90) {
            rot=90;
            tankList[i].gunDir = -tankList[i].gunDir;
         }
         if (rot < -90) {
            rot=-90;
            tankList[i].gunDir = -tankList[i].gunDir;
         }
         tankList[i].getChildAt(0).rotation = rot;

         checkBounds(tankList[i]);

         if (tankAim && tankList[i].shootTimer<createjs.Ticker.getTime()) {
            //-- shoot a bullet
            // createBullet(tankList[i].offsetX, tankList[i].y, ufo.getUFO().x-worldPosition, ufo.getUFO().y, xx);
            //console.log(Math.cos(rotRadians+Math.PI/2),rotRadians,xx);
            createBullet(tankList[i].offsetX+60+TANKGUN_LENGTH*Math.cos(rotRadians+Math.PI/2), tankList[i].y+30-TANKGUN_LENGTH*Math.sin(rotRadians+Math.PI/2), ufo.getUFO().x-worldPosition, ufo.getUFO().y);
            // console.log(tankList[i].offsetX,ufo.getUFO().x-worldPosition);
            tankList[i].shootTimer = createjs.Ticker.getTime()+TANK_SHOOT_TIME;
         }
      }

      updateBulletLayer(worldPosition);


   }


   function checkTankBulletUFOCollision(obj) {
      let hit=false;
      for(let i=0; i<bulletLayer.children.length; i++) {
         let c = bulletLayer.getChildAt(i);
         if (c.name === "tb" && collision.checkCollision(c, obj)) {
            createjs.Tween.removeTweens(c);
            c.name="";
            explosion.create(c.x+worldPosition,c.y,stage);
            bulletLayer.removeChild(c);
            hit=true;
         }
      }
      return hit;
   }

   return {
      init : init,
      update: update,
      checkTankBulletUFOCollision : checkTankBulletUFOCollision
   }
});
