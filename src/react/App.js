import React from "react";
//import ReactDOM from 'react-dom';
import VideoText from './videoText.js';
import helperFunctions from './utils/helperFunctions.js';
import { Button } from "@material-ui/core";
//import { NativeSelect, MenuList, MenuItem } from '@material-ui/core';
const { ipcRenderer } = window.require("electron");
let vidTitle = "";
let qualities,link,name;
let selections = new Map();
class App extends React.Component{ 
  constructor(props){
    super(props);
    this.linkSubmit = this.linkSubmit.bind(this);
    this.changeOption = this.changeOption.bind(this);
    this.download = this.download.bind(this);
    this.state = {linkSubmitted:false, fileType:"mp3"};
    //this.state = {variable:'some value'}
  }
  linkSubmit = (event) => {
    event.preventDefault();
    console.log(event.target[0].value);
    ipcRenderer.send('sent-link', event.target[0].value);
    ipcRenderer.on('vid-info', (event, vid) => {
      vidTitle = vid.name;
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
  download=()=>{
    ipcRenderer.send('download', {fileType:selections.get('mp3ormp4'),quality:selections.get('quality')});
    console.log(selections.get('quality'));
    console.log(selections.get('mp3ormp4'));
  }
  render(){
    return (
      <div className="App">
       <form onSubmit={this.linkSubmit}>
         <label htmlFor="youtubeForm">Insert youtube url:</label>
         <input type="text"/>
         <button type="submit">Submit</button>
       </form>
        {(()=>{
          if(this.state.linkSubmitted === true ){
            return(
              <div>
                <VideoText text={vidTitle}/>
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
                <button onClick={this.download}>Done</button>
              </div>
            )
          }
        })()}       

      </div>
    );
  }
}
export default App;

