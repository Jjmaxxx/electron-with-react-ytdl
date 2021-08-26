import React from "react";
const { ipcRenderer } = window.require("electron");

class App extends React.Component{ 
  constructor(props){
    super(props);
    this.linkSubmit = this.linkSubmit.bind(this);
    //this.state = {variable:'some value'}
  }
  linkSubmit = (event) => {
    event.preventDefault();
    console.log(event.target[0].value);
    ipcRenderer.send('sent-link', event.target[0].value);
    ipcRenderer.on('vid-info', (event, arg) => {
      console.log(arg);
    })
  }
  render(){
    //console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
    // ipcRenderer.send('asynchronous-message', 'ping');
    return (
      <div className="App">
       <form id="youtubeForm" onSubmit={this.linkSubmit}>
         <label htmlFor="youtubeForm">Insert youtube url:</label>
         <input type="text" id="url"/>
         <select id = "mp4ormp3" style = {{display: "none"}}>
            <option value = "mp3">mp3</option>
            <option value = "mp4">mp4</option>
         </select> 
         <select name="quality" id="quality" style = {{display: "none"}}>
  
         </select>
         <button type="submit">Submit</button>
       </form>
       <div id = "afterGetInfo" style = {{display: "none"}} >
          <label htmlFor="inputName">Input Name:</label>
          <input type ="text" id = "name" name = "inputName"/>
          <br></br>
          <button id="doneButton">Done</button>
        </div>
        <audio style = {{display: "none"}} id = "audioContainer" controls>
          <source id = "audio" src="myaudio.mp3" type="audio/mp3"/>
        </audio>
        <video style = {{display: "none"}} id = "videoContainer" width="400px" controls>
          <source id = "video" src="myvideo.mp4" type="video/mp4"/>
        </video>
        <p id= "songPlaying"></p>
      </div>
    );
  }
}
// let youtubeForm, video, videoContainer,afterGetInfo, songPlaying, audio, audioContainer, main, source; 
// main = document.getElementById("App");
// console.log(main);
// source = document.createElement("source");
// youtubeForm = document.getElementById("youtubeForm");
// // youtubeForm.addEventListener("submit",createReadableStream);
// videoContainer = document.getElementById("videoContainer");
// //videoContainer.appendChild(source);
// video = document.getElementById("video");
// audio = document.getElementById("audio");
// audioContainer = document.getElementById("audioContainer");
// //audioContainer.appendChild(source);
// afterGetInfo = document.getElementById("afterGetInfo");
// songPlaying = document.getElementById("songPlaying");

export default App;

