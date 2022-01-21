import React from "react";
//import ReactDOM from 'react-dom';
// import VideoText from './videoText.js';
import Player from './Player.js';
import YoutubeDownload from "./YoutubeDownload.js";
import Playlist from "./Playlist.js";
//import CreateFolderForm from './CreateFolderForm.js';
import styles from './utils/styles.js';
import theme from './utils/appTheme.js';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Divider, List, ListItem, ListItemIcon, ListItemText, Drawer } from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import AddIcon from '@mui/icons-material/Add';
import CreateFolderForm from "./CreateFolderForm.js";
//import ResizeableInput from './ResizeableInput.js';
//import { NativeSelect, MenuList, MenuItem } from '@mui/material';
const { ipcRenderer } = window.require("electron");
const downloadFolder = './videos/';
export let windowDimensions;
class App extends React.Component{ 
  constructor(props){
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state = {
      width:window.innerWidth, 
      height:window.innerHeight,
      linkSubmitted:false, 
      fileName:"", 
      fileType:"mp3",
      foldersList:["null"],
      page:"downloader",
      fileIndex:null,
      filesList:[],
      selectedFile:""
    };
    //this.state = {variable:'some value'}
  }
  componentDidMount() {
    this.getFoldersList(downloadFolder);
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    ipcRenderer.on('newFolder',(event)=>{
      this.getFoldersList(downloadFolder);
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    windowDimensions = {width: window.innerWidth, height: window.innerHeight}
  }
  getFoldersList=(path)=>{
    ipcRenderer.send('getFolders', path);
    ipcRenderer.on('gotFolders',(event,folders)=>{
      this.setState({foldersList:folders});
    })
  }
  handlePlaylistSelect=(event,folderName)=>{
    this.setState({page:folderName});
  }
  handleDownloadSelect=(event)=>{
    this.setState({page:"downloader"});
  }
  handleFileSelect=(data)=>{
    this.setState({fileIndex:data[1]});
    this.setState({filesList:data[0]});
  }
  handleNewSelectedFile=(data)=>{
    this.setState({selectedFile:data});
  }
  downloadingVideo=(data)=>{
    ipcRenderer.send('download', data);
  }
  render(){
    const classes = styles;
    return (
      //App
      //, backgroundColor:"#222831"}
      <div className="App" style={{height:"100%",overflow: "hidden"}}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <div color="primary" style= {classes.root} >
            <Drawer 
              style = {classes.drawer}
              variant = "permanent" 
              anchor="left"
            >
              <List>
                <ListItem button onClick={this.handleDownloadSelect}>
                  <ListItemIcon>
                    <GetAppIcon fontSize="large" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={"Download"}/>
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <AddIcon fontSize="large" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={"Import"}/>
                </ListItem>
              </List>
              <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                <div style={{color:"#007d85", fontSize:"17px"}}>Playlists</div>
                  <CreateFolderForm/>
              </div>
              <Divider style={{backgroundColor:"#007d85"}}/>
                {/* playlist list */}
                <List style={{width:"200px",textOverflow: "ellipsis",  whiteSpace: "nowrap",overflow: "hidden"}}>
                {
                  this.state.foldersList.map((text) => (
                    <ListItem button key={text} onClick={(event)=>{this.handlePlaylistSelect(event, text)}}>
                      <ListItemText primary={text} />
                    </ListItem>
                  ))
                }
                </List>
              <Divider style={{backgroundColor:"#007d85"}}/>
              {/* <div style={{width:"180px"}}>
                <p style = {classes.drawerTabs}>youtube download</p>
                <p style = {classes.drawerTabs}>downloads</p>
              </div> */}
            </Drawer>
            <Player key = {this.state.filesList} sendFileToParent = {this.handleNewSelectedFile} index = {this.state.fileIndex} filesList ={this.state.filesList} filePath={downloadFolder+this.state.page+"/"}/>
          </div>
          {(()=>{
            let component;
            // console.log(this.state.page);
            if(this.state.page === "downloader"){
              component = <YoutubeDownload downloadVideo = {this.downloadingVideo}/>;
            }else{
              component = <Playlist appHeight = {this.state.height} selectedFile = {this.state.selectedFile} sendFileToParent = {this.handleFileSelect} key= {this.state.page} path={this.state.page}/>
            }
            return(
              component
            )
          })()}
        </ThemeProvider>
      </div>
    );
  }
}
export default App;

