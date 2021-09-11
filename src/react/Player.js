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

const video ="videos/b.mp4"
class Player extends React.Component{
    constructor(props){
        super(props);
        this.play = this.play.bind(this);
        this.state = {
            playing: true,
            volume:0.02,
            videoTime:"0:00",
            rawVideoTime:0,
            duration:"0:00",
            seeking:false
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
        const {playing, volume, rawVideoTime, videoTime, duration} = this.state;
        return(
            <div>
                <MuiThemeProvider theme={playerTheme}>
                    <CssBaseline/>
                    <ReactPlayer 
                        ref={this.ref}
                        url = {video}
                        playing={playing}
                        volume={volume}
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
                            </div>
                                <Grid style={classes.volumeBar} container spacing={2} >
                                    <Grid item>
                                        <VolumeDown color = "secondary"/>
                                    </Grid>
                                    <Grid item xs>
                                    <Slider 
                                        aria-labelledby="continuous-slider"
                                        onChange= {(e,value)=>{this.setState({volume:value/1000})}}
                                        value={volume*1000}
                                    />
                                        </Grid>
                                    <Grid item>
                                        <VolumeUp color = "secondary"/>
                                    </Grid>
                                </Grid>
                        </div>
                        <Grid style={{width:"60%",marginLeft:"auto",marginRight:"auto",marginBottom:"10px"}} container spacing={2} >
                            <Grid item>
                                <div style= {{color:"white",marginTop:"3px"}}>{videoTime}</div>
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
                                            self.player.seekTo(self.state.rawVideoTime);
                                            window.removeEventListener("mouseup", handleMouseDown);
                                          });
                                    }}
                                    aria-labelledby="continuous-slider" 
                                />
                            </Grid>
                            <Grid item>
                                <div style= {{color:"white",marginTop:"3px"}}>{Math.floor(duration/60) + ":"+ Math.floor(((Math.floor(duration/60)-duration/60) * 60)*-1)}</div>
                            </Grid>
                        </Grid>
                    </Drawer>
                </MuiThemeProvider>
            </div>
        )
    }
}
export default Player;