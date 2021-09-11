import React from "react";
import ReactPlayer from 'react-player/file';
import styles from './utils/styles.js';
import { Drawer , Button} from "@material-ui/core";
import playerTheme from './utils/playerTheme.js';
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";

class Player extends React.Component{
    render(){
        const classes = styles;
        console.log("./videos/a.mp4")
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
                    <div style={{height:"110px"}}>
                        <Button>hello</Button>
                    </div>
                </Drawer>
                </MuiThemeProvider>
            </div>

        )
    }
}
export default Player;