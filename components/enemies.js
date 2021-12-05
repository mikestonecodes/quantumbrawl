AFRAME.registerComponent('enemies', {
  schema: {
    color: {type: 'color', default: '#AAA'}
  },
  init:function(){
    this.enemies = []
    this.smoothTime = 0;
  },
  remove: function(id){
    if(id && this.enemies[id] ){
       if(this.enemies[id].entity) sceneEl.removeChild(this.enemies[id].entity);
       this.enemies = this.enemies.filter((i)=>i!=id);   
        
        gun.get('players').get(id).put(null);
      }
  },
  update: function () {
    this.el.smoothTime = 0;
    this.el.newPosition = { x: 0, z: 0 }
    window.enemies = [];
    let data = this.data;
    
    this.geometry = new THREE.BoxBufferGeometry(1, 1, 1);

    // Create material.
    this.material = new THREE.MeshStandardMaterial({color: data.color});

    // Create mesh.
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material,1000);
    this.mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );
    this.el.setObject3D('mesh',this.mesh)

    this.dummy = new THREE.Object3D();

    gun.get('players').map().on((data, id) =>{
      
      if(!data || !data.time){
        return;
      }
      
      if (Date.now() - data.time > 1000) {
        return;
      }

      if(document.querySelector("#player").gunid==id){
        return;
      }

      let newpos = {x:data.x,y:data.y,z:data.z};
      this.enemies[id] = {newpos,time:Date.now()};

    });

  },
  tick: function (t, dt) {
    this.mesh.count = Object.keys(this.enemies).length;
    let i = 0;
    for(let [id,data] of Object.entries(this.enemies)){
      if (Date.now() -data.time > 500) {
        this.remove(id);
        return;
      }
      
      if(!this.enemies[id].x)this.enemies[id].x = this.enemies[id].newpos.x;
      if(!this.enemies[id].z)this.enemies[id].z = this.enemies[id].newpos.z;
      let vx = easement.ease('easeOutQuart', this.smoothTime, {
        endTime: this.smoothTime + 700,
        startValue:this.enemies[id].x   ,
        endValue: this.enemies[id].newpos.x
      })

     
      let vz = easement.ease('easeOutQuart', this.smoothTime, {
        endTime: this.smoothTime + 434,
        startValue:  this.enemies[id].z   ,
        endValue: this.enemies[id].newpos.z 
      })
      this.enemies[id].x = vx;
      this.enemies[id].z = vz;
      this.dummy.position.set(this.enemies[id].x,0.5,this.enemies[id].z);

      this.dummy.updateMatrix();
			this.mesh.setMatrixAt( i ++, this.dummy.matrix );
   
    }
    this.mesh.instanceMatrix.needsUpdate = true;

    this.smoothTime+=0.1;

   /* if (!this.el.newPosition.x || !this.el.object3D.position || !this.el.object3D.position.x) return;
   

    this.el.object3D.position.set(vx, 0.5, vz)

   

   */

  }
});