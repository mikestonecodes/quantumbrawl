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

        
        var li = document.getElementById(id);
        var list = document.getElementById('hacks')

        if (!(typeof (li) != "undefined" && li != null)) {
            li = document.createElement('li');
            li.id = id;
            list.prepend(li);
            totalAdded++;

            if(totalAdded > 5){
                var els = document.getElementsByTagName("li");
                var removeEl = els[els.length - 1];            // <-- fetching last el
                var containerEl = removeEl.parentNode;
                containerEl.removeChild(removeEl);
            }
    
        }
       
        if (data && data.player) {
            let date = new Date(data.hackCheckedOn);
            
            var html = '<span> <b>' + data.player +      "</b> " + date.toLocaleTimeString() + "<br/> " + data.type + 
            " " + data.speed.toFixed(2) +  
             " <br/>Dectected By: " + data.detectedBy + '</span> <br/>  <br/> ';
            li.innerHTML = html
        } else {
            li.style.display = 'none';
        }

       
    });
});

