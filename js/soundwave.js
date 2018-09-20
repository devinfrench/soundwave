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
            addTracksToQueue(tracks);
        });
    })
});

function addTracksToQueue(tracks) {
    if (!tracks) return;

    tracks.forEach((track) => {
        queue.push(new SoundCloudTrack(
            track["id"],
            track["title"],
            track["artwork_url"]
        ));
    });
    togglePlayPause();
}

function togglePlayPause() {
    if ((!player || player.isDead()) && queue.length == 0) return;

    if (!player && queue.length > 0) {
        SC.stream(`/tracks/${queue[0].id}`).then((stream) => {
            player = stream;
            play();
        });
    }
}

function play() {
    let toggle = document.getElementById("play-pause-toggle");
    toggle.classList.remove("fa-play");
    if (!toggle.classList.contains("fa-pause")) {
        toggle.classList.add("fa-pause");
    }
    player.play();
}

function pause() {
    let toggle = document.getElementById("play-pause-toggle");
    toggle.classList.remove("fa-pause");
    if (!toggle.classList.contains("fa-play")) {
        toggle.classList.add("fa-play");
    }
    player.pause();
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