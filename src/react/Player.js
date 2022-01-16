import React from "react";
import ReactPlayer from 'react-player/file';
import styles from './utils/styles.js';
import { Drawer , IconButton, Slider, Grid, Dialog} from "@material-ui/core";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FastForwardIcon from '@material-ui/icons/FastForward';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import MovieIcon from '@material-ui/icons/Movie';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import CloseIcon from '@material-ui/icons/Close';
import LoopIcon from '@material-ui/icons/Loop';
import playerTheme from './utils/playerTheme.js';
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import helperFunctions from './utils/helperFunctions.js';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import PictureInPictureIcon from '@material-ui/icons/PictureInPicture';
import PictureInPictureAltIcon from '@material-ui/icons/PictureInPictureAlt';

let video,fileType,vidTitle,pipWidth,pipHeight, originalPlaylist;

class Player extends React.Component{
    constructor(props){
        super(props);
        this.play = this.play.bind(this);
        this.state = {
            playlist:[],
            filePath:"",
            hoverPlayer:true,
            playing: false,
            volume:0.1,
            videoTime:"0:00",
            rawVideoTime:0,
            duration:0,
            seeking:false,
            loop:false,
            pip:false,
            openQueue:false,
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
        this.setState({playing:true}); 
        //console.log(this.props.filesList)
        originalPlaylist = this.props.filesList;
        // console.log(originalPlaylist);
        this.setState({playlist:originalPlaylist});
        this.setState({filePath:this.props.filePath});
        pipWidth ="0px";
        pipHeight="0px";
    }
    componentDidUpdate(prevProps, prevState){
        //is not getting run immediately after selectedVideo becomes true
        // console.log(prevProps.index);
        // console.log(prevState);
        if(this.state.selectedVideo === true){
            this.setState({selectedVideo:false},()=>{
                this.setState({playlist:originalPlaylist}, this.getNewVideo(this.state.videoSelection));
                this.setState({shuffle:false})
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
    ref = player => {
        this.player = player;
        if(this.player != null){
            console.log(this.player.player);
        }
        // console.log(this.player.getActivePlayer());
        //this.player.requestPictureInPicture();
        //console.log(this.player);
    }
    // this.setState({filesList:this.props.filesList});
    // this.setState({video:this.props.filePath});
    getNewVideo= (index)=>{
        this.setState({pip:false});
        this.setState({vidIndex:index},()=>{
            if(this.state.playlist.length > 0){
                this.setState({video:this.state.filePath + this.state.playlist[this.state.vidIndex][0]},()=>{
                    fileType = this.state.video.substring(this.state.video.length-3);
                    vidTitle = this.state.video.substring(0,this.state.video.length-4).substring(this.state.video.lastIndexOf('/')+1);
                    this.setState({selected:this.state.playlist[index][0]},()=>{
                        this.props.sendFileToParent(this.state.selected);
                    });
                    if(fileType === "mp4"){
                        pipWidth = "250px";
                        pipHeight = "120px";
                    }else{
                        pipWidth = "0px";
                        pipHeight = "0px";
                    }
                    //if this console.log is not instant when new file this will break fix it
                    // console.log(this.state.video);
                    // console.log(this.state.playlist);
                });
            }
        });
    }
    hoverOverPlayer=()=>{
        this.setState({hoverPlayer:false});
    }
    hoverOutPlayer=()=>{
        this.setState({hoverPlayer:true});
    }
    queue=()=>{
        this.setState({openQueue:true});
    }
    closeQueue=()=>{
        this.setState({openQueue:false})
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
    rewind=()=>{
        let goToPrevVid = this.state.vidIndex-1;
        if(Math.trunc(this.player.getCurrentTime()) < 5 && goToPrevVid >= 0){
            this.getNewVideo(goToPrevVid);
        }else{
            this.player.seekTo(0);
        }
    }
    //https://bost.ocks.org/mike/shuffle/
    shufflePlaylist=()=>{
        let songsList = Array.from(originalPlaylist);
        //console.log(songsList);
        let currSong = songsList[this.state.vidIndex];
        let i, unshuffled, temp;
        unshuffled = songsList.length;
        while(unshuffled){
            unshuffled= unshuffled- 1;
            i= Math.floor(Math.random()*unshuffled);
            temp = songsList[unshuffled];
            songsList[unshuffled] = songsList[i];
            songsList[i] = temp;
            //console.log(songsList);
           // console.log(this.state.playlist);
        }
        songsList.splice(songsList.findIndex((element)=> element === currSong), 1);
        songsList.splice(0,0, currSong);
        //console.log(songsList);
        this.setState({vidIndex:0});
        this.setState({playlist:songsList},()=>{
            //console.log(this.state.filesList);
        });
    }
    pip=()=>{
        if(!this.state.pip){
            this.setState({pip:true});
        }else{
            this.setState({pip:false});
        }
    }
    pipDisable=()=>{
        this.setState({pip:false});
    }
    shuffle=()=>{
        //console.log(originalPlaylist);
        if(this.state.shuffle){
            this.setState({shuffle:false});
            this.setState({playlist:originalPlaylist},()=>{
                // console.log(this.state.playlist)
            });
            window.localStorage.setItem('shuffle', JSON.stringify(false));
            //find index of current song, set it to that
        }else{
            this.setState({shuffle:true});
            //console.log(this.state.playlist);
            this.shufflePlaylist();
            window.localStorage.setItem('shuffle', JSON.stringify(true));
        }
        console.log(this.state.playlist);
        //console.log(JSON.parse(localStorage.getItem('shuffle')));
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
            //console.log(this.player.getCurrentTime());
        }  
    }
    videoDuration=(vidDuration)=>{
        this.setState({duration:vidDuration});
        // console.log("minutes: " + Math.floor(duration/60) + "seconds: " + Math.floor(((Math.floor(duration/60)-duration/60) * 60)*-1)); 
    }
    nextVideo=()=>{
        let nextVid = this.state.vidIndex+1;
        if(nextVid < this.state.playlist.length){
            this.getNewVideo(nextVid);
        }
    }
    render(){
        const classes = styles;
        const {video, playing, volume, rawVideoTime, videoTime, duration, loop, shuffle, openQueue, pip, hoverPlayer} = this.state;
        //console.log("render running")
        return(
            <div>
                <MuiThemeProvider theme={playerTheme}>
                    <CssBaseline/>
                    <div style= {classes.video} onMouseEnter={this.hoverOverPlayer} onMouseLeave={this.hoverOutPlayer}>
                        <ReactPlayer 
                            config={{file:{attributes:{autopictureinpicture:true}}}}
                            onContextMenu={e=>e.preventDefault()}
                            ref={this.ref}
                            url = {video}
                            key= {video}
                            playing={playing}
                            volume={volume}
                            loop={loop}
                            pip={pip}
                            width= {pipWidth}
                            height= {pipHeight}
                            onDisablePIP = {this.pipDisable}
                            onReady={this.playerReady}
                            onProgress={this.videoProgress}
                            onDuration={this.videoDuration}
                            onEnded={this.nextVideo}
                        />        
                        <IconButton disabled = {hoverPlayer} style={classes.overlapPIPVideo} onClick = {this.pip} color="secondary">
                            {
                                pip===true ?
                                    <PictureInPictureAltIcon/>
                                :
                                    <PictureInPictureIcon/>
                            }
                        </IconButton>  
                    </div>                      

                    <Drawer 
                        variant = "permanent" 
                        anchor="bottom"
                        style={{height:"200px"}}
                    >
                        <div style={classes.playerBarContainer}>
                            <div style={classes.vidInfoContainer}>
                                <div style={classes.vidImageContainer}>
                                    {
                                        fileType === "mp3" ?
                                        <div>
                                            <MusicNoteIcon style={classes.vidImage} fontSize="large"/>
                                        </div>
                                        :
                                        <div>
                                            <MovieIcon style={classes.vidImage} fontSize="large"/>
                                        </div>
                                    }
                                </div>
                                {/* 15 characters limit */}
                                <div style={{color:"#00adb5", marginLeft:"10px", overflow:"hidden",textOverflow: "ellipsis"}}>{vidTitle}<br/><div style={{color:"#00adb5"}}>Unknown Artist</div></div>
                            </div>
                                <div style = {classes.playPauseIconContainer}>
                                    <IconButton style={classes.playerIcons} onClick={this.shuffle}color = "secondary">
                                        {
                                            !shuffle ? 
                                                <ShuffleIcon/>
                                            :
                                                <ShuffleIcon style={classes.iconClicked}/>
                                        }
                                    </IconButton>
                                    <IconButton onClick = {this.rewind} color = "secondary">
                                        <FastRewindIcon fontSize="large"/>
                                    </IconButton>
                                    <IconButton onClick={this.play} style={classes.playPauseButton} color = "secondary" >
                                        {
                                            playing ?
                                                <PauseIcon style={classes.playPauseIcon} fontSize="large"/>
                                            :
                                                <PlayArrowIcon style={classes.playPauseIcon}  fontSize="large"/>
                                        }
                                    </IconButton>
                                    <IconButton onClick = {this.nextVideo} color = "secondary">
                                        <FastForwardIcon fontSize="large"/>
                                    </IconButton>
                                    <IconButton style={classes.playerIcons} onClick={this.loop} color = "secondary">
                                        {
                                            !loop ? 
                                                <LoopIcon/>
                                            :
                                                <LoopIcon style={classes.iconClicked}/>
                                        }
                                    </IconButton>
                                </div>
                                <IconButton style={{marginBottom:"8px"}} onClick={this.queue} color = "secondary">
                                    <QueueMusicIcon/>
                                </IconButton>
                                <Dialog
                                    fullScreen
                                    open={openQueue}
                                    onClose={this.closeQueue}
                                    color="inherit"
                                >
                                    <IconButton
                                        edge="start"
                                        color="inherit"
                                        onClick={this.closeQueue}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Dialog>
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