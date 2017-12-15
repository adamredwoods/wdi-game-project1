define(["assets"], function(assets) {
   var NUM_TANKS = 10;
   var TANK_RANDOM_MOVE = 50;
   var TANK_SPEED = 3;
   var AIM_DIST = 600;

   var stage, stageHeight;
   var tank, tankGun, bullet, bulletLayer;
   var tankList=[];
   var bulletList = [];

   function init(_stage, maxland) {
      stage = _stage;
      stageHeight = stage.canvas.height;

      if (!tank) {
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
      }

      //--place some tanks randomly
      //-- don't place tanks on the first terrain where the mothership is
      let terrainWidth = (maxland-1)*stage.canvas.width;

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

   //-- needs: sourceX in world, sourceY, destX in world, destY
   function createBullet( sourceX, sourceY, destX, destY, lengthX ) {
      var bb = bullet.clone();
      bulletLayer.addChild(bb);

      bb.x = sourceX;
      bb.y = sourceY;

      //separate tweens to mimic gravity and arcing
      let dx = Math.abs(sourceX-destX);
      let dy = Math.abs(sourceY-destY);
      let t = (dx>dy) ? dx/1000*5000 : dy/1000*5000;
      createjs.Tween.get(bb).to({x:(destX-lengthX)},t)
      createjs.Tween.get(bb).to({y:destY}, t*0.5, createjs.Ease.quadOut).call(function () {
         createjs.Tween.get(bb).to({y:sourceY}, t*0.5, createjs.Ease.quadIn).call(function() {
            bulletLayer.removeChild(bb);
         });
      });
   }

   function updateBulletLayer(worldPosition) {
      bulletLayer.x = worldPosition;
   }


   function update(worldPosition, ufo) {

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

         if (xx < AIM_DIST && xx >-AIM_DIST && yy<AIM_DIST*0.75) {
            tankAim = true;
         }

         if (!tankAim) {
            rot += tankList[i].gunDir*1.0;
         } else {

            //-- aim at ufo
            let c = Math.sqrt(xx*xx + yy*yy);
            //let cc = xx*xx+yy*yy;
            rot = Math.asin(yy/c)*180/Math.PI-90;
            if (xx <0 ) rot = -rot;
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

         if (tankAim && tankList[i].shootTimer<createjs.Ticker.getTime()) {
            //-- shoot a bullet
            createBullet(tankList[i].offsetX, tankList[i].y, ufo.getUFO().x-worldPosition, ufo.getUFO().y, xx);
            // console.log(tankList[i].offsetX,ufo.getUFO().x-worldPosition);
            tankList[i].shootTimer = createjs.Ticker.getTime()+2000;
         }
      }

      updateBulletLayer(worldPosition);
   }

   return {
      init : init,
      update: update
   }
});
