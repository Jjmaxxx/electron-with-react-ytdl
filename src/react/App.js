import React from "react";
//import ReactDOM from 'react-dom';
// import VideoText from './videoText.js';
import Player from './Player.js';
import helperFunctions from './utils/helperFunctions.js';
import styles from './utils/styles.js';
import theme from './utils/appTheme.js';
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Divider, List, ListItem, ListItemIcon, ListItemText, Button, Drawer, TextField } from "@material-ui/core";
import GetAppIcon from '@material-ui/icons/GetApp';
import FolderIcon from '@material-ui/icons/Folder';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
//import ResizeableInput from './ResizeableInput.js';
//import { NativeSelect, MenuList, MenuItem } from '@material-ui/core';
const { ipcRenderer } = window.require("electron");
const downloadFolder = './videos/';
let qualities,link;
export let windowDimensions;
let selections = new Map();
class App extends React.Component{ 
  constructor(props){
    super(props);
    this.linkSubmit = this.linkSubmit.bind(this);
    this.changeOption = this.changeOption.bind(this);
    this.download = this.download.bind(this);
    this.getName = this.getName.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state = {
      width:window.innerWidth, 
      height:window.innerHeight,
      linkSubmitted:false, 
      fileName:"", 
      fileType:"mp3",
      foldersList:["null"]
    };
    //this.state = {variable:'some value'}
  }
  componentDidMount() {
    this.getFoldersList(downloadFolder);
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    windowDimensions = {width: window.innerWidth, height: window.innerHeight}
  }
  linkSubmit = (event) => {
    event.preventDefault();
    link=event.target[0].value;
    ipcRenderer.send('sent-link', link);
    ipcRenderer.on('vid-info', (event, vid) => {
      this.setState({fileName:vid.name});
      qualities = vid.qualityList;
      selections.set("quality", vid.qualityList[0].value);
      selections.set("mp3ormp4", "mp3");
      this.setState({linkSubmitted:true});
    })
  }
  changeOption= (event,args)=>{
    selections.set(args,event.target.value);
    if(args === "mp3ormp4"){
      this.setState({fileType:event.target.value});
    }
  }
  getName=(event)=>{
    this.setState({fileName:event.target.value});
  }
  download=()=>{
    ipcRenderer.send('download', {fileType:selections.get('mp3ormp4'), name: this.state.fileName, url: link, quality:selections.get('quality')});
    console.log(selections.get('quality'));
    console.log(selections.get('mp3ormp4'));
  }
  getFoldersList=(path)=>{
    ipcRenderer.send('getFolders', path);
    ipcRenderer.on('gotFolders',(event,folders)=>{
      this.setState({foldersList:folders});
    })
    // this.setState({foldersList:folders});
    // console.log(this.state.foldersList);
    // console.log('run second');
    // return ["a","b"]
  }
  render(){
    const classes = styles;
    return (
      //App
      //, backgroundColor:"#222831"}
      <div className="App" style={{height:"90vh"}}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline/>
          <div color="primary" style= {classes.root} >
            <Drawer 
              style = {classes.drawer}
              variant = "permanent" 
              anchor="left"
            >
              <List>
                <ListItem button>
                  <ListItemIcon><GetAppIcon color="primary" /></ListItemIcon>
                  <ListItemText primary={"Download"}/>
                </ListItem>
                <ListItem button>
                  <ListItemIcon><CreateNewFolderIcon color="primary" /></ListItemIcon>
                  <ListItemText primary={"Playlists"}/>
                </ListItem>
              </List>
              <Divider style={{backgroundColor:"#007d85"}}/>
                {/* playlist list */}
                <List style={{width:"200px"}}>
                {
                  this.state.foldersList.map((text) => (
                    <ListItem button key={text}>
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
            <Player/>
          </div>
        <div style={classes.contentContainer}>
          <div style={classes.content}>
            <div style={classes.contentInputCenter}>
              <form onSubmit={this.linkSubmit}>
                {/* <label htmlFor="youtubeForm">Insert youtube url:</label> */}
                <TextField id="standard-basic" color ="secondary" label="Insert Youtube URL" />
                <Button style={{top:"12px",left:"5px"}}variant="contained" color="primary" type="submit">Submit</Button>
              </form>
            </div>
              {(()=>{
                if(this.state.linkSubmitted === true ){
                  return(
                    <div>
                      <div style={classes.contentInputCenter}>
                        <TextField
                          label="Title"
                          id="outlined-size-small"
                          defaultValue="Small"
                          variant="outlined"
                          size="small"
                          color="secondary"
                          value={this.state.fileName} 
                          style={{top:"10px", width: `${(8*this.state.fileName.length)+20}px`}}
                          onChange = {this.getName}
                        />
                        <div/>
                        <div style={classes.contentCenter}>
                          <TextField
                            label="FileType"
                            //style={{width: `${(8*this.state.fileType.length) + 100}px`, top:"20px"}}
                            style={{minWidth:10, top:"20px"}}
                            id="outlined-select-currency-native"
                            select
                            color="secondary"
                            onChange= {(e)=>{this.changeOption(e,"mp3ormp4")}}
                            SelectProps={{
                              native: true,
                            }}
                            size="small"
                            // helperText="Select Type"
                            variant="outlined"
                          >
                            {helperFunctions.setOptions([{name:"mp3",value:"mp3"},{name:"mp4",value:"mp4"}])}
                          </TextField>
                          {this.state.fileType==="mp4" &&
                            <TextField
                              label="Quality"
                              style={{minWidth:10, top:"20px"}}
                              id="outlined-select-currency-native"
                              select
                              color="secondary"
                              onChange= {(e)=>{this.changeOption(e,"quality")}}
                              SelectProps={{
                                native: true,
                              }}
                              size="small"
                              // helperText="Select Type"
                              variant="outlined"
                            >
                              {helperFunctions.setOptions(qualities)}
                            </TextField> 
                          }
                          {/* <Dropdown options={[]}/>
                          <Dropdown options={qualities}/> */}
                          <Button style={{top:"18px",left:"4px"}}onClick={this.download} variant="contained" color="primary">Done</Button>
                        </div>
                      </div>
                    </div>
                  )
                }
              })()}      
            </div> 
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
export default App;

