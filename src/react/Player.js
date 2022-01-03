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
import helperFunctions from './utils/helperFunctions.js';


let video,fileType,vidTitle,pipWidth,pipHeight, originalPlaylist;

class Player extends React.Component{
    constructor(props){
        super(props);
        this.play = this.play.bind(this);
        this.state = {
            filesList:[],
            filePath:"",
            playing: false,
            volume:0.1,
            videoTime:"0:00",
            rawVideoTime:0,
            duration:0,
            seeking:false,
            loop:false,
            shuffle: localStorage.getItem('shuffle') ? JSON.parse(localStorage.getItem('shuffle')) : false ,
            selected:"",
            selectedVideo: false,
            video:"",
            videoSelection:null,
            vidIndex:""
        }
    }
    componentDidMount(){
        //this.getNewVideo(this.props.index);
        console.log('remounted')
        if(fileType === "mp4"){
            pipWidth = "250px";
            pipHeight = "120px";
        }else{
            pipWidth = "0px";
            pipHeight = "0px";
        }
        this.setState({playing:true}); 
        originalPlaylist = this.props.filesList;
        this.setState({filesList:originalPlaylist});
        this.setState({filePath:this.props.filePath});
    }
    componentDidUpdate(prevProps, prevState){
        //is not getting run immediately after selectedVideo becomes true
        // console.log(prevProps.index);
        // console.log(prevState);
        if(this.state.selectedVideo === true){
            this.setState({selectedVideo:false},()=>{
                this.getNewVideo(this.state.videoSelection);
            });
        }
    }
    static getDerivedStateFromProps(props,state){
        if(props.index !== null && state.prevVideoSelection !== state.videoSelection){
            // console.log("prev state:" + state.prevVideoSelection);
            // console.log("state: " + state.videoSelection);
            return{
                videoSelection:props.index,   
                prevVideoSelection: state.videoSelection, 
                selectedVideo:true
            }
        }
        return{
            videoSelection:props.index,
        }
    }
    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     this.setState({data: nextProps.index},()=>{
    //         this.getNewVideo(this.state.data);
    //     });  
    // }
    ref = player => {
        this.player = player;
        console.log(this.player);
    }
    // this.setState({filesList:this.props.filesList});
    // this.setState({video:this.props.filePath});
    getNewVideo= (index)=>{
        this.setState({vidIndex:index},()=>{
            if(this.state.filesList.length > 0){
                this.setState({video:this.state.filePath + this.state.filesList[this.state.vidIndex][0]},()=>{
                    fileType = this.state.video.substring(this.state.video.length-3);
                    vidTitle = this.state.video.substring(0,this.state.video.length-4).substring(this.state.video.lastIndexOf('/')+1);
                    //if this console.log is not instant when new file this will break fix it
                    console.log(this.state.video);
                    console.log(this.state.filesList);
                });
            }
        });
    }
    playerReady= ()=>{
        console.log('run')
        if(video === null){
            console.log('no video found')
        }
    }
    play=()=>{
        if(this.state.playing){
            this.setState({playing:false});
        }else{
            this.setState({playing:true});
        }
    }
    //https://bost.ocks.org/mike/shuffle/
    shuffle=()=>{
        if(this.state.shuffle){
            this.setState({shuffle:false});
            this.setState({filesList:originalPlaylist});
            //find index of current song, set it to that
        }else{
            this.setState({shuffle:true});
            let list = this.state.filesList;
            let i, unshuffled, temp;
            unshuffled = list.length;
            while(unshuffled){
                unshuffled= unshuffled- 1;
                i= Math.floor(Math.random()*unshuffled);
                temp = list[unshuffled];
                list[unshuffled] = list[i];
                list[i] = temp;
            }
            temp = list[this.state.vidIndex]; 
            list[this.state.vidIndex] = list[0];
            list[0] = temp;
            console.log(list);
            this.setState({filesList:list},()=>{
                console.log(this.state.filesList);
            });
        }
        window.localStorage.setItem('shuffle', JSON.stringify(true));
        console.log(JSON.parse(localStorage.getItem('shuffle')));
    }
    loop=()=>{
        if(!this.state.loop){
            this.setState({loop:true});
        }else{
            this.setState({loop:false});
        }
    }
    videoProgress= (state)=>{
        // console.log(state.playedSeconds);
        if(!this.state.seeking){
            state.playedSeconds = Math.trunc(state.playedSeconds);
            this.setState({rawVideoTime:state.playedSeconds});
            this.setState({videoTime:helperFunctions.getFancyTime(state.playedSeconds)});
        }  
    }
    videoDuration=(vidDuration)=>{
        this.setState({duration:vidDuration});
        // console.log("minutes: " + Math.floor(duration/60) + "seconds: " + Math.floor(((Math.floor(duration/60)-duration/60) * 60)*-1)); 
    }
    videoEnded=()=>{
        let nextVideo = this.state.vidIndex+1;
        this.setState({selected:nextVideo},()=>{
            this.props.sendFileToParent(this.state.selected);
        });
        if(nextVideo < this.state.filesList.length){
            this.getNewVideo(nextVideo);
        }
    }
    render(){
        const classes = styles;
        const {video, playing, volume, rawVideoTime, videoTime, duration, loop, shuffle} = this.state;
        //console.log("render running")
        return(
            <div>
                <MuiThemeProvider theme={playerTheme}>
                    <CssBaseline/>
                    <ReactPlayer 
                        ref={this.ref}
                        url = {video}
                        key= {video}
                        playing={playing}
                        volume={volume}
                        loop={loop}
                        pip={true}
                        width= {pipWidth}
                        height= {pipHeight}
                        onReady={this.playerReady}
                        onProgress={this.videoProgress}
                        onDuration={this.videoDuration}
                        onEnded={this.videoEnded}
                        style= {classes.video}
                    />
                    <Drawer 
                        variant = "permanent" 
                        anchor="bottom"
                        style={{height:"200px"}}
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
                        <Grid style={{width:"60%",marginLeft:"auto",marginRight:"auto",marginBottom:"5px"}} container spacing={2} >
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
                                <p style= {classes.timeSliderText}>{helperFunctions.getFancyTime(duration)}</p>
                            </Grid>
                        </Grid>
                    </Drawer>
                </MuiThemeProvider>
            </div>
        )
    }
}
export default Player;