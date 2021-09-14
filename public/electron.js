const path = require('path');
const fs = require('fs');
const {ipcRenderer, ipcMain, app, BrowserWindow} = require('electron');
const isDev = require('electron-is-dev');
const ytdl = require("./ytdl.js");
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
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
  folderPath = path.join(__dirname,folderPath);
  let folders = [];
  let findPath = async ()=>{
    fs.readdirSync(folderPath).forEach(file =>{
      folders.push(file);
    });
    console.log(folders);
  }
  await findPath();
  event.reply('gotFolders', folders);
})
ipcMain.on('sent-link', async(event, arg)=>{
  console.log(arg)
  let videoData = await ytdl.createReadableStream(arg);
  event.reply('vid-info', videoData);
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