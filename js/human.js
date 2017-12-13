define( ["assets", "game", "collision"], function(assets, game, collision) {

   var HUMAN_RANDOM_MOVE = 25;
   var HUMAN_SPEED = 4;
   var HUMAN_FLY_SPEED = 2;
   var GRAVITY = 5;

   var stage;
   var numHumans = 20;
   var human = [];
   var testblock;

   function init(st, maxland) {
      stage = st;

      var humanSprite = new createjs.Sprite(assets.images.human,"run");
      humanSprite.setBounds(35,15,2,2);

      for (i=0; i<numHumans; i++) {
         human[i] = humanSprite.clone();
         stage.addChild(human[i]);
         human[i].offset = -Math.random()*maxland*stage.canvas.width;
         human[i].y = 500;
      }

      var g = new createjs.Graphics();
      testblock = new createjs.Shape(g.f("#ff0000").drawRect(0,0,10,10));
      stage.addChild(testblock);
   }

   function checkBounds(i) {
      human[i].y = (human[i].y>500) ? 500 : human[i].y;

   }

   function update(worldPosition) {
      for (i=0; i<numHumans; i++) {

         if (!human[i].captured) {
            if (human[i].dirX ===0) {
               human[i].dirX = Math.floor(Math.random() *1.99);
               human[i].dirX = (human[i].dirX ===0) ? -1 : 1;
            }
            if (!human[i].dirX || Math.random()*HUMAN_RANDOM_MOVE < 1.0) {
               human[i].dirX =0;
            }

            human[i].offset += human[i].dirX*HUMAN_SPEED;
            human[i].x = worldPosition + human[i].offset;


            if (human[i].beamingStart ===true) {
               human[i].y -= HUMAN_FLY_SPEED;
               human[i].dirX =0;
            } else {
               human[i].y += GRAVITY;
            }
            //--always set to false afterwards
            human[i].beamingStart = false;

            checkBounds(i);

         } else {
            human[i].visible = false;

         }
      }
   }


   function checkBeamCollision(beam) {
      for (var i=0; i<numHumans; i++) {

         if( collision.checkCollision(human[i], beam)) {
            human[i].beamingStart = true;
            // console.log("hit"+i);
         }
      }
   }

   function checkUFOCollision(ufo) {
      var fake = new createjs.Container();
      fake.setBounds(-40,0,160,60);
      fake.x = ufo.x;
      fake.y = ufo.y;

      let total=0;
      // testblock.x = fake.getBounds().width+fake.x;
      // testblock.y = fake.getBounds().height+fake.y;

      for (var i=0; i<numHumans; i++) {

         if( human[i].visible && collision.checkCollision(human[i], fake)) {
            if (!human[i].captured) {
               human[i].captured = true;
               total++;
            }
            //console.log("hit"+i);
         }
      }

      return total;
   }


   return {
      init: init,
      update: update,
      checkBeamCollision: checkBeamCollision,
      checkUFOCollision : checkUFOCollision
   }
});
