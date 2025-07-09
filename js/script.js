console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs = []; // Initialize songs as an empty array
let currFolder;

// Mock API data - In a real application, this would come from a server
const mockApiData = {
    "songs/ncs": [
        { title: "Song 1 (NCS)", artist: "Artist A", url: "songs/ncs/song1.mp3" },
        { title: "Song 2 (NCS)", artist: "Artist B", url: "songs/ncs/song2.mp3" },
        { title: "Song 3 (NCS)", artist: "Artist C", url: "songs/ncs/song3.mp3" }
    ],
    "songs/hindi": [
        { title: "Hindi Song 1", artist: "Hindi Artist X", url: "songs/hindi/hindi_song1.mp3" },
        { title: "Hindi Song 2", artist: "Hindi Artist Y", url: "songs/hindi/hindi_song2.mp3" }
    ],
    "songs/english": [
        { title: "English Track 1", artist: "English Artist P", url: "songs/english/english_track1.mp3" },
        { title: "English Track 2", artist: "English Artist Q", url: "songs/english/english_track2.mp3" }
    ]
};

const mockAlbumInfo = {
    "ncs": { title: "NCS Mix", description: "Non-Copyrighted Sounds for your focus." },
    "hindi": { title: "Bollywood Hits", description: "Latest and greatest Hindi songs." },
    "english": { title: "Pop Anthems", description: "Chart-topping English tracks." }
};


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    // Simulate API call
    return new Promise(resolve => {
        setTimeout(() => {
            if (mockApiData[folder]) {
                songs = mockApiData[folder];
                // Show all the songs in the playlist
                let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
                songUL.innerHTML = "";
                songs.forEach(song => {
                    songUL.innerHTML += `<li><img class="invert" width="34" src="img/music.svg" alt="">
                                <div class="info">
                                    <div> ${song.title}</div>
                                    <div>${song.artist}</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="img/play.svg" alt="">
                                </div> </li>`;
                });

                // Attach an event listener to each song
                Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
                    e.addEventListener("click", () => {
                        playMusic(songs[index]); // Pass the full song object
                    });
                });
                resolve(songs);
            } else {
                console.error("Folder not found in mock API data:", folder);
                resolve([]);
            }
        }, 500); // Simulate network delay
    });
}

const playMusic = (song, pause = false) => {
    // Check if song object is valid
    if (!song || !song.url) {
        console.error("Invalid song object provided to playMusic:", song);
        return;
    }
    currentSong.src = song.url; // Use the URL from the song object
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = `${song.title} - ${song.artist}`;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
    console.log("displaying albums");
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = ""; // Clear existing cards

    // Simulate fetching album info
    return new Promise(resolve => {
        setTimeout(() => {
            for (const folder in mockAlbumInfo) {
                const info = mockAlbumInfo[folder];
                cardContainer.innerHTML += ` <div data-folder="${folder}" class="card">
                    <div class="play">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <img src="https://placehold.co/200x200/000000/FFFFFF?text=${folder.toUpperCase()}" alt="Album Cover">
                    <h2>${info.title}</h2>
                    <p>${info.description}</p>
                </div>`;
            }

            // Load the playlist whenever card is clicked
            Array.from(document.getElementsByClassName("card")).forEach(e => {
                e.addEventListener("click", async item => {
                    console.log("Fetching Songs for folder:", item.currentTarget.dataset.folder);
                    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
                    if (songs.length > 0) {
                        playMusic(songs[0]); // Play the first song from the fetched list
                    } else {
                        console.warn("No songs found for this album.");
                    }
                });
            });
            resolve();
        }, 500); // Simulate network delay
    });
}

async function main() {
    // Get the list of all the songs for a default folder
    await getSongs("songs/ncs");
    if (songs.length > 0) {
        playMusic(songs[0], true); // Play the first song, paused initially
    } else {
        console.warn("No songs loaded initially.");
    }

    // Display all the albums on the page
    await displayAlbums();


    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        if (currentSong.duration > 0) {
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    });

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        if (songs.length === 0) return; // No songs to play
        let currentSongIndex = songs.findIndex(song => currentSong.src.includes(song.url));
        if (currentSongIndex === -1) { // If current song not found in list, default to first
            playMusic(songs[0]);
            return;
        }
        let newIndex = currentSongIndex - 1;
        if (newIndex >= 0) {
            playMusic(songs[newIndex]);
        } else {
            // Optionally loop to the end or stop
            playMusic(songs[songs.length - 1]); // Loop to last song
        }
    });

    // Add an event listener to next
    next.addEventListener("click", () => {
        if (songs.length === 0) return; // No songs to play
        let currentSongIndex = songs.findIndex(song => currentSong.src.includes(song.url));
        if (currentSongIndex === -1) { // If current song not found in list, default to first
            playMusic(songs[0]);
            return;
        }
        let newIndex = currentSongIndex + 1;
        if (newIndex < songs.length) {
            playMusic(songs[newIndex]);
        } else {
            // Optionally loop to the beginning or stop
            playMusic(songs[0]); // Loop to first song
        }
    });

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        } else {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("volume.svg", "mute.svg");
        }
    });

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .10; // Set a default volume when unmuting
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    });
}

main();
