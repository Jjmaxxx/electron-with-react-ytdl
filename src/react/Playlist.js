import React from "react";
import styles from './utils/styles.js';

class Playlist extends React.Component{
    // constructor(props){
    //     super(props)
    // }
    componentDidMount(){
        console.log(this.props.path);
    }
    render(){
        const classes = styles;
        return(
            <div style={{color:"white", height:"100%",display: 'flex',alignItems: 'center',justifyContent: 'center',flexDirection:"column",}}>
                {this.props.path}
            </div>
        )
    }
}
export default Playlist;