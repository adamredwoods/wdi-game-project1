define( ["assets", "game"], function(assets, game) {

   var HUMAN_RANDOM_MOVE = 25;
   var HUMAN_SPEED = 4;
   var HUMAN_FLY_SPEED = 2;
   var GRAVITY = 5;

   var stage;
   var numHumans = 20;
   var human = [];


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

   function checkCollision(mc1, mc2) {

      let b1 = mc1.getBounds();
      let b2 = mc2.getBounds();

       m1x = mc1.x+b1.x;
       m1y = mc1.y+b1.y;
       m1w = b1.width;
       m1h = b1.height;

       m2x = mc2.x+b2.x;
       m2y = mc2.y+b2.y;
       m2w = b2.width;
       m2h = b2.height;

      //  console.log(m2x,m2w);

       if (    m1x >= m2x + m2w
           ||  m1x + m1w <= m2x
           ||  m1y >= m2y + m2h
           ||  m1y + m1h <= m2y) {
           return false;
       } else {
           return true;
       }
   }

   function checkBeamCollision(beam) {
      for (var i=0; i<numHumans; i++) {

         if( checkCollision(human[i], beam)) {
            human[i].beamingStart = true;
            // console.log("hit"+i);
         }
      }
   }

   function checkUFOCollision(ufo) {
      for (var i=0; i<numHumans; i++) {

         if( checkCollision(human[i], ufo)) {
            human[i].captured = true;
            // console.log("hit"+i);
         }
      }
   }


   return {
      init: init,
      update: update,
      checkBeamCollision: checkBeamCollision
   }
});
