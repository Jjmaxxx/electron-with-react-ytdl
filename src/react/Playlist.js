import React from "react";
import styles from './utils/styles.js';
import helperFunctions from './utils/helperFunctions.js';
import { Divider, Dialog, DialogTitle, CircularProgress, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
const { ipcRenderer } = window.require("electron");
class Playlist extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            playlist:[],
            loading:true,
            selectedFile:null,
            playing:false,
            openFileOptionsMenu:false,
            anchorEl:null,
            songListHeight:"0px",
            indexFile:null,
            openMoveFileDialog:false
        }
    }
    componentDidMount(){
        ipcRenderer.send("getFiles",this.props.path);
        ipcRenderer.on('gotFiles',(event,files)=>{
            this.setState({playlist:files},()=>{
                console.log(this.state.playlist);
            });
            this.setState({loading:false});
        })
        console.log(this.props.folders);
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
        console.log(event);
        this.props.sendFileToParent([this.state.playlist,index]);
        this.setState({playing:true});
        this.setState({selectedFile:file},()=>{
            console.log(this.state.selectedFile);
        });
    }
    moreFileOptionsButton = (event,index)=>{
        if(this.state.openFileOptionsMenu){
            this.setState({openFileOptionsMenu: false});
        }else{
            this.setState({openFileOptionsMenu: true});
        }
        console.log(index)
        this.setState({indexFile:index});
        this.setState({anchorEl:event.currentTarget});
    }
    moveFile = (event)=>{
        let file = this.state.playlist[this.state.indexFile];
        console.log(file);
        this.setState({openMoveFileDialog:true})
    }
    closeDialog= ()=>{
        this.setState({openMoveFileDialog:false})
    }
    deleteFile = (event)=>{
        let currPlaylist = Array.from(this.state.playlist);
        console.log(currPlaylist);
        console.log(currPlaylist[this.state.indexFile]);
        ipcRenderer.send("deleteFile",[this.props.path, currPlaylist[this.state.indexFile][0]]);
        ipcRenderer.on("deletedFile",(event,fileName)=>{
            console.log('a');
            let deletedFile = currPlaylist.findIndex((file)=>file[0] === fileName);
            console.log(deletedFile);
            currPlaylist.splice(deletedFile,1);
            this.setState({playlist:currPlaylist},()=>{
                let findCurrSongIndex = this.state.playlist.findIndex((file)=> file[0] === this.state.selectedFile);
                if(findCurrSongIndex === -1){
                    findCurrSongIndex = deletedFile;
                }
                this.props.sendFileToParent([this.state.playlist,findCurrSongIndex]);
            })   
        })
    }
    render(){
        const classes = styles;
        const {anchorEl, loading, songListHeight, selectedFile, openFileOptionsMenu, openMoveFileDialog} = this.state;
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
                            random bs playlist information
                        </div>
                    </div>
                </div>
              </div>
              <Divider/>
              {loading && (
                <div style={{display:"flex",justifyContent:"center", alignItems:"center", marginLeft:"180px",height:"100%",marginTop:"20px"}}>
                    <CircularProgress color="primary"/>
                </div>
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
                                    anchorEl={anchorEl}
                                    color="primary"
                                >
                                    <MenuItem onClick={this.moveFile}>Move</MenuItem>
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
                                <ListItemButton key={value}>
                                    <ListItemText 
                                        primary={value}
                                    />
                                </ListItemButton>
                            )
                        })}
                    </List>
                </Dialog>
            </div>
        )
    }
}
export default Playlist;