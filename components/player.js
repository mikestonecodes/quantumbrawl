AFRAME.registerComponent('player', {
    init: function () {
        // Set up the tick throttling.
        this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
       
        this.gunid =  Gun.text.random(5,"abcdefghijklmnopqrstuvwxyz");


     //   this.pPos = this.el.object3D.position;
        console.log("my gun ID", this.gunid);
        this.el.gunid = this.gunid;
        this.lpos = this.el.object3D.position;
      },
    
      /**
       * Tick function that will be wrapped to be throttled.
       */
      tick: function (t, dt) {
      
        gun.get('players').get( this.gunid ).put({...this.el.object3D.position})
       // this.pPos = this.el.object3D.position;
      }
});