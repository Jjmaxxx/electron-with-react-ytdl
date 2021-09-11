import React from "react";
import ReactPlayer from 'react-player/file';
import styles from './utils/styles.js';
import { Drawer , IconButton, Slider, Grid} from "@material-ui/core";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FastForwardIcon from '@material-ui/icons/FastForward';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import playerTheme from './utils/playerTheme.js';
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";

class Player extends React.Component{
    constructor(props){
        super(props);
        this.play = this.play.bind(this);
        this.state = {
            playing: true,
        }
    }
    play=()=>{
        if(this.state.playing){
            this.setState({playing:false});
        }else{
            this.setState({playing:true});
        }
    }
    render(){
        const classes = styles;
        const {playing} = this.state;
        return(
            <div>
                <MuiThemeProvider theme={playerTheme}>
                    <CssBaseline/>
                    <ReactPlayer 
                        url = "videos/b.mp4"
                        playing="true"
                        volume="0.02"
                        width= "250px"
                        height="200px"
                        style= {classes.video}
                    />
                    <Drawer 
                        variant = "permanent" 
                        anchor="bottom"
                    >
                        <div style={classes.playerBarContainer}>
                            <div style={{display:"flex",alignItems:"center"}}>
                                <div style={{backgroundColor:"red",width:"50px",height:"50px", marginLeft:"18px"}}/>
                                {/* 15 characters limit */}
                                <div style={{color:"white", marginLeft:"10px"}}>nameeeeeeeeeee<br/><div>artist</div></div>
                            </div>
                            
                            <div style= {classes.playerBar}>
                                <IconButton color = "secondary">
                                    <FastRewindIcon fontSize="large"/>
                                </IconButton>
                                <IconButton onClick={this.play} style={classes.playPauseButton} color = "secondary" >
                                    {(()=>{
                                        if(playing){
                                            return(
                                                <div>
                                                    <PauseIcon style={classes.playPauseIcon} fontSize="large"/>
                                                </div>
                                            )
                                        }else{
                                            return(
                                                <div>
                                                    <PlayArrowIcon style={classes.playPauseIcon}  fontSize="large"/>
                                                </div>
                                            )
                                        }
                                    })()}
                                </IconButton>
                                <IconButton color = "secondary">
                                    <FastForwardIcon fontSize="large"/>
                                </IconButton>
                            </div>
                                <Grid style={classes.volumeBar} container spacing={2} >
                                    <Grid item>
                                        <VolumeDown color = "secondary"/>
                                    </Grid>
                                    <Grid item xs>
                                    <Slider aria-labelledby="continuous-slider" />
                                        </Grid>
                                    <Grid item>
                                        <VolumeUp color = "secondary"/>
                                    </Grid>
                                </Grid>
                        </div>
                        <Grid style={{width:"60%",marginLeft:"auto",marginRight:"auto",marginBottom:"10px"}} container spacing={2} >
                            <Grid item>
                                <div style= {{color:"white",marginTop:"3px"}}>0:00</div>
                            </Grid>
                            <Grid item xs>
                                <Slider aria-labelledby="continuous-slider" />
                            </Grid>
                            <Grid item>
                                <div style= {{color:"white",marginTop:"3px"}}>5:00</div>
                            </Grid>
                        </Grid>
                    </Drawer>
                </MuiThemeProvider>
            </div>
        )
    }
}
export default Player;