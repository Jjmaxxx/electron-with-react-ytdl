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
            filesList:[],
            loading:true,
            selectedIndex:null,
            playing:false,
            openFileOptionsMenu:false,
        }
    }
    componentDidMount(){
        ipcRenderer.send("getFiles",this.props.path);
        ipcRenderer.on('gotFiles',(event,files)=>{
            this.setState({filesList:files});
            this.setState({loading:false});
        })
        //console.log(this.props.path);
    }
    componentWillUnmount(){
        ipcRenderer.removeAllListeners("gotFiles");
    }
    handleFileClick = (event,file, index)=>{
        this.props.sendFileToParent(file);
        this.setState({playing:true});
        this.setState({selectedIndex:index});
        console.log(this.state.selectedIndex);
    }
    moreFileOptionsButton = (event)=>{
        this.setState({openFileOptionsMenu: true},()=>{
            console.log(this.state.openFileOptionsMenu);
            console.log(this.state.selectedIndex);
        });
    }
    render(){
        const classes = styles;
        const {loading, playing, selectedIndex, openFileOptionsMenu} = this.state;
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
              <List style = {{display:'flex',flexDirection:"column", width:"100%",padding:"0"}}>
                  {this.state.filesList.map((data,index) => (
                    <ListItem 
                        style={{backgroundColor:"#0d1217",width:"100%"}} 
                        onClick={(event)=>{this.handleFileClick(event, data[0], index)}} 
                        color="primary" 
                        button 
                        key={index}
                    >
                      <div style= {{marginLeft:"200px",display:"flex",width:"100%"}}>
                        <ListItemIcon style={{marginTop:"3px"}}>
                            {
                                selectedIndex === index ? 
                                <PlayArrowIcon color="primary"/>
                                :
                                <PlayCircleFilledIcon color="primary" />
                            }
                            
                        </ListItemIcon>
                        <ListItemText 
                            style={{width:"100%", textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden"}}
                            primary={data[0].substring(0,data[0].length-4)}
                        />
                        <div style={{display:"flex", justifyContent:"flex-end",width:"100%",alignContent:"space-between",gap:"15px"}}>
                            <p>{helperFunctions.getFancyTime(Math.trunc(data[1]))}</p>
                            <IconButton onClick={this.moreFileOptionsButton} style={{marginTop:"12px",width:"8px",height:"8px", zIndex:100}}>
                                <MoreHorizIcon color="primary"/>
                                {
                                    (openFileOptionsMenu && selectedIndex === index ) && 
                                    <Menu
                                     open={true}
                                     
                                    >
                                        <MenuItem>hello</MenuItem>
                                        <MenuItem>hello</MenuItem>
                                        <MenuItem>hello</MenuItem>
                                    </Menu>
                                }
                            </IconButton>
                        </div>
                      </div>
                    </ListItem>
                  ))}
              </List>
            </div>
        )
    }
}
export default Playlist;