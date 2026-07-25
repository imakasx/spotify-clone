let currentsong = new Audio
let songs;
let currFolder;

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
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
        for (let i = 0; i < as.length; i++) {
            const element = as[i];
            if (element.href.endsWith(".m4a")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
            }
        }

    let songul = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    songul.innerHTML = "";
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                            <img class="invert s" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>akash</div>
                            </div>
                            <div class="playnow">
                                <span>play now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div></li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click" ,element =>{
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    });

}

const playmusic = (track, pause = false) => {
    currentsong.src = `/${currFolder}/`+ track
    if(!pause){
        currentsong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00/00:00"
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let ancor =div.getElementsByTagName("a")
    Array.from(ancor).forEach(e=>{
        if(e.href.includes("/songs")){
            console.log(e.href.split("/").slice(-1)[0])
        }
    })  
}




async function main(){
    await getSongs("songs/op");
    // console.log(songs)
    playmusic(songs[0], true)
    displayAlbums()

    play.addEventListener("click", ()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src ="img/pause.svg"
            
        }else{
            currentsong.pause();
            play.src = "img/play.svg"
        }
    })

    currentsong.addEventListener("timeupdate", () =>{
        // console.log(currentsong.currentTime, currentsong.duration)        
        document.querySelector(".songTime").innerHTML =`
        ${secondsToMinutesSeconds(currentsong.currentTime)}/
        ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration)*100 + "%";
    })


    document.querySelector(".seekbar").addEventListener("click",e=>{
        let precent = (e.offsetX / e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = precent + "%";
        currentsong.currentTime = ((currentsong.duration) * precent)/100
    })

    document.querySelector(".hamburgerContainer").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0%"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })

    previous.addEventListener("click" , ()=>{
        currentsong.pause()
        let index =songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index - 1) >= 0){
            playmusic(songs[index - 1])
        }
    })
    
    next.addEventListener("click" , ()=>{
        currentsong.pause()
        let index =songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index + 1) < songs.length){
            playmusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].
    addEventListener("change" ,(e)=>{
        console.log(e.target, e.target.value);
        // currentsong.volume = e.target.value/100
        currentsong.volume = parseInt(e.target.value)/100
    })



    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            // console.log(songs)
        })
    })
}
main()
