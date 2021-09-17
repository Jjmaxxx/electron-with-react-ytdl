const path = require('path');
const fs = require('fs-extra')
const {ipcRenderer, ipcMain, app, BrowserWindow} = require('electron');
const isDev = require('electron-is-dev');
const ytdl = require("./ytdl.js");
const { getAudioDurationInSeconds } = require('get-audio-duration');
let win, downloadFolder;
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js")
    },
  });
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  win.webContents.send("asynchronous-message",{});
}
app.whenReady().then(()=>{
  createWindow();
  app.on("activate",()=>{
      if(BrowserWindow.getAllWindows().length == 0){
          createWindow();
      }
  })
})
ipcMain.on('getFolders', async(event,folderPath)=>{
  downloadFolder = path.join(__dirname,folderPath);
  let folders = [];
  let findPath = async ()=>{
    fs.readdirSync(downloadFolder).forEach(file =>{
      folders.push(file);
    });
    console.log(folders);
  }
  await findPath();
  event.reply('gotFolders', folders);
})
ipcMain.on("getFiles", async(event, folderName)=>{
  folderName = path.join(downloadFolder, folderName);
  let getFiles = new Promise(resolve=>{
    let files = [];
    let num = 0;
    fs.readdirSync(folderName).forEach(async (file, index, array) =>{
      //index doesnt work because it will keep adding before getaudioduration is fully done
      let filePath = path.join(folderName,file)
      await getAudioDurationInSeconds(filePath).then((duration) => {
        num+=1;
        files.push([file,duration]);
        if(num === array.length){
          console.log('done');
          resolve(files);
        }
      }); 
    });
  })
  getFiles.then((data)=>{
    event.reply('gotFiles', data);
  })
  // console.log(files)
  // event.reply('gotFiles', files);
})
ipcMain.on('sent-link', async(event, arg)=>{
  console.log(arg)
  let videoData = await ytdl.createReadableStream(arg);
  event.reply('vid-info', videoData);
})
ipcMain.on('createFolder', (event, folderName)=>{
  let folder = path.join(downloadFolder,folderName);
  fs.ensureDirSync(folder);
  win.webContents.send('newFolder');
})
ipcMain.on('download', async(event,args)=>{
  console.log(args);
  if(args.fileType === "mp3"){
    let done = await ytdl.audioOnly(args);
    console.log(done);
  }
  else{
    let done = await ytdl.mergeVideoAudio(args);
    console.log(done);
  }
})
// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.returnValue = 'pong'
// })
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

module.exports.ipcRenderer = ipcRenderer;