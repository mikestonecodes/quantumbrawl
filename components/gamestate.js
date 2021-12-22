let vec1 = new THREE.Vector3();
let vec2 = new THREE.Vector3();

class gameState {
    static gameHistory = []
    static gamestateIndex = 0;
    static maxleg = 3;
    static players = {}

    static add(item) {
        this.gameHistory[this.gamestateIndex] = item;
        this.gamestateIndex++;
        this.validate();
        this.gameHistory.splice(0, this.gamestateIndex - this.maxleg)
    }

    static validate() {

        for (var i = 1; i >= 0; i--) {
            let checkState = this.gameHistory[this.gamestateIndex - i];

            if (!checkState) return;

            if (!this.players[checkState.id]) this.players[checkState.id] = {
                lsTimeRecieved: checkState.timeRecieved,
                lsTargetPos: checkState.targetPosition,
            }

            let previous = this.players[checkState.id];

            vec1.copy(checkState.targetPosition);
            vec2.copy(previous.lsTargetPos);
            
            var timeDiff = checkState.timeRecieved - previous.lsTimeRecieved;

            var speed = vec2.sub(vec1).divideScalar(timeDiff).length();


            if (speed > 0.05 && timeDiff > 30) {
                let hackInfo = { type: "speed", speed, timeDiff, player: checkState.id, detectedBy: window.gunid ,hackCheckedOn:Gun.state() }
                gun.get('hacks').set(hackInfo);
                console.log("HACK DETECTED", hackInfo);
            }

            this.players[checkState.id].lsTimeRecieved = checkState.timeRecieved;
            this.players[checkState.id].lsTargetPos = checkState.targetPosition;

        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let totalAdded = 0;
    gun.get('hacks').map().on((data, id) => {
       
        if (data && data.player) {
          console.log("HACK",data)
        } 
       
    });
});

