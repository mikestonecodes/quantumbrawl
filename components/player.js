
AFRAME.registerComponent('player', {
    init: function () {
        // Set up the tick throttling.
        this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
       
        this.gunid =  Gun.text.random(5,"abcdefghijklmnopqrstuvwxyz");


     //   this.pPos = this.el.object3D.position;
        console.log("my gun ID", this.gunid);
        this.el.gunid = this.gunid;
        this.lpos = this.el.object3D.position;
        window.gunid = this.gunid;
        document.getElementById("teleportButton").addEventListener("click", ()=>{

          let ng = Math.random() > .5?-1:1;
          let ng2 = Math.random() > .5?-1:1;
          this.el.object3D.position.set(Math.random()*18*ng,0.5,Math.random()*18*ng2);
          
        });

      },
      /**
       * Tick function that will be wrapped to be throttled.
       */
      tick: function (t, dt) {
      
        gun.get('players').get( this.gunid ).put({...this.el.object3D.position})
       // this.pPos = this.el.object3D.position;
      }
});