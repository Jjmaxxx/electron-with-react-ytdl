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
  }
  await findPath();
  event.reply('gotFolders', folders);
})
ipcMain.on("getFiles", async(event, folderName)=>{
  folderName = path.join(downloadFolder, folderName);
  let getFiles = new Promise(resolve=>{
    let files = [];
    let num = 0;
    let folderFiles = fs.readdirSync(folderName);
    console.log(folderFiles)
    if(!folderFiles.length){
      console.log("no files")
      event.reply('gotFiles', null);
    }
    folderFiles.forEach(async (file, index, array) =>{
      //index doesnt work because it will keep adding before getaudioduration is fully done
      let filePath = path.join(folderName,file)
      await getAudioDurationInSeconds(filePath).then((duration) => {
        num+=1;
        files.push([file,duration,fs.statSync(filePath).birthtimeMs]);
        if(num === array.length){
          resolve(files);
        }
      }); 
    });
  }).catch((error) => {
    console.error(error);
  });
  getFiles.then((data)=>{
    let sortFiles = new Promise(resolve=>{
      resolve(
        data.sort((a,b)=>{
          return(b[2] - a[2]);
        })
      )
    }).catch((error) => {
      console.error(error);
    });
    sortFiles.then((data)=>{
      console.log(data);
      event.reply('gotFiles', data);
    })
    //console.log(data);
  })
  // console.log(files)
  // event.reply('gotFiles', files);
})
ipcMain.on('sent-link', async(event, arg)=>{
  let videoData = await ytdl.createReadableStream(arg);
  event.reply('vid-info', videoData);
})
ipcMain.on('createFolder', (event, folderName)=>{
  let folder = path.join(downloadFolder,folderName);
  fs.ensureDirSync(folder);
  win.webContents.send('newFolder');
})
ipcMain.on('download', async(event,args)=>{
  let done;
  if(args.fileType === "mp3"){
    done = await ytdl.audioOnly(args);
  }
  else{
    done = await ytdl.mergeVideoAudio(args);
  }
  console.log('a')
  //event.reply('')
})
ipcMain.on('moveFile', async(event, args)=>{
  let filePath = path.join(downloadFolder,args.fileFolder);
  filePath= path.join(filePath, args.file);
  let targetFolder = path.join(downloadFolder, args.targetFolder);
  targetFolder = path.join(targetFolder,args.file);
  console.log("targetFolder: "+ targetFolder);
  console.log("filePath: " + filePath);
  fs.rename(filePath, targetFolder, (err)=> {
    if (err) throw err;
    console.log('moved');
    event.reply('fileMoved',args.file);
  })
})
ipcMain.on('renameFile', async(event, args)=>{
  let filePath = path.join(downloadFolder,args.fileFolder);
  console.log(path.join(filePath,args.file[0]));
  console.log(path.join(filePath,args.newName))
  fs.rename(path.join(filePath,args.file[0]), path.join(filePath,args.newName) +  ".mp3", (err)=> {
    if (err) throw err;
    console.log('renamed');
    event.reply('fileRenamed',{prevName:args.file, newName:args.newName});
  })
})
ipcMain.on('deleteFile', async(event, args)=>{
  console.log(args);
  let file = path.join(downloadFolder,args.path);
  file= path.join(file, args.file);
  console.log(file);
  fs.unlink(file, function(err) {
    if(err && err.code == 'ENOENT') {
      console.info("file doesn't exist");
    }else if(err) {
      console.error("error when trying to remove file");
    }else {
      console.info('removed');
      event.reply('deletedFile',args.file);
    }
});
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