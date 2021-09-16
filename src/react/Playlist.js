import React from "react";
import styles from './utils/styles.js';
import FolderIcon from '@material-ui/icons/Folder';
const { ipcRenderer } = window.require("electron");
// import { List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
class Playlist extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            filesList:["null"]
        }
    }
    componentDidMount(){
        ipcRenderer.send("getFiles",this.props.path);
        ipcRenderer.on('gotFiles',(event,files)=>{
            this.setState({filesList:files});
            console.log(this.state.filesList)
        })
        console.log(this.props.path);
    }
    render(){
        const classes = styles;
        return(
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

        )
    }
}
export default Playlist;