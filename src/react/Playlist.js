import React from "react";
import styles from './utils/styles.js';
import helperFunctions from './utils/helperFunctions.js';
import { Alert, Button, Divider, Dialog, DialogTitle, CircularProgress, TextField, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
const { ipcRenderer } = window.require("electron");
let fileToBeMoved;
class Playlist extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            playlist:[],
            loading:true,
            selectedFile:null,
            playing:false,
            openFileOptionsMenu:false,
            fileMoreAnchorEl:null,
            songListHeight:"0px",
            indexFile:null,
            openMoveFileDialog:false,
            openRenameFileDialog:false,
            numberOfSongs:0,
            empty:null,
            renameName:"",
            titleError:false
        }
    }
    componentDidMount(){
        ipcRenderer.send("getFiles",this.props.path);
        ipcRenderer.on('gotFiles',(event,files)=>{
            if(files == null){
                this.setState({empty:true});
            }else{
                this.setState({playlist:files},()=>{
                    // console.log(this.state.playlist);
                    this.setState({numberOfSongs:this.state.playlist.length})
                });
            }
            this.setState({loading:false});
        })
        // console.log(this.props.folders);
    }
    componentWillUnmount(){
        ipcRenderer.removeAllListeners("gotFiles");
    }
    static getDerivedStateFromProps(props,state){
        if(props.selectedFile !== null){
            return{
                songListHeight:(props.appHeight - 357) + "px",
                selectedFile:props.selectedFile
            }
        }else{
            return{
                songListHeight:(props.appHeight - 357) + "px",
            }
        }
        //this.setState({songListHeight:props.appHeight + "px"});
    }
    handleFileClick = (event,file, index)=>{
        this.props.sendFileToParent([this.state.playlist,index]);
        this.setState({playing:true});
        this.setState({selectedFile:file},()=>{
            // console.log(this.state.selectedFile);
        });
    }
    moreFileOptionsButton = (event,index)=>{
        if(this.state.openFileOptionsMenu){
            this.setState({openFileOptionsMenu: false});
        }else{
            this.setState({openFileOptionsMenu: true});
        }
        this.setState({indexFile:index});
        this.setState({fileMoreAnchorEl:event.currentTarget});
    }
    moveFile = (event, folder)=>{
        let currPlaylist = Array.from(this.state.playlist);
        ipcRenderer.send("moveFile",{file:fileToBeMoved[0], fileFolder: this.props.path,targetFolder:folder});
        this.closeDialog();
        ipcRenderer.on('fileMoved', (event, fileName)=>{
            this.removeFileFromPlaylist(currPlaylist, fileName);
        })
    }
    moveFilePrompt = (event)=>{
        fileToBeMoved = this.state.playlist[this.state.indexFile];
        this.setState({openMoveFileDialog:true})
    }
    renameFilePrompt = (event)=>{
        fileToBeMoved = this.state.playlist[this.state.indexFile];
        this.setState({openRenameFileDialog:true})
    }
    renameFile = (event)=>{
        let newName = this.state.renameName;
        // console.log(newName);
        if(!helperFunctions.detectRestrictedTitles(newName)){
            console.log('Something is wrong with title');
            this.setState({titleError:true});
        }else{
            ipcRenderer.send("renameFile",{file:fileToBeMoved, fileFolder: this.props.path,newName:helperFunctions.changeRestrictedTitles(newName)});
        }
        // console.log(newName);
        ipcRenderer.on('fileRenamed', (event, args)=>{
            this.closeDialog();
            let currPlaylist = Array.from(this.state.playlist);
            let renamedFile = helperFunctions.findSong(currPlaylist, args.prevName[0]);
            // console.log(renamedFile);
            args.prevName[0] = args.newName + ".mp3";
            currPlaylist.splice(renamedFile, 1, args.prevName)
            // console.log(currPlaylist)
            this.setState({playlist:currPlaylist},()=>{
                let findCurrSongIndex = this.state.playlist.findIndex((file)=> file[0] === this.state.selectedFile);
                if(findCurrSongIndex === -1){
                    findCurrSongIndex = 0;
                }
                this.props.sendFileToParent([this.state.playlist,findCurrSongIndex]);
            });
        })
    }
    renameName = (event)=>{
        this.setState({renameName:event.target.value},()=>{
            // console.log(this.state.renameName)
        })
    }
    closeDialog= ()=>{
        this.setState({openMoveFileDialog:false});
        this.setState({openRenameFileDialog:false});
        this.setState({titleError:false});
    }
    removeFileFromPlaylist = (currPlaylist, fileName) =>{
        let removedFile = helperFunctions.findSong(currPlaylist, fileName)
        currPlaylist.splice(removedFile,1);
        this.setState({playlist:currPlaylist},()=>{
            // let findCurrSongIndex = this.state.playlist.findIndex((file)=> file[0] === this.state.selectedFile);
            // if(findCurrSongIndex !== -1){
            //     // findCurrSongIndex = removedFile;
            //     this.props.sendFileToParent([this.state.playlist,findCurrSongIndex]);
            // }else if(findCurrSongIndex === -1 && fileName === this.state.selectedFile){
            //     findCurrSongIndex = removedFile;
            //     this.props.sendFileToParent([this.state.playlist,findCurrSongIndex]);
            // }
        })
    }
    deleteFile = (event)=>{
        let currPlaylist = Array.from(this.state.playlist);
        // console.log(currPlaylist);
        // console.log(currPlaylist[this.state.indexFile]);
        ipcRenderer.send("deleteFile",{path: this.props.path, file: this.state.playlist[this.state.indexFile][0]});
        ipcRenderer.on("deletedFile",(event,fileName)=>{
            // console.log('a');
            this.removeFileFromPlaylist(currPlaylist, fileName)
        })
    }
    render(){
        const classes = styles;
        const {fileMoreAnchorEl, empty, loading, songListHeight, selectedFile, numberOfSongs, renameName, openFileOptionsMenu, openMoveFileDialog,openRenameFileDialog} = this.state;
        return(
            <div style={classes.playlistContainer}>
              <div style={classes.playlistHeading}>
                <div style={classes.playlistImageContainer}>
                    <div style={classes.playlistImage}>
                        <FolderIcon style={{color:"#0d1217", fontSize:"110"}}/>
                    </div>
                    <div style={classes.playlistTitleContainer}>
                        <div style={classes.playlistTitle}>
                            {this.props.path}
                        </div>
                        <div style={classes.playlistDescription}>
                            {numberOfSongs} songs
                        </div>
                    </div>
                    <div style={classes.playlistMore}>
                        <IconButton>
                            <MoreVertIcon fontSize="large" color="primary"/>
                        </IconButton>
                    </div>  
                </div>
              </div>
              <Divider/>
              {loading && (
                <div style={{display:"flex",justifyContent:"center", alignItems:"center", marginLeft:"180px",height:"100%",marginTop:"20px"}}>
                    <CircularProgress color="primary"/>
                </div>
              )}
              {empty && (
                  <div style={{color:"#007d85", display:"flex",justifyContent:"center", alignItems:"center", marginLeft:"180px",height:"100%",marginTop:"20px"}}>There's no songs in here :/</div>
              )}
              <List sx = {{
                display:'flex',
                flexDirection:"column", 
                padding:"0", 
                height: songListHeight,
                overflow: "auto",     
                '&::-webkit-scrollbar': {
                    width: '10px',
                    height: '10px', 
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor:"#00adb5"
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor:"#007d85",
                }}}>
                {this.state.playlist.map((data,index) => (
                <div style ={classes.playlistListContainer}>
                    <ListItemButton 
                        style={{width:"100%",paddingRight:0}} 
                        onClick={(event)=>{this.handleFileClick(event, data[0], index)}} 
                        color="primary"  
                        selected = {false}
                        key={index}
                    >
                        <div style= {{marginLeft:"200px",display:"flex",width:"70%",position:"absolute"}}>
                            <ListItemIcon style={{marginTop:"3px"}}>
                                {
                                    selectedFile === data[0] ? 
                                    <PlayArrowIcon color="primary"/>
                                    :
                                    <PlayCircleFilledIcon color="primary" />
                                }
                                
                            </ListItemIcon>
                            <ListItemText 
                                style={{width:"100%", textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden"}}
                                primary={data[0].substring(0,data[0].length-4)}
                            />
                             
                        </div>
                   
                    </ListItemButton>
                    <div style={{display:"flex",alignItems:"flex-end", marginBottom:"8px"}}>
                        <p style={{color:"#007d85", marginBottom:"auto",marginTop:"auto"}}>{helperFunctions.getFancyTime(Math.trunc(data[1]))}</p>
                        <IconButton onClick={(event)=>{this.moreFileOptionsButton(event,index)}}>
                            <MoreHorizIcon color="primary"/>
                            {
                                (openFileOptionsMenu ) && 
                                <Menu
                                    open={openFileOptionsMenu}
                                    anchorEl={fileMoreAnchorEl}
                                    color="primary"
                                >
                                    <MenuItem onClick={this.renameFilePrompt}>Rename</MenuItem>
                                    <MenuItem onClick={this.moveFilePrompt}>Move</MenuItem>
                                    <MenuItem onClick={this.deleteFile}>Delete</MenuItem>
                                </Menu>
                            }
                        </IconButton>
                    </div>
                </div>
                ))}
              </List>
                <Dialog
                    open = {openMoveFileDialog}
                    onClose = {this.closeDialog}
                    color="primary"
                >
                    <DialogTitle color ="secondary">Move File To Where?</DialogTitle>
                    <Divider/>
                    <List>
                        {this.props.folders.map((value)=>{
                            return(
                                <ListItemButton 
                                    onClick = {(event)=>{this.moveFile(event,value)}} 
                                    key={value}
                                >
                                    <ListItemText 
                                        primary={value}
                                    />
                                </ListItemButton>
                            )
                        })}
                    </List>
                </Dialog>
                <Dialog
                    open = {openRenameFileDialog}
                    onClose = {this.closeDialog}
                    color="primary"
                >
                    <div style={{display:"flex", flexDirection:"column", margin:"10px", marginBottom:"0"}}>
                        <DialogTitle color ="secondary">Rename File to What?</DialogTitle>
                        <TextField onChange = {this.renameName} color="primary" id="filled-basic" label="Input Name Here" variant="filled" autoFocus/>
                        {
                            this.state.titleError === true ?
                                <div style= {{display:"flex",justifyContent:"center", alignItems:"center",flexDirection:"column"}}>
                                    <Alert variant="filled" color="secondary" severity="error" style={{color:"white", textAlign:'center', marginTop:'8px',backgroundColor:"red"}}>There's an error with the title, fix it!</Alert>
                                </div>
                            :
                                <div/>
                        }     
                        <div style={{marginLeft:"auto",padding:"8px", paddingRight:"0"}}>
                            <Button onClick = {this.renameFile} variant="contained" color="primary" type="submit">Submit</Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}
export default Playlist;