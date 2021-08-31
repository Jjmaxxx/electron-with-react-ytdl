const { ipcRenderer } = require("electron");
const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require('ffmpeg-static');
console.log("running");
const cp = require('child_process');
const { contextIsolated } = require("process");


module.exports = {
  createReadableStream: (link)=>{
    return new Promise(resolve=>{
      let getName = async()=> await ytdl.getInfo(link);
      getName().then((info)=>{
        //console.log(info);
        let defaultName = info.videoDetails.title;
        console.log(defaultName);
        let uniqueQuality = new Map();
        let qualities = [];
        info.formats.forEach((element)=>{
          let elementQuality = element.qualityLabel;
          if(element.container == "mp4" && element.hasVideo == true && element.hasAudio == false && !uniqueQuality.has(elementQuality)){
            uniqueQuality.set(elementQuality, elementQuality)
            qualities.push({name:elementQuality, value: element.itag})
          }
        });
        console.log(qualities);
        resolve({name:defaultName, qualityList:qualities});
    });
    })
      
  },
  audioOnly: (url, name)=>{
    let path = "./videos/"+name +".mp3";
    ytdl(url,{filter:"audioonly"}).pipe(fs.createWriteStream(path)).on('finish',()=>{
      // source.setAttribute('src', path);
      // audio.setAttribute('src', source.src);
      // audioContainer.style.display = "block";
      // audioContainer.load();
      // afterGetInfo.style.display = "none";
      // songPlaying.innerHTML = "Now Playing: " + name;
    });
  },
  mergeVideoAudio: (url, name, vidQuality)=>{
    const aud = ytdl(url,{quality:"highestaudio"});
    const vid = ytdl(url, { quality: vidQuality});
    let path = "./videos/"+name +".mp4";
    const ffmpegProcess = cp.spawn(ffmpeg, [
      // Remove ffmpeg's console spamming
      '-loglevel', '8', '-hide_banner',
      // Redirect/Enable progress messages
      '-progress', 'pipe:3',
      // Set inputs
      '-i', 'pipe:4',
      '-i', 'pipe:5',
      // Map audio & video from streams
      '-map', '0:a',
      '-map', '1:v',
      // Keep encoding
      '-c:v', 'copy',
      // Define output file
      path,
    ], {
      windowsHide: true,
      stdio: [
        /* Standard: stdin, stdout, stderr */
        'inherit', 'inherit', 'inherit',
        /* Custom: pipe:3, pipe:4, pipe:5 */
        'pipe', 'pipe', 'pipe',
      ],
    });
    
    //done downloading this runs
    ffmpegProcess.on('close', () => {
      source.setAttribute('src', path);
      video.setAttribute('src', source.src);
      videoContainer.style.display = "block";
      videoContainer.load();
      //video.play();
      //location.reload();
      afterGetInfo.style.display = "none";
      songPlaying.innerHTML = "Now Playing: " + name;
      console.log('done');
    });
    aud.pipe(ffmpegProcess.stdio[4]);
    vid.pipe(ffmpegProcess.stdio[5]);
  }
}
