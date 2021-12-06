
function BezierBlend(t) {
  return t * t * (3.0 - 2.0 * t);
}

AFRAME.registerComponent('enemies', {
  schema: {
    color: { type: 'color', default: '#e76f51' }
  },
  init: function () {
    this.enemies = []
  },

  remove: function (id) {
    if (id && this.enemies[id]) {
      if (this.enemies[id].entity) sceneEl.removeChild(this.enemies[id].entity);
      this.enemies = this.enemies.filter((i) => i != id);
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
    this.material = new THREE.MeshStandardMaterial({ color: data.color });

    // Create mesh.
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, 1000);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.el.setObject3D('mesh', this.mesh)

    this.dummy = new THREE.Object3D();
   
    gun.get('players').map().on((data, id) => {

      if (!data) {
        return;
        //don't include null players
      }


      if (document.querySelector("#player").gunid == id) {
        return;
        //don't include yourself
      }

      if (!this.enemies[id]) this.enemies[id] = { position: new THREE.Vector3().copy(data) };

      this.enemies[id].targetPosition = { x: data.x, y: data.y, z: data.z };
      this.enemies[id].timeRecieved = Gun.state();      

      gameState.add(
        {
          id,
          targetPosition:this.enemies[id].targetPosition,
          timeRecieved:this.enemies[id].timeRecieved,
        }
      );

    });

  },
  
  tick: function (t, dt) {

    this.mesh.count = Object.keys(this.enemies).length;
    let i = 0;
    for (let [id, data] of Object.entries(this.enemies)) {
      if (Gun.state() - data.timeRecieved > 500) {
        //remove 
        this.remove(id);
        break;
      }
      
      this.enemies[id].position.lerp(data.targetPosition, BezierBlend(0.18  ) );
     
      this.dummy.position.copy(this.enemies[id].position);

      this.dummy.updateMatrix();

      this.mesh.setMatrixAt(i++, this.dummy.matrix);

      this.enemies[id].pTime = Gun.state();

    }
    this.mesh.instanceMatrix.needsUpdate = true;

  }
});