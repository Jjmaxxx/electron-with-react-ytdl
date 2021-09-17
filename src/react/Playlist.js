import React from "react";
import styles from './utils/styles.js';
import helperFunctions from './utils/helperFunctions.js';
import { Divider, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import FolderIcon from '@material-ui/icons/Folder';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
const { ipcRenderer } = window.require("electron");
class Playlist extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            filesList:[]
        }
    }
    componentDidMount(){
        ipcRenderer.send("getFiles",this.props.path);
        ipcRenderer.on('gotFiles',(event,files)=>{
            this.setState({filesList:files});
            console.log(this.state.filesList);
        })
        //console.log(this.props.path);
    }
    componentWillUnmount(){
        ipcRenderer.removeAllListeners("gotFiles");
    }
    render(){
        const classes = styles;
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
              <List style = {{display:'flex',flexDirection:"column", width:"100%",padding:"0"}}>
                  {this.state.filesList.map((data) => (
                    <ListItem style={{backgroundColor:"#0d1217",width:"100%"}} color="primary" button key={data[0]}>
                      <div style= {{marginLeft:"200px",display:"flex",width:"100%"}}>
                        <ListItemIcon style={{marginTop:"3px"}}>
                            <PlayCircleFilledIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText style={{width:"100%", textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden"}}primary={data[0].substring(0,data[0].length-4)}/>
                        <div style={{display:"flex", justifyContent:"flex-end",width:"100%",alignContent:"space-between",gap:"15px"}}>
                            <p>{helperFunctions.getFancyTime(Math.trunc(data[1]))}</p>
                            <MoreHorizIcon style={{marginTop:"13px"}}color="primary"/>
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