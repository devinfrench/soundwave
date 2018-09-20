const queue = [];
let player;

ready(() => {
    SC.initialize({
        client_id: "f06b9e9a56aa303794319cbeb8e12c7d"
    });

    let search = document.getElementById("search");
    search.addEventListener("submit", (e) => {
        e.preventDefault();
        fetchTracks(document.getElementById("genre").value).then((tracks) => {
            if (!tracks) return;

            populateQueue(tracks);

            initPlayer();
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

    let fastForward = document.getElementById("next-song");
    fastForward.addEventListener("click", (e) => {
        e.preventDefault();
        nextSong();
    });
});

function populateQueue(tracks) {
    queue.splice(0, queue.length);

    tracks.forEach((track) => {
        queue.push(track);
    });
}

function initPlayer() {
    if (queue.length == 0 || !queue[0].id) return;

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
    let titles = Array.from(document.getElementsByClassName("current-title"));
    titles.forEach((title) => {
        title.innerText = track.title;
    });
    document.getElementById("current-artwork").src = track.artwork.replace("-large.", "-badge.");
    document.getElementById("current-artwork-cover").src = track.artwork.replace("-large.", "-crop.");
}

function nextSong() {
    queue.shift();
    initPlayer();
}

function updateTime(player) {
    let time = player.currentTime() / 1000;
    let min = Math.floor(time / 60);
    let sec = (Math.floor(time % 60) < 10 ? "0" : "") + Math.floor(time % 60);
    document.getElementById("current-time").innerText = min + ":" + sec;
    document.getElementById("progress").style.width = player.currentTime() / player.getDuration() * 100 + "%";
}

function fetchTracks(genre) {
    return new Promise((resolve, reject) => {
        tracks = [];
        let url = new URL("https://api-v2.soundcloud.com/charts");
        let params = {
            kind: "top",
            genre: "soundcloud:genres:" + genre,
            region: "soundcloud:regions:US",
            high_tier_only: "false",
            client_id: "f06b9e9a56aa303794319cbeb8e12c7d",
            limit: "50",
            offset: "0",
            linked_partitioning: "1"
        };
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        fetch(url).then((response) => {
            return response.json();
        }).then((chart) => {
            chart["collection"].forEach((track) => {
                if (track.track.streamable == true) {
                    tracks.push(new SoundCloudTrack(
                        track.track.id,
                        track.track.title,
                        track.track.artwork_url
                    ));
                }
            })
            resolve(tracks)
        });
    });
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