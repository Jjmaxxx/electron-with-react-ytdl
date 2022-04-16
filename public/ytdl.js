const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require('ffmpeg-static');
const cp = require('child_process');
const { contextIsolated } = require("process");

let vidInfo;
let downloadedChunks=0;
module.exports = {
  createReadableStream: (link)=>{
    return new Promise(resolve=>{
      let getName = async()=> await ytdl.getInfo(link);
      getName().then((info)=>{
        //console.log(info);
        let defaultName = info.videoDetails.title;
        let uniqueQuality = new Map();
        let qualities = [];
        info.formats.forEach((element)=>{
          let elementQuality = element.qualityLabel;
          if(element.container == "mp4" && element.hasVideo == true && element.hasAudio == false && !uniqueQuality.has(elementQuality)){
            uniqueQuality.set(elementQuality, elementQuality)
            qualities.push({name:elementQuality, value: element.itag})
          }
        });
        //console.log(qualities);
        vidInfo = info;
        resolve({name:defaultName, qualityList:qualities});
    });
    })  
  },
  audioOnly: (args)=>{
    // let path = "./src/react/videos/"+vid.name +".mp3";
    let path = "./public/videos/downloads/"+args.vid.name +".mp3";
    return new Promise(resolve=>{
      ytdl(args.vid.url,{filter:"audioonly"}).on('progress',(_,totalDownloaded,total)=>{
        downloadedChunks++;
        if(downloadedChunks%30==0){
          console.log(args.vid.name + ": " +(totalDownloaded/total)*100 + "%");
          args.win.webContents.send('loadingBar',{name: args.vid.name + ": ", progress: (totalDownloaded/total)*100});
        }
      }).pipe(fs.createWriteStream(path)).on('finish',()=>{
        downloadedChunks = 0;
        args.win.webContents.send('loadingBar',{name: args.vid.name + ": ", progress: 100});
        resolve(path);
      })
    })
  },
  mergeVideoAudio: (vid)=>{
    const audio = ytdl(vid.url,{quality:"highestaudio"});
    const video = ytdl(vid.url, { quality: vid.quality});
    let path = "./public/videos/downloads/"+vid.name +".mp4";
    return new Promise(resolve=>{
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
        resolve(path);
      })
      audio.pipe(ffmpegProcess.stdio[4]);
      video.pipe(ffmpegProcess.stdio[5]);
    })
  }
}
