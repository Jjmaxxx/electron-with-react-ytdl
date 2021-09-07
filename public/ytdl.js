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
  audioOnly: (vid)=>{
    let path = "./src/react/videos/"+vid.name +".mp3";
    // let path = "./public/videos/"+args.name +".mp3";
    console.log(path);
    return new Promise(resolve=>{
      console.log("run");
      ytdl(vid.url,{filter:"audioonly"}).pipe(fs.createWriteStream(path)).on('finish',()=>{
        console.log('finish');
        resolve(path);
      });
    })
  },
  mergeVideoAudio: (vid)=>{
    const audio = ytdl(vid.url,{quality:"highestaudio"});
    const video = ytdl(vid.url, { quality: vid.quality});
    let path = "./src/react/videos/"+vid.name +".mp4";
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
