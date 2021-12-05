AFRAME.registerComponent('player', {
    init: function () {
        // Set up the tick throttling.
        this.tick = AFRAME.utils.throttleTick(this.tick, 32, this);
       
        this.gunid =  Gun.text.random(5,"abcdefghijk");


     //   this.pPos = this.el.object3D.position;
        console.log("my gun ID", this.gunid);
        this.el.gunid = this.gunid;
        this.lpos = this.el.object3D.position;
      },
    
      /**
       * Tick function that will be wrapped to be throttled.
       */
      tick: function (t, dt) {
        
        gun.get('players').get( this.gunid ).put({...this.el.object3D.position,time:Date.now()})
       // this.pPos = this.el.object3D.position;
      }
});