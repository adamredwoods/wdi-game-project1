define( ["assets", "game", "collision"], function(assets, game, collision) {

   var HUMAN_RANDOM_MOVE = 25;
   var HUMAN_SPEED = 4;
   var HUMAN_FLY_SPEED = 5;
   var GRAVITY = 5;

   var stage;
   var numHumans;
   var human;
   var maxland =0; //remember how big everything is
   var testblock;

   function init(st, _maxland, _totalHumans) {
      stage = st;
      maxland = _maxland;
      numHumans = _totalHumans;
      human = [];

      var humanSprite = new createjs.Sprite(assets.images.human,"run");
      humanSprite.setBounds(35,15,2,2);

      for (i=0; i<numHumans; i++) {
         let hh = humanSprite.clone();
         human.push(hh);
         stage.addChild(hh);
         hh.offset = -Math.random()*(maxland-1)*stage.canvas.width;
         hh.y = 500;
         hh.captured = false;
         hh.beamingStart = false;
      }

      //--testblock for collision testing
      //var g = new createjs.Graphics();
      //testblock = new createjs.Shape(g.f("#ff0000").drawRect(0,0,10,10));
      //stage.addChild(testblock);
   }

   function checkBounds(i) {
      human[i].y = (human[i].y>500) ? 500 : human[i].y;
      human[i].offset = (human[i].offset<(-(maxland-0.5)*stage.canvas.width)) ? (-maxland*stage.canvas.width) : human[i].offset;
   }

   function update(worldPosition) {
      for (i=0; i<numHumans; i++) {

         if (!human[i].captured) {

            //-- move around and randomly change direction every so often
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

   function getTotalHumans() {
      return numHumans;
   }


   return {
      init: init,
      update: update,
      checkBeamCollision: checkBeamCollision,
      checkUFOCollision : checkUFOCollision,
      getTotalHumans : getTotalHumans
   }
});
