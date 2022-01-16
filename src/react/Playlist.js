import React from "react";
import styles from './utils/styles.js';
import helperFunctions from './utils/helperFunctions.js';
import { Divider, CircularProgress, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem} from "@material-ui/core";
import FolderIcon from '@material-ui/icons/Folder';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
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
        //console.log(this.props.path);
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
    deleteSong = (event,index)=>{
        console.log(index);
    }
    handleFileClick = (event,file, index)=>{
        console.log(this.state.playlist);
        this.props.sendFileToParent([this.state.playlist,index]);
        this.setState({playing:true});
        this.setState({selectedFile:file},()=>{
            console.log(this.state.selectedFile);
        });
    }
    moreFileOptionsButton = (event)=>{
        if(this.state.openFileOptionsMenu){
            this.setState({openFileOptionsMenu: false});
        }else{
            this.setState({openFileOptionsMenu: true});
        }
        this.setState({anchorEl:event.currentTarget});
    }
    render(){
        const classes = styles;
        const {anchorEl, loading, songListHeight, selectedFile, openFileOptionsMenu} = this.state;
        return(
            <div>
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
              <Divider style={{backgroundColor:"#007d85"}}/>

              {loading && (
                <div style={{display:"flex",justifyContent:"center", alignItems:"center", marginLeft:"180px",height:"100%",marginTop:"20px"}}>
                    <CircularProgress color="primary"/>
                </div>
              )}
              <List style = {{display:'flex',flexDirection:"column", padding:"0", height: songListHeight,overflow: "auto"}}>
                  {this.state.playlist.map((data,index) => (
                    <div style ={{display:"flex", width:"100%", backgroundColor:"#0d1217"}}>
                        <ListItem 
                            style={{width:"100%",paddingRight:0}} 
                            onClick={(event)=>{this.handleFileClick(event, data[0], index)}} 
                            color="primary" 
                            button 
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
                        </ListItem>
                        <div style={{display:"flex",alignItems:"flex-end", marginBottom:"8px"}}>
                        <p style={{color:"#007d85"}}>{helperFunctions.getFancyTime(Math.trunc(data[1]))}</p>
                        <IconButton onClick={this.moreFileOptionsButton}>
                            <MoreHorizIcon color="primary"/>
                            {
                                (openFileOptionsMenu ) && 
                                <Menu
                                open={openFileOptionsMenu}
                                anchorEl={anchorEl}
                                color="primary"
                                >
                                    <MenuItem>Move</MenuItem>
                                    <MenuItem onClick={(event)=>{this.deleteSong(event,data[0])}} >Delete</MenuItem>
                                </Menu>
                            }
                        </IconButton>
                    </div>
                    </div>
                  ))}
              </List>
            </div>
        )
    }
}
export default Playlist;