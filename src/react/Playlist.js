import React from "react";
import styles from './utils/styles.js';
import helperFunctions from './utils/helperFunctions.js';
import { Divider, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import FolderIcon from '@material-ui/icons/Folder';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CircularProgress from '@material-ui/core/CircularProgress';
const { ipcRenderer } = window.require("electron");
class Playlist extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            filesList:[],
            loading:true
        }
    }
    componentDidMount(){
        ipcRenderer.send("getFiles",this.props.path);
        ipcRenderer.on('gotFiles',(event,files)=>{
            this.setState({filesList:files});
            this.setState({loading:false});
            console.log(this.state.filesList);
        })
        //console.log(this.props.path);
    }
    componentWillUnmount(){
        ipcRenderer.removeAllListeners("gotFiles");
    }
    sendFileToParent = (event,file)=>{
        this.props.sendFileToParent(file);
    }
    render(){
        const classes = styles;
        const {loading} = this.state;
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
                  {this.state.filesList.map((data) => (
                    <ListItem style={{backgroundColor:"#0d1217",width:"100%"}} onClick={(event)=>{this.sendFileToParent(event, data[0])}} color="primary" button key={data[0]}>
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