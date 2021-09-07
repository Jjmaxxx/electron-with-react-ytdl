import React from "react";
//import ReactDOM from 'react-dom';
// import VideoText from './videoText.js';
import helperFunctions from './utils/helperFunctions.js';
import styles from './utils/styles.js';
import { Button, Drawer } from "@material-ui/core";
//import ResizeableInput from './ResizeableInput.js';
//import { NativeSelect, MenuList, MenuItem } from '@material-ui/core';
const { ipcRenderer } = window.require("electron");
let qualities,link;
export let windowDimensions;
let selections = new Map();
class App extends React.Component{ 
  constructor(props){
    super(props);
    this.linkSubmit = this.linkSubmit.bind(this);
    this.changeOption = this.changeOption.bind(this);
    this.download = this.download.bind(this);
    this.getName = this.getName.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state = {width:window.innerWidth, height:window.innerHeight,linkSubmitted:false, fileName:"", fileType:"mp3"};
    //this.state = {variable:'some value'}
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    windowDimensions = {width: window.innerWidth, height: window.innerHeight}
  }
  linkSubmit = (event) => {
    event.preventDefault();
    link=event.target[0].value;
    ipcRenderer.send('sent-link', link);
    ipcRenderer.on('vid-info', (event, vid) => {
      this.setState({fileName:vid.name});
      qualities = vid.qualityList;
      selections.set("quality", vid.qualityList[0].value);
      selections.set("mp3ormp4", "mp3");
      this.setState({linkSubmitted:true});
    })
  }
  changeOption= (event,args)=>{
    selections.set(args,event.target.value);
    if(args === "mp3ormp4"){
      this.setState({fileType:event.target.value});
    }
  }
  getName=(event)=>{
    this.setState({fileName:event.target.value});
  }
  download=()=>{
    ipcRenderer.send('download', {fileType:selections.get('mp3ormp4'), name: this.state.fileName, url: link, quality:selections.get('quality')});
    console.log(selections.get('quality'));
    console.log(selections.get('mp3ormp4'));
  }
  render(){
    const classes = styles;
    return (
      //App
      <div className="App" style={{height:"90vh"}}>
        <div style= {classes.root}>
          <Drawer 
            style = {classes.drawer}
            variant = "permanent" anchor="left"
          >
            <div style={{width:"180px"}}>
              <p style = {classes.drawerTabs}>youtube download</p>
              <p style = {classes.drawerTabs}>downloads</p>
            </div>
          </Drawer>
          <Drawer variant = "permanent" anchor="bottom">
            <div style={{height:"100px"}}>
              <p>filler text</p>
            </div>
          </Drawer>
        </div>
      <div style={classes.content}>
        <div style={{marginLeft:"180px"}}>
        <form onSubmit={this.linkSubmit}>
          <label htmlFor="youtubeForm">Insert youtube url:</label>
          <input type="text"/>
          <button type="submit">Submit</button>
        </form>
          {(()=>{
            if(this.state.linkSubmitted === true ){
              return(
                <div>
                  <input type= "text" value={this.state.fileName} onChange = {this.getName}/>
                  <br/>
                  <select onChange= {(e)=>{this.changeOption(e,"mp3ormp4")}}>
                    {helperFunctions.setOptions([{name:"mp3",value:"mp3"},{name:"mp4",value:"mp4"}])}
                  </select>  
                  {this.state.fileType==="mp4" &&
                    <select onChange= {(e)=>{this.changeOption(e,"quality")}}>
                      {helperFunctions.setOptions(qualities)}
                    </select>  
                  }
                  {/* <Dropdown options={[]}/>
                  <Dropdown options={qualities}/> */}
                  <br/>
                  <button onClick={this.download}>Done</button>
                </div>
              )
            }
          })()}      
        </div> 
        </div>

      </div>
    );
  }
}
export default App;

