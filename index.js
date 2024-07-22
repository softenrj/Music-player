var playp = document.querySelector("#play");
var musicIndex = Math.floor(Math.random()*list.length);
var aud = new Audio(`./assets/music/${list[musicIndex].music}`);

// Function to set the audio source
function musicSRC(i) {
    if (!aud.paused) aud.pause(); // Stop the current audio if playing
    aud.src = `./assets/music/${list[i].music}`; // Update the source of the existing Audio object
    aud.load(); // Load the new source
    aud.addEventListener("ended", endHandle); 
}

// Function to update the images
function image(i) {
    var images = document.querySelectorAll(".img");
    images[0].setAttribute("src", `./assets/music-img/${list[i].img}`);
    images[1].setAttribute("src", `./assets/music-img/${list[i].img}`);
}

// Load initial image
image(musicIndex);

// Play/Pause button click event
playp.addEventListener("click", () => {
    if (playp.classList.contains("paus")) {
        pause();
    } else {
        pla();
    }
});

// Play function
function pla() {
    playp.classList.add("paus");
    playp.classList.replace("fa-play", "fa-pause");
    if(aud.ended || aud.currentTime===0){
        musicSRC(musicIndex);
        pro();
    }
    aud.play();
    waveFix();
}
function waveFix(){
    document.querySelector("#wave").classList.toggle("loader");
    document.querySelector(".container").classList.toggle("containerwave");
    document.querySelector(".player-img").classList.toggle("player-imgwave");
    document.querySelector(".player-controls").classList.toggle("player-controlswave");
    document.querySelector(".player-progress").classList.toggle("player-progresswave");
    

}

// Pause function
function pause() {
    playp.classList.remove("paus");
    playp.classList.replace("fa-pause", "fa-play");
    aud.pause();
    waveFix();
}

// Progress bar update function
var progress = document.querySelector(".progress");
function pro() {
    setInterval(() => {
        if (aud.duration) {
            var musicTimer = (aud.currentTime / aud.duration) * 100;
            progress.style.width = `${musicTimer}%`;
        }
    }, 1000);
}

// Progress bar click event to seek audio
var proBar = document.querySelector(".player-progress");
proBar.addEventListener("click", (event) => {
    var proBarWidth = proBar.offsetWidth;
    var clickPosition = (event.offsetX / proBarWidth);
    aud.currentTime = (clickPosition) * aud.duration;
    progress.style.width = `${clickPosition*100}%`;
});

// Forward button click event
document.querySelector(".fa-forward").addEventListener("click", () => {
    musicIndex= (musicIndex + 1);
    if (musicIndex >= list.length) musicIndex = 0; // Loop back to the first song if at the end
    image(musicIndex);
    musicSRC(musicIndex);
    if (playp.classList.contains("paus")) {
        aud.play();
        pro();
    }
});

var isDragging = false;

function setAudioProgress(position) {
    var proBarWidth = proBar.offsetWidth;
    var clickPosition = (position / proBarWidth);
    var newTime = (clickPosition) * aud.duration;
    aud.currentTime = newTime;
    progress.style.width = `${clickPosition*100}%`;
}

function handleDown(event) {
    isDragging = true;
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);

    document.addEventListener("touchmove", handleMove);
    document.addEventListener("touchend", handleUp);
}

function handleMove(event) {
    if (isDragging) {
        var proBarRect = proBar.getBoundingClientRect();
        var position = event.type.includes('mouse') ? event.clientX - proBarRect.left : event.touches[0].clientX - proBarRect.left;
        if (position >= 0 && position <= proBarRect.width) {
            setAudioProgress(position);
        }
    }
}

function handleUp() {
    isDragging = false;
    
    // Remove event listeners when dragging ends
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", handleUp);
    document.removeEventListener("touchmove", handleMove);
    document.removeEventListener("touchend", handleUp);
}

// Attach event listeners
proBar.addEventListener("mousedown", handleDown);
proBar.addEventListener("touchstart", handleDown);



// Backward button click event
document.querySelector(".fa-backward").addEventListener("click", () => {
    if(Math.floor(aud.currentTime)===0){
        musicIndex -= 1;
       if (musicIndex < 0) musicIndex = list.length-1;
        image(musicIndex);
        musicSRC(musicIndex);
       if (playp.classList.contains("paus")) {
        aud.play();
        pro();
    }
    }
    aud.currentTime=0;
});

// Repeat button click event
var repeat = document.querySelector(".fa-repeat");
var isrepeat = false;
repeat.addEventListener("click", () => {
    isrepeat = !isrepeat;
    repeat.classList.toggle("loop", isrepeat);
});

// Handle the end of the audio
function endHandle() {
    if (isrepeat) {
        aud.currentTime = 0;
        aud.play();
    } else {
        musicIndex += 1;
        if (musicIndex >= list.length) musicIndex = 0; // Loop back to the first song if at the end
        image(musicIndex);
        musicSRC(musicIndex);
        if (playp.classList.contains("paus")) {
            aud.play();
            pro();
        }
    }
}

setInterval(() => {
    const currentTimeMinutes = Math.floor(aud.currentTime / 60);
    const currentTimeSeconds = Math.floor(aud.currentTime % 60);
    const durationMinutes = Math.floor(aud.duration / 60);
    const durationSeconds = Math.floor(aud.duration % 60);
  
    document.querySelector("#current-time").innerHTML = `${currentTimeMinutes}:${currentTimeSeconds.toString().padStart(2, '0')}`;
    document.querySelector("#duration").innerHTML = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
  }, 100);

  document.querySelector(".fa-volume-up").addEventListener("click", toggleMute);

  function toggleMute() {
    if (this.classList.contains("fa-volume-xmark")) {
      this.classList.replace("fa-volume-xmark", "fa-volume-up");
      aud.volume = 1;
      soundBar.value=100;
      document.querySelector("#volume_show").innerHTML = 100;

    } else {
      this.classList.replace("fa-volume-up", "fa-volume-xmark");
      aud.volume = 0;
      soundBar.value=0;
      document.querySelector("#volume_show").innerHTML = 0;
      
    }
  }
  var soundBar = document.querySelector("#volume-changer");

  soundBar.onchange =function(){
    const volumeValue = this.value;
    console.log(volumeValue);
    document.querySelector("#volume_show").innerHTML = volumeValue;
    aud.volume = volumeValue / 100;
  };