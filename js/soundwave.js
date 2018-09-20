const queue = [];

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

    tracks.forEach((track, i) => {
        queue.push(new SoundCloudTrack(
            track["title"],
            track["stream_url"],
            track["artwork_url"]
        ));
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
    constructor(title, stream, artwork) {
        this.title = title;
        this.stream = stream;
        this.artwork = artwork;
    }
}