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
    return songs;

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
    let cardcontainer = document.querySelector(".cardcontainer");
    let array = Array.from(ancor);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        // console.log(e)
        
    
        if(e.href.includes("/songs/")){
            let folder = e.href.split("/").slice(-1)[0];
            // console.log(folder);
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/input.json`);
            let response = await a.json();
            // console.log(response);

            cardcontainer.innerHTML = cardcontainer.innerHTML + ` <div data-folder=${folder} class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none">
                                <!-- Green Circle -->
                                <circle cx="24" cy="24" r="22" fill="#22C55E" />
                            
                                <!-- Play Icon -->
                                <path
                                    d="M30.8906 24.846C30.5371 26.189 28.8667 27.138 25.5257 29.0361C22.296 30.8709 20.6812 31.7884 19.3798 31.4196C18.8418 31.2671 18.3516 30.9776 17.9562 30.5787C17 29.6139 17 27.7426 17 24C17 20.2574 17 18.3861 17.9562 17.4213C18.3516 17.0224 18.8418 16.7329 19.3798 16.5804C20.6812 16.2116 22.296 17.1291 25.5257 18.9639C28.8667 20.862 30.5371 21.811 30.8906 23.154C31.0365 23.7084 31.0365 24.2916 30.8906 24.846Z";
                                    fill="none" stroke="#000000" stroke-width="2" stroke-linejoin="round" />
                            </svg>
                        </div>  
                        <img src= "/songs/${folder}/cover.jpg" alt="">
                        <h1>${response.title}</h1>
                        <p>${response.description}</p>
                    </div>`
        }
    } 
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            // console.log(songs)

            playmusic(songs[0])
        })
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
        // console.log(e.target, e.target.value);
        // currentsong.volume = e.target.value/100
        currentsong.volume = parseInt(e.target.value)/100
    })

    document.querySelector(".volume>img").addEventListener("click", e=>{
        // console.log(e.target.src)
        if(e.target.src.includes("img/volume.svg")){
            // console.log("mute")
            e.target.src = e.target.src.replace("img/volume.svg","img/mute.svg") 
            currentsong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }else{
            e.target.src = e.target.src.replace("img/mute.svg","img/volume.svg") 
            currentsong.volume = 0.10
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10

        }
    })




}
main()
