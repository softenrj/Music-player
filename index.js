const play_pause_btn = document.querySelector(".fa-play");
const muisc_image = document.querySelectorAll('.img');

// Play pause button functionality
play_pause_btn.addEventListener('click', () => {
    if (play_pause_btn.classList.contains('fa-play')) {
        Handle_musicPlay();
    } else if (play_pause_btn.classList.contains('fa-pause')) {
        Handle_musicPause();
        music_wave_generator();
    }
});

// Audio initialization
var music_current_index = Math.floor(Math.random() * list.length +1);
var audio = new Audio(`./assets/music/${list[music_current_index].music}`);

// Music play function
function Handle_musicPlay() {
    play_pause_btn.classList.replace('fa-play', 'fa-pause');
    audio.play();
    progress_display(true);
    music_wave_generator();
}

// Music pause function
function Handle_musicPause() {
    play_pause_btn.classList.replace('fa-pause', 'fa-play');
    progress_display(false);
    audio.pause();
}

// Wave form functionality
function music_wave_generator() {
    document.querySelector("#wave").classList.toggle("loader");
    document.querySelector(".container").classList.toggle("containerwave");
    document.querySelector(".player-img").classList.toggle("player-imgwave");
    document.querySelector(".player-controls").classList.toggle("player-controlswave");
    document.querySelector(".player-progress").classList.toggle("player-progresswave");
}

// Music image and audio changer
function music_changer(index) {
    // For image
    muisc_image[0].setAttribute('src', `./assets/music-img/${list[index].img}`);
    muisc_image[1].setAttribute('src', `./assets/music-img/${list[index].img}`);

    // For audio
    if (audio.play()) Handle_musicPause();
    audio.src = `./assets/music/${list[index].music}`;
    audio.load();
}

music_changer(music_current_index);

// Forward and backward button functionality
const forword_btn = document.querySelector(".fa-forward");
forword_btn.addEventListener('click',Handle_forword);

function Handle_forword() {
    music_current_index += 1;
    if (music_current_index >= list.length) music_current_index = 0;
    if (play_pause_btn.classList.contains('fa-pause')) {
        music_changer(music_current_index);
        play_pause_btn.classList.replace('fa-play','fa-pause');
        audio.play();
    }else{
        music_changer(music_current_index);
    }
}

const backward_btn = document.querySelector(".fa-backward");
backward_btn.addEventListener('click',Handle_backward);

function Handle_backward() {
    music_current_index -= 1;
    if (music_current_index < 0) music_current_index = list.length - 1;
    if (play_pause_btn.classList.contains('fa-pause')) {
        music_changer(music_current_index);
        play_pause_btn.classList.replace('fa-play','fa-pause');
        audio.play();
    }else{
        music_changer(music_current_index);
    }
}

//play a music from list;
function play_musicFromlist(){
    if (play_pause_btn.classList.contains('fa-pause')) {
        music_changer(music_current_index);
        play_pause_btn.classList.replace('fa-play','fa-pause');
        audio.play();
    }else{
        music_changer(music_current_index);
    }
}

// Repeat button functionality
const repeat_btn = document.querySelector(".fa-repeat");
repeat_btn.addEventListener('click',Handle_repeat);
var isrepeat = false;

function Handle_repeat() {
    isrepeat = !isrepeat;
    repeat_btn.classList.toggle("loop");
}

// Handle mute and unmute functionality
const mute_btn = document.querySelector(".fa-volume-up");
var currentSoundlevel = document.querySelector("#volume-changer");
var volumeLevel = document.querySelector("#volume_show");

mute_btn.addEventListener('click',Handle_mute);

function Handle_mute() {
    if (this.classList.contains("fa-volume-xmark")) {
        this.classList.replace("fa-volume-xmark", "fa-volume-up");
        audio.volume = 1;
        currentSoundlevel.value = 100;
        volumeLevel.innerHTML = 100;
    } else {
        this.classList.replace("fa-volume-up", "fa-volume-xmark");
        audio.volume = 0;
        currentSoundlevel.value = 0;
        volumeLevel.innerHTML = 0;
    }
}

// Sound level change functionality
currentSoundlevel.onchange = () => {
    if(mute_btn.classList.contains("fa-volume-xmark")){
        mute_btn.classList.replace("fa-volume-xmark", "fa-volume-up");
    }
    const level = currentSoundlevel.value;
    volumeLevel.innerHTML = level;
    audio.volume = level / 100;
}

// Handle music ended
audio.addEventListener('ended', Handle_musicEnd);

function Handle_musicEnd() {
    if (isrepeat) {
        audio.currentTime = 0;
        audio.play();
    } else {
        music_current_index += 1;
        if (music_current_index >= list.length) music_current_index = 0;
        if (play_pause_btn.classList.contains('fa-pause')) {
            music_changer(music_current_index);
            play_pause_btn.classList.replace('fa-play','fa-pause');
            audio.play();
        }else{
            music_changer(music_current_index);
        }
    }
}

// Set intervals to update time
setInterval(() => {
    const currentTimeMinutes = Math.floor(audio.currentTime / 60);
    const currentTimeSeconds = Math.floor(audio.currentTime % 60);
    const durationMinutes = Math.floor(audio.duration / 60);
    const durationSeconds = Math.floor(audio.duration % 60);

    document.querySelector("#current-time").innerHTML = `${currentTimeMinutes}:${currentTimeSeconds.toString().padStart(2, '0')}`;
    document.querySelector("#duration").innerHTML = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
}, 100);

// Progress bar functionality
const progressBar = document.querySelector(".player-progress");
const progress = document.querySelector(".progress");

function progress_display(e) {
    if(e){
        setInterval(() => {
            if (audio.duration) {
                var musicTimer = (audio.currentTime / audio.duration) * 100;
                progress.style.width = `${musicTimer}%`;
            }
        }, 1000);
    }else{
        return;
    }
}

progressBar.addEventListener("click", (e) => {
    var proBarWidth = progressBar.offsetWidth;
    var clickPosition = (e.offsetX / proBarWidth);
    audio.currentTime = clickPosition * audio.duration;
    progress.style.width = `${clickPosition * 100}%`;
});

function handleMouseSwipe(e) {
    var proBarWidth = progressBar.offsetWidth;
    var swipePosition = (e.clientX - progressBar.getBoundingClientRect().left) / proBarWidth;
    swipePosition = Math.min(Math.max(swipePosition, 0), 1);

    if (isFinite(swipePosition)) {
        audio.currentTime = swipePosition * audio.duration;
        progress.style.width = `${swipePosition * 100}%`;
    }
}

function handleTouchSwipe(e) {
    var proBarWidth = progressBar.offsetWidth;
    var swipePosition = (e.touches[0].clientX - progressBar.getBoundingClientRect().left) / proBarWidth;
    swipePosition = Math.min(Math.max(swipePosition, 0), 1);

    if (isFinite(swipePosition)) {
        audio.currentTime = swipePosition * audio.duration;
        progress.style.width = `${swipePosition * 100}%`;
    }
}

progressBar.addEventListener("mousedown", () => {
    handleswipe(true, 'mouse');
});
progressBar.addEventListener("touchstart", () => {
    handleswipe(true, 'touch');
});

document.addEventListener("mouseup", () => {
    handleswipe(false, 'mouse');
});
document.addEventListener("touchend", () => {
    handleswipe(false, 'touch');
});

function handleswipe(R, type) {
    if (R) {
        if (type === 'mouse') {
            document.addEventListener("mousemove", handleMouseSwipe);
        } else if (type === 'touch') {
            document.addEventListener("touchmove", handleTouchSwipe);
        }
    } else {
        if (type === 'mouse') {
            document.removeEventListener("mousemove", handleMouseSwipe);
        } else if (type === 'touch') {
            document.removeEventListener("touchmove", handleTouchSwipe);
        }
    }
}




// Music list functionality
const musicList = document.querySelector(".music-list");
document.querySelector(".fa-bars").addEventListener("click", () => {
    musicList.classList.add("show");
    musicList.style.height = "300px";
    musicList.style.opacity = 1;
});

document.querySelector(".fa-x").addEventListener("click", () => {
    musicList.classList.remove("show");
    musicList.style.height = "0px";
    musicList.style.opacity = 0;
});

function populateMusic() {
    const musicList = document.querySelector(".music-list ol");
    musicList.innerHTML = "";

    for (var i = 0; i < list.length; i++) {
        ((index) => {
            const ms = new Audio(`./assets/music/${list[index].music}`);
            ms.addEventListener('loadedmetadata', () => {
                var min = Math.floor(ms.duration / 60);
                var sec = Math.floor(ms.duration % 60);

                const listItem = document.createElement("li");
                listItem.innerHTML = ` 
                    <div class="row">
                        <span>${list[index].name}</span>
                        <p>${list[index].auth}</p>
                    </div>
                    <span class="audio-duration">${min}:${sec.toString().padStart(2, '0')}</span>
                `;

                listItem.addEventListener("click", () => {
                    music_current_index = index;
                    play_musicFromlist();
                });

                musicList.appendChild(listItem);
                const hr = document.createElement('hr');
                hr.className = "music-partition";
                musicList.appendChild(hr);
            });
            ms.load();
        })(i);
    }
}
populateMusic();

// Swipe gesture for mobile
const swipe = document.querySelector('.close-tab-div');

muisc_image[1].addEventListener("click", () => {
    if (musicList.classList.contains('show')) {
        musicList.classList.remove("show");
        musicList.style.height = "0px";
        musicList.style.opacity = 0;
    }else{
        return ;
    }
})

if (swipe) {
    let startY = 0;
    const minHeight = 120;
    const maxHeight = 300;
    const baseHeight = 300;

    swipe.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startY = e.touches[0].clientY;
    });

    const throttle = 16; // 60fps
    let lastExecutionTime = 0;

    swipe.addEventListener('touchmove', (e) => {
        const now = Date.now();
        if (now - lastExecutionTime < throttle) return;
        lastExecutionTime = now;
        window.requestAnimationFrame(() => {
            const moveY = e.touches[0].clientY;
            let distance = startY - moveY + baseHeight;

            // Constrain height between min and max
            distance = Math.max(minHeight, Math.min(maxHeight, distance));

            musicList.style.height = distance + 'px';

            // Calculate opacity
            let opacityValue = (distance - minHeight) / (baseHeight - minHeight);
            musicList.style.opacity = Math.max(0, Math.min(1, opacityValue));
        });
    });

    swipe.addEventListener('touchend', () => {
        const computed_height = window.getComputedStyle(musicList).height;
        const computed_height_value = parseFloat(computed_height);
        if (computed_height_value <= 130) {
            musicList.classList.toggle('show');
        } else {
            musicList.style.height = "300px";
            musicList.style.opacity = 1;
        }
    });
} else {
    console.error("Element not found!");
}


