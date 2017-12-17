define(["assets"], function(assets) {

   var STARS_OFFSET = -512;
   var MOTHERSHIP_SPEED = 3.0;

   var stage;
   var landscape = [];
   var landscapeStars, landscapeStars2, mothership;

   //
   //-- start setting up the landscape and terrain
   //
   function init(_stage) {

      stage = _stage;
      var terrainWidth = stage.canvas.width;

      //--make stars
      landscapeStars = new createjs.Container();
      landscapeStars.addChild(new createjs.Bitmap(assets.images.bg));

      let stars2 = landscapeStars.addChild(new createjs.Bitmap(assets.images.bg));
      stars2.x = 512;
      stars2 = landscapeStars.addChild(new createjs.Bitmap(assets.images.bg));
      stars2.x = 1024;
      stage.addChild(landscapeStars);

      landscapeStars2 = new createjs.Container();
      landscapeStars2.addChild(new createjs.Bitmap(assets.images.bg));

      stars2 = landscapeStars2.addChild(new createjs.Bitmap(assets.images.bg));
      stars2.x = 512;
      stage.addChild(landscapeStars2);
      landscapeStars2.x = -1024;

      //-- terrain images

      let tree = new createjs.Bitmap(assets.images.tree);
      tree.regY = 256;

      //--make all tiles, random
      for (var i=0; i< assets.TERRAIN_SIZE; i++) {
         landscape[i] = new createjs.Container();
         landscape[i].addChild(assets.groundShape());

         let n = (Math.random()*2|0)+5;
         let xflip=1.0;
         for (var j=0; j< n; j++){
            tree = tree.clone();
            landscape[i].addChild(tree);
            tree.x = Math.random()*terrainWidth|0;
            tree.y = 490;
            tree.scaleX = tree.scaleY = 0.25+Math.random()*0.5;
            tree.scaleX *= xflip;
            xflip = -xflip;
         }

         landscape[i].offset = -terrainWidth*i;

         stage.addChild(landscape[i]);
      }

      //-- make border terrain tiles
      let n = assets.TERRAIN_SIZE;
      landscape[n] = new createjs.Container();
      landscape[n].addChild(assets.groundShape());
      landscape[n].offset = terrainWidth;
      stage.addChild(landscape[n]);

      landscape[n+1] = new createjs.Container();
      landscape[n+1].addChild(assets.groundShape());
      landscape[n+1].offset = -terrainWidth*(assets.TERRAIN_SIZE);
      stage.addChild(landscape[n+1]);

      //--make mothership
      mothership = new createjs.Sprite(assets.images.mothership, "run");
      landscape[n].addChild(mothership);
      mothership.x = terrainWidth * 0.5;
      mothership.dirX = -1;
      mothership.offset = 0;
      mothership.setBounds(70,98,120,80);



   }

   //-- mothership is a child of terrain[n]
   function updateMothership() {
      var terrainWidth = stage.canvas.width;
      mothership.x += mothership.dirX*MOTHERSHIP_SPEED;
      if (mothership.x > terrainWidth*0.6) {
         mothership.dirX = -1;
      }
      if (mothership.x < 0) {
         mothership.dirX = 1;
      }
   }

   function getMothership() {
      return mothership;
   }

   function update(mapPosition) {
      landscapeStars.x = mapPosition*0.1+STARS_OFFSET;
      landscapeStars2.x = mapPosition*0.1+STARS_OFFSET;
      if (landscapeStars2>0) {
         landscapeStars.x = 0;
         landscapeStars2.x = -1024;
      }
      if (landscapeStars2<-1024) {
         landscapeStars.x = 1024;
         landscapeStars2.x = 0;
      }

      for (var i=0; i< landscape.length; i++) {
         landscape[i].x = mapPosition + landscape[i].offset;
      }

      updateMothership();
   }

   return {
      init : init,
      update : update,
      getMothership : getMothership
   }
});
