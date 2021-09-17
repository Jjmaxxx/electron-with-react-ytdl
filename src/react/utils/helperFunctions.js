const helperFunctions = {
  setOptions:function(options){
    let optionsList = [];
    for(let i=0; i<options.length;i++){
      optionsList.push(<option key ={i} value={options[i].value}>{options[i].name}</option>)
    }
    return optionsList;
  },
  getFancyTime:function(seconds){
    if(((seconds - (Math.floor(seconds/60) *60)) < 10 && seconds <60)){
      return Math.floor(seconds/60)+ ":0" +Math.floor(seconds)
    }else if(Math.floor(seconds) < 60){
      return Math.floor(seconds/60)+ ":" +Math.floor(seconds)
    }
    else if((seconds - (Math.floor(seconds/60) *60)) < 10 && seconds >59){
      return Math.floor(seconds/60)+ ":0" +Math.floor(seconds- Math.floor(seconds/60) * 60)
    }else{
      return Math.floor(seconds/60)+ ":" +Math.floor(seconds - Math.floor(seconds/60) * 60)
    }
  }
}
export default helperFunctions;