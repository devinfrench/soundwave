const queue = [];
let player;

ready(() => {
    SC.initialize({
        client_id: "f06b9e9a56aa303794319cbeb8e12c7d"
    });

    let search = document.getElementById("search");
    search.addEventListener("submit", (e) => {
        e.preventDefault();
        SC.get("/tracks", {
            genres: document.getElementById("genre").value,
            duration: {
                from: 60000
            }
        }).then((tracks) => {
            initPlayer(tracks);
        });
    });

    let playPauseToggle = document.getElementById("play-pause-toggle");
    playPauseToggle.addEventListener("click", (e) => {
        e.preventDefault();
        if (player && !player.isDead()) {
            if (player.isPlaying()) {
                player.pause();
            } else {
                player.play();
            }
        }
    });
});

function initPlayer(tracks) {
    if (!tracks) return;

    queue.splice(0, queue.length);

    tracks.forEach((track) => {
        queue.push(new SoundCloudTrack(
            track["id"],
            track["title"],
            track["artwork_url"]
        ));
    });

    SC.stream(`/tracks/${queue[0].id}`).then((scPlayer) => {
        player = scPlayer;
        player.on("pause", () => {
            togglePause()
        });
        player.on("play", () => {
            togglePlay()
        });
        player.on("play-start", () => {
            updateTrackInfo(queue[0])
        });
        player.on("finish", () => {
            nextSong()
        });
        player.on("time", () => {
            updateTime(player)
        });
        player.play();
    });
}

function togglePlay() {
    let toggle = document.getElementsByClassName("fa-play")[0];
    if (toggle) {
        toggle.classList.remove("fa-play");
        if (!toggle.classList.contains("fa-pause")) {
            toggle.classList.add("fa-pause");
        }
    }
}

function togglePause() {
    let toggle = document.getElementsByClassName("fa-pause")[0];
    if (toggle) {
        toggle.classList.remove("fa-pause");
        if (!toggle.classList.contains("fa-play")) {
            toggle.classList.add("fa-play");
        }
    }
}

function updateTrackInfo(track) {
    document.getElementById("current-title").innerText = track.title;
    document.getElementById("current-artwork").src = track.artwork;
}

function nextSong() {

}

function updateTime(player) {
    let time = player.currentTime() / 1000;
    let min = Math.floor(time / 60);
    let sec = (Math.floor(time % 60) < 10 ? '0' : '') + Math.floor(time % 60);
    document.getElementById("current-time").innerText = min + ":" + sec;
    document.getElementById("progress").style.width = player.currentTime() / player.getDuration() * 100 + "%";
}

function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

class SoundCloudTrack {
    constructor(id, title, artwork) {
        this.id = id;
        this.title = title;
        this.artwork = artwork;
    }
}