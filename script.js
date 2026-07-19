async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
        for (let i = 0; i < as.length; i++) {
            const element = as[i];
            if (element.href.endsWith(".m4a")) {
            songs.push(element.href.split('/songs/')[1]);
            }
        }
        return songs;
}
async function main(){
    let songs = await getSongs();
    console.log(songs)
    let songul = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>${song.replaceAll("%20", " ")}</li>` 
    }

    let audio = new Audio(songs[0])
    // audio.play();
}
main()
