define( [], function() {

   var testsq;
   var stage;

   function setStageForTest(_stage) {
      stage = _stage;
   }

   function setTest(x,y,w,h) {
      if(!testsq) {
         var g = new createjs.Graphics();
         testsq = new createjs.Shape(g.f("#ff0000").drawRect(0,0,10,10));
         stage.addChild(testsq);
      }
      testsq.x = x;
      testsq.y = y;
      testsq.scaleX = (w/10);
      testsq.scaleY = (h/10);
   }

   function checkCollision(mc1, mc2, test) {

      let b1 = mc1.getBounds();
      let b2 = mc2.getBounds();
      //let g1 = mc1.localToGlobal(mc1.x,mc1.y);
      //let g2 = mc2.localToGlobal(mc2.x,mc2.y);

       m1x = mc1.x+b1.x;
       m1y = mc1.y+b1.y;
       m1w = b1.width;
       m1h = b1.height;

       //-- this is bad, but localToGlobal doesn't work
       if (mc1.parent) {
         m1x = mc1.x+mc1.parent.x+b1.x;
         m1y = mc1.y+mc1.parent.y+b1.y;
       }

       m2x = mc2.x+b2.x;
       m2y = mc2.y+b2.y;
       m2w = b2.width;
       m2h = b2.height;



      //  console.log(m2x,m2w);
      if (test) setTest(m1x,m1y,m1w,m1h);
      
       if (    m1x >= m2x + m2w
           ||  m1x + m1w <= m2x
           ||  m1y >= m2y + m2h
           ||  m1y + m1h <= m2y) {
           return false;
       } else {

           return true;
       }
   }

   return {
      checkCollision : checkCollision,
      setStageForTest : setStageForTest
   }
});
