define(["assets"], function(assets) {
   var NUM_TANKS = 10;
   var TANK_RANDOM_MOVE = 50;
   var TANK_SPEED = 3;

   var stage, stageHeight;
   var tank, tankGun, bullet;
   var tankList=[];

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
      }

      //--place some tanks randomly
      //-- don't place tanks on the first terrain where the mothership is
      let terrainWidth = (maxland-1)*stage.canvas.width;

      for (var i=0; i<NUM_TANKS; i++) {
         let tt = tank.clone(true);
         tt.offset = -Math.random()*terrainWidth-stage.canvas.width;

         stage.addChild(tt);
         tankList.push(tt);
         tt.x = -1000;
         tt.y = 400;
         tt.dirX=0;
         tt.getChildAt(0).rotation = Math.random()*100-50;
         tt.gunDir =1;
      }
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

         tankList[i].offset += tankList[i].dirX*TANK_SPEED;
         tankList[i].x = worldPosition + tankList[i].offset;
         tankList[i].y = stageHeight*0.8;

         let rot = tankList[i].getChildAt(0).rotation
         rot += tankList[i].gunDir*1.0;
         rot = (rot > 50) ? 50 : rot;
         rot = (rot < -50) ? -50 : rot;

      }

   }

   return {
      init : init,
      update: update
   }
});
