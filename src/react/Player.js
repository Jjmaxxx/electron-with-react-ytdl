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
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import MovieIcon from '@material-ui/icons/Movie';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import LoopIcon from '@material-ui/icons/Loop';
import playerTheme from './utils/playerTheme.js';
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";

const video ="videos/downloads/The Universe in 4 Minutes.mp4"
let fileType = video.substring(video.length-3);
console.log(fileType)
let vidTitle = video.substring(0,video.length-4).substring(video.indexOf('/')+1);
vidTitle=vidTitle.substring(vidTitle.indexOf('/')+1);
console.log(vidTitle);
class Player extends React.Component{
    constructor(props){
        super(props);
        this.play = this.play.bind(this);
        this.state = {
            playing: true,
            volume:0,
            videoTime:"0:00",
            rawVideoTime:0,
            duration:"0:00",
            seeking:false,
            loop:false,
            shuffle:false
        }
    }
    ref = player => {
        this.player = player;
    }
    play=()=>{
        if(this.state.playing){
            this.setState({playing:false});
        }else{
            this.setState({playing:true});
        }
    }
    shuffle=()=>{
        if(this.state.shuffle){
            this.setState({shuffle:false});
        }else{
            this.setState({shuffle:true});
        }
    }
    loop=()=>{
        if(!this.state.loop){
            this.setState({loop:true});
        }else{
            this.setState({loop:false});
        }
    }
    videoProgress= (state)=>{
        if(!this.state.seeking){
            state.playedSeconds = Math.trunc(state.playedSeconds);
            this.setState({rawVideoTime:state.playedSeconds});
            if(((state.playedSeconds - (Math.floor(state.playedSeconds/60) *60)) < 10 && state.playedSeconds <60)){
                this.setState({videoTime:Math.floor(state.playedSeconds/60)+ ":0" +Math.floor(state.playedSeconds)})
            }else if(Math.floor(state.playedSeconds) < 60){
                this.setState({videoTime:Math.floor(state.playedSeconds/60)+ ":" +Math.floor(state.playedSeconds)})
            }
            else if((state.playedSeconds - (Math.floor(state.playedSeconds/60) *60)) < 10 && state.playedSeconds >59){
                this.setState({videoTime:Math.floor(state.playedSeconds/60)+ ":0" +Math.floor(state.playedSeconds- Math.floor(state.playedSeconds/60) * 60)})  
            }else{
                this.setState({videoTime:Math.floor(state.playedSeconds/60)+ ":" +Math.floor(state.playedSeconds - Math.floor(state.playedSeconds/60) * 60)})
            }
        // console.log(this.state.videoTime);
        }  
    }
    videoDuration=(duration)=>{
        this.setState({duration:duration});
        console.log(this.state.duration);
        // console.log("minutes: " + Math.floor(duration/60) + "seconds: " + Math.floor(((Math.floor(duration/60)-duration/60) * 60)*-1)); 
    }
    render(){
        const classes = styles;
        const {playing, volume, rawVideoTime, videoTime, duration, loop, shuffle} = this.state;
        return(
            <div>
                <MuiThemeProvider theme={playerTheme}>
                    <CssBaseline/>
                    <ReactPlayer 
                        ref={this.ref}
                        url = {video}
                        playing={playing}
                        volume={volume}
                        loop={loop}
                        pip={true}
                        width= "250px"
                        height="200px"
                        onProgress={this.videoProgress}
                        onDuration={this.videoDuration}
                        style= {classes.video}
                    />
                    <Drawer 
                        variant = "permanent" 
                        anchor="bottom"
                    >
                        <div style={classes.playerBarContainer}>
                            <div style={classes.vidInfoContainer}>
                                <div style={classes.vidImageContainer}>
                                    {(()=>{
                                        if(fileType === "mp3"){
                                            return(
                                                <div>
                                                    <MusicNoteIcon style={classes.vidImage} fontSize="large"/>
                                                </div>
                                            )
                                        }else{
                                            return(
                                                <div>
                                                    <MovieIcon style={classes.vidImage} fontSize="large"/>
                                                </div>
                                            )
                                        }
                                    })()}
                                </div>
                                {/* 15 characters limit */}
                                <div style={{color:"#00adb5", marginLeft:"10px"}}>{vidTitle}<br/><div style={{color:"#00adb5"}}>Unknown Artist</div></div>
                            </div>
                                <div style = {classes.playPauseIconContainer}>
                                    <IconButton style={classes.playerIcons} onClick={this.shuffle}color = "secondary">
                                        {(()=>{
                                            if(!shuffle){
                                                return(
                                                    <div>
                                                        <ShuffleIcon/>
                                                    </div>
                                                )
                                            }else{
                                                return(
                                                    <div>
                                                        <ShuffleIcon style={classes.iconClicked}/>
                                                    </div>
                                                )
                                            }
                                        })()}
                                    </IconButton>
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
                                                // this.player.seekTo(70,'seconds')
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
                                    <IconButton style={classes.playerIcons} onClick={this.loop} color = "secondary">
                                        {(()=>{
                                            if(!loop){
                                                return(
                                                    <div>
                                                        <LoopIcon/>
                                                    </div>
                                                )
                                            }else{
                                                return(
                                                    <div>
                                                        <LoopIcon style={classes.iconClicked}/>
                                                    </div>
                                                )
                                            }
                                        })()}
                                    </IconButton>
                                </div>
                                    <Grid style={classes.volumeBar} container spacing={2} >
                                        <Grid item>
                                            <VolumeDown color = "secondary"/>
                                        </Grid>
                                        <Grid item xs>
                                        <Slider 
                                            aria-labelledby="continuous-slider"
                                            onChange= {(e,value)=>{this.setState({volume:value/500})}}
                                            value={volume*500}
                                        />
                                        </Grid>
                                    <Grid item>
                                        <VolumeUp color = "secondary"/>
                                    </Grid>
                                </Grid>
                            </div>
                        <Grid style={{width:"60%",marginLeft:"auto",marginRight:"auto",marginBottom:"10px"}} container spacing={2} >
                            <Grid item>
                                <p style= {classes.timeSliderText}>{videoTime}</p>
                            </Grid>
                            <Grid item xs>
                                <Slider
                                    min={0}
                                    max= {duration}
                                    value={rawVideoTime}
                                    onChange={(event,value)=>{this.setState({rawVideoTime:value})}}
                                    onMouseDown={(event)=>{
                                        this.setState({seeking:true});
                                        this.setState({playing:false});
                                        let self = this;
                                        window.addEventListener("mouseup", function handleMouseDown(){
                                            self.setState({seeking:false});
                                            self.setState({playing:true});
                                            self.player.seekTo(Math.floor(self.state.rawVideoTime));
                                            window.removeEventListener("mouseup", handleMouseDown);
                                          });
                                    }}
                                    aria-labelledby="continuous-slider" 
                                />
                            </Grid>
                            <Grid item>
                                <p style= {classes.timeSliderText}>{Math.floor(duration/60) + ":"+ Math.floor(((Math.floor(duration/60)-duration/60) * 60)*-1)}</p>
                            </Grid>
                        </Grid>
                    </Drawer>
                </MuiThemeProvider>
            </div>
        )
    }
}
export default Player;