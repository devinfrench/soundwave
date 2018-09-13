// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ElectronTitlebarWindows = require("electron-titlebar-windows");
const {
    remote
} = require("electron");

const titlebar = new ElectronTitlebarWindows({
    backgroundColor: "#252A38",
    darkMode: true,
    draggable: true
});

titlebar.appendTo(document.getElementById("titlebar"));

titlebar.on("close", () => {
    remote.getCurrentWindow().close();
});

titlebar.on("fullscreen", () => {
    remote.getCurrentWindow().maximize();
});

titlebar.on("minimize", () => {
    remote.getCurrentWindow().minimize();
});

titlebar.on("maximize", () => {
    win = remote.getCurrentWindow();
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
});